// Re-export from new location for backwards compatibility
export { useTournamentState } from '@state/application/TournamentApplicationState';

import { useTournamentState } from '@state/application/TournamentApplicationState';

/**
 * Legacy store hook wrapper - mantém compatibilidade com seletores Zustand
 * Mapeiaautomaticamente nomes antigos para novos na interface
 */
export const useAppStore = ((selector?: (state: any) => any) => {
  const store = useTournamentState();

  if (!selector) {
    return {
      ...store,
      hydrate: store.restoreFromPersistence,
      markSynced: store.recordSyncTimestamp,
      setSelectedSection: store.navigateToSection,
      setSearchTerm: store.updateSearchFilter,
      toggleFavorite: store.toggleCompetitorFavorite,
      clearFavorites: store.clearAllFavorites,
      toggleDarkMode: () => store.switchTheme(),
      setDarkMode: store.setTheme
    };
  }

  // Wrap the store with legacy aliases
  const wrappedStore = {
    ...store,
    hydrate: store.restoreFromPersistence,
    markSynced: store.recordSyncTimestamp,
    setSelectedSection: store.navigateToSection,
    setSearchTerm: store.updateSearchFilter,
    toggleFavorite: store.toggleCompetitorFavorite,
    clearFavorites: store.clearAllFavorites,
    toggleDarkMode: () => store.switchTheme(),
    setDarkMode: store.setTheme
  };

  return selector(wrappedStore);
}) as any;
