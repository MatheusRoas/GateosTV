import { MapPin, Users as UsersIcon } from 'lucide-react';
import type { Stadium } from '@types';

interface StadiumCardProps {
  stadium: Stadium;
}

export default function StadiumCard({ stadium }: StadiumCardProps) {
  return (
    <div className="card overflow-hidden">
      {stadium.image && (
        <div className="h-40 w-full bg-gray-200 dark:bg-dark-700">
          <img
            src={stadium.image}
            alt={stadium.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                'https://via.placeholder.com/300x160?text=' + stadium.name;
            }}
          />
        </div>
      )}

      <div className="space-y-3 p-4">
        <div>
          <p className="font-bold">{stadium.name}</p>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin size={14} />
            <span>
              {stadium.city}, {stadium.country}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded bg-gray-100 p-2 dark:bg-dark-700">
            <p className="text-gray-600 dark:text-gray-400">Capacidad</p>
            <p className="font-bold">{stadium.capacity.toLocaleString()}</p>
          </div>
          <div className="rounded bg-gray-100 p-2 dark:bg-dark-700">
            <p className="text-gray-600 dark:text-gray-400">Partidos</p>
            <p className="font-bold">{stadium.matchesPlayed}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
