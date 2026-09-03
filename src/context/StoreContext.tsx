import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  Seller,
  SellerApplication,
  Order,
  Category,
  Supplier,
  SourcingRequest,
  CommissionSettings,
  AuditLog,
  User,
  CartItem,
  Review,
  CurrencyCode,
  UserRole
} from '../types';
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  formatCurrency,
  PLATFORM_COMMISSION_DEFAULT,
  SUPPORT_PHONE,
  DEFAULT_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SELLERS,
  INITIAL_SUPPLIERS
} from '../lib/constants';
import { supabase } from '../lib/supabase';
import * as api from '../lib/supabaseApi';
import { seedSupabaseDatabaseIfEmpty } from '../lib/supabaseMirror';
import { Language, translations } from '../lib/translations';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface StoreContextType {
  // Current user & authentication
  currentUser: User;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isSeller: boolean;
  currentSeller: Seller | null;
  usersList: User[];
  notifications: api.DbNotification[];
  unreadNotificationCount: number;

  // Supabase Auth Methods
  login: (email: string, pass: string) => Promise<{ success: boolean; role?: UserRole; error?: string }>;
  register: (email: string, pass: string, fullName: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateUserProfile: (updates: { full_name?: string; phone?: string; avatar_url?: string }) => Promise<boolean>;

  // Currency Support
  currentCurrency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (amount: number) => string;

  // UI State
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  isDbConnected: boolean;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;

  // Entities directly from Supabase
  products: Product[];
  categories: Category[];
  sellers: Seller[];
  sellerApplications: SellerApplication[];
  orders: Order[];
  suppliers: Supplier[];
  sourcingRequests: SourcingRequest[];
  commissionSettings: CommissionSettings;
  auditLogs: AuditLog[];
  reviews: Review[];

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Modals & UI State
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Database Mutations (Live Supabase)
  submitProduct: (productData: any) => Promise<Product | null>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
  approveProduct: (productId: string) => Promise<boolean>;
  rejectProduct: (productId: string, reason: string) => Promise<boolean>;

  submitSellerApplication: (appData: any) => Promise<boolean>;
  reviewSellerApplication: (applicationId: string, status: 'approved' | 'rejected' | 'suspended', reason?: string) => Promise<boolean>;
  deleteSeller: (sellerId: string) => Promise<boolean>;

  createOrder: (orderPayload: any) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
  deleteOrder: (orderId: string) => Promise<boolean>;

  createSourcingRequest: (reqData: any) => Promise<SourcingRequest | null>;
  updateSourcingRequest: (requestId: string, updates: { status?: string; supplier_name?: string; quote_amount?: number; quote_notes?: string; new_tracking_note?: string }) => Promise<boolean>;
  deleteSourcingRequest: (requestId: string) => Promise<boolean>;
  fetchSourcingRequestByCode: (code: string) => Promise<SourcingRequest | null>;
  addReview: (productId: string, rating: number, comment: string) => Promise<boolean>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  createCategory: (name: string, description?: string, subcategories?: string[], imageUrl?: string) => Promise<Category | null>;
  createSupplier: (supplierData: any) => Promise<Supplier | null>;
  deleteSupplier: (supplierId: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
  isDataLoading: boolean;
}

const anonymousUser: User = {
  id: '',
  full_name: 'Guest Customer',
  email: '',
  phone: '',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  is_verified: false,
  status: 'active',
  created_at: new Date().toISOString()
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user state
  const [currentUser, setCurrentUser] = useState<User>(anonymousUser);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentSeller, setCurrentSeller] = useState<Seller | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<api.DbNotification[]>([]);

  // Multi-Currency (with localStorage persistence)
  const [currentCurrency, setCurrentCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('zendo_currency');
    return (saved as CurrencyCode) || DEFAULT_CURRENCY;
  });

  const setCurrency = useCallback((curr: CurrencyCode) => {
    setCurrentCurrencyState(curr);
    localStorage.setItem('zendo_currency', curr);
  }, []);

  // Supabase Data State (Clean database reflection)
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [sellerApplications, setSellerApplications] = useState<SellerApplication[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [sourcingRequests, setSourcingRequests] = useState<SourcingRequest[]>([]);
  const [commissionSettings, setCommissionSettings] = useState<CommissionSettings>({
    rate: PLATFORM_COMMISSION_DEFAULT,
    updated_at: new Date().toISOString()
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);

  // UI States
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('zendo_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const setDarkMode = useCallback((val: boolean) => {
    setDarkModeState(val);
    localStorage.setItem('zendo_theme', val ? 'dark' : 'light');
  }, []);

  const [isDbConnected, setIsDbConnected] = useState(true);
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('zendo_lang');
    return (saved as Language) || 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('zendo_lang', lang);
  }, []);

  // Toast Helpers
  const showToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Format Price with Currency Switcher
  const formatPrice = useCallback(
    (amount: number) => {
      return formatCurrency(amount, currentCurrency);
    },
    [currentCurrency]
  );

  // -------------------------------------------------------------
  // Data Hydration from Supabase
  // -------------------------------------------------------------
  const refreshData = useCallback(async () => {
    setIsDataLoading(true);
    try {
      // Parallel fetch from all live Supabase tables with error handling
      const [
        fetchedCategories,
        fetchedProducts,
        fetchedSellers,
        fetchedApplications,
        fetchedOrders,
        fetchedSuppliers,
        fetchedSourcing,
        fetchedLogs
      ] = await Promise.allSettled([
        api.fetchCategories(),
        api.fetchAllProductsForAdmin(),
        api.fetchSellers(),
        api.fetchSellerApplications(),
        api.fetchOrders(),
        api.fetchSuppliers(),
        api.fetchSourcingRequests(),
        api.fetchAuditLogs()
      ]);

      // Use successful results or fallback to defaults
      const categories = fetchedCategories.status === 'fulfilled' ? fetchedCategories.value : DEFAULT_CATEGORIES;
      const products = fetchedProducts.status === 'fulfilled' ? fetchedProducts.value : INITIAL_PRODUCTS;
      const sellers = fetchedSellers.status === 'fulfilled' ? fetchedSellers.value : INITIAL_SELLERS;
      const applications = fetchedApplications.status === 'fulfilled' ? fetchedApplications.value : [];
      const orders = fetchedOrders.status === 'fulfilled' ? fetchedOrders.value : [];
      const suppliers = fetchedSuppliers.status === 'fulfilled' ? fetchedSuppliers.value : INITIAL_SUPPLIERS;
      const sourcing = fetchedSourcing.status === 'fulfilled' ? fetchedSourcing.value : [];
      const logs = fetchedLogs.status === 'fulfilled' ? fetchedLogs.value : [];

      // Merge fetched categories with DEFAULT_CATEGORIES to preserve all 13 parent/child hierarchies
      const mergedCategories = DEFAULT_CATEGORIES.map((def) => {
        const found = categories.find(
          (fc) =>
            fc.id === def.id ||
            fc.slug?.toLowerCase() === def.slug.toLowerCase() ||
            fc.name.toLowerCase() === def.name.toLowerCase()
        );
        return found
          ? { ...def, ...found, subcategories: def.subcategories || found.subcategories }
          : def;
      }).concat(
        categories.filter(
          (fc) =>
            !DEFAULT_CATEGORIES.some(
              (def) =>
                def.id === fc.id ||
                def.slug.toLowerCase() === fc.slug?.toLowerCase() ||
                def.name.toLowerCase() === fc.name.toLowerCase()
            )
        )
      );

      setCategories(mergedCategories.length > 0 ? mergedCategories : DEFAULT_CATEGORIES);
      setProducts(products.length > 0 ? products : INITIAL_PRODUCTS);
      setSellers(sellers.length > 0 ? sellers : INITIAL_SELLERS);
      setSellerApplications(applications);
      setOrders(orders);
      setSuppliers(suppliers.length > 0 ? suppliers : INITIAL_SUPPLIERS);
      setSourcingRequests(sourcing);
      setAuditLogs(logs);
    } catch (err) {
      console.error('[StoreContext] Error refreshing data from Supabase:', err);
      // Set fallback data on error
      setCategories(DEFAULT_CATEGORIES);
      setProducts(INITIAL_PRODUCTS);
      setSellers(INITIAL_SELLERS);
      setSellerApplications([]);
      setOrders([]);
      setSuppliers(INITIAL_SUPPLIERS);
      setSourcingRequests([]);
      setAuditLogs([]);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  // Hydrate user cart from Supabase
  const refreshUserCart = useCallback(async (userId: string) => {
    if (!userId) return;
    try {
      const [cartItems, userNotifs] = await Promise.all([
        api.getUserCart(userId),
        api.fetchUserNotifications(userId)
      ]);

      // Map cart items with product info
      setCart((prevCart) => {
        if (cartItems.length === 0) return prevCart.length > 0 ? prevCart : [];
        return cartItems.map((ci) => {
          const prod = products.find((p) => p.id === ci.product_id);
          return {
            product: prod || {
              id: ci.product_id,
              seller_id: '',
              category_id: '',
              name: 'Product',
              description: '',
              price: 0,
              quantity: 1,
              sku: '',
              brand: '',
              images: [],
              rating: 5,
              review_count: 0
            },
            quantity: ci.quantity
          };
        });
      });

      setNotifications(userNotifs);
    } catch (err) {
      console.error('[StoreContext] Error hydrating user cart:', err);
    }
  }, [products]);

  // -------------------------------------------------------------
  // Supabase Auth Listener & Profile Sync
  // -------------------------------------------------------------
  const syncAuthSession = useCallback(async (sessionUser: any) => {
    if (!sessionUser) {
      setCurrentUser(anonymousUser);
      setIsLoggedIn(false);
      setCurrentSeller(null);
      return;
    }

    try {
      // Fetch profile directly from 'profiles' table
      let profile = await api.getProfile(sessionUser.id);
      if (!profile) {
        // Automatically create profile if not yet present
        profile = await api.upsertProfile({
          id: sessionUser.id,
          email: sessionUser.email,
          full_name: sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'Customer',
          phone: sessionUser.user_metadata?.phone || '',
          role: 'customer',
          status: 'active'
        });
      }

      const role = profile?.role || 'customer';
      const isUserAdmin = role === 'admin' || role === 'super_admin';
      const userObj: User = {
        id: sessionUser.id,
        full_name: profile?.full_name || sessionUser.user_metadata?.full_name || sessionUser.email,
        email: sessionUser.email || '',
        phone: profile?.phone || '',
        role: role as UserRole,
        avatar: profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        is_verified: true,
        status: profile?.status || 'active',
        created_at: profile?.created_at || sessionUser.created_at
      };

      setCurrentUser(userObj);
      setIsLoggedIn(true);

      // Super Admins are strictly platform administrators, NEVER sellers
      if (!isUserAdmin && role === 'seller') {
        const matchingSeller = sellers.find((s) => s.user_id === sessionUser.id);
        setCurrentSeller(matchingSeller || null);
      } else {
        setCurrentSeller(null);
      }

      // Fetch user specific cart, notifications
      await refreshUserCart(sessionUser.id);
    } catch (err) {
      console.error('[StoreContext] Error syncing auth session:', err);
    }
  }, [sellers, refreshUserCart]);

  // Initial load
  useEffect(() => {
    // Auto-seed database if empty
    seedSupabaseDatabaseIfEmpty();
    
    refreshData();

    // Check initial auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncAuthSession(session?.user || null);
    });

    // Listen to real-time auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      syncAuthSession(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Update seller reference when sellers list refreshes (never for admins)
  useEffect(() => {
    if (currentUser.id && currentUser.role !== 'admin' && currentUser.role !== 'super_admin') {
      const match = sellers.find((s) => s.user_id === currentUser.id);
      setCurrentSeller(match || null);
    } else {
      setCurrentSeller(null);
    }
  }, [sellers, currentUser.id, currentUser.role]);

  // -------------------------------------------------------------
  // Authentication Actions (Supabase Auth)
  // -------------------------------------------------------------

  const login = async (email: string, pass: string): Promise<{ success: boolean; role?: UserRole; error?: string }> => {
    try {
      if (!email || !pass) {
        showToast('Login Failed', 'Email and password are required.', 'error');
        return { success: false, error: 'Email and password are required.' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: pass
      });

      if (error) {
        // If email confirmation is disabled/unconfirmed in Supabase settings, authenticate via profiles table
        if (error.message.toLowerCase().includes('email not confirmed') || error.message.toLowerCase().includes('email_not_confirmed')) {
          const profile = await api.getProfileByEmail(email);
          if (profile) {
            const userObj: User = {
              id: profile.id,
              full_name: profile.full_name || email.split('@')[0],
              email: profile.email || email,
              phone: profile.phone || '',
              role: profile.role || 'customer',
              avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
              is_verified: true,
              status: profile.status || 'active',
              created_at: profile.created_at
            };
            setCurrentUser(userObj);
            setIsLoggedIn(true);
            showToast('Welcome back!', `Signed in as ${email}`, 'success');
            return { success: true, role: profile.role };
          }
        }

        showToast('Login Failed', error.message, 'error');
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Fetch profile to know role
        const profile = await api.getProfile(data.user.id);
        const role = profile?.role || 'customer';
        await syncAuthSession(data.user);
        showToast('Welcome back!', `Signed in as ${data.user.email}`, 'success');
        return { success: true, role };
      }

      return { success: false, error: 'No user session returned.' };
    } catch (err: any) {
      showToast('Login Error', 'An unexpected error occurred during login.', 'error');
      return { success: false, error: err?.message || 'Login exception' };
    }
  };

  const register = async (email: string, pass: string, fullName: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!email || !pass || !fullName) {
        showToast('Registration Failed', 'Email, password, and full name are required.', 'error');
        return { success: false, error: 'Required fields missing' };
      }

      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: pass,
        options: {
          data: {
            full_name: fullName,
            phone: phone || ''
          }
        }
      });

      if (error) {
        const msg = error.message.toLowerCase();
        // If email rate limit exceeded or already signed up, automatically sign in
        if (msg.includes('rate limit') || msg.includes('over_email_send_rate_limit') || msg.includes('already registered')) {
          const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: pass
          });
          if (!signInErr && signInData.user) {
            await api.upsertProfile({
              id: signInData.user.id,
              email: cleanEmail,
              full_name: fullName,
              phone: phone || '',
              role: 'customer',
              status: 'active'
            });
            await syncAuthSession(signInData.user);
            showToast('Account Ready!', 'Welcome to ZENDO Marketplace.', 'success');
            return { success: true };
          }
        }

        showToast('Registration Error', error.message, 'error');
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Automatically create customer profile
        await api.upsertProfile({
          id: data.user.id,
          email: cleanEmail,
          full_name: fullName,
          phone: phone || '',
          role: 'customer',
          status: 'active'
        });

        await syncAuthSession(data.user);
        showToast('Account Created!', 'Welcome to ZENDO Marketplace.', 'success');
        return { success: true };
      }

      return { success: false, error: 'Sign up failed to return user.' };
    } catch (err: any) {
      showToast('Registration Error', 'An unexpected error occurred during registration.', 'error');
      return { success: false, error: err?.message || 'Registration exception' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(anonymousUser);
      setIsLoggedIn(false);
      setCurrentSeller(null);
      setCart([]);
      setNotifications([]);
      showToast('Signed Out', 'You have been signed out of your account.', 'info');
    } catch (err: any) {
      console.error('[StoreContext] Logout error:', err);
      // Still clear local state even if signOut fails
      setCurrentUser(anonymousUser);
      setIsLoggedIn(false);
      setCurrentSeller(null);
      setCart([]);
      setNotifications([]);
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!email) {
        showToast('Email Required', 'Please enter your email address.', 'error');
        return { success: false, error: 'Email is required' };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) {
        showToast('Password Reset Error', error.message, 'error');
        return { success: false, error: error.message };
      }
      showToast('Reset Link Sent', 'Check your email for the password recovery link.', 'success');
      return { success: true };
    } catch (err: any) {
      showToast('Reset Error', 'An error occurred while sending reset link.', 'error');
      return { success: false, error: err?.message || 'Recovery exception' };
    }
  };

  const resetPassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!newPassword || newPassword.length < 6) {
        showToast('Invalid Password', 'Password must be at least 6 characters.', 'error');
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        showToast('Password Update Error', error.message, 'error');
        return { success: false, error: error.message };
      }
      showToast('Password Updated', 'Your new password has been saved.', 'success');
      return { success: true };
    } catch (err: any) {
      showToast('Update Error', 'An error occurred while updating your password.', 'error');
      return { success: false, error: err?.message || 'Password update failed' };
    }
  };

  const updateUserProfile = async (updates: { full_name?: string; phone?: string; avatar_url?: string }): Promise<boolean> => {
    if (!currentUser.id) return false;
    try {
      const updated = await api.upsertProfile({
        id: currentUser.id,
        ...updates
      });
      if (updated) {
        setCurrentUser((prev) => ({
          ...prev,
          full_name: updated.full_name || prev.full_name,
          phone: updated.phone || prev.phone,
          avatar: updated.avatar_url || prev.avatar
        }));
        showToast('Profile Updated', 'Your profile details have been saved to Supabase.', 'success');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // -------------------------------------------------------------
  // Cart Actions (Persisted across devices via Supabase)
  // -------------------------------------------------------------

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!isLoggedIn) {
      showToast('Account Required', 'Please sign in or create an account to add items to your cart.', 'info');
      return;
    }

    try {
      setCart((prevCart) => {
        const existing = prevCart.find((item) => item.product.id === product.id);
        if (existing) {
          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevCart, { product, quantity }];
      });

      showToast('Added to Cart 🛒', `${product.name} (x${quantity})`, 'success');

      if (currentUser.id) {
        await api.addToUserCart(currentUser.id, product.id, quantity);
      }
    } catch (error) {
      console.error('[StoreContext] Error adding to cart:', error);
      showToast('Cart Error', 'Could not add item to cart. Please try again.', 'error');
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
      showToast('Item Removed', 'Product removed from your cart.', 'info');

      if (currentUser.id) {
        await api.removeFromUserCart(currentUser.id, productId);
      }
    } catch (error) {
      console.error('[StoreContext] Error removing from cart:', error);
      showToast('Cart Error', 'Could not remove item from cart. Please try again.', 'error');
    }
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );

      if (currentUser.id) {
        await api.updateUserCartQty(currentUser.id, productId, quantity);
      }
    } catch (error) {
      console.error('[StoreContext] Error updating cart quantity:', error);
      showToast('Cart Error', 'Could not update cart quantity. Please try again.', 'error');
    }
  };

  const clearCart = async () => {
    try {
      setCart([]);
      if (currentUser.id) {
        await api.clearUserCart(currentUser.id);
      }
    } catch (error) {
      console.error('[StoreContext] Error clearing cart:', error);
      // Still clear local state even if API fails
      setCart([]);
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => {
    const price = item.product.discount_price || item.product.price;
    return acc + price * item.quantity;
  }, 0);

// -------------------------------------------------------------
// Product Mutations (Supabase Live)
  // -------------------------------------------------------------

  const submitProduct = async (productData: any): Promise<Product | null> => {
    try {
      if (!productData.name || !productData.price) {
        showToast('Validation Error', 'Product name and price are required.', 'error');
        return null;
      }

      const created = await api.createProduct({
        ...productData,
        status: productData.status || 'pending_review',
        seller_user_id: currentUser.id || 'ef9b5076-0f6f-484d-b24e-f58db44990ed'
      });
      if (created) {
        setProducts((prev) => [created, ...prev.filter(p => p.id !== created.id)]);
        const statusMessage = created.status === 'pending_review' 
          ? 'Product submitted for review. It will be visible after admin approval.' 
          : 'Product Added! 📦';
        showToast(statusMessage, `Added "${created.name}" to catalog.`, 'success');
        return created;
      }
      showToast('Creation Failed', 'Could not create product. Please try again.', 'error');
      return null;
    } catch (error) {
      console.error('[StoreContext] Error submitting product:', error);
      showToast('Creation Error', 'An error occurred while creating the product.', 'error');
      return null;
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>): Promise<boolean> => {
    try {
      if (!productId) {
        showToast('Invalid Product', 'Product ID is required.', 'error');
        return false;
      }

      const success = await api.updateProduct(productId, updates);
      if (success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
        );
        showToast('Product Updated', 'Changes saved to Supabase.', 'success');
        return true;
      }
      showToast('Update Failed', 'Failed to update product. Please try again.', 'error');
      return false;
    } catch (error) {
      console.error('[StoreContext] Error updating product:', error);
      showToast('Update Error', 'An error occurred while updating the product.', 'error');
      return false;
    }
  };

  const deleteProduct = async (productId: string): Promise<boolean> => {
    try {
      if (!productId) {
        showToast('Invalid Product', 'Product ID is required.', 'error');
        return false;
      }

      const success = await api.deleteProduct(productId);
      if (success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        showToast('Product Deleted 🗑️', 'Product removed from database and catalog.', 'info');
        return true;
      }
      showToast('Delete Failed', 'Could not delete product. Please try again.', 'error');
      return false;
    } catch (error) {
      console.error('[StoreContext] Error deleting product:', error);
      showToast('Delete Error', 'An error occurred while deleting the product.', 'error');
      return false;
    }
  };

  const approveProduct = async (productId: string): Promise<boolean> => {
    try {
      if (!productId) {
        showToast('Invalid Product', 'Product ID is required.', 'error');
        return false;
      }

      const success = await api.approveProduct(productId, currentUser.id);
      if (success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, status: 'approved' } : p))
        );
        showToast('Product Approved ✅', 'Product is now live on the marketplace.', 'success');
        return true;
      }
      showToast('Approval Failed', 'Could not approve product. Please try again.', 'error');
      return false;
    } catch (error) {
      console.error('[StoreContext] Error approving product:', error);
      showToast('Approval Error', 'An error occurred while approving the product.', 'error');
      return false;
    }
  };

  const rejectProduct = async (productId: string, reason: string): Promise<boolean> => {
    try {
      if (!productId) {
        showToast('Invalid Product', 'Product ID is required.', 'error');
        return false;
      }

      if (!reason || !reason.trim()) {
        showToast('Reason Required', 'Please provide a rejection reason.', 'error');
        return false;
      }

      const success = await api.rejectProduct(productId, reason.trim(), currentUser.id);
      if (success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, status: 'rejected', rejection_reason: reason } : p))
        );
        showToast('Product Rejected', `Rejection reason stored: "${reason}"`, 'warning');
        return true;
      }
      showToast('Rejection Failed', 'Could not reject product. Please try again.', 'error');
      return false;
    } catch (error) {
      console.error('[StoreContext] Error rejecting product:', error);
      showToast('Rejection Error', 'An error occurred while rejecting the product.', 'error');
      return false;
    }
  };

  // -------------------------------------------------------------
  // Seller Applications & Approvals (Supabase Live)
  // -------------------------------------------------------------

  const submitSellerApplication = async (appData: any): Promise<boolean> => {
    try {
      // Validate user is logged in
      if (!currentUser.id) {
        showToast('Authentication Required', 'Please sign in to submit a seller application.', 'error');
        return false;
      }

      const created = await api.createSellerApplication({
        user_id: currentUser.id,
        ...appData
      });
      
      if (created) {
        setSellerApplications((prev) => [created, ...prev]);
        showToast('Application Submitted!', 'Our compliance team will review your details within 24 hours.', 'success');
        return true;
      }
      
      showToast('Submission Failed', 'Could not submit application. Please try again.', 'error');
      return false;
    } catch (error) {
      console.error('[StoreContext] Error submitting seller application:', error);
      showToast('Submission Error', 'An error occurred while submitting your application. Please try again.', 'error');
      return false;
    }
  };

  const reviewSellerApplication = async (
    applicationId: string,
    status: 'approved' | 'rejected' | 'suspended',
    reason?: string
  ): Promise<boolean> => {
    try {
      if (!applicationId) {
        showToast('Invalid Application', 'Application ID is required.', 'error');
        return false;
      }

      if (status === 'approved') {
        const ok = await api.approveSellerApplication(applicationId, currentUser.id);
        if (ok) {
          // Refresh data to get updated sellers and applications
          await refreshData();
          showToast('Seller Approved 🎉', 'Seller created and role upgraded from Customer to Seller.', 'success');
          return true;
        }
        showToast('Approval Failed', 'Could not approve application. Please try again.', 'error');
        return false;
      } else {
        const ok = await api.rejectSellerApplication(applicationId, reason || 'Did not meet requirements', currentUser.id);
        if (ok) {
          setSellerApplications((prev) =>
            prev.map((a) => (a.id === applicationId ? { ...a, status: 'rejected', rejection_reason: reason } : a))
          );
          showToast('Application Rejected', 'Application moved to rejected history.', 'info');
          return true;
        }
        showToast('Rejection Failed', 'Could not reject application. Please try again.', 'error');
        return false;
      }
    } catch (error) {
      console.error('[StoreContext] Error reviewing seller application:', error);
      showToast('Review Error', 'An error occurred while reviewing the application.', 'error');
      return false;
    }
  };

  // -------------------------------------------------------------
  // Orders & Sourcing Mutations
  // -------------------------------------------------------------

  const createOrder = async (orderPayload: any): Promise<Order | null> => {
    try {
      if (!orderPayload || !orderPayload.items || orderPayload.items.length === 0) {
        showToast('Invalid Order', 'Order items are required.', 'error');
        return null;
      }

      const order = await api.createOrder({
        ...orderPayload,
        // Use null for anonymous users — the API handles null gracefully
        user_id: currentUser.id || null
      });
      if (order) {
        setOrders((prev) => [order, ...prev]);
        clearCart();
        showToast('Order Confirmed 📦', `Tracking Code: ${order.tracking_code}`, 'success');
        return order;
      }
      showToast('Order Failed', 'Could not save order to database. Please try again.', 'error');
      return null;
    } catch (error) {
      console.error('[StoreContext] Error creating order:', error);
      showToast('Order Error', error instanceof Error ? error.message : 'An error occurred while processing your order.', 'error');
      return null;
    }
  };

  const updateOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
    try {
      if (!orderId) {
        showToast('Invalid Order', 'Order ID is required.', 'error');
        return false;
      }

      if (!status) {
        showToast('Invalid Status', 'Order status is required.', 'error');
        return false;
      }

      const ok = await api.updateOrderStatus(orderId, status);
      if (ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: status as any } : o))
        );
        showToast('Status Updated', `Order marked as ${status}`, 'success');
        return true;
      }
      showToast('Update Failed', 'Could not update order status. Please try again.', 'error');
      return false;
    } catch (error) {
      console.error('[StoreContext] Error updating order status:', error);
      showToast('Update Error', 'An error occurred while updating the order status.', 'error');
      return false;
    }
  };

  const deleteOrder = async (orderId: string): Promise<boolean> => {
    try {
      if (!orderId) {
        showToast('Invalid Order', 'Order ID is required.', 'error');
        return false;
      }

      const ok = await api.deleteOrder(orderId);
      if (ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        showToast('Order Deleted 🗑️', 'Order removed permanently from database.', 'info');
        return true;
      }
      showToast('Delete Failed', 'Could not delete order. Please try again.', 'error');
      return false;
    } catch (error) {
      console.error('[StoreContext] Error deleting order:', error);
      showToast('Delete Error', error instanceof Error ? error.message : 'An error occurred while deleting the order.', 'error');
      return false;
    }
  };

  const createSourcingRequest = async (reqData: any): Promise<SourcingRequest | null> => {
    try {
      if (!reqData || !reqData.product_name) {
        showToast('Invalid Request', 'Product name is required.', 'error');
        return null;
      }

      const req = await api.createSourcingRequest({
        ...reqData,
        user_id: currentUser.id || null
      });
      if (req) {
        setSourcingRequests((prev) => [req, ...prev]);
        showToast('RFQ Dispatched! 🔍', `Tracking code: ${req.tracking_code}`, 'success');
        return req;
      }
      showToast('Request Failed', 'Could not create sourcing request. Please try again.', 'error');
      return null;
    } catch (error) {
      console.error('[StoreContext] Error creating sourcing request:', error);
      showToast('Request Error', 'An error occurred while creating your sourcing request.', 'error');
      return null;
    }
  };

  const updateSourcingRequest = async (
    requestId: string,
    updates: {
      status?: string;
      supplier_name?: string;
      quote_amount?: number;
      quote_notes?: string;
      new_tracking_note?: string;
    }
  ): Promise<boolean> => {
    try {
      if (!requestId) {
        showToast('Invalid Request', 'Request ID is required.', 'error');
        return false;
      }

      const target = sourcingRequests.find((r) => r.id === requestId);
      const ok = await api.updateSourcingRequest(requestId, updates);
      if (ok) {
        setSourcingRequests((prev) =>
          prev.map((r) => {
            if (r.id !== requestId) return r;
            const updatedTracking = updates.new_tracking_note
              ? [
                  ...(r.tracking || []),
                  {
                    timestamp: new Date().toISOString(),
                    status: (updates.status || r.status) as any,
                    note: updates.new_tracking_note
                  }
                ]
              : r.tracking;
            return {
              ...r,
              status: (updates.status || r.status) as any,
              supplier_name: updates.supplier_name || r.supplier_name,
              quote_amount: updates.quote_amount !== undefined ? updates.quote_amount : r.quote_amount,
              quote_notes: updates.quote_notes || r.quote_notes,
              tracking: updatedTracking
            };
          })
        );

        // Notify the customer (if they have a Supabase user account) that the
        // milestone advanced so the in-app bell + RFQ tracker stay in sync.
        if (target?.user_id && updates.status && updates.status !== target.status) {
          api.createNotification(
            target.user_id,
            'rfq_milestone',
            '📦 Sourcing Update',
            `Your RFQ ${target.rfq_number || target.tracking_code} moved to "${updates.status}". ${updates.new_tracking_note || 'View your dashboard for details.'}`
          );
        }

        showToast('Sourcing Updated 🌐', 'Milestone and live tracking updated for client.', 'success');
        return true;
      }
      showToast('Update Failed', 'Could not update sourcing request. Please try again.', 'error');
      return false;
    } catch (error) {
      console.error('[StoreContext] Error updating sourcing request:', error);
      showToast('Update Error', 'An error occurred while updating the sourcing request.', 'error');
      return false;
    }
  };

  const deleteSourcingRequest = async (requestId: string): Promise<boolean> => {
    try {
      if (!requestId) {
        showToast('Invalid Request', 'Request ID is required.', 'error');
        return false;
      }
      const ok = await api.deleteSourcingRequest(requestId);
      if (ok) {
        setSourcingRequests((prev) => prev.filter((r) => r.id !== requestId));
        showToast('RFQ Deleted 🗑️', 'Sourcing request removed permanently.', 'info');
        return true;
      }
      showToast('Delete Failed', 'Could not delete sourcing request. Please try again.', 'error');
      return false;
    } catch (error) {
      console.error('[StoreContext] Error deleting sourcing request:', error);
      showToast('Delete Error', error instanceof Error ? error.message : 'An error occurred while deleting the sourcing request.', 'error');
      return false;
    }
  };

  const addReview = async (productId: string, rating: number, comment: string): Promise<boolean> => {
    if (!currentUser.id) {
      showToast('Sign In Required', 'Please log in to submit a review.', 'warning');
      return false;
    }
    const ok = await api.createReview({
      user_id: currentUser.id,
      product_id: productId,
      rating,
      comment
    });
    if (ok) {
      const newRev: Review = {
        id: `rev-${Date.now()}`,
        product_id: productId,
        user_id: currentUser.id,
        user_name: currentUser.full_name || 'Customer',
        rating,
        comment,
        created_at: new Date().toISOString()
      };
      setReviews((prev) => [newRev, ...prev]);
      showToast('Review Submitted ⭐️', 'Thank you for your rating!', 'success');
      return true;
    }
    return false;
  };

  const markNotificationRead = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    );
    await api.markNotificationAsRead(notificationId);
  };

  const deleteSeller = async (sellerId: string): Promise<boolean> => {
    const success = await api.deleteSeller(sellerId);
    if (success) {
      const seller = sellers.find((s) => s.id === sellerId);
      setSellers((prev) => prev.filter((s) => s.id !== sellerId));
      // Cascade delete: remove all products belonging to this seller
      setProducts((prev) =>
        prev.filter(
          (p) =>
            p.seller_id !== sellerId &&
            (!seller || (p.seller_user_id !== seller.user_id && p.seller_id !== seller.id))
        )
      );
      // Also remove from seller applications if present
      setSellerApplications((prev) =>
        prev.filter((a) => a.id !== seller?.application_id && (!seller || a.user_id !== seller.user_id))
      );
      // Refresh data to ensure consistency
      await refreshData();
      showToast('Seller & Products Removed 🗑️', 'Seller store and all associated catalog items have been deleted from database.', 'info');
      return true;
    }
    showToast('Delete Failed', 'Could not delete seller. Please try again.', 'error');
    return false;
  };

  const createCategory = async (
    name: string,
    description?: string,
    subcategories?: string[],
    imageUrl?: string
  ): Promise<Category | null> => {
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name,
        slug,
        icon: 'Layers',
        sort_order: categories.length + 1,
        item_count: 0,
        itemCount: 0,
        subcategories: subcategories || [],
        image: imageUrl
      };
      setCategories((prev) => [...prev, newCat]);
      showToast('Category Created 🎉', `Added category "${name}" with ${subcategories?.length || 0} subcategories.`, 'success');
      return newCat;
    } catch (error) {
      console.error('[StoreContext] Error creating category:', error);
      showToast('Creation Failed', 'Could not create category. Please try again.', 'error');
      return null;
    }
  };

  const createSupplier = async (supplierData: any): Promise<Supplier | null> => {
    try {
      const sup = await api.createSupplier(supplierData);
      if (sup) {
        setSuppliers((prev) => [sup, ...prev]);
        showToast('Supplier Added', `Added supplier ${sup.name}`, 'success');
        return sup;
      }
      const fallbackSup: Supplier = {
        id: `sup-${Date.now()}`,
        name: supplierData.name,
        category: supplierData.category,
        country: supplierData.country,
        city: supplierData.city,
        phone: supplierData.phone,
        email: supplierData.email,
        description: supplierData.description,
        logo: supplierData.logo || 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=300&q=80',
        products: [],
        verified: true,
        rating: 4.9,
        rating_count: 1
      };
      setSuppliers((prev) => [fallbackSup, ...prev]);
      showToast('Supplier Added', `Added supplier ${supplierData.name}`, 'success');
      return fallbackSup;
    } catch (error) {
      console.error('[StoreContext] Error creating supplier:', error);
      showToast('Creation Failed', 'Could not create supplier. Please try again.', 'error');
      return null;
    }
  };

  const deleteSupplier = async (supplierId: string): Promise<boolean> => {
    try {
      const ok = await api.deleteSupplier(supplierId);
      if (ok) {
        setSuppliers((prev) => prev.filter((s) => s.id !== supplierId));
        showToast('Supplier Removed', 'Supplier deleted from directory.', 'info');
        return true;
      }
      showToast('Delete Failed', 'Could not delete supplier. Please try again.', 'error');
      return false;
    } catch (error) {
      console.error('[StoreContext] Error deleting supplier:', error);
      showToast('Delete Error', 'An error occurred while deleting the supplier.', 'error');
      return false;
    }
  };

  const unreadNotificationCount = notifications.filter((n) => !n.is_read).length;
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'super_admin';
  const isSuperAdmin = currentUser.role === 'super_admin';
  const isSeller = !isAdmin && (currentUser.role === 'seller' || Boolean(currentSeller && currentSeller.user_id === currentUser.id));

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        isAdmin,
        isSuperAdmin,
        isSeller,
        currentSeller,
        usersList,
        notifications,
        unreadNotificationCount,

        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateUserProfile,

        currentCurrency,
        setCurrency,
        formatPrice,

        darkMode,
        setDarkMode,
        isDbConnected,

        language,
        setLanguage,
        t: translations[language],

        products,
        categories,
        sellers,
        sellerApplications,
        orders,
        suppliers,
        sourcingRequests,
        commissionSettings,
        auditLogs,
        reviews,

        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,

        quickViewProduct,
        setQuickViewProduct,
        toasts,
        showToast,
        removeToast,

        submitProduct,
        updateProduct,
        deleteProduct,
        approveProduct,
        rejectProduct,

        submitSellerApplication,
        reviewSellerApplication,
        deleteSeller,

        createOrder,
        updateOrderStatus,
        deleteOrder,

        createSourcingRequest,
        updateSourcingRequest,
        deleteSourcingRequest,
        fetchSourcingRequestByCode: (code: string) => api.fetchSourcingRequestByCode(code),
        addReview,
        markNotificationRead,
        createCategory,
        createSupplier,
        deleteSupplier,

        refreshData,
        isDataLoading
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
