import { NAV_ITEMS } from '@constants/index';
import type { AppSection, NavigationItem } from '@/types';

interface BottomNavProps {
  currentSection: AppSection;
  onChange: (section: AppSection) => void;
  items?: readonly NavigationItem[];
}

const NavIcon = ({ section }: { section: AppSection }) => {
  switch (section) {
    case 'inicio':
      return <span aria-hidden="true">⌂</span>;
    case 'calendario':
      return <span aria-hidden="true">◷</span>;
    case 'grupos':
      return <span aria-hidden="true">▦</span>;
    case 'favoritos':
      return <span aria-hidden="true">★</span>;
    case 'ajustes':
      return <span aria-hidden="true">⚙</span>;
    default:
      return null;
  }
};

export const BottomNav = ({ currentSection, onChange, items = NAV_ITEMS }: BottomNavProps) => (
  <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/90 px-3 py-2 backdrop-blur md:hidden dark:border-white/10 dark:bg-dark-950/90">
    <ul className="mx-auto grid max-w-2xl grid-cols-5 gap-2">
      {items.map((item) => {
        const isActive = item.id === currentSection;

        return (
          <li key={item.id}>
            <button
              type="button"
              className={`flex w-full flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-semibold ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'
              }`}
              onClick={() => onChange(item.id)}
            >
              <NavIcon section={item.id} />
              <span>{item.shortLabel}</span>
            </button>
          </li>
        );
      })}
    </ul>
  </nav>
);
