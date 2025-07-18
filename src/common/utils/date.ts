/**
 * Utility functions for handling dates as timestamps (milliseconds)
 * InstantDB stores dates as timestamps, so all date values must be converted
 */

/**
 * Convert a Date or date string to timestamp (milliseconds)
 */
export function toTimestamp(date: Date | string | number): number {
  if (typeof date === 'number') {
    return date;
  }
  return new Date(date).getTime();
}

/**
 * Convert a timestamp to Date object
 */
export function fromTimestamp(timestamp: number): Date {
  return new Date(timestamp);
}

/**
 * Format a timestamp for display
 */
export function formatTimestamp(timestamp: number, options?: Intl.DateTimeFormatOptions): string {
  return new Date(timestamp).toLocaleDateString(undefined, options);
}

/**
 * Format a timestamp as date and time
 */
export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

/**
 * Format a timestamp as relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  }
  if (hours > 0) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  }
  if (minutes > 0) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  }
  return 'Just now';
}

/**
 * Get current timestamp
 */
export function getCurrentTimestamp(): number {
  return Date.now();
}

/**
 * Convert date input value (from HTML date input) to timestamp
 */
export function dateInputToTimestamp(dateString: string): number {
  return new Date(dateString).getTime();
}

/**
 * Convert timestamp to date input value (for HTML date input)
 */
export function timestampToDateInput(timestamp: number): string {
  return new Date(timestamp).toISOString().split('T')[0];
}

/**
 * Check if a timestamp is valid
 */
export function isValidTimestamp(timestamp: number): boolean {
  return !isNaN(timestamp) && timestamp > 0;
}