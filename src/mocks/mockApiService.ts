import { CACHE_KEYS, CACHE_DURATIONS } from '@constants/index';
import {
  globalStats,
  groupStandings,
  matches,
  players,
  playersByTeam,
  stadiums,
  teams,
  tournamentSummary
} from '@mocks/data';
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

const clone = <T>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
};

const wait = async (min = 120, max = 380): Promise<void> => {
  const duration = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise((resolve) => window.setTimeout(resolve, duration));
};

class MockApiService {
  readonly cacheHints = {
    teams: CACHE_DURATIONS.day,
    matches: CACHE_DURATIONS.medium,
    players: CACHE_DURATIONS.long,
    stadiums: CACHE_DURATIONS.day,
    standings: CACHE_DURATIONS.medium,
    stats: CACHE_DURATIONS.short
  } as const;

  readonly cacheKeys = CACHE_KEYS;

  private async respond<T>(value: T): Promise<T> {
    await wait();
    return clone(value);
  }

  async getTeams(): Promise<Team[]> {
    return this.respond(teams);
  }

  async getTeamById(teamId: TeamId): Promise<Team | null> {
    return this.respond(teams.find((team) => team.id === teamId) ?? null);
  }

  async getMatches(filters: MatchFilters = {}): Promise<Match[]> {
    const filtered = matches
      .filter((match) => (filters.phase ? match.phase === filters.phase : true))
      .filter((match) => (filters.status ? match.status === filters.status : true))
      .filter((match) =>
        filters.teamId ? match.homeTeamId === filters.teamId || match.awayTeamId === filters.teamId : true
      );

    return this.respond(filters.limit ? filtered.slice(0, filters.limit) : filtered);
  }

  async getMatchById(matchId: string): Promise<Match | null> {
    return this.respond(matches.find((match) => match.id === matchId) ?? null);
  }

  async getPlayers(teamId?: TeamId): Promise<Player[]> {
    return this.respond(teamId ? (playersByTeam[teamId] ?? []) : players);
  }

  async getStadiums(): Promise<Stadium[]> {
    return this.respond(stadiums);
  }

  async getStandings(): Promise<GroupStandings[]> {
    return this.respond(groupStandings);
  }

  async getGlobalStats(): Promise<GlobalStats> {
    return this.respond(globalStats);
  }

  async getTournamentSummary(): Promise<typeof tournamentSummary> {
    return this.respond(tournamentSummary);
  }

  async search(query: string): Promise<SearchResult> {
    const term = query.trim().toLowerCase();
    if (!term) {
      return this.respond({ teams: [], matches: [], players: [] });
    }

    const matchedTeams = teams.filter(
      (team) => team.name.toLowerCase().includes(term) || team.code.toLowerCase().includes(term)
    );
    const matchedPlayers = players.filter((player) => player.name.toLowerCase().includes(term)).slice(0, 12);
    const matchedTeamIds = new Set(matchedTeams.map((team) => team.id));
    const matchedMatches = matches.filter(
      (match) => matchedTeamIds.has(match.homeTeamId) || matchedTeamIds.has(match.awayTeamId)
    );

    return this.respond({
      teams: matchedTeams,
      matches: matchedMatches.slice(0, 12),
      players: matchedPlayers
    });
  }
}

export const mockApiService = new MockApiService();
