/**
 * TournamentDataAdapter - Integração com APIs de dados do torneio
 * Implementa estratégia network-first com fallback para mock
 * Inclui retry logic, timeout e tratamento de conectividade
 */

import { API_CONFIG, API_ENDPOINTS, shouldUseNetworkFirst } from '@infrastructure/config/ApiConfiguration';
import { mockTournamentDataProvider } from '@infrastructure/mocks/MockTournamentDataProvider';
import { useTournamentState } from '@state/application/TournamentApplicationState';
import { useConnectivityState } from '@state/connectivity/ConnectivityManager';
import { captureHttpFailure, translateErrorForDisplay, shouldRetryRequest, translateErrorToException } from '@domain/exceptions/TournamentException';
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

type QueryStringParameters = Record<string, string | number | undefined>;

interface CatalogSearchOutcome {
  teams: CompetitorTeam[];
  matches: CompetitionMatch[];
  athletes: AthleteProfile[];
}

/**
 * Aguarda por tempo especificado (para retry delays)
 */
const delayExecution = async (milliseconds: number): Promise<void> => {
  await new Promise((resolve) => window.setTimeout(resolve, milliseconds));
};

/**
 * Obtém timestamp de performance ou fallback
 */
const measureElapsedTime = (): number =>
  typeof performance !== 'undefined' ? performance.now() : Date.now();

/**
 * Constrói URL completa com query parameters
 */
const assembleApiUrl = (endpoint: string, queryParams?: QueryStringParameters): string => {
  if (!API_CONFIG.baseUrl) {
    throw new Error('URL base da API não foi configurada');
  }

  const urlBuilder = new URL(endpoint, API_CONFIG.baseUrl);
  Object.entries(queryParams ?? {}).forEach(([paramName, paramValue]) => {
    if (paramValue !== undefined && paramValue !== null && paramValue !== '') {
      urlBuilder.searchParams.set(paramName, String(paramValue));
    }
  });

  return urlBuilder.toString();
};

/**
 * Adaptador central para todos os dados do torneio
 */
class TournamentDataAdapter {
  constructor() {
    // Dados realistas baseados em mock data da Copa 2026
  }

  private async executeApiRequest<T>(endpoint: string, queryParams?: QueryStringParameters): Promise<T> {
    const connectivityState = useConnectivityState.getState();
    const appState = useTournamentState.getState();
    const operationStartTime = measureElapsedTime();
    let finalError: unknown;

    (connectivityState as any).initiateRequest();

    try {
      for (let attemptNumber = 0; attemptNumber <= API_CONFIG.retryAttempts; attemptNumber += 1) {
        try {
          const abortHandler = new AbortController();
          const timeoutHandle = window.setTimeout(() => abortHandler.abort(), API_CONFIG.timeoutMs);
          const remoteResponse = await fetch(assembleApiUrl(endpoint, queryParams), {
            headers: API_CONFIG.headers,
            signal: abortHandler.signal
          });
          window.clearTimeout(timeoutHandle);

          if (!remoteResponse.ok) {
            throw captureHttpFailure(remoteResponse.status, remoteResponse.statusText);
          }

          const responsePayload = (await remoteResponse.json()) as T;
          (connectivityState as any).markSuccessfulConnection(Math.round(measureElapsedTime() - operationStartTime));
          (appState as any).recordSyncTimestamp();
          return responsePayload;
        } catch (acquisitionError) {
          finalError = translateErrorToException(
            acquisitionError,
            'Não foi possível completar solicitação remota'
          );

          if (attemptNumber === API_CONFIG.retryAttempts || !shouldRetryRequest(finalError)) {
            break;
          }

          await delayExecution(API_CONFIG.retryDelayMs * (attemptNumber + 1));
        }
      }

      throw finalError instanceof Error ? finalError : translateErrorToException(finalError);
    } catch (acquisitionError) {
      const userMessage = translateErrorForDisplay(acquisitionError);
      (useConnectivityState.getState() as any).reportConnectionFailure(userMessage);
      throw translateErrorToException(acquisitionError);
    } finally {
      (connectivityState as any).concludeRequest();
    }
  }

