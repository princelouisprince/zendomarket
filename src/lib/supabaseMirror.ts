import { supabase, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from './supabase';
export { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY };
import {
  Product,
  Seller,
  SellerApplication,
  Order,
  Category,
  Supplier,
  SourcingRequest,
  CommissionSettings,
  AuditLog
} from '../types';
import {
  DEFAULT_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SELLERS,
  INITIAL_SUPPLIERS,
  INITIAL_SOURCING_REQUESTS,
  INITIAL_ORDERS
} from './constants';

export interface TableSyncReport {
  tableName: string;
  count: number;
  status: 'synced' | 'failed' | 'pending';
  message: string;
  lastSyncedAt?: string;
}

export interface FullSyncResult {
  success: boolean;
  timestamp: string;
  reports: TableSyncReport[];
}

/**
 * Fetch rows directly from a Supabase table with error handling
 */
export async function fetchTableFromSupabase<T = any>(tableName: string): Promise<{ data: T[] | null; error?: string }> {
  try {
    const { data, error } = await supabase.from(tableName).select('*');
    if (error) {
      console.warn(`[Supabase Direct] Error fetching "${tableName}":`, error.message);
      return { data: null, error: error.message };
    }
    return { data: (data as T[]) || [] };
  } catch (err: any) {
    console.warn(`[Supabase Direct] Network exception on table "${tableName}":`, err?.message || err);
    return { data: null, error: err?.message || 'Network exception' };
  }
}

/**
 * Format & adapt payload for Supabase PostgreSQL schema
 */
function adaptPayloadForSupabase(tableName: string, rawItems: any[]) {
  return rawItems.map((item) => {
    const copy = { ...item };

    if (tableName === 'sellers') {
      copy.business_name = copy.business_name || copy.store_name || 'Global Seller';
      copy.store_name = copy.store_name || copy.business_name || 'Global Seller';
      copy.user_id = copy.user_id || '976d1d09-c8bd-4d57-916e-f68a3e1e9337';
      copy.address = copy.address || `${copy.city || 'Global Hub'}, ${copy.country || 'International'}`;
    }

    if (tableName === 'orders') {
      copy.order_number = copy.order_number || copy.tracking_code || `ORD-${Date.now()}`;
      copy.delivery_name = copy.delivery_name || copy.customer_name || 'Customer';
      copy.delivery_phone = copy.delivery_phone || copy.customer_phone || '+1 (800) 842-9363';
      copy.delivery_address = copy.delivery_address || copy.address || 'International Express Terminal';
      copy.total_amount = copy.total_amount || copy.total || 0;
      copy.total = copy.total || copy.total_amount || 0;
      copy.user_id = copy.user_id || '976d1d09-c8bd-4d57-916e-f68a3e1e9337';
    }

    if (tableName === 'seller_applications') {
      copy.user_id = copy.user_id || '976d1d09-c8bd-4d57-916e-f68a3e1e9337';
      copy.business_description = copy.business_description || copy.description || '';
      delete copy.categories;
      delete copy.business_location;
      delete copy.description;
    }

    if (tableName === 'products') {
      copy.seller_id = copy.seller_id || 'b0a3249f-897c-4274-a956-8b23acbb6249';
      if (Array.isArray(copy.images)) {
        copy.images = copy.images;
      }
    }

    if (tableName === 'sourcing_requests') {
      if (!copy.tracking || !Array.isArray(copy.tracking)) {
        copy.tracking = [];
      }
    }

    return copy;
  });
}

/**
 * Direct upsert to Supabase REST endpoint with smart schema adaptation
 */
export async function mirrorUpsert(tableName: string, data: any | any[]): Promise<{ ok: boolean; error?: string; data?: any }> {
  try {
    const rawItems = Array.isArray(data) ? data : [data];
    if (rawItems.length === 0) return { ok: true };

    const payload = adaptPayloadForSupabase(tableName, rawItems);

    const { data: resultData, error } = await supabase
      .from(tableName)
      .upsert(payload, { onConflict: 'id' })
      .select();

    if (error) {
      console.warn(`[Supabase Direct] Warning upserting to table "${tableName}":`, error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true, data: resultData };
  } catch (err: any) {
    console.warn(`[Supabase Direct] Exception on table "${tableName}":`, err?.message || err);
    return { ok: false, error: err?.message || 'Network error' };
  }
}

/**
 * Direct delete operation on Supabase table
 */
export async function mirrorDelete(tableName: string, id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.warn(`[Supabase Direct] Warning deleting from table "${tableName}" id=${id}:`, error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Network error' };
  }
}

/**
 * Auto-seed database if tables are empty
 */
export async function seedSupabaseDatabaseIfEmpty(): Promise<void> {
  try {
    const { data: existingCategories } = await supabase.from('categories').select('id').limit(1);
    if (!existingCategories || existingCategories.length === 0) {
      console.log('[Supabase Auto-Seed] Seeding categories...');
      await mirrorUpsert('categories', DEFAULT_CATEGORIES);
    }

    const { data: existingSellers } = await supabase.from('sellers').select('id').limit(1);
    if (!existingSellers || existingSellers.length === 0) {
      console.log('[Supabase Auto-Seed] Seeding sellers...');
      await mirrorUpsert('sellers', INITIAL_SELLERS);
    }

    const { data: existingProducts } = await supabase.from('products').select('id').limit(1);
    if (!existingProducts || existingProducts.length === 0) {
      console.log('[Supabase Auto-Seed] Seeding products...');
      await mirrorUpsert('products', INITIAL_PRODUCTS);
    }

    const { data: existingSuppliers } = await supabase.from('suppliers').select('id').limit(1);
    if (!existingSuppliers || existingSuppliers.length === 0) {
      console.log('[Supabase Auto-Seed] Seeding suppliers...');
      await mirrorUpsert('suppliers', INITIAL_SUPPLIERS);
    }

    const { data: existingSourcing } = await supabase.from('sourcing_requests').select('id').limit(1);
    if (!existingSourcing || existingSourcing.length === 0) {
      console.log('[Supabase Auto-Seed] Seeding sourcing requests...');
      await mirrorUpsert('sourcing_requests', INITIAL_SOURCING_REQUESTS);
    }

    const { data: existingOrders } = await supabase.from('orders').select('id').limit(1);
    if (!existingOrders || existingOrders.length === 0) {
      console.log('[Supabase Auto-Seed] Seeding sample orders...');
      await mirrorUpsert('orders', INITIAL_ORDERS);
    }
  } catch (err) {
    console.warn('[Supabase Auto-Seed] Notice during seed check:', err);
  }
}

/**
 * Perform a full bidirectional backfill sync to all Supabase tables
 */
export async function syncToSupabase(payload: {
  products: Product[];
  sellers: Seller[];
  applications: SellerApplication[];
  orders: Order[];
  categories: Category[];
  suppliers: Supplier[];
  sourcingRequests: SourcingRequest[];
  commission: CommissionSettings;
  auditLogs: AuditLog[];
}): Promise<FullSyncResult> {
  const reports: TableSyncReport[] = [];
  const now = new Date().toISOString();

  const tablesToSync: Array<{ name: string; data: any[] }> = [
    { name: 'categories', data: payload.categories },
    { name: 'sellers', data: payload.sellers },
    { name: 'products', data: payload.products },
    { name: 'seller_applications', data: payload.applications },
    { name: 'orders', data: payload.orders },
    { name: 'suppliers', data: payload.suppliers },
    { name: 'sourcing_requests', data: payload.sourcingRequests },
    { name: 'audit_logs', data: payload.auditLogs }
  ];

  let overallSuccess = true;

  for (const item of tablesToSync) {
    try {
      const res = await mirrorUpsert(item.name, item.data);
      if (res.ok) {
        reports.push({
          tableName: item.name,
          count: item.data.length,
          status: 'synced',
          message: `Successfully synchronized ${item.data.length} records to Supabase.`,
          lastSyncedAt: now
        });
      } else {
        reports.push({
          tableName: item.name,
          count: item.data.length,
          status: 'failed',
          message: res.error || 'Sync returned an error',
          lastSyncedAt: now
        });
        overallSuccess = false;
      }
    } catch (e: any) {
      reports.push({
        tableName: item.name,
        count: item.data.length,
        status: 'failed',
        message: e?.message || 'Exception during sync',
        lastSyncedAt: now
      });
      overallSuccess = false;
    }
  }

  return {
    success: overallSuccess,
    timestamp: now,
    reports
  };
}

/**
 * Complete SQL Schema for Supabase Editor
 */
export const SUPABASE_SQL_SCHEMA = `-- ZENDO GLOBAL MARKETPLACE POSTGRESQL SCHEMA FOR SUPABASE
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/iuxybpqnvrrqdutfavaa/sql

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  store_name TEXT,
  description TEXT,
  phone TEXT,
  email TEXT,
  country TEXT DEFAULT 'United States',
  city TEXT,
  state_province TEXT,
  district TEXT,
  sector TEXT,
  address TEXT,
  status TEXT DEFAULT 'active',
  verified BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 5.0,
  rating_count INT DEFAULT 0,
  logo TEXT,
  cover TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  discount_price NUMERIC,
  quantity INT DEFAULT 0,
  sku TEXT,
  brand TEXT,
  color TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'approved',
  featured BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 5.0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  category TEXT,
  phone TEXT,
  email TEXT,
  logo TEXT,
  description TEXT,
  products JSONB DEFAULT '[]'::jsonb,
  verified BOOLEAN DEFAULT true,
  rating NUMERIC DEFAULT 5.0,
  rating_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.seller_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT,
  business_address TEXT,
  business_description TEXT,
  business_category TEXT,
  document_url TEXT,
  business_photo_url TEXT,
  payment_method TEXT,
  payment_phone_or_code TEXT,
  payment_account_name TEXT,
  status TEXT DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sourcing_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  product_name TEXT NOT NULL,
  quantity TEXT DEFAULT '1',
  unit TEXT,
  country TEXT,
  budget NUMERIC,
  description TEXT,
  status TEXT DEFAULT 'requested',
  supplier_id TEXT,
  supplier_name TEXT,
  quote_amount NUMERIC,
  quote_notes TEXT,
  tracking JSONB DEFAULT '[]'::jsonb,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  order_number TEXT UNIQUE NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  order_status TEXT DEFAULT 'pending_payment',
  delivery_name TEXT NOT NULL,
  delivery_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  country TEXT,
  state_province TEXT,
  city TEXT,
  postal_code TEXT,
  district TEXT,
  sector TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  customer_name TEXT,
  customer_phone TEXT,
  total NUMERIC,
  status TEXT,
  payment_method TEXT,
  address TEXT
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer',
  avatar_url TEXT,
  country TEXT,
  is_verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT,
  price NUMERIC,
  quantity INT,
  seller_user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rate NUMERIC DEFAULT 8.0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  user_name TEXT,
  user_id UUID REFERENCES auth.users(id),
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT,
  rating NUMERIC NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
`;
