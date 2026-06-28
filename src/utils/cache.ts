import { CACHE_DURATIONS, STORAGE_KEYS } from '@constants/index';
import { normalizeError } from '@utils/errors';

interface CacheEnvelope<T> {
  value: T;
  createdAt: number;
  expiresAt: number;
}

const buildKey = (key: string): string => `${STORAGE_KEYS.cacheNamespace}${key}`;

export const isStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    const probeKey = `${STORAGE_KEYS.cacheNamespace}probe`;
    window.localStorage.setItem(probeKey, '1');
    window.localStorage.removeItem(probeKey);
    return true;
  } catch {
    return false;
  }
};

export const setCacheItem = <T>(key: string, value: T, ttlMs = CACHE_DURATIONS.medium): void => {
  if (!isStorageAvailable()) {
    return;
  }

  const envelope: CacheEnvelope<T> = {
    value,
    createdAt: Date.now(),
    expiresAt: Date.now() + Math.max(ttlMs, 1)
  };

  try {
    window.localStorage.setItem(buildKey(key), JSON.stringify(envelope));
  } catch (error) {
    console.warn(normalizeError(error, 'No se ha podido guardar la cache').message);
  }
};

export const getCacheItem = <T>(key: string): T | null => {
  if (!isStorageAvailable()) {
    return null;
  }

  const rawValue = window.localStorage.getItem(buildKey(key));
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as CacheEnvelope<T>;

    if (parsed.expiresAt <= Date.now()) {
      window.localStorage.removeItem(buildKey(key));
      return null;
    }

    return parsed.value;
  } catch {
    window.localStorage.removeItem(buildKey(key));
    return null;
  }
};

export const hasFreshCache = (key: string): boolean => getCacheItem(key) !== null;

export const removeCacheItem = (key: string): void => {
  if (!isStorageAvailable()) {
    return;
  }

  window.localStorage.removeItem(buildKey(key));
};

export const clearExpiredCache = (): void => {
  if (!isStorageAvailable()) {
    return;
  }

  const expiredKeys: string[] = [];

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const storageKey = window.localStorage.key(index);

    if (!storageKey || !storageKey.startsWith(STORAGE_KEYS.cacheNamespace)) {
      continue;
    }

    const rawValue = window.localStorage.getItem(storageKey);
    if (!rawValue) {
      expiredKeys.push(storageKey);
      continue;
    }

    try {
      const parsed = JSON.parse(rawValue) as CacheEnvelope<unknown>;
      if (parsed.expiresAt <= Date.now()) {
        expiredKeys.push(storageKey);
      }
    } catch {
      expiredKeys.push(storageKey);
    }
  }

  expiredKeys.forEach((storageKey) => window.localStorage.removeItem(storageKey));
};

export const clearNamespaceCache = (): void => {
  if (!isStorageAvailable()) {
    return;
  }

  const namespacedKeys: string[] = [];

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const storageKey = window.localStorage.key(index);
    if (storageKey?.startsWith(STORAGE_KEYS.cacheNamespace)) {
      namespacedKeys.push(storageKey);
    }
  }

  namespacedKeys.forEach((storageKey) => window.localStorage.removeItem(storageKey));
};
