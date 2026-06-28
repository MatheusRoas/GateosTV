import { API_RETRY_LIMIT, API_TIMEOUT_MS, APP_NAME, CACHE_DURATIONS } from '@constants/index';

type RuntimeEnv = Partial<Record<`VITE_${string}`, string>>;

const runtimeEnv = ((import.meta as ImportMeta & { env?: RuntimeEnv }).env ?? {}) as RuntimeEnv;

const parseBooleanEnv = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback;
  }

  return ['1', 'true', 'si', 'yes', 'on'].includes(value.toLowerCase());
};

const parseNumberEnv = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export interface ApiConfig {
  appName: string;
  baseUrl: string;
  timeoutMs: number;
  retryAttempts: number;
  retryDelayMs: number;
  defaultCacheTtl: number;
  useMockData: boolean;
  enableNetworkFallback: boolean;
  headers: HeadersInit;
  endpoints: {
    teams: string;
    matches: string;
    players: string;
    stadiums: string;
    standings: string;
    stats: string;
    search: string;
  };
}

/**
 * Configuracion central de acceso a datos.
 *
 * La aplicacion esta preparada para funcionar con una API real o con datos simulados.
 * Si no se define VITE_API_BASE_URL, el servicio principal cambia de forma segura al modo mock.
 * Esto permite desarrollar, ejecutar pruebas y servir la PWA sin depender de un backend externo.
 */
export const API_CONFIG: ApiConfig = {
  appName: APP_NAME,
  baseUrl: runtimeEnv.VITE_API_BASE_URL?.trim() ?? '',
  timeoutMs: parseNumberEnv(runtimeEnv.VITE_API_TIMEOUT_MS, API_TIMEOUT_MS),
  retryAttempts: parseNumberEnv(runtimeEnv.VITE_API_RETRY_ATTEMPTS, API_RETRY_LIMIT),
  retryDelayMs: parseNumberEnv(runtimeEnv.VITE_API_RETRY_DELAY_MS, 600),
  defaultCacheTtl: parseNumberEnv(runtimeEnv.VITE_CACHE_TTL_MS, CACHE_DURATIONS.medium),
  useMockData: parseBooleanEnv(runtimeEnv.VITE_USE_MOCK_API, true),
  enableNetworkFallback: parseBooleanEnv(runtimeEnv.VITE_ENABLE_API_FALLBACK, true),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  endpoints: {
    teams: '/teams',
    matches: '/matches',
    players: '/players',
    stadiums: '/stadiums',
    standings: '/standings',
    stats: '/stats',
    search: '/search'
  }
};

/**
 * Endpoints exportados por separado para evitar cadenas duplicadas.
 * Mantener esta tabla en un unico punto simplifica cambios de versionado o prefijos.
 */
export const API_ENDPOINTS = API_CONFIG.endpoints;

/**
 * Determina si la aplicacion debe intentar acceder primero a la red.
 * Solo se considera una API remota valida cuando existe una base URL y el modo mock no es obligatorio.
 */
export const shouldUseNetworkFirst = (): boolean =>
  Boolean(API_CONFIG.baseUrl) && !API_CONFIG.useMockData;
