import type { CompetitorTeamId, CompetitionMatchId } from './TournamentDomain';

// Temas de visualização
export type DisplayTheme = 'light' | 'dark';

// Contextos de navegação
export type NavigationContext = 'inicio' | 'calendario' | 'grupos' | 'favoritos' | 'ajustes';

// Estado de conectividade
export interface ConnectivityState {
  isOnline: boolean;
  lastUpdate: string;
  status: 'connected' | 'updating' | 'offline' | 'error';
  errorMessage?: string;
  latencyMs?: number;
  pendingRequests: number;
}

// Previsões de resultado
export interface MatchPredictionOutcome {
  winner: CompetitorTeamId;
  finalScore: string;
  path: CompetitionMatchId[];
}

// Estado da aplicação
export interface TournamentApplicationState {
  connection: ConnectivityState;
  darkMode: boolean;
  favorites: CompetitorTeamId[];
  prediction: MatchPredictionOutcome | null;
}

// Configuração de navegação
export interface NavigationMenuItem {
  id: NavigationContext;
  label: string;
  shortLabel: string;
}

// Legacy exports para compatibilidade
export type ThemeMode = DisplayTheme;
export type AppSection = NavigationContext;
export type ConnectionState = ConnectivityState;
export type AppState = TournamentApplicationState;
export type PredictionData = MatchPredictionOutcome;
export type NavigationItem = NavigationMenuItem;
