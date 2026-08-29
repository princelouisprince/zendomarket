import React from 'react';
import { useStore } from '../context/StoreContext';
import { Package, Truck, CheckCircle2, Clock, ArrowRight, ExternalLink, Globe } from 'lucide-react';

interface OrdersPageProps {
  onNavigate: (route: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const { orders, currentUser, isLoggedIn, isAdmin, formatPrice } = useStore();

  // Admins see all orders; customers see only their own
  const visibleOrders = isAdmin
    ? orders
    : orders.filter(
        (o) =>
          o.user_id === currentUser.id ||
          (currentUser.email && o.customer_email?.toLowerCase() === currentUser.email.toLowerCase())
      );

  if (!isLoggedIn) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-5 animate-fade-in">
        <div className="w-16 h-16 rounded-full brand-gradient text-white flex items-center justify-center mx-auto shadow-lg">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold font-display text-foreground">Sign In to View Your Orders</h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your international order history, customs invoices, and delivery statuses are securely linked to your Zendo account.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('/login')}
            className="px-6 py-3 rounded-2xl brand-gradient text-white text-xs font-bold shadow-md"
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigate('/register')}
            className="px-6 py-3 rounded-2xl bg-secondary border border-border text-foreground text-xs font-bold hover:bg-border transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      <div className="pb-4 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground flex items-center gap-2">
            <Globe className="w-7 h-7 text-brand" />
            <span>{isAdmin ? 'Global Platform Orders' : 'My International Orders'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {isAdmin ? `${visibleOrders.length} total orders across all international customers` : `${visibleOrders.length} order(s) linked to your account`}
          </p>
        </div>
        <button
          onClick={() => onNavigate('/track')}
          className="px-4 py-2 rounded-xl bg-secondary text-foreground text-xs font-bold hover:bg-border transition-colors"
        >
          Track by Code
        </button>
      </div>

      {visibleOrders.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="w-12 h-12 rounded-full bg-secondary text-muted-foreground flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <p className="font-semibold text-foreground">No orders yet</p>
          <p className="text-xs text-muted-foreground">Start shopping the global catalog and your orders will appear here.</p>
          <button
            onClick={() => onNavigate('/products')}
            className="mt-4 px-6 py-3 rounded-2xl brand-gradient text-white text-xs font-bold shadow-md inline-flex items-center gap-2"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : null}

      <div className="space-y-6">
        {visibleOrders.map((order) => (
          <div
            key={order.id}
            className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-6"
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-secondary text-foreground">
                    {order.tracking_code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold capitalize bg-brand/10 text-brand">
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Placed on {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-muted-foreground block">Order Total</span>
                <span className="text-lg font-bold text-foreground font-display">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-secondary border border-border" />
                    )}
                    <div>
                      <h4 className="font-bold text-foreground">{item.name}</h4>
                      <p className="text-muted-foreground">Qty: {item.quantity} • {formatPrice(item.price)} each</p>
                    </div>
                  </div>
                  <span className="font-bold text-foreground font-display">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Destination & Action */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="text-muted-foreground">
                <span className="font-semibold text-foreground">Destination:</span> {order.customer_name}, {order.city || order.district || 'Global Hub'} {order.country ? `(${order.country})` : ''}
              </div>

              <button
                onClick={() => onNavigate(`/track?code=${order.tracking_code}`)}
                className="px-4 py-2 rounded-xl brand-gradient text-white text-xs font-bold hover:opacity-90 flex items-center gap-1.5 shadow-sm"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Track Live Delivery</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
