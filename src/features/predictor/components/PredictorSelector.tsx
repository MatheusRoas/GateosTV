import { useState } from 'react';
import { Trophy, Share2 } from 'lucide-react';
import type { Team } from '@types';

interface PredictorSelectorProps {
  teams: Team[];
  onPredict: (winnerId: string) => void;
}

export default function PredictorSelector({ teams, onPredict }: PredictorSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handlePredict = () => {
    if (selected) {
      onPredict(selected);
      setSelected(null);
    }
  };

  return (
    <div className="card space-y-4 p-6">
      <h3 className="flex items-center gap-2 text-lg font-bold">
        <Trophy size={20} />
        Campeon del Mundo
      </h3>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {teams.slice(0, 16).map((team) => (
          <button
            key={team.id}
            onClick={() => setSelected(team.id)}
            className={`rounded-lg p-3 transition-all ${
              selected === team.id
                ? 'border-2 border-primary bg-blue-50 dark:bg-blue-950'
                : 'border border-gray-200 bg-white hover:border-primary dark:border-dark-600 dark:bg-dark-800'
            }`}
          >
            <p className="text-xs font-semibold">{team.name}</p>
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handlePredict}
          disabled={!selected}
          className="btn-primary flex-1 disabled:opacity-50"
        >
          Hacer Prediccion
        </button>
        <button className="btn-secondary">
          <Share2 size={16} />
        </button>
      </div>
    </div>
  );
}
