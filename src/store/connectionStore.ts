// Re-export from new location for backwards compatibility
export { useConnectivityState } from '@state/connectivity/ConnectivityManager';

import { useConnectivityState } from '@state/connectivity/ConnectivityManager';

/**
 * Legacy store hook wrapper - mantém compatibilidade com seletores Zustand
 * Mapeiaautomaticamente nomes antigos para novos na interface
 */
export const useConnectionStore = ((selector?: (state: any) => any) => {
  const store = useConnectivityState();

  if (!selector) {
    return {
      ...store,
      startRequest: store.initiateRequest,
      finishRequest: store.concludeRequest,
      setOnlineStatus: store.reportOnlineStatus,
      markHealthy: store.markSuccessfulConnection,
      setError: store.reportConnectionFailure,
      hydrate: store.restoreFromPersistence
    };
  }

  // Wrap the store with legacy aliases
  const wrappedStore = {
    ...store,
    startRequest: store.initiateRequest,
    finishRequest: store.concludeRequest,
    setOnlineStatus: store.reportOnlineStatus,
    markHealthy: store.markSuccessfulConnection,
    setError: store.reportConnectionFailure,
    hydrate: store.restoreFromPersistence
  };

  return selector(wrappedStore);
}) as any;
