/**
 * useRemoteDataFetcher - Hook para busca remota com cache inteligente
 * Implementa cache com TTL, stale-while-revalidate e callbacks de sucesso/erro
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { purgeExpiredCacheEntries, retrieveCachedEntry, encodeCacheEntry } from '@domain/storage/CacheStorage';
import { translateErrorForDisplay, translateErrorToException } from '@domain/exceptions/TournamentException';

interface RemoteDataFetcherConfiguration<T> {
  enabled?: boolean;
  cacheKey?: string;
  cacheTtl?: number;
  dependencies?: ReadonlyArray<unknown>;
  initialData?: T;
  staleWhileRevalidate?: boolean;
  onSuccess?: (loadedData: T) => void;
  onFailure?: (errorMessage: string) => void;
}

interface RemoteDataFetcherResult<T> {
  payload: T | undefined;
  failureReason: string | null;
  isInitializing: boolean;
  isRefetchingInBackground: boolean;
  consumedFromCache: boolean;
  triggerRefetch: (options?: { ignoreCache?: boolean }) => Promise<void>;
}

/**
 * Hook para busca e cache de dados remotos
 * Suporta stale-while-revalidate para melhor UX
 */
export const useRemoteDataFetcher = <T>(
  resourceIdentifier: string,
  fetchingFunction: () => Promise<T>,
  configuration: RemoteDataFetcherConfiguration<T> = {}
): RemoteDataFetcherResult<T> => {
  const {
    enabled = true,
    cacheKey = resourceIdentifier,
    cacheTtl = 0,
    dependencies = [],
    initialData,
    staleWhileRevalidate = true,
    onSuccess,
    onFailure
  } = configuration;

  const fetchingFunctionRef = useRef(fetchingFunction);
  const onSuccessCallbackRef = useRef(onSuccess);
  const onFailureCallbackRef = useRef(onFailure);
  const [payload, setPayload] = useState<T | undefined>(initialData);
  const [failureReason, setFailureReason] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(enabled && initialData === undefined);
  const [isRefetchingInBackground, setIsRefetchingInBackground] = useState(false);
  const [consumedFromCache, setConsumedFromCache] = useState(false);

  useEffect(() => {
    fetchingFunctionRef.current = fetchingFunction;
    onSuccessCallbackRef.current = onSuccess;
    onFailureCallbackRef.current = onFailure;
  }, [fetchingFunction, onFailure, onSuccess]);

  const triggerRefetch = useCallback(
    async ({ ignoreCache = false }: { ignoreCache?: boolean } = {}) => {
      if (!enabled) {
        return;
      }

      purgeExpiredCacheEntries();

      if (!ignoreCache && cacheTtl > 0) {
        const cachedPayload = retrieveCachedEntry<T>(cacheKey);
        if (cachedPayload !== null) {
          setPayload(cachedPayload);
          setFailureReason(null);
          setConsumedFromCache(true);
          setIsInitializing(false);

          if (!staleWhileRevalidate) {
            return;
          }

          setIsRefetchingInBackground(true);
        } else {
          setIsInitializing(true);
        }
      } else {
        setIsInitializing(true);
      }

      try {
        const fetchedData = await fetchingFunctionRef.current();
        setPayload(fetchedData);
        setFailureReason(null);
        setConsumedFromCache(false);

        if (cacheTtl > 0) {
          encodeCacheEntry(cacheKey, fetchedData, cacheTtl);
        }

        onSuccessCallbackRef.current?.(fetchedData);
      } catch (acquisitionError) {
        const userFacingMessage = translateErrorForDisplay(
          translateErrorToException(acquisitionError)
        );
        setFailureReason(userFacingMessage);
        onFailureCallbackRef.current?.(userFacingMessage);
      } finally {
        setIsInitializing(false);
        setIsRefetchingInBackground(false);
      }
    },
    [cacheKey, cacheTtl, enabled, staleWhileRevalidate]
  );

  const dependencySerialization = useMemo(() => JSON.stringify(dependencies), [dependencies]);

  useEffect(() => {
    void triggerRefetch();
  }, [dependencySerialization, triggerRefetch]);

  return {
    payload,
    failureReason,
    isInitializing,
    isRefetchingInBackground,
    consumedFromCache,
    triggerRefetch
  };
};

// Type exports
export type { RemoteDataFetcherConfiguration, RemoteDataFetcherResult };
