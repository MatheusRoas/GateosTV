import { GROUP_LABELS, HOST_NATIONS, TOTAL_MATCHES, TOTAL_TEAMS } from '@constants/index';
import type {
  GlobalStats,
  GroupStandings,
  Match,
  MatchPhase,
  MatchStatus,
  Player,
  Stadium,
  Team,
  TeamGroup,
  TeamId,
  TeamStanding
} from '@/types';

// NOTE: Mock data uses string IDs which are cast to branded types at runtime.
// Type checking is lenient to allow string literal patterns for demonstration data.
// In production code, use proper type constructors or factories.

interface TeamSeed {
  id: TeamId;
  name: string;
  code: string;
  countryCode: string;
  group: TeamGroup;
  fifaRanking: number;
}

interface StadiumSeed {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
}

interface ProjectedMatch {
  match: Match;
  winnerId: TeamId;
  loserId: TeamId;
}

const TEAM_SEEDS: readonly TeamSeed[] = [
  { id: 'mexico', name: 'Mexico', code: 'MEX', countryCode: 'MX', group: 'A', fifaRanking: 15 },
  { id: 'switzerland', name: 'Suiza', code: 'SUI', countryCode: 'CH', group: 'A', fifaRanking: 18 },
  { id: 'ghana', name: 'Ghana', code: 'GHA', countryCode: 'GH', group: 'A', fifaRanking: 52 },
  { id: 'uzbekistan', name: 'Uzbekistan', code: 'UZB', countryCode: 'UZ', group: 'A', fifaRanking: 66 },
  { id: 'usa', name: 'Estados Unidos', code: 'USA', countryCode: 'US', group: 'B', fifaRanking: 12 },
  { id: 'uruguay', name: 'Uruguay', code: 'URU', countryCode: 'UY', group: 'B', fifaRanking: 11 },
  { id: 'japan', name: 'Japon', code: 'JPN', countryCode: 'JP', group: 'B', fifaRanking: 17 },
  { id: 'mali', name: 'Mali', code: 'MLI', countryCode: 'ML', group: 'B', fifaRanking: 44 },
  { id: 'canada', name: 'Canada', code: 'CAN', countryCode: 'CA', group: 'C', fifaRanking: 31 },
  { id: 'colombia', name: 'Colombia', code: 'COL', countryCode: 'CO', group: 'C', fifaRanking: 9 },
  { id: 'south-korea', name: 'Corea del Sur', code: 'KOR', countryCode: 'KR', group: 'C', fifaRanking: 24 },
  { id: 'saudi-arabia', name: 'Arabia Saudi', code: 'KSA', countryCode: 'SA', group: 'C', fifaRanking: 53 },
  { id: 'argentina', name: 'Argentina', code: 'ARG', countryCode: 'AR', group: 'D', fifaRanking: 1 },
  { id: 'denmark', name: 'Dinamarca', code: 'DEN', countryCode: 'DK', group: 'D', fifaRanking: 21 },
  { id: 'nigeria', name: 'Nigeria', code: 'NGA', countryCode: 'NG', group: 'D', fifaRanking: 38 },
  { id: 'new-zealand', name: 'Nueva Zelanda', code: 'NZL', countryCode: 'NZ', group: 'D', fifaRanking: 82 },
  { id: 'brazil', name: 'Brasil', code: 'BRA', countryCode: 'BR', group: 'E', fifaRanking: 5 },
  { id: 'serbia', name: 'Serbia', code: 'SRB', countryCode: 'RS', group: 'E', fifaRanking: 33 },
  { id: 'ivory-coast', name: 'Costa de Marfil', code: 'CIV', countryCode: 'CI', group: 'E', fifaRanking: 41 },
  { id: 'honduras', name: 'Honduras', code: 'HON', countryCode: 'HN', group: 'E', fifaRanking: 75 },
  { id: 'spain', name: 'España', code: 'ESP', countryCode: 'ES', group: 'F', fifaRanking: 3 },
  { id: 'morocco', name: 'Marruecos', code: 'MAR', countryCode: 'MA', group: 'F', fifaRanking: 13 },
  { id: 'ecuador', name: 'Ecuador', code: 'ECU', countryCode: 'EC', group: 'F', fifaRanking: 27 },
  { id: 'jamaica', name: 'Jamaica', code: 'JAM', countryCode: 'JM', group: 'F', fifaRanking: 56 },
  { id: 'france', name: 'Francia', code: 'FRA', countryCode: 'FR', group: 'G', fifaRanking: 2 },
  { id: 'poland', name: 'Polonia', code: 'POL', countryCode: 'PL', group: 'G', fifaRanking: 28 },
  { id: 'cameroon', name: 'Camerun', code: 'CMR', countryCode: 'CM', group: 'G', fifaRanking: 47 },
  { id: 'iraq', name: 'Irak', code: 'IRQ', countryCode: 'IQ', group: 'G', fifaRanking: 61 },
  { id: 'england', name: 'Inglaterra', code: 'ENG', countryCode: 'GB', group: 'H', fifaRanking: 4 },
  { id: 'croatia', name: 'Croacia', code: 'CRO', countryCode: 'HR', group: 'H', fifaRanking: 10 },
  { id: 'egypt', name: 'Egipto', code: 'EGY', countryCode: 'EG', group: 'H', fifaRanking: 36 },
  { id: 'australia', name: 'Australia', code: 'AUS', countryCode: 'AU', group: 'H', fifaRanking: 25 },
  { id: 'germany', name: 'Alemania', code: 'GER', countryCode: 'DE', group: 'I', fifaRanking: 7 },
  { id: 'senegal', name: 'Senegal', code: 'SEN', countryCode: 'SN', group: 'I', fifaRanking: 19 },
  { id: 'peru', name: 'Peru', code: 'PER', countryCode: 'PE', group: 'I', fifaRanking: 35 },
  { id: 'qatar', name: 'Qatar', code: 'QAT', countryCode: 'QA', group: 'I', fifaRanking: 58 },
  { id: 'portugal', name: 'Portugal', code: 'POR', countryCode: 'PT', group: 'J', fifaRanking: 6 },
  { id: 'austria', name: 'Austria', code: 'AUT', countryCode: 'AT', group: 'J', fifaRanking: 22 },
  { id: 'algeria', name: 'Argelia', code: 'ALG', countryCode: 'DZ', group: 'J', fifaRanking: 42 },
  { id: 'costa-rica', name: 'Costa Rica', code: 'CRC', countryCode: 'CR', group: 'J', fifaRanking: 48 },
  { id: 'netherlands', name: 'Paises Bajos', code: 'NED', countryCode: 'NL', group: 'K', fifaRanking: 8 },
  { id: 'ukraine', name: 'Ucrania', code: 'UKR', countryCode: 'UA', group: 'K', fifaRanking: 26 },
  { id: 'iran', name: 'Iran', code: 'IRN', countryCode: 'IR', group: 'K', fifaRanking: 23 },
  { id: 'panama', name: 'Panama', code: 'PAN', countryCode: 'PA', group: 'K', fifaRanking: 45 },
  { id: 'belgium', name: 'Belgica', code: 'BEL', countryCode: 'BE', group: 'L', fifaRanking: 14 },
  { id: 'turkey', name: 'Turquia', code: 'TUR', countryCode: 'TR', group: 'L', fifaRanking: 29 },
  { id: 'tunisia', name: 'Tunez', code: 'TUN', countryCode: 'TN', group: 'L', fifaRanking: 40 },
  { id: 'chile', name: 'Chile', code: 'CHI', countryCode: 'CL', group: 'L', fifaRanking: 51 }
] as const;

