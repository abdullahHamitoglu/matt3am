'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Search, X, ClipboardList, UtensilsCrossed, MapPin, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { ordersService } from '@/services/orders.service'
import { tablesService } from '@/services/tables.service'
import { menuItemsService } from '@/services/menu-items.service'
import { useRestaurantSelection } from '@/hooks/restaurants'
import type { Order, Table, MenuItem } from '@/payload-types'

// ─── Types ──────────────────────────────────────────────────────
type ResultCategory = 'orders' | 'tables' | 'menuItems'

interface SearchResult {
  id: string
  title: string
  subtitle: string
  category: ResultCategory
  href: string
  icon: React.ReactNode
}

// ─── Status helpers ─────────────────────────────────────────────
const orderStatusStyle: Record<string, string> = {
  pending: 'text-amber-600',
  confirmed: 'text-blue-600',
  preparing: 'text-orange-500',
  ready: 'text-emerald-600',
  completed: 'text-slate-500',
  cancelled: 'text-red-500',
  delivering: 'text-indigo-500',
  served: 'text-teal-500',
}

const tableStatusStyle: Record<string, string> = {
  available: 'text-emerald-600',
  reserved: 'text-amber-600',
  occupied: 'text-red-500',
  cleaning: 'text-blue-500',
  unavailable: 'text-slate-400',
}

