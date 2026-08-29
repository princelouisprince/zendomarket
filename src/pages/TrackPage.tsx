import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Truck, CheckCircle2, Globe, Clock, PackageCheck, AlertCircle } from 'lucide-react';

interface TrackPageProps {
  initialCode?: string;
  onNavigate: (route: string) => void;
}

export const TrackPage: React.FC<TrackPageProps> = ({ initialCode, onNavigate }) => {
  const { orders, formatPrice } = useStore();
  const [searchCode, setSearchCode] = useState(initialCode || '');

  const matchedOrder = orders.find(
    (o) =>
      o.tracking_code.toLowerCase() === searchCode.trim().toLowerCase() ||
      o.id.toLowerCase() === searchCode.trim().toLowerCase() ||
      (o.order_number && o.order_number.toLowerCase() === searchCode.trim().toLowerCase())
  );

  const steps = [
    { key: 'pending_payment', label: 'Payment Pending' },
    { key: 'paid', label: 'Payment Escrow Verified' },
    { key: 'confirmed', label: 'Order Confirmed' },
    { key: 'processing', label: 'Processing at Global Hub' },
    { key: 'ready', label: 'Customs Clearance Ready' },
    { key: 'shipped', label: 'In Transit / Air Freight Dispatched' },
    { key: 'delivered', label: 'Delivered to Recipient' }
  ];

  const getStepIndex = (status: string) => {
    const idx = steps.findIndex((s) => s.key === status);
    return idx === -1 ? 1 : idx;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold">
          <Globe className="w-3.5 h-3.5" />
          <span>Cross-Border Logistics Tracking</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-foreground">
          Track Your Global Shipment
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          Enter your Zendo international tracking code (e.g. ZND-EXP-90214) to view live flight and courier milestones
        </p>

        {/* Search input */}
        <div className="max-w-md mx-auto pt-2 flex gap-2">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Enter tracking code (e.g. ZND-EXP-90214)"
            className="flex-1 px-4 py-3 rounded-2xl bg-card border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand font-mono"
          />
          <button
            onClick={() => {}}
            className="px-6 py-3 rounded-2xl brand-gradient text-white font-bold text-xs shadow-md shadow-brand/20"
          >
            Track
          </button>
        </div>
      </div>

      {matchedOrder ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xl space-y-8 text-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-border">
            <div>
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-secondary text-brand">
                {matchedOrder.tracking_code}
              </span>
              <h2 className="text-xl font-bold font-display mt-2">
                Destination: {matchedOrder.customer_name} ({matchedOrder.city || matchedOrder.country || 'International Hub'})
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">{matchedOrder.delivery_address || matchedOrder.address}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Declared Value</span>
              <span className="text-lg font-extrabold font-display text-brand">{formatPrice(matchedOrder.total)}</span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              International Delivery Stages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {steps.map((s, idx) => {
                const currentIdx = getStepIndex(matchedOrder.status);
                const isDone = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div
                    key={s.key}
                    className={`p-4 rounded-2xl border flex flex-col justify-between gap-2 text-xs transition-all ${
                      isCurrent
                        ? 'brand-gradient text-white shadow-md ring-2 ring-brand'
                        : isDone
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-secondary/40 border-border text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono">STAGE 0{idx + 1}</span>
                      {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <span className="font-semibold text-xs leading-tight">{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Item List */}
          <div className="pt-4 border-t border-border space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Manifest Cargo Contents
            </h3>
            {matchedOrder.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="font-semibold">{item.name} (x{item.quantity})</span>
                <span className="font-mono font-bold text-foreground">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-secondary/30 border border-border text-center space-y-2 text-xs text-muted-foreground">
          <p>Sample tracking code: <strong className="text-foreground font-mono">ZND-EXP-90214</strong></p>
        </div>
      )}
    </div>
  );
};
