import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { INTERNATIONAL_COUNTRIES } from '../lib/constants';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Globe
} from 'lucide-react';

interface CartPageProps {
  onNavigate: (route: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { cart, removeFromCart, updateCartQuantity, cartSubtotal, clearCart, showToast, formatPrice } = useStore();
  const [selectedCountryCode, setSelectedCountryCode] = useState('US');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const selectedCountry = INTERNATIONAL_COUNTRIES.find((c) => c.code === selectedCountryCode) || INTERNATIONAL_COUNTRIES[0];

  // International delivery estimation in USD base
  const deliveryFee = cart.length === 0 ? 0 : 25;
  const total = Math.max(0, cartSubtotal - promoDiscount + deliveryFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ZENDO10' || promoCode.trim().toUpperCase() === 'GLOBAL10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setPromoDiscount(discount);
      setPromoApplied(true);
      showToast('Promo Code Applied! 🎉', `Saved ${formatPrice(discount)} (10% discount)`);
    } else {
      showToast('Invalid Promo Code', 'Try "ZENDO10" for 10% discount on your international order.', 'warning');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-secondary text-muted-foreground flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-display text-foreground">Your international cart is empty</h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            Discover verified global electronics, luxury timepieces, designer furniture, and factory equipment.
          </p>
        </div>
        <button
          onClick={() => onNavigate('/products')}
          className="px-8 py-3.5 rounded-2xl brand-gradient text-white text-xs sm:text-sm font-bold shadow-lg shadow-brand/20 hover:opacity-95"
        >
          Explore Global Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground">
          Shopping Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-muted-foreground hover:text-rose-500 font-semibold transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(({ product, quantity, selectedColor }) => {
            const price = product.discount_price || product.price;
            return (
              <div
                key={product.id}
                className="p-4 sm:p-5 rounded-3xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-20 h-20 rounded-2xl object-cover bg-secondary shrink-0 cursor-pointer"
                    onClick={() => onNavigate(`/product/${product.id}`)}
                  />
                  <div className="space-y-1 min-w-0">
                    <span className="text-[11px] font-bold text-brand">{product.category_name}</span>
                    <h3
                      onClick={() => onNavigate(`/product/${product.id}`)}
                      className="font-bold text-sm text-foreground hover:text-brand transition-colors cursor-pointer line-clamp-1 font-display"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">Seller: {product.seller_name}</p>
                    {selectedColor && (
                      <span className="text-[11px] text-muted-foreground">Color: {selectedColor}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                  {/* Quantity */}
                  <div className="flex items-center border border-border rounded-xl bg-secondary/50 p-1">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(product.id, quantity - 1)}
                      className="w-7 h-7 rounded-lg hover:bg-card flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-xs font-mono">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 rounded-lg hover:bg-card flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right min-w-[110px]">
                    <div className="text-sm font-bold text-foreground font-display">
                      {formatPrice(price * quantity)}
                    </div>
                    {quantity > 1 && (
                      <div className="text-[10px] text-muted-foreground">
                        {formatPrice(price)} each
                      </div>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-card border border-border space-y-5 text-foreground shadow-sm">
            <h3 className="text-base font-bold font-display border-b border-border pb-3">
              Order Summary
            </h3>

            {/* Destination Country Estimator */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-muted-foreground flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-brand" />
                  <span>Ship To:</span>
                </span>
                <span className="text-brand font-bold">{selectedCountry.flag} {selectedCountry.name}</span>
              </label>
              <select
                value={selectedCountryCode}
                onChange={(e) => setSelectedCountryCode(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand"
              >
                {INTERNATIONAL_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code (try ZENDO10)"
                  className="w-full pl-8 pr-2 py-2 text-xs rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-brand uppercase"
                />
                <Tag className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-secondary hover:bg-brand/10 hover:text-brand text-xs font-bold transition-colors border border-border"
              >
                Apply
              </button>
            </form>

            {/* Costs Breakdown */}
            <div className="space-y-2 text-xs border-t border-border pt-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Items Subtotal</span>
                <span className="font-semibold text-foreground">{formatPrice(cartSubtotal)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Promo Discount (10%)</span>
                  <span>-{formatPrice(promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>DHL Express Shipping ({selectedCountry.name})</span>
                <span className="font-semibold text-foreground">{formatPrice(deliveryFee)}</span>
              </div>

              <div className="border-t border-border pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-foreground">Estimated Total</span>
                <span className="text-xl font-black text-brand font-display">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Proceed to Checkout */}
            <button
              onClick={() => onNavigate('/checkout')}
              className="w-full py-4 rounded-2xl brand-gradient text-white font-bold text-sm hover:opacity-95 shadow-lg shadow-brand/25 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Global Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
