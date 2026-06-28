import { BarChart3, TrendingUp } from 'lucide-react';
import type { Player } from '@types';

interface TopScorerProps {
  scorers: Player[];
}

export default function TopScorerWidget({ scorers }: TopScorerProps) {
  if (!scorers || scorers.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="mb-4 flex items-center gap-2 font-bold">
          <TrendingUp size={20} />
          Máximos Goleadores
        </h3>
        <p className="text-center text-gray-500 dark:text-gray-400">Sin datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="mb-4 flex items-center gap-2 font-bold">
        <TrendingUp size={20} />
        Máximos Goleadores
      </h3>

      <div className="space-y-3">
        {scorers.slice(0, 5).map((player, idx) => (
          <div key={player.id} className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-dark-700">
            <div>
              <p className="font-semibold">{player.name}</p>
              <p className="text-xs text-gray-500">{player.position}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">{player.goals}</p>
              <p className="text-xs text-gray-500">Goles</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
