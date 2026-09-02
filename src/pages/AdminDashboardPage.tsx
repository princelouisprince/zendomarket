import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Supplier, SourcingRequest } from '../types';
import { formatFRW, formatFRWDirect } from '../lib/constants';
import { SUPABASE_SQL_SCHEMA, SUPABASE_URL } from '../lib/supabaseMirror';
import {
  ShieldAlert,
  Users,
  Store,
  Package,
  ShoppingBag,
  Database,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  Percent,
  FileText,
  Plus,
  Trash2,
  Check,
  X,
  Copy,
  DollarSign,
  Building2,
  UserPlus,
  Mail,
  Lock
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    sellers,
    sellerApplications,
    orders,
    categories,
    suppliers,
    sourcingRequests,
    commissionSettings,
    auditLogs,
    usersList,
    reviewSellerApplication,
    updateProduct,
    deleteProduct,
    updateOrder,
    saveSupplier,
    deleteSupplier,
    updateSourcingRequest,
    deleteSourcingRequest,
    updateCommissionRate,
    inviteAdmin,
    runSupabaseSync,
    lastSyncResult,
    isSyncing,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'applications'
    | 'products'
    | 'orders'
    | 'sync'
    | 'sourcing'
    | 'suppliers'
    | 'users'
    | 'commission'
    | 'audit'
  >('overview');

  // Stats
  const totalGMV = orders.reduce((acc, o) => acc + o.total, 0);
  const platformRevenue = Math.round(orders.reduce((acc, o) => acc + o.subtotal * (commissionSettings.rate / 100), 0));
  const pendingApplications = sellerApplications.filter((a) => a.status === 'pending');
  const pendingSourcing = sourcingRequests.filter((s) => s.status === 'requested' || s.status === 'searching');

  // Sourcing Quote Modal
  const [quoteModalReq, setQuoteModalReq] = useState<SourcingRequest | null>(null);
  const [confirmDeleteRfq, setConfirmDeleteRfq] = useState<SourcingRequest | null>(null);
  const [quoteSupplierId, setQuoteSupplierId] = useState(suppliers[0]?.id || '');
  const [quoteAmount, setQuoteAmount] = useState<number>(0);
  const [quoteNotes, setQuoteNotes] = useState('');
  const [quoteStatus, setQuoteStatus] = useState<SourcingRequest['status']>('quoted');

  // New Supplier Modal
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [editingSup, setEditingSup] = useState<Supplier | null>(null);
  const [supName, setSupName] = useState('');
  const [supCountry, setSupCountry] = useState('Rwanda');
  const [supCity, setSupCity] = useState('Kigali');
  const [supCategory, setSupCategory] = useState('Electronics & Computing');
  const [supPhone, setSupPhone] = useState('+250 788 ');
  const [supEmail, setSupEmail] = useState('');
  const [supDesc, setSupDesc] = useState('');
  const [supProducts, setSupProducts] = useState('');

  // Invite Admin Form
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');

  // Commission Input
  const [rateInput, setRateInput] = useState(commissionSettings.rate);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    showToast('SQL Schema Copied 📋', 'Paste into your Supabase SQL Editor to initialize all tables.');
  };

  const handleOpenQuoteModal = (req: SourcingRequest) => {
    setQuoteModalReq(req);
    setQuoteSupplierId(req.supplier_id || suppliers[0]?.id || '');
    setQuoteAmount(req.quote_amount || req.budget || 0);
    setQuoteNotes(req.quote_notes || 'Verified supplier confirmed stock and transit timeframe.');
    setQuoteStatus(req.status);
  };

  const handleSaveQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteModalReq) return;
    const sup = suppliers.find((s) => s.id === quoteSupplierId);
    await updateSourcingRequest(quoteModalReq.id, {
      supplier_id: quoteSupplierId,
      supplier_name: sup?.name,
      quote_amount: Number(quoteAmount),
      quote_notes: quoteNotes,
      status: quoteStatus
    });
    setQuoteModalReq(null);
  };

  const openAddSupplier = () => {
    setEditingSup(null);
    setSupName('');
    setSupCountry('Rwanda');
    setSupCity('Kigali');
    setSupCategory('Electronics & Hardware');
    setSupPhone('+250 788 000 111');
    setSupEmail('supplier@b2b.rw');
    setSupDesc('Verified regional distributor and warranty provider.');
    setSupProducts('Commercial Hardware, Spares, Solar Equipment');
    setSupplierModalOpen(true);
  };

  const handleSaveSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    const prodList = supProducts.split(',').map((s) => s.trim()).filter(Boolean);
    const newSup: Supplier = {
      id: editingSup ? editingSup.id : `sup-${Date.now()}`,
      name: supName,
      country: supCountry,
      city: supCity,
      category: supCategory,
      phone: supPhone,
      email: supEmail,
      description: supDesc,
      products: prodList,
      logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80',
      verified: true,
      rating: 4.9,
      rating_count: 50
    };
    await saveSupplier(newSup);
    setSupplierModalOpen(false);
  };

  const handleInviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminName.trim()) return;
    await inviteAdmin(newAdminEmail, newAdminName);
    setNewAdminEmail('');
    setNewAdminName('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Admin Suite Header */}
      <div className="p-6 sm:p-8 rounded-3xl brand-dark-banner text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>Super Administrator Suite • ZENDO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            Platform Management & Moderation
          </h1>
          <p className="text-xs text-white/80">
            Database: <code className="bg-black/30 px-2 py-0.5 rounded font-mono text-[11px]">{SUPABASE_URL}</code>
          </p>
        </div>

        <button
          onClick={runSupabaseSync}
          disabled={isSyncing}
          className="px-5 py-3 rounded-2xl brand-gradient text-white text-xs font-bold shadow-lg hover:opacity-95 flex items-center gap-2 self-start md:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Synchronizing Database...' : 'Run Full Supabase Sync'}</span>
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-secondary border border-border">
        {[
          { id: 'overview', label: 'Overview', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'applications', label: `Seller Apps (${pendingApplications.length})`, icon: <Store className="w-4 h-4" /> },
          { id: 'products', label: `Products (${products.length})`, icon: <Package className="w-4 h-4" /> },
          { id: 'orders', label: `Orders (${orders.length})`, icon: <ShoppingBag className="w-4 h-4" /> },
          { id: 'sync', label: 'Supabase Sync Status', icon: <Database className="w-4 h-4" /> },
          { id: 'sourcing', label: `Sourcing Shaka (${sourcingRequests.length})`, icon: <Sparkles className="w-4 h-4" /> },
          { id: 'suppliers', label: `Suppliers (${suppliers.length})`, icon: <Building2 className="w-4 h-4" /> },
          { id: 'users', label: 'Admins & Users', icon: <Users className="w-4 h-4" /> },
          { id: 'commission', label: 'Commission Rate', icon: <Percent className="w-4 h-4" /> },
          { id: 'audit', label: 'Audit Logs', icon: <FileText className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'brand-gradient text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-card'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-card border border-border space-y-2">
              <span className="text-xs text-muted-foreground font-semibold">Total Platform GMV</span>
              <p className="text-2xl font-black font-display text-foreground">{formatFRW(totalGMV)}</p>
              <span className="text-[11px] text-emerald-600 font-semibold">{orders.length} orders recorded</span>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border space-y-2">
              <span className="text-xs text-muted-foreground font-semibold">Platform Revenue ({commissionSettings.rate}%)</span>
              <p className="text-2xl font-black font-display text-brand">{formatFRW(platformRevenue)}</p>
              <span className="text-[11px] text-muted-foreground">From marketplace sales</span>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border space-y-2">
              <span className="text-xs text-muted-foreground font-semibold">Pending Seller Applications</span>
              <p className="text-2xl font-black font-display text-amber-500">{pendingApplications.length}</p>
              <span className="text-[11px] text-muted-foreground">Requires moderation</span>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border space-y-2">
              <span className="text-xs text-muted-foreground font-semibold">Active Shaka Sourcing</span>
              <p className="text-2xl font-black font-display text-purple-500">{pendingSourcing.length}</p>
              <span className="text-[11px] text-muted-foreground">Regional supplier requests</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Seller Applications */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-foreground">Merchant Approval Queue</h2>
            <span className="text-xs text-muted-foreground">{sellerApplications.length} applications</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sellerApplications.map((app) => (
              <div
                key={app.id}
                className="p-6 rounded-3xl bg-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-foreground font-display">{app.business_name}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                        app.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : app.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-600'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <strong>Applicant:</strong> {app.full_name} • <strong>Phone:</strong> {app.phone} • <strong>Email:</strong> {app.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Location:</strong> {app.business_location || 'Rwanda'}
                  </p>
                  <p className="text-xs text-foreground bg-secondary/50 p-3 rounded-xl">
                    "{app.description || app.business_description || 'Merchant application'}"
                  </p>
                </div>

                {app.status === 'pending' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => reviewSellerApplication(app.id, 'approved', 'Approved by administrator.')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve & Create Store</span>
                    </button>
                    <button
                      onClick={() => reviewSellerApplication(app.id, 'rejected', 'Missing business documentation.')}
                      className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 text-xs font-bold flex items-center gap-1.5"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Products Moderation */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-foreground">Catalog Moderation</h2>
            <span className="text-xs text-muted-foreground">{products.length} products listed</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img src={prod.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover bg-secondary" />
                  <div>
                    <h4 className="font-bold text-xs text-foreground">{prod.name}</h4>
                    <p className="text-[11px] text-muted-foreground">Seller: {prod.seller_name} • {formatFRW(prod.discount_price || prod.price)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateProduct({ ...prod, featured: !prod.featured })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      prod.featured ? 'bg-amber-400 text-black' : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {prod.featured ? 'Featured ★' : 'Set Featured'}
                  </button>
                  <button
                    onClick={() => deleteProduct(prod.id)}
                    className="p-2 rounded-lg bg-secondary hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold font-display text-foreground">All Orders Management</h2>
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="p-5 rounded-2xl bg-card border border-border space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-brand">{ord.tracking_code}</span>
                  <span className="font-bold">{formatFRW(ord.total)} ({ord.payment_method})</span>
                </div>
                <p className="text-muted-foreground">Customer: {ord.customer_name} ({ord.customer_phone}) • {ord.district} ({ord.sector})</p>
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <span className="font-semibold text-muted-foreground">Set Status:</span>
                  {['pending_payment', 'paid', 'confirmed', 'processing', 'ready', 'shipped', 'delivered', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => updateOrder(ord.id, { status: st as any })}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize ${
                        ord.status === st ? 'brand-gradient text-white' : 'bg-secondary text-muted-foreground hover:bg-border'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Supabase Sync Status */}
      {activeTab === 'sync' && (
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-card border border-border space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div>
                <h2 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
                  <Database className="w-5 h-5 text-brand" />
                  <span>Supabase Live Sync Status</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Connected to: <span className="font-mono text-foreground font-semibold">{SUPABASE_URL}</span>
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopySchema}
                  className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-border text-foreground text-xs font-bold flex items-center gap-1.5"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy SQL Schema</span>
                </button>
                <button
                  onClick={runSupabaseSync}
                  disabled={isSyncing}
                  className="px-5 py-2.5 rounded-xl brand-gradient text-white text-xs font-bold shadow-md flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Sync Now</span>
                </button>
              </div>
            </div>

            {/* Sync Table Breakdown */}
            <div className="grid grid-cols-1 gap-3">
              {[
                { name: 'categories', count: categories.length, desc: '20 Rwanda product categories' },
                { name: 'sellers', count: sellers.length, desc: 'Verified vendor stores' },
                { name: 'products', count: products.length, desc: 'E-commerce marketplace items' },
                { name: 'seller_applications', count: sellerApplications.length, desc: 'Merchant onboarding applications' },
                { name: 'orders', count: orders.length, desc: 'Customer transactions & delivery records' },
                { name: 'suppliers', count: suppliers.length, desc: 'Regional verified B2B supplier directory' },
                { name: 'sourcing_requests', count: sourcingRequests.length, desc: 'Shaka Igicuruzwa sourcing tickets' },
                { name: 'profiles', count: usersList.length, desc: 'Registered user profiles' },
                { name: 'audit_logs', count: auditLogs.length, desc: 'Administrative activity trail' }
              ].map((tbl) => {
                return (
                  <div
                    key={tbl.name}
                    className="p-4 rounded-2xl bg-secondary/40 border border-border flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl brand-gradient text-white flex items-center justify-center font-mono font-bold text-xs">
                        T
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground font-mono">{tbl.name}</h4>
                        <p className="text-[11px] text-muted-foreground">{tbl.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold font-mono text-foreground">{tbl.count} records</span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-emerald-500/10 text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mirrored
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Sourcing Requests (Shaka) */}
      {activeTab === 'sourcing' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-foreground">Sourcing Moderation & Quotation</h2>
            <span className="text-xs text-muted-foreground">{sourcingRequests.length} sourcing requests</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sourcingRequests.map((req) => (
              <div
                key={req.id}
                className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      {req.rfq_number && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-brand/10 text-brand">
                          {req.rfq_number}
                        </span>
                      )}
                      <span className="font-mono font-bold text-brand">{req.tracking_code}</span>
                    </div>
                    <h3 className="font-bold text-sm text-foreground mt-0.5">{req.product_name}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full font-bold bg-brand/10 text-brand self-start sm:self-auto capitalize">
                    {req.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-secondary/50">
                    <span className="text-muted-foreground block text-[10px]">Customer</span>
                    <span className="font-bold">{req.customer_name} ({req.customer_phone})</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-secondary/50">
                    <span className="text-muted-foreground block text-[10px]">Target Budget</span>
                    <span className="font-bold">{req.budget ? formatFRW(req.budget) : 'Open'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-secondary/50">
                    <span className="text-muted-foreground block text-[10px]">Assigned Supplier Quote</span>
                    <span className="font-bold text-emerald-600">{req.quote_amount ? formatFRW(req.quote_amount) : 'Not Quoted Yet'}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2 gap-2">
                  <button
                    onClick={() => handleOpenQuoteModal(req)}
                    className="px-4 py-2 rounded-xl brand-gradient text-white text-xs font-bold shadow-sm"
                  >
                    Assign Supplier & Quote
                  </button>
                  <button
                    onClick={() => setConfirmDeleteRfq(req)}
                    className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Suppliers */}
      {activeTab === 'suppliers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-foreground">Verified Regional Suppliers</h2>
            <button
              onClick={openAddSupplier}
              className="px-4 py-2 rounded-xl brand-gradient text-white text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Verified Supplier</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suppliers.map((sup) => (
              <div key={sup.id} className="p-5 rounded-2xl bg-card border border-border space-y-3 text-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={sup.logo} alt="" className="w-10 h-10 rounded-xl object-cover bg-secondary" />
                    <div>
                      <h4 className="font-bold text-foreground">{sup.name}</h4>
                      <p className="text-muted-foreground">{sup.city}, {sup.country}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSupplier(sup.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-muted-foreground line-clamp-2">{sup.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Users & Admins */}
      {activeTab === 'users' && (
        <div className="space-y-8">
          {/* Invite Admin Form */}
          <form
            onSubmit={handleInviteAdmin}
            className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-4 text-foreground"
          >
            <h3 className="text-base font-bold font-display flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-brand" />
              <span>Invite New Platform Administrator</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="e.g. Alain Mugisha"
                  className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold">Email Address</label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@zendo.rw"
                  className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl brand-gradient text-white font-bold text-xs shadow-md"
                >
                  Grant Admin Privileges
                </button>
              </div>
            </div>
          </form>

          {/* Registered Users List */}
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
            <h3 className="text-sm font-bold font-display text-foreground">
              Registered Platform Users & Roles ({usersList.length})
            </h3>
            <div className="space-y-2">
              {usersList.map((u) => (
                <div key={u.id} className="p-3 rounded-xl bg-secondary/40 border border-border flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-foreground">{u.full_name}</p>
                    <p className="text-muted-foreground text-[11px]">{u.email}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      u.role === 'admin' || u.role === 'super_admin'
                        ? 'bg-brand/10 text-brand'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Commission Rate */}
      {activeTab === 'commission' && (
        <div className="p-8 rounded-3xl bg-card border border-border space-y-6 max-w-xl text-foreground">
          <h2 className="text-xl font-bold font-display">Configure Platform Take Rate</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Standard platform commission deducted automatically from seller gross revenues upon completed order deliveries in Rwanda.
          </p>
          <div className="space-y-2">
            <label className="text-xs font-bold">Commission Percentage (%)</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="50"
                value={rateInput}
                onChange={(e) => setRateInput(Number(e.target.value))}
                className="w-32 p-3 rounded-xl bg-secondary border border-border text-foreground font-bold text-base"
              />
              <button
                onClick={() => updateCommissionRate(rateInput)}
                className="px-5 py-3 rounded-xl brand-gradient text-white text-xs font-bold shadow-md"
              >
                Save Take Rate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Audit Log */}
      {activeTab === 'audit' && (
        <div className="p-8 rounded-3xl bg-card border border-border space-y-4">
          <h2 className="text-lg font-bold font-display text-foreground">Platform Activity & Audit Trail</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-secondary/40 border border-border flex items-center justify-between text-xs gap-4">
                <div>
                  <p className="font-bold text-foreground">{log.action}</p>
                  <span className="text-[11px] text-muted-foreground">Target: {log.target} • User: {log.user_name}</span>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quote / Sourcing Update Modal */}
      {quoteModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleSaveQuote}
            className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-foreground"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base font-display">Assign Sourcing Quote</h3>
              <button
                type="button"
                onClick={() => setQuoteModalReq(null)}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold">Select Verified Supplier</label>
                <select
                  value={quoteSupplierId}
                  onChange={(e) => setQuoteSupplierId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.country})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold">Official Quote Amount (in FRW)</label>
                <input
                  type="number"
                  required
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold">Milestone Status</label>
                <select
                  value={quoteStatus}
                  onChange={(e) => setQuoteStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground font-semibold"
                >
                  <option value="searching">Searching Suppliers</option>
                  <option value="quoted">Quoted to Customer</option>
                  <option value="approved">Customer Approved</option>
                  <option value="paid">Payment Received</option>
                  <option value="quality_check">Quality Check Passed</option>
                  <option value="in_transit">In Transit to Kigali Hub</option>
                  <option value="delivered">Delivered to Customer</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold">Quotation Notes / Terms</label>
                <textarea
                  rows={3}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setQuoteModalReq(null)}
                className="px-4 py-2 rounded-xl bg-secondary text-foreground text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl brand-gradient text-white text-xs font-bold shadow-md"
              >
                Save & Update Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Supplier Modal */}
      {supplierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleSaveSupplier}
            className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 text-foreground"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-base font-display">Add Verified Supplier</h3>
              <button
                type="button"
                onClick={() => setSupplierModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2 space-y-1">
                <label className="font-bold">Supplier Name</label>
                <input
                  type="text"
                  required
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  className="w-full p-2 rounded-xl bg-secondary border border-border text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold">Country</label>
                <select
                  value={supCountry}
                  onChange={(e) => setSupCountry(e.target.value)}
                  className="w-full p-2 rounded-xl bg-secondary border border-border text-foreground"
                >
                  <option value="Rwanda">Rwanda</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Tanzania">Tanzania</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold">City / Location</label>
                <input
                  type="text"
                  value={supCity}
                  onChange={(e) => setSupCity(e.target.value)}
                  className="w-full p-2 rounded-xl bg-secondary border border-border text-foreground"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="font-bold">Category Line</label>
                <input
                  type="text"
                  value={supCategory}
                  onChange={(e) => setSupCategory(e.target.value)}
                  className="w-full p-2 rounded-xl bg-secondary border border-border text-foreground"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="font-bold">Supplied Products (comma separated)</label>
                <input
                  type="text"
                  value={supProducts}
                  onChange={(e) => setSupProducts(e.target.value)}
                  className="w-full p-2 rounded-xl bg-secondary border border-border text-foreground"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setSupplierModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-secondary text-foreground text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl brand-gradient text-white text-xs font-bold shadow-md"
              >
                Save Supplier
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete RFQ Confirmation */}
      {confirmDeleteRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 bg-card border border-border rounded-3xl shadow-2xl space-y-4 text-foreground text-xs">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base font-display text-foreground">
                Delete RFQ {confirmDeleteRfq.rfq_number || confirmDeleteRfq.tracking_code}?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                This will permanently remove this sourcing request and all milestone history. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 justify-end pt-3">
              <button
                onClick={() => setConfirmDeleteRfq(null)}
                className="px-4 py-2 rounded-xl bg-secondary font-bold cursor-pointer hover:bg-border transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteSourcingRequest(confirmDeleteRfq.id);
                  setConfirmDeleteRfq(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Yes, Delete RFQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
