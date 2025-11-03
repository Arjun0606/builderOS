/**
 * Production-ready retry logic with exponential backoff
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableErrors?: RegExp[];
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  retryableErrors: [
    /ECONNRESET/,
    /ETIMEDOUT/,
    /ENOTFOUND/,
    /EAI_AGAIN/,
    /rate.?limit/i,
    /429/,
    /502/,
    /503/,
    /504/,
  ],
};

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error;
  let delay = opts.initialDelay;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry if not a retryable error
      const isRetryable = opts.retryableErrors.some((pattern) =>
        pattern.test(error.message || error.toString())
      );

      if (!isRetryable || attempt === opts.maxAttempts) {
        throw error;
      }

      // Wait before retry (exponential backoff)
      await sleep(delay);
      delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelay);
    }
  }

  throw lastError!;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

