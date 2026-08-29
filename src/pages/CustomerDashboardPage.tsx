import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { uploadToStorage } from '../lib/supabaseStorage';
import {
  User,
  Package,
  Heart,
  ShoppingBag,
  Bell,
  Star,
  Settings,
  Camera,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  LogOut,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Save,
  Store
} from 'lucide-react';

interface CustomerDashboardPageProps {
  onNavigate: (route: string) => void;
}

export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({ onNavigate }) => {
  const {
    currentUser,
    isLoggedIn,
    orders,
    wishlist,
    cart,
    products,
    notifications,
    reviews,
    formatPrice,
    logout,
    updateUserProfile,
    markNotificationRead,
    showToast,
    removeFromCart,
    toggleWishlist
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'cart' | 'notifications' | 'reviews'>('profile');

  // Edit Profile State
  const [fullName, setFullName] = useState(currentUser.full_name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar || '');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-3xl brand-gradient text-white flex items-center justify-center mx-auto shadow-xl">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold font-display text-foreground">Sign In to Your Account</h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Access your personal profile, delivery tracking across Rwanda, saved wishlist, and active orders.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('/login')}
            className="px-6 py-3 rounded-2xl brand-gradient text-white text-xs font-bold shadow-md hover:opacity-90"
          >
            Sign In with Supabase
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

  // Filter user's specific records
  const myOrders = orders.filter(
    (o) => o.user_id === currentUser.id || (currentUser.email && o.customer_email?.toLowerCase() === currentUser.email.toLowerCase())
  );
  const myWishlistProducts = products.filter((p) => wishlist.includes(p.id));
  const myReviews = reviews.filter((r) => r.user_id === currentUser.id);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const res = await uploadToStorage('avatars', file);
      if (res.url) {
        setAvatarUrl(res.url);
        await updateUserProfile({ avatar_url: res.url });
        showToast('Avatar Uploaded', 'Your profile picture has been updated in Supabase Storage.', 'success');
      } else {
        showToast('Upload Error', res.error || 'Failed to upload picture.', 'error');
      }
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const ok = await updateUserProfile({
        full_name: fullName,
        phone,
        avatar_url: avatarUrl
      });
      if (ok) {
        showToast('Profile Saved', 'Your information is updated in Supabase.', 'success');
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Header Profile Summary */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={avatarUrl || currentUser.avatar}
              alt={currentUser.full_name || 'User'}
              className="w-20 h-20 rounded-3xl object-cover border-2 border-brand/20 bg-secondary"
            />
            <label className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-brand text-white shadow-md cursor-pointer hover:opacity-90">
              <Camera className="w-3.5 h-3.5" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl font-bold font-display text-foreground">
                {currentUser.full_name || 'Customer'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase brand-gradient text-white">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{currentUser.email}</p>
            {currentUser.phone && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center sm:justify-start">
                <Phone className="w-3 h-3 text-brand" />
                <span>{currentUser.phone}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'brand-gradient text-white shadow-brand/20'
                : 'bg-secondary text-foreground hover:bg-brand/10 hover:text-brand border border-border'
            }`}
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>

          {currentUser.role === 'seller' && (
            <button
              onClick={() => onNavigate('/seller')}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 text-white font-bold text-xs shadow-sm hover:bg-amber-600 transition-colors flex items-center gap-1.5"
            >
              <Store className="w-4 h-4" />
              <span>Seller Hub</span>
            </button>
          )}

          {(currentUser.role === 'admin' || currentUser.role === 'super_admin') && (
            <button
              onClick={() => onNavigate('/super-admin')}
              className="px-4 py-2.5 rounded-2xl brand-gradient text-white font-bold text-xs shadow-sm hover:opacity-90 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Super Admin</span>
            </button>
          )}

          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-2xl bg-secondary hover:bg-rose-500/10 hover:text-rose-500 text-foreground font-bold text-xs border border-border transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border text-xs">
        {[
          { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
          { id: 'orders', label: `Orders (${myOrders.length})`, icon: <Package className="w-4 h-4" /> },
          { id: 'wishlist', label: `Wishlist (${myWishlistProducts.length})`, icon: <Heart className="w-4 h-4" /> },
          { id: 'cart', label: `Cart (${cart.length})`, icon: <ShoppingBag className="w-4 h-4" /> },
          { id: 'notifications', label: `Notifications (${notifications.length})`, icon: <Bell className="w-4 h-4" /> },
          { id: 'reviews', label: `Reviews (${myReviews.length})`, icon: <Star className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'brand-gradient text-white shadow-sm'
                : 'bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Profile Details & Edit */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="max-w-2xl p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-6 text-foreground">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-bold font-display">Personal Profile Details</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Manage your personal information synced with Supabase Auth</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold">Email Address</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full p-3 rounded-xl bg-secondary/50 border border-border text-muted-foreground cursor-not-allowed"
              />
              <span className="text-[10px] text-muted-foreground">Managed via Supabase Auth</span>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold">Phone Number (MTN MoMo / WhatsApp)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+250 793 032 430"
                className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSavingProfile || isUploadingAvatar}
            className="px-6 py-3 rounded-xl brand-gradient text-white text-xs font-bold hover:opacity-95 shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      )}

      {/* TAB 2: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {myOrders.length === 0 ? (
            <div className="p-12 rounded-3xl bg-card border border-border text-center space-y-3">
              <Package className="w-10 h-10 text-muted-foreground mx-auto" />
              <p className="font-bold text-sm text-foreground">No orders yet</p>
              <p className="text-xs text-muted-foreground">Your purchases will be listed here with live delivery status.</p>
              <button
                onClick={() => onNavigate('/products')}
                className="px-5 py-2.5 rounded-xl brand-gradient text-white text-xs font-bold shadow-md inline-block"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            myOrders.map((order) => (
              <div key={order.id} className="p-6 rounded-3xl bg-card border border-border space-y-5 shadow-sm text-foreground">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border text-xs">
                  <div>
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-secondary text-brand mr-2">
                      {order.tracking_code}
                    </span>
                    <span className="font-bold capitalize">{order.status.replace('_', ' ')}</span>
                    <p className="text-muted-foreground mt-1">
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground block text-[11px]">Total Paid</span>
                    <span className="font-extrabold text-base text-foreground font-display">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="font-semibold">{item.name} (x{item.quantity})</span>
                      <span className="font-mono font-bold text-foreground">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Destination: {order.customer_name}, {order.district} ({order.sector})
                  </span>
                  <button
                    onClick={() => onNavigate(`/track?code=${order.tracking_code}`)}
                    className="px-3.5 py-1.5 rounded-xl brand-gradient text-white font-bold flex items-center gap-1"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Live</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {myWishlistProducts.length === 0 ? (
            <div className="col-span-full p-12 rounded-3xl bg-card border border-border text-center space-y-3">
              <Heart className="w-10 h-10 text-muted-foreground mx-auto" />
              <p className="font-bold text-sm text-foreground">Your wishlist is empty</p>
              <p className="text-xs text-muted-foreground">Save items you love by clicking the heart icon on products.</p>
            </div>
          ) : (
            myWishlistProducts.map((p) => (
              <div key={p.id} className="p-4 rounded-3xl bg-card border border-border space-y-3 flex flex-col justify-between shadow-sm">
                <img src={p.images[0]} alt={p.name} className="w-full aspect-square rounded-2xl object-cover bg-secondary" />
                <div>
                  <h4 className="font-bold text-xs line-clamp-1">{p.name}</h4>
                  <span className="font-extrabold text-brand text-sm">{formatPrice(p.discount_price || p.price)}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onNavigate(`/product/${p.id}`)}
                    className="flex-1 py-2 rounded-xl brand-gradient text-white text-xs font-bold text-center"
                  >
                    View
                  </button>
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="p-2 rounded-xl bg-secondary hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500"
                  >
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: Cart */}
      {activeTab === 'cart' && (
        <div className="space-y-4 max-w-2xl">
          {cart.length === 0 ? (
            <div className="p-12 rounded-3xl bg-card border border-border text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto" />
              <p className="font-bold text-sm text-foreground">Your cart is empty</p>
              <button
                onClick={() => onNavigate('/products')}
                className="px-5 py-2.5 rounded-xl brand-gradient text-white text-xs font-bold shadow-md inline-block"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.product.id} className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.product.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover bg-secondary" />
                    <div>
                      <h4 className="font-bold">{item.product.name}</h4>
                      <span className="font-bold text-brand">{formatPrice(item.product.discount_price || item.product.price)} x {item.quantity}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-rose-500 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => onNavigate('/checkout')}
                className="w-full py-3.5 rounded-2xl brand-gradient text-white font-bold text-xs shadow-md"
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      )}

      {/* TAB 5: Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-3 max-w-2xl">
          {notifications.length === 0 ? (
            <div className="p-12 rounded-3xl bg-card border border-border text-center text-xs text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-4 rounded-2xl border transition-colors cursor-pointer text-xs space-y-1 ${
                  n.is_read ? 'bg-card border-border text-muted-foreground' : 'bg-brand/5 border-brand/30 text-foreground font-semibold'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-foreground">{n.title}</h4>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {new Date(n.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs leading-relaxed">{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 6: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-4 max-w-2xl">
          {myReviews.length === 0 ? (
            <div className="p-12 rounded-3xl bg-card border border-border text-center text-xs text-muted-foreground">
              You haven't submitted any reviews yet.
            </div>
          ) : (
            myReviews.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-card border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
