import { STORAGE_KEYS } from '@constants/index';
import { AppError, normalizeError } from '@utils/errors';

class StorageService {
  private get storage(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      return window.localStorage;
    } catch {
      return null;
    }
  }

  get<T>(key: string, fallbackValue: T | null = null): T | null {
    const storage = this.storage;
    if (!storage) {
      return fallbackValue;
    }

    try {
      const rawValue = storage.getItem(key);
      if (rawValue === null) {
        return fallbackValue;
      }

      return JSON.parse(rawValue) as T;
    } catch (error) {
      console.warn(normalizeError(error, 'No se ha podido leer el almacenamiento').message);
      return fallbackValue;
    }
  }

  set<T>(key: string, value: T): void {
    const storage = this.storage;
    if (!storage) {
      return;
    }

    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw new AppError('No se ha podido guardar la informacion', {
        code: 'storage',
        cause: error,
        context: { key }
      });
    }
  }

  getString(key: string, fallbackValue = ''): string {
    const storage = this.storage;
    if (!storage) {
      return fallbackValue;
    }

    return storage.getItem(key) ?? fallbackValue;
  }

  setString(key: string, value: string): void {
    const storage = this.storage;
    if (!storage) {
      return;
    }

    storage.setItem(key, value);
  }

  remove(key: string): void {
    this.storage?.removeItem(key);
  }

  clearAppStorage(): void {
    const storage = this.storage;
    if (!storage) {
      return;
    }

    Object.values(STORAGE_KEYS).forEach((key) => {
      if (key.endsWith(':')) {
        return;
      }

      storage.removeItem(key);
    });
  }

  keys(prefix?: string): string[] {
    const storage = this.storage;
    if (!storage) {
      return [];
    }

    const values: string[] = [];

    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (!key) {
        continue;
      }

      if (!prefix || key.startsWith(prefix)) {
        values.push(key);
      }
    }

    return values;
  }
}

export const storageService = new StorageService();
