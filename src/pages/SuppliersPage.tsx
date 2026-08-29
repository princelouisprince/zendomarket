import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Supplier } from '../types';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Star,
  Search,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Filter,
  CheckCircle2,
  X,
  Globe
} from 'lucide-react';

export const SuppliersPage: React.FC<SuppliersPageProps> = ({ onNavigate }) => {
  const { suppliers, isSeller, isAdmin, isLoggedIn } = useStore();
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [contactSupplier, setContactSupplier] = useState<Supplier | null>(null);

  // Sellers and Admins only have access to Verified Wholesale Suppliers Directory
  if (!isSeller && !isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-brand/10 text-brand flex items-center justify-center mx-auto shadow-inner">
          <Building2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold">
            <span>🔒 Seller Exclusive Feature</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground">
            Verified Suppliers Directory
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Direct access to verified international manufacturers, factory contacts, and OEM suppliers is exclusively reserved for approved merchants and sellers on ZENDO.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-card border border-border text-left space-y-3 text-xs text-foreground shadow-sm">
          <h3 className="font-bold text-sm font-display flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand" />
            <span>Why sell on ZENDO?</span>
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Direct factory wholesale prices from Shenzhen, Frankfurt & London</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Dedicated cargo freight & customs clearing assistance</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Zero platform commission on direct customer deliveries</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('/become-seller')}
            className="px-6 py-3 rounded-2xl brand-gradient text-white text-xs font-bold shadow-md hover:opacity-95 cursor-pointer"
          >
            Apply to Become a Seller
          </button>
          {!isLoggedIn && (
            <button
              onClick={() => onNavigate('/login')}
              className="px-6 py-3 rounded-2xl bg-secondary text-foreground text-xs font-bold hover:bg-border transition-colors cursor-pointer"
            >
              Sign In as Seller
            </button>
          )}
        </div>
      </div>
    );
  }

  const countries = ['all', 'China', 'Germany', 'United Kingdom', 'Japan', 'United States', 'Rwanda', 'Kenya'];

  const filteredSuppliers = suppliers.filter((sup) => {
    if (selectedCountry !== 'all' && sup.country.toLowerCase() !== selectedCountry.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        sup.name.toLowerCase().includes(q) ||
        sup.city.toLowerCase().includes(q) ||
        sup.country.toLowerCase().includes(q) ||
        sup.category.toLowerCase().includes(q) ||
        sup.products.some((p) => p.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Global Verified Manufacturers & B2B Hubs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground">
            Verified Global Suppliers Directory
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Connect directly with audited OEM manufacturers, industrial fabricators, and certified exporters worldwide
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={() => onNavigate('/sourcing')}
          className="px-5 py-2.5 rounded-2xl brand-gradient text-white text-xs font-bold hover:opacity-95 shadow-md shadow-brand/20 flex items-center gap-2 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Request Custom Sourcing (RFQ)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Country Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                selectedCountry === country
                  ? 'brand-gradient text-white shadow-xs'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {country === 'all' ? 'All Global Regions' : country}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search manufacturers, products..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand placeholder:text-muted-foreground"
          />
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Grid of Suppliers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="p-6 rounded-3xl bg-card border border-border card-hover-lift flex flex-col justify-between gap-6 shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <img
                  src={supplier.logo}
                  alt={supplier.name}
                  className="w-16 h-16 rounded-2xl object-cover bg-secondary border border-border shrink-0 shadow-sm"
                />
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ISO Verified</span>
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-foreground font-display leading-tight">
                  {supplier.name}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-brand" />
                  <span>{supplier.city}, {supplier.country}</span>
                </p>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {supplier.description}
              </p>

              {/* Product Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {supplier.products.map((p, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-secondary text-foreground text-[10px] font-semibold"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
              <div className="flex items-center text-amber-400 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                <span className="font-bold text-foreground">{supplier.rating}</span>
                <span className="text-muted-foreground ml-1 font-mono">({supplier.rating_count})</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setContactSupplier(supplier)}
                  className="px-3.5 py-1.5 rounded-xl bg-secondary hover:bg-border text-foreground text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Details</span>
                </button>
                <button
                  onClick={() => onNavigate('/sourcing')}
                  className="px-3.5 py-1.5 rounded-xl brand-gradient text-white text-xs font-bold hover:opacity-95 shadow-sm"
                >
                  RFQ Quote
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Supplier Modal */}
      {contactSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md p-6 bg-card border border-border rounded-3xl shadow-2xl space-y-5 text-foreground">
            <button
              onClick={() => setContactSupplier(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-secondary hover:bg-border text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={contactSupplier.logo}
                alt=""
                className="w-14 h-14 rounded-2xl object-cover bg-secondary"
              />
              <div>
                <h3 className="font-bold text-sm font-display">{contactSupplier.name}</h3>
                <p className="text-xs text-muted-foreground">{contactSupplier.city}, {contactSupplier.country}</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {contactSupplier.description}
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-secondary/50 flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand" />
                <span>{contactSupplier.phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-secondary/50 flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand" />
                <span>{contactSupplier.email}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href={`tel:${contactSupplier.phone}`}
                className="flex-1 py-3 rounded-xl brand-gradient text-white text-xs font-bold text-center shadow-md"
              >
                Call Procurement Desk
              </a>
              <button
                onClick={() => {
                  setContactSupplier(null);
                  onNavigate('/sourcing');
                }}
                className="flex-1 py-3 rounded-xl bg-secondary text-foreground text-xs font-bold hover:bg-border"
              >
                Submit RFQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
