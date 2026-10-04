import { useEffect, useRef, useState } from 'react';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productApi } from '../lib/api';
import type { Product } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const data = (await productApi.search(query)) as { products: Product[] };
        setResults(data.products ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" onClick={onClose}>
      <div className="absolute inset-0 bg-dark/60 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-2xl mx-auto mt-20 px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-2xl">
          <Search size={20} className="text-olive shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 3D models, textures, HDRI…"
            className="flex-1 text-dark text-base outline-none bg-transparent placeholder-dark/30"
          />
          {loading && <Loader2 size={18} className="animate-spin text-olive shrink-0" />}
          <button onClick={onClose} className="p-1 rounded-full hover:bg-olive/10 transition-colors">
            <X size={18} className="text-dark/50" />
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto">
            {results.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                onClick={onClose}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-cream transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-olive/10 overflow-hidden shrink-0">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🎨</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark text-sm truncate">{p.name}</p>
                  {p.items && p.items[0] && (
                    <p className="text-olive text-xs font-medium mt-0.5">
                      from ₹{p.items[0].price.toLocaleString()}
                    </p>
                  )}
                </div>
                <ArrowRight size={14} className="text-dark/30 group-hover:text-olive transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        )}

        {query.trim() && !loading && results.length === 0 && (
          <div className="mt-2 bg-white rounded-2xl shadow-2xl px-5 py-8 text-center">
            <p className="text-dark/50 text-sm">No results for "<strong>{query}</strong>"</p>
          </div>
        )}
      </div>
    </div>
  );
}

