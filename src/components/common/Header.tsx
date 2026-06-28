interface HeaderProps {
  title: string;
  subtitle: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onThemeToggle: () => void;
  darkMode: boolean;
  favoritesCount: number;
}

export const Header = ({
  title,
  subtitle,
  searchValue,
  onSearchChange,
  onThemeToggle,
  darkMode,
  favoritesCount
}: HeaderProps) => (
  <header className="surface-card overflow-hidden p-6 md:p-8">
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-3">
        <span className="pill">Edicion oficial 2026</span>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 md:text-5xl dark:text-white">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base dark:text-slate-300">{subtitle}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="pill">{favoritesCount} favoritos</div>
        <button type="button" className="btn-secondary" onClick={onThemeToggle}>
          {darkMode ? 'Modo claro' : 'Modo oscuro'}
        </button>
      </div>
    </div>

    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Buscar equipos, fases o partidos</span>
      <input
        className="input-shell w-full"
        type="search"
        inputMode="search"
        placeholder="Ejemplo: España, final, Mexico"
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </label>
  </header>
);
