/**
 * FormattersRegistry - Sistema de formatação de apresentação com i18n
 * Fornece formatação localizada para datas, números, scores e relatórios
 */

import { MATCH_STATUS_TRANSLATIONS, PHASE_TRANSLATIONS } from '@domain/constants/TournamentConfiguration';
import type { CompetitionMatch, CompetitionPhase, CompetitionPhaseStatus, CompetitorStanding } from '@domain/entities/TournamentDomain';

// Formatadores localizados (com suporte a múltiplas línguas)
const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: '2-digit',
  month: 'short'
});

const fullDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
});

const timeOfDayFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit'
});

const numericalCompactFormatter = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 1
});

const percentageFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 0,
  style: 'percent'
});

/**
 * Constrói objeto Date a partir de strings de data e hora
 */
const reconstructTimestamp = (dateString: string, timeString = '00:00'): Date =>
  new Date(`${dateString}T${timeString}:00`);

/**
 * Renderiza data em formato curto
 */
export const renderLocalizedDate = (dateString: string): string =>
  shortDateFormatter.format(reconstructTimestamp(dateString));

/**
 * Renderiza data em formato completo
 */
export const renderExtendedDate = (dateString: string): string =>
  fullDateFormatter.format(reconstructTimestamp(dateString));

/**
 * Renderiza hora de competição
 */
export const renderCompetitionTime = (timeString: string, dateString = '2026-06-11'): string =>
  timeOfDayFormatter.format(reconstructTimestamp(dateString, timeString));

/**
 * Renderiza data e hora combinadas
 */
export const renderDateTimeComposite = (dateString: string, timeString: string): string =>
  `${renderExtendedDate(dateString)} · ${renderCompetitionTime(timeString, dateString)}`;

/**
 * Renderiza placar
 */
export const renderCompetitionScore = (match: Pick<CompetitionMatch, 'homeTeamGoals' | 'awayTeamGoals'>): string =>
  `${match.homeTeamGoals} - ${match.awayTeamGoals}`;

/**
 * Renderiza capacidade de estádio
 */
export const renderCompactCapacity = (capacityValue: number): string =>
  numericalCompactFormatter.format(capacityValue);

/**
 * Renderiza nome de fase da competição
 */
export const renderCompetitionPhase = (phase: CompetitionPhase): string =>
  PHASE_TRANSLATIONS[phase];

/**
 * Renderiza status de competição
 */
export const renderCompetitionStatus = (status: CompetitionPhaseStatus): string =>
  MATCH_STATUS_TRANSLATIONS[status];

/**
 * Renderiza percentual
 */
export const renderPercentageValue = (value: number, valueIsAlreadyPercent = true): string =>
  percentageFormatter.format(valueIsAlreadyPercent ? value / 100 : value);

/**
 * Renderiza posse de bola
 */
export const renderPossessionPercentage = (value: number): string =>
  `${Math.round(value)} %`;

/**
 * Renderiza diferença de gols
 */
export const renderGoalMargin = (value: number): string =>
  value > 0 ? `+${value}` : `${value}`;

/**
 * Renderiza registro de desempenho
 */
export const renderTeamPerformanceRecord = (standing: CompetitorStanding): string =>
  `${standing.wins}-${standing.draws}-${standing.losses}`;

/**
 * Renderiza tempo relativo (há X minutos/horas/dias)
 */
export const renderRelativeTimestamp = (timestamp: string | number | Date): string => {
  const targetTimestamp = new Date(timestamp).getTime();
  const differenceMs = targetTimestamp - Date.now();
  const absoluteMinutes = Math.round(Math.abs(differenceMs) / 60_000);

  if (absoluteMinutes < 1) {
    return 'Agora mesmo';
  }

  if (absoluteMinutes < 60) {
    return differenceMs >= 0 ? `Em ${absoluteMinutes} min` : `Há ${absoluteMinutes} min`;
  }

  const absoluteHours = Math.round(absoluteMinutes / 60);
  if (absoluteHours < 24) {
    return differenceMs >= 0 ? `Em ${absoluteHours} h` : `Há ${absoluteHours} h`;
  }

  const absoluteDays = Math.round(absoluteHours / 24);
  return differenceMs >= 0 ? `Em ${absoluteDays} dias` : `Há ${absoluteDays} dias`;
};

// Legacy exports para compatibilidade
export const formatMatchDate = renderLocalizedDate;
export const formatLongDate = renderExtendedDate;
export const formatMatchTime = renderCompetitionTime;
export const formatDateTime = renderDateTimeComposite;
export const formatScore = renderCompetitionScore;
export const formatCapacity = renderCompactCapacity;
export const formatPhase = renderCompetitionPhase;
export const formatMatchStatus = renderCompetitionStatus;
export const formatPercentage = renderPercentageValue;
export const formatPossession = renderPossessionPercentage;
export const formatGoalDifference = renderGoalMargin;
export const formatTeamRecord = renderTeamPerformanceRecord;
export const formatRelativeTime = renderRelativeTimestamp;
