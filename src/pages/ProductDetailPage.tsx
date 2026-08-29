import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SUPPORT_PHONE } from '../lib/constants';
import { ProductCard } from '../components/ProductCard';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingBag,
  Star,
  Share2,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  MessageCircle,
  Globe,
  Send
} from 'lucide-react';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (route: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, onNavigate }) => {
  const {
    products,
    sellers,
    addToCart,
    toggleWishlist,
    isInWishlist,
    reviews,
    addReview,
    showToast,
    formatPrice
  } = useStore();

  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'delivery' | 'reviews'>('specs');

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const product = products.find((p) => p.id === productId) || products[0];
  const seller = sellers.find((s) => s.id === product.seller_id);
  const isSaved = isInWishlist(product.id);
  const effectivePrice = product.discount_price || product.price;
  const discountPercent = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const productReviews = reviews.filter((r) => r.product_id === product.id);
  const relatedProducts = products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link Copied 📋', 'Product link copied to clipboard.');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addReview(product.id, reviewRating, reviewComment.trim());
    setReviewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-12">
      {/* Breadcrumb & Back */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <button
          onClick={() => onNavigate('/products')}
          className="flex items-center gap-1 hover:text-brand font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Global Catalog</span>
        </button>

        <div className="flex items-center gap-1.5 truncate max-w-md">
          <span className="cursor-pointer hover:text-foreground" onClick={() => onNavigate('/')}>Home</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="cursor-pointer hover:text-foreground" onClick={() => onNavigate(`/products?category=${product.category_id}`)}>
            {product.category_name}
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-semibold truncate">{product.name}</span>
        </div>
      </div>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-secondary/40 border border-border">
            <img
              src={product.images[selectedImg] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1.5 text-xs font-extrabold text-white brand-gradient rounded-full shadow-lg shadow-brand/20">
                -{discountPercent}% OFF
              </span>
            )}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 dark:bg-card/90 text-foreground backdrop-blur-md shadow-md hover:scale-110 transition-transform"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImg === idx ? 'border-brand shadow-md scale-105' : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold text-brand bg-brand/10 rounded-full">
                {product.category_name}
              </span>
              {product.brand && (
                <span className="text-xs font-semibold text-muted-foreground">
                  By {product.brand}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-border'
                  }`}
                />
              ))}
              <span className="text-sm font-bold text-foreground ml-2">{product.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              • {product.review_count} verified buyer ratings
            </span>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-secondary/50 border border-border flex items-baseline justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground block">Global Marketplace Price</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold font-display text-foreground">
                  {formatPrice(effectivePrice)}
                </span>
                {product.discount_price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              {product.quantity > 0 ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>In Stock ({product.quantity})</span>
                </span>
              ) : (
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-500/10 text-rose-500">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            {product.brand && (
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-muted-foreground block text-[10px]">Brand</span>
                <span className="font-semibold text-foreground">{product.brand}</span>
              </div>
            )}
            {product.sku && (
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-muted-foreground block text-[10px]">SKU Code</span>
                <span className="font-semibold text-foreground font-mono text-[11px]">{product.sku}</span>
              </div>
            )}
            {product.color && (
              <div className="p-3 rounded-xl bg-card border border-border">
                <span className="text-muted-foreground block text-[10px]">Color / Finish</span>
                <span className="font-semibold text-foreground">{product.color}</span>
              </div>
            )}
          </div>

          {/* Purchase Action Row */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-border rounded-2xl bg-secondary/50 p-1 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl hover:bg-card flex items-center justify-center font-bold text-base text-foreground"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold text-sm text-foreground font-mono">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl hover:bg-card flex items-center justify-center font-bold text-base text-foreground"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={() => addToCart(product, quantity)}
                disabled={product.quantity <= 0}
                className="flex-1 w-full py-3.5 px-6 rounded-2xl brand-gradient text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-brand/25 active:scale-98 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart ({formatPrice(effectivePrice * quantity)})</span>
              </button>
            </div>

            {/* Instant Checkout Option */}
            <button
              type="button"
              onClick={() => {
                addToCart(product, quantity);
                onNavigate('/checkout');
              }}
              className="w-full py-3 px-4 rounded-2xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-opacity"
            >
              Buy Now with Instant Global Checkout
            </button>
          </div>

          {/* Seller Store Highlight Card */}
          {seller && (
            <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={seller.logo}
                  alt={seller.store_name}
                  className="w-12 h-12 rounded-xl object-cover bg-secondary shrink-0 border border-border"
                />
                <div>
                  <h4 className="font-bold text-xs text-foreground font-display flex items-center gap-1">
                    {seller.store_name}
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  </h4>
                  <p className="text-[11px] text-muted-foreground">{seller.address}</p>
                </div>
              </div>

              <a
                href={`tel:${seller.phone}`}
                className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-brand/10 hover:text-brand text-foreground text-xs font-semibold transition-colors shrink-0 flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Contact Vendor</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Tabs: Specifications / Delivery Info / Reviews */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'specs' ? 'brand-gradient text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'delivery' ? 'brand-gradient text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Worldwide Shipping & Warranty
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'reviews' ? 'brand-gradient text-white' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Buyer Reviews ({productReviews.length})
          </button>
        </div>

        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-secondary/50 flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="font-semibold text-foreground">{product.category_name}</span>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 flex justify-between">
              <span className="text-muted-foreground">Brand</span>
              <span className="font-semibold text-foreground">{product.brand || 'Original OEM'}</span>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 flex justify-between">
              <span className="text-muted-foreground">SKU / Model</span>
              <span className="font-semibold text-foreground font-mono">{product.sku}</span>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 flex justify-between">
              <span className="text-muted-foreground">Weight</span>
              <span className="font-semibold text-foreground">{product.weight || 'Standard export parcel'}</span>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 flex justify-between">
              <span className="text-muted-foreground">Dimensions</span>
              <span className="font-semibold text-foreground">{product.dimensions || 'Standard retail crating'}</span>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 flex justify-between">
              <span className="text-muted-foreground">Material / Housing</span>
              <span className="font-semibold text-foreground">{product.material || 'Aerospace & Industrial Grade'}</span>
            </div>
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
            <div className="p-4 rounded-2xl bg-secondary/40 border border-border flex items-start gap-3">
              <Truck className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-foreground">DHL Express & FedEx Worldwide Air Freight</h4>
                <p className="mt-1">
                  Orders are dispatched within 24 hours from international distribution hubs. Express air cargo arrives in North America & Europe in 2–4 business days, Asia/Middle East in 3–5 days, and Africa/Latin America in 3–6 business days with full door-to-door tracking.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/40 border border-border flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-foreground">100% Escrow Buyer Protection & 14-Day Global Warranty</h4>
                <p className="mt-1">
                  Payment is held in verified bank escrow until you receive and inspect your items. Includes 14-day hassle-free international return and replacement policy with manufacturer warranty coverage.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8">
            <div className="space-y-4">
              {productReviews.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  No verified buyer reviews yet. Be the first to share your global experience!
                </p>
              ) : (
                productReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full brand-gradient text-white flex items-center justify-center font-bold text-xs">
                          {rev.user_name.charAt(0)}
                        </div>
                        <span className="font-bold text-xs text-foreground">{rev.user_name}</span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-muted-foreground block">
                      {new Date(rev.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review */}
            <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-secondary/30 border border-border space-y-4">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Leave a Review</h4>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Your Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-border'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write your review about this product..."
                rows={3}
                className="w-full p-3 text-xs rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-brand text-foreground placeholder:text-muted-foreground"
              />

              <button
                type="submit"
                disabled={!reviewComment.trim()}
                className="px-5 py-2.5 rounded-xl brand-gradient text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Review</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h3 className="text-xl font-bold font-display text-foreground">
            Related Products in {product.category_name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
