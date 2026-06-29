/**
 * TournamentConfiguration - Configurações centralizadas do torneio FIFA 2026
 * Define constantes de negócio, timezones, limites de API e duração de cache
 */

import type { CompetitionPhase, CompetitionPhaseStatus, GroupClassification } from '@domain/entities/TournamentDomain';
import type { NavigationContext, NavigationMenuItem } from '@domain/entities/ApplicationState';

// Informações da aplicação
export const APPLICATION_NAME = 'Mundial FIFA 2026';
export const APPLICATION_SHORT_TITLE = 'Mundial 2026';
export const APPLICATION_DESCRIPTION =
  'Aplicativo progressivo do Mundial 2026 com calendário de partidos, classificações e funcionamento offline';

// Dados do torneio
export const TOURNAMENT_YEAR = 2026;
export const COMPETING_NATIONS_COUNT = 48;
export const SCHEDULED_MATCHES_COUNT = 104;

export const GROUP_DESIGNATIONS: readonly GroupClassification[] = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'
] as const;

export const COMPETITION_PHASE_SEQUENCE: readonly CompetitionPhase[] = [
  'group',
  'round-of-32',
  'round-of-16',
  'quarterfinals',
  'semifinals',
  'third-place',
  'final'
] as const;

export const MATCH_STATUS_TRANSLATIONS: Record<CompetitionPhaseStatus, string> = {
  scheduled: 'Programado',
  live: 'Em andamento',
  finished: 'Finalizado',
  postponed: 'Adiado'
};

export const PHASE_TRANSLATIONS: Record<CompetitionPhase, string> = {
  group: 'Fase de grupos',
  'round-of-32': 'Dezesseis avos',
  'round-of-16': 'Oitavas',
  quarterfinals: 'Quartas',
  semifinals: 'Semifinais',
  'third-place': 'Terceiro lugar',
  final: 'Final'
};

// Configurações de persistência
export const STORAGE_KEYS = {
  applicationState: 'fifa2026:app-state',
  connectivityState: 'fifa2026:connection-state',
  userFavorites: 'fifa2026:favorites',
  displayTheme: 'fifa2026:theme',
  cacheNamespace: 'fifa2026:cache:'
} as const;

// Chaves de cache específicas
export const CACHE_KEYS = {
  competitorTeams: 'teams',
  scheduledMatches: 'matches',
  groupStandings: 'standings',
  athleteProfiles: 'players',
  venueInformation: 'stadiums',
  tournamentMetrics: 'stats'
} as const;

// Políticas de retenção de cache
export const CACHE_RETENTION_POLICIES = {
  momentary: 60_000,              // 1 minuto
  shortTerm: 5 * 60_000,          // 5 minutos
  mediumTerm: 60 * 60_000,        // 1 hora
  entireDay: 24 * 60 * 60_000,    // 24 horas
  // Legacy aliases para compatibilidade
  short: 5 * 60_000,              // shortTerm
  medium: 60 * 60_000,            // mediumTerm
  day: 24 * 60 * 60_000           // entireDay
} as const;

// Limites de operação de API
export const API_REQUEST_TIMEOUT_MS = 8_000;
export const API_MAXIMUM_RETRY_ATTEMPTS = 2;

// Nações anfitriãs
export const HOST_NATIONS = ['Mexico', 'Estados Unidos', 'Canada'] as const;

// Menu de navegação
export const NAVIGATION_MENU: readonly NavigationMenuItem[] = [
  { id: 'inicio', label: 'Início', shortLabel: 'Início' },
  { id: 'calendario', label: 'Calendário', shortLabel: 'Partidos' },
  { id: 'grupos', label: 'Grupos', shortLabel: 'Grupos' },
  { id: 'favoritos', label: 'Favoritos', shortLabel: 'Favoritos' },
  { id: 'ajustes', label: 'Configurações', shortLabel: 'Config' }
] as const;

// Tradução de posições
export const POSITION_TRANSLATIONS = {
  GK: 'Goleiro',
  DEF: 'Zagueiro',
  MID: 'Centrocampista',
  FWD: 'Atacante'
} as const;

// Legacy exports para compatibilidade
export const APP_NAME = APPLICATION_NAME;
export const APP_SHORT_NAME = APPLICATION_SHORT_TITLE;
export const APP_DESCRIPTION = APPLICATION_DESCRIPTION;
export const TOTAL_TEAMS = COMPETING_NATIONS_COUNT;
export const TOTAL_MATCHES = SCHEDULED_MATCHES_COUNT;
export const GROUP_LABELS = GROUP_DESIGNATIONS;
export const MATCH_PHASE_ORDER = COMPETITION_PHASE_SEQUENCE;
export const MATCH_STATUS_LABELS = MATCH_STATUS_TRANSLATIONS;
export const PHASE_LABELS = PHASE_TRANSLATIONS;
export const CACHE_DURATIONS = CACHE_RETENTION_POLICIES;
export const API_TIMEOUT_MS = API_REQUEST_TIMEOUT_MS;
export const API_RETRY_LIMIT = API_MAXIMUM_RETRY_ATTEMPTS;
export const NAV_ITEMS = NAVIGATION_MENU;
export const POSITION_LABELS = POSITION_TRANSLATIONS;
