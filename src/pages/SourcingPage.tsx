import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Sparkles,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  ShieldCheck,
  Send,
  Globe,
  Award
} from 'lucide-react';

interface SourcingPageProps {
  onNavigate: (route: string) => void;
}

export const SourcingPage: React.FC<SourcingPageProps> = ({ onNavigate }) => {
  const { sourcingRequests, createSourcingRequest, currentUser, isLoggedIn, isAdmin, formatPrice } = useStore();

  const [activeTab, setActiveTab] = useState<'request' | 'track'>('request');

  // Filter sourcing requests: Admins see all; clients see ONLY their own by user_id
  const userSourcingRequests = isAdmin
    ? sourcingRequests
    : isLoggedIn
    ? sourcingRequests.filter((r) => r.user_id === currentUser.id)
    : [];

  // Sourcing Form State
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('Units');
  const [country, setCountry] = useState('Global (Best Price & ISO Standard)');
  const [budget, setBudget] = useState<string>('');
  const [description, setDescription] = useState('');
  const [customerName, setCustomerName] = useState(currentUser.full_name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '+250 793 032 430');
  const [customerEmail, setCustomerEmail] = useState(currentUser.email || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  // East Africa sub-countries shown when region = East Africa
  const EAST_AFRICA_COUNTRIES = [
    '🇷🇼 Rwanda', '🇰🇪 Kenya', '🇹🇿 Tanzania', '🇺🇬 Uganda',
    '🇧🇮 Burundi', '🇸🇸 South Sudan', '🇪🇹 Ethiopia', '🇩🇯 Djibouti',
    '🇸🇴 Somalia', '🇪🇷 Eritrea', '🇨🇩 DR Congo (East)'
  ];
  const [eaCountry, setEaCountry] = useState('🇷🇼 Rwanda');
  const isEastAfrica = country === 'East Africa (Regional Stock)';

  const effectiveRegion = isEastAfrica ? `East Africa — ${eaCountry}` : country;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !description || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const created = await createSourcingRequest({
        user_id: currentUser.id,
        product_name: productName,
        quantity: Number(quantity) || 1,
        unit,
        country: effectiveRegion,
        budget: Number(budget) || 0,
        description,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail
      });

      setSuccessCode(created.tracking_code);
      setProductName('');
      setDescription('');
      setBudget('');
      setActiveTab('track');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      requested: { label: 'RFQ Submitted', color: 'bg-blue-500/10 text-blue-600' },
      searching: { label: 'Factory Sourcing Active', color: 'bg-amber-500/10 text-amber-600' },
      quoted: { label: 'Official Quote Ready', color: 'bg-purple-500/10 text-purple-600' },
      approved: { label: 'Contract Approved', color: 'bg-indigo-500/10 text-indigo-600' },
      paid: { label: 'Escrow Payment Confirmed', color: 'bg-emerald-500/10 text-emerald-600' },
      quality_check: { label: 'ISO-9001 Inspection Passed', color: 'bg-teal-500/10 text-teal-600' },
      in_transit: { label: 'International Air Cargo In Transit', color: 'bg-cyan-500/10 text-cyan-600' },
      delivered: { label: 'Delivered to Destination', color: 'bg-emerald-500/10 text-emerald-600' },
      cancelled: { label: 'Cancelled', color: 'bg-rose-500/10 text-rose-600' }
    };
    const s = map[status] || { label: status, color: 'bg-secondary text-muted-foreground' };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${s.color}`}>
        {s.label}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-10">
      {/* Banner */}
      <div className="rounded-3xl p-8 sm:p-12 brand-gradient text-white relative overflow-hidden shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md">
          <Globe className="w-4 h-4 text-amber-300" />
          <span>Worldwide Factory Sourcing & OEM Manufacturing (RFQ)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
          Direct Global Factory Sourcing <br />
          <span className="text-cyan-200">Custom Quotes from Shenzhen, Frankfurt, Tokyo & London</span>
        </h1>
        <p className="text-xs sm:text-sm text-white/90 max-w-2xl leading-relaxed">
          Need heavy industrial machinery, custom electronics assembly, robotics, or bulk wholesale apparel? Our international sourcing desks negotiate directly with certified ISO-9001 manufacturing hubs worldwide with full door-to-door customs logistics.
        </p>

        {/* Switcher Tabs */}
        <div className="pt-4 flex gap-2">
          <button
            onClick={() => setActiveTab('request')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'request'
                ? 'bg-white text-brand-dark shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Submit Global RFQ
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'track'
                ? 'bg-white text-brand-dark shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Track Active Sourcing ({userSourcingRequests.length})
          </button>
        </div>
      </div>

      {activeTab === 'request' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6 text-foreground"
          >
            <div className="border-b border-border pb-4">
              <h2 className="text-xl font-bold font-display text-foreground">
                Global Sourcing RFQ Form
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Provide specifications, certifications, and target budget for a binding factory quote within 24 hours
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-bold text-foreground">
                  Product Name / Technical Model <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Commercial 60kg Batch Automated Coffee Roaster & Packaging Line"
                  className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Required Volume / Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Unit Specification</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="Units">Units / Pieces</option>
                  <option value="Complete Production Line">Complete Production Line</option>
                  <option value="Sets">Sets</option>
                  <option value="Kilograms">Kilograms (Kg)</option>
                  <option value="Metric Tons">Metric Tons</option>
                  <option value="Container Load (20ft / 40ft)">Container Load (20ft / 40ft)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Preferred Manufacturing Region</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="Global (Best Price & ISO Standard)">Global (Best Price & ISO Standard)</option>
                  <option value="East Africa (Regional Stock)">🌍 East Africa (Regional Stock)</option>
                  <option value="China (Shenzhen/Guangzhou OEM)">🇨🇳 China (Shenzhen/Guangzhou OEM)</option>
                  <option value="Germany (Frankfurt/Stuttgart Precision)">🇩🇪 Germany (Frankfurt/Stuttgart Precision)</option>
                  <option value="Japan (Tokyo/Osaka Optics & Robotics)">🇯🇵 Japan (Tokyo/Osaka Optics & Robotics)</option>
                  <option value="United States (North America)">🇺🇸 United States (North America)</option>
                  <option value="United Kingdom (Europe & Luxury)">🇬🇧 United Kingdom (Europe & Luxury)</option>
                </select>

                {/* Sub-country picker for East Africa */}
                {isEastAfrica && (
                  <div className="pt-2 space-y-1.5">
                    <label className="font-bold text-foreground text-[11px] uppercase tracking-wider text-brand">
                      🌍 Select Specific East African Country
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {EAST_AFRICA_COUNTRIES.map((c) => (
                        <button
                          type="button"
                          key={c}
                          onClick={() => setEaCountry(c)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            eaCountry === c
                              ? 'brand-gradient text-white shadow-sm'
                              : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-border'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-brand mt-1 font-semibold">
                      Selected: <strong>{eaCountry}</strong> — Regional courier pickup arranged from Kigali
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Target Budget (in USD base)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. $45,000"
                  className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand font-mono"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-bold text-foreground">
                  Technical Specifications, Standards & Scope of Work <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Include motor power, material grade (SS304/SS316), CE/ISO certifications, international voltage (110V/220V/380V), lead time targets..."
                  className="w-full p-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>

            {/* Customer Contact Details */}
            <div className="pt-4 border-t border-border space-y-4">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Authorized Procurement Contact
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-muted-foreground font-semibold">Contact Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted-foreground font-semibold">International Phone / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted-foreground font-semibold">Corporate Email Address</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl brand-gradient text-white font-bold text-sm hover:opacity-95 shadow-lg shadow-brand/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting Sourcing RFQ...' : 'Dispatch Sourcing RFQ to Global Factory Desks'}</span>
            </button>
          </form>

          {/* Sourcing Pipeline Guide */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
              <h3 className="font-bold text-sm font-display text-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand" />
                <span>Global Sourcing Framework</span>
              </h3>
              <div className="space-y-4 text-xs">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full brand-gradient text-white flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">RFQ Ingestion & Matching</h4>
                    <p className="text-muted-foreground mt-0.5">Matched with vetted ISO-9001 OEM manufacturers in China, Germany, Japan, or USA.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full brand-gradient text-white flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Comprehensive Binding Quote</h4>
                    <p className="text-muted-foreground mt-0.5">Includes factory cost, international ocean/air freight, and insurance.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full brand-gradient text-white flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Escrow & Pre-Shipment QA</h4>
                    <p className="text-muted-foreground mt-0.5">Payment locked in escrow until third-party factory QA inspection is certified.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tracking Pipeline List */
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between">
            <h3 className="text-sm font-bold font-display text-foreground">
              {isAdmin ? 'All Global Sourcing RFQs Pipeline' : 'My Active Sourcing RFQs'}
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              {userSourcingRequests.length} request(s) linked to your account
            </span>
          </div>

          {!isLoggedIn && !isAdmin ? (
            <div className="p-12 rounded-3xl bg-card border border-border text-center space-y-4">
              <Globe className="w-12 h-12 text-brand mx-auto opacity-70" />
              <div className="space-y-1">
                <h4 className="font-bold text-base text-foreground">Sign In to View Your Sourcing Requests</h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Your custom quotes, factory matching progress, and logistics milestones are securely protected.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('/login')}
                  className="px-6 py-2.5 rounded-xl brand-gradient text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('/track')}
                  className="px-6 py-2.5 rounded-xl bg-secondary text-foreground text-xs font-bold hover:bg-border transition-colors cursor-pointer"
                >
                  Track with Code
                </button>
              </div>
            </div>
          ) : userSourcingRequests.length === 0 ? (
            <div className="p-12 rounded-3xl bg-card border border-border text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto opacity-40" />
              <h4 className="font-bold text-base text-foreground">No Active Sourcing Requests Found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                You haven't submitted any custom factory sourcing RFQs yet. Click "Submit Global RFQ" to request quotes from manufacturers worldwide.
              </p>
              <button
                onClick={() => setActiveTab('request')}
                className="px-6 py-2.5 rounded-xl brand-gradient text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Submit Global RFQ
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {userSourcingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-6"
                >
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-secondary text-foreground">
                          {req.tracking_code}
                        </span>
                        {getStatusBadge(req.status)}
                      </div>
                      <h3 className="text-lg font-bold font-display text-foreground mt-1.5">
                        {req.product_name}
                      </h3>
                    </div>

                    <div className="text-right sm:text-right">
                      <span className="text-[11px] text-muted-foreground block">Customer Target Budget</span>
                      <span className="text-base font-bold text-foreground font-display">
                        {req.budget ? formatPrice(req.budget) : 'Open Quote'}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-secondary/50 space-y-0.5">
                      <span className="text-muted-foreground block text-[10px]">Volume</span>
                      <span className="font-bold text-foreground">{req.quantity} {req.unit}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/50 space-y-0.5">
                      <span className="text-muted-foreground block text-[10px]">Assigned Global Supplier</span>
                      <span className="font-bold text-brand">{req.supplier_name || 'Pending matching'}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/50 space-y-0.5">
                      <span className="text-muted-foreground block text-[10px]">Quoted Amount</span>
                      <span className="font-bold text-foreground font-display">
                        {req.quote_amount ? formatPrice(req.quote_amount) : 'Preparing quote...'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>Technical Scope:</strong> {req.description}
                  </p>

                  {/* Stepper Tracking History */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Sourcing Milestone Log
                    </h4>
                    <div className="space-y-2">
                      {req.tracking.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-xs">
                          <div className="w-2.5 h-2.5 rounded-full bg-brand shrink-0 mt-1.5" />
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{step.note}</p>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {new Date(step.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
