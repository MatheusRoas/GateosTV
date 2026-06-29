/**
 * MockDatasets - Datasets de referência para testes e modo offline
 * Re-exporta dados do arquivo data.ts com nomes mais descritivos
 */

export {
  teams as competitorTeamsReference,
  players as athleteProfilesReference,
  playersByTeam as athleteProfilesByCompetitorReference,
  matches as scheduledMatchesReference,
  stadiums as venueInformationReference,
  groupStandings as groupStandingsReference,
  globalStats as tournamentMetricsReference,
  tournamentSummary as tournamentOverviewReference
} from '@mocks/data';
