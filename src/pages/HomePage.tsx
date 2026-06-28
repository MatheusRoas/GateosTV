import { Suspense } from 'react';
import Loading from '@components/common/Loading';

export default function HomePage() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-8">
        <div className="rounded-lg bg-gradient-to-r from-primary to-blue-600 p-8 text-white">
          <h1 className="text-4xl font-bold">Mundial FIFA 2026</h1>
          <p className="mt-2 text-xl text-blue-100">
            Toda la informacion del torneo en tu mano
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="card p-6">
            <h2 className="mb-4 text-2xl font-bold">Proximos Partidos</h2>
            <p className="text-gray-600 dark:text-gray-400">Cargando proximos partidos...</p>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 text-2xl font-bold">Resultados Recientes</h2>
            <p className="text-gray-600 dark:text-gray-400">Cargando resultados...</p>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 text-2xl font-bold">Top Goleadores</h2>
            <p className="text-gray-600 dark:text-gray-400">Cargando estadisticas...</p>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
