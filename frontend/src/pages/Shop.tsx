import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { productApi } from '../lib/api';
import type { Product } from '../types';

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

const MOCK_CATEGORIES = [
  { id: '3d-models', name: '3D Models' },
  { id: 'textures', name: 'Textures' },
  { id: 'hdri', name: 'HDRI' },
  { id: 'scenes', name: 'Scenes' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState(searchParams.get('q') ?? '');
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'newest');
  const [selectedCat, setSelectedCat] = useState<string | null>(
    searchParams.get('cat') ?? null
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const p: Record<string, string> = {};
    if (sort) p.sort = sort;
    if (selectedCat) p.cat = selectedCat;
    if (searchQ) p.q = searchQ;
    setSearchParams(p, { replace: true });

    const fetch = searchQ
      ? productApi.search(searchQ)
      : productApi.getTree({});

    fetch
      .then((data) => {
        const products =
          (data as { products?: Product[] })?.products ?? (data as Product[]);
        setProducts(Array.isArray(products) ? products : []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQ, sort, selectedCat]);

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price_asc') {
      const pa = a.items?.[0]?.price ?? 0;
      const pb = b.items?.[0]?.price ?? 0;
      return pa - pb;
    }
    if (sort === 'price_desc') {
      const pa = a.items?.[0]?.price ?? 0;
      const pb = b.items?.[0]?.price ?? 0;
      return pb - pa;
    }
    return 0; // newest = server order
  });

  return (
    <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-display font-black text-5xl text-dark">Shop</h1>
        <p className="text-dark/50 text-sm mt-1">
          {loading ? '…' : `${sorted.length} assets`}
        </p>
      </div>

      {/* Search + sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-cream rounded-full px-4 py-2.5 border border-olive/20">
          <Search size={16} className="text-dark/40 shrink-0" />
          <input
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Search assets…"
            className="flex-1 bg-transparent text-sm text-dark outline-none placeholder-dark/30"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-cream border border-olive/20 rounded-full px-4 py-2.5 text-sm text-dark focus:outline-none focus:border-olive cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium border transition-colors ${
              filtersOpen
                ? 'bg-olive text-white border-olive'
                : 'bg-cream text-dark border-olive/20 hover:border-olive'
            }`}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Category filter row */}
      {filtersOpen && (
        <div className="mb-6">
          <CategoryFilter
            categories={MOCK_CATEGORIES}
            selected={selectedCat}
            onChange={setSelectedCat}
          />
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-cream rounded-2xl aspect-[3/4] animate-pulse" />
          ))}
        </div>
      ) : sorted.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {sorted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h2 className="font-bold text-dark text-xl mb-2">No results found</h2>
          <p className="text-dark/50 text-sm">
            Try a different search term or browse all categories.
          </p>
          <button
            onClick={() => { setSearchQ(''); setSelectedCat(null); }}
            className="mt-6 bg-olive text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-olive/80 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
}

