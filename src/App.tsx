import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AIAssistant } from './components/AIAssistant';
import { QuickViewModal } from './components/QuickViewModal';
import { ToastContainer } from './components/Toast';
import { AuthRequiredModal } from './components/AuthRequiredModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { BecomeSellerPage } from './pages/BecomeSellerPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { WishlistPage } from './pages/WishlistPage';
import { SourcingPage } from './pages/SourcingPage';
import { TrackPage } from './pages/TrackPage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { SuperAdminPage } from './pages/SuperAdminPage';
import { AuthPages } from './pages/AuthPages';

export const MainApp: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const { darkMode } = useStore();

  // Apply/remove .dark class on <html> so Tailwind dark: variants work
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute]);

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
  };

  const renderRoute = () => {
    // Route matching
    if (currentRoute === '/') {
      return <HomePage onNavigate={handleNavigate} />;
    }

    if (currentRoute.startsWith('/products')) {
      const urlParams = new URLSearchParams(currentRoute.split('?')[1] || '');
      const category = urlParams.get('category') || undefined;
      const subcategory = urlParams.get('subcategory') || undefined;
      const search = urlParams.get('search') || undefined;
      return (
        <ProductsPage
          initialCategory={category}
          initialSubcategory={subcategory}
          initialSearch={search}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentRoute.startsWith('/product/')) {
      const productId = currentRoute.replace('/product/', '').split('?')[0];
      return <ProductDetailPage productId={productId} onNavigate={handleNavigate} />;
    }

    if (currentRoute === '/about') {
      return <AboutPage onNavigate={handleNavigate} />;
    }

    if (currentRoute === '/suppliers') {
      return <SuppliersPage onNavigate={handleNavigate} />;
    }

    if (currentRoute === '/become-seller') {
      return <BecomeSellerPage onNavigate={handleNavigate} />;
    }

    if (currentRoute === '/cart') {
      return <CartPage onNavigate={handleNavigate} />;
    }

    if (currentRoute === '/checkout') {
      return <CheckoutPage onNavigate={handleNavigate} />;
    }

    if (currentRoute === '/orders') {
      return <OrdersPage onNavigate={handleNavigate} />;
    }

    if (currentRoute === '/wishlist') {
      return <WishlistPage onNavigate={handleNavigate} />;
    }

    if (currentRoute === '/sourcing') {
      return <SourcingPage onNavigate={handleNavigate} />;
    }

    if (currentRoute.startsWith('/track')) {
      const urlParams = new URLSearchParams(currentRoute.split('?')[1] || '');
      const code = urlParams.get('code') || undefined;
      return <TrackPage initialCode={code} onNavigate={handleNavigate} />;
    }

    if (currentRoute === '/seller/dashboard' || currentRoute === '/seller') {
      return <SellerDashboardPage onNavigate={handleNavigate} />;
    }

    if (currentRoute === '/admin') {
      return <AdminDashboardPage />;
    }

    if (currentRoute === '/account') {
      return <CustomerDashboardPage onNavigate={handleNavigate} />;
    }

    if (currentRoute === '/super-admin') {
      return <SuperAdminPage onNavigate={handleNavigate} />;
    }

    if (currentRoute === '/login') {
      return <AuthPages initialMode="login" onNavigate={handleNavigate} />;
    }

    if (currentRoute === '/register') {
      return <AuthPages initialMode="register" onNavigate={handleNavigate} />;
    }

    if (currentRoute === '/forgot-password') {
      return <AuthPages initialMode="forgot" onNavigate={handleNavigate} />;
    }

    // Default fallback
    return <HomePage onNavigate={handleNavigate} />;
  };

  const isAuthPage =
    currentRoute === '/login' ||
    currentRoute === '/register' ||
    currentRoute === '/forgot-password';

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      {!isAuthPage && <Navbar currentRoute={currentRoute} onNavigate={handleNavigate} />}
      
      <main className="flex-1">
        {renderRoute()}
      </main>

      {!isAuthPage && <Footer onNavigate={handleNavigate} />}

      {/* Global Interactive Widgets */}
      <WhatsAppButton />
      {!isAuthPage && <AIAssistant onNavigate={handleNavigate} />}
      <QuickViewModal onNavigate={handleNavigate} />
      <AuthRequiredModal onNavigate={handleNavigate} />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <StoreProvider>
        <MainApp />
      </StoreProvider>
    </LanguageProvider>
  );
}
