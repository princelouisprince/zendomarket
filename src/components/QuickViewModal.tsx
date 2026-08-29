import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, ShieldCheck, Star, Truck, ExternalLink, Globe } from 'lucide-react';

interface QuickViewModalProps {
  onNavigate?: (route: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ onNavigate }) => {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isInWishlist, formatPrice } = useStore();
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isSaved = isInWishlist(product.id);
  const price = product.discount_price || product.price;

  const handleFullDetails = () => {
    setQuickViewProduct(null);
    if (onNavigate) {
      onNavigate(`/product/${product.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden text-foreground flex flex-col md:flex-row max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery column */}
        <div className="md:w-1/2 p-6 bg-secondary/30 flex flex-col gap-3 justify-between">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-secondary">
            <img
              src={product.images[selectedImg] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImg === idx ? 'border-brand' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-brand px-2 py-0.5 rounded-full bg-brand/10">
                {product.category_name}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                {product.seller_name}
              </span>
            </div>

            <h2 className="text-lg font-bold font-display leading-snug">
              {product.name}
            </h2>

            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-foreground ml-1">{product.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground font-mono">({product.review_count} global ratings)</span>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl font-extrabold text-foreground font-display">
                {formatPrice(price)}
              </span>
              {product.discount_price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              {product.brand && (
                <div className="p-2 rounded-xl bg-secondary/50">
                  <span className="text-muted-foreground block text-[10px]">Brand</span>
                  <span className="font-semibold">{product.brand}</span>
                </div>
              )}
              {product.color && (
                <div className="p-2 rounded-xl bg-secondary/50">
                  <span className="text-muted-foreground block text-[10px]">Color</span>
                  <span className="font-semibold">{product.color}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <Globe className="w-4 h-4 text-brand" />
              <span>Worldwide express air shipping available</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-xl bg-secondary/50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg hover:bg-card flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="w-10 text-center font-semibold text-sm font-mono">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg hover:bg-card flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart(product, quantity);
                  setQuickViewProduct(null);
                }}
                disabled={product.quantity <= 0}
                className="flex-1 py-3 px-4 rounded-xl brand-gradient text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-md shadow-brand/20 active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart ({formatPrice(price * quantity)})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleFullDetails}
              className="w-full text-center text-xs font-semibold text-brand hover:underline flex items-center justify-center gap-1 py-1"
            >
              <span>View Full Product Details & Specs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
