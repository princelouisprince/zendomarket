import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { uploadToStorage } from '../lib/supabaseStorage';
import { RWANDA_DISTRICTS, SUPPORT_PHONE, SUPPORT_WHATSAPP_LINK } from '../lib/constants';
import {
  Store,
  ShieldCheck,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Send,
  Check,
  Camera,

  Phone,
  Mail,
  MapPin,
  Globe
} from 'lucide-react';

interface BecomeSellerPageProps {
  onNavigate: (route: string) => void;
}

const SELLER_COUNTRIES = [
  'Rwanda',
  'Kenya',
  'Tanzania',
  'Uganda',
  'Burundi',
  'United States',
  'China',
  'United Kingdom',
  'Germany',
  'United Arab Emirates',
  'South Africa',
  'Other'
];

export const BecomeSellerPage: React.FC<BecomeSellerPageProps> = ({ onNavigate }) => {
  const {
    submitSellerApplication,
    categories,
    currentUser,
    isLoggedIn,
    commissionSettings,
    sellerApplications,
    showToast
  } = useStore();

  // 0. A person cannot apply to become a seller without an account
  if (!isLoggedIn) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-brand/10 text-brand flex items-center justify-center mx-auto shadow-sm">
          <Store className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand/10 text-brand">
            Account Required
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground">
            Sign In to Apply as a Seller
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            You must have a registered ZENDO account before submitting your seller onboarding application. Sign in or register to get started.
          </p>
        </div>
        <div className="flex gap-3 justify-center pt-4">
          <button
            onClick={() => onNavigate('/login')}
            className="px-6 py-3 rounded-2xl brand-gradient text-white text-xs font-bold shadow-md hover:opacity-95 flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => onNavigate('/register')}
            className="px-6 py-3 rounded-2xl bg-secondary text-foreground text-xs font-bold hover:bg-border transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>
      </div>
    );
  }

  // 0b. Super admin cannot request to become a seller
  if (currentUser.role === 'admin' || currentUser.role === 'super_admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600">
            Super Admin Account
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground">
            Admin Accounts Cannot Apply as Sellers
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Super Admin and Admin accounts are reserved for platform governance, seller moderation, and escrow oversight.
          </p>
        </div>
        <div className="flex gap-3 justify-center pt-4">
          <button
            onClick={() => onNavigate('/super-admin')}
            className="px-6 py-3 rounded-2xl brand-gradient text-white text-xs font-bold shadow-md hover:opacity-95 flex items-center gap-2"
          >
            <Store className="w-4 h-4" />
            <span>Open Command Center</span>
          </button>
          <button
            onClick={() => onNavigate('/')}
            className="px-6 py-3 rounded-2xl bg-secondary text-foreground text-xs font-bold hover:bg-border transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Check if current user already has an application or is already a seller
  const isAlreadySeller = currentUser.role === 'seller';
  const existingApp = sellerApplications.find(
    (a) =>
      (currentUser.id && a.user_id === currentUser.id) ||
      (currentUser.email && a.email && a.email.toLowerCase() === currentUser.email.toLowerCase())
  );
  const isApproved = isAlreadySeller || existingApp?.status === 'approved';
  const isPending = !isApproved && existingApp?.status === 'pending';

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [fullName, setFullName] = useState(currentUser.full_name || '');
  const [phone, setPhone] = useState(currentUser.phone || '+250 793 032 430');
  const [email, setEmail] = useState(currentUser.email || '');

  // Country & Location selection
  const [country, setCountry] = useState('Rwanda');
  const [district, setDistrict] = useState('Nyarugenge');
  const [businessAddress, setBusinessAddress] = useState('');
  const [cityRegion, setCityRegion] = useState('Kigali');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Electronics', 'Furniture', 'Phones']);

  // Direct Merchant Payment / Payout Details
  const [paymentMethod, setPaymentMethod] = useState<'MTN MoMo Pay' | 'Airtel Money' | 'Bank Transfer'>('MTN MoMo Pay');
  const [paymentCodeOrNumber, setPaymentCodeOrNumber] = useState('');
  const [paymentAccountName, setPaymentAccountName] = useState('');

  // Document and Photo Upload state (Supabase Storage 'seller-images')
  const [photoUrl, setPhotoUrl] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleCategory = (catName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    try {
      const res = await uploadToStorage('seller-images', file);
      if (res.url) {
        setPhotoUrl(res.url);
        showToast('Store Photo Uploaded', 'Saved to Supabase Storage bucket.', 'success');
      } else {
        showToast('Upload Failed', res.error || 'Could not upload photo.', 'error');
      }
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingDoc(true);
    try {
      const res = await uploadToStorage('seller-images', file);
      if (res.url) {
        setDocumentUrl(res.url);
        showToast('Business Logo Uploaded', 'Logo saved to Supabase Storage.', 'success');
      } else {
        showToast('Upload Failed', res.error || 'Could not upload document.', 'error');
      }
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !fullName || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const locationString =
        country === 'Rwanda'
          ? `${district} District, Kigali, Rwanda`
          : `${cityRegion}, ${country}`;

      const addressString =
        country === 'Rwanda'
          ? `${businessAddress}, ${district}, Rwanda`
          : `${businessAddress}, ${cityRegion}, ${country}`;

      await submitSellerApplication({
        business_name: businessName,
        full_name: fullName,
        phone,
        email,
        location: locationString,
        business_address: addressString,
        business_description: description,
        business_category: selectedCategories.join(','),
        business_photo_url: photoUrl,
        document_url: documentUrl,
        payment_method: paymentMethod,
        payment_phone_or_code: paymentCodeOrNumber,
        payment_account_name: paymentAccountName
      });
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. If user is already an approved seller, block duplicate applications and direct to dashboard
  if (isApproved) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600">
            Active Verified Merchant
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground">
            You Are Already an Approved Seller!
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Your vendor account is active. You can manage your products, check orders, and track payouts in your Seller Hub.
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-4">
          <button
            onClick={() => onNavigate('/seller')}
            className="px-6 py-3 rounded-2xl brand-gradient text-white text-xs font-bold shadow-md hover:opacity-95 flex items-center gap-2"
          >
            <Store className="w-4 h-4" />
            <span>Open Seller Dashboard</span>
          </button>
          <button
            onClick={() => onNavigate('/')}
            className="px-6 py-3 rounded-2xl bg-secondary text-foreground text-xs font-bold hover:bg-border transition-colors"
          >
            Marketplace Home
          </button>
        </div>
      </div>
    );
  }

  // 2. If user has a pending application, prevent multiple submissions
  if (isPending) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto shadow-sm">
          <Clock className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600">
            Application Under Review
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground">
            Your Application is Being Processed
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            You have already submitted an application for <strong>{existingApp?.business_name}</strong>. Our Kigali merchant desk is reviewing your business credentials. You will receive an in-app notification as soon as it is approved.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-secondary/50 text-xs text-left space-y-2 border border-border">
          <p><strong>Store Name:</strong> {existingApp?.business_name}</p>
          <p><strong>Location:</strong> {existingApp?.business_location}</p>
          <p><strong>Status:</strong> <span className="font-bold text-amber-500 uppercase">Pending Admin Approval</span></p>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <a
            href={`${SUPPORT_WHATSAPP_LINK}?text=Hi+ZENDO!+I+am+following+up+on+my+seller+application+for+${encodeURIComponent(existingApp?.business_name || '')}.`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-500 transition-colors flex items-center gap-2"
          >
            <span>Follow Up on WhatsApp ({SUPPORT_PHONE})</span>
          </a>
          <button
            onClick={() => onNavigate('/')}
            className="px-6 py-3 rounded-2xl bg-secondary text-foreground text-xs font-bold hover:bg-border transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-12">
      {/* Header Banner */}
      <div className="rounded-3xl p-8 sm:p-12 brand-dark-banner text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold">
            <Store className="w-3.5 h-3.5" />
            <span>Join Verified Merchants in Kigali & Global</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
            Grow Your Business on ZENDO Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Reach consumers across all 30 districts of Rwanda with instant MTN MoMo & Airtel payments, dedicated door-to-door delivery, and live digital inventory tools backed by Supabase.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
          <span className="text-3xl font-black font-display text-brand-light">0 FRW</span>
          <p className="text-xs text-white/80 mt-1 font-semibold">Listing & Onboarding Fee</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-400 text-black">
            100% Direct Merchant Payouts
          </span>
        </div>
      </div>

      {isSubmitted ? (
        <div className="max-w-xl mx-auto p-10 rounded-3xl bg-card border border-border text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-display text-foreground">Application Received!</h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Thank you for applying to sell on ZENDO Marketplace. Our Kigali merchant desk will review your business credentials and activate your seller dashboard within 24 hours.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-secondary/50 text-xs text-muted-foreground text-left space-y-1">
            <p><strong>Business:</strong> {businessName}</p>
            <p><strong>Country & Location:</strong> {country === 'Rwanda' ? `${district}, Kigali, Rwanda` : `${cityRegion}, ${country}`}</p>
            <p><strong>Contact:</strong> {phone} | {email}</p>
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => onNavigate('/')}
              className="px-6 py-3 rounded-2xl brand-gradient text-white text-xs font-bold shadow-md hover:opacity-95"
            >
              Return to Homepage
            </button>
            <a
              href={SUPPORT_WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-500 transition-colors"
            >
              Chat on WhatsApp ({SUPPORT_PHONE})
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Application Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-8 p-6 sm:p-10 rounded-3xl bg-card border border-border shadow-sm space-y-6 text-foreground"
          >
            <div className="border-b border-border pb-4">
              <h2 className="text-xl font-bold font-display text-foreground">
                Merchant Onboarding Application
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Fill in your legal company or store details to receive your verified vendor badge
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground">
                  Store / Brand Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Kigali Tech Electronics Hub"
                  className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">
                  Owner / Representative Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Legal Name"
                  className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">
                  Phone (MoMo / WhatsApp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+250 793 032 430"
                  className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">
                  Business Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vendor@zendo.rw"
                  className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              {/* Country Selection */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-foreground flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-brand" />
                  <span>Country / Headquarters *</span>
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand font-semibold"
                >
                  {SELLER_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c === 'Rwanda' ? '🇷🇼 Rwanda' : c}</option>
                  ))}
                </select>
              </div>

              {/* Conditional Location based on Country */}
              {country === 'Rwanda' ? (
                <>
                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Rwanda District *</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                    >
                      {RWANDA_DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Physical Store / Workshop Address in Rwanda *</label>
                    <input
                      type="text"
                      required
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      placeholder="e.g. Nyarugenge Market, Shop #24 / Kacyiru"
                      className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">State / Province / City in {country} *</label>
                    <input
                      type="text"
                      required
                      value={cityRegion}
                      onChange={(e) => setCityRegion(e.target.value)}
                      placeholder="e.g. New York / Nairobi / London"
                      className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Physical Store / Workshop Address *</label>
                    <input
                      type="text"
                      required
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      placeholder="e.g. 120 Broadway, Suite 400"
                      className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                </>
              )}

              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-bold text-foreground">
                  Store & Inventory Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your items (electronics, furniture, phones), warranty terms, and warehouse capacity..."
                  className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>

            {/* Supabase Storage Uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-2 text-xs">
                <span className="font-bold block">Store Logo / Storefront Photo</span>
                <div className="flex items-center gap-3">
                  {photoUrl && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-border shrink-0 bg-card">
                      <img src={photoUrl} alt="Store Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-card border border-border cursor-pointer hover:bg-secondary transition-colors">
                    <Camera className="w-4 h-4 text-brand" />
                    <span className="truncate">
                      {isUploadingPhoto ? 'Uploading to Supabase...' : photoUrl ? 'Change Store Photo' : 'Upload Store Image from Laptop'}
                    </span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-2 text-xs">
                <span className="font-bold block">Business Logo</span>
                <div className="flex items-center gap-3">
                  {documentUrl && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-border shrink-0 bg-card">
                      <img src={documentUrl} alt="Business Logo" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-card border border-border cursor-pointer hover:bg-secondary transition-colors">
                    <Camera className="w-4 h-4 text-emerald-500" />
                    <span className="truncate">
                      {isUploadingDoc ? 'Uploading Logo...' : documentUrl ? 'Business Logo Uploaded ✅ (Change)' : 'Upload Your Business Logo'}
                    </span>
                    <input type="file" accept="image/*" onChange={handleDocUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Merchant Payment & Direct Payout Details */}
            <div className="p-5 rounded-3xl bg-secondary/50 border border-border space-y-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-sm text-foreground flex items-center gap-1.5 font-display">
                  💰 Direct Merchant Payout & Client Payment Details *
                </span>
                <p className="text-muted-foreground text-[11px]">
                  Provide your business MoMo code or mobile number and the registered account name where buyers and platform payouts will be sent.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Payment Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-card border border-border text-foreground font-semibold"
                  >
                    <option value="MTN MoMo Pay">📱 MTN MoMo Pay</option>
                    <option value="Airtel Money">🔴 Airtel Money</option>
                    <option value="Bank Transfer">🏦 Bank Account / Transfer</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Merchant Code / Phone *</label>
                  <input
                    type="text"
                    required
                    value={paymentCodeOrNumber}
                    onChange={(e) => setPaymentCodeOrNumber(e.target.value)}
                    placeholder="e.g. 0793032430 or MoMo Code #654321"
                    className="w-full p-3 rounded-xl bg-card border border-border text-foreground focus:ring-2 focus:ring-brand font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Registered Account Name *</label>
                  <input
                    type="text"
                    required
                    value={paymentAccountName}
                    onChange={(e) => setPaymentAccountName(e.target.value)}
                    placeholder="e.g. Kigali Electronics Ltd / Eric M."
                    className="w-full p-3 rounded-xl bg-card border border-border text-foreground focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>
            </div>

            {/* Categories Selection */}
            <div className="space-y-3 pt-2">
              <label className="font-bold text-xs text-foreground block">
                Product Categories You Offer
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.name);
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => toggleCategory(cat.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isChecked
                          ? 'bg-brand text-white shadow-xs'
                          : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isUploadingPhoto || isUploadingDoc}
              className="w-full py-4 rounded-2xl brand-gradient text-white font-bold text-sm hover:opacity-95 shadow-lg shadow-brand/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting Application to Supabase...' : 'Submit Seller Application'}</span>
            </button>
          </form>

          {/* Value Props Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
              <h3 className="font-bold text-sm font-display text-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand" />
                <span>Why Sell on ZENDO?</span>
              </h3>

              <div className="space-y-3.5 text-xs text-muted-foreground">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                    ✓
                  </div>
                  <div>
                    <strong className="text-foreground block">Instant MTN MoMo & Airtel Payouts</strong>
                    <span>Automated payment escrow released directly upon buyer delivery confirmation.</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-brand/10 text-brand flex items-center justify-center font-bold text-xs shrink-0">
                    ✓
                  </div>
                  <div>
                    <strong className="text-foreground block">Kigali & 30 Districts Courier</strong>
                    <span>Pickups arranged directly from your shop with door-to-door delivery.</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
                    ✓
                  </div>
                  <div>
                    <strong className="text-foreground block">Dedicated Merchant Hotline</strong>
                    <span>Call or WhatsApp our vendor support team at <strong>{SUPPORT_PHONE}</strong>.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
