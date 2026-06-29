/**
 * SchemaValidator - Sistema de validação com mensagens contextualizadas
 * Valida entrada do usuário, configurações e integridade de dados
 */

import type { DisplayTheme } from '@domain/entities/ApplicationState';

export interface ValidationOutcome<T = string> {
  isValid: boolean;
  diagnosticMessage?: string;
  normalizedPayload?: T;
}

/**
 * Valida texto obrigatório com limites de comprimento
 */
export const validateMandatoryText = (
  input: string,
  fieldDescription: string,
  minimumLength = 1,
  maximumLength = 80
): ValidationOutcome => {
  const sanitized = input.trim();

  if (!sanitized) {
    return { isValid: false, diagnosticMessage: `${fieldDescription} é obrigatório` };
  }

  if (sanitized.length < minimumLength) {
    return {
      isValid: false,
      diagnosticMessage: `${fieldDescription} deve ter pelo menos ${minimumLength} caracteres`
    };
  }

  if (sanitized.length > maximumLength) {
    return {
      isValid: false,
      diagnosticMessage: `${fieldDescription} não pode ultrapassar ${maximumLength} caracteres`
    };
  }

  return { isValid: true, normalizedPayload: sanitized };
};

/**
 * Valida termo de busca com caracteres permitidos
 */
export const validateTournamentSearch = (input: string): ValidationOutcome => {
  const foundation = validateMandatoryText(input, 'Busca', 2, 50);
  if (!foundation.isValid) {
    return foundation;
  }

  return /^[\p{L}\p{N} .,'-]+$/u.test(foundation.normalizedPayload ?? '')
    ? foundation
    : { isValid: false, diagnosticMessage: 'Busca contém caracteres não permitidos' };
};

/**
 * Valida código de competidor/equipe
 */
export const validateCompetitorCode = (input: string): ValidationOutcome<string> => {
  const sanitized = input.trim().toUpperCase();
  return /^[A-Z]{2,3}$/.test(sanitized)
    ? { isValid: true, normalizedPayload: sanitized }
    : { isValid: false, diagnosticMessage: 'Código do competidor deve ter 2 ou 3 letras' };
};

/**
 * Valida placar de previsão no formato 2-1
 */
export const validateCompetitionScore = (input: string): ValidationOutcome<string> => {
  const sanitized = input.trim();
  return /^\d{1,2}-\d{1,2}$/.test(sanitized)
    ? { isValid: true, normalizedPayload: sanitized }
    : { isValid: false, diagnosticMessage: 'Placar deve estar no formato 2-1' };
};

/**
 * Valida se valor é tema válido
 */
export const isValidDisplayTheme = (input: unknown): input is DisplayTheme =>
  input === 'light' || input === 'dark';

/**
 * Valida TTL de cache
 */
export const validateCacheTimeToLive = (input: number): ValidationOutcome<number> =>
  Number.isFinite(input) && input > 0
    ? { isValid: true, normalizedPayload: input }
    : { isValid: false, diagnosticMessage: 'TTL de cache deve ser número positivo' };

/**
 * Verifica se chave de armazenamento é segura
 */
export const isSecureStorageKey = (input: string): boolean =>
  /^[a-z0-9:_-]+$/i.test(input) && input.length <= 120;

// Legacy exports para compatibilidade
export type ValidationResult<T = string> = ValidationOutcome<T>;
export const validateRequiredText = validateMandatoryText;
export const validateSearchTerm = validateTournamentSearch;
export const validateTeamCode = validateCompetitorCode;
export const validatePredictionScore = validateCompetitionScore;
export const validateThemeValue = isValidDisplayTheme;
export const validateCacheTtl = validateCacheTimeToLive;
export const isSafeStorageKey = isSecureStorageKey;
