/**
 * Format a number as currency with the specified currency code
 * @param amount - The amount to format
 * @param currency - The currency code (default: EUR)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: string | number, currency: string = 'EUR'): string => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(numericAmount);
  };
  
  /**
   * Format a date object into a readable date string
   * @param date - The date to format
   * @returns Formatted date string
   */
  export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };