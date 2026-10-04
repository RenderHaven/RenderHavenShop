import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import type { Item, Product } from '../types';
import { useCart } from '../context/CartContext';

interface Props {
  product: Product;
  item?: Item;
}

export default function ProductCard({ product, item }: Props) {
  const { addToCart } = useCart();

  const price = item?.price ?? product.items?.[0]?.price;
  const maxPrice =
    product.items && product.items.length > 1
      ? Math.max(...product.items.map((i) => i.price))
      : undefined;

  const imageUrl =
    item?.image_url ?? product.image_url ?? product.images?.[0];

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    const targetItem = item ?? product.items?.[0];
    if (!targetItem) return;
    addToCart(targetItem, product);
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative bg-white rounded-2xl overflow-hidden border border-olive/10 hover:border-olive/30 hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Image area */}
      <div className="relative aspect-square bg-cream overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-olive/20 to-yellow/20">
            <span className="text-5xl opacity-30">🎨</span>
          </div>
        )}

        {/* Quick add button — appears on hover */}
        <button
          onClick={handleAdd}
          className="absolute bottom-3 right-3 p-2.5 bg-yellow text-dark rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-yellow/80 shadow-md"
          aria-label="Add to cart"
        >
          <ShoppingCart size={16} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-dark text-sm leading-snug line-clamp-2 mb-1">
          {product.name}
        </h3>

        {price !== undefined && (
          <p className="text-olive font-bold text-base mt-auto">
            {maxPrice && maxPrice !== price
              ? `₹${price.toLocaleString()} – ₹${maxPrice.toLocaleString()}`
              : `₹${price.toLocaleString()}`}
          </p>
        )}

        <button
          onClick={handleAdd}
          className="mt-3 flex items-center justify-between w-full bg-cream text-dark text-sm font-medium px-4 py-2.5 rounded-full hover:bg-olive hover:text-white transition-colors group/btn"
        >
          <span>Add to cart</span>
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </Link>
  );
}

