import { useConnectionStore } from '@store/connectionStore';
import { formatRelativeTime } from '@utils/formatters';

const STATUS_STYLES = {
  connected: 'bg-emerald-500 text-emerald-50',
  updating: 'bg-amber-500 text-amber-950',
  offline: 'bg-slate-500 text-slate-50',
  error: 'bg-rose-500 text-rose-50'
} as const;

const STATUS_LABELS = {
  connected: 'Conectado',
  updating: 'Actualizando',
  offline: 'Sin conexion',
  error: 'Error de sincronizacion'
} as const;

export const ConnectionStatus = () => {
  const { status, lastUpdate, errorMessage, latencyMs, pendingRequests } = useConnectionStore((state) => ({
    status: state.status,
    lastUpdate: state.lastUpdate,
    errorMessage: state.errorMessage,
    latencyMs: state.latencyMs,
    pendingRequests: state.pendingRequests
  }));

  return (
    <div className="surface-card flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
      <div className="flex items-center gap-3">
        <span className={`pill border-none ${STATUS_STYLES[status]}`}>
          <span className="status-dot bg-current/80" />
          {STATUS_LABELS[status]}
        </span>
        <span className="text-slate-500 dark:text-slate-400">Ultima actualizacion {formatRelativeTime(lastUpdate)}</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-slate-500 dark:text-slate-400">
        {latencyMs !== null ? <span>Latencia {latencyMs} ms</span> : null}
        {pendingRequests > 0 ? <span>{pendingRequests} solicitudes activas</span> : null}
        {errorMessage ? <span className="text-rose-500">{errorMessage}</span> : null}
      </div>
    </div>
  );
};
