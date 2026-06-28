import { STORAGE_KEYS } from '@constants/index';
import { storageService } from '@services/storageService';
import type { ConnectionState } from '@/types';
import { create } from 'zustand';

interface ConnectionStoreState extends ConnectionState {
  latencyMs: number | null;
  pendingRequests: number;
  startRequest: () => void;
  finishRequest: () => void;
  setOnlineStatus: (isOnline: boolean) => void;
  markHealthy: (latencyMs?: number | null) => void;
  setError: (message: string) => void;
  hydrate: () => void;
}

const defaultState: Pick<ConnectionStoreState, 'isOnline' | 'lastUpdate' | 'status' | 'latencyMs' | 'pendingRequests'> = {
  isOnline: typeof navigator === 'undefined' ? true : navigator.onLine,
  lastUpdate: new Date().toISOString(),
  status: typeof navigator === 'undefined' || navigator.onLine ? 'connected' : 'offline',
  latencyMs: null,
  pendingRequests: 0
};

const persistConnectionState = (state: ConnectionStoreState): void => {
  storageService.set(STORAGE_KEYS.connectionState, {
    isOnline: state.isOnline,
    lastUpdate: state.lastUpdate,
    status: state.status,
    errorMessage: state.errorMessage,
    latencyMs: state.latencyMs
  });
};

const readPersistedConnection = () =>
  storageService.get<Partial<ConnectionStoreState>>(STORAGE_KEYS.connectionState, null);

export const useConnectionStore = create<ConnectionStoreState>((set, get) => ({
  ...defaultState,
  errorMessage: undefined,
  startRequest: () => {
    set((state) => ({
      pendingRequests: state.pendingRequests + 1,
      status: state.isOnline ? 'updating' : 'offline'
    }));
  },
  finishRequest: () => {
    set((state) => ({
      pendingRequests: Math.max(0, state.pendingRequests - 1),
      status: !state.isOnline ? 'offline' : state.pendingRequests > 1 ? 'updating' : state.status
    }));
  },
  setOnlineStatus: (isOnline) => {
    set((state) => {
      const nextState = {
        ...state,
        isOnline,
        status: isOnline ? (state.pendingRequests > 0 ? 'updating' : 'connected') : 'offline',
        errorMessage: isOnline ? undefined : 'Sin conexion a Internet'
      };
      persistConnectionState(nextState);
      return nextState;
    });
  },
  markHealthy: (latencyMs = null) => {
    set((state) => {
      const nextState = {
        ...state,
        latencyMs,
        lastUpdate: new Date().toISOString(),
        status: state.pendingRequests > 0 ? 'updating' : 'connected',
        errorMessage: undefined
      };
      persistConnectionState(nextState);
      return nextState;
    });
  },
  setError: (message) => {
    set((state) => {
      const nextState = {
        ...state,
        lastUpdate: new Date().toISOString(),
        status: state.isOnline ? 'error' : 'offline',
        errorMessage: message
      };
      persistConnectionState(nextState);
      return nextState;
    });
  },
  hydrate: () => {
    const persisted = readPersistedConnection();
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
