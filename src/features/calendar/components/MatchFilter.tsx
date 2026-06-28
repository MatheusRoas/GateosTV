interface MatchFilterProps {
  onFilterChange: (filter: string) => void;
}

export default function MatchFilter({ onFilterChange }: MatchFilterProps) {
  return (
    <div className="card flex gap-2 p-4">
      <input
        type="text"
        placeholder="Buscar partido..."
        onChange={(e) => onFilterChange(e.target.value)}
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 dark:border-dark-600"
      />
    </div>
  );
}
