import { Match, Team } from '@types';

interface MatchCardProps {
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
}

export default function MatchCard({ match, homeTeam, awayTeam }: MatchCardProps) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 text-center">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{homeTeam.name}</p>
          <p className="text-2xl font-bold">{match.homeTeamGoals}</p>
        </div>
        <div className="px-4 text-center">
          <p className="text-xs text-gray-500">{match.time}</p>
          <p className="text-sm font-semibold">{match.status === 'live' ? 'EN VIVO' : 'VS'}</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{awayTeam.name}</p>
          <p className="text-2xl font-bold">{match.awayTeamGoals}</p>
        </div>
      </div>
    </div>
  );
}
