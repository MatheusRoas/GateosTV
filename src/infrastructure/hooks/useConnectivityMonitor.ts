/**
 * useConnectivityMonitor - Hook para monitoramento de conectividade
 * Acompanha mudanças de status online/offline em tempo real
 */

import { useEffect } from 'react';
import { useConnectivityState } from '@state/connectivity/ConnectivityManager';

/**
 * Monitora status de conectividade da aplicação
 * Escuta eventos online/offline do navegador
 */
export const useConnectivityMonitor = () => {
  const isOnline = useConnectivityState((state) => state.isOnline);
  const status = useConnectivityState((state) => state.status);
  const lastUpdate = useConnectivityState((state) => state.lastUpdate);
  const errorMessage = useConnectivityState((state) => state.errorMessage);
  const reportOnlineStatus = useConnectivityState((state) => state.reportOnlineStatus);
  const restoreFromPersistence = useConnectivityState((state) => state.restoreFromPersistence);

  useEffect(() => {
    restoreFromPersistence();
    reportOnlineStatus(typeof navigator === 'undefined' ? true : navigator.onLine);

    const handleConnectivityChange = () => reportOnlineStatus(window.navigator.onLine);

    window.addEventListener('online', handleConnectivityChange);
    window.addEventListener('offline', handleConnectivityChange);

    return () => {
      window.removeEventListener('online', handleConnectivityChange);
      window.removeEventListener('offline', handleConnectivityChange);
    };
  }, [restoreFromPersistence, reportOnlineStatus]);

  return {
    isOnline,
    status,
    lastUpdate,
    errorMessage
  };
};

// Legacy export para compatibilidade
export const useOnline = useConnectivityMonitor;
