/**
 * CacheStorage - Sistema de persistência em cache com TTL inteligente
 * Gerencia automaticamente expiração de dados e detecta indisponibilidade de storage
 */

import { CACHE_DURATIONS, STORAGE_KEYS } from '@domain/constants/TournamentConfiguration';
import { translateErrorToException } from '@domain/exceptions/TournamentException';

interface CacheEnvelope<T> {
  payload: T;
  enrolledAt: number;
  expirationThreshold: number;
}

const assembleStorageKey = (key: string): string => `${STORAGE_KEYS.cacheNamespace}${key}`;

/**
 * Detecta se localStorage está disponível e acessível
 * Alguns navegadores bloqueiam localStorage em modo privado
 */
export const detectStorageCapability = (): boolean => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    const probeIdentifier = `${STORAGE_KEYS.cacheNamespace}probe`;
    window.localStorage.setItem(probeIdentifier, '1');
    window.localStorage.removeItem(probeIdentifier);
    return true;
  } catch {
    // localStorage bloqueado ou indisponível
    return false;
  }
};

/**
 * Armazena valor em cache com TTL automático
 * Ignora silenciosamente se storage não estiver disponível
 */
export const encodeCacheEntry = <T>(
  key: string,
  value: T,
  ttlMilliseconds = CACHE_DURATIONS.mediumTerm
): void => {
  if (!detectStorageCapability()) {
    return;
  }

  const envelope: CacheEnvelope<T> = {
    payload: value,
    enrolledAt: Date.now(),
    expirationThreshold: Date.now() + Math.max(ttlMilliseconds, 1)
  };

  try {
    window.localStorage.setItem(assembleStorageKey(key), JSON.stringify(envelope));
  } catch (error) {
    console.warn(
      translateErrorToException(error, 'Falha ao persistir dados em cache').message
    );
  }
};

/**
 * Recupera valor do cache se ainda estiver válido
 * Retorna null se expirado ou não encontrado
 */
export const retrieveCachedEntry = <T>(key: string): T | null => {
  if (!detectStorageCapability()) {
    return null;
  }

  const rawCacheData = window.localStorage.getItem(assembleStorageKey(key));
  if (!rawCacheData) {
    return null;
  }

  try {
    const envelope = JSON.parse(rawCacheData) as CacheEnvelope<T>;

    if (envelope.expirationThreshold <= Date.now()) {
      window.localStorage.removeItem(assembleStorageKey(key));
      return null;
    }

    return envelope.payload;
  } catch {
    // Dados corrompidos no cache
    window.localStorage.removeItem(assembleStorageKey(key));
    return null;
  }
};

/**
 * Verifica se existe entrada válida em cache
 */
export const cacheContainsValidEntry = (key: string): boolean => retrieveCachedEntry(key) !== null;

/**
 * Remove entrada específica do cache
 */
export const invalidateCacheEntry = (key: string): void => {
  if (!detectStorageCapability()) {
    return;
  }

  window.localStorage.removeItem(assembleStorageKey(key));
};

/**
 * Remove todas as entradas expiradas do cache
 * Útil para limpeza de espaço periodicamente
 */
export const purgeExpiredCacheEntries = (): void => {
  if (!detectStorageCapability()) {
    return;
  }

  const expiredStorageKeys: string[] = [];
  const now = Date.now();

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const storageKey = window.localStorage.key(index);

    if (!storageKey || !storageKey.startsWith(STORAGE_KEYS.cacheNamespace)) {
      continue;
    }

    const rawCacheData = window.localStorage.getItem(storageKey);
    if (!rawCacheData) {
      expiredStorageKeys.push(storageKey);
      continue;
    }

    try {
      const envelope = JSON.parse(rawCacheData) as CacheEnvelope<unknown>;
      if (envelope.expirationThreshold <= now) {
        expiredStorageKeys.push(storageKey);
      }
    } catch {
      // Dados corrompidos - remove
      expiredStorageKeys.push(storageKey);
    }
  }

  expiredStorageKeys.forEach((storageKey) => window.localStorage.removeItem(storageKey));
};

/**
 * Limpa completamente o namespace de cache
 * Útil para logout ou reset da aplicação
 */
export const purgeNamespacedCacheEntries = (): void => {
  if (!detectStorageCapability()) {
    return;
  }

  const namespacedStorageKeys: string[] = [];

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const storageKey = window.localStorage.key(index);
    if (storageKey?.startsWith(STORAGE_KEYS.cacheNamespace)) {
      namespacedStorageKeys.push(storageKey);
    }
  }

  namespacedStorageKeys.forEach((storageKey) => window.localStorage.removeItem(storageKey));
};

// Legacy exports para compatibilidade
export const isStorageAvailable = detectStorageCapability;
export const setCacheItem = encodeCacheEntry;
export const getCacheItem = retrieveCachedEntry;
export const hasFreshCache = cacheContainsValidEntry;
export const removeCacheItem = invalidateCacheEntry;
export const clearExpiredCache = purgeExpiredCacheEntries;
export const clearNamespaceCache = purgeNamespacedCacheEntries;
