import type { ThemeMode } from '@/types';

export interface ValidationResult<T = string> {
  valid: boolean;
  message?: string;
  normalizedValue?: T;
}

export const validateRequiredText = (
  value: string,
  label: string,
  minLength = 1,
  maxLength = 80
): ValidationResult => {
  const normalized = value.trim();

  if (!normalized) {
    return { valid: false, message: `${label} es obligatorio` };
  }

  if (normalized.length < minLength) {
    return { valid: false, message: `${label} debe tener al menos ${minLength} caracteres` };
  }

  if (normalized.length > maxLength) {
    return { valid: false, message: `${label} no puede superar ${maxLength} caracteres` };
  }

  return { valid: true, normalizedValue: normalized };
};

export const validateSearchTerm = (value: string): ValidationResult => {
  const base = validateRequiredText(value, 'La busqueda', 2, 50);
  if (!base.valid) {
    return base;
  }

  return /^[\p{L}\p{N} .,'-]+$/u.test(base.normalizedValue ?? '')
    ? base
    : { valid: false, message: 'La busqueda contiene caracteres no permitidos' };
};

export const validateTeamCode = (value: string): ValidationResult<string> => {
  const normalized = value.trim().toUpperCase();
  return /^[A-Z]{2,3}$/.test(normalized)
    ? { valid: true, normalizedValue: normalized }
    : { valid: false, message: 'El codigo de equipo debe tener 2 o 3 letras' };
};

export const validatePredictionScore = (value: string): ValidationResult<string> => {
  const normalized = value.trim();
  return /^\d{1,2}-\d{1,2}$/.test(normalized)
    ? { valid: true, normalizedValue: normalized }
    : { valid: false, message: 'El marcador debe tener el formato 2-1' };
};

export const validateThemeValue = (value: unknown): value is ThemeMode =>
  value === 'light' || value === 'dark';

export const validateCacheTtl = (value: number): ValidationResult<number> =>
  Number.isFinite(value) && value > 0
    ? { valid: true, normalizedValue: value }
    : { valid: false, message: 'La duracion de cache debe ser un numero positivo' };

export const isSafeStorageKey = (value: string): boolean =>
  /^[a-z0-9:_-]+$/i.test(value) && value.length <= 120;
