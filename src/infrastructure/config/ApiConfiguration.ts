/**
 * ApiConfiguration - Configurações centralizadas de acesso a dados
 * Suporta API real ou modo offline com dados mock
 * Lê variáveis de ambiente e aplica defaults sensatos
 */

import { API_MAXIMUM_RETRY_ATTEMPTS, API_REQUEST_TIMEOUT_MS, APPLICATION_NAME, CACHE_RETENTION_POLICIES } from '@domain/constants/TournamentConfiguration';

type ViteEnvironmentVariable = Partial<Record<`VITE_${string}`, string>>;

const environmentVariables = ((import.meta as ImportMeta & { env?: ViteEnvironmentVariable }).env ?? {}) as ViteEnvironmentVariable;

/**
 * Parseia valor booleano de variável de ambiente
 */
const parseEnvironmentBoolean = (rawValue: string | undefined, defaultValue: boolean): boolean => {
  if (rawValue === undefined) {
    return defaultValue;
  }

  return ['1', 'true', 'sim', 'yes', 'on'].includes(rawValue.toLowerCase());
};

/**
 * Parseia valor numérico de variável de ambiente
 */
const parseEnvironmentNumber = (rawValue: string | undefined, defaultValue: number): number => {
  if (!rawValue) {
    return defaultValue;
  }

  const parsedNumber = Number(rawValue);
  return Number.isFinite(parsedNumber) && parsedNumber > 0 ? parsedNumber : defaultValue;
};

export interface ApiConnectionConfiguration {
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
 * Configuração runtime da API
 * 
 * Comportamento:
 * - Se VITE_API_BASE_URL não está definida: usa dados mock
 * - Se enableNetworkFallback é true: tenta API real, depois mock
 * - Permite desenvolver/testar sem dependência externa
 */
export const API_CONFIG: ApiConnectionConfiguration = {
  appName: APPLICATION_NAME,
  baseUrl: environmentVariables.VITE_API_BASE_URL?.trim() ?? '',
  timeoutMs: parseEnvironmentNumber(environmentVariables.VITE_API_TIMEOUT_MS, API_REQUEST_TIMEOUT_MS),
  retryAttempts: parseEnvironmentNumber(environmentVariables.VITE_API_RETRY_ATTEMPTS, API_MAXIMUM_RETRY_ATTEMPTS),
  retryDelayMs: parseEnvironmentNumber(environmentVariables.VITE_API_RETRY_DELAY_MS, 600),
  defaultCacheTtl: parseEnvironmentNumber(environmentVariables.VITE_CACHE_TTL_MS, CACHE_RETENTION_POLICIES.shortTerm),
  useMockData: parseEnvironmentBoolean(environmentVariables.VITE_USE_MOCK_API, true),
  enableNetworkFallback: parseEnvironmentBoolean(environmentVariables.VITE_ENABLE_API_FALLBACK, true),
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
 * Endpoints exportados separadamente para evitar string duplication
 */
export const API_ENDPOINTS = API_CONFIG.endpoints;

/**
 * Determina se deve-se tentar API remota primeiro
 * Verdadeiro quando URL base existe E modo mock não é obrigatório
 */
export const shouldUseNetworkFirst = (): boolean =>
  Boolean(API_CONFIG.baseUrl) && !API_CONFIG.useMockData;

/**
 * API Key para API-Football (RapidAPI)
 * Lida do ambiente VITE_API_FOOTBALL_KEY
 */
export const API_FOOTBALL_KEY = environmentVariables.VITE_API_FOOTBALL_KEY?.trim() ?? '';
