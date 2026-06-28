import { useState, useEffect } from 'react';
import { Ball, Trophy, Users, MapPin } from 'lucide-react';
import type { Match, Team } from '@types';

interface LiveMatchWidgetProps {
  matches: Match[];
  teams: Map<string, Team>;
}

export default function LiveMatchWidget({ matches, teams }: LiveMatchWidgetProps) {
  const liveMatches = matches.filter((m) => m.status === 'live');

  if (liveMatches.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No hay partidos en directo en este momento</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {liveMatches.map((match) => {
        const homeTeam = teams.get(match.homeTeamId);
        const awayTeam = teams.get(match.awayTeamId);

        return (
          <div key={match.id} className="card border-l-4 border-l-red-500 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ball className="h-4 w-4 animate-pulse text-red-500" />
                <span className="text-xs font-bold text-red-500">EN VIVO</span>
              </div>
              <span className="text-sm text-gray-500">{match.time}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 text-left">
                <p className="font-semibold">{homeTeam?.name}</p>
              </div>
              <div className="mx-4 text-center">
                <p className="text-2xl font-bold">{match.homeTeamGoals}</p>
              </div>
              <div className="flex-1 text-right">
                <p className="font-semibold">{awayTeam?.name}</p>
              </div>
            </div>

            <div className="mt-2 text-right text-sm text-gray-600 dark:text-gray-400">
              {match.homeTeamGoals} - {match.awayTeamGoals}
            </div>
          </div>
        );
      })}
    </div>
  );
}
