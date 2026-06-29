/**
 * usePersistentStateSync - Hook para sincronização de estado com localStorage
 * Mantém dados em sync entre abas/janelas e persiste entre sessões
 */

import { useCallback, useEffect, useState } from 'react';
import { PersistenceAdapter } from '@infrastructure/adapters/PersistenceAdapter';

/**
 * Sincronia bidirecional com localStorage
 * Suporta atualização cross-tab automática
 */
export const usePersistentStateSync = <T>(persistenceKey: string, defaultValue: T) => {
  const [synchronizedState, setSynchronizedState] = useState<T>(() =>
    PersistenceAdapter.retrieve<T>(persistenceKey, defaultValue) ?? defaultValue
  );

  const updatePersistentValue = useCallback(
    (newValueOrUpdater: T | ((previousState: T) => T)) => {
      setSynchronizedState((previousState) => {
        const resolvedNewValue = newValueOrUpdater instanceof Function ? newValueOrUpdater(previousState) : newValueOrUpdater;
        PersistenceAdapter.persist(persistenceKey, resolvedNewValue);
        return resolvedNewValue;
      });
    },
    [persistenceKey]
  );

  const clearPersistentValue = useCallback(() => {
    PersistenceAdapter.remove(persistenceKey);
    setSynchronizedState(defaultValue);
  }, [defaultValue, persistenceKey]);

  useEffect(() => {
    const handleStorageSync = (event: StorageEvent) => {
      if (event.key !== persistenceKey) {
        return;
      }

      if (event.newValue === null) {
        setSynchronizedState(defaultValue);
        return;
      }

      try {
        setSynchronizedState(JSON.parse(event.newValue) as T);
      } catch {
        setSynchronizedState(defaultValue);
      }
    };

    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, [defaultValue, persistenceKey]);

  return [synchronizedState, updatePersistentValue, clearPersistentValue] as const;
};

// Legacy export para compatibilidade
export const useLocalStorage = usePersistentStateSync;
