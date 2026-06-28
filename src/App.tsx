import { useCallback, useEffect, useMemo, useState } from 'react';
import { BottomNav } from '@components/common/BottomNav';
import { ConnectionStatus } from '@components/common/ConnectionStatus';
import { ErrorState } from '@components/common/Error';
import { Header } from '@components/common/Header';
import { Loading } from '@components/common/Loading';
import { CACHE_DURATIONS, HOST_NATIONS } from '@constants/index';
import { useFetch } from '@hooks/useFetch';
import { useOnline } from '@hooks/useOnline';
import { apiService } from '@services/apiService';
import { useAppStore } from '@store/appStore';
import { clearNamespaceCache } from '@utils/cache';
import {
  formatCapacity,
  formatDateTime,
  formatGoalDifference,
  formatMatchStatus,
  formatPhase,
  formatScore,
  formatTeamRecord
} from '@utils/formatters';
import type { Match, Stadium, Team, TeamStanding } from '@/types';

const SummaryCard = ({ label, value, helper }: { label: string; value: string; helper: string }) => (
  <article className="surface-card p-5">
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
    <p className="mt-3 font-display text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{helper}</p>
  </article>
);

const TeamRow = ({
  team,
  isFavorite,
  onToggleFavorite
}: {
  team: Team;
  isFavorite: boolean;
  onToggleFavorite: (teamId: string) => void;
}) => (
  <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 px-4 py-3 dark:border-white/10">
    <div className="flex items-center gap-3">
      <span className="text-2xl">{team.flag}</span>
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{team.name}</p>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Grupo {team.group} · FIFA {team.fifaRanking}
        </p>
      </div>
    </div>

    <button type="button" className="btn-ghost px-3 py-2 text-lg" onClick={() => onToggleFavorite(team.id)}>
      {isFavorite ? '★' : '☆'}
    </button>
  </div>
);

