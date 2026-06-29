/**
 * MockTournamentDataProvider - Provedor de dados mock para torneio FIFA 2026
 * Simula respostas de API com delay realista
 * Usado em desenvolvimento e quando a API real não está disponível
 */

import { CACHE_KEYS, CACHE_RETENTION_POLICIES } from '@domain/constants/TournamentConfiguration';
import {
  tournamentMetricsReference,
  groupStandingsReference,
  scheduledMatchesReference,
  athleteProfilesReference,
  athleteProfilesByCompetitorReference,
  venueInformationReference,
  competitorTeamsReference,
  tournamentOverviewReference
} from '@infrastructure/mocks/MockDatasets';
import type {
  TournamentStatistics,
  GroupStandingsRecord,
  CompetitionMatch,
  CompetitionPhase,
  CompetitionPhaseStatus,
  AthleteProfile,
  VenueInformation,
  CompetitorTeam,
  CompetitorTeamId
} from '@domain/entities/TournamentDomain';

interface MatchQueryFilters {
  phase?: CompetitionPhase;
  status?: CompetitionPhaseStatus;
  teamId?: CompetitorTeamId;
  limit?: number;
}

interface CatalogSearchOutcome {
  teams: CompetitorTeam[];
  matches: CompetitionMatch[];
  athletes: AthleteProfile[];
}

/**
 * Clona valor deep (evita mutação de dados mock)
 */
const performDeepClone = <T>(source: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(source);
  }

  return JSON.parse(JSON.stringify(source)) as T;
};

/**
 * Aguarda com delay realista (simula latência)
 */
const simulateNetworkLatency = async (minimumMs = 120, maximumMs = 380): Promise<void> => {
  const randomDelay = Math.floor(Math.random() * (maximumMs - minimumMs + 1)) + minimumMs;
  await new Promise((resolve) => window.setTimeout(resolve, randomDelay));
};

/**
 * Provedor de dados mock do torneio
 */
class MockTournamentDataProvider {
  /**
   * Hints de cache para cada tipo de dado
   */
  readonly cacheRetentionHints = {
    teams: CACHE_RETENTION_POLICIES.entireDay,
    matches: CACHE_RETENTION_POLICIES.mediumTerm,
    athletes: CACHE_RETENTION_POLICIES.mediumTerm,
    stadiums: CACHE_RETENTION_POLICIES.entireDay,
    standings: CACHE_RETENTION_POLICIES.mediumTerm,
    metrics: CACHE_RETENTION_POLICIES.momentary
  } as const;

  /**
   * Chaves de cache
   */
  readonly cacheKeyMapping = CACHE_KEYS;

  /**
   * Método interno para resposta com delay
   */
  private async respondWithSimulatedLatency<T>(responseData: T): Promise<T> {
    await simulateNetworkLatency();
    return performDeepClone(responseData);
  }

  /**
   * Busca todos os competidores
   */
  async fetchCompetitorTeams(): Promise<CompetitorTeam[]> {
    return this.respondWithSimulatedLatency(competitorTeamsReference);
  }

  /**
   * Busca competidor específico por ID
   */
  async fetchCompetitorById(teamId: CompetitorTeamId): Promise<CompetitorTeam | null> {
    return this.respondWithSimulatedLatency(
      competitorTeamsReference.find((team) => team.id === teamId) ?? null
    );
  }

  /**
   * Busca partidas com filtros opcionais
   */
  async fetchScheduledMatches(filters: MatchQueryFilters = {}): Promise<CompetitionMatch[]> {
    const filteredMatches = scheduledMatchesReference
      .filter((match) => (filters.phase ? match.phase === filters.phase : true))
      .filter((match) => (filters.status ? match.status === filters.status : true))
      .filter((match) =>
        filters.teamId
          ? match.homeTeamId === filters.teamId || match.awayTeamId === filters.teamId
          : true
      );

    const resultMatches = filters.limit ? filteredMatches.slice(0, filters.limit) : filteredMatches;
    return this.respondWithSimulatedLatency(resultMatches);
  }

  /**
   * Busca partida específica por ID
   */
  async fetchMatchById(matchId: string): Promise<CompetitionMatch | null> {
    return this.respondWithSimulatedLatency(
      scheduledMatchesReference.find((match) => match.id === matchId) ?? null
    );
  }

  /**
   * Busca atletas de um time ou todos
   */
  async fetchAthletes(teamId?: CompetitorTeamId): Promise<AthleteProfile[]> {
    return this.respondWithSimulatedLatency(
      teamId ? (athleteProfilesByCompetitorReference[teamId] ?? []) : athleteProfilesReference
    );
  }

  /**
   * Busca detalhes de todos os estádios
   */
  async fetchVenueDetails(): Promise<VenueInformation[]> {
    return this.respondWithSimulatedLatency(venueInformationReference);
  }

  /**
   * Busca classificações dos grupos
   */
  async fetchGroupStandings(): Promise<GroupStandingsRecord[]> {
    return this.respondWithSimulatedLatency(groupStandingsReference);
  }

  /**
   * Busca estatísticas globais do torneio
   */
  async fetchTournamentMetrics(): Promise<TournamentStatistics> {
    return this.respondWithSimulatedLatency(tournamentMetricsReference);
  }

  /**
   * Busca panorama geral do torneio
   */
  async fetchTournamentOverview(): Promise<typeof tournamentOverviewReference> {
    return this.respondWithSimulatedLatency(tournamentOverviewReference);
  }

  /**
   * Busca catálogo por query de texto
   */
  async queryTournamentCatalog(searchQuery: string): Promise<CatalogSearchOutcome> {
    const normalizedTerm = searchQuery.trim().toLowerCase();
    if (!normalizedTerm) {
      return this.respondWithSimulatedLatency({ teams: [], matches: [], athletes: [] });
    }

    const matchedTeams = competitorTeamsReference.filter(
      (team) =>
        team.name.toLowerCase().includes(normalizedTerm) ||
        team.code.toLowerCase().includes(normalizedTerm)
    );
    const matchedAthletes = athleteProfilesReference
      .filter((athlete) => athlete.name.toLowerCase().includes(normalizedTerm))
      .slice(0, 12);
    const matchedTeamIds = new Set(matchedTeams.map((team) => team.id));
    const matchedMatches = scheduledMatchesReference
      .filter(
        (match) =>
          matchedTeamIds.has(match.homeTeamId) || matchedTeamIds.has(match.awayTeamId)
      )
      .slice(0, 12);

    return this.respondWithSimulatedLatency({
      teams: matchedTeams,
      matches: matchedMatches,
      athletes: matchedAthletes
    });
  }
}

export const mockTournamentDataProvider = new MockTournamentDataProvider();

// Legacy export para compatibilidade
export const mockApiService = mockTournamentDataProvider;

// Class export para dependency injection
export type MockTournamentDataProviderType = MockTournamentDataProvider;
