interface Props {
  categories: { id: string; name: string }[];
  selected: string | null;
  onChange: (id: string | null) => void;
}

export default function CategoryFilter({ categories, selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
          selected === null
            ? 'bg-olive text-white border-olive'
            : 'bg-white text-dark/60 border-olive/20 hover:border-olive/50 hover:text-dark'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            selected === cat.id
              ? 'bg-olive text-white border-olive'
              : 'bg-white text-dark/60 border-olive/20 hover:border-olive/50 hover:text-dark'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

