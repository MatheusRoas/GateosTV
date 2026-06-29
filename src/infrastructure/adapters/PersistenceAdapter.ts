/**
 * PersistenceAdapter - Interface com localStorage para persistência de dados
 * Oferece fallback gracioso quando storage não está disponível
 * Usado por hooks e stores para sincronização de estado
 */

import { STORAGE_KEYS } from '@domain/constants/TournamentConfiguration';
import { translateErrorToException } from '@domain/exceptions/TournamentException';

/**
 * Verifica se localStorage está acessível
 */
class PersistenceAdapter {
  private getStorageInstance(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      return window.localStorage;
    } catch {
      return null;
    }
  }

  /**
   * Recupera valor persistido do storage
   */
  retrieve<T>(persistenceKey: string, fallbackValue: T | null = null): T | null {
    const storage = this.getStorageInstance();
    if (!storage) {
      return fallbackValue;
    }

    try {
      const persistedData = storage.getItem(persistenceKey);
      if (persistedData === null) {
        return fallbackValue;
      }

      return JSON.parse(persistedData) as T;
    } catch (parseError) {
      console.warn(
        translateErrorToException(parseError, 'Não foi possível ler armazenamento').message
      );
      return fallbackValue;
    }
  }

  /**
   * Persiste valor no storage
   */
  persist<T>(persistenceKey: string, dataToStore: T): void {
    const storage = this.getStorageInstance();
    if (!storage) {
      return;
    }

    try {
      storage.setItem(persistenceKey, JSON.stringify(dataToStore));
    } catch (storageError) {
      console.warn(
        translateErrorToException(storageError, 'Não foi possível persistir dados').message
      );
    }
  }

  /**
   * Recupera string raw do storage
   */
  retrieveAsString(persistenceKey: string, fallbackValue = ''): string {
    const storage = this.getStorageInstance();
    if (!storage) {
      return fallbackValue;
    }

    return storage.getItem(persistenceKey) ?? fallbackValue;
  }

  /**
   * Persiste string raw
   */
  persistAsString(persistenceKey: string, stringValue: string): void {
    const storage = this.getStorageInstance();
    if (!storage) {
      return;
    }

    storage.setItem(persistenceKey, stringValue);
  }

  /**
   * Remove entrada do storage
   */
  remove(persistenceKey: string): void {
    this.getStorageInstance()?.removeItem(persistenceKey);
  }

  /**
   * Limpa completamente o app storage
   */
  clearApplicationStorage(): void {
    const storage = this.getStorageInstance();
    if (!storage) {
      return;
    }

    Object.values(STORAGE_KEYS).forEach((storageKey) => {
      if (storageKey.endsWith(':')) {
        return;
      }

      storage.removeItem(storageKey);
    });
  }

  /**
   * Lista todas as chaves com prefixo opcional
   */
  listStorageKeys(prefixFilter?: string): string[] {
    const storage = this.getStorageInstance();
    if (!storage) {
      return [];
    }

    const keys: string[] = [];

    for (let index = 0; index < storage.length; index += 1) {
      const storageKey = storage.key(index);
      if (!storageKey) {
        continue;
      }

      if (!prefixFilter || storageKey.startsWith(prefixFilter)) {
        keys.push(storageKey);
      }
    }

    return keys;
  }
}

export const persistenceAdapter = new PersistenceAdapter();

// Aliases para compatibilidade
export const storageService = persistenceAdapter;
export { persistenceAdapter as PersistenceAdapter };
