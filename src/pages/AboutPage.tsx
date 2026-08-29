import React from 'react';
import { SUPPORT_PHONE, SUPPORT_WHATSAPP_LINK } from '../lib/constants';
import { ShieldCheck, Truck, Sparkles, Building2, Users, ArrowRight, Heart } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in space-y-16">
      {/* Hero Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-bold">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>About Zendo Marketplace</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-foreground leading-tight">
          Building Value. <br />
          <span className="brand-gradient-text">Empowering Growth.</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Zendo Marketplace is Rwanda’s premiere digital commerce bridge connecting local merchants, East African manufacturers, and valued consumers across the continent.
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-card border border-border card-hover-lift space-y-4">
          <div className="w-12 h-12 rounded-2xl brand-gradient text-white flex items-center justify-center font-bold text-xl shadow-md shadow-brand/20">
            01
          </div>
          <h3 className="text-lg font-bold font-display text-foreground">Empowering Local Vendors</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We provide Rwandan retailers, craftspeople, and distributors with institutional digital infrastructure, instant Mobile Money payments, and nationwide delivery reach.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-card border border-border card-hover-lift space-y-4">
          <div className="w-12 h-12 rounded-2xl brand-gradient text-white flex items-center justify-center font-bold text-xl shadow-md shadow-brand/20">
            02
          </div>
          <h3 className="text-lg font-bold font-display text-foreground">Shaka Igicuruzwa Sourcing</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Can’t find specialized machinery or high-tech gear in Kigali? Our regional sourcing network procures directly from verified factories in Kenya, Uganda, Tanzania, and global hubs.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-card border border-border card-hover-lift space-y-4">
          <div className="w-12 h-12 rounded-2xl brand-gradient text-white flex items-center justify-center font-bold text-xl shadow-md shadow-brand/20">
            03
          </div>
          <h3 className="text-lg font-bold font-display text-foreground">Trust & Security First</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every vendor undergoes verification. All payments via MTN MoMo, Airtel, and Card are protected under the Zendo Buyer Shield until delivery satisfaction.
          </p>
        </div>
      </div>

      {/* Key Numbers */}
      <div className="p-10 rounded-3xl brand-dark-banner text-white grid grid-cols-2 md:grid-cols-4 gap-8 text-center shadow-xl">
        <div>
          <span className="text-3xl sm:text-4xl font-black font-display text-brand-light">30</span>
          <p className="text-xs text-white/80 mt-1 font-medium">Rwanda Districts Covered</p>
        </div>
        <div>
          <span className="text-3xl sm:text-4xl font-black font-display text-amber-400">100%</span>
          <p className="text-xs text-white/80 mt-1 font-medium">Verified Merchant Quality</p>
        </div>
        <div>
          <span className="text-3xl sm:text-4xl font-black font-display text-emerald-400">20+</span>
          <p className="text-xs text-white/80 mt-1 font-medium">Product Categories</p>
        </div>
        <div>
          <span className="text-3xl sm:text-4xl font-black font-display text-cyan-300">24/7</span>
          <p className="text-xs text-white/80 mt-1 font-medium">WhatsApp & Hotline Support</p>
        </div>
      </div>

      {/* Contact & CTA Section */}
      <div className="rounded-3xl p-8 sm:p-12 brand-gradient text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
            Ready to partner with Zendo Marketplace?
          </h3>
          <p className="text-xs sm:text-sm text-white/90">
            Whether you want to sell products or need specialized regional sourcing, our Kigali team is here for you.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            onClick={() => onNavigate('/become-seller')}
            className="px-6 py-3.5 rounded-2xl bg-white text-brand-dark font-extrabold text-xs sm:text-sm hover:bg-slate-100 transition-all shadow-md active:scale-95"
          >
            Open a Store
          </button>
          <a
            href={SUPPORT_WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all border border-white/30"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
