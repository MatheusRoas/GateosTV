import { API_CONFIG, API_ENDPOINTS, shouldUseNetworkFirst } from '@config/api';
import { mockApiService } from '@mocks/mockApiService';
import { useAppStore } from '@store/appStore';
import { useConnectionStore } from '@store/connectionStore';
import { createHttpError, getUserFacingErrorMessage, isRetryableError, normalizeError } from '@utils/errors';
import type { GlobalStats, GroupStandings, Match, MatchPhase, MatchStatus, Player, Stadium, Team, TeamId } from '@/types';

interface MatchFilters {
  phase?: MatchPhase;
  status?: MatchStatus;
  teamId?: TeamId;
  limit?: number;
}

interface SearchResult {
  teams: Team[];
  matches: Match[];
  players: Player[];
}

const delay = async (ms: number): Promise<void> => {
  await new Promise((resolve) => window.setTimeout(resolve, ms));
};

const getTimestamp = (): number => (typeof performance !== 'undefined' ? performance.now() : Date.now());

const buildUrl = (endpoint: string, query?: Record<string, string | number | undefined>): string => {
  if (!API_CONFIG.baseUrl) {
    throw new Error('La base URL de la API no esta configurada');
  }

  const url = new URL(endpoint, API_CONFIG.baseUrl);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

class ApiService {
  private async request<T>(endpoint: string, query?: Record<string, string | number | undefined>): Promise<T> {
    const connectionStore = useConnectionStore.getState();
    const startTime = getTimestamp();
    let lastError: unknown;

    connectionStore.startRequest();

    try {
      for (let attempt = 0; attempt <= API_CONFIG.retryAttempts; attempt += 1) {
        try {
          const controller = new AbortController();
          const timeoutId = window.setTimeout(() => controller.abort(), API_CONFIG.timeoutMs);
          const response = await fetch(buildUrl(endpoint, query), {
            headers: API_CONFIG.headers,
            signal: controller.signal
          });
          window.clearTimeout(timeoutId);

          if (!response.ok) {
            throw createHttpError(response.status, response.statusText);
          }

          const payload = (await response.json()) as T;
          connectionStore.markHealthy(Math.round(getTimestamp() - startTime));
          useAppStore.getState().markSynced();
          return payload;
        } catch (error) {
          lastError = normalizeError(error, 'No se ha podido completar la solicitud remota');

          if (attempt === API_CONFIG.retryAttempts || !isRetryableError(lastError)) {
            break;
          }

          await delay(API_CONFIG.retryDelayMs * (attempt + 1));
        }
      }

      throw lastError instanceof Error ? lastError : normalizeError(lastError);
    } catch (error) {
      const message = getUserFacingErrorMessage(error);
      useConnectionStore.getState().setError(message);
      throw normalizeError(error);
    } finally {
      useConnectionStore.getState().finishRequest();
    }
  }

  private async withFallback<T>(networkCall: () => Promise<T>, mockCall: () => Promise<T>): Promise<T> {
    if (!shouldUseNetworkFirst()) {
      return mockCall();
    }

    try {
      return await networkCall();
    } catch (error) {
      if (API_CONFIG.enableNetworkFallback) {
        return mockCall();
      }

      throw error;
    }
  }

  async getTeams(): Promise<Team[]> {
    return this.withFallback(() => this.request<Team[]>(API_ENDPOINTS.teams), () => mockApiService.getTeams());
  }

  async getTeamById(teamId: TeamId): Promise<Team | null> {
    return this.withFallback(
      () => this.request<Team | null>(`${API_ENDPOINTS.teams}/${teamId}`),
      () => mockApiService.getTeamById(teamId)
    );
  }

  async getMatches(filters: MatchFilters = {}): Promise<Match[]> {
    return this.withFallback(
      () => this.request<Match[]>(API_ENDPOINTS.matches, filters),
      () => mockApiService.getMatches(filters)
    );
  }

  async getPlayers(teamId?: TeamId): Promise<Player[]> {
    return this.withFallback(
      () => this.request<Player[]>(API_ENDPOINTS.players, teamId ? { teamId } : undefined),
      () => mockApiService.getPlayers(teamId)
    );
  }

  async getStadiums(): Promise<Stadium[]> {
    return this.withFallback(
      () => this.request<Stadium[]>(API_ENDPOINTS.stadiums),
      () => mockApiService.getStadiums()
    );
  }

  async getStandings(): Promise<GroupStandings[]> {
    return this.withFallback(
      () => this.request<GroupStandings[]>(API_ENDPOINTS.standings),
      () => mockApiService.getStandings()
    );
  }

  async getGlobalStats(): Promise<GlobalStats> {
    return this.withFallback(
      () => this.request<GlobalStats>(API_ENDPOINTS.stats),
      () => mockApiService.getGlobalStats()
    );
  }

  async search(query: string): Promise<SearchResult> {
    return this.withFallback(
      () => this.request<SearchResult>(API_ENDPOINTS.search, { q: query }),
      () => mockApiService.search(query)
    );
  }
}

export const apiService = new ApiService();
