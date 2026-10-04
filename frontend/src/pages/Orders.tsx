import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../lib/api';
import type { Order, OrderStatus } from '../types';

const statusConfig: Record<OrderStatus, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: 'Pending', icon: <Clock size={14} />, color: 'text-yellow-600 bg-yellow-50' },
  processing: { label: 'Processing', icon: <Loader2 size={14} className="animate-spin" />, color: 'text-blue-600 bg-blue-50' },
  shipped: { label: 'Shipped', icon: <Truck size={14} />, color: 'text-purple-600 bg-purple-50' },
  delivered: { label: 'Delivered', icon: <CheckCircle size={14} />, color: 'text-green-600 bg-green-50' },
  cancelled: { label: 'Cancelled', icon: <XCircle size={14} />, color: 'text-red-600 bg-red-50' },
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi
      .getAll()
      .then((data) => {
        setOrders((data as { orders?: Order[] })?.orders ?? (data as Order[]) ?? []);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <main className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
      <h1 className="font-display font-black text-5xl text-dark mb-8">My Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-cream rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-32 text-center">
          <div className="w-24 h-24 rounded-full bg-cream flex items-center justify-center text-4xl mx-auto mb-6">
            📦
          </div>
          <h2 className="font-bold text-dark text-xl mb-2">No orders yet</h2>
          <p className="text-dark/50 text-sm mb-6">You haven't placed any orders. Start shopping!</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-olive text-white font-bold px-7 py-3.5 rounded-full hover:bg-olive/80 transition-colors"
          >
            <Package size={16} />
            <span>Shop Now</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const cfg = statusConfig[order.status] ?? statusConfig.pending;
            return (
              <div
                key={order.id}
                className="bg-white border border-olive/10 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:border-olive/30 hover:shadow-md transition-all"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center shrink-0">
                  <Package size={20} className="text-olive" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-dark text-sm">Order #{order.id.slice(-8).toUpperCase()}</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
                      {cfg.icon}
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-dark/50 text-xs mt-1">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                    {' · '}
                    {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Total */}
                <div className="text-right shrink-0">
                  <p className="font-black text-dark text-lg">₹{order.total.toLocaleString()}</p>
                  <ChevronRight size={16} className="text-dark/30 ml-auto" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

