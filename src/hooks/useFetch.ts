// Re-export from new location for backwards compatibility
export type { RemoteDataFetcherConfiguration, RemoteDataFetcherResult } from '@infrastructure/hooks/useRemoteDataFetcher';
export { useRemoteDataFetcher } from '@infrastructure/hooks/useRemoteDataFetcher';

import { useRemoteDataFetcher } from '@infrastructure/hooks/useRemoteDataFetcher';
import type { RemoteDataFetcherConfiguration, RemoteDataFetcherResult } from '@infrastructure/hooks/useRemoteDataFetcher';

/**
 * Legacy hook wrapper - mapeia nomes novos para antigos para compatibilidade
 * Maps: payload -> data, isInitializing -> isLoading, failureReason -> error, triggerRefetch -> refetch
 */
export const useFetch = <T>(
  resourceId: string,
  fetchFn: () => Promise<T>,
  config?: RemoteDataFetcherConfiguration<T>
) => {
  const result = useRemoteDataFetcher(resourceId, fetchFn, config);

  return {
    data: result.payload,
    isLoading: result.isInitializing,
    error: result.failureReason,
    refetch: result.triggerRefetch,
    // Include new names too
    payload: result.payload,
    isInitializing: result.isInitializing,
    failureReason: result.failureReason,
    triggerRefetch: result.triggerRefetch,
    isRefetchingInBackground: result.isRefetchingInBackground,
    consumedFromCache: result.consumedFromCache
  };
};
