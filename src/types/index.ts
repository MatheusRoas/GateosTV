// Re-export from domain entities for backwards compatibility
export type {
  CompetitorTeamId,
  CompetitionMatchId,
  AthleteProfileId,
  VenueInformationId,
  CompetitionPhaseStatus,
  CompetitionPhase,
  GroupClassification,
  CompetitorTeam,
  AthleteProfile,
  VenueInformation,
  CompetitionMatch,
  GroupStandingsRecord,
  CompetitorStanding,
  TournamentStatistics,
  EliminationRound
} from '@domain/entities/TournamentDomain';

// Import separately to use in type aliases
import type { GroupStandingsRecord } from '@domain/entities/TournamentDomain';

export type {
  DisplayTheme,
  NavigationContext,
  ConnectivityState,
  MatchPredictionOutcome,
  TournamentApplicationState,
  NavigationMenuItem
} from '@domain/entities/ApplicationState';

// Alias para compatibilidade
export type GroupStandings = GroupStandingsRecord;

// Legacy type aliases for migration period
export type {
  Team,
  TeamId,
  Player,
  PlayerId,
  Match,
  MatchId,
  Stadium,
  StadiumId,
  MatchStatus,
  MatchPhase,
  TeamGroup,
  TeamStanding,
  GlobalStats,
  BracketMatch,
  Statistics
} from '@domain/entities/TournamentDomain';

export type {
  ThemeMode,
  AppSection,
  ConnectionState,
  AppState,
  PredictionData,
  NavigationItem
} from '@domain/entities/ApplicationState';
