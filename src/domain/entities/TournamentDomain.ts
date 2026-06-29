// Identificadores únicos do domínio
export type CompetitorTeamId = string & { readonly __brand: 'CompetitorTeamId' };
export type CompetitionMatchId = string & { readonly __brand: 'CompetitionMatchId' };
export type AthleteProfileId = string & { readonly __brand: 'AthleteProfileId' };
export type VenueInformationId = string & { readonly __brand: 'VenueInformationId' };

export const competitorTeamId = (value: string): CompetitorTeamId => value as CompetitorTeamId;
export const competitionMatchId = (value: string): CompetitionMatchId => value as CompetitionMatchId;
export const athleteProfileId = (value: string): AthleteProfileId => value as AthleteProfileId;
export const venueInformationId = (value: string): VenueInformationId => value as VenueInformationId;

// Estados de competição
export type CompetitionPhaseStatus = 'scheduled' | 'live' | 'finished' | 'postponed';

export type CompetitionPhase =
  | 'group'
  | 'round-of-32'
  | 'round-of-16'
  | 'quarterfinals'
  | 'semifinals'
  | 'third-place'
  | 'final';

export type GroupClassification = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';

// Interfaces do domínio
export interface CompetitorTeam {
  id: CompetitorTeamId;
  name: string;
  code: string;
  flag: string;
  logo: string;
  group: GroupClassification;
  playersCount: number;
  fifaRanking: number;
}

export interface AthleteProfile {
  id: AthleteProfileId;
  name: string;
  teamId: CompetitorTeamId;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  number: number;
  age: number;
  goals: number;
  assists: number;
  appearances: number;
  photo?: string;
  club?: string;
}

export interface VenueInformation {
  id: VenueInformationId;
  name: string;
  city: string;
  country: string;
  capacity: number;
  image?: string;
  matchesPlayed: number;
}

export interface CompetitionMatch {
  id: CompetitionMatchId;
  homeTeamId: CompetitorTeamId;
  awayTeamId: CompetitorTeamId;
  date: string;
  time: string;
  status: CompetitionPhaseStatus;
  phase: CompetitionPhase;
  stadiumId: VenueInformationId;
  referee?: string;
  homeTeamGoals: number;
  awayTeamGoals: number;
  homeTeamPossession?: number;
  homeTeamShots?: number;
  awayTeamShots?: number;
  homeTeamCorners?: number;
  awayTeamCorners?: number;
}

export interface GroupStandingsRecord {
  group: GroupClassification;
  teams: CompetitorStanding[];
}

export interface CompetitorStanding {
  teamId: CompetitorTeamId;
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

export interface TournamentStatistics {
  totalMatches: number;
  totalGoals: number;
  averageGoalsPerMatch: number;
  topScorer: AthleteProfile;
  topAssister: AthleteProfile;
}

export interface EliminationRound {
  id: CompetitionMatchId;
  homeTeamId?: CompetitorTeamId;
  awayTeamId?: CompetitorTeamId;
  homeTeamGoals?: number;
  awayTeamGoals?: number;
  round: number;
  position: number;
  phase: CompetitionPhase;
}

// Legacy exports para compatibilidade durante a migração
export type Team = CompetitorTeam;
export type TeamId = CompetitorTeamId;
export type Player = AthleteProfile;
export type PlayerId = AthleteProfileId;
export type Match = CompetitionMatch;
export type MatchId = CompetitionMatchId;
export type Stadium = VenueInformation;
export type StadiumId = VenueInformationId;
export type MatchStatus = CompetitionPhaseStatus;
export type MatchPhase = CompetitionPhase;
export type TeamGroup = GroupClassification;
export type TeamStanding = CompetitorStanding;
export type GlobalStats = TournamentStatistics;
export type BracketMatch = EliminationRound;
export type Statistics = { type: string; value: number; team: string };
