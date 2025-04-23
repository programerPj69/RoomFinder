/**
 * Check if code is running in a browser environment
 */
export const isBrowser = typeof window !== "undefined"

/**
 * Safely access localStorage, handling cases where it's not available
 * (server-side rendering, incognito mode, etc.)
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser) return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return null
    }
  },

  setItem: (key: string, value: string): boolean => {
    if (!isBrowser) return false
    try {
      localStorage.setItem(key, value)
      return true
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error)
      return false
    }
  },

  removeItem: (key: string): boolean => {
    if (!isBrowser) return false
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
      return false
    }
  },
}

/**
 * Safely execute a function only in the browser
 * @param fn Function to execute
 * @param fallback Optional fallback value to return on server
 */
export function onlyBrowser<T>(fn: () => T, fallback?: T): T | undefined {
  if (isBrowser) {
    return fn()
  }
  return fallback
}
