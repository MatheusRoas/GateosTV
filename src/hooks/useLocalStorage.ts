import { useCallback, useEffect, useState } from 'react';
import { storageService } from '@services/storageService';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => storageService.get<T>(key, initialValue) ?? initialValue);

  const setValue = useCallback(
    (value: T | ((previousValue: T) => T)) => {
      setStoredValue((previousValue) => {
        const resolvedValue = value instanceof Function ? value(previousValue) : value;
        storageService.set(key, resolvedValue);
        return resolvedValue;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    storageService.remove(key);
    setStoredValue(initialValue);
  }, [initialValue, key]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key) {
        return;
      }

      if (event.newValue === null) {
        setStoredValue(initialValue);
        return;
      }

      try {
        setStoredValue(JSON.parse(event.newValue) as T);
      } catch {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [initialValue, key]);

  return [storedValue, setValue, removeValue] as const;
};