const STADIUM_SEEDS: readonly StadiumSeed[] = [
  { id: 'azteca', name: 'Estadio Azteca', city: 'Ciudad de Mexico', country: 'Mexico', capacity: 87523 },
  { id: 'bbva', name: 'Estadio BBVA', city: 'Monterrey', country: 'Mexico', capacity: 53500 },
  { id: 'akron', name: 'Estadio Akron', city: 'Guadalajara', country: 'Mexico', capacity: 49850 },
  { id: 'bc-place', name: 'BC Place', city: 'Vancouver', country: 'Canada', capacity: 54500 },
  { id: 'bmo-field', name: 'BMO Field', city: 'Toronto', country: 'Canada', capacity: 45000 },
  { id: 'metlife', name: 'MetLife Stadium', city: 'Nueva Jersey', country: 'Estados Unidos', capacity: 82500 },
  { id: 'sofi', name: 'SoFi Stadium', city: 'Los Angeles', country: 'Estados Unidos', capacity: 70240 },
  { id: 'att', name: 'AT&T Stadium', city: 'Dallas', country: 'Estados Unidos', capacity: 80000 },
  { id: 'mercedes-benz', name: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'Estados Unidos', capacity: 71000 },
  { id: 'nrg', name: 'NRG Stadium', city: 'Houston', country: 'Estados Unidos', capacity: 72220 },
  { id: 'hard-rock', name: 'Hard Rock Stadium', city: 'Miami', country: 'Estados Unidos', capacity: 64767 },
  { id: 'levi', name: 'Levi\'s Stadium', city: 'San Francisco Bay', country: 'Estados Unidos', capacity: 68500 },
  { id: 'lumen', name: 'Lumen Field', city: 'Seattle', country: 'Estados Unidos', capacity: 68740 },
  { id: 'lincoln-financial', name: 'Lincoln Financial Field', city: 'Filadelfia', country: 'Estados Unidos', capacity: 69596 },
  { id: 'arrowhead', name: 'Arrowhead Stadium', city: 'Kansas City', country: 'Estados Unidos', capacity: 76416 },
  { id: 'gillette', name: 'Gillette Stadium', city: 'Boston', country: 'Estados Unidos', capacity: 65878 }
] as const;

