'use client'
import React from 'react'
import { ChevronDownIcon } from '../icons/sidebar/chevron-down-icon'
import { Accordion, AccordionItem } from '@heroui/react'
import clsx from 'clsx'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  icon: React.ReactNode
  title: string
  items: { name: string; href: string }[]
}

export const CollapseItems = ({ icon, items, title }: Props) => {
  const pathname = usePathname()
  const key = `collapse-${title.replace(/\s+/g, '-').toLowerCase()}`

  // Check if any child item is active
  const isAnyChildActive = items.some((item) => pathname === item.href)

  return (
    <div className="flex items-center gap-4 h-full cursor-pointer">
      <Accordion className="px-0" defaultExpandedKeys={isAnyChildActive ? [key] : []}>
        <AccordionItem
          indicator={<ChevronDownIcon />}
          classNames={{
            indicator: 'data-[open=true]:-rotate-180',
            trigger:
              'py-0 min-h-[44px] hover:bg-default-100 dark:hover:bg-default-50/10 rounded-xl active:scale-[0.98] transition-transform px-3.5',

            title: 'px-0 flex text-base gap-2 h-full items-center cursor-pointer text-default-900',
          }}
          aria-label="Accordion 1"
          title={
            <div className="flex flex-row gap-2">
              <span>{icon}</span>
              <span>{title}</span>
            </div>
          }
          key={key}
        >
          <div className="flex flex-col gap-2 pl-12">
            {items.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <NextLink
                  key={index}
                  href={item.href}
                  className={clsx(
                    'flex px-2 py-1.5 rounded-lg w-full transition-colors',
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                      : 'text-default-500 dark:text-default-400 hover:text-default-900 dark:hover:text-default-100 hover:bg-default-100 dark:hover:bg-default-50/10',
                  )}
                >
                  {item.name}
                </NextLink>
              )
            })}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
