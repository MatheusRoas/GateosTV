/**
 * ConnectivityManager - Zustand store para gerenciar conectividade
 * Rastreia status online/offline, latência e requisições pendentes
 */

import { STORAGE_KEYS } from '@domain/constants/TournamentConfiguration';
import { persistenceAdapter } from '@infrastructure/adapters/PersistenceAdapter';
import type { ConnectivityState } from '@domain/entities/ApplicationState';
import { create } from 'zustand';

interface ConnectivityManagerState extends ConnectivityState {
  pendingRequests: number;
  initiateRequest: () => void;
  concludeRequest: () => void;
  reportOnlineStatus: (isOnline: boolean) => void;
  markSuccessfulConnection: (latencyMs?: number) => void;
  reportConnectionFailure: (message: string) => void;
  restoreFromPersistence: () => void;
}

/**
 * Estado padrão de conectividade
 */
const defaultConnectivityState: Pick<
  ConnectivityManagerState,
  'isOnline' | 'lastUpdate' | 'status' | 'latencyMs' | 'pendingRequests'
> = {
  isOnline: typeof navigator === 'undefined' ? true : navigator.onLine,
  lastUpdate: new Date().toISOString(),
  status: typeof navigator === 'undefined' || navigator.onLine ? 'connected' : 'offline',
  latencyMs: null,
  pendingRequests: 0
};

/**
 * Persiste estado de conectividade
 */
const persistConnectivityStatus = (state: Partial<ConnectivityManagerState>): void => {
  persistenceAdapter.persist(STORAGE_KEYS.connectivityState, {
    isOnline: state.isOnline,
    lastUpdate: state.lastUpdate,
    status: state.status,
    errorMessage: state.errorMessage,
    latencyMs: state.latencyMs
  });
};

/**
 * Lê estado de conectividade persistido
 */
const loadPersistedConnectivityState = () =>
  persistenceAdapter.retrieve<Partial<ConnectivityManagerState>>(
    STORAGE_KEYS.connectivityState,
    null
  );

export const useConnectivityState = create<ConnectivityManagerState>((set) => ({
  ...defaultConnectivityState,
  errorMessage: undefined,
  initiateRequest: () => {
    set((state) => ({
      pendingRequests: state.pendingRequests + 1,
      status: state.isOnline ? 'updating' : 'offline'
    }));
  },
  concludeRequest: () => {
    set((state) => ({
      pendingRequests: Math.max(0, state.pendingRequests - 1),
      status: !state.isOnline ? 'offline' : state.pendingRequests > 1 ? 'updating' : state.status
    }));
  },
  reportOnlineStatus: (isOnline) => {
    set((state) => {
      const nextStatus: ConnectivityState['status'] = isOnline
        ? state.pendingRequests > 0
          ? 'updating'
          : 'connected'
        : 'offline';
      const updatedState: Partial<ConnectivityManagerState> = {
        isOnline,
        status: nextStatus,
        errorMessage: isOnline ? undefined : 'Sem conexão com a internet'
      };
      persistConnectivityStatus({ ...state, ...updatedState });
      return updatedState;
    });
  },
  markSuccessfulConnection: (latencyMs = null) => {
    set((state) => {
      const updatedState: Partial<ConnectivityManagerState> = {
        latencyMs,
        lastUpdate: new Date().toISOString(),
        status: state.pendingRequests > 0 ? 'updating' : 'connected',
        errorMessage: undefined
      };
      persistConnectivityStatus({ ...state, ...updatedState });
      return updatedState;
    });
  },
  reportConnectionFailure: (message) => {
    set((state) => {
      const updatedState: Partial<ConnectivityManagerState> = {
        lastUpdate: new Date().toISOString(),
        status: state.isOnline ? 'error' : 'offline',
        errorMessage: message
      };
      persistConnectivityStatus({ ...state, ...updatedState });
      return updatedState;
    });
  },
  restoreFromPersistence: () => {
    const persisted = loadPersistedConnectivityState();
    if (!persisted) {
      return;
    }

    set((state) => ({
      ...state,
      ...persisted,
      status: persisted.isOnline === false ? 'offline' : persisted.status ?? state.status
    }));
  }
}));

// Aliases para compatibilidade
export const useConnectionStore = useConnectivityState;