const POSITION_PATTERN = ['GK', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'FWD', 'FWD'] as const;
const SHIRT_NUMBERS = [1, 2, 4, 5, 6, 8, 10, 9] as const;
const PLAYER_FIRST_NAMES = [
  'Adrian',
  'Mateo',
  'Lucas',
  'Daniel',
  'Samuel',
  'Hugo',
  'Nicolas',
  'Julian',
  'Leo',
  'Bruno',
  'Thiago',
  'Martin',
  'Ruben',
  'Marco',
  'Ilias',
  'Noah'
] as const;
const PLAYER_LAST_NAMES = [
  'Silva',
  'Mendez',
  'Costa',
  'Pereira',
  'Torres',
  'Navarro',
  'Khan',
  'Santos',
  'Diaz',
  'Romero',
  'Vega',
  'Campos',
  'Bennani',
  'Arias',
  'Lopez',
  'Serrano'
] as const;
const CLUBS = [
  'Real Madrid',
  'Manchester City',
  'Barcelona',
  'Bayern Munich',
  'Paris Saint-Germain',
  'Inter',
  'Benfica',
  'Porto',
  'Ajax',
  'River Plate',
  'Club America',
  'Monterrey',
  'LAFC',
  'Flamengo',
  'Boca Juniors',
  'Fenerbahce'
] as const;
const REFEREES = [
  'Szymon Marciniak',
  'Clement Turpin',
  'Danny Makkelie',
  'Facundo Tello',
  'Anthony Taylor',
  'Wilton Sampaio',
  'Alireza Faghani',
  'Ivan Barton',
  'Cesar Ramos',
  'Ismail Elfath'
] as const;
const GROUP_FIXTURES = [
  [0, 1],
  [2, 3],
  [0, 2],
  [1, 3],
  [0, 3],
  [1, 2]
] as const;
const GROUP_TIMES = ['13:00', '16:00', '19:00', '22:00'] as const;
const KNOCKOUT_TIMES = ['14:00', '17:00', '20:00'] as const;

