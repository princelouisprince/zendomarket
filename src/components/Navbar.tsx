import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  Moon,
  Sun,
  ChevronDown,
  Layers,
  ShieldAlert,
  Store,
  Package,
  ArrowRight,
  ArrowLeft,
  LogOut,
  LogIn,
  Globe,
  Check,
  User,
  UserPlus,
  MapPin,
  Coins,
} from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';
import { SUPPORT_PHONE, CURRENCIES } from '../lib/constants';
import { Language } from '../lib/translations';
import { CurrencyCode } from '../types';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onGoBack?: () => void;
  canGoBack?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate, onGoBack, canGoBack }) => {
  const {
    currentUser,
    isLoggedIn,
    isAdmin,
    isSeller,
    logout,
    cartCount,
    wishlist,
    products,
    categories,
    darkMode,
    setDarkMode,
    currentCurrency,
    setCurrency,
  } = useStore();

  const { language, setLanguage, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
      if (languageRef.current && !languageRef.current.contains(e.target as Node)) {
        setShowLanguageDropdown(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setShowCurrencyDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      onNavigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const LANGUAGES: { code: Language; label: string; name: string }[] = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'fr', label: 'FR', name: 'Français' },
    { code: 'rw', label: 'KN', name: 'Kinyarwanda' },
    { code: 'sw', label: 'KS', name: 'Kiswahili' },
  ];

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const activeCurrencyConfig = CURRENCIES[currentCurrency] || CURRENCIES.RWF;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md transition-colors">

      {/* ── Top utility bar ─────────────────────────────────────────── */}
      <div className="bg-secondary/70 border-b border-border/50 text-[11px] py-1.5 px-4 sm:px-8 flex items-center justify-between text-muted-foreground">
        {/* Left: Location badge */}
        <span className="flex items-center gap-1.5 font-semibold text-foreground">
          <MapPin className="w-3.5 h-3.5 text-brand" />
          <span>Kigali, Rwanda · <span className="text-muted-foreground font-normal">{SUPPORT_PHONE}</span></span>
        </span>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Multi-Currency Selector Dropdown */}
          <div ref={currencyRef} className="relative">
            <button
              id="currency-selector-btn"
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-brand/10 hover:bg-brand/20 border border-brand/25 font-bold text-brand transition-colors cursor-pointer"
            >
              <span>{activeCurrencyConfig.code} ({activeCurrencyConfig.symbol})</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showCurrencyDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-xl shadow-2xl p-1.5 z-50 animate-slide-up space-y-0.5 max-h-72 overflow-y-auto">
                <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {t.common.currency}
                </div>
                {Object.values(CURRENCIES).map((curr) => (
                  <button
                    key={curr.code}
                    id={`currency-option-${curr.code}`}
                    onClick={() => {
                      setCurrency(curr.code as CurrencyCode);
                      setShowCurrencyDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      currentCurrency === curr.code
                        ? 'bg-brand/10 text-brand font-bold'
                        : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    <span className="font-medium text-left truncate mr-2">{curr.name}</span>
                    <span className="font-mono text-muted-foreground font-semibold text-[11px] shrink-0">
                      {curr.code} ({curr.symbol})
                    </span>
                    {currentCurrency === curr.code && <Check className="w-3.5 h-3.5 text-brand ml-1.5 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div ref={languageRef} className="relative">
            <button
              id="language-selector-btn"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg hover:bg-secondary border border-transparent hover:border-border font-bold text-foreground transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-brand" />
              <span>{currentLang.label}</span>
              <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showLanguageDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-xl shadow-2xl p-1.5 z-50 animate-slide-up space-y-0.5">
                <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {t.common.language}
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    id={`lang-option-${lang.code}`}
                    onClick={() => {
                      setLanguage(lang.code as Language);
                      setShowLanguageDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                      language === lang.code
                        ? 'bg-brand/10 text-brand font-bold'
                        : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-bold font-mono text-[11px] px-1.5 py-0.5 rounded bg-muted text-brand">{lang.label}</span>
                      <span>{lang.name}</span>
                    </span>
                    {language === lang.code && <Check className="w-3.5 h-3.5 text-brand" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Theme"
            className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── Main Navigation ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center gap-4">

        {/* Back button */}
        {canGoBack && currentRoute !== '/' && (
          <button
            onClick={onGoBack}
            aria-label="Go back"
            title="Go back"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-secondary text-foreground hover:bg-border/60 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        {/* Logo */}
        <div
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <img
            src="/logo.png"
            alt="ZENDO - Building Value. Empowering Growth."
            className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </div>

        {/* Categories dropdown */}
        <div className="relative hidden lg:block shrink-0">
          <button
            id="categories-btn"
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary text-foreground text-xs font-semibold hover:bg-border/60 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-brand" />
            <span>{t.nav.categories}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} />
          </button>

          {showCategoryMenu && (
            <div
              className="absolute top-full left-0 mt-2 w-[620px] p-4 bg-card border border-border rounded-2xl shadow-2xl z-50 animate-slide-up max-h-[80vh] overflow-y-auto space-y-2"
              onMouseLeave={() => setShowCategoryMenu(false)}
            >
              <div className="px-2 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between border-b border-border pb-2 mb-2">
                <span>Browse All Categories ({categories.length})</span>
                <button
                  onClick={() => { setShowCategoryMenu(false); onNavigate('/products'); }}
                  className="text-brand hover:underline font-bold"
                >
                  View All Products →
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => {
                  const realCount = products.filter(
                    (p) =>
                      p.category_id === cat.id ||
                      p.category_name.toLowerCase() === cat.name.toLowerCase() ||
                      p.category_id?.toLowerCase() === cat.slug?.toLowerCase()
                  ).length;

                  return (
                    <div
                      key={cat.id}
                      className="p-2.5 rounded-xl border border-border/60 hover:border-brand/40 bg-secondary/30 hover:bg-secondary/70 transition-all group"
                    >
                      <button
                        onClick={() => {
                          setShowCategoryMenu(false);
                          onNavigate(`/products?category=${cat.id}`);
                        }}
                        className="w-full flex items-center gap-2.5 text-left cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-secondary group-hover:bg-brand/10 text-muted-foreground group-hover:text-brand flex items-center justify-center transition-colors shrink-0">
                          <CategoryIcon name={cat.icon} className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground group-hover:text-brand truncate">
                            {cat.name}
                          </p>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {realCount} {t.home.items}
                          </span>
                        </div>
                      </button>

                      {/* Subcategories list */}
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="mt-2 pt-1.5 border-t border-border/40 flex flex-wrap gap-1">
                          {cat.subcategories.slice(0, 4).map((sub, i) => (
                            <button
                              key={i}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowCategoryMenu(false);
                                onNavigate(`/products?category=${cat.id}&subcategory=${encodeURIComponent(sub)}`);
                              }}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-card hover:bg-brand/10 text-muted-foreground hover:text-brand transition-colors truncate max-w-[120px]"
                            >
                              {sub}
                            </button>
                          ))}
                          {cat.subcategories.length > 4 && (
                            <span className="text-[9px] text-muted-foreground self-center">
                              +{cat.subcategories.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Search bar */}
        <div ref={searchRef} className="relative flex-1 hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="main-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder={t.nav.searchPlaceholder}
              className="w-full pl-10 pr-24 py-2.5 text-xs rounded-2xl bg-secondary/80 border border-border focus:bg-background focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-foreground placeholder:text-muted-foreground transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl brand-gradient text-white text-xs font-semibold hover:opacity-90 shadow-sm transition-opacity cursor-pointer"
            >
              {t.common.search}
            </button>
          </form>

          {/* Autocomplete */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl p-2 z-50 animate-slide-up">
              <div className="p-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {t.common.searchResults}
              </div>
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setShowSearchDropdown(false);
                    onNavigate(`/product/${product.id}`);
                  }}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary cursor-pointer transition-colors"
                >
                  <img
                    src={product.images[0]}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover bg-secondary"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-foreground truncate">{product.name}</h4>
                    <p className="text-[11px] text-brand font-medium">{product.category_name}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Nav links + Auth ─────────────────────────────── */}
        <div className="flex items-center gap-1 shrink-0">

          {/* Desktop nav links */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-muted-foreground">
            {/* Shop / Marketplace */}
            <button
              onClick={() => onNavigate('/products')}
              className={`px-3 py-2 rounded-xl hover:bg-secondary hover:text-foreground transition-colors cursor-pointer ${
                currentRoute === '/products' || currentRoute.startsWith('/products?') ? 'text-brand bg-brand/5 font-bold' : ''
              }`}
            >
              Shop / Marketplace
            </button>

            {/* Become a Seller (with Shop icon in front) - Hidden for Admin, Dashboard for Seller */}
            {isAdmin ? null : isSeller ? (
              <button
                onClick={() => onNavigate('/seller/dashboard')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-secondary hover:text-foreground transition-colors cursor-pointer ${
                  currentRoute.startsWith('/seller') ? 'text-brand bg-brand/5 font-bold' : ''
                }`}
              >
                <Store className="w-3.5 h-3.5 text-brand" />
                <span>Seller Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('/become-seller')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-secondary hover:text-foreground transition-colors cursor-pointer ${
                  currentRoute === '/become-seller' ? 'text-brand bg-brand/5 font-bold' : ''
                }`}
              >
                <Store className="w-3.5 h-3.5 text-brand" />
                <span>Become a Seller</span>
              </button>
            )}

            {/* Source a Product */}
            <button
              onClick={() => onNavigate('/sourcing')}
              className={`px-3 py-2 rounded-xl hover:bg-secondary hover:text-foreground transition-colors cursor-pointer ${
                currentRoute === '/sourcing' || currentRoute.startsWith('/sourcing?') ? 'text-brand bg-brand/5 font-bold' : ''
              }`}
            >
              Source a Product
            </button>

            {/* Find Suppliers (Sellers and Admins only) */}
            {(isSeller || isAdmin) && (
              <button
                onClick={() => onNavigate('/suppliers')}
                className={`px-3 py-2 rounded-xl hover:bg-secondary hover:text-foreground transition-colors cursor-pointer ${
                  currentRoute === '/suppliers' || currentRoute.startsWith('/suppliers?') ? 'text-brand bg-brand/5 font-bold' : ''
                }`}
              >
                Find Suppliers
              </button>
            )}

            {/* About */}
            <button
              onClick={() => onNavigate('/about')}
              className={`px-3 py-2 rounded-xl hover:bg-secondary hover:text-foreground transition-colors cursor-pointer ${
                currentRoute === '/about' ? 'text-brand bg-brand/5 font-bold' : ''
              }`}
            >
              About
            </button>
          </nav>

          {/* Divider */}
          <span className="hidden xl:block w-px h-5 bg-border mx-1" />

          {/* Cart */}
          <button
            id="cart-btn"
            onClick={() => onNavigate('/cart')}
            aria-label="Shopping Cart"
            className="relative p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] px-1 rounded-full brand-gradient text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth: Login + Sign Up OR User dropdown */}
          {isLoggedIn ? (
            <div ref={userMenuRef} className="relative ml-1">
              <button
                id="user-menu-btn"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl hover:bg-secondary border border-border/80 transition-colors cursor-pointer"
              >
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="" className="w-7 h-7 rounded-xl object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-xl bg-brand/10 text-brand flex items-center justify-center font-bold text-xs">
                    {currentUser.full_name.charAt(0)}
                  </div>
                )}
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-foreground leading-none truncate max-w-[100px]">
                    {currentUser.full_name.split(' ')[0]}
                  </p>
                  <span className="text-[10px] font-bold text-brand uppercase tracking-wider">
                    {isAdmin ? 'SUPER ADMIN' : isSeller ? 'SELLER' : 'CUSTOMER'}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 p-3 bg-card border border-border rounded-2xl shadow-2xl z-50 animate-slide-up space-y-2 text-foreground">
                  <div className="p-2 border-b border-border">
                    <p className="text-xs font-bold text-foreground">{currentUser.full_name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-brand/10 text-brand">
                      {isAdmin ? '🛡️ SUPER ADMIN' : isSeller ? '🏪 SELLER' : '👤 CUSTOMER'}
                    </span>
                  </div>
                  <div className="space-y-1 pt-1">
                    <button
                      onClick={() => { setShowUserDropdown(false); onNavigate('/account'); }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl bg-brand/5 hover:bg-brand/15 text-brand text-xs font-bold transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      <span>{t.nav.profile}</span>
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => { setShowUserDropdown(false); onNavigate('/super-admin'); }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>Super Admin</span>
                      </button>
                    )}
                    {!isAdmin && isSeller && (
                      <button
                        onClick={() => { setShowUserDropdown(false); onNavigate('/seller'); }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-secondary text-foreground text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Store className="w-4 h-4 text-brand" />
                        <span>{t.seller.dashboard}</span>
                      </button>
                    )}
                    <button
                      onClick={() => { setShowUserDropdown(false); onNavigate('/orders'); }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-secondary text-foreground text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span>{t.common.myOrders}</span>
                    </button>
                    <button
                      onClick={() => { setShowUserDropdown(false); onNavigate('/wishlist'); }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-secondary text-foreground text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-muted-foreground" />
                      <span>{t.common.myWishlist}</span>
                    </button>
                    <button
                      onClick={() => { setShowUserDropdown(false); logout(); }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-rose-500/10 text-rose-500 text-xs font-bold transition-colors border-t border-border mt-1 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.nav.logout}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 ml-1">
              <button
                id="login-btn"
                onClick={() => onNavigate('/login')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-foreground text-xs font-semibold hover:bg-secondary transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.auth.signIn}</span>
              </button>
              <button
                id="signup-btn"
                onClick={() => onNavigate('/register')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl brand-gradient text-white text-xs font-bold shadow-sm shadow-brand/20 hover:opacity-95 transition-opacity cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t.auth.signUp}</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-secondary xl:hidden text-foreground ml-1 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ─────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-card border-b border-border px-5 py-5 space-y-4 animate-slide-up">
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.nav.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </form>

          {/* Mobile nav grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => { setMobileMenuOpen(false); onNavigate('/products'); }}
              className="p-3 rounded-xl bg-secondary text-left hover:bg-border/60 transition-colors flex items-center gap-2"
            >
              <span>🛍️ Shop / Marketplace</span>
            </button>

            {isAdmin ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('/super-admin'); }}
                className="p-3 rounded-xl brand-gradient text-white text-left font-bold"
              >
                🛡️ Super Admin
              </button>
            ) : isSeller ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('/seller'); }}
                className="p-3 rounded-xl bg-brand/10 text-brand text-left font-bold flex items-center gap-1.5"
              >
                <Store className="w-4 h-4 text-brand" />
                <span>Seller Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('/become-seller'); }}
                className="p-3 rounded-xl bg-secondary text-left hover:bg-border/60 transition-colors flex items-center gap-1.5"
              >
                <Store className="w-4 h-4 text-brand" />
                <span>Become a Seller</span>
              </button>
            )}

            <button
              onClick={() => { setMobileMenuOpen(false); onNavigate('/sourcing'); }}
              className="p-3 rounded-xl bg-secondary text-left hover:bg-border/60 transition-colors"
            >
              ✨ Source a Product
            </button>

            {(isSeller || isAdmin) && (
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('/suppliers'); }}
                className="p-3 rounded-xl bg-secondary text-left hover:bg-border/60 transition-colors"
              >
                🏢 Find Suppliers
              </button>
            )}

            <button
              onClick={() => { setMobileMenuOpen(false); onNavigate('/about'); }}
              className="p-3 rounded-xl bg-secondary text-left hover:bg-border/60 transition-colors col-span-2 text-center"
            >
              ℹ️ About ZENDO
            </button>
          </div>

          {/* Mobile Currency & Language row */}
          <div className="flex gap-2 pt-2 border-t border-border">
            {/* Currency selector */}
            <div className="flex-1">
              <label className="text-[10px] text-muted-foreground font-semibold block mb-1">{t.common.currency}</label>
              <select
                value={currentCurrency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full text-xs p-2 rounded-xl bg-secondary border border-border text-foreground font-semibold"
              >
                {Object.values(CURRENCIES).map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Language selector */}
            <div className="flex-1">
              <label className="text-[10px] text-muted-foreground font-semibold block mb-1">{t.common.language}</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full text-xs p-2 rounded-xl bg-secondary border border-border text-foreground font-semibold"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label} - {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile auth */}
          {!isLoggedIn && (
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('/login'); }}
                className="flex-1 py-2.5 rounded-xl border border-border text-foreground text-xs font-semibold hover:bg-secondary transition-colors flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                {t.auth.signIn}
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('/register'); }}
                className="flex-1 py-2.5 rounded-xl brand-gradient text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {t.auth.signUp}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
