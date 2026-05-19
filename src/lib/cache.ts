const DEFAULT_TTL_MS = 600_000;

type CacheRecord<T> = {
  value: T;
  expiresAt: number;
};

export class MemoryCache {
  // Map of cached values
  private readonly entries = new Map<string, CacheRecord<unknown>>();
  // Map of in-flight promises
  private readonly inflight = new Map<string, Promise<unknown>>();

  get<T>(key: string): T | undefined {
    const record = this.entries.get(key);
    if (!record) {
      return undefined;
    }

    const isEntryExpired = Date.now() >= record.expiresAt;

    if (isEntryExpired) {
      this.entries.delete(key);
      return undefined;
    }
    return record.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number = DEFAULT_TTL_MS): void {
    this.entries.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): boolean {
    return this.entries.delete(key);
  }

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlMs: number = DEFAULT_TTL_MS
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    // Check if there is an in-flight promise for this key
    const existing = this.inflight.get(key);
    if (existing) {
      return existing as Promise<T>;
    }

    const promise = new Promise<T>((resolve, reject) => {
      queueMicrotask(() => {
        void (async () => {
          try {
            const value = await factory();
            this.set(key, value, ttlMs);
            resolve(value);
          } catch (error) {
            reject(error);
          } finally {
            this.inflight.delete(key);
          }
        })();
      });
    });

    this.inflight.set(key, promise);
    return promise;
  }

  clear(): void {
    this.entries.clear();
    this.inflight.clear();
  }
}

const globalForCache = globalThis as unknown as {
  memoryCache: MemoryCache | undefined;
};

export const cache = globalForCache.memoryCache ?? new MemoryCache();

if (process.env.NODE_ENV !== "production") {
  globalForCache.memoryCache = cache;
}

export const CACHE_TTL_MS = DEFAULT_TTL_MS;
export const CACHE_TTL_SECONDS = 600;