  /**
   * Executa chamada de rede com fallback automático para dados mock
   */
  private async executeWithMockFallback<T>(
    networkExecution: () => Promise<T>,
    mockExecution: () => Promise<T>
  ): Promise<T> {
    if (!shouldUseNetworkFirst()) {
      return mockExecution();
    }

    try {
      return await networkExecution();
    } catch (networkError) {
      if (API_CONFIG.enableNetworkFallback) {
        return mockExecution();
      }

      throw networkError;
    }
  }

  /**
   * Busca todos os competidores
   */
  async fetchCompetitorTeams(): Promise<CompetitorTeam[]> {
    return this.executeWithMockFallback(
      () => this.executeApiRequest<CompetitorTeam[]>(API_ENDPOINTS.teams),
      () => mockTournamentDataProvider.fetchCompetitorTeams()
    );
  }

  /**
   * Busca competidor específico por ID
   */
  async fetchCompetitorById(teamId: CompetitorTeamId): Promise<CompetitorTeam | null> {
    return this.executeWithMockFallback(
      () => this.executeApiRequest<CompetitorTeam | null>(`${API_ENDPOINTS.teams}/${teamId}`),
      () => mockTournamentDataProvider.fetchCompetitorById(teamId)
    );
  }

  /**
   * Busca partidas com filtros opcionais
   */
  async fetchScheduledMatches(filters: MatchQueryFilters = {}): Promise<CompetitionMatch[]> {
    return this.executeWithMockFallback(
      () => this.executeApiRequest<CompetitionMatch[]>(API_ENDPOINTS.matches, filters as QueryStringParameters),
      () => mockTournamentDataProvider.fetchScheduledMatches(filters)
    );
  }

  /**
   * Busca atletas de um time ou todos
   */
  async fetchAthletes(teamId?: CompetitorTeamId): Promise<AthleteProfile[]> {
    return this.executeWithMockFallback(
      () => this.executeApiRequest<AthleteProfile[]>(API_ENDPOINTS.players, teamId ? { teamId } : undefined),
      () => mockTournamentDataProvider.fetchAthletes(teamId)
    );
  }

  /**
   * Busca detalhes de todos os estádios
   */
  async fetchVenueDetails(): Promise<VenueInformation[]> {
    return this.executeWithMockFallback(
      () => this.executeApiRequest<VenueInformation[]>(API_ENDPOINTS.stadiums),
      () => mockTournamentDataProvider.fetchVenueDetails()
    );
  }

  /**
   * Busca classificações dos grupos
   */
  async fetchGroupStandings(): Promise<GroupStandingsRecord[]> {
    return this.executeWithMockFallback(
      () => this.executeApiRequest<GroupStandingsRecord[]>(API_ENDPOINTS.standings),
      () => mockTournamentDataProvider.fetchGroupStandings()
    );
  }

  /**
   * Busca estatísticas globais do torneio
   */
  async fetchTournamentMetrics(): Promise<TournamentStatistics> {
    return this.executeWithMockFallback(
      () => this.executeApiRequest<TournamentStatistics>(API_ENDPOINTS.stats),
      () => mockTournamentDataProvider.fetchTournamentMetrics()
    );
  }

  /**
   * Busca catálogo por query de texto
   */
  async queryTournamentCatalog(searchQuery: string): Promise<CatalogSearchOutcome> {
    return this.executeWithMockFallback(
      () => this.executeApiRequest<CatalogSearchOutcome>(API_ENDPOINTS.search, { q: searchQuery }),
      () => mockTournamentDataProvider.queryTournamentCatalog(searchQuery)
    );
  }

  // Legacy method aliases para compatibilidade
  getTeams = () => this.fetchCompetitorTeams();
  getMatches = (filters?: MatchQueryFilters) => this.fetchScheduledMatches(filters);
  getStandings = () => this.fetchGroupStandings();
  getGlobalStats = () => this.fetchTournamentMetrics();
  getStadiums = () => this.fetchVenueDetails();
  getTeamById = (teamId: CompetitorTeamId) => this.fetchCompetitorById(teamId);
  getPlayers = (teamId?: CompetitorTeamId) => this.fetchAthletes(teamId);
  searchCatalog = (query: string) => this.queryTournamentCatalog(query);
}

export const tournamentDataAdapter = new TournamentDataAdapter();

// Legacy export para compatibilidade
export const apiService = tournamentDataAdapter;
