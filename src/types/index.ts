export type UserRole = 'admin' | 'super_admin' | 'seller' | 'user' | 'buyer' | 'customer' | 'guest';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  seller_id?: string;
  avatar?: string;
  country?: string;
  is_verified?: boolean;
  status?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category_id: string;
  category_name: string;
  price: number; // Base price in USD
  discount_price?: number;
  images: string[];
  quantity: number;
  sku: string;
  brand: string;
  weight?: string;
  dimensions?: string;
  color?: string;
  material?: string;
  condition?: string;
  status: 'approved' | 'suspended' | 'pending_review' | 'rejected';
  featured: boolean;
  rating: number;
  review_count: number;
  seller_id: string;
  seller_name: string;
  seller_user_id: string;
  rejection_reason?: string;
  created_at?: string;
}

export interface Seller {
  id: string;
  user_id: string;
  business_name?: string;
  store_name: string;
  description: string;
  logo: string;
  cover: string;
  phone: string;
  email: string;
  country?: string;
  city?: string;
  state_province?: string;
  district?: string;
  sector?: string;
  address: string;
  status: 'active' | 'pending' | 'suspended';
  verified: boolean;
  rating: number;
  rating_count: number;
  payment_phone_or_code?: string;
  payment_account_name?: string;
  payment_method?: string;
  application_id?: string;
  created_at?: string;
}

export interface SellerApplication {
  id: string;
  user_id?: string;
  business_name: string;
  full_name: string;
  phone: string;
  email: string;
  description?: string;
  business_description?: string;
  business_location?: string;
  country?: string;
  categories?: string[];
  payment_phone_or_code?: string;
  payment_account_name?: string;
  payment_method?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  notes?: string;
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  seller_user_id: string;
  image?: string;
  color?: string;
}

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'confirmed'
  | 'processing'
  | 'ready'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  user_id?: string;
  order_number?: string;
  tracking_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_name?: string;
  delivery_phone?: string;
  delivery_address?: string;
  country?: string;
  state_province?: string;
  city?: string;
  postal_code?: string;
  items: OrderItem[];
  seller_ids: string[];
  subtotal: number;
  delivery_fee: number;
  total_amount?: number;
  total: number;
  currency?: string;
  status: OrderStatus;
  payment_method:
    | 'Credit/Debit Card (Stripe)'
    | 'PayPal'
    | 'Apple Pay / Google Pay'
    | 'International Wire Transfer / SWIFT'
    | 'Global Mobile Money'
    | 'Cash on Delivery / Escrow';
  payment_status: 'pending' | 'paid' | 'failed';
  district?: string;
  sector?: string;
  address: string;
  delivery_instructions?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  sort_order: number;
  image?: string;
  item_count?: number;
  itemCount?: number;
  subcategories?: string[];
  parent_id?: string;
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  city: string;
  category: string;
  phone: string;
  email: string;
  logo: string;
  description: string;
  products: string[];
  verified: boolean;
  rating: number;
  rating_count: number;
}

export type SourcingStatus =
  | 'requested'
  | 'searching'
  | 'quoted'
  | 'approved'
  | 'paid'
  | 'quality_check'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface SourcingTrackingStep {
  status: string;
  timestamp: string;
  note: string;
}

export interface SourcingRequest {
  id: string;
  tracking_code: string;
  user_id?: string; // Add user_id for personalization
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  product_name: string;
  quantity: number;
  unit: string;
  country: string;
  budget: number;
  description: string;
  status: SourcingStatus;
  supplier_id?: string;
  supplier_name?: string;
  quote_amount?: number;
  quote_notes?: string;
  tracking: SourcingTrackingStep[];
  admin_notes?: string;
  created_at: string;
}

export interface CommissionSettings {
  id?: string;
  rate: number;
  updated_at?: string;
  updated_by?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user_name: string;
  target?: string;
  timestamp?: string;
  user_id?: string;
  entity_type?: string;
  entity_id?: string;
  details?: any;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id?: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'RWF' | 'KES';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  exchangeRateFromUSD: number; // 1 USD = X in this currency
  formatDecimals: number;
}