const MatchCard = ({
  match,
  teamsById,
  stadiumsById,
  favoriteIds,
  onToggleFavorite
}: {
  match: Match;
  teamsById: Record<string, Team>;
  stadiumsById: Record<string, Stadium>;
  favoriteIds: string[];
  onToggleFavorite: (teamId: string) => void;
}) => {
  const homeTeam = teamsById[match.homeTeamId];
  const awayTeam = teamsById[match.awayTeamId];
  const stadium = stadiumsById[match.stadiumId];

  if (!homeTeam || !awayTeam || !stadium) {
    return null;
  }

  const showScore = match.status !== 'scheduled';

  return (
    <article className="surface-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="pill">{formatPhase(match.phase)}</span>
          <span className="pill">{formatMatchStatus(match.status)}</span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{formatDateTime(match.date, match.time)}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{homeTeam.flag}</span>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{homeTeam.name}</p>
            <button type="button" className="text-sm text-primary" onClick={() => onToggleFavorite(homeTeam.id)}>
              {favoriteIds.includes(homeTeam.id) ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="font-display text-3xl font-bold text-slate-900 dark:text-white">
            {showScore ? formatScore(match) : formatDateTime(match.date, match.time).split(' · ')[1]}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {stadium.name}
          </p>
        </div>

        <div className="flex items-center justify-start gap-3 md:justify-end">
          <div className="text-right">
            <p className="font-semibold text-slate-900 dark:text-white">{awayTeam.name}</p>
            <button type="button" className="text-sm text-primary" onClick={() => onToggleFavorite(awayTeam.id)}>
              {favoriteIds.includes(awayTeam.id) ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            </button>
          </div>
          <span className="text-3xl">{awayTeam.flag}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
        <span>{stadium.city}</span>
        {match.homeTeamPossession !== undefined ? <span>Posesion local {match.homeTeamPossession} %</span> : null}
        {match.homeTeamShots !== undefined && match.awayTeamShots !== undefined ? (
          <span>Tiros {match.homeTeamShots} - {match.awayTeamShots}</span>
        ) : null}
      </div>
    </article>
  );
};

const StandingsTable = ({ standings, teamsById }: { standings: TeamStanding[]; teamsById: Record<string, Team> }) => (
  <div className="table-shell overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead className="bg-slate-100/80 text-left text-slate-500 dark:bg-white/5 dark:text-slate-300">
        <tr>
          <th className="px-4 py-3">Equipo</th>
          <th className="px-3 py-3">PJ</th>
          <th className="px-3 py-3">Racha</th>
          <th className="px-3 py-3">DG</th>
          <th className="px-3 py-3">Pts</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((team) => (
          <tr key={team.teamId} className="border-t border-slate-100 dark:border-white/5">
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <span>{teamsById[team.teamId]?.flag}</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{team.teamName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{team.qualified ? 'Clasificado' : 'Pendiente'}</p>
                </div>
              </div>
            </td>
            <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{team.played}</td>
            <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{formatTeamRecord(team)}</td>
            <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{formatGoalDifference(team.goalDifference)}</td>
            <td className="px-3 py-3 font-semibold text-slate-900 dark:text-white">{team.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

function App() {
  useOnline();

  const hydrate = useAppStore((state) => state.hydrate);
  const selectedSection = useAppStore((state) => state.selectedSection);
  const setSelectedSection = useAppStore((state) => state.setSelectedSection);
  const darkMode = useAppStore((state) => state.darkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);
  const favorites = useAppStore((state) => state.favorites);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const clearFavorites = useAppStore((state) => state.clearFavorites);
  const searchTerm = useAppStore((state) => state.searchTerm);
  const setSearchTerm = useAppStore((state) => state.setSearchTerm);
  const [cacheMessage, setCacheMessage] = useState<string | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const teamsQuery = useFetch('teams', useCallback(() => apiService.getTeams(), []), {
    cacheTtl: CACHE_DURATIONS.day
  });
  const matchesQuery = useFetch('matches', useCallback(() => apiService.getMatches(), []), {
    cacheTtl: CACHE_DURATIONS.medium
  });
  const standingsQuery = useFetch('standings', useCallback(() => apiService.getStandings(), []), {
    cacheTtl: CACHE_DURATIONS.medium
  });
  const statsQuery = useFetch('stats', useCallback(() => apiService.getGlobalStats(), []), {
    cacheTtl: CACHE_DURATIONS.short
  });
  const stadiumsQuery = useFetch('stadiums', useCallback(() => apiService.getStadiums(), []), {
    cacheTtl: CACHE_DURATIONS.day
  });

  const hasInitialData =
    Boolean(teamsQuery.data) &&
    Boolean(matchesQuery.data) &&
    Boolean(standingsQuery.data) &&
    Boolean(statsQuery.data) &&
    Boolean(stadiumsQuery.data);

  const isLoading =
    !hasInitialData &&
    (teamsQuery.isLoading ||
      matchesQuery.isLoading ||
      standingsQuery.isLoading ||
      statsQuery.isLoading ||
      stadiumsQuery.isLoading);

  const errorMessage = teamsQuery.error || matchesQuery.error || standingsQuery.error || statsQuery.error || stadiumsQuery.error;

  const retryAll = useCallback(async () => {
    await Promise.all([
      teamsQuery.refetch({ bypassCache: true }),
      matchesQuery.refetch({ bypassCache: true }),
      standingsQuery.refetch({ bypassCache: true }),
      statsQuery.refetch({ bypassCache: true }),
      stadiumsQuery.refetch({ bypassCache: true })
    ]);
  }, [matchesQuery, stadiumsQuery, standingsQuery, statsQuery, teamsQuery]);

  const teams = useMemo(() => teamsQuery.data ?? [], [teamsQuery.data]);
  const matches = useMemo(() => matchesQuery.data ?? [], [matchesQuery.data]);
  const standings = useMemo(() => standingsQuery.data ?? [], [standingsQuery.data]);
  const stats = statsQuery.data;
  const stadiums = useMemo(() => stadiumsQuery.data ?? [], [stadiumsQuery.data]);

  const teamsById = useMemo(() => Object.fromEntries(teams.map((team) => [team.id, team])), [teams]);
  const stadiumsById = useMemo(() => Object.fromEntries(stadiums.map((stadium) => [stadium.id, stadium])), [stadiums]);
  const term = searchTerm.trim().toLowerCase();

  const filteredTeams = useMemo(
    () =>
      teams.filter((team) => {
        if (!term) {
          return true;
        }

        return (
          team.name.toLowerCase().includes(term) ||
          team.code.toLowerCase().includes(term) ||
          team.group.toLowerCase().includes(term)
        );
      }),
    [teams, term]
  );

  const filteredMatches = useMemo(
    () =>
      matches.filter((match) => {
        if (!term) {
          return true;
        }

        const homeTeam = teamsById[match.homeTeamId];
        const awayTeam = teamsById[match.awayTeamId];
        const stadium = stadiumsById[match.stadiumId];

        return [homeTeam?.name, awayTeam?.name, stadium?.name, match.phase]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      }),
    [matches, stadiumsById, teamsById, term]
  );

  const favoriteTeams = useMemo(() => teams.filter((team) => favorites.includes(team.id)), [favorites, teams]);
  const favoriteMatches = useMemo(
    () => matches.filter((match) => favorites.includes(match.homeTeamId) || favorites.includes(match.awayTeamId)),
    [favorites, matches]
  );

  const featuredMatch =
    filteredMatches.find((match) => match.status === 'live') ?? filteredMatches.find((match) => match.status === 'scheduled');

  const clearOfflineCache = () => {
    clearNamespaceCache();
    setCacheMessage('La cache local se ha vaciado correctamente');
  };

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8 md:px-6">
        <Loading rows={4} />
      </main>
    );
  }

  if (!hasInitialData && errorMessage) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl items-center px-4 py-8 md:px-6">
        <ErrorState message={errorMessage} onRetry={() => void retryAll()} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-6 md:py-8">
      <Header
        title="Mundial FIFA 2026"
        subtitle="Sigue el torneo completo con resultados, clasificaciones y una experiencia preparada para funcionar incluso sin conexion."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onThemeToggle={toggleDarkMode}
        darkMode={darkMode}
        favoritesCount={favorites.length}
      />

      <ConnectionStatus />

      {errorMessage && hasInitialData ? <ErrorState compact message={errorMessage} onRetry={() => void retryAll()} /> : null}

      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Partidos totales" value={String(stats?.totalMatches ?? 0)} helper="Formato ampliado con 48 selecciones" />
        <SummaryCard label="Goles registrados" value={String(stats?.totalGoals ?? 0)} helper="Solo encuentros ya disputados o en juego" />
        <SummaryCard
          label="Media por partido"
          value={String(stats?.averageGoalsPerMatch ?? 0)}
          helper={`Sedes anfitrionas: ${HOST_NATIONS.join(', ')}`}
        />
        <SummaryCard
          label="Maximo goleador"
          value={stats?.topScorer.name ?? 'Sin datos'}
          helper={stats?.topScorer.club ?? 'Rendimiento acumulado del torneo'}
        />
      </section>

      {featuredMatch ? (
        <MatchCard
          match={featuredMatch}
          teamsById={teamsById}
          stadiumsById={stadiumsById}
          favoriteIds={favorites}
          onToggleFavorite={toggleFavorite}
        />
      ) : null}

      <section id={selectedSection} className="space-y-6">
        {selectedSection === 'inicio' ? (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="surface-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Selecciones destacadas</h2>
                <span className="text-sm text-slate-500 dark:text-slate-400">{filteredTeams.length} resultados</span>
              </div>
              <div className="grid gap-3">
                {filteredTeams.slice(0, 8).map((team) => (
                  <TeamRow
                    key={team.id}
                    team={team}
                    isFavorite={favorites.includes(team.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </section>

            <section className="surface-card p-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sedes clave</h2>
              <div className="mt-4 space-y-3">
                {stadiums.slice(0, 6).map((stadium) => (
                  <div key={stadium.id} className="rounded-2xl border border-slate-200/70 px-4 py-3 dark:border-white/10">
                    <p className="font-semibold text-slate-900 dark:text-white">{stadium.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {stadium.city} · {stadium.country}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Aforo {formatCapacity(stadium.capacity)} · {stadium.matchesPlayed} partidos
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {selectedSection === 'calendario' ? (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Calendario completo</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{filteredMatches.length} partidos visibles</p>
            </div>
            <div className="grid gap-4">
              {filteredMatches.slice(0, 18).map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  teamsById={teamsById}
                  stadiumsById={stadiumsById}
                  favoriteIds={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </section>
        ) : null}

        {selectedSection === 'grupos' ? (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Clasificaciones por grupo</h2>
            <div className="grid gap-4 xl:grid-cols-2">
              {standings.map((groupStanding) => (
                <article key={groupStanding.group} className="surface-card p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Grupo {groupStanding.group}</h3>
                    <span className="pill">Top 2 directos</span>
                  </div>
                  <StandingsTable standings={groupStanding.teams} teamsById={teamsById} />
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {selectedSection === 'favoritos' ? (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tus favoritos</h2>
              {favorites.length > 0 ? (
                <button type="button" className="btn-secondary" onClick={clearFavorites}>
                  Vaciar favoritos
                </button>
              ) : null}
            </div>

            {favoriteTeams.length === 0 ? (
              <div className="surface-card p-6 text-sm text-slate-500 dark:text-slate-400">
                Marca una seleccion desde el inicio o desde el calendario para verla aqui.
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="surface-card p-6">
                  <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Equipos guardados</h3>
                  <div className="space-y-3">
                    {favoriteTeams.map((team) => (
                      <TeamRow
                        key={team.id}
                        team={team}
                        isFavorite={favorites.includes(team.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  {favoriteMatches.slice(0, 10).map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      teamsById={teamsById}
                      stadiumsById={stadiumsById}
                      favoriteIds={favorites}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        ) : null}

        {selectedSection === 'ajustes' ? (
          <section className="grid gap-4 lg:grid-cols-2">
            <article className="surface-card p-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Preferencias</h2>
              <div className="mt-5 space-y-3 text-sm text-slate-500 dark:text-slate-400">
                <p>Tema actual: {darkMode ? 'Oscuro' : 'Claro'}</p>
                <p>Favoritos guardados: {favorites.length}</p>
                <p>Busquedas activas: {searchTerm ? 'Si' : 'No'}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" className="btn-primary" onClick={toggleDarkMode}>
                  Cambiar tema
                </button>
                <button type="button" className="btn-secondary" onClick={clearOfflineCache}>
                  Vaciar cache
                </button>
              </div>
              {cacheMessage ? <p className="mt-4 text-sm text-emerald-600">{cacheMessage}</p> : null}
            </article>

            <article className="surface-card p-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Rendimiento</h2>
              <div className="mt-5 space-y-4 text-sm text-slate-500 dark:text-slate-400">
                <p>Las respuestas principales se almacenan localmente para mejorar el uso sin conexion.</p>
                <p>Las actualizaciones remotas utilizan reintentos automaticos y un respaldo completo con datos mock.</p>
                <p>El servicio worker mantiene la interfaz y los datos recientes disponibles incluso cuando la red falla.</p>
              </div>
            </article>
          </section>
        ) : null}
      </section>

      <BottomNav currentSection={selectedSection} onChange={setSelectedSection} />
    </main>
  );
}

export default App;