const toIsoDate = (baseDate: string, offsetDays: number): string => {
  const date = new Date(`${baseDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
};

const toFlagEmoji = (countryCode: string): string =>
  countryCode
    .toUpperCase()
    .replace(/./g, (letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)));

const normalizeGoals = (value: number): number => Math.max(0, Math.min(4, value));

const getFinishedMetrics = (homeGoals: number, awayGoals: number, seed: number) => {
  const homePossession = Math.max(36, Math.min(64, 50 + (homeGoals - awayGoals) * 4 + ((seed % 5) - 2) * 3));

  return {
    homeTeamPossession: homePossession,
    homeTeamShots: 8 + homeGoals * 3 + (seed % 4),
    awayTeamShots: 7 + awayGoals * 3 + ((seed + 2) % 4),
    homeTeamCorners: 3 + homeGoals + (seed % 3),
    awayTeamCorners: 2 + awayGoals + ((seed + 1) % 3)
  };
};

const calculateScore = (home: Team, away: Team, seed: number, knockout = false): [number, number] => {
  const homeStrength = 80 - home.fifaRanking;
  const awayStrength = 80 - away.fifaRanking;
  let homeGoals = normalizeGoals(Math.round(homeStrength / 24 + ((seed * 3) % 4) / 2));
  let awayGoals = normalizeGoals(Math.round(awayStrength / 25 + ((seed * 5) % 4) / 2));

  if (home.fifaRanking < away.fifaRanking) {
    homeGoals = normalizeGoals(homeGoals + 1);
  } else if (away.fifaRanking < home.fifaRanking) {
    awayGoals = normalizeGoals(awayGoals + 1);
  }

  if (!knockout && (seed + home.fifaRanking + away.fifaRanking) % 4 === 0) {
    const drawGoals = Math.min(homeGoals, awayGoals);
    homeGoals = drawGoals;
    awayGoals = drawGoals;
  }

  if (knockout && homeGoals === awayGoals) {
    if (home.fifaRanking <= away.fifaRanking) {
      homeGoals += 1;
    } else {
      awayGoals += 1;
    }
  }

  return [homeGoals, awayGoals];
};

const buildTeams = (): Team[] =>
  TEAM_SEEDS.map((team) => ({
    id: team.id,
    name: team.name,
    code: team.code,
    group: team.group,
    fifaRanking: team.fifaRanking,
    playersCount: 26,
    flag: toFlagEmoji(team.countryCode),
    logo: `https://flagcdn.com/w160/${team.countryCode.toLowerCase()}.png`
  }));

const buildPlayers = (teams: Team[]): Player[] =>
  teams.flatMap((team, teamIndex) =>
    POSITION_PATTERN.map((position, playerIndex) => {
      const nameSeed = teamIndex * POSITION_PATTERN.length + playerIndex;
      const firstName = PLAYER_FIRST_NAMES[nameSeed % PLAYER_FIRST_NAMES.length];
      const lastName = PLAYER_LAST_NAMES[(nameSeed + team.name.length) % PLAYER_LAST_NAMES.length];
      const appearances = 3 + (nameSeed % 4);
      const goals =
        position === 'FWD'
          ? 2 + (nameSeed % 5)
          : position === 'MID'
            ? nameSeed % 3
            : position === 'DEF'
              ? nameSeed % 2
              : 0;
      const assists = position === 'GK' ? 0 : (nameSeed + 1) % 4;

      return {
        id: `${team.id}-${playerIndex + 1}`,
        name: `${firstName} ${lastName}`,
        teamId: team.id,
        position,
        number: SHIRT_NUMBERS[playerIndex],
        age: 21 + ((nameSeed + team.fifaRanking) % 12),
        goals,
        assists,
        appearances,
        club: CLUBS[(nameSeed + teamIndex) % CLUBS.length]
      } satisfies Player;
    })
  );

const createEmptyStadiums = (): Stadium[] =>
  STADIUM_SEEDS.map((stadium) => ({
    ...stadium,
    matchesPlayed: 0
  }));

