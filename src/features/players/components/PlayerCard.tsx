import { User, Target, Zap } from 'lucide-react';
import type { Player } from '@types';

interface PlayerCardProps {
  player: Player;
}

export default function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="card overflow-hidden transition-all hover:shadow-lg">
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-bold">{player.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{player.position}</p>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {player.number}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded bg-gray-100 p-2 dark:bg-dark-700">
            <p className="text-gray-600 dark:text-gray-400">Goles</p>
            <p className="font-bold">{player.goals}</p>
          </div>
          <div className="rounded bg-gray-100 p-2 dark:bg-dark-700">
            <p className="text-gray-600 dark:text-gray-400">Asistencias</p>
            <p className="font-bold">{player.assists}</p>
          </div>
          <div className="rounded bg-gray-100 p-2 dark:bg-dark-700">
            <p className="text-gray-600 dark:text-gray-400">Partidos</p>
            <p className="font-bold">{player.appearances}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
