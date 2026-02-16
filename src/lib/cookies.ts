/**
 * Cookie utilities for client-side cookie management
 * Provides a simple API to get, set, and remove cookies
 */

interface CookieOptions {
  expires?: number | Date // Days or Date object
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const nameEQ = name + '='
  const ca = document.cookie.split(';')

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }

  return null
}

/**
 * Set a cookie
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === 'undefined') return

  let expires = ''

  if (options.expires) {
    let date: Date
    if (typeof options.expires === 'number') {
      date = new Date()
      date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000)
    } else {
      date = options.expires
    }
    expires = '; expires=' + date.toUTCString()
  }

  const path = options.path ? `; path=${options.path}` : '; path=/'
  const domain = options.domain ? `; domain=${options.domain}` : ''
  const secure = options.secure ? '; secure' : ''
  const sameSite = options.sameSite ? `; samesite=${options.sameSite}` : '; samesite=lax'

  document.cookie = name + '=' + (value || '') + expires + path + domain + secure + sameSite
}

/**
 * Remove a cookie
 */
export function removeCookie(
  name: string,
  options: Pick<CookieOptions, 'path' | 'domain'> = {},
): void {
  setCookie(name, '', {
    ...options,
    expires: -1,
  })
}

/**
 * Check if a cookie exists
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null
}

/**
 * Get all cookies as an object
 * Note: This only works on the client-side
 */
export function getAllCookies(): Record<string, string> {
  if (typeof document === 'undefined') return {}
  const cookies: Record<string, string> = {}
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    const eqPos = c.indexOf('=')
    if (eqPos > -1) {
      const name = c.substring(0, eqPos)
      const value = c.substring(eqPos + 1)
      cookies[name] = value
    }
  }
  return cookies
}

/**
 * getCookie, setCookie, removeCookie, hasCookie, getAllCookies
 */
export const cookies = {
  get: getCookie,
  set: setCookie,
  remove: removeCookie,
  has: hasCookie,
  getAll: getAllCookies,
}
