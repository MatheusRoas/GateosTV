/**
 * ApiFootballClient - Integração com API-Football (RapidAPI)
 * Fornece dados reais da Copa 2026 em tempo real
 * Documentação: https://rapidapi.com/api-sports/api/api-football
 */

import type { CompetitorTeam, CompetitionMatch, AthleteProfile, VenueInformation, TournamentStatistics } from '@domain/entities/TournamentDomain';
import { TournamentException, captureHttpFailure, translateErrorToException } from '@domain/exceptions/TournamentException';

interface RapidApiLeague {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  start: string;
  end: string;
  current: boolean;
  coverage: {
    fixtures: { events: boolean; lineups: boolean; statistics_fixtures: boolean; statistics_players: boolean };
    standings: boolean;
    players: boolean;
    top_scorers: boolean;
    predictions: boolean;
    odds: boolean;
  };
}

interface RapidApiTeam {
  id: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  national: boolean;
  logo: string;
}

interface RapidApiFixture {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: { first: number | null; second: number | null };
  venue: { id: number; name: string; city: string };
  status: { long: string; short: string; elapsed: number | null };
}

interface RapidApiTeamsResponse {
  get: string;
  parameters: { league: string; season: string };
  errors: string[];
  results: number;
  paging: { current: number; total: number };
  response: Array<{ team: RapidApiTeam; venue: any }>;
}

interface RapidApiFixturesResponse {
  get: string;
  parameters: { league: string; season: string };
  errors: string[];
  results: number;
  paging: { current: number; total: number };
  response: Array<{
    fixture: RapidApiFixture;
    league: RapidApiLeague;
    teams: { home: RapidApiTeam; away: RapidApiTeam };
    goals: { home: number | null; away: number | null };
    score: { halftime: { home: number | null; away: number | null }; fulltime: { home: number | null; away: number | null } };
    statistics: Array<{ team: RapidApiTeam; statistics: Array<{ type: string; value: number | string | null }> }>;
  }>;
}

interface RapidApiStandingsResponse {
  get: string;
  parameters: { league: string; season: string };
  errors: string[];
  results: number;
  paging: { current: number; total: number };
  response: Array<{
    league: {
      id: number;
      name: string;
      country: string;
      logo: string;
      flag: string;
      season: number;
      standings: Array<
        Array<{
          rank: number;
          team: RapidApiTeam;
          points: number;
          goalsDiff: number;
          group: string;
          form: string;
          status: string;
          description: string;
          all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
          home: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
          away: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
          update: string;
        }>
      >;
    };
  }>;
}

export class ApiFootballClient {
  private baseUrl = 'https://api-football-v3.p.rapidapi.com';
  private apiKey: string;
  private timeout: number;

  constructor(apiKey: string, timeoutMs: number = 10000) {
    this.apiKey = apiKey.trim();
    this.timeout = timeoutMs;

    if (!this.apiKey) {
      throw new TournamentException('API Key for API-Football não configurada. Configure VITE_API_FOOTBALL_KEY no .env', {
        errorCode: 'validation_failure'
      });
    }
  }

