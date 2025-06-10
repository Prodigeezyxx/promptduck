
export class GeminiErrorHandler {
  static isQuotaError(error: any): boolean {
    return error?.status === 429 || 
           error?.message?.includes('quota') || 
           error?.message?.includes('RESOURCE_EXHAUSTED');
  }

  static isRetryableError(error: any): boolean {
    return this.isQuotaError(error) || 
           error?.status === 503 || 
           error?.message?.includes('temporarily unavailable');
  }

  static async retryWithBackoff<T>(fn: () => Promise<T>, maxRetries: number): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries - 1 || !this.isRetryableError(error)) {
          throw error;
        }
        
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Max retries exceeded');
  }
}