const buildGroupMatches = (teams: Team[], stadiums: Stadium[]): Match[] => {
  const groupedTeams = GROUP_LABELS.map((group) => teams.filter((team) => team.group === group));
  const matches: Match[] = [];

  groupedTeams.forEach((groupTeams, groupIndex) => {
    GROUP_FIXTURES.forEach(([homeIndex, awayIndex], fixtureIndex) => {
      const homeTeam = groupTeams[homeIndex];
      const awayTeam = groupTeams[awayIndex];
      const [homeGoals, awayGoals] = calculateScore(homeTeam, awayTeam, groupIndex * 10 + fixtureIndex);
      const date = toIsoDate('2026-06-11', Math.floor(matches.length / 4));
      const time = GROUP_TIMES[matches.length % GROUP_TIMES.length];
      const stadium = stadiums[matches.length % stadiums.length];
      const metrics = getFinishedMetrics(homeGoals, awayGoals, matches.length);

      matches.push({
        id: `group-${groupTeams[0].group.toLowerCase()}-${fixtureIndex + 1}`,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        date,
        time,
        status: 'finished',
        phase: 'group',
        stadiumId: stadium.id,
        referee: REFEREES[matches.length % REFEREES.length],
        homeTeamGoals: homeGoals,
        awayTeamGoals: awayGoals,
        ...metrics
      });
    });
  });

  return matches;
};

const computeStandings = (teams: Team[], matches: Match[]): GroupStandings[] => {
  const teamMap = new Map(teams.map((team) => [team.id, team]));

  return GROUP_LABELS.map((group) => {
    const groupTeams = teams.filter((team) => team.group === group);
    const baseTable = new Map<TeamId, TeamStanding>(
      groupTeams.map((team) => [
        team.id,
        {
          teamId: team.id,
          teamName: team.name,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
          qualified: false
        }
      ])
    );

    matches
      .filter((match) => match.phase === 'group')
      .filter((match) => teamMap.get(match.homeTeamId)?.group === group)
      .forEach((match) => {
        const home = baseTable.get(match.homeTeamId);
        const away = baseTable.get(match.awayTeamId);

        if (!home || !away) {
          return;
        }

        home.played += 1;
        away.played += 1;
        home.goalsFor += match.homeTeamGoals;
        home.goalsAgainst += match.awayTeamGoals;
        away.goalsFor += match.awayTeamGoals;
        away.goalsAgainst += match.homeTeamGoals;

        if (match.homeTeamGoals > match.awayTeamGoals) {
          home.wins += 1;
          away.losses += 1;
          home.points += 3;
        } else if (match.homeTeamGoals < match.awayTeamGoals) {
          away.wins += 1;
          home.losses += 1;
          away.points += 3;
        } else {
          home.draws += 1;
          away.draws += 1;
          home.points += 1;
          away.points += 1;
        }
      });

    const sorted = [...baseTable.values()].sort((first, second) => {
      const firstDifference = first.goalsFor - first.goalsAgainst;
      const secondDifference = second.goalsFor - second.goalsAgainst;

      return (
        second.points - first.points ||
        secondDifference - firstDifference ||
        second.goalsFor - first.goalsFor ||
        (teamMap.get(first.teamId)?.fifaRanking ?? 99) - (teamMap.get(second.teamId)?.fifaRanking ?? 99)
      );
    });

    sorted.forEach((entry) => {
      entry.goalDifference = entry.goalsFor - entry.goalsAgainst;
    });

    return {
      group,
      teams: sorted
    };
  });
};

const markQualifiedTeams = (standings: GroupStandings[], teams: Team[]): GroupStandings[] => {
  const teamMap = new Map(teams.map((team) => [team.id, team]));
  const thirdPlaced = standings
    .map((groupStanding) => groupStanding.teams[2])
    .sort(
      (first, second) =>
        second.points - first.points ||
        second.goalDifference - first.goalDifference ||
        second.goalsFor - first.goalsFor ||
        (teamMap.get(first.teamId)?.fifaRanking ?? 99) - (teamMap.get(second.teamId)?.fifaRanking ?? 99)
    );

  const bestThirdIds = new Set(thirdPlaced.slice(0, 8).map((team) => team.teamId));

  return standings.map((standing) => ({
    ...standing,
    teams: standing.teams.map((team, index) => ({
      ...team,
      qualified: index < 2 || bestThirdIds.has(team.teamId)
    }))
  }));
};

const projectWinner = (homeTeam: Team, awayTeam: Team, seed: number): { winnerId: TeamId; loserId: TeamId } => {
  const [homeGoals, awayGoals] = calculateScore(homeTeam, awayTeam, 100 + seed, true);
  return homeGoals >= awayGoals
    ? { winnerId: homeTeam.id, loserId: awayTeam.id }
    : { winnerId: awayTeam.id, loserId: homeTeam.id };
};

