// Re-export from new domain location for backwards compatibility
export type { ErrorClassification } from '@domain/exceptions/TournamentException';

export {
  TournamentException,
  translateErrorToException,
  captureHttpFailure,
  shouldRetryRequest,
  translateErrorForDisplay,
  exportErrorDiagnostics,
  executeWithErrorRecovery,
  // Legacy names
  AppError,
  normalizeError,
  createHttpError,
  isRetryableError,
  getUserFacingErrorMessage,
  toLogPayload,
  withAsyncErrorHandling
} from '@domain/exceptions/TournamentException';

export type AppErrorCode = import('@domain/exceptions/TournamentException').ErrorClassification;
