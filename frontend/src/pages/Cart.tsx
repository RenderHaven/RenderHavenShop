import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { couponApi } from '../lib/api';
import type { Coupon } from '../types';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, totalPrice, totalItems, increment, decrement, removeFromCart } = useCart();
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const discount = coupon ? Math.round((totalPrice * coupon.discount_percent) / 100) : 0;
  const finalTotal = totalPrice - discount;

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    setCouponError('');
    setCouponLoading(true);
    try {
      const data = await couponApi.getByCode(couponCode, user?.id ?? 'guest');
      const c = (data as { coupon?: Coupon })?.coupon ?? (data as Coupon);
      setCoupon(c);
    } catch {
      setCouponError('Invalid or expired coupon code');
      setCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  }

  if (totalItems === 0) {
    return (
      <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 min-h-[70vh] flex flex-col items-center justify-center gap-6 text-center">
        <div className="w-24 h-24 rounded-full bg-cream flex items-center justify-center text-5xl">
          🛒
        </div>
        <h1 className="font-display font-black text-4xl text-dark">Your cart is empty</h1>
        <p className="text-dark/50 text-sm max-w-xs">
          Looks like you haven't added any assets yet.
        </p>
        <Link
          to="/shop"
          className="flex items-center gap-2 bg-olive text-white font-bold px-7 py-3.5 rounded-full hover:bg-olive/80 transition-colors"
        >
          <ShoppingBag size={16} />
          <span>Start Shopping</span>
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      <h1 className="font-display font-black text-5xl text-dark mb-10">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ item, product, quantity }) => (
            <div key={item.id} className="flex gap-4 bg-cream rounded-2xl p-4 sm:p-5">
              {/* Image */}
              <Link to={`/product/${product.id}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white overflow-hidden shrink-0">
                {item.image_url ?? product.image_url ? (
                  <img
                    src={(item.image_url ?? product.image_url)!}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">🎨</div>
                )}
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link to={`/product/${product.id}`} className="font-semibold text-dark hover:text-olive transition-colors line-clamp-1">
                  {product.name}
                </Link>
                <p className="text-dark/50 text-xs mt-0.5">{item.name}</p>
                <p className="text-olive font-bold mt-1">₹{(item.price * quantity).toLocaleString()}</p>

                <div className="flex items-center gap-3 mt-3">
                  {/* Qty */}
                  <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 border border-olive/20">
                    <button onClick={() => decrement(item.id)} className="text-dark/50 hover:text-dark transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold text-dark w-4 text-center">{quantity}</span>
                    <button onClick={() => increment(item.id)} className="text-dark/50 hover:text-dark transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-dark/30 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm text-dark/40">₹{item.price.toLocaleString()} each</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="bg-cream rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-dark text-lg">Order Summary</h2>

            {/* Coupon */}
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30" />
                  <input
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                    placeholder="Coupon code"
                    className="w-full bg-white border border-olive/20 rounded-full pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:border-olive"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                  className="bg-olive text-white text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-olive/80 transition-colors whitespace-nowrap disabled:opacity-60"
                >
                  Apply
                </button>
              </div>
              {coupon && (
                <p className="text-green-600 text-xs mt-1.5 px-1 font-medium">
                  ✓ {coupon.discount_percent}% discount applied!
                </p>
              )}
              {couponError && (
                <p className="text-red-500 text-xs mt-1.5 px-1">{couponError}</p>
              )}
            </div>

            <div className="border-t border-olive/10 pt-4 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-dark/60">Subtotal</span>
                <span className="font-medium text-dark">₹{totalPrice.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Discount ({coupon?.discount_percent}%)</span>
                  <span className="text-green-600 font-medium">- ₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-dark/60">Shipping</span>
                <span className="text-dark font-medium">Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-black text-dark text-lg pt-2 border-t border-olive/10">
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <Link
              to={user ? '/checkout' : '/login'}
              className="flex items-center justify-center gap-2 w-full bg-olive text-white font-bold py-4 rounded-full hover:bg-olive/80 transition-colors"
            >
              <span>{user ? 'Proceed to Checkout' : 'Login to Checkout'}</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/shop"
              className="block text-center text-sm text-dark/50 hover:text-dark transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