const buildKnockoutRound = (
  phase: MatchPhase,
  pairs: Array<[Team, Team]>,
  startDate: string,
  stadiumOffset: number,
  statusBuilder: (index: number) => MatchStatus
): ProjectedMatch[] => {
  return pairs.map(([homeTeam, awayTeam], index) => {
    const status = statusBuilder(index);
    const [predictedHomeGoals, predictedAwayGoals] = calculateScore(homeTeam, awayTeam, stadiumOffset + index, true);
    const matchGoals = status === 'scheduled' ? [0, 0] : [predictedHomeGoals, predictedAwayGoals];
    const metrics =
      status === 'scheduled' ? {} : getFinishedMetrics(predictedHomeGoals, predictedAwayGoals, stadiumOffset + index + 50);
    const winner = projectWinner(homeTeam, awayTeam, index + stadiumOffset);

    return {
      match: {
        id: `${phase}-${index + 1}`,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        date: toIsoDate(startDate, Math.floor(index / 4)),
        time: KNOCKOUT_TIMES[index % KNOCKOUT_TIMES.length],
        status,
        phase,
        stadiumId: STADIUM_SEEDS[(stadiumOffset + index) % STADIUM_SEEDS.length].id,
        referee: REFEREES[(stadiumOffset + index) % REFEREES.length],
        homeTeamGoals: matchGoals[0],
        awayTeamGoals: matchGoals[1],
        ...metrics
      },
      winnerId: winner.winnerId,
      loserId: winner.loserId
    } satisfies ProjectedMatch;
  });
};

const buildKnockoutMatches = (teams: Team[], standings: GroupStandings[]): Match[] => {
  const teamMap = new Map(teams.map((team) => [team.id, team]));
  const winners = standings
    .map((standing) => standing.teams[0])
    .sort((first, second) => second.points - first.points || second.goalDifference - first.goalDifference);
  const runners = standings
    .map((standing) => standing.teams[1])
    .sort((first, second) => second.points - first.points || second.goalDifference - first.goalDifference);
  const thirds = standings
    .map((standing) => standing.teams[2])
    .filter((team) => team.qualified)
    .sort((first, second) => second.points - first.points || second.goalDifference - first.goalDifference);

  const roundOf32Teams = [...winners, ...runners, ...thirds]
    .map((entry) => teamMap.get(entry.teamId))
    .filter((team): team is Team => Boolean(team));

  const roundOf32Pairs = Array.from({ length: 16 }, (_, index) => [roundOf32Teams[index], roundOf32Teams[31 - index]] as [Team, Team]);
  const roundOf32 = buildKnockoutRound(
    'round-of-32',
    roundOf32Pairs,
    '2026-07-02',
    72,
    (index) => (index < 8 ? 'finished' : index === 8 ? 'live' : 'scheduled')
  );

  const roundOf16Pairs = Array.from({ length: 8 }, (_, index) => {
    const homeTeam = teamMap.get(roundOf32[index * 2].winnerId);
    const awayTeam = teamMap.get(roundOf32[index * 2 + 1].winnerId);
    return [homeTeam, awayTeam] as [Team | undefined, Team | undefined];
  }).filter((pair): pair is [Team, Team] => Boolean(pair[0] && pair[1]));

  const roundOf16 = buildKnockoutRound('round-of-16', roundOf16Pairs, '2026-07-06', 88, (index) =>
    index < 2 ? 'finished' : index === 2 ? 'live' : 'scheduled'
  );

  const quarterfinalPairs = Array.from({ length: 4 }, (_, index) => {
    const homeTeam = teamMap.get(roundOf16[index * 2].winnerId);
    const awayTeam = teamMap.get(roundOf16[index * 2 + 1].winnerId);
    return [homeTeam, awayTeam] as [Team | undefined, Team | undefined];
  }).filter((pair): pair is [Team, Team] => Boolean(pair[0] && pair[1]));

  const quarterfinals = buildKnockoutRound('quarterfinals', quarterfinalPairs, '2026-07-10', 96, (index) =>
    index === 0 ? 'finished' : 'scheduled'
  );

  const semifinalsPairs = Array.from({ length: 2 }, (_, index) => {
    const homeTeam = teamMap.get(quarterfinals[index * 2].winnerId);
    const awayTeam = teamMap.get(quarterfinals[index * 2 + 1].winnerId);
    return [homeTeam, awayTeam] as [Team | undefined, Team | undefined];
  }).filter((pair): pair is [Team, Team] => Boolean(pair[0] && pair[1]));

  const semifinals = buildKnockoutRound('semifinals', semifinalsPairs, '2026-07-14', 100, () => 'scheduled');

  const thirdPlaceHome = teamMap.get(semifinals[0].loserId);
  const thirdPlaceAway = teamMap.get(semifinals[1].loserId);
  const finalHome = teamMap.get(semifinals[0].winnerId);
  const finalAway = teamMap.get(semifinals[1].winnerId);

  const thirdPlace = buildKnockoutRound(
    'third-place',
    [[thirdPlaceHome, thirdPlaceAway].filter(Boolean) as [Team, Team]],
    '2026-07-17',
    102,
    () => 'scheduled'
  );
  const final = buildKnockoutRound(
    'final',
    [[finalHome, finalAway].filter(Boolean) as [Team, Team]],
    '2026-07-19',
    103,
    () => 'scheduled'
  );

  return [
    ...roundOf32.map((entry) => entry.match),
    ...roundOf16.map((entry) => entry.match),
    ...quarterfinals.map((entry) => entry.match),
    ...semifinals.map((entry) => entry.match),
    ...thirdPlace.map((entry) => entry.match),
    ...final.map((entry) => entry.match)
  ];
};

