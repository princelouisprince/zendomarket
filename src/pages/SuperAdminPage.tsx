import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SellerApplication, Seller } from '../types';
import {
  ShieldAlert,
  Users,
  Store,
  Plus,
  Trash2,
  Check,
  X,
  CheckCircle2,
  TrendingUp,
  Lock,
  Tag,
  User,
  Building,
  Globe,
  Phone,
  Mail,
  MapPin,
  Eye,
  FileText,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
  Camera,
  Upload,
  Truck,
  Bell
} from 'lucide-react';
import { CategoryIcon } from '../components/CategoryIcon';
import { uploadToStorage } from '../lib/supabaseStorage';
import { formatFRWDirect } from '../lib/constants';

interface SuperAdminPageProps {
  onNavigate: (route: string) => void;
}

export const SuperAdminPage: React.FC<SuperAdminPageProps> = ({ onNavigate }) => {
  const {
    currentUser,
    isLoggedIn,
    isAdmin,
    products,
    sellers,
    sellerApplications,
    orders,
    categories,
    suppliers,
    sourcingRequests,
    updateSourcingRequest,
    deleteSourcingRequest,
    updateOrderStatus,
    deleteOrder,
    reviewSellerApplication,
    deleteSeller,
    createCategory,
    createSupplier,
    deleteSupplier,
    formatPrice,
    showToast,
    notifications,
    unreadNotificationCount,
    markNotificationRead
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'applications' | 'sellers' | 'categories' | 'suppliers' | 'sourcing'
  >('overview');

  // Sourcing RFQ Update Modal State
  const [rfqModalItem, setRfqModalItem] = useState<any | null>(null);
  const [rfqStatus, setRfqStatus] = useState<string>('searching');
  const [rfqSupplier, setRfqSupplier] = useState<string>('');
  const [rfqQuote, setRfqQuote] = useState<string>('');
  const [rfqNotes, setRfqNotes] = useState<string>('');
  const [rfqTrackingNote, setRfqTrackingNote] = useState<string>('');
  const [isSavingRfq, setIsSavingRfq] = useState<boolean>(false);

  // Application sub-filter
  const [appFilter, setAppFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  // View Seller / Application Modal State
  const [viewAppModalItem, setViewAppModalItem] = useState<SellerApplication | null>(null);
  const [viewSellerModalItem, setViewSellerModalItem] = useState<Seller | null>(null);
  const [confirmDeleteSeller, setConfirmDeleteSeller] = useState<Seller | null>(null);
  const [confirmDeleteRfq, setConfirmDeleteRfq] = useState<any | null>(null);

  // Category modal state with Parent/Child (Major Category & Subcategories)
  const [newCatName, setNewCatName] = useState('');
  const [newCatSubcategories, setNewCatSubcategories] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Suppliers Form State
  const [newSupName, setNewSupName] = useState('');
  const [newSupCategory, setNewSupCategory] = useState('Electronics & Hardware');
  const [newSupCountry, setNewSupCountry] = useState('China');
  const [newSupCity, setNewSupCity] = useState('Shenzhen');
  const [newSupPhone, setNewSupPhone] = useState('+250 793 032 430');
  const [newSupEmail, setNewSupEmail] = useState('supplier@zendo.rw');
  const [newSupDesc, setNewSupDesc] = useState('');
  const [newSupLogo, setNewSupLogo] = useState('');
  const [isUploadingSupLogo, setIsUploadingSupLogo] = useState(false);
  const [isSubmittingSupplier, setIsSubmittingSupplier] = useState(false);

  const handleSupLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingSupLogo(true);
    try {
      const res = await uploadToStorage('seller-logos', file);
      if (res.url) {
        setNewSupLogo(res.url);
        showToast('Logo Uploaded', 'Supplier photo saved to Supabase Storage.', 'success');
      } else {
        showToast('Upload Failed', res.error || 'Failed to upload photo.', 'error');
      }
    } finally {
      setIsUploadingSupLogo(false);
    }
  };

  // Rejection modal
  const [rejectModalItem, setRejectModalItem] = useState<{ id: string; title: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold font-display text-foreground">Restricted Access</h2>
        <p className="text-xs text-muted-foreground">
          Super Admin and Admin privileges are required to view this command center.
        </p>
        <button
          onClick={() => onNavigate('/login')}
          className="px-6 py-2.5 rounded-xl brand-gradient text-white text-xs font-bold shadow-md cursor-pointer"
        >
          Sign In as Admin
        </button>
      </div>
    );
  }

  const pendingApplications = sellerApplications.filter((a) => a.status === 'pending');
  const approvedApplications = sellerApplications.filter((a) => a.status === 'approved');
  const rejectedApplications = sellerApplications.filter((a) => a.status === 'rejected');

  const displayedApplications =
    appFilter === 'pending'
      ? pendingApplications
      : appFilter === 'approved'
      ? approvedApplications
      : appFilter === 'rejected'
      ? rejectedApplications
      : sellerApplications;

  const totalGMV = orders.reduce((acc, o) => acc + o.total, 0);

  const handleOpenRfqModal = (rfq: any) => {
    setRfqModalItem(rfq);
    setRfqStatus(rfq.status || 'searching');
    setRfqSupplier(rfq.supplier_name || '');
    setRfqQuote(rfq.quote_amount ? String(rfq.quote_amount) : '');
    setRfqNotes(rfq.quote_notes || '');
    setRfqTrackingNote('');
  };

  const handleSaveRfqMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfqModalItem) return;
    setIsSavingRfq(true);
    try {
      await updateSourcingRequest(rfqModalItem.id, {
        status: rfqStatus,
        supplier_name: rfqSupplier.trim() || undefined,
        quote_amount: rfqQuote ? Number(rfqQuote) : undefined,
        quote_notes: rfqNotes.trim() || undefined,
        new_tracking_note: rfqTrackingNote.trim() || undefined
      });
      setRfqModalItem(null);
    } finally {
      setIsSavingRfq(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const subcats = newCatSubcategories
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    await createCategory(newCatName.trim(), newCatDesc.trim(), subcats);
    setNewCatName('');
    setNewCatSubcategories('');
    setNewCatDesc('');
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName.trim()) return;
    setIsSubmittingSupplier(true);
    try {
      await createSupplier({
        name: newSupName.trim(),
        category: newSupCategory,
        country: newSupCountry,
        city: newSupCity,
        phone: newSupPhone,
        email: newSupEmail,
        description: newSupDesc.trim() || 'Verified international manufacturing & supply partner.',
        logo: newSupLogo.trim() || 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=300&q=80',
        verified: true
      });
      setNewSupName('');
      setNewSupDesc('');
      setNewSupLogo('');
    } finally {
      setIsSubmittingSupplier(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModalItem || !rejectReason.trim()) return;
    await reviewSellerApplication(rejectModalItem.id, 'rejected', rejectReason.trim());
    setRejectModalItem(null);
    setRejectReason('');
    setViewAppModalItem(null);
  };

  const handleDeleteSellerConfirm = async () => {
    if (!confirmDeleteSeller) return;
    await deleteSeller(confirmDeleteSeller.id);
    setConfirmDeleteSeller(null);
    setViewSellerModalItem(null);
  };

  const handleDeleteRfqConfirm = async () => {
    if (!confirmDeleteRfq) return;
    await deleteSourcingRequest(confirmDeleteRfq.id);
    setConfirmDeleteRfq(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl brand-gradient text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span>Super Admin Headquarters • Governance & Seller Moderation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            Global Marketplace Command Center
          </h1>
          <p className="text-xs text-white/80">
            Moderate seller onboarding, inspect merchant profiles, review product listings, and govern parent/child categories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('/account')}
            className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs backdrop-blur-md transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
          {unreadNotificationCount > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-center">
              <span className="text-2xl font-black font-display text-amber-300">{unreadNotificationCount}</span>
              <p className="text-[10px] text-amber-200 uppercase tracking-wider font-semibold">New Notifications</p>
            </div>
          )}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
            <span className="text-2xl font-black font-display">{pendingApplications.length}</span>
            <p className="text-[10px] text-white/80 uppercase tracking-wider font-semibold">Pending Sellers</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border text-xs">
        {[
          { id: 'overview', label: 'Platform Overview', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'applications', label: `Seller Applications & History (${pendingApplications.length})`, icon: <Store className="w-4 h-4" /> },
          { id: 'sellers', label: `Active Sellers (${sellers.length})`, icon: <Users className="w-4 h-4" /> },
          { id: 'sourcing', label: `Global RFQs (${sourcingRequests.length})`, icon: <Globe className="w-4 h-4" /> },
          { id: 'categories', label: `Categories & Subcategories (${categories.length})`, icon: <Tag className="w-4 h-4" /> },
          { id: 'suppliers', label: `Verified Suppliers (${suppliers.length})`, icon: <Building className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-card border border-border space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">Total Gross Marketplace Volume (GMV)</span>
              <p className="text-2xl font-black font-display text-foreground">{formatPrice(totalGMV)}</p>
              <span className="text-[11px] text-emerald-600 font-semibold">{orders.length} total orders recorded</span>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">Total Customer Orders</span>
              <p className="text-2xl font-black font-display text-brand">{orders.length} Orders</p>
              <span className="text-[11px] text-muted-foreground">Processed across all active channels</span>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">Active Verified Merchants</span>
              <p className="text-2xl font-black font-display text-foreground">{sellers.length}</p>
              <span className="text-[11px] text-amber-500 font-semibold">{pendingApplications.length} pending applications</span>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">Catalog Inventory</span>
              <p className="text-2xl font-black font-display text-foreground">{products.length} Items</p>
              <span className="text-[11px] text-purple-500 font-semibold">{categories.length} active categories</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border text-xs text-foreground space-y-3">
            <h3 className="font-bold text-sm font-display flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-brand" />
              <span>Super Admin Governance Rules</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              • <strong>Independent Stores:</strong> Sellers manage their own products, stock, and orders within their isolated merchant dashboards. Super Admins govern platform standards, approvals, dispute moderation, and seller removals.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              • <strong>Role Separation:</strong> Super Admin accounts are strictly for administrative control and cannot request to become sellers.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              • <strong>Audit & Inspection:</strong> Click the <strong>View</strong> button on any application or merchant profile to inspect complete business documentation and products before approving, rejecting, or deleting.
            </p>
          </div>

          {notifications.length > 0 && (
            <div className="p-6 rounded-3xl bg-card border border-border text-xs text-foreground space-y-3">
              <h3 className="font-bold text-sm font-display flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand" />
                <span>Recent Notifications</span>
              </h3>
              <div className="space-y-2">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-xl border ${
                      notification.is_read ? 'bg-secondary/30 border-border' : 'bg-brand/5 border-brand/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-bold text-foreground text-[11px]">{notification.title}</p>
                        <p className="text-muted-foreground text-[10px] mt-1">{notification.message}</p>
                        <p className="text-[9px] text-muted-foreground mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <button
                          onClick={() => markNotificationRead(notification.id)}
                          className="px-2 py-1 rounded-lg bg-brand/10 text-brand text-[10px] font-bold hover:bg-brand/20 transition-colors"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: Seller Applications & History */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          {/* Sub-Filters / History Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-secondary/50 p-1.5 rounded-2xl border border-border">
            <button
              onClick={() => setAppFilter('pending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                appFilter === 'pending' ? 'brand-gradient text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Pending Review ({pendingApplications.length})
            </button>
            <button
              onClick={() => setAppFilter('approved')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                appFilter === 'approved' ? 'brand-gradient text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Approved History ({approvedApplications.length})
            </button>
            <button
              onClick={() => setAppFilter('rejected')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                appFilter === 'rejected' ? 'brand-gradient text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Rejected History ({rejectedApplications.length})
            </button>
            <button
              onClick={() => setAppFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                appFilter === 'all' ? 'brand-gradient text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Applications ({sellerApplications.length})
            </button>
          </div>

          {displayedApplications.length === 0 ? (
            <div className="p-12 rounded-3xl bg-card border border-border text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-sm text-foreground">No Applications Found</p>
              <p className="text-xs text-muted-foreground">
                There are no applications matching the "{appFilter}" filter.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedApplications.map((app) => (
                <div key={app.id} className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm text-foreground">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                    <div>
                      <h3 className="font-bold text-lg font-display text-foreground">{app.business_name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Applicant: <strong className="text-foreground">{app.full_name}</strong> • {app.phone} • {app.email}
                      </p>
                    </div>
                    <div>
                      {app.status === 'pending' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600">
                          ⏳ Pending Review
                        </span>
                      )}
                      {app.status === 'approved' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600">
                          ✅ Approved / Active Seller
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600">
                          ❌ Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-secondary/50">
                      <span className="text-muted-foreground block text-[10px]">Location</span>
                      <span className="font-semibold text-foreground">{app.business_location}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/50">
                      <span className="text-muted-foreground block text-[10px]">Categories</span>
                      <span className="font-semibold text-foreground">{app.categories?.join(', ') || 'Various'}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/50">
                      <span className="text-muted-foreground block text-[10px]">Applied Date</span>
                      <span className="font-semibold text-foreground">
                        {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    <strong>Description:</strong> {app.description || app.business_description || 'No store description provided.'}
                  </p>

                  {app.rejection_reason && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600">
                      <strong>Rejection Note:</strong> {app.rejection_reason}
                    </div>
                  )}

                  <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                    {/* View Details button */}
                    <button
                      onClick={() => setViewAppModalItem(app)}
                      className="px-4 py-2 rounded-xl bg-secondary hover:bg-border text-foreground text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-brand" />
                      <span>View Full Application Details</span>
                    </button>

                    {/* Pending Action Buttons */}
                    {app.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setRejectModalItem({ id: app.id, title: app.business_name })}
                          className="px-4 py-2 rounded-xl bg-secondary hover:bg-rose-500/10 hover:text-rose-500 text-foreground text-xs font-bold transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => reviewSellerApplication(app.id, 'approved')}
                          className="px-5 py-2 rounded-xl brand-gradient text-white text-xs font-bold shadow-md hover:opacity-95 cursor-pointer"
                        >
                          Approve & Create Seller
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: Active Sellers List */}
      {activeTab === 'sellers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base font-display text-foreground">
                Active Registered Merchants ({sellers.length})
              </h3>
              <p className="text-xs text-muted-foreground">Each merchant operates an isolated independent storefront</p>
            </div>
            <span className="text-[11px] text-muted-foreground">Admins can inspect or remove approved sellers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sellers.map((seller) => {
              const sellerProds = products.filter(
                (p) => p.seller_id === seller.id || p.seller_user_id === seller.user_id
              );
              return (
                <div key={seller.id} className="p-5 rounded-3xl bg-card border border-border space-y-4 shadow-sm text-foreground flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={seller.logo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt={seller.store_name}
                        className="w-12 h-12 rounded-2xl object-cover border border-border bg-secondary shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-foreground truncate">{seller.store_name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{seller.business_name}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                          ✓ Verified Seller
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand shrink-0" />
                        <span className="truncate">{seller.address || seller.district || 'Kigali, Rwanda'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-brand shrink-0" />
                        <span>{seller.phone || 'Phone on file'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-brand shrink-0" />
                        <span className="truncate">{seller.email || 'Email on file'}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-secondary/50 flex items-center justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">Listed Products</span>
                      <span className="font-bold text-brand">{sellerProds.length} Items</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border">
                    <button
                      onClick={() => setViewSellerModalItem(seller)}
                      className="w-full py-2.5 rounded-xl bg-secondary hover:bg-border text-foreground text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-brand" />
                      <span>View Store & Products</span>
                    </button>

                    <button
                      onClick={() => setConfirmDeleteSeller(seller)}
                      className="w-full py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Seller & Clear Products</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: Global RFQs / Sourcing Requests */}
      {activeTab === 'sourcing' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-brand/10 border border-brand/20 text-xs text-foreground flex items-center gap-3">
            <Globe className="w-5 h-5 text-brand shrink-0" />
            <p>
              <strong>Live Global RFQ Management</strong> — Update the status, assign factories, add quotes, and post tracking milestones for each customer sourcing request. All updates are saved to Supabase and reflected live on the client's tracking page.
            </p>
          </div>

          {sourcingRequests.length === 0 ? (
            <div className="p-12 rounded-3xl bg-card border border-border text-center space-y-2">
              <Globe className="w-10 h-10 text-brand/40 mx-auto" />
              <p className="font-bold text-sm text-foreground">No Sourcing Requests Yet</p>
              <p className="text-xs text-muted-foreground">Requests submitted via the Global Sourcing page will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sourcingRequests.map((rfq) => {
                const statusColors: Record<string, string> = {
                  requested: 'bg-blue-500/10 text-blue-600',
                  searching: 'bg-amber-500/10 text-amber-600',
                  quoted: 'bg-purple-500/10 text-purple-600',
                  approved: 'bg-indigo-500/10 text-indigo-600',
                  paid: 'bg-emerald-500/10 text-emerald-600',
                  quality_check: 'bg-teal-500/10 text-teal-600',
                  in_transit: 'bg-cyan-500/10 text-cyan-600',
                  delivered: 'bg-green-500/10 text-green-600',
                  cancelled: 'bg-rose-500/10 text-rose-600'
                };
                const statusLabels: Record<string, string> = {
                  requested: '🔵 RFQ Submitted',
                  searching: '🔍 Factory Sourcing',
                  quoted: '📋 Quote Ready',
                  approved: '✅ Contract Approved',
                  paid: '💳 Payment Confirmed',
                  quality_check: '🔬 Quality Inspection',
                  in_transit: '✈️ In Transit',
                  delivered: '📦 Delivered',
                  cancelled: '❌ Cancelled'
                };
                const tracking = Array.isArray(rfq.tracking) ? rfq.tracking : [];

                return (
                  <div key={rfq.id} className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm text-foreground">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {rfq.rfq_number && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-brand/10 text-brand">
                              {rfq.rfq_number}
                            </span>
                          )}
                          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-secondary text-brand">
                            {rfq.tracking_code || `SHK-${rfq.id?.slice(0, 6).toUpperCase()}`}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${statusColors[rfq.status] || 'bg-secondary text-muted-foreground'}`}>
                            {statusLabels[rfq.status] || rfq.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-base font-display">{rfq.product_name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {rfq.quantity} {rfq.unit} • {rfq.country} • Budget: {rfq.budget ? formatPrice(rfq.budget) : 'Flexible'}
                        </p>
                        {rfq.supplier_name && (
                          <p className="text-xs text-brand font-semibold mt-0.5">🏭 Assigned Factory: {rfq.supplier_name}</p>
                        )}
                        {rfq.quote_amount ? (
                          <p className="text-xs text-emerald-600 font-semibold">💰 Quote: {formatFRWDirect(rfq.quote_amount)}{rfq.quote_notes ? ` — ${rfq.quote_notes}` : ''}</p>
                        ) : null}
                      </div>
                      <button
                        onClick={() => handleOpenRfqModal(rfq)}
                        className="px-5 py-2.5 rounded-xl brand-gradient text-white text-xs font-bold shadow-md hover:opacity-95 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Update Milestone
                      </button>
                      <button
                        onClick={() => setConfirmDeleteRfq(rfq)}
                        className="px-3 py-2.5 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">{rfq.description}</p>

                    {/* Timeline */}
                    {tracking.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Tracking Timeline</p>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {[...tracking].reverse().map((t: any, i: number) => (
                            <div key={i} className="flex items-start gap-2.5 text-xs">
                              <div className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 mt-1.5" />
                              <div>
                                <span className="text-muted-foreground font-mono text-[10px]">
                                  {new Date(t.timestamp).toLocaleString()}
                                </span>
                                <p className="text-foreground font-medium">{t.note}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: Categories & Subcategories Management */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Category & Subcategories Form */}
          <form onSubmit={handleCreateCategory} className="lg:col-span-4 p-6 rounded-3xl bg-card border border-border space-y-4 text-xs text-foreground shadow-sm">
            <div className="border-b border-border pb-3">
              <h3 className="font-bold text-sm font-display">Add Parent Category & Subcategories</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Define the major parent category and its child subcategory hierarchy
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold">Major Category Name *</label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Industrial & Hardware"
                className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold">Subcategories (Comma separated) *</label>
              <textarea
                rows={3}
                required
                value={newCatSubcategories}
                onChange={(e) => setNewCatSubcategories(e.target.value)}
                placeholder="e.g. Building Materials, Plumbing Supplies, Electrical Supplies, Tools & Safety Gear"
                className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground"
              />
              <span className="text-[10px] text-muted-foreground">Separate each subcategory with a comma</span>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold">Description (Optional)</label>
              <textarea
                rows={2}
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Short overview of items in this category..."
                className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl brand-gradient text-white font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Category & Subcategories</span>
            </button>
          </form>

          {/* Categories & Subcategories List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-4 rounded-2xl bg-card border border-border text-xs font-bold flex items-center justify-between">
              <span>Active Marketplace Categories ({categories.length})</span>
              <span className="text-muted-foreground font-normal">Parent & Child Hierarchy</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => {
                const count = products.filter(
                  (p) =>
                    p.category_id === cat.id ||
                    p.category_name.toLowerCase() === cat.name.toLowerCase() ||
                    p.category_id?.toLowerCase() === cat.slug?.toLowerCase()
                ).length;

                return (
                  <div key={cat.id} className="p-4 rounded-2xl bg-card border border-border space-y-2.5 text-xs shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
                            <CategoryIcon name={cat.icon} className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground">{cat.name}</h4>
                            <p className="text-[10px] text-muted-foreground font-mono">{cat.slug}</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                          {count} Products
                        </span>
                      </div>

                      {/* Subcategories preview */}
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-border space-y-1">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Subcategories:</span>
                          <div className="flex flex-wrap gap-1">
                            {cat.subcategories.map((sub, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-secondary text-foreground text-[10px]">
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB: Verified Suppliers Management */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Supplier Form */}
          <form
            onSubmit={handleCreateSupplier}
            className="lg:col-span-4 p-6 rounded-3xl bg-card border border-border space-y-4 text-xs text-foreground shadow-sm"
          >
            <div className="border-b border-border pb-3">
              <h3 className="font-bold text-sm font-display">Add Verified Supplier / Factory</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Register verified B2B manufacturing hubs into the public directory
              </p>
            </div>

            <div className="space-y-1">
              <label className="font-bold">Company / Supplier Name *</label>
              <input
                type="text"
                required
                value={newSupName}
                onChange={(e) => setNewSupName(e.target.value)}
                placeholder="e.g. Shenzhen Apex Microelectronics OEM"
                className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold">Product Category *</label>
              <input
                type="text"
                required
                value={newSupCategory}
                onChange={(e) => setNewSupCategory(e.target.value)}
                placeholder="e.g. Electronics, Precision Machinery, Textiles"
                className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-bold">Country *</label>
                <input
                  type="text"
                  required
                  value={newSupCountry}
                  onChange={(e) => setNewSupCountry(e.target.value)}
                  placeholder="e.g. China / Germany / Rwanda"
                  className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold">City / Industrial Hub *</label>
                <input
                  type="text"
                  required
                  value={newSupCity}
                  onChange={(e) => setNewSupCity(e.target.value)}
                  placeholder="e.g. Shenzhen / Frankfurt / Kigali"
                  className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-bold">Contact Phone</label>
                <input
                  type="text"
                  value={newSupPhone}
                  onChange={(e) => setNewSupPhone(e.target.value)}
                  placeholder="+250 793 032 430"
                  className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold">Email</label>
                <input
                  type="email"
                  value={newSupEmail}
                  onChange={(e) => setNewSupEmail(e.target.value)}
                  placeholder="supplier@zendo.rw"
                  className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold">Supplier Logo / Factory Image</label>
              <div className="flex items-center gap-3">
                {newSupLogo && (
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-border shrink-0 bg-secondary">
                    <img src={newSupLogo} alt="Supplier Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <label className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-secondary border border-border border-dashed hover:border-brand cursor-pointer transition-colors text-xs font-semibold">
                  <Upload className="w-4 h-4 text-brand" />
                  <span className="truncate">
                    {isUploadingSupLogo ? 'Uploading to Supabase...' : newSupLogo ? 'Change Image from Laptop' : 'Upload Image from Laptop'}
                  </span>
                  <input type="file" accept="image/*" onChange={handleSupLogoUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold">Manufacturing Capabilities & Description</label>
              <textarea
                rows={3}
                value={newSupDesc}
                onChange={(e) => setNewSupDesc(e.target.value)}
                placeholder="Certified ISO9001 facility, 20,000 sqm warehouse, automated SMT lines..."
                className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingSupplier}
              className="w-full py-3 rounded-2xl brand-gradient text-white font-bold hover:opacity-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmittingSupplier ? 'Registering Supplier...' : 'Add Verified Supplier'}</span>
            </button>
          </form>

          {/* Supplier Directory List */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-card border border-border space-y-4 text-xs text-foreground shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm font-display">
                Registered Verified Suppliers ({suppliers.length})
              </h3>
              <span className="text-[11px] text-emerald-600 font-semibold">Visible to clients on /suppliers</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suppliers.map((sup) => (
                <div key={sup.id} className="p-4 rounded-2xl bg-secondary/50 border border-border flex flex-col justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={sup.logo || 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=300&q=80'}
                      alt={sup.name}
                      className="w-12 h-12 rounded-xl object-cover border border-border bg-card shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-foreground truncate">{sup.name}</h4>
                      <p className="text-[11px] text-brand font-semibold">{sup.category}</p>
                      <p className="text-[10px] text-muted-foreground">{sup.city}, {sup.country}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{sup.description}</p>
                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                      ✓ Verified Supplier
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteSupplier(sup.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Supplier"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* VIEW APPLICATION FULL DETAILS MODAL                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {viewAppModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-card border border-border rounded-3xl shadow-2xl space-y-6 text-foreground text-xs">
            <button
              onClick={() => setViewAppModalItem(null)}
              className="absolute top-5 right-5 p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-bold text-brand uppercase tracking-wider">
                  Seller Application Inspection
                </span>
                <h3 className="text-xl font-bold font-display text-foreground mt-0.5">
                  {viewAppModalItem.business_name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Applicant: <strong>{viewAppModalItem.full_name}</strong>
                </p>
              </div>

              <div>
                {viewAppModalItem.status === 'pending' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600">
                    ⏳ Pending Review
                  </span>
                )}
                {viewAppModalItem.status === 'approved' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600">
                    ✅ Approved Seller
                  </span>
                )}
                {viewAppModalItem.status === 'rejected' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600">
                    ❌ Rejected
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-secondary/50 space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Contact Info</span>
                <p className="font-semibold text-foreground">{viewAppModalItem.phone}</p>
                <p className="text-muted-foreground">{viewAppModalItem.email}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-secondary/50 space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Location & Address</span>
                <p className="font-semibold text-foreground">{viewAppModalItem.business_location || 'Kigali, Rwanda'}</p>
                <p className="text-muted-foreground">{viewAppModalItem.business_address || 'Address on file'}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-secondary/50 space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Product Categories</span>
              <div className="flex flex-wrap gap-1.5">
                {viewAppModalItem.categories?.map((cat, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-brand/10 text-brand text-[11px] font-semibold">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-secondary/50 space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Business Description</span>
              <p className="text-muted-foreground leading-relaxed">
                {viewAppModalItem.description || viewAppModalItem.business_description || 'No detailed description provided.'}
              </p>
            </div>

            {viewAppModalItem.rejection_reason && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 space-y-1">
                <span className="text-[10px] font-bold uppercase">Rejection Reason</span>
                <p className="text-xs">{viewAppModalItem.rejection_reason}</p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                onClick={() => setViewAppModalItem(null)}
                className="px-4 py-2.5 rounded-xl bg-secondary text-foreground font-bold hover:bg-border transition-colors cursor-pointer"
              >
                Close
              </button>

              {viewAppModalItem.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      setRejectModalItem({ id: viewAppModalItem.id, title: viewAppModalItem.business_name });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-rose-500/10 hover:text-rose-500 text-foreground font-bold transition-colors cursor-pointer"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={async () => {
                      await reviewSellerApplication(viewAppModalItem.id, 'approved');
                      setViewAppModalItem(null);
                    }}
                    className="px-5 py-2.5 rounded-xl brand-gradient text-white font-bold shadow-md hover:opacity-95 cursor-pointer"
                  >
                    Approve Seller
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* VIEW SELLER STORE & PRODUCTS MODAL                           */}
      {/* ───────────────────────────────────────────────────────────── */}
      {viewSellerModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-card border border-border rounded-3xl shadow-2xl space-y-6 text-foreground text-xs">
            <button
              onClick={() => setViewSellerModalItem(null)}
              className="absolute top-5 right-5 p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 border-b border-border pb-4">
              <img
                src={viewSellerModalItem.logo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={viewSellerModalItem.store_name}
                className="w-16 h-16 rounded-2xl object-cover border border-border bg-secondary shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                  ✓ Verified Storefront
                </span>
                <h3 className="text-xl font-bold font-display text-foreground mt-1">
                  {viewSellerModalItem.store_name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Business: <strong>{viewSellerModalItem.business_name}</strong> • {viewSellerModalItem.phone} • {viewSellerModalItem.email}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-secondary/50 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Store Address & District</span>
              <p className="font-semibold text-foreground">{viewSellerModalItem.address || `${viewSellerModalItem.district}, ${viewSellerModalItem.sector}` || 'Kigali, Rwanda'}</p>
              <p className="text-muted-foreground">{viewSellerModalItem.description}</p>
            </div>

            {/* Products listed by this seller */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm font-display text-foreground">
                  Products in this Seller's Store (
                  {products.filter((p) => p.seller_id === viewSellerModalItem.id || p.seller_user_id === viewSellerModalItem.user_id).length}
                  )
                </h4>
                <span className="text-[11px] text-muted-foreground font-mono">Read-Only Oversight</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                {products
                  .filter((p) => p.seller_id === viewSellerModalItem.id || p.seller_user_id === viewSellerModalItem.user_id)
                  .map((prod) => (
                    <div key={prod.id} className="p-3 rounded-2xl bg-secondary/40 border border-border flex items-center gap-3">
                      <img src={prod.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover bg-secondary shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-xs text-foreground truncate">{prod.name}</p>
                        <p className="text-[11px] font-bold text-brand">{formatPrice(prod.price)}</p>
                        <span className="text-[10px] text-muted-foreground">Stock: {prod.quantity} units</span>
                      </div>
                    </div>
                  ))}
                {products.filter((p) => p.seller_id === viewSellerModalItem.id || p.seller_user_id === viewSellerModalItem.user_id).length === 0 && (
                  <p className="text-muted-foreground italic col-span-2 text-center py-4">
                    This seller has not listed any products yet.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                onClick={() => {
                  setConfirmDeleteSeller(viewSellerModalItem);
                  setViewSellerModalItem(null);
                }}
                className="px-4 py-2.5 rounded-xl text-rose-500 hover:bg-rose-500/10 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Seller & Clear Products</span>
              </button>

              <button
                onClick={() => setViewSellerModalItem(null)}
                className="px-6 py-2.5 rounded-xl brand-gradient text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* CONFIRM DELETE SELLER MODAL                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {confirmDeleteSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 bg-card border border-border rounded-3xl shadow-2xl space-y-4 text-foreground text-xs">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base font-display text-foreground">
                Delete Merchant "{confirmDeleteSeller.store_name}"?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                This action will remove the seller and <strong>permanently delete all products</strong> associated with this merchant from the platform.
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-3">
              <button
                onClick={() => setConfirmDeleteSeller(null)}
                className="px-4 py-2 rounded-xl bg-secondary font-bold cursor-pointer hover:bg-border transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSellerConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Yes, Delete Seller & Products
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
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
                This will permanently remove this sourcing request and all its milestone history. This action cannot be undone.
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
                onClick={handleDeleteRfqConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Yes, Delete RFQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* RFQ MILESTONE UPDATE MODAL                                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {rfqModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleSaveRfqMilestone}
            className="w-full max-w-lg p-6 bg-card border border-border rounded-3xl shadow-2xl space-y-5 text-foreground text-xs max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm font-display">Update Sourcing Milestone</h3>
                <p className="text-muted-foreground mt-0.5">{rfqModalItem.product_name}</p>
              </div>
              <button type="button" onClick={() => setRfqModalItem(null)} className="p-2 rounded-xl hover:bg-secondary cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Dropdown */}
            <div className="space-y-1.5">
              <label className="font-bold">Order Status *</label>
              <select
                value={rfqStatus}
                onChange={(e) => setRfqStatus(e.target.value)}
                className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground"
              >
                <option value="requested">🔵 RFQ Submitted</option>
                <option value="searching">🔍 Factory Sourcing Active</option>
                <option value="quoted">📋 Official Quote Ready</option>
                <option value="approved">✅ Contract Approved</option>
                <option value="paid">💳 Escrow Payment Confirmed</option>
                <option value="quality_check">🔬 ISO Quality Inspection</option>
                <option value="in_transit">✈️ International Air Cargo In Transit</option>
                <option value="delivered">📦 Delivered to Destination</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
            </div>

            {/* Factory / Supplier */}
            <div className="space-y-1.5">
              <label className="font-bold">Assigned Factory / Supplier</label>
              <input
                type="text"
                value={rfqSupplier}
                onChange={(e) => setRfqSupplier(e.target.value)}
                placeholder="e.g. Shenzhen TechSource Manufacturing Ltd."
                className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground"
              />
            </div>

            {/* Quote */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold">Quote Amount (FRW)</label>
                <input
                  type="number"
                  value={rfqQuote}
                  onChange={(e) => setRfqQuote(e.target.value)}
                  placeholder="e.g. 2500000"
                  className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold">Quote Notes</label>
                <input
                  type="text"
                  value={rfqNotes}
                  onChange={(e) => setRfqNotes(e.target.value)}
                  placeholder="Incl. shipping & duty"
                  className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground"
                />
              </div>
            </div>

            {/* Tracking Note */}
            <div className="space-y-1.5">
              <label className="font-bold">Add Tracking Milestone Note</label>
              <textarea
                rows={3}
                value={rfqTrackingNote}
                onChange={(e) => setRfqTrackingNote(e.target.value)}
                placeholder="e.g. Cargo boarded at Guangzhou Baiyun International Airport on flight CZ345 — ETA Kigali 48h..."
                className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground resize-none"
              />
              <p className="text-[11px] text-muted-foreground">This message will appear in the client's live tracking timeline.</p>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setRfqModalItem(null)}
                className="px-4 py-2 rounded-xl bg-secondary font-bold cursor-pointer hover:bg-border transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingRfq}
                className="px-5 py-2 rounded-xl brand-gradient text-white font-bold shadow-md disabled:opacity-60 cursor-pointer"
              >
                {isSavingRfq ? 'Saving...' : '📡 Save & Publish Milestone'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* REJECTION MODAL                                              */}
      {/* ───────────────────────────────────────────────────────────── */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 bg-card border border-border rounded-3xl shadow-2xl space-y-4 text-foreground text-xs">
            <h3 className="font-bold text-sm font-display">Reject {rejectModalItem.title}</h3>
            <p className="text-muted-foreground">
              Provide a clear reason so the seller can address any issues or re-submit:
            </p>
            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Missing required business registration, incorrect categories, or invalid contact info..."
              className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground"
            />
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setRejectModalItem(null)}
                className="px-4 py-2 rounded-xl bg-secondary font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold disabled:opacity-50 cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
