import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  RWANDA_PROVINCES,
  RWANDA_DISTRICTS_BY_PROVINCE,
  INTERNATIONAL_COUNTRIES,
  INTERNATIONAL_COUNTRY_PROVINCES,
  RWANDA_SECTORS,
  SUPPORT_WHATSAPP_LINK,
  SUPPORT_PHONE,
  SUPPORT_WHATSAPP_NUMBER
} from '../lib/constants';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Truck,
  MapPin,
  Phone,
  MessageCircle,
  Globe,
  ChevronDown,
  LogIn
} from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (route: string) => void;
}

const ALL_COUNTRIES = INTERNATIONAL_COUNTRIES.map(c => c.name).sort();

const CheckoutForm: React.FC<{ onNavigate: (r: string) => void }> = ({ onNavigate }) => {
  const { cart, cartTotal, createOrder, currentUser, formatPrice, currentCurrency, sellers } = useStore();

  const [customerName, setCustomerName] = useState(currentUser.full_name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '+250 ');
  const [customerEmail, setCustomerEmail] = useState(currentUser.email || '');

  const [selectedCountry, setSelectedCountry] = useState('Rwanda');
  const [selectedProvince, setSelectedProvince] = useState('Kigali City');
  const [selectedDistrict, setSelectedDistrict] = useState('Nyarugenge');
  const [selectedSector, setSelectedSector] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const isRwanda = selectedCountry === 'Rwanda';
  const provinceOptions = isRwanda ? Array.from(RWANDA_PROVINCES) : (INTERNATIONAL_COUNTRY_PROVINCES[selectedCountry] || []);
  const districtOptions = isRwanda ? (RWANDA_DISTRICTS_BY_PROVINCE[selectedProvince] || []) : [];
  const sectorOptions = isRwanda ? (RWANDA_SECTORS[selectedDistrict] || []) : [];

  useEffect(() => {
    if (isRwanda) {
      setSelectedProvince('Kigali City');
      setSelectedDistrict('Nyarugenge');
      setSelectedSector('');
    } else {
      const provinces = INTERNATIONAL_COUNTRY_PROVINCES[selectedCountry] || [];
      setSelectedProvince(provinces[0] || '');
      setSelectedDistrict('');
      setSelectedSector('');
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (isRwanda) {
      const districts = RWANDA_DISTRICTS_BY_PROVINCE[selectedProvince] || [];
      setSelectedDistrict(districts[0] || '');
      setSelectedSector('');
    }
  }, [selectedProvince, isRwanda]);

  useEffect(() => {
    if (isRwanda) {
      const sectors = RWANDA_SECTORS[selectedDistrict] || [];
      setSelectedSector(sectors[0] || '');
    }
  }, [selectedDistrict, isRwanda]);

  const [paymentMethod, setPaymentMethod] = useState<
    'MTN Mobile Money' | 'Airtel Money' | 'Credit/Debit Card' | 'Cash on Delivery'
  >('MTN Mobile Money');
  const [momoDialed, setMomoDialed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrderCode, setConfirmedOrderCode] = useState<string | null>(null);

  const isMobileMoney = paymentMethod === 'MTN Mobile Money' || paymentMethod === 'Airtel Money';
  const deliveryFee = isRwanda ? 2000 : 15000;
  const total = cartTotal + deliveryFee;
  const ussdCode = paymentMethod === 'MTN Mobile Money' ? '*182*8*1*33715#' : '*185*8*1*33715#';

  const buildFullAddress = () => {
    if (isRwanda) {
      return [selectedSector, selectedDistrict, selectedProvince, 'Rwanda'].filter(Boolean).join(', ');
    }
    return [address || selectedProvince, selectedCountry].filter(Boolean).join(', ');
  };

  const handleWhatsAppOrder = () => {
    const items = cart.map(i =>
      `• ${i.product.name} x${i.quantity} — ${formatPrice((i.product.discount_price || i.product.price) * i.quantity)}`
    ).join('\n');
    const msg = encodeURIComponent(
      `Hello ZENDO! 🛒\n\nI'd like to order via WhatsApp:\n\n${items}\n\nSubtotal: ${formatPrice(cartTotal)}\nDelivery: ${formatPrice(deliveryFee)}\nTotal: ${formatPrice(total)}\n\nDelivery to: ${buildFullAddress()}\nName: ${customerName || 'Not provided'}\nPhone: ${customerPhone || 'Not provided'}`
    );
    window.open(`https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || isProcessing) return;
    setIsProcessing(true);
    try {
      const orderItems = cart.map((item) => ({
        product_id: item.product.id,
        name: item.product.name,
        price: item.product.discount_price || item.product.price,
        quantity: item.quantity,
        seller_id: item.product.seller_id,
        seller_user_id: item.product.seller_user_id,
        image: item.product.images[0]
      }));
      const sellerIds = Array.from(new Set(cart.map((item) => item.product.seller_id)));
      const fullAddress = buildFullAddress();
      const created = await createOrder({
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        items: orderItems,
        seller_ids: sellerIds,
        subtotal: cartTotal,
        delivery_fee: deliveryFee,
        total_amount: total,
        total,
        district: selectedDistrict || selectedProvince,
        sector: selectedSector || selectedProvince,
        status: paymentMethod === 'Cash on Delivery' ? 'confirmed' : 'paid',
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'Cash on Delivery' ? 'pending' : 'paid',
        address: fullAddress,
        delivery_address: fullAddress,
        delivery_instructions: deliveryInstructions
      });
      // Show success state even if secondary DB steps had partial failures
      const trackingCode = created?.tracking_code || created?.order_number || `ZND-RW-${Date.now().toString().slice(-6)}`;
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      setConfirmedOrderCode(trackingCode);
    } catch (err) {
      console.error('[Checkout] Order error:', err);
    } finally {
      setIsProcessing(false);
    }
  };


  if (confirmedOrderCode) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground">Order Confirmed! 🎉</h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Murakoze! Your order has been placed. Our delivery team will reach you within <strong>24–72 hours</strong>.
          </p>
        </div>
        <div className="p-6 rounded-3xl bg-card border border-border text-left space-y-3.5 text-xs text-foreground shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground font-semibold">Tracking Number:</span>
            <span className="font-mono font-bold text-brand text-sm">{confirmedOrderCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Recipient:</span>
            <span className="font-bold">{customerName} ({customerPhone})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery to:</span>
            <span className="font-bold text-right max-w-[60%]">{buildFullAddress()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment:</span>
            <span className="font-bold">{paymentMethod}</span>
          </div>
          <div className="flex justify-between items-baseline pt-3 border-t border-border">
            <span className="font-bold text-sm">Total Amount:</span>
            <span className="font-extrabold text-lg text-brand font-display">{formatPrice(total)}</span>
          </div>
        </div>
        {isMobileMoney && (
          <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 text-xs text-left">
            <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">📱 Send Payment Screenshot on WhatsApp</p>
            <p className="text-muted-foreground leading-relaxed">
              After completing your {paymentMethod} payment, take a screenshot and send it to our WhatsApp so we can confirm and dispatch your order immediately.
            </p>
            <a
              href={`${SUPPORT_WHATSAPP_LINK}?text=Hi+ZENDO!+I+just+paid+for+order+%23${confirmedOrderCode}+via+${encodeURIComponent(paymentMethod)}.+Here+is+my+payment+screenshot.`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-md hover:bg-emerald-500 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Confirm Payment on WhatsApp ({SUPPORT_PHONE})</span>
            </a>
          </div>
        )}
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate(`/track?code=${confirmedOrderCode}`)}
            className="px-6 py-3 rounded-xl brand-gradient text-white text-xs font-bold shadow-md hover:opacity-95"
          >
            Track Order Live
          </button>
          <button
            onClick={() => onNavigate('/account')}
            className="px-6 py-3 rounded-xl bg-secondary text-foreground text-xs font-bold hover:bg-border transition-colors"
          >
            My Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-foreground flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-brand" />
          <span>Secure Checkout</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          International delivery • MTN MoMo & Airtel Money • Order via WhatsApp
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Contact */}
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
            <h3 className="font-bold text-sm font-display text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand" />
              <span>1. Your Contact Details</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Full Name *</label>
                <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Jean Pierre Habimana"
                  className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand" />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Phone / WhatsApp *</label>
                <input type="text" required value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+250 793 032 430"
                  className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand" />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Email Address *</label>
                <input type="email" required value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand" />
              </div>
            </div>
          </div>

          {/* 2. Delivery Location */}
          <div className="p-6 rounded-3xl bg-card border border-border space-y-5 shadow-sm">
            <h3 className="font-bold text-sm font-display text-foreground flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand" />
              <span>2. Delivery Location</span>
            </h3>

            {/* Country */}
            <div className="space-y-1 text-xs">
              <label className="font-semibold text-muted-foreground flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">1</span>
                Select Country *
              </label>
              <div className="relative">
                <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand appearance-none pr-8">
                  {ALL_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Province */}
            {provinceOptions.length > 0 && (
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-muted-foreground flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">2</span>
                  {isRwanda ? 'Select Province *' : 'Select Region / State *'}
                </label>
                <div className="relative">
                  <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand appearance-none pr-8">
                    {provinceOptions.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            {/* District (Rwanda only) */}
            {isRwanda && districtOptions.length > 0 && (
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-muted-foreground flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">3</span>
                  Select District *
                </label>
                <div className="relative">
                  <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand appearance-none pr-8">
                    {districtOptions.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Sector (Rwanda only) */}
            {isRwanda && sectorOptions.length > 0 && (
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-muted-foreground flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">4</span>
                  Select Sector *
                </label>
                <div className="relative">
                  <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand appearance-none pr-8">
                    {sectorOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Street */}
            <div className="space-y-1 text-xs">
              <label className="font-semibold text-muted-foreground">Street / Nearest Landmark</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                placeholder={isRwanda ? "e.g. Opposite KCB Bank, near Sector Office" : "e.g. 123 Main Street, Apt 4B"}
                className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            <div className="space-y-1 text-xs">
              <label className="font-semibold text-muted-foreground">Delivery Instructions (Optional)</label>
              <input type="text" value={deliveryInstructions} onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder="e.g. Call on arrival, blue gate, flat 3B"
                className="w-full p-2.5 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
            {buildFullAddress() && (
              <div className="p-3 rounded-xl bg-brand/5 border border-brand/20 text-xs flex items-start gap-2 text-foreground">
                <MapPin className="w-3.5 h-3.5 text-brand mt-0.5 shrink-0" />
                <span><span className="font-semibold">Delivery to: </span>{buildFullAddress()}</span>
              </div>
            )}
          </div>

          {/* 3. Payment */}
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
            <h3 className="font-bold text-sm font-display text-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand" />
              <span>3. Payment Method</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { id: 'MTN Mobile Money', icon: '📱', desc: 'USSD dial *182*8*1*33715# or MoMo App' },
                { id: 'Airtel Money', icon: '📲', desc: 'USSD dial *185*8*1*33715# or Airtel App' },
                { id: 'Credit/Debit Card', icon: '💳', desc: 'Visa, Mastercard (secure checkout)' },
                { id: 'Cash on Delivery', icon: '💵', desc: 'Pay our agent at your door upon delivery' }
              ].map((method) => (
                <div key={method.id}
                  onClick={() => { setPaymentMethod(method.id as any); setMomoDialed(false); }}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${paymentMethod === method.id ? 'border-brand bg-brand/5 shadow-sm ring-1 ring-brand' : 'border-border bg-card hover:bg-secondary text-muted-foreground'}`}>
                  <span className="text-xl shrink-0">{method.icon}</span>
                  <div>
                    <h4 className={`font-bold text-xs ${paymentMethod === method.id ? 'text-brand' : 'text-foreground'}`}>{method.id}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{method.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {isMobileMoney && (
              <div className="mt-2 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4 text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-amber-700 dark:text-amber-400 text-sm">
                    {paymentMethod === 'MTN Mobile Money' ? '📱 MTN MoMo Payment' : '📲 Airtel Money Payment'}
                  </p>
                  <p className="text-muted-foreground">Dial the code below to pay <strong>{formatPrice(total)}</strong>:</p>
                  <div className="font-mono text-base font-black text-foreground px-3 py-2 rounded-xl bg-secondary border border-border inline-block">{ussdCode}</div>
                </div>
                {!momoDialed ? (
                  <a href={`tel:${ussdCode}`} onClick={() => setMomoDialed(true)}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-amber-500 text-white font-bold text-sm shadow-md hover:bg-amber-400 transition-colors">
                    <Phone className="w-5 h-5" />
                    <span>Dial {ussdCode} — Pay Now</span>
                  </a>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>USSD opened — complete payment on your phone</span>
                    </div>
                    <p className="text-muted-foreground">Take a screenshot of your payment confirmation SMS and send it to our WhatsApp:</p>
                    <a
                      href={`${SUPPORT_WHATSAPP_LINK}?text=Hi+ZENDO!+I+want+to+send+my+${encodeURIComponent(paymentMethod)}+payment+screenshot+for+my+order.`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-colors shadow-md">
                      <MessageCircle className="w-5 h-5" />
                      <span>Send Screenshot on WhatsApp ({SUPPORT_PHONE})</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* WhatsApp Order Alternative */}
          <div className="p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/30 space-y-3 text-xs">
            <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Order via WhatsApp Instead
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Prefer to order directly through WhatsApp? Fill in your name and location above, then tap the button below — our agent will handle the rest.
            </p>
            <button type="button" onClick={handleWhatsAppOrder}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-md hover:bg-emerald-500 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>Order via WhatsApp ({SUPPORT_PHONE})</span>
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-card border border-border space-y-4 text-foreground shadow-lg sticky top-28">
            <h3 className="font-bold text-base font-display pb-3 border-b border-border flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-mono text-muted-foreground">({currentCurrency})</span>
            </h3>
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {cart.map(({ product, quantity }) => {
                const sellerObj = sellers.find((s) => s.id === product.seller_id || s.user_id === product.seller_user_id);
                return (
                  <div key={product.id} className="p-2.5 rounded-xl bg-secondary/50 space-y-1 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate flex-1">
                        <span className="font-bold text-foreground">{product.name}</span>
                        <span className="text-muted-foreground ml-1 font-mono">(x{quantity})</span>
                      </div>
                      <span className="font-semibold text-foreground shrink-0">
                        {formatPrice((product.discount_price || product.price) * quantity)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5 border-t border-border/40">
                      <span>Seller: <strong className="text-foreground">{product.seller_name || sellerObj?.store_name || 'Verified Merchant'}</strong></span>
                      {sellerObj?.payment_phone_or_code ? (
                        <span className="text-emerald-600 font-bold font-mono">Direct MoMo: {sellerObj.payment_phone_or_code}</span>
                      ) : (
                        <span className="text-muted-foreground">Direct Payout</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="space-y-2 text-xs border-t border-border pt-3 text-muted-foreground">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-foreground">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery to {selectedDistrict || selectedProvince || selectedCountry}</span>
                <span className="font-semibold text-foreground">{formatPrice(deliveryFee)}</span>
              </div>
              {!isRwanda && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400">International delivery — shipping cost may vary.</p>
              )}
              <div className="border-t border-border pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-foreground">Total</span>
                <span className="text-2xl font-black text-brand font-display">{formatPrice(total)}</span>
              </div>
            </div>
            <button type="submit" disabled={isProcessing}
              className="w-full py-4 rounded-2xl brand-gradient text-white font-bold text-sm hover:opacity-95 shadow-lg shadow-brand/25 active:scale-98 transition-all flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              <span>{isProcessing ? 'Placing Order...' : `Confirm Order — ${formatPrice(total)}`}</span>
            </button>
            <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Secured • {isRwanda ? 'MTN MoMo & Airtel • Rwanda' : `International Delivery • ${selectedCountry}`}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, isLoggedIn } = useStore();

  if (!isLoggedIn) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto shadow-inner">
          <LogIn className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold font-display text-foreground">Sign In to Continue</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You need to be signed in to place an order on ZENDO Marketplace. It's free and takes less than a minute.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button onClick={() => onNavigate('/login')}
            className="px-8 py-3 rounded-2xl brand-gradient text-white font-bold shadow-md hover:opacity-95">
            Sign In
          </button>
          <button onClick={() => onNavigate('/register')}
            className="px-8 py-3 rounded-2xl bg-secondary border border-border text-foreground font-bold hover:bg-border transition-colors">
            Create Account
          </button>
        </div>
        <button onClick={() => onNavigate('/products')}
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-brand">
          ← Continue Shopping
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto">
          <Truck className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-extrabold font-display text-foreground">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground">Add products to your cart before proceeding to checkout.</p>
        <button onClick={() => onNavigate('/products')}
          className="px-8 py-3 rounded-2xl brand-gradient text-white font-bold shadow-md hover:opacity-95">
          Browse Products
        </button>
      </div>
    );
  }

  return <CheckoutForm onNavigate={onNavigate} />;
};