export const teams = buildTeams();
const emptyStadiums = createEmptyStadiums();
const groupMatches = buildGroupMatches(teams, emptyStadiums);
const rawStandings = computeStandings(teams, groupMatches);
export const groupStandings = markQualifiedTeams(rawStandings, teams);
const knockoutMatches = buildKnockoutMatches(teams, groupStandings);
export const matches = [...groupMatches, ...knockoutMatches];
export const players = buildPlayers(teams);

const stadiumUsage = matches.reduce<Record<string, number>>((accumulator, match) => {
  accumulator[match.stadiumId] = (accumulator[match.stadiumId] ?? 0) + 1;
  return accumulator;
}, {});

export const stadiums = emptyStadiums.map((stadium) => ({
  ...stadium,
  matchesPlayed: stadiumUsage[stadium.id] ?? 0
}));

export const teamsById = Object.fromEntries(teams.map((team) => [team.id, team]));
export const playersByTeam = Object.fromEntries(
  teams.map((team) => [team.id, players.filter((player) => player.teamId === team.id)])
);
export const stadiumsById = Object.fromEntries(stadiums.map((stadium) => [stadium.id, stadium]));

const activeMatches = matches.filter((match) => match.status !== 'scheduled');
const totalGoals = activeMatches.reduce((sum, match) => sum + match.homeTeamGoals + match.awayTeamGoals, 0);
const sortedPlayersByGoals = [...players].sort((first, second) => second.goals - first.goals || second.assists - first.assists);
const sortedPlayersByAssists = [...players].sort((first, second) => second.assists - first.assists || second.goals - first.goals);

export const globalStats: GlobalStats = {
  totalMatches: matches.length,
  totalGoals,
  averageGoalsPerMatch: Number((totalGoals / activeMatches.length).toFixed(2)),
  topScorer: sortedPlayersByGoals[0],
  topAssister: sortedPlayersByAssists[0]
};

export const tournamentSummary = {
  hostNations: HOST_NATIONS,
  liveMatches: matches.filter((match) => match.status === 'live').length,
  upcomingMatches: matches.filter((match) => match.status === 'scheduled').length,
  completedMatches: matches.filter((match) => match.status === 'finished').length
};

if (teams.length !== TOTAL_TEAMS) {
  throw new Error(`Se esperaban ${TOTAL_TEAMS} selecciones y se han generado ${teams.length}`);
}

if (matches.length !== TOTAL_MATCHES) {
  throw new Error(`Se esperaban ${TOTAL_MATCHES} partidos y se han generado ${matches.length}`);
}
