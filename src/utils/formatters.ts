/**
 * Formats a currency value with the appropriate currency symbol
 * @param value The value to format as a string
 * @param currency The currency code (e.g., 'EUR', 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(value: string, currency: string): string {
  const numValue = parseFloat(value);
  
  // Check if the value is NaN
  if (isNaN(numValue)) {
    return '0.00';
  }

  // Format based on currency
  switch (currency) {
    case 'EUR':
      return `€${numValue.toFixed(2)}`;
    case 'USD':
      return `$${numValue.toFixed(2)}`;
    case 'GBP':
      return `£${numValue.toFixed(2)}`;
    default:
      return `${numValue.toFixed(2)} ${currency}`;
  }
}

/**
 * Formats a date to a readable string
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Truncates text to a specified length with ellipsis
 * @param text The text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text string
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}