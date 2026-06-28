import { useEffect } from 'react';
import { useConnectionStore } from '@store/connectionStore';

export const useOnline = () => {
  const isOnline = useConnectionStore((state) => state.isOnline);
  const status = useConnectionStore((state) => state.status);
  const lastUpdate = useConnectionStore((state) => state.lastUpdate);
  const errorMessage = useConnectionStore((state) => state.errorMessage);
  const setOnlineStatus = useConnectionStore((state) => state.setOnlineStatus);
  const hydrate = useConnectionStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
    setOnlineStatus(typeof navigator === 'undefined' ? true : navigator.onLine);

    const updateStatus = () => setOnlineStatus(window.navigator.onLine);

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, [hydrate, setOnlineStatus]);

  return {
    isOnline,
    status,
    lastUpdate,
    errorMessage
  };
};
