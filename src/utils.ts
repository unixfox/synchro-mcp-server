import axios from 'axios';

/**
 * Standard error handling for API errors
 * Extracts the most useful error message from Axios errors
 */
export function formatError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as any)?.message || error.message;
  }
  return (error as Error).message;
} 