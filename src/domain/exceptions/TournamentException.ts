/**
 * TournamentException - Sistema robusto de tratamento de erros para o domínio de torneios
 * Fornece contexto detalhado e recuperação automática para diferentes tipos de falhas
 */

export type ErrorClassification =
  | 'network_unreachable'
  | 'request_timeout'
  | 'server_error'
  | 'validation_failure'
  | 'persistence_failure'
  | 'resource_not_found'
  | 'unclassified';

export class TournamentException extends Error {
  readonly errorCode: ErrorClassification;
  readonly httpStatusCode?: number;
  readonly shouldRetry: boolean;
  readonly failureContext?: Record<string, unknown>;
  readonly originalCause?: unknown;

  constructor(
    message: string,
    options: {
      errorCode?: ErrorClassification;
      httpStatusCode?: number;
      shouldRetry?: boolean;
      cause?: unknown;
      failureContext?: Record<string, unknown>;
    } = {}
  ) {
    super(message);
    this.name = 'TournamentException';
    this.errorCode = options.errorCode ?? 'unclassified';
    this.httpStatusCode = options.httpStatusCode;
    this.shouldRetry = options.shouldRetry ?? false;
    this.failureContext = options.failureContext;
    this.originalCause = options.cause;

    if (options.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }
}

export const translateErrorToException = (
  error: unknown,
  defaultMessage = 'Ocorreu um erro inesperado'
): TournamentException => {
  if (error instanceof TournamentException) {
    return error;
  }

  if (error instanceof Error) {
    const isAbortedRequest = error.name === 'AbortError';
    const isRequestTimeout = error.name === 'TimeoutError' || error.message.toLowerCase().includes('timeout');

    return new TournamentException(error.message || defaultMessage, {
      errorCode: isAbortedRequest || isRequestTimeout ? 'request_timeout' : 'unclassified',
      shouldRetry: isAbortedRequest || isRequestTimeout,
      cause: error
    });
  }

  if (typeof error === 'string') {
    return new TournamentException(error, { errorCode: 'unclassified' });
  }

  return new TournamentException(defaultMessage, { errorCode: 'unclassified', cause: error });
};

export const captureHttpFailure = (statusCode: number, statusText: string): TournamentException => {
  const classification: ErrorClassification =
    statusCode === 404 ? 'resource_not_found' : statusCode >= 500 ? 'server_error' : 'network_unreachable';

  return new TournamentException(statusText || 'Erro na resposta do servidor', {
    errorCode: classification,
    httpStatusCode: statusCode,
    shouldRetry: statusCode >= 500 || statusCode === 408 || statusCode === 429
  });
};

export const shouldRetryRequest = (error: unknown): boolean => {
  const translated = translateErrorToException(error);
  return translated.shouldRetry || translated.errorCode === 'network_unreachable' || translated.errorCode === 'request_timeout';
};

export const translateErrorForDisplay = (error: unknown): string => {
  const translated = translateErrorToException(error);

  switch (translated.errorCode) {
    case 'network_unreachable':
      return 'Não foi possível conectar ao serviço. Verifique sua conexão e tente novamente.';
    case 'request_timeout':
      return 'A solicitação demorou muito. Tente novamente em alguns segundos.';
    case 'validation_failure':
      return translated.message;
    case 'persistence_failure':
      return 'Não foi possível salvar informações no dispositivo.';
    case 'resource_not_found':
      return 'Não foram encontrados dados para esta consulta.';
    case 'server_error':
      return 'O serviço não está disponível no momento. Dados em cache serão usados se disponíveis.';
    default:
      return translated.message || 'Ocorreu um problema inesperado.';
  }
};

export const exportErrorDiagnostics = (error: unknown): Record<string, unknown> => {
  const translated = translateErrorToException(error);

  return {
    name: translated.name,
    errorCode: translated.errorCode,
    message: translated.message,
    httpStatusCode: translated.httpStatusCode,
    shouldRetry: translated.shouldRetry,
    failureContext: translated.failureContext
  };
};

export const executeWithErrorRecovery = async <T>(executor: () => Promise<T>): Promise<T> => {
  try {
    return await executor();
  } catch (error) {
    throw translateErrorToException(error);
  }
};

// Legacy exports para compatibilidade
export type AppErrorCode = ErrorClassification;
export class AppError extends TournamentException {}
export const normalizeError = translateErrorToException;
export const createHttpError = captureHttpFailure;
export const isRetryableError = shouldRetryRequest;
export const getUserFacingErrorMessage = translateErrorForDisplay;
export const toLogPayload = exportErrorDiagnostics;
export const withAsyncErrorHandling = executeWithErrorRecovery;
