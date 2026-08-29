import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingCart, ArrowRight, Sparkles, PackageCheck } from 'lucide-react';

interface WishlistPageProps {
  onNavigate: (route: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate }) => {
  const {
    wishlist,
    products,
    addToCart,
    customerPurchasedCategories,
    currentUser,
    isLoggedIn,
    orders
  } = useStore();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  // Dynamic recommendations based on what this customer has previously bought
  const userOrders = orders.filter(
    (o) => o.user_id === currentUser.id || (currentUser.email && o.customer_email?.toLowerCase() === currentUser.email.toLowerCase())
  );

  const purchaseRecommendedProducts = products.filter(
    (p) =>
      customerPurchasedCategories.includes(p.category_id) &&
      !wishlist.includes(p.id)
  ).slice(0, 4);

  const handleAddAllToCart = () => {
    wishlistProducts.forEach((product) => {
      addToCart(product, 1);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-foreground flex items-center gap-3">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            <span>My Saved Favorites & Wishlist</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {wishlistProducts.length} items saved for future purchase
          </p>
        </div>

        {wishlistProducts.length > 0 && (
          <button
            onClick={handleAddAllToCart}
            className="px-5 py-3 rounded-2xl brand-gradient text-white text-xs font-bold shadow-md shadow-brand/20 hover:opacity-95 flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add All to Shopping Cart</span>
          </button>
        )}
      </div>

      {/* Main Wishlist Grid */}
      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-card border border-border space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold font-display text-foreground">Your Wishlist is Empty</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Browse our Rwandan catalog of electronics, smartphones, furniture, and agriculture products to save your favorites.
          </p>
          <button
            onClick={() => onNavigate('/products')}
            className="px-6 py-3 rounded-2xl brand-gradient text-white text-xs font-bold shadow-md flex items-center gap-2 mx-auto"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Purchase-Based Dynamic Recommendations */}
      {isLoggedIn && purchaseRecommendedProducts.length > 0 && (
        <div className="pt-8 border-t border-border space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl brand-gradient text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-foreground">
                Recommended For You (Based on Your Past Orders)
              </h2>
              <p className="text-xs text-muted-foreground">
                Personalized picks matching items and categories from your {userOrders.length} completed purchases
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {purchaseRecommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Purchases Summary */}
      {isLoggedIn && userOrders.length > 0 && (
        <div className="p-6 rounded-3xl bg-secondary/30 border border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-foreground">Order History Linked to Account</p>
              <p className="text-muted-foreground">You have {userOrders.length} order(s) stored under your profile</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/orders')}
            className="px-4 py-2 rounded-xl bg-card border border-border hover:border-brand font-bold text-foreground transition-colors"
          >
            View Order Receipts
          </button>
        </div>
      )}
    </div>
  );
};
