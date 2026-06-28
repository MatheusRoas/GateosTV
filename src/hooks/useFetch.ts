import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { clearExpiredCache, getCacheItem, setCacheItem } from '@utils/cache';
import { getUserFacingErrorMessage, normalizeError } from '@utils/errors';

interface UseFetchOptions<T> {
  enabled?: boolean;
  cacheKey?: string;
  cacheTtl?: number;
  dependencies?: ReadonlyArray<unknown>;
  initialData?: T;
  staleWhileRevalidate?: boolean;
  onSuccess?: (value: T) => void;
  onError?: (message: string) => void;
}

interface UseFetchResult<T> {
  data: T | undefined;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  fromCache: boolean;
  refetch: (options?: { bypassCache?: boolean }) => Promise<void>;
}

export const useFetch = <T>(
  queryKey: string,
  fetcher: () => Promise<T>,
  options: UseFetchOptions<T> = {}
): UseFetchResult<T> => {
  const {
    enabled = true,
    cacheKey = queryKey,
    cacheTtl = 0,
    dependencies = [],
    initialData,
    staleWhileRevalidate = true,
    onSuccess,
    onError
  } = options;

  const fetcherRef = useRef(fetcher);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled && initialData === undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    fetcherRef.current = fetcher;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [fetcher, onError, onSuccess]);

  const execute = useCallback(
    async ({ bypassCache = false }: { bypassCache?: boolean } = {}) => {
      if (!enabled) {
        return;
      }

      clearExpiredCache();

      if (!bypassCache && cacheTtl > 0) {
        const cachedValue = getCacheItem<T>(cacheKey);
        if (cachedValue !== null) {
          setData(cachedValue);
          setError(null);
          setFromCache(true);
          setIsLoading(false);

          if (!staleWhileRevalidate) {
            return;
          }

          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
      } else {
        setIsLoading(true);
      }

      try {
        const result = await fetcherRef.current();
        setData(result);
        setError(null);
        setFromCache(false);

        if (cacheTtl > 0) {
          setCacheItem(cacheKey, result, cacheTtl);
        }

        onSuccessRef.current?.(result);
      } catch (fetchError) {
        const message = getUserFacingErrorMessage(normalizeError(fetchError));
        setError(message);
        onErrorRef.current?.(message);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [cacheKey, cacheTtl, enabled, staleWhileRevalidate]
  );

  const dependencyKey = useMemo(() => JSON.stringify(dependencies), [dependencies]);

  useEffect(() => {
    void execute();
  }, [dependencyKey, execute]);

  return {
    data,
    error,
    isLoading,
    isRefreshing,
    fromCache,
    refetch: execute
  };
};
