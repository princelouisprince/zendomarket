import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  ArrowRight,
  Search,
  ShieldCheck,
  Globe,
  Truck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Store,
  Layers,
} from 'lucide-react';

interface HeroSliderProps {
  onNavigate: (route: string) => void;
}

const SLIDES = [
  {
    id: 1,
    image: '/hero/hero-slide-1.png',
    gradientOverlay: 'from-black/90 via-black/75 to-black/85',
  },
  {
    id: 2,
    image: '/hero/hero-slide-2.png',
    gradientOverlay: 'from-[#020b1e]/90 via-[#071330]/80 to-[#020b1e]/90',
  },
  {
    id: 3,
    image: '/hero/hero-slide-3.png',
    gradientOverlay: 'from-[#0a0f1d]/90 via-[#0f172a]/80 to-[#0a0f1d]/90',
  },
  {
    id: 4,
    image: '/hero/hero-slide-4.png',
    gradientOverlay: 'from-[#051124]/90 via-[#0a1b38]/80 to-[#051124]/90',
  },
];

export const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSearch, setHeroSearch] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const slideIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto slide effect
  useEffect(() => {
    if (isPaused) return;
    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => {
      if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    };
  }, [isPaused]);

  const handlePrev = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  const handleNext = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      onNavigate(`/products?search=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  return (
    <section
      className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-2xl border border-white/10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slide Images with Ambient Dark Overlay */}
      <div className="relative min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] w-full overflow-hidden bg-slate-950 flex flex-col justify-between">
        {SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
              } transform transition-transform duration-1000`}
            >
              <img
                src={slide.image}
                alt="ZENDO Marketplace Hero"
                className="w-full h-full object-cover object-center brightness-75"
              />
              <div className={`absolute inset-0 bg-gradient-to-b ${slide.gradientOverlay}`} />
              <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/80" />
            </div>
          );
        })}

        {/* Content Container - Clean & Centered */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-14 text-white flex flex-col justify-between flex-1">
          {/* Top Slide Indicators */}
          <div className="flex items-center justify-end gap-2">
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/15">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'w-6 bg-brand' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Centered Main Content Area */}
          <div className="text-center space-y-6 sm:space-y-7 my-auto py-4 animate-fade-in flex flex-col items-center">
            {/* Page Title / H1 */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-display tracking-tight text-white drop-shadow-2xl select-none">
              {t.hero.title}
            </h1>

            {/* Tagline (subheading below H1) */}
            <p className="text-base sm:text-xl md:text-2xl text-slate-100 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow px-2">
              {t.hero.subtitle}
            </p>

            {/* Short Punch Line Highlight */}
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-brand/20 border border-brand/40 text-brand-light backdrop-blur-md text-xs sm:text-sm font-semibold tracking-wide shadow-lg shadow-brand/10">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{t.hero.punchline}</span>
            </div>

            {/* Centered Global Search Bar */}
            <form
              onSubmit={handleSearch}
              className="w-full max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 bg-white/15 p-2 rounded-2xl backdrop-blur-xl border border-white/25 shadow-2xl mt-1"
            >
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-white/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder={t.hero.heroSearchPlaceholder}
                  className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-xl bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand font-medium"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl brand-gradient text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand/25 transition-all hover:opacity-95 active:scale-95 shrink-0 cursor-pointer"
              >
                <span>{t.hero.heroSearchBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* 4 Action CTA Buttons (Horizontal on desktop, stacked/grid on mobile) */}
            <div className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {/* 1. Shop Products */}
              <button
                onClick={() => onNavigate('/products')}
                className="group flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl brand-gradient text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand/25 hover:shadow-brand/40 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer border border-white/20"
              >
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">{t.hero.shopProducts}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              {/* 2. Become a Seller */}
              <button
                onClick={() => onNavigate('/become-seller')}
                className="group flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
              >
                <Store className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">{t.hero.becomeSeller}</span>
              </button>

              {/* 3. Source a Product */}
              <button
                onClick={() => onNavigate('/sourcing')}
                className="group flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">{t.hero.sourceProduct}</span>
              </button>

              {/* 4. Find Suppliers */}
              <button
                onClick={() => onNavigate('/suppliers')}
                className="group flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
              >
                <Truck className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">{t.hero.findSuppliers}</span>
              </button>
            </div>
          </div>

          {/* Bottom Badges & Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/15 text-xs text-white/80">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.hero.trustEscrow}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{t.hero.trustShipping}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>{t.hero.trustReturn}</span>
              </div>
            </div>

            {/* Slide Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white border border-white/20 backdrop-blur-md transition-all active:scale-90 cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white border border-white/20 backdrop-blur-md transition-all active:scale-90 cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
