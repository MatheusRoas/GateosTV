interface ErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function Error({ title = 'Error', message, onRetry }: ErrorProps) {
  return (
    <div className="card border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
      <h2 className="mb-2 text-lg font-bold text-red-600 dark:text-red-400">{title}</h2>
      <p className="mb-4 text-red-700 dark:text-red-300">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary bg-red-600 hover:bg-red-700">
          Reintentar
        </button>
      )}
    </div>
  );
}
