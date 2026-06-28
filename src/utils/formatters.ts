import { MATCH_STATUS_LABELS, PHASE_LABELS } from '@constants/index';
import type { Match, MatchPhase, MatchStatus, TeamStanding } from '@/types';

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  weekday: 'short',
  day: '2-digit',
  month: 'short'
});

const longDateFormatter = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
});

const timeFormatter = new Intl.DateTimeFormat('es-ES', {
  hour: '2-digit',
  minute: '2-digit'
});

const compactNumberFormatter = new Intl.NumberFormat('es-ES', {
  notation: 'compact',
  maximumFractionDigits: 1
});

const percentFormatter = new Intl.NumberFormat('es-ES', {
  maximumFractionDigits: 0,
  style: 'percent'
});

const buildDate = (date: string, time = '00:00'): Date => new Date(`${date}T${time}:00`);

export const formatMatchDate = (date: string): string => dateFormatter.format(buildDate(date));

export const formatLongDate = (date: string): string => longDateFormatter.format(buildDate(date));

export const formatMatchTime = (time: string, date = '2026-06-11'): string =>
  timeFormatter.format(buildDate(date, time));

export const formatDateTime = (date: string, time: string): string =>
  `${formatLongDate(date)} · ${formatMatchTime(time, date)}`;

export const formatScore = (match: Pick<Match, 'homeTeamGoals' | 'awayTeamGoals'>): string =>
  `${match.homeTeamGoals} - ${match.awayTeamGoals}`;

export const formatCapacity = (capacity: number): string => compactNumberFormatter.format(capacity);

export const formatPhase = (phase: MatchPhase): string => PHASE_LABELS[phase];

export const formatMatchStatus = (status: MatchStatus): string => MATCH_STATUS_LABELS[status];

export const formatPercentage = (value: number, inputIsPercent = true): string =>
  percentFormatter.format(inputIsPercent ? value / 100 : value);

export const formatPossession = (value: number): string => `${Math.round(value)} %`;

export const formatGoalDifference = (value: number): string => (value > 0 ? `+${value}` : `${value}`);

export const formatTeamRecord = (standing: TeamStanding): string =>
  `${standing.wins}-${standing.draws}-${standing.losses}`;

export const formatRelativeTime = (value: string | number | Date): string => {
  const target = new Date(value).getTime();
  const diffMs = target - Date.now();
  const absMinutes = Math.round(Math.abs(diffMs) / 60_000);

  if (absMinutes < 1) {
    return 'Ahora mismo';
  }

  if (absMinutes < 60) {
    return diffMs >= 0 ? `En ${absMinutes} min` : `Hace ${absMinutes} min`;
  }

  const absHours = Math.round(absMinutes / 60);
  if (absHours < 24) {
    return diffMs >= 0 ? `En ${absHours} h` : `Hace ${absHours} h`;
  }

  const absDays = Math.round(absHours / 24);
  return diffMs >= 0 ? `En ${absDays} dias` : `Hace ${absDays} dias`;
};
