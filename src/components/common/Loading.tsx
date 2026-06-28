interface LoadingProps {
  message?: string;
  rows?: number;
  variant?: 'page' | 'card' | 'inline';
}

export const Loading = ({
  message = 'Cargando informacion del torneo',
  rows = 3,
  variant = 'page'
}: LoadingProps) => {
  const wrapperClassName =
    variant === 'page'
      ? 'surface-card mx-auto flex min-h-[320px] w-full max-w-6xl flex-col gap-6 p-6 md:p-8'
      : variant === 'card'
        ? 'surface-card flex flex-col gap-4 p-5'
        : 'flex flex-col gap-3';

  return (
    <section className={wrapperClassName} aria-busy="true" aria-live="polite">
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 animate-pulse rounded-full bg-primary" />
        <p className="text-sm font-medium text-slate-500">{message}</p>
      </div>

      <div className="grid gap-3">
        {Array.from({ length: rows }, (_, index) => (
          <div key={`skeleton-row-${index}`} className="surface-card border border-slate-100 p-4 dark:border-white/10">
            <div className="skeleton mb-3 h-5 w-2/5" />
            <div className="skeleton mb-2 h-4 w-full" />
            <div className="skeleton h-4 w-4/5" />
          </div>
        ))}
      </div>
    </section>
  );
};
