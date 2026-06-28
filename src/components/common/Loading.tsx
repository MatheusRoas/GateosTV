export default function Loading() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="card animate-pulse p-4">
          <div className="mb-4 h-8 w-32 rounded bg-gray-300 dark:bg-dark-700"></div>
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-dark-600"></div>
            <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-dark-600"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
