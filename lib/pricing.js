// Pricing utility for AstroVeda Connect
// Converts base INR rates to local currencies per minute

const CURRENCY_CONFIG = {
  USD: { symbol: '$', code: 'USD', locale: 'en-US' },
  INR: { symbol: '₹', code: 'INR', locale: 'en-IN' },
  GBP: { symbol: '£', code: 'GBP', locale: 'en-GB' },
  AED: { symbol: 'د.إ', code: 'AED', locale: 'ar-AE' },
};

// Conversion rates (INR to target currency)
const CONVERSION_RATES = {
  USD: 1 / 83.5, // 1 INR = 0.011976 USD
  INR: 1,
  GBP: 1 / 105, // approximate
  AED: 1 / 22.7, // approximate
};

// Default base rate (INR per minute)
const DEFAULT_BASE_INR_PER_MINUTE = 45;

/**
 * Convert base INR per minute to local currency per minute
 * @param {number} baseINR - Base price in INR per minute
 * @param {string} currency - Target currency code (USD, INR, GBP, AED)
 * @returns {number} Price per minute in target currency (rounded to 2 decimals)
 */
export function convertPerMinute(baseINR, currency) {
  const rate = CONVERSION_RATES[currency] || CONVERSION_RATES.INR;
  const converted = baseINR * rate;
  // Round to 2 decimal places
  return Math.round(converted * 100) / 100;
}

/**
 * Get formatted price per minute for a given currency
 * @param {number} baseINR - Base price in INR per minute
 * @param {string} currency - Target currency code
 * @returns {string} Formatted string (e.g., "$0.99/min")
 */
export function formatPerMinute(baseINR, currency) {
  const price = convertPerMinute(baseINR, currency);
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;
  const formatted = new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
  return `${formatted}/min`;
}

/**
 * Get pricing for all supported currencies (for display)
 * @param {number} baseINR - Base price in INR per minute
 * @returns {Object} Mapping of currency code to formatted price per minute
 */
export function getAllPrices(baseINR) {
  const result = {};
  Object.keys(CURRENCY_CONFIG).forEach(currency => {
    result[currency] = formatPerMinute(baseINR, currency);
  });
  return result;
}

/**
 * Get user's local price per minute (based on cookie)
 * @param {number} baseINR - Base price in INR per minute
 * @param {Object} context - Next.js context (optional)
 * @returns {string} Formatted price per minute in user's currency
 */
export function getUserPricePerMinute(baseINR, context = null) {
  // Determine user currency (simplified - you can integrate with your cookie logic)
  if (typeof window !== 'undefined') {
    const cookieMatch = document.cookie.match(/(?:^|;\s*)user-currency=([^;]*)/);
    const currency = cookieMatch ? cookieMatch[1] : 'USD';
    return formatPerMinute(baseINR, currency);
  }
  // Server-side: default to USD
  return formatPerMinute(baseINR, 'USD');
}