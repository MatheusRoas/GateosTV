import { useConnectionStore } from '@store/connectionStore';

export default function ConnectionStatus() {
  const { status, isOnline, lastUpdate } = useConnectionStore();

  if (!isOnline) {
    return (
      <div className="fixed bottom-20 left-0 right-0 bg-yellow-500 px-4 py-2 text-center text-sm font-semibold text-white">
        Modo offline - Usando datos locales
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed bottom-20 left-0 right-0 bg-red-500 px-4 py-2 text-center text-sm font-semibold text-white">
        Error de conexion
      </div>
    );
  }

  return null;
}
