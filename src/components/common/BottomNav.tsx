import { Link } from 'react-router';
import {
  Home,
  Calendar,
  BarChart3,
  Brackets,
  Users,
  Award,
} from 'lucide-react';

export default function BottomNav() {
  const links = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/calendario', icon: Calendar, label: 'Calendario' },
    { to: '/tablas', icon: BarChart3, label: 'Tablas' },
    { to: '/bracket', icon: Brackets, label: 'Bracket' },
    { to: '/estadisticas', icon: Award, label: 'Stats' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white dark:border-dark-700 dark:bg-dark-900">
      <div className="flex justify-around">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-1 flex-col items-center justify-center gap-1 px-2 py-4 text-sm transition-colors hover:text-primary"
          >
            <Icon size={24} />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
