import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { fetchSourcingRequestByCode } from '../lib/supabaseApi';
import { RFQ_PIPELINE, getMilestoneIndex } from '../lib/rfq';
import { Search, Truck, CheckCircle2, Globe, Clock, PackageCheck, AlertCircle, FileText } from 'lucide-react';

interface TrackPageProps {
  initialCode?: string;
  onNavigate: (route: string) => void;
}

type TrackResult =
  | { kind: 'order'; data: any }
  | { kind: 'rfq'; data: any }
  | null;

export const TrackPage: React.FC<TrackPageProps> = ({ initialCode, onNavigate }) => {
  const { orders, formatPrice } = useStore();
  const [searchCode, setSearchCode] = useState(initialCode || '');
  const [result, setResult] = useState<TrackResult>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!searchCode.trim()) return;
    const code = searchCode.trim().toUpperCase();

    const matchOrder = orders.find(
      (o) =>
        o.tracking_code.toLowerCase() === code ||
        o.id.toLowerCase() === code ||
        (o.order_number && o.order_number.toLowerCase() === code)
    );
    if (matchOrder) {
      setResult({ kind: 'order', data: matchOrder });
      setNotFound(false);
      return;
    }

    fetchSourcingRequestByCode(code).then((rfq) => {
      if (rfq) {
        setResult({ kind: 'rfq', data: rfq });
        setNotFound(false);
      } else {
        setResult(null);
        setNotFound(true);
      }
    });
  }, [searchCode, orders]);

  const handleTrack = () => setSearchCode(searchCode);

  const orderSteps = [
    { key: 'pending_payment', label: 'Payment Pending' },
    { key: 'paid', label: 'Payment Escrow Verified' },
    { key: 'confirmed', label: 'Order Confirmed' },
    { key: 'processing', label: 'Processing at Global Hub' },
    { key: 'ready', label: 'Customs Clearance Ready' },
    { key: 'shipped', label: 'In Transit / Air Freight Dispatched' },
    { key: 'delivered', label: 'Delivered to Recipient' }
  ];

  const getOrderStepIndex = (status: string) => {
    const idx = orderSteps.findIndex((s) => s.key === status);
    return idx === -1 ? 1 : idx;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold">
          <Globe className="w-3.5 h-3.5" />
          <span>Cross-Border Logistics & RFQ Tracking</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-foreground">
          Track Your Order or Sourcing RFQ
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          Enter your order tracking code, RFQ number, or SHK code to view live progress.
        </p>

        <div className="max-w-md mx-auto pt-2 flex gap-2">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            placeholder="ZND-EXP-… or ZND-RFQ-… or SHK-…"
            className="flex-1 px-4 py-3 rounded-2xl bg-card border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand font-mono"
          />
          <button
            onClick={handleTrack}
            className="px-6 py-3 rounded-2xl brand-gradient text-white font-bold text-xs shadow-md shadow-brand/20"
          >
            Track
          </button>
        </div>
      </div>

      {result?.kind === 'order' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xl space-y-8 text-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-border">
            <div>
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-secondary text-brand">
                {result.data.tracking_code}
              </span>
              <h2 className="text-xl font-bold font-display mt-2">
                Destination: {result.data.customer_name} ({result.data.city || result.data.country || 'International Hub'})
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">{result.data.delivery_address || result.data.address}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Declared Value</span>
              <span className="text-lg font-extrabold font-display text-brand">{formatPrice(result.data.total)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              International Delivery Stages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {orderSteps.map((s, idx) => {
                const currentIdx = getOrderStepIndex(result.data.status);
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

          <div className="pt-4 border-t border-border space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Manifest Cargo Contents
            </h3>
            {result.data.items.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="font-semibold">{item.name} (x{item.quantity})</span>
                <span className="font-mono font-bold text-foreground">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {result?.kind === 'rfq' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xl space-y-8 text-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {result.data.rfq_number && (
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-brand/10 text-brand">
                    {result.data.rfq_number}
                  </span>
                )}
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-secondary text-foreground">
                  {result.data.tracking_code}
                </span>
              </div>
              <h2 className="text-xl font-bold font-display mt-2">{result.data.product_name}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {result.data.quantity} {result.data.unit} • {result.data.country}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Target Budget</span>
              <span className="text-lg font-extrabold font-display text-brand">
                {result.data.budget ? formatPrice(result.data.budget) : 'Open Quote'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Sourcing Milestone Progress
            </h3>
            <div className="space-y-3">
              {RFQ_PIPELINE.map((milestone) => {
                const currentIdx = getMilestoneIndex(result.data.status);
                const idx = RFQ_PIPELINE.findIndex((m) => m.status === milestone.status);
                const isDone = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                const Icon =
                  milestone.icon === 'document' ? FileText :
                  milestone.icon === 'search' ? Search :
                  milestone.icon === 'quote' ? PackageCheck :
                  milestone.icon === 'approved' ? CheckCircle2 :
                  milestone.icon === 'shipping' ? Truck :
                  milestone.icon === 'delivered' ? MapPin :
                  Clock;
                return (
                  <div
                    key={milestone.status}
                    className={`flex items-start gap-3 text-xs rounded-2xl p-3 border transition-all ${
                      isCurrent
                        ? 'bg-brand/5 border-brand/30'
                        : isDone
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-secondary/30 border-border opacity-70'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isDone || isCurrent ? 'bg-brand text-white shadow-sm shadow-brand/20' : 'bg-secondary text-muted-foreground border border-border'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {milestone.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{milestone.description}</p>
                    </div>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-brand font-bold shrink-0 uppercase">Active</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-border space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Milestone Log
            </h3>
            <div className="space-y-2">
              {(result.data.tracking || []).map((step: any, idx: number) => (
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
      )}

      {notFound && (
        <div className="p-8 rounded-3xl bg-secondary/30 border border-border text-center space-y-2 text-xs text-muted-foreground">
          <AlertCircle className="w-8 h-8 text-brand mx-auto opacity-70" />
          <p className="font-bold text-foreground">No record found for this code</p>
          <p>Double-check your RFQ number or tracking code and try again.</p>
          <p className="text-[10px]">Sample codes: <span className="font-mono">ZND-RFQ-123456</span> or <span className="font-mono">SHK-123456</span></p>
        </div>
      )}
    </div>
  );
};
