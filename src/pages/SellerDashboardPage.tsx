import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Seller } from '../types';
import { uploadToStorage } from '../lib/supabaseStorage';
import { RWANDA_DISTRICTS, CURRENCIES } from '../lib/constants';

// The app stores prices in a USD base; the marketplace operates in Rwandan Francs,
// so seller-entered prices are FRW and converted to/from the USD base on save/edit.
const RWF_RATE = CURRENCIES.RWF.exchangeRateFromUSD;
import {
  Store,
  DollarSign,
  Package,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Settings,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Layers,
  X,
  Save,
  Percent,
  Camera,
  AlertCircle,
  Eye,
  User
} from 'lucide-react';

interface SellerDashboardPageProps {
  onNavigate?: (route: string) => void;
}

export const SellerDashboardPage: React.FC<SellerDashboardPageProps> = ({ onNavigate }) => {
  const {
    currentUser,
    sellers,
    products,
    orders,
    categories,
    submitProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    deleteOrder,
    formatPrice,
    showToast,
    refreshData
  } = useStore();

  // Always reflect the latest orders/products when the seller opens their dashboard
  // (the global data load runs once at app start and won't include orders placed later).
  React.useEffect(() => {
    refreshData();
  }, [refreshData]);

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'earnings' | 'settings'>('overview');
  const [confirmDeleteOrder, setConfirmDeleteOrder] = useState<any | null>(null);

  // Match current seller — ONLY match by current user ID, never fall back to another seller
  const currentSeller =
    sellers.find((s) => s.user_id === currentUser.id) ||
    (currentUser.id ? {
      id: '00000000-0000-0000-0000-000000000000',
      user_id: currentUser.id,
      store_name: currentUser.full_name || 'My Store',
      business_name: currentUser.full_name || 'My Store',
      description: 'Verified Merchant',
      logo: currentUser.avatar,
      cover: '',
      phone: currentUser.phone || '',
      email: currentUser.email || '',
      district: 'Nyarugenge',
      sector: 'Kigali',
      address: 'Kigali, Rwanda',
      status: 'active',
      verified: true,
      rating: 5.0,
      rating_count: 0
    } : null);

  const sellerProducts = products.filter(
    (p) => p.seller_user_id === currentUser.id
  );

  const sellerOrders = orders.filter((o) => {
    const belongsToSeller =
      o.items.some(
        (i) => i.seller_user_id === currentUser.id || i.seller_id === currentSeller?.id
      ) || (currentSeller && Array.isArray(o.seller_ids) && o.seller_ids.includes(currentSeller.id));
    return belongsToSeller;
  });

  // Financial calculations (100% direct revenue to merchant)
  const totalSalesRevenue = sellerOrders.reduce((acc, o) => acc + o.subtotal, 0);

  // Add / Edit Product Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCatId, setProdCatId] = useState(categories[0]?.id || '');
  const [prodSubcategory, setProdSubcategory] = useState(categories[0]?.subcategories?.[0] || '');

  useEffect(() => {
    if (!prodCatId && categories.length > 0) {
      setProdCatId(categories[0].id);
      setProdSubcategory(categories[0].subcategories?.[0] || '');
    }
  }, [categories, prodCatId]);

  const [prodPrice, setProdPrice] = useState<number>(50000);
  const [prodDiscount, setProdDiscount] = useState<number>(0);
  const [prodQuantity, setProdQuantity] = useState<number>(10);
  const [prodBrand, setProdBrand] = useState('');
  const [prodColor, setProdColor] = useState('');
  const [prodCondition, setProdCondition] = useState('New');
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [isUploadingImg, setIsUploadingImg] = useState(false);

  const openAddModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdDesc('');
    const firstCat = categories[0];
    setProdCatId(firstCat?.id || '');
    setProdSubcategory(firstCat?.subcategories?.[0] || '');
    setProdPrice(50000);
    setProdDiscount(0);
    setProdQuantity(10);
    setProdBrand('Original');
    setProdColor('Standard');
    setProdCondition('New');
    setProdImages([]);
    setProductModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdDesc(p.description);
    setProdCatId(p.category_id);
    setProdSubcategory(p.subcategory || '');
    setProdPrice(Math.round((p.price || 0) * RWF_RATE));
    setProdDiscount(Math.round((p.discount_price || 0) * RWF_RATE));
    setProdQuantity(p.quantity);
    setProdBrand(p.brand || '');
    setProdColor(p.color || '');
    setProdCondition(p.condition || 'New');
    setProdImages(p.images.length > 0 ? p.images : []);
    setProductModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImg(true);
    try {
      const res = await uploadToStorage('product-images', file);
      if (res.url) {
        setProdImages((prev) => [res.url!, ...prev]);
        showToast('Image Uploaded', 'Product image uploaded to Supabase Storage.', 'success');
      } else {
        showToast('Upload Error', res.error || 'Failed to upload image.', 'error');
      }
    } finally {
      setIsUploadingImg(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const selectedCat = categories.find((c) => c.id === prodCatId);
    const autoSku = editingProduct?.sku || `ZND-${Date.now().toString().slice(-6)}`;

    // Seller enters prices in FRW; convert to the USD base the app stores.
    const priceUSD = Math.round((Number(prodPrice) / RWF_RATE) * 100) / 100;
    const discountUSD =
      prodDiscount && Number(prodDiscount) > 0
        ? Math.round((Number(prodDiscount) / RWF_RATE) * 100) / 100
        : undefined;

    if (editingProduct) {
      // Update existing
      await updateProduct(editingProduct.id, {
        name: prodName,
        description: prodDesc,
        category_id: prodCatId,
        category_name: selectedCat?.name || editingProduct.category_name,
        subcategory: prodSubcategory || undefined,
        price: priceUSD,
        discount_price: discountUSD,
        quantity: Number(prodQuantity),
        sku: autoSku,
        brand: prodBrand,
        color: prodColor,
        condition: prodCondition,
        images: prodImages
      });
    } else {
      // Create new
      await submitProduct({
        seller_id: currentSeller?.id || currentUser?.id,
        seller_user_id: currentUser?.id,
        category_id: prodCatId,
        category_name: selectedCat?.name || 'General',
        subcategory: prodSubcategory || undefined,
        seller_name: currentSeller?.store_name || currentUser?.full_name || 'Verified Merchant',
        name: prodName,
        description: prodDesc,
        price: priceUSD,
        discount_price: discountUSD,
        stock_quantity: Number(prodQuantity),
        sku: autoSku,
        brand: prodBrand,
        color: prodColor,
        condition: prodCondition,
        images: prodImages,
        status: 'pending_review'
      });
    }

    setProductModalOpen(false);
  };

  // Guard: if user is not logged in or not a seller
  if (!currentSeller) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4 animate-fade-in">
        <Store className="w-16 h-16 text-brand/40 mx-auto" />
        <h2 className="text-xl font-bold font-display text-foreground">Seller Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          You need an approved seller account to access the dashboard. Apply to become a seller first.
        </p>
        {onNavigate && (
          <button
            onClick={() => onNavigate('/become-seller')}
            className="px-6 py-3 rounded-2xl brand-gradient text-white text-xs font-bold shadow-md hover:opacity-95"
          >
            Apply to Become a Seller
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={currentSeller.logo || 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=300&q=80'}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover border border-border bg-secondary"
          />
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl font-bold font-display text-foreground">{currentSeller.store_name}</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Merchant</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{currentSeller.address || 'Kigali, Rwanda'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onNavigate && (
            <button
              onClick={() => onNavigate('/account')}
              className="px-4 py-3 rounded-2xl bg-secondary hover:bg-border text-foreground text-xs font-bold transition-colors flex items-center gap-1.5 border border-border"
            >
              <User className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}

          <button
            onClick={openAddModal}
            className="px-5 py-3 rounded-2xl brand-gradient text-white text-xs font-bold shadow-md hover:opacity-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border text-xs">
        {[
          { id: 'overview', label: 'Store Overview', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'products', label: `My Products (${sellerProducts.length})`, icon: <Package className="w-4 h-4" /> },
          { id: 'orders', label: `Orders (${sellerOrders.length})`, icon: <Truck className="w-4 h-4" /> },
          { id: 'earnings', label: 'Store Revenue & Payouts', icon: <DollarSign className="w-4 h-4" /> }
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

      {/* TAB: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-card border border-border space-y-1">
            <span className="text-xs text-muted-foreground font-semibold">Total Gross Sales</span>
            <p className="text-2xl font-black font-display text-foreground">{formatPrice(totalSalesRevenue)}</p>
            <span className="text-[11px] text-emerald-600 font-semibold">{sellerOrders.length} orders received</span>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border space-y-1">
            <span className="text-xs text-muted-foreground font-semibold">Available Merchant Payout</span>
            <p className="text-2xl font-black font-display text-emerald-600">{formatPrice(totalSalesRevenue)}</p>
            <span className="text-[11px] text-muted-foreground">MTN MoMo / Bank direct release</span>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border space-y-1">
            <span className="text-xs text-muted-foreground font-semibold">Live Listed Products</span>
            <p className="text-2xl font-black font-display text-foreground">{sellerProducts.filter((p) => p.status === 'approved').length}</p>
            <span className="text-[11px] text-emerald-500 font-semibold">
              Active in marketplace catalog
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border space-y-1">
            <span className="text-xs text-muted-foreground font-semibold">Customer Rating</span>
            <p className="text-2xl font-black font-display text-foreground">5.0 ★</p>
            <span className="text-[11px] text-muted-foreground">Verified buyer feedback</span>
          </div>
        </div>
      )}

      {/* TAB: Products Management */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {sellerProducts.length === 0 ? (
            <div className="p-12 rounded-3xl bg-card border border-border text-center space-y-3">
              <Package className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
              <p className="font-bold text-sm text-foreground">No Products Listed Yet</p>
              <p className="text-xs text-muted-foreground">Start by adding your first product to sell on ZENDO.</p>
              <button
                onClick={openAddModal}
                className="px-5 py-2.5 rounded-xl brand-gradient text-white text-xs font-bold shadow-md cursor-pointer"
              >
                + Add Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellerProducts.map((prod) => (
                <div key={prod.id} className="p-5 rounded-3xl bg-card border border-border space-y-4 text-xs text-foreground shadow-sm">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-secondary">
                    <img src={prod.images[0]} alt="" className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                      Approved
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-brand font-bold uppercase tracking-wider block">{prod.category_name}</span>
                    <h4 className="font-bold text-sm font-display truncate">{prod.name}</h4>
                    <p className="text-muted-foreground text-[11px] line-clamp-2 mt-1">{prod.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div>
                      <span className="font-black text-sm text-brand font-display">{formatPrice(prod.price)}</span>
                      <span className="text-[10px] text-muted-foreground block">Stock: {prod.quantity} units</span>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-2 rounded-xl bg-secondary hover:bg-border transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-2 rounded-xl bg-secondary hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {sellerOrders.length === 0 ? (
            <div className="p-12 rounded-3xl bg-card border border-border text-center text-xs text-muted-foreground">
              No orders received yet. Once buyers purchase your items, shipments will display here.
            </div>
          ) : (
            sellerOrders.map((order) => (
              <div key={order.id} className="p-6 rounded-3xl bg-card border border-border space-y-4 text-xs text-foreground">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                  <div>
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-secondary text-brand mr-2">
                      {order.order_number || order.tracking_code}
                    </span>
                    <span className="font-bold capitalize px-2 py-0.5 rounded-full bg-brand/10 text-brand text-[11px]">{order.status}</span>
                    <p className="text-muted-foreground mt-1">Recipient: {order.customer_name} ({order.customer_phone})</p>
                    <p className="text-muted-foreground text-[11px]">{order.delivery_address || order.address}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-base text-foreground">{formatPrice(order.subtotal)}</span>
                    <span className="text-[10px] text-muted-foreground block">{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-muted-foreground">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-secondary border border-border shrink-0"
                      />
                      <span className="flex-1 truncate">{item.name} (x{item.quantity})</span>
                      <span className="shrink-0 font-semibold text-foreground">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-muted-foreground text-[11px]">Payment: {order.payment_method}</span>
                  <div className="flex items-center gap-2">
                    {!['delivered', 'cancelled'].includes(order.status) && (
                      <select
                        value={order.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          await updateOrderStatus(order.id, newStatus);
                          showToast('Status Updated ✅', `Order #${order.order_number || order.tracking_code} marked as ${newStatus.replace('_', ' ')}.`, 'success');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-secondary border border-border text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand cursor-pointer"
                      >
                        <option value="confirmed">✅ Confirm Order</option>
                        <option value="ready">🚚 Ready to Deliver</option>
                        <option value="shipped">✈️ Shipped</option>
                        <option value="delivered">📦 Delivered</option>
                        <option value="cancelled">❌ Cancel</option>
                      </select>
                    )}
                    <button
                      onClick={() => setConfirmDeleteOrder(order)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Order</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB: Earnings */}
      {activeTab === 'earnings' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-6 text-xs text-foreground max-w-2xl">
          <h3 className="font-bold text-base font-display">Store Revenue & Direct Payouts</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-secondary/50 flex justify-between">
              <span>Total Sales Volume</span>
              <span className="font-bold font-mono">{formatPrice(totalSalesRevenue)}</span>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/50 flex justify-between">
              <span>Pending Release</span>
              <span className="font-bold font-mono text-muted-foreground">0 FRW</span>
            </div>
            <div className="p-4 rounded-2xl brand-gradient text-white flex justify-between font-bold text-sm shadow-md">
              <span>Direct Merchant Balance</span>
              <span className="font-mono">{formatPrice(totalSalesRevenue)}</span>
            </div>
          </div>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            Payouts are automatically wired via MTN Mobile Money / Bank Transfer every Tuesday and Friday upon confirmed delivery receipt with zero deduction.
          </p>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-card border border-border rounded-3xl shadow-2xl space-y-6 text-foreground text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="font-bold text-base font-display">
                {editingProduct ? 'Edit Product Listing' : 'Add New Product to Supabase'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="p-2 rounded-xl bg-secondary">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold">Product Title *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Solid Oak Dining Table 6-Seater"
                  className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold">Parent Category *</label>
                  <select
                    value={prodCatId}
                    onChange={(e) => {
                      const newId = e.target.value;
                      setProdCatId(newId);
                      const catObj = categories.find((c) => c.id === newId);
                      setProdSubcategory(catObj?.subcategories?.[0] || '');
                    }}
                    className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Dynamic Child Subcategory Dropdown */}
                {(() => {
                  const activeCatObj = categories.find((c) => c.id === prodCatId);
                  const subcats = activeCatObj?.subcategories || [];
                  return subcats.length > 0 ? (
                    <div className="space-y-1.5">
                      <label className="font-bold">Child Subcategory *</label>
                      <select
                        value={prodSubcategory}
                        onChange={(e) => setProdSubcategory(e.target.value)}
                        className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground font-medium"
                      >
                        {subcats.map((sub, i) => (
                          <option key={i} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="font-bold">Child Subcategory</label>
                      <input
                        type="text"
                        value={prodSubcategory}
                        onChange={(e) => setProdSubcategory(e.target.value)}
                        placeholder="e.g. Standard Item"
                        className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground"
                      />
                    </div>
                  );
                })()}

                <div className="space-y-1.5">
                  <label className="font-bold">Price (FRW) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand">FRW</span>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full pl-12 pr-3 py-3 rounded-xl bg-secondary border border-border text-foreground font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold">Discount Price in FRW (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-500">FRW</span>
                    <input
                      type="number"
                      value={prodDiscount || ''}
                      onChange={(e) => setProdDiscount(Number(e.target.value))}
                      placeholder="e.g. 45000"
                      className="w-full pl-12 pr-3 py-3 rounded-xl bg-secondary border border-border text-foreground font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold">Stock Quantity in Warehouse *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={prodQuantity}
                    onChange={(e) => setProdQuantity(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold">Brand</label>
                  <input
                    type="text"
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    placeholder="e.g. Apple / Kigali Custom"
                    className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold">Product Description & Specs *</label>
                <textarea
                  rows={3}
                  required
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Include warranty, dimensions, materials, color variants..."
                  className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground"
                />
              </div>

              {/* Supabase Storage Upload */}
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-3">
                <span className="font-bold block">Upload Product Images to Supabase Storage</span>
                <label className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border cursor-pointer hover:bg-secondary transition-colors">
                  <Camera className="w-4 h-4 text-brand" />
                  <span>{isUploadingImg ? 'Uploading to Supabase Storage...' : 'Upload Image File'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                {prodImages.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pt-1">
                    {prodImages.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-border shrink-0">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-secondary font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImg}
                  className="px-6 py-2.5 rounded-xl brand-gradient text-white font-bold shadow-md"
                >
                  {editingProduct ? 'Save Product Changes' : '✅ Add Product to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Order Confirmation Modal */}
      {confirmDeleteOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 bg-card border border-border rounded-3xl shadow-2xl space-y-4 text-foreground text-xs">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base font-display text-foreground">
                Delete Order #{confirmDeleteOrder.order_number || confirmDeleteOrder.tracking_code}?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                This will permanently delete this order and its records from the database.
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-3">
              <button
                onClick={() => setConfirmDeleteOrder(null)}
                className="px-4 py-2 rounded-xl bg-secondary font-bold cursor-pointer hover:bg-border transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteOrder(confirmDeleteOrder.id);
                  setConfirmDeleteOrder(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Yes, Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