// ─── Component ──────────────────────────────────────────────────
export const DashboardSearch: React.FC = () => {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('dashboard')
  const { selectedRestaurant } = useRestaurantSelection()

  // ── Debounce ────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300)
    return () => clearTimeout(timer)
  }, [query])

  // ── Click-outside ───────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Keyboard shortcut (Ctrl+K) ─────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // ── Search queries ──────────────────────────────────────────
  const enabled = debouncedQuery.length >= 1 && !!selectedRestaurant

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['search-orders', debouncedQuery, selectedRestaurant],
    queryFn: () =>
      ordersService.list({
        where: {
          and: [
            { restaurant: { equals: selectedRestaurant } },
            {
              or: [
                { orderNumber: { contains: debouncedQuery } },
                { 'customer.name': { contains: debouncedQuery } },
                { 'customer.phone': { contains: debouncedQuery } },
              ],
            },
          ],
        },
        limit: 5,
        sort: '-createdAt',
        depth: 1,
      }),
    enabled,
    staleTime: 10_000,
  })

  const { data: tablesData, isLoading: tablesLoading } = useQuery({
    queryKey: ['search-tables', debouncedQuery, selectedRestaurant],
    queryFn: () =>
      tablesService.list({
        where: {
          and: [
            { restaurant: { equals: selectedRestaurant } },
            {
              or: [
                { tableNumber: { contains: debouncedQuery } },
                { zone: { contains: debouncedQuery } },
              ],
            },
          ],
        },
        limit: 5,
        depth: 0,
      }),
    enabled,
    staleTime: 10_000,
  })

  const { data: menuData, isLoading: menuLoading } = useQuery({
    queryKey: ['search-menu', debouncedQuery, selectedRestaurant],
    queryFn: () =>
      menuItemsService.list({
        where: {
          and: [
            { restaurant: { contains: selectedRestaurant } },
            { name: { contains: debouncedQuery } },
          ],
        },
        limit: 5,
        depth: 0,
      }),
    enabled,
    staleTime: 10_000,
  })

  const isSearching = ordersLoading || tablesLoading || menuLoading

  // ── Build results ───────────────────────────────────────────
  const buildResults = useCallback((): SearchResult[] => {
    const results: SearchResult[] = []

    // Orders
    ordersData?.docs?.forEach((order: Order) => {
      const customerName = order.customer?.name || ''
      results.push({
        id: order.id,
        title: `#${order.orderNumber || order.id.slice(0, 8)}`,
        subtitle: `${customerName} · ${t(order.status || 'pending')}`,
        category: 'orders',
        href: `/${locale}/dashboard/orders/${order.id}`,
        icon: (
          <ClipboardList
            size={16}
            className={orderStatusStyle[order.status || 'pending'] || 'text-slate-500'}
          />
        ),
      })
    })

    // Tables
    tablesData?.docs?.forEach((table: Table) => {
      results.push({
        id: table.id,
        title: `${t('table') || 'طاولة'} ${table.tableNumber}`,
        subtitle: `${t(table.zone) || table.zone} · ${t(table.status) || table.status}`,
        category: 'tables',
        href: `/${locale}/dashboard/tables`,
        icon: <MapPin size={16} className={tableStatusStyle[table.status] || 'text-slate-500'} />,
      })
    })

    // Menu Items
    menuData?.docs?.forEach((item: MenuItem) => {
      const category = typeof item.category === 'object' && item.category ? item.category.name : ''
      results.push({
        id: item.id,
        title: item.name,
        subtitle: `${category} · ${item.price}`,
        category: 'menuItems',
        href: `/${locale}/dashboard/menus`,
        icon: <UtensilsCrossed size={16} className="text-orange-500" />,
      })
    })

    return results
  }, [ordersData, tablesData, menuData, locale, t])

  const results = debouncedQuery.length >= 1 ? buildResults() : []

  // ── Keyboard navigation ─────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx((prev) => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === 'Enter' && selectedIdx >= 0 && results[selectedIdx]) {
      e.preventDefault()
      navigateTo(results[selectedIdx].href)
    }
  }

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIdx >= 0 && resultsRef.current) {
      const item = resultsRef.current.children[selectedIdx] as HTMLElement | undefined
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIdx])

  // Reset selection when results change
  useEffect(() => {
    setSelectedIdx(-1)
  }, [results.length])

  // ── Navigate ────────────────────────────────────────────────
  const navigateTo = (href: string) => {
    router.push(href)
    setQuery('')
    setIsOpen(false)
    inputRef.current?.blur()
  }

  // ── Category labels ─────────────────────────────────────────
  const categoryLabel: Record<ResultCategory, string> = {
    orders: t('orders') || 'الطلبات',
    tables: t('tables') || 'الطاولات',
    menuItems: t('menuItems') || 'القائمة',
  }

  // Group results by category
  const grouped = results.reduce<Record<ResultCategory, SearchResult[]>>(
    (acc, r) => {
      acc[r.category].push(r)
      return acc
    },
    { orders: [], tables: [], menuItems: [] },
  )

  const showDropdown = isOpen && debouncedQuery.length >= 1

  // ── Render ──────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative">
      {/* Desktop search bar */}
      <div className="hidden xl:flex items-center bg-white dark:bg-slate-800 shadow-sm px-4 py-2.5 border border-slate-100 focus-within:border-orange-400 dark:border-slate-700 dark:focus-within:border-orange-500 rounded-2xl focus-within:ring-2 focus-within:ring-orange-500/30 w-72 transition-all">
        {isSearching ? (
          <Loader2 size={16} className="ms-2 text-orange-500 animate-spin" />
        ) : (
          <Search size={16} className="me-2 text-slate-400 dark:text-slate-500" />
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={`${t('search') || 'بحث'}... (Ctrl+K)`}
          className="bg-transparent border-none outline-none w-full text-slate-600 dark:placeholder:text-slate-600 dark:text-slate-300 placeholder:text-slate-300 text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setDebouncedQuery('')
              inputRef.current?.focus()
            }}
            className="hover:bg-slate-100 dark:hover:bg-slate-700 p-0.5 rounded-full transition-colors"
          >
            <X size={14} className="text-slate-400" />
          </button>
        )}
      </div>

      {/* Mobile search button */}
      <button
        className="xl:hidden bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 shadow-sm p-2 md:p-3 border border-slate-100 dark:border-slate-700 rounded-xl md:rounded-2xl text-slate-600 dark:text-slate-400"
        onClick={() => {
          setIsOpen(!isOpen)
          setTimeout(() => inputRef.current?.focus(), 100)
        }}
      >
        <Search size={18} className="md:w-5 md:h-5" />
      </button>

      {/* Mobile search overlay */}
      {isOpen && (
        <div className="xl:hidden top-full z-50 absolute mt-2 w-[calc(100vw-2rem)] sm:w-80 end-0">
          <div className="flex items-center bg-white dark:bg-slate-800 shadow-lg px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-2xl focus-within:ring-2 focus-within:ring-orange-500/30 transition-all">
            {isSearching ? (
              <Loader2 size={16} className="ms-2 text-orange-500 animate-spin" />
            ) : (
              <Search size={16} className="ms-2 text-slate-400" />
            )}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`${t('search') || 'بحث'}...`}
              className="bg-transparent border-none outline-none w-full text-slate-600 dark:placeholder:text-slate-600 dark:text-slate-300 placeholder:text-slate-300 text-sm"
              autoFocus
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('')
                  setDebouncedQuery('')
                }}
                className="hover:bg-slate-100 dark:hover:bg-slate-700 p-0.5 rounded-full"
              >
                <X size={14} className="text-slate-400" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results dropdown */}
      {showDropdown && (
        <div className="top-full z-50 absolute mt-2 w-[calc(100vw-2rem)] sm:w-96 xl:w-[28rem] end-0 xl:start-auto xl:end-0">
          <div className="bg-white dark:bg-slate-800 shadow-2xl dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl ring-1 ring-black/5 max-h-[24rem] overflow-hidden overflow-y-auto">
            {results.length === 0 && !isSearching ? (
              <div className="p-8 text-center">
                <Search size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {t('noResults') || 'لا توجد نتائج'}
                </p>
                <p className="mt-1 text-slate-400 dark:text-slate-500 text-xs">
                  {t('tryDifferentSearch') || 'جرب كلمات بحث مختلفة'}
                </p>
              </div>
            ) : isSearching && results.length === 0 ? (
              <div className="flex justify-center items-center gap-2 p-6">
                <Loader2 size={18} className="text-orange-500 animate-spin" />
                <span className="text-slate-500 dark:text-slate-400 text-sm">
                  {t('searching') || 'جاري البحث...'}
                </span>
              </div>
            ) : (
              <div ref={resultsRef}>
                {(['orders', 'tables', 'menuItems'] as ResultCategory[]).map((cat) => {
                  if (grouped[cat].length === 0) return null
                  return (
                    <div key={cat}>
                      <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2 border-slate-100 dark:border-slate-700 border-b">
                        <span className="font-semibold text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          {categoryLabel[cat]}
                        </span>
                      </div>
                      {grouped[cat].map((result) => {
                        const globalIdx = results.indexOf(result)
                        return (
                          <button
                            key={result.id}
                            onClick={() => navigateTo(result.href)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-start transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0 ${
                              globalIdx === selectedIdx
                                ? 'bg-orange-50 dark:bg-orange-950/30'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                            }`}
                          >
                            <div
                              className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl ${
                                globalIdx === selectedIdx
                                  ? 'bg-orange-100 dark:bg-orange-900/40'
                                  : 'bg-slate-100 dark:bg-slate-700'
                              }`}
                            >
                              {result.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-800 dark:text-slate-100 text-sm truncate">
                                {result.title}
                              </p>
                              <p className="text-slate-400 dark:text-slate-500 text-xs truncate">
                                {result.subtitle}
                              </p>
                            </div>
                            {globalIdx === selectedIdx && (
                              <kbd className="flex-shrink-0 bg-orange-100 dark:bg-orange-900/40 px-1.5 py-0.5 rounded font-mono text-[10px] text-orange-600 dark:text-orange-400">
                                ↵
                              </kbd>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Footer */}
            {results.length > 0 && (
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 px-4 py-2 border-slate-100 dark:border-slate-700 border-t">
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {results.length} {t('results') || 'نتيجة'}
                </span>
                <div className="flex items-center gap-1">
                  <kbd className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-500">
                    ↑↓
                  </kbd>
                  <span className="text-[10px] text-slate-400">{t('navigate') || 'تنقل'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
