/**
 * Currency formatting utility
 * Defaults to INR (Indian Rupees) but can read from platform_config
 */

type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP'

let defaultCurrency: CurrencyCode = 'INR'

/**
 * Set default currency (typically from platform_config)
 */
export function setDefaultCurrency(currency: CurrencyCode) {
  defaultCurrency = currency
}

/**
 * Get default currency
 */
export function getDefaultCurrency(): CurrencyCode {
  return defaultCurrency
}

/**
 * Format amount as currency
 * @param amount - Amount in smallest currency unit (paise for INR, cents for USD)
 * @param currency - Currency code (defaults to INR)
 * @param showSymbol - Whether to show currency symbol (default: true)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency?: CurrencyCode,
  showSymbol: boolean = true
): string {
  const currencyCode = currency || defaultCurrency
  
  // Convert from smallest unit to main unit
  const divisor = currencyCode === 'INR' ? 100 : 100
  const mainAmount = amount / divisor

  const localeMap: Record<CurrencyCode, string> = {
    INR: 'en-IN',
    USD: 'en-US',
    EUR: 'en-GB',
    GBP: 'en-GB',
  }

  const options: Intl.NumberFormatOptions = {
    style: showSymbol ? 'currency' : 'decimal',
    currency: currencyCode,
    minimumFractionDigits: currencyCode === 'INR' ? 0 : 2,
    maximumFractionDigits: currencyCode === 'INR' ? 0 : 2,
  }

  try {
    return new Intl.NumberFormat(localeMap[currencyCode], options).format(mainAmount)
  } catch (error) {
    // Fallback formatting
    if (currencyCode === 'INR') {
      return showSymbol ? `₹${mainAmount.toLocaleString('en-IN')}` : mainAmount.toLocaleString('en-IN')
    }
    return showSymbol ? `${currencyCode} ${mainAmount.toFixed(2)}` : mainAmount.toFixed(2)
  }
}

/**
 * Format amount as currency (shorthand)
 */
export function formatINR(amount: number, showSymbol: boolean = true): string {
  return formatCurrency(amount, 'INR', showSymbol)
}
