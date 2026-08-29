import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORT_PHONE, SUPPORT_EMAIL } from '../lib/constants';
import { ShieldCheck, Truck, Headphones, RotateCcw, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-secondary/40 border-t border-border mt-20 text-foreground transition-colors">
      {/* Trust Badges Banner */}
      <div className="border-b border-border/80 py-10 bg-background/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl brand-gradient text-white flex items-center justify-center shrink-0 shadow-md shadow-brand/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm font-display">{t.footer.trust1Title}</h4>
              <p className="text-xs text-muted-foreground">{t.footer.trust1Desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl brand-gradient text-white flex items-center justify-center shrink-0 shadow-md shadow-brand/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm font-display">{t.footer.trust2Title}</h4>
              <p className="text-xs text-muted-foreground">{t.footer.trust2Desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl brand-gradient text-white flex items-center justify-center shrink-0 shadow-md shadow-brand/20">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm font-display">{t.footer.trust3Title}</h4>
              <p className="text-xs text-muted-foreground">{t.footer.trust3Desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl brand-gradient text-white flex items-center justify-center shrink-0 shadow-md shadow-brand/20">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm font-display">{t.footer.trust4Title}</h4>
              <p className="text-xs text-muted-foreground">{t.footer.trust4Desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Official Brand Logo & Vision */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="ZENDO"
              className="h-12 w-auto object-contain cursor-pointer"
              onClick={() => onNavigate('/')}
            />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
            {t.footer.brandDescription}
          </p>
          <div className="pt-2 text-xs space-y-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand shrink-0" />
              <span>{t.footer.headquarters}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand shrink-0" />
              <span>{t.footer.phoneSupport}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand shrink-0" />
              <span>{SUPPORT_EMAIL}</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm font-display text-foreground">{t.footer.marketplaceTitle}</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li>
              <button onClick={() => onNavigate('/products')} className="hover:text-brand transition-colors text-left">
                {t.footer.allProductsCatalog}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/suppliers')} className="hover:text-brand transition-colors text-left">
                {t.footer.verifiedSuppliers}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/sourcing')} className="hover:text-brand transition-colors text-left">
                {t.footer.factorySourcingRfq}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/track')} className="hover:text-brand transition-colors text-left">
                {t.footer.trackOrderStatus}
              </button>
            </li>
          </ul>
        </div>

        {/* Sell & Partner */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm font-display text-foreground">{t.footer.merchantHubTitle}</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li>
              <button onClick={() => onNavigate('/become-seller')} className="hover:text-brand transition-colors text-left">
                {t.footer.applyVerifiedSeller}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/seller')} className="hover:text-brand transition-colors text-left">
                {t.footer.sellerOperationsHub}
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/about')} className="hover:text-brand transition-colors text-left">
                {t.footer.aboutZendoRwanda}
              </button>
            </li>
          </ul>
        </div>

        {/* Payment & Security */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm font-display text-foreground">{t.footer.acceptedPaymentsTitle}</h4>
          <p className="text-xs text-muted-foreground">
            {t.footer.acceptedPaymentsDesc}
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-semibold text-muted-foreground">
            <span className="px-2.5 py-1 rounded-lg bg-card border border-border text-amber-600 font-bold">{t.footer.momoPayment}</span>
            <span className="px-2.5 py-1 rounded-lg bg-card border border-border text-red-600 font-bold">{t.footer.airtelPayment}</span>
            <span className="px-2.5 py-1 rounded-lg bg-card border border-border">{t.footer.visaPayment}</span>
            <span className="px-2.5 py-1 rounded-lg bg-card border border-border">{t.footer.mastercardPayment}</span>
            <span className="px-2.5 py-1 rounded-lg bg-card border border-border">{t.footer.cashOnDelivery}</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/80 py-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} {t.footer.allRightsReservedText}</p>
      </div>
    </footer>
  );
};
