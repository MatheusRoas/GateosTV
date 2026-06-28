import { Trophy } from 'lucide-react';
import type { GroupStandings, TeamStanding } from '@types';

interface StandingsTableProps {
  standings: GroupStandings[];
}

export default function StandingsTable({ standings }: StandingsTableProps) {
  if (!standings || standings.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">Sin datos de posiciones disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {standings.map((group) => (
        <div key={group.group} className="card p-4">
          <h3 className="mb-4 flex items-center gap-2 font-bold">
            <Trophy size={18} />
            Grupo {group.group}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-700">
                  <th className="py-2 text-left font-semibold">Equipo</th>
                  <th className="py-2 text-center font-semibold">PJ</th>
                  <th className="py-2 text-center font-semibold">G</th>
                  <th className="py-2 text-center font-semibold">E</th>
                  <th className="py-2 text-center font-semibold">P</th>
                  <th className="py-2 text-right font-semibold">Pts</th>
                </tr>
              </thead>
              <tbody>
                {group.teams.map((team, idx) => (
                  <tr
                    key={team.teamId}
                    className={`border-b border-gray-100 dark:border-dark-800 ${
                      idx < 2 ? 'bg-green-50 dark:bg-green-900/10' : ''
                    }`}
                  >
                    <td className="py-2 font-medium">{team.teamName}</td>
                    <td className="py-2 text-center">{team.played}</td>
                    <td className="py-2 text-center">{team.wins}</td>
                    <td className="py-2 text-center">{team.draws}</td>
                    <td className="py-2 text-center">{team.losses}</td>
                    <td className="py-2 text-right font-bold text-primary">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
