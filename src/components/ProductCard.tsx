import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingBag, Eye, Star, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onNavigate?: (route: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addToCart, setQuickViewProduct, formatPrice, isLoggedIn } = useStore();
  const { t } = useLanguage();

  const discountPercent = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const handleCardClick = () => {
    if (onNavigate) onNavigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      if (onNavigate) onNavigate('/login');
      return;
    }
    addToCart(product, 1);
  };

  // No default headphone image — use product name-based placeholder
  const imgSrc = product.images?.[0] ||
    `https://placehold.co/600x600/0f172a/7c3aed?text=${encodeURIComponent(product.name.slice(0, 14))}`;

  return (
    <div className="group relative rounded-2xl border border-border bg-card overflow-hidden card-hover-lift flex flex-col h-full transition-all duration-300">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-secondary/50 overflow-hidden cursor-pointer" onClick={handleCardClick}>
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/600x600/0f172a/7c3aed?text=${encodeURIComponent(product.name.slice(0, 14))}`;
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="px-2.5 py-1 text-xs font-bold text-white rounded-full brand-gradient shadow-md shadow-brand/20">
              -{discountPercent}% OFF
            </span>
          )}
          {product.featured && (
            <span className="px-2.5 py-0.5 text-[11px] font-semibold text-amber-900 bg-amber-200/90 dark:bg-amber-400 dark:text-black rounded-full backdrop-blur-sm shadow-sm">
              {t.home.tabFeatured}
            </span>
          )}
          {product.quantity <= 0 ? (
            <span className="px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 bg-rose-100 dark:bg-rose-950 dark:text-rose-300 rounded-full">
              {t.products.outOfStock}
            </span>
          ) : product.quantity <= 5 ? (
            <span className="px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 bg-amber-100 dark:bg-amber-950 dark:text-amber-300 rounded-full">
              {t.products.limitedStock} ({product.quantity})
            </span>
          ) : null}
        </div>

        {/* Quick View */}
        <div className="absolute top-3 right-3 z-10">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
            aria-label="Quick View"
            className="p-2 rounded-full bg-white/90 dark:bg-card/90 text-muted-foreground hover:text-brand hover:scale-110 backdrop-blur-md shadow-sm transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span className="font-medium text-brand truncate max-w-[120px]">{product.category_name}</span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground truncate max-w-[140px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              {product.seller_name}
            </span>
          </div>

          <h3
            onClick={handleCardClick}
            className="font-semibold text-sm line-clamp-2 text-foreground hover:text-brand transition-colors cursor-pointer leading-snug font-display"
          >
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-foreground ml-1">{product.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">({product.review_count})</span>
          </div>
        </div>

        {/* Price & Cart */}
        <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-bold text-foreground font-display">
              {formatPrice(product.discount_price || product.price)}
            </div>
            {product.discount_price && (
              <div className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</div>
            )}
          </div>

          <button
            type="button"
            disabled={product.quantity <= 0}
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm ${
              product.quantity <= 0
                ? 'bg-secondary text-muted-foreground cursor-not-allowed'
                : 'brand-gradient text-white hover:opacity-95 hover:shadow-brand/20 active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isLoggedIn ? t.common.addToCart : t.auth.signIn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
