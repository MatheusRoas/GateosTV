interface ErrorStateProps {
  title?: string;
  message: string;
  compact?: boolean;
  onRetry?: () => void;
}

export const ErrorState = ({
  title = 'No se han podido cargar los datos',
  message,
  compact = false,
  onRetry
}: ErrorStateProps) => (
  <section
    className={`surface-card border border-rose-200/70 bg-rose-50/80 text-rose-900 ${
      compact ? 'p-4' : 'mx-auto max-w-3xl p-6 md:p-8'
    }`}
    role="alert"
  >
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-xl">!</span>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-rose-700">{message}</p>
      </div>
    </div>

    {onRetry ? (
      <button type="button" className="btn-primary bg-rose-600 shadow-rose-600/20 hover:bg-rose-700" onClick={onRetry}>
        Reintentar
      </button>
    ) : null}
  </section>
);
