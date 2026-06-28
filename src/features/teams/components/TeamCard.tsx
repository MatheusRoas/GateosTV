import { Flag, Users, Trophy } from 'lucide-react';
import type { Team } from '@types';

interface TeamCardProps {
  team: Team;
  onClick?: () => void;
}

export default function TeamCard({ team, onClick }: TeamCardProps) {
  return (
    <div
      onClick={onClick}
      className="card cursor-pointer overflow-hidden transition-all hover:shadow-lg"
    >
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <img
            src={team.flag}
            alt={team.name}
            className="h-12 w-12 rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.src =
                'https://via.placeholder.com/48?text=' + team.code;
            }}
          />
          <div className="flex-1">
            <p className="font-bold">{team.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{team.code}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="rounded bg-gray-100 p-2 dark:bg-dark-700">
            <p className="text-gray-600 dark:text-gray-400">Grupo</p>
            <p className="font-bold text-lg">{team.group}</p>
          </div>
          <div className="rounded bg-gray-100 p-2 dark:bg-dark-700">
            <p className="text-gray-600 dark:text-gray-400">Ranking FIFA</p>
            <p className="font-bold">#{team.fifaRanking}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Users size={14} />
          <span className="text-gray-600 dark:text-gray-400">
            {team.playersCount} Jugadores
          </span>
        </div>
      </div>
    </div>
  );
}
