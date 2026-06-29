// Re-export from new domain location for backwards compatibility
export {
  detectStorageCapability,
  encodeCacheEntry,
  retrieveCachedEntry,
  cacheContainsValidEntry,
  invalidateCacheEntry,
  purgeExpiredCacheEntries,
  purgeNamespacedCacheEntries,
  // Legacy names
  isStorageAvailable,
  setCacheItem,
  getCacheItem,
  hasFreshCache,
  removeCacheItem,
  clearExpiredCache,
  clearNamespaceCache
} from '@domain/storage/CacheStorage';
