export type AppErrorCode =
  | 'network'
  | 'timeout'
  | 'server'
  | 'validation'
  | 'storage'
  | 'not-found'
  | 'unknown';

export class AppError extends Error {
  code: AppErrorCode;
  statusCode?: number;
  retriable: boolean;
  context?: Record<string, unknown>;

  constructor(
    message: string,
    options: {
      code?: AppErrorCode;
      statusCode?: number;
      retriable?: boolean;
      cause?: unknown;
      context?: Record<string, unknown>;
    } = {}
  ) {
    super(message, options.cause ? { cause: options.cause } : undefined);
    this.name = 'AppError';
    this.code = options.code ?? 'unknown';
    this.statusCode = options.statusCode;
    this.retriable = options.retriable ?? false;
    this.context = options.context;
  }
}

export const normalizeError = (error: unknown, fallbackMessage = 'Se ha producido un error inesperado'): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    const isAbort = error.name === 'AbortError';
    const isTimeout = error.name === 'TimeoutError' || error.message.toLowerCase().includes('timeout');

    return new AppError(error.message || fallbackMessage, {
      code: isAbort || isTimeout ? 'timeout' : 'unknown',
      retriable: isAbort || isTimeout,
      cause: error
    });
  }

  if (typeof error === 'string') {
    return new AppError(error, { code: 'unknown' });
  }

  return new AppError(fallbackMessage, { code: 'unknown', cause: error });
};

export const createHttpError = (statusCode: number, statusText: string): AppError => {
  const code: AppErrorCode = statusCode === 404 ? 'not-found' : statusCode >= 500 ? 'server' : 'network';

  return new AppError(statusText || 'Error en la respuesta del servidor', {
    code,
    statusCode,
    retriable: statusCode >= 500 || statusCode === 408 || statusCode === 429
  });
};

export const isRetryableError = (error: unknown): boolean => {
  const normalized = normalizeError(error);
  return normalized.retriable || normalized.code === 'network' || normalized.code === 'timeout';
};

export const getUserFacingErrorMessage = (error: unknown): string => {
  const normalized = normalizeError(error);

  switch (normalized.code) {
    case 'network':
      return 'No se ha podido conectar con el servicio. Comprueba la red y vuelve a intentarlo.';
    case 'timeout':
      return 'La solicitud ha tardado demasiado. Vuelve a intentarlo dentro de unos segundos.';
    case 'validation':
      return normalized.message;
    case 'storage':
      return 'No se ha podido guardar la informacion en el dispositivo.';
    case 'not-found':
      return 'No se han encontrado datos para esta consulta.';
    case 'server':
      return 'El servicio no esta disponible en este momento. Se usaran datos de respaldo si existen.';
    default:
      return normalized.message || 'Ha ocurrido un problema no esperado.';
  }
};

export const toLogPayload = (error: unknown): Record<string, unknown> => {
  const normalized = normalizeError(error);

  return {
    name: normalized.name,
    code: normalized.code,
    message: normalized.message,
    statusCode: normalized.statusCode,
    retriable: normalized.retriable,
    context: normalized.context
  };
};

export const withAsyncErrorHandling = async <T>(executor: () => Promise<T>): Promise<T> => {
  try {
    return await executor();
  } catch (error) {
    throw normalizeError(error);
  }
};
