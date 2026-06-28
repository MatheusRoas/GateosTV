import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '@store/appStore';

export default function Header() {
  const { darkMode, toggleDarkMode } = useAppStore();

  return (
    <header className="border-b border-gray-200 bg-white dark:border-dark-700 dark:bg-dark-900">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">FIFA 2026</h1>
          <button
            onClick={toggleDarkMode}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-dark-800"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
