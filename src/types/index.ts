export type TeamId = string;
export type MatchId = string;
export type PlayerId = string;
export type StadiumId = string;

export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed';
export type MatchPhase =
  | 'group'
  | 'round-of-32'
  | 'round-of-16'
  | 'quarterfinals'
  | 'semifinals'
  | 'third-place'
  | 'final';
export type TeamGroup = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';
export type ThemeMode = 'light' | 'dark';
export type AppSection = 'inicio' | 'calendario' | 'grupos' | 'favoritos' | 'ajustes';

export interface Team {
  id: TeamId;
  name: string;
  code: string;
  flag: string;
  logo: string;
  group: TeamGroup;
  playersCount: number;
  fifaRanking: number;
}

export interface Player {
  id: PlayerId;
  name: string;
  teamId: TeamId;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  number: number;
  age: number;
  goals: number;
  assists: number;
  appearances: number;
  photo?: string;
  club?: string;
}

export interface Stadium {
  id: StadiumId;
  name: string;
  city: string;
  country: string;
  capacity: number;
  image?: string;
  matchesPlayed: number;
}

export interface Match {
  id: MatchId;
  homeTeamId: TeamId;
  awayTeamId: TeamId;
  date: string;
  time: string;
  status: MatchStatus;
  phase: MatchPhase;
  stadiumId: StadiumId;
  referee?: string;
  homeTeamGoals: number;
  awayTeamGoals: number;
  homeTeamPossession?: number;
  homeTeamShots?: number;
  awayTeamShots?: number;
  homeTeamCorners?: number;
  awayTeamCorners?: number;
}

export interface GroupStandings {
  group: TeamGroup;
  teams: TeamStanding[];
}

export interface TeamStanding {
  teamId: TeamId;
  teamName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  qualified: boolean;
}

export interface Statistics {
  type: string;
  value: number;
  team: string;
}

export interface GlobalStats {
  totalMatches: number;
  totalGoals: number;
  averageGoalsPerMatch: number;
  topScorer: Player;
  topAssister: Player;
}

export interface ConnectionState {
  isOnline: boolean;
  lastUpdate: string;
  status: 'connected' | 'updating' | 'offline' | 'error';
  errorMessage?: string;
}

export interface AppState {
  connection: ConnectionState;
  darkMode: boolean;
  favorites: TeamId[];
  prediction: PredictionData | null;
}

export interface PredictionData {
  winner: TeamId;
  finalScore: string;
  path: MatchId[];
}

export interface BracketMatch {
  id: MatchId;
  homeTeamId?: TeamId;
  awayTeamId?: TeamId;
  homeTeamGoals?: number;
  awayTeamGoals?: number;
  round: number;
  position: number;
  phase: MatchPhase;
}

export interface NavigationItem {
  id: AppSection;
  label: string;
  shortLabel: string;
}
