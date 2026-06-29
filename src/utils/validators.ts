// Re-export from new domain location for backwards compatibility
export type { ValidationOutcome } from '@domain/validation/SchemaValidator';

export {
  validateMandatoryText,
  validateTournamentSearch,
  validateCompetitorCode,
  validateCompetitionScore,
  isValidDisplayTheme,
  validateCacheTimeToLive,
  isSecureStorageKey,
  // Legacy names
  validateRequiredText,
  validateSearchTerm,
  validateTeamCode,
  validatePredictionScore,
  validateThemeValue,
  validateCacheTtl,
  isSafeStorageKey
} from '@domain/validation/SchemaValidator';

export type ValidationResult<T = string> = import('@domain/validation/SchemaValidator').ValidationOutcome<T>;
