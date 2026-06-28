import { NAV_ITEMS, STORAGE_KEYS } from '@constants/index';
import { storageService } from '@services/storageService';
import type { AppSection, TeamId } from '@/types';
import { create } from 'zustand';

interface PersistedAppState {
  darkMode: boolean;
  favorites: TeamId[];
  selectedSection: AppSection;
  searchTerm: string;
  lastSync: string | null;
}

interface AppStoreState extends PersistedAppState {
  initialized: boolean;
  hydrate: () => void;
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;
  setSelectedSection: (section: AppSection) => void;
  setSearchTerm: (value: string) => void;
  toggleFavorite: (teamId: TeamId) => void;
  clearFavorites: () => void;
  markSynced: (timestamp?: string) => void;
}

const applyTheme = (darkMode: boolean): void => {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.classList.toggle('dark', darkMode);
};

const defaultSection = NAV_ITEMS[0].id;

const readPersistedState = (): PersistedAppState => {
  const persisted = storageService.get<Partial<PersistedAppState>>(STORAGE_KEYS.appState, null);

  return {
    darkMode: persisted?.darkMode ?? true,
    favorites: persisted?.favorites ?? [],
    selectedSection: persisted?.selectedSection ?? defaultSection,
    searchTerm: persisted?.searchTerm ?? '',
    lastSync: persisted?.lastSync ?? null
  };
};

const persistState = (state: PersistedAppState): void => {
  storageService.set(STORAGE_KEYS.appState, state);
};

const initialState = readPersistedState();
applyTheme(initialState.darkMode);

export const useAppStore = create<AppStoreState>((set, get) => ({
  ...initialState,
  initialized: false,
  hydrate: () => {
    const persisted = readPersistedState();
    applyTheme(persisted.darkMode);
    set({ ...persisted, initialized: true });
  },
  toggleDarkMode: () => {
    const nextValue = !get().darkMode;
    applyTheme(nextValue);
    const nextState = { ...get(), darkMode: nextValue };
    persistState(nextState);
    set({ darkMode: nextValue });
  },
  setDarkMode: (enabled) => {
    applyTheme(enabled);
    const nextState = { ...get(), darkMode: enabled };
    persistState(nextState);
    set({ darkMode: enabled });
  },
  setSelectedSection: (selectedSection) => {
    const nextState = { ...get(), selectedSection };
    persistState(nextState);
    set({ selectedSection });
  },
  setSearchTerm: (searchTerm) => {
    const nextState = { ...get(), searchTerm };
    persistState(nextState);
    set({ searchTerm });
  },
  toggleFavorite: (teamId) => {
    const currentFavorites = get().favorites;
    const favorites = currentFavorites.includes(teamId)
      ? currentFavorites.filter((favoriteId) => favoriteId !== teamId)
      : [...currentFavorites, teamId];
    const nextState = { ...get(), favorites };
    persistState(nextState);
    set({ favorites });
  },
  clearFavorites: () => {
    const nextState = { ...get(), favorites: [] };
    persistState(nextState);
    set({ favorites: [] });
  },
  markSynced: (timestamp = new Date().toISOString()) => {
    const nextState = { ...get(), lastSync: timestamp };
    persistState(nextState);
    set({ lastSync: timestamp });
  }
}));
