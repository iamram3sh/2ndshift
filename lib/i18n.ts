/**
 * Simple i18n utility for 2ndShift
 * Loads translations from JSON files and provides a t() function
 */

import enTranslations from '@/i18n/en.json'

type TranslationKey = string
type TranslationParams = Record<string, string | number>

let currentLocale = 'en'
const translations: Record<string, any> = {
  en: enTranslations,
}

/**
 * Get translation for a key with optional parameter replacement
 * @param key - Translation key (e.g., "credits.title" or "credits.modal.header")
 * @param params - Optional parameters to replace placeholders (e.g., {amount: "100"})
 * @returns Translated string or array with placeholders replaced
 */
export function t(key: TranslationKey, params?: TranslationParams): string | string[] {
  const locale = currentLocale
  const localeTranslations = translations[locale] || translations.en

  // Navigate nested object using dot notation
  const keys = key.split('.')
  let value: any = localeTranslations

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      // Fallback to key if translation not found
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
  }

  // If value is an array, return it as-is (for bullets, etc.)
  if (Array.isArray(value)) {
    return value
  }

  // If value is still an object, return the key (shouldn't happen but handle gracefully)
  if (typeof value !== 'string') {
    console.warn(`Translation value is not a string or array for key: ${key}`)
    return key
  }

  // Replace placeholders like {amount} with actual values
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match: string, paramKey: string) => {
      return params[paramKey]?.toString() || match
    })
  }

  return value
}

/**
 * Set the current locale
 */
export function setLocale(locale: string) {
  currentLocale = locale
}

/**
 * Get the current locale
 */
export function getLocale(): string {
  return currentLocale
}

/**
 * React hook for translations (for client components)
 */
export function useTranslation() {
  return {
    t,
    locale: currentLocale,
    setLocale,
  }
}
