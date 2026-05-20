const DEFAULT_TTL_MS = 600_000;

type CacheRecord<T> = {
  value: T;
  expiresAt: number;
};

export class MemoryCache {
  private readonly entries = new Map<string, CacheRecord<unknown>>();
  private readonly inflight = new Map<string, Promise<unknown>>();

  get<T>(key: string): T | undefined {
    const record = this.entries.get(key);
    if (!record || !this.isFresh(record)) {
      return undefined;
    }
    return record.value as T;
  }

  peek<T>(key: string): T | undefined {
    const record = this.entries.get(key);
    return record ? (record.value as T) : undefined;
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
    const record = this.entries.get(key);

    if (record) {
      const value = record.value as T;

      if (!this.isFresh(record)) {
        this.revalidateInBackground(key, factory, ttlMs);
      }

      return value;
    }

    return this.fetchAndStore(key, factory, ttlMs);
  }

  clear(): void {
    this.entries.clear();
    this.inflight.clear();
  }

  private isFresh(record: CacheRecord<unknown>): boolean {
    return Date.now() < record.expiresAt;
  }

  private revalidateInBackground<T>(
    key: string,
    factory: () => Promise<T>,
    ttlMs: number
  ): void {
    if (this.inflight.has(key)) {
      return;
    }

    const promise = this.runFactory(key, factory, ttlMs)
      .catch(() => {
        // Keep serving stale entry when background refresh fails.
      })
      .finally(() => {
        this.inflight.delete(key);
      });

    this.inflight.set(key, promise);
  }

  private async fetchAndStore<T>(
    key: string,
    factory: () => Promise<T>,
    ttlMs: number
  ): Promise<T> {
    const existing = this.inflight.get(key);
    if (existing) {
      return existing as Promise<T>;
    }

    const promise = this.runFactory(key, factory, ttlMs).finally(() => {
      this.inflight.delete(key);
    });

    this.inflight.set(key, promise);
    return promise;
  }

  private async runFactory<T>(
    key: string,
    factory: () => Promise<T>,
    ttlMs: number
  ): Promise<T> {
    const value = await factory();
    this.set(key, value, ttlMs);
    return value;
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
