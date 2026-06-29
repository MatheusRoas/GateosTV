// Re-export from new location for backwards compatibility
export type { ApiConnectionConfiguration as ApiConfig } from '@infrastructure/config/ApiConfiguration';

export {
  API_CONFIG,
  API_ENDPOINTS,
  shouldUseNetworkFirst
} from '@infrastructure/config/ApiConfiguration';
