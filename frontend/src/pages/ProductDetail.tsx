import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, ArrowLeft, Star, Package, ArrowRight, Check,
} from 'lucide-react';
import { productApi, itemApi } from '../lib/api';
import { useCart } from '../context/CartContext';
import type { Product, Item } from '../types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      productApi.getById(id),
      productApi.getItemsByProduct ? productApi.getItemsByProduct(id) : itemApi.getAll(),
    ])
      .then(([prodData, itemsData]) => {
        const p = (prodData as { product?: Product })?.product ?? (prodData as Product);
        setProduct(p);
        const itms =
          (itemsData as { items?: Item[] })?.items ??
          (p.items ?? []);
        setItems(itms);
        setSelectedItem(itms[0] ?? null);
        setActiveImage(p.image_url ?? p.images?.[0] ?? null);
      })
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handleAddToCart() {
    if (!selectedItem || !product) return;
    addToCart(selectedItem, product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-cream rounded-3xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-cream rounded-xl animate-pulse w-2/3" />
            <div className="h-5 bg-cream rounded-xl animate-pulse" />
            <div className="h-5 bg-cream rounded-xl animate-pulse w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = [
    ...(product.image_url ? [product.image_url] : []),
    ...(product.images ?? []),
  ].filter(Boolean);

  return (
    <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-dark/50 hover:text-dark transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-cream rounded-3xl overflow-hidden">
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🎨</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${
                    activeImage === img ? 'border-olive' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="font-display font-black text-4xl text-dark leading-tight">
            {product.name}
          </h1>

          {/* Rating placeholder */}
          <div className="flex items-center gap-1.5 mt-3 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="text-yellow fill-yellow" />
            ))}
            <span className="text-sm text-dark/50 ml-1">(New)</span>
          </div>

          {/* Price */}
          {selectedItem && (
            <p className="text-3xl font-black text-olive mb-6">
              ₹{selectedItem.price.toLocaleString()}
            </p>
          )}

          {/* Description */}
          {product.description && (
            <p className="text-dark/60 text-sm leading-relaxed mb-6">
              {product.description}
            </p>
          )}

          {/* Variants / items */}
          {items.length > 1 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-dark mb-2 uppercase tracking-wide">
                Choose variant
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      selectedItem?.id === item.id
                        ? 'bg-olive text-white border-olive'
                        : 'bg-white text-dark/70 border-olive/20 hover:border-olive'
                    }`}
                  >
                    {item.name}
                    <span className="ml-1.5 opacity-70">₹{item.price.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <ul className="space-y-2 mb-8">
            {['Instant download after purchase', 'Commercial license included', 'Multiple file formats'].map(
              (feat) => (
                <li key={feat} className="flex items-center gap-2 text-sm text-dark/70">
                  <Package size={14} className="text-olive shrink-0" />
                  {feat}
                </li>
              )
            )}
          </ul>

          {/* CTA */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedItem}
            className={`flex items-center justify-center gap-3 w-full py-4 rounded-full font-bold text-base transition-all duration-300 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-olive text-white hover:bg-olive/80'
            }`}
          >
            {added ? (
              <>
                <Check size={18} />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}


