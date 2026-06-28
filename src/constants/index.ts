import type { MatchPhase, MatchStatus, NavigationItem, TeamGroup } from '@/types';

export const APP_NAME = 'Mundial FIFA 2026';
export const APP_SHORT_NAME = 'Mundial 2026';
export const APP_DESCRIPTION =
  'Aplicacion progresiva del Mundial 2026 con calendario, clasificaciones y modo sin conexion';

export const TOURNAMENT_YEAR = 2026;
export const TOTAL_TEAMS = 48;
export const TOTAL_MATCHES = 104;

export const GROUP_LABELS: readonly TeamGroup[] = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L'
] as const;

export const MATCH_PHASE_ORDER: readonly MatchPhase[] = [
  'group',
  'round-of-32',
  'round-of-16',
  'quarterfinals',
  'semifinals',
  'third-place',
  'final'
] as const;

export const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
  scheduled: 'Programado',
  live: 'En juego',
  finished: 'Finalizado',
  postponed: 'Aplazado'
};

export const PHASE_LABELS: Record<MatchPhase, string> = {
  group: 'Fase de grupos',
  'round-of-32': 'Dieciseisavos',
  'round-of-16': 'Octavos',
  quarterfinals: 'Cuartos',
  semifinals: 'Semifinales',
  'third-place': 'Tercer puesto',
  final: 'Final'
};

export const STORAGE_KEYS = {
  appState: 'fifa2026:app-state',
  connectionState: 'fifa2026:connection-state',
  favorites: 'fifa2026:favorites',
  theme: 'fifa2026:theme',
  cacheNamespace: 'fifa2026:cache:'
} as const;

export const CACHE_KEYS = {
  teams: 'teams',
  matches: 'matches',
  standings: 'standings',
  players: 'players',
  stadiums: 'stadiums',
  stats: 'stats'
} as const;

export const CACHE_DURATIONS = {
  short: 60_000,
  medium: 5 * 60_000,
  long: 60 * 60_000,
  day: 24 * 60 * 60_000
} as const;

export const API_TIMEOUT_MS = 8_000;
export const API_RETRY_LIMIT = 2;

export const HOST_NATIONS = ['Mexico', 'Estados Unidos', 'Canada'] as const;

export const NAV_ITEMS: readonly NavigationItem[] = [
  { id: 'inicio', label: 'Inicio', shortLabel: 'Inicio' },
  { id: 'calendario', label: 'Calendario', shortLabel: 'Partidos' },
  { id: 'grupos', label: 'Grupos', shortLabel: 'Grupos' },
  { id: 'favoritos', label: 'Favoritos', shortLabel: 'Favoritos' },
  { id: 'ajustes', label: 'Ajustes', shortLabel: 'Ajustes' }
] as const;

export const POSITION_LABELS = {
  GK: 'Portero',
  DEF: 'Defensa',
  MID: 'Centrocampista',
  FWD: 'Delantero'
} as const;