  /**
   * Executa requisição para API-Football com headers corretos
   */
  private async executeRequest<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'api-football-v3.p.rapidapi.com',
          'Accept': 'application/json'
        },
        signal: controller.signal
      });

      if (!response.ok) {
        const httpException = captureHttpFailure(response.status, response.statusText);
        throw httpException;
      }

      const data = (await response.json()) as { response?: T; errors?: Record<string, string> };

      if (data.errors && Object.keys(data.errors).length > 0) {
        throw new TournamentException(`API-Football retornou erros: ${JSON.stringify(data.errors)}`, {
          errorCode: 'server_error',
          httpStatusCode: 400
        });
      }

      return (data.response || []) as T;
    } catch (error) {
      if (error instanceof TournamentException) {
        throw error;
      }
      throw translateErrorToException(error, `Erro ao chamar API-Football: ${endpoint}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Obtém todos os times da Copa 2026
   * API-Football usa league_id=679 para Copa 2026
   */
  async fetchTeams(season: number = 2026): Promise<CompetitorTeam[]> {
    const response = await this.executeRequest<Array<{ team: RapidApiTeam; venue: any }>>('/teams', {
      league: '679', // Copa 2026
      season
    });

    return response.map((item) => ({
      id: String(item.team.id) as any,
      name: item.team.name,
      code: item.team.code,
      flag: item.team.logo,
      logo: item.team.logo,
      group: 'A' as any, // Será atualizado via standings
      playersCount: 26,
      fifaRanking: 0 // API-Football não fornece ranking FIFA diretamente
    }));
  }

  /**
   * Obtém todos os jogos da Copa 2026
   */
  async fetchMatches(season: number = 2026): Promise<CompetitionMatch[]> {
    const response = await this.executeRequest<
      Array<{
        fixture: RapidApiFixture;
        league: RapidApiLeague;
        teams: { home: RapidApiTeam; away: RapidApiTeam };
        goals: { home: number | null; away: number | null };
        score: { halftime: { home: number | null; away: number | null } };
        statistics: Array<any>;
      }>
    >('/fixtures', {
      league: '679',
      season
    });

    return response.map((match) => {
      const statusMap: Record<string, any> = {
        'Match Finished': 'finished',
        'Match Cancelled': 'cancelled',
        'Match Postponed': 'postponed',
        'Not Started': 'scheduled',
        'In Play': 'live',
        'Halftime': 'live',
        'After Extra Time': 'finished',
        'Penalties': 'finished'
      };

      const phaseMap: Record<string, any> = {
        'Group Stage': 'group',
        'Round of 16': 'round-of-16',
        'Quarter-finals': 'quarter-finals',
        'Semi-finals': 'semi-finals',
        'Third Place': 'third-place',
        'Final': 'final'
      };

      return {
        id: String(match.fixture.id) as any,
        homeTeamId: String(match.teams.home.id) as any,
        awayTeamId: String(match.teams.away.id) as any,
        date: match.fixture.date.split('T')[0],
        time: match.fixture.date.split('T')[1]?.substring(0, 5) || '15:00',
        status: statusMap[match.fixture.status.long] || 'scheduled',
        phase: phaseMap[match.league.name] || 'group',
        stadiumId: String(match.fixture.venue.id || 'unknown') as any,
        referee: match.fixture.referee || undefined,
        homeTeamGoals: match.goals.home ?? 0,
        awayTeamGoals: match.goals.away ?? 0,
        homeTeamShots: this.extractStatistic(match.statistics, match.teams.home.id, 'Shots on Goal'),
        awayTeamShots: this.extractStatistic(match.statistics, match.teams.away.id, 'Shots on Goal'),
        homeTeamPossession: this.extractStatistic(match.statistics, match.teams.home.id, 'Ball Possession')
      } as CompetitionMatch;
    });
  }

  /**
   * Extrai estatística de um jogo
   */
  private extractStatistic(statistics: Array<any>, teamId: number, statType: string): number | undefined {
    const teamStats = statistics.find((s) => s.team.id === teamId);
    if (!teamStats) return undefined;

    const stat = teamStats.statistics.find((s: any) => s.type === statType);
    return stat ? Number(stat.value) || undefined : undefined;
  }

  /**
   * Obtém classificações por grupo
   */
  async fetchStandings(season: number = 2026): Promise<any[]> {
    const response = await this.executeRequest<any[]>('/standings', {
      league: '679',
      season
    });

    return response;
  }

  /**
   * Obtém jogadores (limite de requisições - considere cache)
   */
  async fetchPlayers(teamId: number): Promise<AthleteProfile[]> {
    try {
      const response = await this.executeRequest<
        Array<{
          player: {
            id: number;
            name: string;
            age: number;
            photo: string;
            nationality: string;
            height: string;
            weight: string;
          };
          statistics: Array<{ appearances: number; lineups: number; minutes: number; goals: number; assists: number }>;
        }>
      >('/players', {
        team: teamId,
        season: 2026
      });

      return response
        .filter((p) => p.statistics && p.statistics.length > 0)
        .map((p) => ({
          id: String(p.player.id) as any,
          name: p.player.name,
          teamId: String(teamId) as any,
          position: 'MID' as any,
          number: 0,
          age: p.player.age || 25,
          goals: p.statistics[0]?.goals || 0,
          assists: p.statistics[0]?.assists || 0,
          appearances: p.statistics[0]?.appearances || 0,
          photo: p.player.photo
        }));
    } catch (error) {
      // Jogadores é um endpoint premium, retornar array vazio se falhar
      return [];
    }
  }

  /**
   * Obtém informações de estádios
   */
  async fetchStadiums(): Promise<VenueInformation[]> {
    // API-Football não tem endpoint direto de estádios
    // Extrair de fixtures
    const matches = await this.fetchMatches();
    const stadiumsMap = new Map<string, VenueInformation>();

    matches.forEach((match) => {
      if (!stadiumsMap.has(match.stadiumId)) {
        stadiumsMap.set(match.stadiumId, {
          id: match.stadiumId,
          name: `Stadium ${match.stadiumId}`,
          city: 'Unknown',
          country: 'Unknown',
          capacity: 50000,
          matchesPlayed: 0
        });
      }
    });

    return Array.from(stadiumsMap.values());
  }

  /**
   * Obtém estatísticas do torneio (gols totais, etc)
   */
  async fetchTournamentStats(): Promise<TournamentStatistics> {
    const matches = await this.fetchMatches();

    const totalGoals = matches.reduce((sum, m) => sum + (m.homeTeamGoals + m.awayTeamGoals), 0);
    const finishedMatches = matches.filter((m) => m.status === 'finished').length;
    const topScorerTeam = matches[0]?.homeTeamId || '';

    return {
      totalMatches: matches.length,
      completedMatches: finishedMatches,
      totalGoals,
      averageGoalsPerMatch: finishedMatches > 0 ? Number((totalGoals / finishedMatches).toFixed(2)) : 0,
      topScorer: {
        name: 'Loading...',
        goals: 0,
        team: topScorerTeam,
        club: 'TBD'
      }
    };
  }
}
