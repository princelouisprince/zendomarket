import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryIcon } from '../components/CategoryIcon';
import { HeroSlider } from '../components/HeroSlider';
import {
  ArrowRight,
  Flame,
  Clock,
  Store,
  ChevronRight,
  Globe,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { products, categories, suppliers } = useStore();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'featured' | 'deals' | 'new'>('featured');

  // Precompute real product counts per category
  const categoryProductCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      if (p.category_id) {
        counts[p.category_id] = (counts[p.category_id] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  // Countdown timer for Flash Deals
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter((p) => p.featured);
  const dealProducts = products.filter((p) => (p.discount_price || 0) > 0);
  const newArrivals = [...products].reverse().slice(0, 4);

  const displayedProducts =
    activeTab === 'featured'
      ? featuredProducts.slice(0, 4)
      : activeTab === 'deals'
      ? dealProducts.slice(0, 4)
      : newArrivals;

  return (
    <div className="space-y-16 animate-fade-in pb-12">
      {/* 1. Dynamic 3D Hero Slideshow */}
      <HeroSlider onNavigate={onNavigate} />

      {/* 2. Global Categories Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display">
              {t.home.popularCategories}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {t.home.popularCategoriesSubtitle}
            </p>
          </div>
          <button
            onClick={() => onNavigate('/products')}
            className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"
          >
            <span>{t.home.exploreAll} ({categories.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const count = products.filter(
              (p) =>
                p.category_id === cat.id ||
                p.category_name.toLowerCase() === cat.name.toLowerCase() ||
                p.category_id?.toLowerCase() === cat.slug?.toLowerCase()
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() => onNavigate(`/products?category=${cat.id}`)}
                className="group p-4 rounded-2xl border border-border bg-card card-hover-lift flex flex-col items-center text-center gap-3 transition-all cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary group-hover:bg-brand/10 text-muted-foreground group-hover:text-brand flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm">
                  <CategoryIcon name={cat.icon} className="w-7 h-7" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-foreground group-hover:text-brand transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {count} {t.home.items}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Global Flash Deals of the Day with Countdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground flex items-center gap-2">
                  {t.home.flashDeals}
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                    HOT SALE
                  </span>
                </h2>
                <p className="text-xs text-muted-foreground">{t.home.flashDealsSubtitle}</p>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Clock className="w-4 h-4 text-brand" />
              <span>{t.home.promotionEndsIn}</span>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-secondary text-foreground font-bold text-xs">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="px-2.5 py-1 rounded-lg bg-secondary text-foreground font-bold text-xs">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="px-2.5 py-1 rounded-lg bg-secondary text-foreground font-bold text-xs">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
            {dealProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive Tabs: Featured / Top Discounts / New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display">
              {t.home.trendingCatalog}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t.home.trendingCatalogSubtitle}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-secondary border border-border self-start">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'featured' ? 'brand-gradient text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.home.tabFeatured}
            </button>
            <button
              onClick={() => setActiveTab('deals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'deals' ? 'brand-gradient text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.home.tabDeals}
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'new' ? 'brand-gradient text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.home.tabNew}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* 5. International Promotional Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dark Banner: Become a Global Seller */}
        <div className="rounded-3xl p-8 sm:p-10 brand-dark-banner relative overflow-hidden shadow-xl flex flex-col justify-between gap-6">
          <div className="space-y-3 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold">
              <Store className="w-3.5 h-3.5" />
              <span>{t.home.merchantHub}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-white">
              {t.home.merchantHubTitle}
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              {t.home.merchantHubSubtitle}
            </p>
          </div>

          <div className="z-10 pt-2 flex items-center gap-3">
            <button
              onClick={() => onNavigate('/become-seller')}
              className="px-6 py-3 rounded-xl brand-gradient text-white font-bold text-xs sm:text-sm hover:opacity-90 transition-all shadow-md shadow-brand/20 active:scale-95"
            >
              {t.home.applyMerchant}
            </button>
            <button
              onClick={() => onNavigate('/about')}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
            >
              {t.home.learnMore}
            </button>
          </div>
        </div>

        {/* Brand Gradient Banner: Global Factory Sourcing (RFQ) */}
        <div className="rounded-3xl p-8 sm:p-10 brand-gradient text-white relative overflow-hidden shadow-xl flex flex-col justify-between gap-6">
          <div className="space-y-3 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
              <Globe className="w-3.5 h-3.5 text-cyan-200" />
              <span>{t.home.rfqBadge}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
              {t.home.rfqTitle1} <br />
              <span className="text-cyan-200">{t.home.rfqTitle2}</span>
            </h3>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              {t.home.rfqSubtitle}
            </p>
          </div>

          <div className="z-10 pt-2">
            <button
              onClick={() => onNavigate('/sourcing')}
              className="px-6 py-3 rounded-xl bg-white text-brand-dark font-extrabold text-xs sm:text-sm hover:bg-slate-100 transition-all shadow-lg active:scale-95 flex items-center gap-2"
            >
              <span>{t.home.submitRfq}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. International Verified Suppliers Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display">
              {t.home.suppliersTitle}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {t.home.suppliersSubtitle}
            </p>
          </div>
          <button
            onClick={() => onNavigate('/suppliers')}
            className="text-xs font-bold text-brand hover:underline flex items-center gap-1"
          >
            <span>{t.home.viewDirectory} ({suppliers.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {suppliers.map((sup) => (
            <div
              key={sup.id}
              onClick={() => onNavigate('/suppliers')}
              className="p-5 rounded-2xl border border-border bg-card card-hover-lift flex flex-col justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={sup.logo}
                  alt={sup.name}
                  className="w-12 h-12 rounded-xl object-cover bg-secondary shrink-0 border border-border"
                />
                <div>
                  <h4 className="font-bold text-xs text-foreground font-display leading-tight line-clamp-1">
                    {sup.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{sup.city}, {sup.country}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    ✓ {t.home.verifiedPartner}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {sup.description}
              </p>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-brand font-semibold">
                <span>{sup.category}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
