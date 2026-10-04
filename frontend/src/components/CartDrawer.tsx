import { useEffect } from 'react';
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, totalPrice, totalItems, increment, decrement, removeFromCart } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[90] bg-dark/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-[100] h-full w-full sm:w-96 bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-olive/10">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-olive" />
            <h2 className="font-bold text-dark">Your Cart</h2>
            {totalItems > 0 && (
              <span className="bg-yellow text-dark text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-olive/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center text-4xl">
                🛒
              </div>
              <p className="text-dark/50 text-sm">Your cart is empty</p>
              <Link
                to="/shop"
                onClick={onClose}
                className="flex items-center gap-2 bg-olive text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-olive/80 transition-colors"
              >
                <span>Browse Shop</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            items.map(({ item, product, quantity }) => (
              <div key={item.id} className="flex gap-3 bg-cream rounded-2xl p-3">
                {/* Image */}
                <div className="w-16 h-16 rounded-xl bg-olive/10 overflow-hidden shrink-0">
                  {item.image_url ?? product.image_url ? (
                    <img
                      src={(item.image_url ?? product.image_url)!}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🎨</div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark text-sm truncate">{product.name}</p>
                  <p className="text-dark/50 text-xs mt-0.5 truncate">{item.name}</p>
                  <p className="text-olive font-bold text-sm mt-1">
                    ₹{(item.price * quantity).toLocaleString()}
                  </p>
                </div>

                {/* Qty + remove */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-dark/30 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => decrement(item.id)}
                      className="w-6 h-6 rounded-full bg-white border border-olive/20 flex items-center justify-center hover:bg-olive hover:text-white transition-colors"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-sm font-bold text-dark w-5 text-center">{quantity}</span>
                    <button
                      onClick={() => increment(item.id)}
                      className="w-6 h-6 rounded-full bg-white border border-olive/20 flex items-center justify-center hover:bg-olive hover:text-white transition-colors"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-olive/10 bg-white space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-dark/60">Subtotal</span>
              <span className="font-bold text-dark">₹{totalPrice.toLocaleString()}</span>
            </div>
            <p className="text-xs text-dark/40">Shipping & taxes calculated at checkout</p>
            <Link
              to="/cart"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full bg-olive text-white font-bold py-3.5 rounded-full hover:bg-olive/80 transition-colors"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

