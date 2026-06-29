/**
 * TournamentApplicationState - Zustand store para estado global da aplicação
 * Gerencia tema, favoritos, navegação e dados de sincronização
 */

import { NAVIGATION_MENU, STORAGE_KEYS } from '@domain/constants/TournamentConfiguration';
import { persistenceAdapter } from '@infrastructure/adapters/PersistenceAdapter';
import type { NavigationContext, DisplayTheme } from '@domain/entities/ApplicationState';
import type { CompetitorTeamId } from '@domain/entities/TournamentDomain';
import { create } from 'zustand';

interface PersistentApplicationState {
  darkMode: boolean;
  favorites: CompetitorTeamId[];
  selectedSection: NavigationContext;
  searchTerm: string;
  lastSync: string | null;
}

interface TournamentApplicationStateStore extends PersistentApplicationState {
  isHydrated: boolean;
  restoreFromPersistence: () => void;
  switchTheme: () => void;
  setTheme: (darkMode: boolean) => void;
  navigateToSection: (section: NavigationContext) => void;
  updateSearchFilter: (query: string) => void;
  toggleCompetitorFavorite: (teamId: CompetitorTeamId) => void;
  clearAllFavorites: () => void;
  recordSyncTimestamp: (timestamp?: string) => void;
}

/**
 * Aplica tema CSS no documento
 */
const applyThemeStyling = (isDarkMode: boolean): void => {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.classList.toggle('dark', isDarkMode);
};

/**
 * Primeira seção de navegação (default)
 */
const defaultNavigationSection = NAVIGATION_MENU[0].id;

/**
 * Lê estado persistido do localStorage
 */
const loadPersistedApplicationState = (): PersistentApplicationState => {
  const savedState = persistenceAdapter.retrieve<Partial<PersistentApplicationState>>(
    STORAGE_KEYS.applicationState,
    null
  );

  return {
    darkMode: savedState?.darkMode ?? true,
    favorites: savedState?.favorites ?? [],
    selectedSection: savedState?.selectedSection ?? defaultNavigationSection,
    searchTerm: savedState?.searchTerm ?? '',
    lastSync: savedState?.lastSync ?? null
  };
};

/**
 * Persiste estado no localStorage
 */
const saveApplicationState = (state: PersistentApplicationState): void => {
  persistenceAdapter.persist(STORAGE_KEYS.applicationState, state);
};

const initialApplicationState = loadPersistedApplicationState();
applyThemeStyling(initialApplicationState.darkMode);

export const useTournamentState = create<TournamentApplicationStateStore>((set, get) => ({
  ...initialApplicationState,
  isHydrated: false,
  restoreFromPersistence: () => {
    const persisted = loadPersistedApplicationState();
    applyThemeStyling(persisted.darkMode);
    set({ ...persisted, isHydrated: true });
  },
  switchTheme: () => {
    const nextDarkMode = !get().darkMode;
    applyThemeStyling(nextDarkMode);
    const updatedState = { ...get(), darkMode: nextDarkMode };
    saveApplicationState(updatedState);
    set({ darkMode: nextDarkMode });
  },
  setTheme: (darkMode) => {
    applyThemeStyling(darkMode);
    const updatedState = { ...get(), darkMode };
    saveApplicationState(updatedState);
    set({ darkMode });
  },
  navigateToSection: (selectedSection) => {
    const updatedState = { ...get(), selectedSection };
    saveApplicationState(updatedState);
    set({ selectedSection });
  },
  updateSearchFilter: (searchTerm) => {
    const updatedState = { ...get(), searchTerm };
    saveApplicationState(updatedState);
    set({ searchTerm });
  },
  toggleCompetitorFavorite: (teamId) => {
    const currentFavorites = get().favorites;
    const favorites = currentFavorites.includes(teamId)
      ? currentFavorites.filter((favoriteId) => favoriteId !== teamId)
      : [...currentFavorites, teamId];
    const updatedState = { ...get(), favorites };
    saveApplicationState(updatedState);
    set({ favorites });
  },
  clearAllFavorites: () => {
    const updatedState = { ...get(), favorites: [] };
    saveApplicationState(updatedState);
    set({ favorites: [] });
  },
  recordSyncTimestamp: (timestamp = new Date().toISOString()) => {
    const updatedState = { ...get(), lastSync: timestamp };
    saveApplicationState(updatedState);
    set({ lastSync: timestamp });
  }
}));

// Legacy export para compatibilidade
export const useAppStore = useTournamentState;
