import { supabase } from './supabase';
import {
  Category,
  Product,
  Seller,
  SellerApplication,
  Order,
  Review,
  Supplier,
  SourcingRequest,
  CommissionSettings,
  AuditLog,
  UserRole
} from '../types';

export interface DbProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  status: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface DbNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface DbCartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface DbWishlistItem {
  id: string;
  wishlist_id: string;
  product_id: string;
  created_at: string;
}

export interface DbPayment {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  transaction_reference?: string;
  provider?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface DbCommission {
  id: string;
  order_id: string;
  order_item_id?: string;
  seller_id: string;
  sale_amount: number;
  commission_percentage: number;
  commission_amount: number;
  seller_amount: number;
  status: string;
  created_at: string;
}

// -------------------------------------------------------------
// 1. PROFILES & AUTH MANAGEMENT
// -------------------------------------------------------------

export async function getProfile(userId: string): Promise<DbProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile does not exist yet, return null
        return null;
      }
      console.warn('[SupabaseApi] getProfile error:', error.message);
      return null;
    }
    return data as DbProfile;
  } catch (err) {
    console.error('[SupabaseApi] getProfile exception:', err);
    return null;
  }
}

export async function getProfileByEmail(email: string): Promise<DbProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn('[SupabaseApi] getProfileByEmail error:', error.message);
      return null;
    }
    return data as DbProfile;
  } catch (err) {
    console.error('[SupabaseApi] getProfileByEmail exception:', err);
    return null;
  }
}

export async function upsertProfile(profile: Partial<DbProfile> & { id: string }): Promise<DbProfile | null> {
  try {
    const payload = {
      ...profile,
      updated_at: new Date().toISOString()
    };
    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.error('[SupabaseApi] upsertProfile error:', error.message);
      return null;
    }
    return data as DbProfile;
  } catch (err) {
    console.error('[SupabaseApi] upsertProfile exception:', err);
    return null;
  }
}

export async function fetchAllProfiles(): Promise<DbProfile[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SupabaseApi] fetchAllProfiles error:', error.message);
      return [];
    }
    return (data || []) as DbProfile[];
  } catch (err) {
    console.error('[SupabaseApi] fetchAllProfiles exception:', err);
    return [];
  }
}

export async function updateProfileRole(userId: string, role: UserRole): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('[SupabaseApi] updateProfileRole error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[SupabaseApi] updateProfileRole exception:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 2. CATEGORIES
// -------------------------------------------------------------

export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('[SupabaseApi] fetchCategories error:', error.message);
      return [];
    }
    return (data || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      icon: 'Tag',
      itemCount: 0,
      description: c.description || undefined,
      image: c.image_url || undefined,
      created_at: c.created_at
    }));
  } catch (err) {
    console.error('[SupabaseApi] fetchCategories exception:', err);
    return [];
  }
}

export async function createCategory(name: string, description?: string, imageUrl?: string): Promise<Category | null> {
  try {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name,
        slug,
        description,
        image_url: imageUrl,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('[SupabaseApi] createCategory error:', error.message);
      return null;
    }
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      icon: 'Tag',
      itemCount: 0,
      description: data.description,
      image: data.image_url,
      created_at: data.created_at
    };
  } catch (err) {
    console.error('[SupabaseApi] createCategory exception:', err);
    return null;
  }
}

// -------------------------------------------------------------
// 3. SELLERS & SELLER APPLICATIONS
// -------------------------------------------------------------

export async function fetchSellers(): Promise<Seller[]> {
  try {
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SupabaseApi] fetchSellers error:', error.message);
      return [];
    }
    return (data || []).map((s: any) => ({
      id: s.id,
      user_id: s.user_id,
      store_name: s.store_name || s.business_name,
      business_name: s.business_name,
      description: s.description || s.business_description || '',
      logo: s.logo || s.logo_url || 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=300&q=80',
      cover: s.cover || s.cover_image_url || 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=80',
      phone: s.phone || '',
      email: s.email || '',
      district: s.district || s.location || 'Kigali',
      sector: s.sector || 'Nyarugenge',
      address: s.address || s.location || 'Kigali, Rwanda',
      status: s.status || 'active',
      verified: Boolean(s.verified || s.verification_status === 'verified'),
      rating: Number(s.rating || 5.0),
      rating_count: Number(s.rating_count || 0),
      created_at: s.created_at
    }));
  } catch (err) {
    console.error('[SupabaseApi] fetchSellers exception:', err);
    return [];
  }
}

export async function fetchSellerApplications(): Promise<SellerApplication[]> {
  try {
    const { data, error } = await supabase
      .from('seller_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SupabaseApi] fetchSellerApplications error:', error.message);
      return [];
    }
    return (data || []).map((a: any) => ({
      id: a.id,
      user_id: a.user_id,
      business_name: a.business_name,
      full_name: a.full_name,
      phone: a.phone,
      email: a.email,
      business_location: a.business_address || a.location || 'Kigali, Rwanda',
      description: a.business_description || '',
      categories: a.business_category ? a.business_category.split(',') : ['Electronics'],
      status: a.status || 'pending',
      rejection_reason: a.rejection_reason || undefined,
      created_at: a.created_at
    }));
  } catch (err) {
    console.error('[SupabaseApi] fetchSellerApplications exception:', err);
    return [];
  }
}

export async function createSellerApplication(data: {
  user_id: string;
  business_name: string;
  full_name: string;
  phone: string;
  email: string;
  location?: string;
  business_address?: string;
  business_description?: string;
  business_category?: string;
  document_url?: string;
  business_photo_url?: string;
  payment_method?: string;
  payment_phone_or_code?: string;
  payment_account_name?: string;
}): Promise<SellerApplication | null> {
  try {
    // Validate required fields
    if (!data.user_id || !data.business_name || !data.full_name || !data.phone || !data.email) {
      console.error('[SupabaseApi] createSellerApplication validation error: missing required fields');
      return null;
    }

    // Clean and prepare the data
    const payload = {
      user_id: data.user_id,
      business_name: data.business_name.trim(),
      full_name: data.full_name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim().toLowerCase(),
      location: data.location?.trim(),
      business_address: data.business_address?.trim(),
      business_description: data.business_description?.trim(),
      business_category: data.business_category?.trim(),
      document_url: data.document_url,
      business_photo_url: data.business_photo_url,
      payment_method: data.payment_method,
      payment_phone_or_code: data.payment_phone_or_code?.trim(),
      payment_account_name: data.payment_account_name?.trim(),
      status: 'pending'
    };

    const { data: created, error } = await supabase
      .from('seller_applications')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('[SupabaseApi] createSellerApplication error:', error.message, error);
      return null;
    }

    if (!created) {
      console.error('[SupabaseApi] createSellerApplication: no data returned');
      return null;
    }

    // Send notification to superadmin(s) about new seller application (non-blocking)
    // Get superadmin users to notify them
    supabase
      .from('profiles')
      .select('id')
      .in('role', ['admin', 'super_admin'])
      .then(({ data: superadmins }) => {
        if (superadmins && superadmins.length > 0) {
          superadmins.forEach((admin) => {
            createNotification(
              admin.id,
              'new_seller_application',
              '📋 New Seller Application Submitted',
              `A new seller application from "${data.business_name}" (${data.full_name}) is pending review. Please review in the Super Admin dashboard.`
            ).catch(() => {});
          });
        }
      }).catch(() => {});

    return {
      id: created.id,
      user_id: created.user_id,
      business_name: created.business_name,
      full_name: created.full_name,
      phone: created.phone,
      email: created.email,
      business_location: created.business_address || created.location || 'Kigali, Rwanda',
      description: created.business_description || '',
      categories: created.business_category ? created.business_category.split(',') : ['Electronics'],
      payment_method: created.payment_method || data.payment_method,
      payment_phone_or_code: created.payment_phone_or_code || data.payment_phone_or_code,
      payment_account_name: created.payment_account_name || data.payment_account_name,
      status: created.status,
      created_at: created.created_at
    };
  } catch (err) {
    console.error('[SupabaseApi] createSellerApplication exception:', err);
    return null;
  }
}

export async function approveSellerApplication(applicationId: string, reviewerId?: string): Promise<boolean> {
  try {
    // 1. Get application
    const { data: app, error: appErr } = await supabase
      .from('seller_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (appErr || !app) {
      console.error('[SupabaseApi] Application not found:', appErr?.message);
      return false;
    }

    // 2. Update application status
    await supabase
      .from('seller_applications')
      .update({
        status: 'approved',
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId);

    // 3. Create or activate seller in 'sellers' table
    const { error: sellerErr } = await supabase
      .from('sellers')
      .insert({
        user_id: app.user_id,
        business_name: app.business_name,
        store_name: app.business_name,
        business_description: app.business_description,
        description: app.business_description,
        phone: app.phone,
        email: app.email,
        payment_method: app.payment_method,
        payment_phone_or_code: app.payment_phone_or_code,
        payment_account_name: app.payment_account_name,
        location: app.location || app.business_address || 'Kigali, Rwanda',
        address: app.business_address || app.location || 'Kigali, Rwanda',
        verification_status: 'verified',
        verified: true,
        is_active: true,
        status: 'active',
        application_id: app.id,
        logo: app.business_photo_url || 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=300&q=80',
        cover: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=80'
      });

    if (sellerErr) {
      console.error('[SupabaseApi] Error creating seller record:', sellerErr.message);
    }

    // 4. Update user profile role to 'seller'
    await updateProfileRole(app.user_id, 'seller');

    // 5. Send notification to user
    await createNotification(
      app.user_id,
      'seller_approved',
      '🎉 Seller Application Approved!',
      `Congratulations! Your store "${app.business_name}" is now approved. Access your Seller Dashboard to start listing products.`
    );

    return true;
  } catch (err) {
    console.error('[SupabaseApi] approveSellerApplication exception:', err);
    return false;
  }
}

export async function rejectSellerApplication(applicationId: string, reason: string, reviewerId?: string): Promise<boolean> {
  try {
    const { data: app } = await supabase
      .from('seller_applications')
      .select('user_id, business_name')
      .eq('id', applicationId)
      .single();

    const { error } = await supabase
      .from('seller_applications')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId);

    if (error) {
      console.error('[SupabaseApi] rejectSellerApplication error:', error.message);
      return false;
    }

    if (app?.user_id) {
      await createNotification(
        app.user_id,
        'seller_rejected',
        'Seller Application Update',
        `Your application for "${app.business_name}" was not approved. Reason: ${reason}`
      );
    }

    return true;
  } catch (err) {
    console.error('[SupabaseApi] rejectSellerApplication exception:', err);
    return false;
  }
}

export async function deleteSeller(sellerId: string): Promise<boolean> {
  try {
    const { data: seller } = await supabase
      .from('sellers')
      .select('user_id, application_id')
      .eq('id', sellerId)
      .single();

    // 1. Delete seller products from Supabase
    await supabase.from('products').delete().eq('seller_id', sellerId);
    if (seller?.user_id) {
      await supabase.from('products').delete().eq('seller_user_id', seller.user_id);
    }

    // 2. Delete seller application if any
    if (seller?.application_id) {
      await supabase.from('seller_applications').delete().eq('id', seller.application_id);
    }
    if (seller?.user_id) {
      await supabase.from('seller_applications').delete().eq('user_id', seller.user_id);
      // Revert profile role from 'seller' to 'customer'
      await supabase.from('profiles').update({ role: 'customer' }).eq('id', seller.user_id);
    }

    // 3. Delete from 'sellers' table
    const { error } = await supabase.from('sellers').delete().eq('id', sellerId);
    if (error) {
      console.error('[SupabaseApi] deleteSeller error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[SupabaseApi] deleteSeller exception:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 4. PRODUCTS & APPROVAL WORKFLOW
// -------------------------------------------------------------

export async function fetchApprovedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('status', ['approved', 'pending_review'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SupabaseApi] fetchApprovedProducts error:', error.message);
      return [];
    }
    return mapDbProducts(data || []);
  } catch (err) {
    console.error('[SupabaseApi] fetchApprovedProducts exception:', err);
    return [];
  }
}

export async function fetchAllProductsForAdmin(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SupabaseApi] fetchAllProductsForAdmin error:', error.message);
      return [];
    }
    return mapDbProducts(data || []);
  } catch (err) {
    console.error('[SupabaseApi] fetchAllProductsForAdmin exception:', err);
    return [];
  }
}

export async function createProduct(productData: {
  seller_id?: string;
  category_id?: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  stock_quantity: number;
  sku?: string;
  brand?: string;
  condition?: string;
  weight?: string;
  dimensions?: string;
  color?: string;
  material?: string;
  images: string[];
  seller_name?: string;
  category_name?: string;
  subcategory?: string;
  status?: string;
  seller_user_id?: string;
}): Promise<Product | null> {
  try {
    let resolvedSellerId = productData.seller_id;

    // Check if seller_id is a valid UUID or find/create the seller in 'sellers' table
    if (!resolvedSellerId || !resolvedSellerId.includes('-')) {
      const { data: sellerMatch } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', productData.seller_user_id || 'ef9b5076-0f6f-484d-b24e-f58db44990ed')
        .maybeSingle();

      if (sellerMatch?.id) {
        resolvedSellerId = sellerMatch.id;
      } else {
        // Create a new seller record for this user if none exists
        const { data: newSeller } = await supabase
          .from('sellers')
          .insert({
            user_id: productData.seller_user_id || 'ef9b5076-0f6f-484d-b24e-f58db44990ed',
            store_name: productData.seller_name || 'Verified Merchant',
            business_name: productData.seller_name || 'Verified Merchant',
            description: 'Seller',
            phone: '',
            email: '',
            location: 'Kigali, Rwanda',
            address: 'Kigali, Rwanda',
            verification_status: 'verified',
            verified: true,
            is_active: true,
            status: 'active'
          })
          .select('id')
          .maybeSingle();
        
        if (newSeller?.id) {
          resolvedSellerId = newSeller.id;
        } else {
          resolvedSellerId = productData.seller_user_id || 'ef9b5076-0f6f-484d-b24e-f58db44990ed';
        }
      }
    }

    const payload: any = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      discount_price: productData.discount_price,
      stock_quantity: productData.stock_quantity,
      quantity: productData.stock_quantity,
      sku: productData.sku || `ZND-${Date.now().toString().slice(-6)}`,
      brand: productData.brand || 'Original',
      condition: productData.condition || 'New',
      weight: productData.weight,
      dimensions: productData.dimensions,
      color: productData.color,
      material: productData.material,
      status: productData.status || 'approved',
      subcategory: productData.subcategory || '',
      images: productData.images && productData.images.length > 0 ? productData.images : [],
      seller_name: productData.seller_name || 'Verified Merchant',
      seller_user_id: productData.seller_user_id || 'ef9b5076-0f6f-484d-b24e-f58db44990ed',
      category_name: productData.category_name || 'General',
      featured: false,
      rating: 5.0,
      review_count: 0
    };

    if (resolvedSellerId && resolvedSellerId.includes('-')) {
      payload.seller_id = resolvedSellerId;
    }
    if (productData.category_id && productData.category_id.includes('-')) {
      payload.category_id = productData.category_id;
    }

    const { data: inserted, error } = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.warn('[SupabaseApi] createProduct notice:', error.message);
      // Fallback object to ensure seller sees product in local state immediately
      const fallbackProd: Product = {
        id: `prod-${Date.now()}`,
        seller_id: resolvedSellerId || '00000000-0000-0000-0000-000000000000',
        seller_name: productData.seller_name || 'Verified Merchant',
        seller_user_id: productData.seller_user_id,
        category_id: productData.category_id || '',
        category_name: productData.category_name || 'General',
        name: productData.name,
        description: productData.description,
        price: productData.price,
        discount_price: productData.discount_price,
        quantity: productData.stock_quantity,
        sku: productData.sku || `ZND-${Date.now().toString().slice(-6)}`,
        brand: productData.brand || 'Original',
        images: productData.images,
        status: 'pending_review',
        condition: productData.condition,
        color: productData.color,
        featured: false,
        rating: 5.0,
        review_count: 0,
        created_at: new Date().toISOString()
      };
      return fallbackProd;
    }

    // Send notification to superadmin(s) about new product requiring approval
    if (productData.status === 'pending_review' || !productData.status) {
      const { data: superadmins } = await supabase
        .from('profiles')
        .select('id')
        .in('role', ['admin', 'super_admin']);

      if (superadmins && superadmins.length > 0) {
        for (const admin of superadmins) {
          await createNotification(
            admin.id,
            'new_product_pending_review',
            '📦 New Product Pending Review',
            `A new product "${productData.name}" from ${productData.seller_name || 'a seller'} is pending review. Please review in the Super Admin dashboard.`
          ).catch(() => {});
        }
      }
    }

    // Insert image records into 'product_images' table if available
    if (inserted && productData.images && productData.images.length > 0) {
      const imgPayloads = productData.images.map((url, idx) => ({
        product_id: inserted.id,
        image_url: url,
        is_primary: idx === 0,
        sort_order: idx
      }));
      await supabase.from('product_images').insert(imgPayloads).catch(() => {});
    }

    return mapDbProducts([inserted])[0];
  } catch (err) {
    console.error('[SupabaseApi] createProduct exception:', err);
    return null;
  }
}

export async function updateProduct(productId: string, updates: Partial<Product>): Promise<boolean> {
  try {
    // Map Product fields -> DB columns explicitly
    const dbUpdate: Record<string, any> = {
      updated_at: new Date().toISOString()
    };
    if (updates.name !== undefined) dbUpdate.name = updates.name;
    if (updates.description !== undefined) dbUpdate.description = updates.description;
    if (updates.price !== undefined) dbUpdate.price = updates.price;
    if (updates.discount_price !== undefined) dbUpdate.discount_price = updates.discount_price;
    if (updates.quantity !== undefined) dbUpdate.stock_quantity = updates.quantity;
    if (updates.sku !== undefined) dbUpdate.sku = updates.sku;
    if (updates.brand !== undefined) dbUpdate.brand = updates.brand;
    if (updates.condition !== undefined) dbUpdate.condition = updates.condition;
    if (updates.color !== undefined) dbUpdate.color = updates.color;
    if (updates.images !== undefined) dbUpdate.images = updates.images;
    if (updates.category_id !== undefined) dbUpdate.category_id = updates.category_id;
    if (updates.category_name !== undefined) dbUpdate.category_name = updates.category_name;
    if (updates.status !== undefined) dbUpdate.status = updates.status;
    if (updates.featured !== undefined) dbUpdate.featured = updates.featured;

    const { error } = await supabase
      .from('products')
      .update(dbUpdate)
      .eq('id', productId);

    if (error) {
      console.error('[SupabaseApi] updateProduct error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[SupabaseApi] updateProduct exception:', err);
    return false;
  }
}

export async function deleteProduct(productId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('[SupabaseApi] deleteProduct error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[SupabaseApi] deleteProduct exception:', err);
    return false;
  }
}

export async function approveProduct(productId: string, reviewerId?: string): Promise<boolean> {
  try {
    const { data: prod } = await supabase
      .from('products')
      .select('name, seller_user_id')
      .eq('id', productId)
      .single();

    const { error } = await supabase
      .from('products')
      .update({
        status: 'approved',
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);

    if (error) {
      console.error('[SupabaseApi] approveProduct error:', error.message);
      return false;
    }

    if (prod?.seller_user_id) {
      await createNotification(
        prod.seller_user_id,
        'product_approved',
        '✅ Product Listing Approved!',
        `Your product "${prod.name}" has been reviewed and is now live on Zendo Marketplace.`
      );
    }

    return true;
  } catch (err) {
    console.error('[SupabaseApi] approveProduct exception:', err);
    return false;
  }
}

export async function rejectProduct(productId: string, reason: string, reviewerId?: string): Promise<boolean> {
  try {
    const { data: prod } = await supabase
      .from('products')
      .select('name, seller_user_id')
      .eq('id', productId)
      .single();

    const { error } = await supabase
      .from('products')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);

    if (error) {
      console.error('[SupabaseApi] rejectProduct error:', error.message);
      return false;
    }

    if (prod?.seller_user_id) {
      await createNotification(
        prod.seller_user_id,
        'product_rejected',
        'Product Listing Rejected',
        `Your product "${prod.name}" was not approved. Feedback: ${reason}`
      );
    }

    return true;
  } catch (err) {
    console.error('[SupabaseApi] rejectProduct exception:', err);
    return false;
  }
}

function mapDbProducts(rows: any[]): Product[] {
  return rows.map((p) => {
    let images: string[] = [];
    if (Array.isArray(p.images)) {
      images = p.images;
    } else if (typeof p.images === 'string') {
      try {
        images = JSON.parse(p.images);
      } catch {
        images = [p.images];
      }
    }
    if (images.length === 0) {
      images = ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'];
    }

    return {
      id: p.id,
      seller_id: p.seller_id,
      seller_user_id: p.seller_user_id,
      category_id: p.category_id || '',
      category_name: p.category_name || 'Marketplace Item',
      seller_name: p.seller_name || 'Verified Merchant',
      name: p.name,
      description: p.description || '',
      price: Number(p.price || 0),
      discount_price: p.discount_price ? Number(p.discount_price) : undefined,
      quantity: Number(p.stock_quantity ?? p.quantity ?? 10),
      sku: p.sku || `SKU-${p.id.slice(0, 8)}`,
      brand: p.brand || '',
      color: p.color || '',
      condition: p.condition || 'New',
      weight: p.weight || '',
      dimensions: p.dimensions || '',
      material: p.material || '',
      images,
      rating: Number(p.rating || 5.0),
      review_count: Number(p.review_count || 0),
      featured: Boolean(p.featured),
      status: p.status || 'approved',
      rejection_reason: p.rejection_reason,
      created_at: p.created_at
    };
  });
}

// -------------------------------------------------------------
// 5. CARTS & CART ITEMS (PERSISTENT MULTI-DEVICE CART)
// -------------------------------------------------------------

export async function getUserCart(userId: string): Promise<DbCartItem[]> {
  try {
    // 1. Find or create user's cart in 'carts'
    let { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!cart) {
      const { data: newCart, error: cartErr } = await supabase
        .from('carts')
        .insert({ user_id: userId })
        .select('id')
        .single();
      if (cartErr) return [];
      cart = newCart;
    }

    if (!cart?.id) return [];

    // 2. Fetch cart items
    const { data: items, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[SupabaseApi] getUserCart items error:', error.message);
      return [];
    }
    return (items || []) as DbCartItem[];
  } catch (err) {
    console.error('[SupabaseApi] getUserCart exception:', err);
    return [];
  }
}

export async function addToUserCart(userId: string, productId: string, quantity: number = 1): Promise<boolean> {
  try {
    let { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!cart) {
      const { data: newCart } = await supabase
        .from('carts')
        .insert({ user_id: userId })
        .select('id')
        .single();
      cart = newCart;
    }

    if (!cart?.id) return false;

    // Check if item already exists
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('cart_items')
        .update({
          quantity: existing.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id: productId,
          quantity
        });
    }
    return true;
  } catch (err) {
    console.error('[SupabaseApi] addToUserCart exception:', err);
    return false;
  }
}

export async function removeFromUserCart(userId: string, productId: string): Promise<boolean> {
  try {
    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!cart?.id) return false;

    await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id)
      .eq('product_id', productId);

    return true;
  } catch (err) {
    console.error('[SupabaseApi] removeFromUserCart exception:', err);
    return false;
  }
}

export async function updateUserCartQty(userId: string, productId: string, quantity: number): Promise<boolean> {
  try {
    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!cart?.id) return false;

    if (quantity <= 0) {
      return removeFromUserCart(userId, productId);
    }

    await supabase
      .from('cart_items')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('cart_id', cart.id)
      .eq('product_id', productId);

    return true;
  } catch (err) {
    console.error('[SupabaseApi] updateUserCartQty exception:', err);
    return false;
  }
}

export async function clearUserCart(userId: string): Promise<boolean> {
  try {
    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!cart?.id) return true;

    await supabase.from('cart_items').delete().eq('cart_id', cart.id);
    return true;
  } catch (err) {
    return false;
  }
}

// -------------------------------------------------------------
// 6. WISHLISTS & WISHLIST ITEMS (PERSISTENT WISHLIST)
// -------------------------------------------------------------

export async function getUserWishlist(userId: string): Promise<string[]> {
  try {
    let { data: wl } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!wl) {
      const { data: newWl } = await supabase
        .from('wishlists')
        .insert({ user_id: userId })
        .select('id')
        .single();
      wl = newWl;
    }

    if (!wl?.id) return [];

    const { data: items } = await supabase
      .from('wishlist_items')
      .select('product_id')
      .eq('wishlist_id', wl.id);

    return (items || []).map((i) => i.product_id);
  } catch (err) {
    console.error('[SupabaseApi] getUserWishlist exception:', err);
    return [];
  }
}

export async function toggleUserWishlistItem(userId: string, productId: string): Promise<boolean> {
  try {
    let { data: wl } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!wl) {
      const { data: newWl } = await supabase
        .from('wishlists')
        .insert({ user_id: userId })
        .select('id')
        .single();
      wl = newWl;
    }

    if (!wl?.id) return false;

    const { data: existing } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('wishlist_id', wl.id)
      .eq('product_id', productId)
      .maybeSingle();

    if (existing) {
      await supabase.from('wishlist_items').delete().eq('id', existing.id);
      return false; // removed
    } else {
      await supabase.from('wishlist_items').insert({ wishlist_id: wl.id, product_id: productId });
      return true; // added
    }
  } catch (err) {
    console.error('[SupabaseApi] toggleUserWishlistItem exception:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 7. ORDERS, ORDER ITEMS, PAYMENTS & COMMISSIONS
// -------------------------------------------------------------

export async function fetchOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SupabaseApi] fetchOrders error:', error.message);
      return [];
    }
    return mapDbOrders(data || []);
  } catch (err) {
    console.error('[SupabaseApi] fetchOrders exception:', err);
    return [];
  }
}

export async function createOrder(payload: {
  user_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  district?: string;
  sector?: string;
  items: Array<{
    product_id: string;
    seller_id?: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  commission_rate?: number;
}): Promise<Order | null> {
  try {
    const orderNumber = `ZND-RW-${Math.floor(100000 + Math.random() * 900000)}`;
    const sellerIds = Array.from(new Set(payload.items.map((i) => i.seller_id).filter(Boolean)));

    // 1. Insert into 'orders'
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id: payload.user_id,
        order_number: orderNumber,
        subtotal: payload.subtotal,
        delivery_fee: payload.delivery_fee,
        total_amount: payload.total,
        total: payload.total,
        payment_status: 'paid',
        order_status: 'processing',
        status: 'processing',
        delivery_name: payload.customer_name,
        customer_name: payload.customer_name,
        delivery_phone: payload.customer_phone,
        customer_phone: payload.customer_phone,
        customer_email: payload.customer_email,
        delivery_address: payload.delivery_address,
        address: payload.delivery_address,
        district: payload.district || 'Kigali',
        sector: payload.sector || 'Nyarugenge',
        payment_method: payload.payment_method,
        items: payload.items,
        seller_ids: sellerIds
      })
      .select()
      .single();

    if (orderErr || !order) {
      console.error('[SupabaseApi] createOrder error:', orderErr?.message);
      return null;
    }

    // 2. Insert into 'order_items' — skip items with non-UUID product IDs (local/fallback IDs)
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validOrderItems = payload.items
      .filter((item) => UUID_REGEX.test(item.product_id))
      .map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        seller_id: item.seller_id && UUID_REGEX.test(item.seller_id) ? item.seller_id : null,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      }));
    if (validOrderItems.length > 0) {
      await supabase.from('order_items').insert(validOrderItems).catch(() => {});
    }

    // 3. Record in 'payments' — only if user has a real session
    if (payload.user_id && UUID_REGEX.test(payload.user_id)) {
      await supabase
        .from('payments')
        .insert({
          order_id: order.id,
          user_id: payload.user_id,
          amount: payload.total,
          payment_method: payload.payment_method,
          transaction_reference: `TXN-${Date.now()}`,
          status: 'completed'
        })
        .catch(() => {});
    }

    // 4. Calculate and record commissions (only for valid UUID seller IDs)
    const commRate = payload.commission_rate || 8;
    const commissionAmount = Math.round(payload.subtotal * (commRate / 100));
    const sellerAmount = payload.subtotal - commissionAmount;
    const validSellerIds = sellerIds.filter((sId) => sId && UUID_REGEX.test(sId as string));

    for (const sId of validSellerIds) {
      await supabase
        .from('commissions')
        .insert({
          order_id: order.id,
          order_item_id: order.id,
          seller_id: sId,
          sale_amount: payload.subtotal,
          commission_percentage: commRate,
          commission_amount: commissionAmount,
          seller_amount: sellerAmount,
          status: 'pending'
        })
        .catch(() => {});
    }

    // 5. Send notification only for authenticated users
    if (payload.user_id && UUID_REGEX.test(payload.user_id)) {
      await createNotification(
        payload.user_id,
        'order_placed',
        '🛍️ Order Placed Successfully!',
        `Thank you for your purchase! Order #${orderNumber} for ${payload.total.toLocaleString()} FRW has been placed.`
      ).catch(() => {});
    }

    return mapDbOrders([order])[0];
  } catch (err) {
    console.error('[SupabaseApi] createOrder exception:', err);
    return null;
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<boolean> {
  try {
    const { data: order } = await supabase
      .from('orders')
      .select('user_id, order_number')
      .eq('id', orderId)
      .single();

    const { error } = await supabase
      .from('orders')
      .update({
        order_status: status,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) {
      console.error('[SupabaseApi] updateOrderStatus error:', error.message);
      return false;
    }

    if (order?.user_id) {
      await createNotification(
        order.user_id,
        'order_status_updated',
        'Order Status Update',
        `Your order #${order.order_number} status is now: ${status.replace('_', ' ').toUpperCase()}.`
      );
    }

    return true;
  } catch (err) {
    console.error('[SupabaseApi] updateOrderStatus exception:', err);
    return false;
  }
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    // Delete associated sub-records first
    await supabase.from('order_items').delete().eq('order_id', orderId).catch(() => {});
    await supabase.from('payments').delete().eq('order_id', orderId).catch(() => {});
    await supabase.from('commissions').delete().eq('order_id', orderId).catch(() => {});

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      console.error('[SupabaseApi] deleteOrder error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[SupabaseApi] deleteOrder exception:', err);
    return false;
  }
}

function mapDbOrders(rows: any[]): Order[] {
  return rows.map((o) => {
    let items: any[] = [];
    if (Array.isArray(o.items)) {
      items = o.items;
    } else if (typeof o.items === 'string') {
      try {
        items = JSON.parse(o.items);
      } catch {
        items = [];
      }
    }

    return {
      id: o.id,
      user_id: o.user_id,
      customer_name: o.customer_name || o.delivery_name || 'Customer',
      customer_phone: o.customer_phone || o.delivery_phone || '',
      customer_email: o.customer_email || '',
      delivery_address: o.delivery_address || o.address || '',
      district: o.district || 'Kigali',
      sector: o.sector || 'Nyarugenge',
      address: o.address || o.delivery_address || '',
      items: items.map((i: any) => ({
        product_id: i.product_id || i.id,
        seller_id: i.seller_id,
        seller_user_id: i.seller_user_id,
        name: i.name || i.product_name,
        price: Number(i.price || i.product_price || 0),
        quantity: Number(i.quantity || 1),
        image: i.image || i.image_url
      })),
      seller_ids: Array.isArray(o.seller_ids) ? o.seller_ids : [],
      subtotal: Number(o.subtotal || o.total_amount || 0),
      delivery_fee: Number(o.delivery_fee || 0),
      total: Number(o.total || o.total_amount || 0),
      status: (o.status || o.order_status || 'processing') as any,
      payment_method: o.payment_method || 'MTN Mobile Money',
      payment_status: (o.payment_status || 'paid') as any,
      tracking_code: o.order_number || `ZND-RW-${o.id.slice(0, 6)}`,
      order_number: o.order_number,
      created_at: o.created_at
    };
  });
}

// -------------------------------------------------------------
// 8. NOTIFICATIONS
// -------------------------------------------------------------

export async function fetchUserNotifications(userId: string): Promise<DbNotification[]> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SupabaseApi] fetchUserNotifications error:', error.message);
      return [];
    }
    return (data || []) as DbNotification[];
  } catch (err) {
    console.error('[SupabaseApi] fetchUserNotifications exception:', err);
    return [];
  }
}

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string
): Promise<DbNotification | null> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        is_read: false
      })
      .select()
      .single();

    if (error) {
      console.warn('[SupabaseApi] createNotification notice:', error.message);
      return null;
    }
    return data as DbNotification;
  } catch (err) {
    return null;
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    return !error;
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// 9. REVIEWS
// -------------------------------------------------------------

export async function fetchProductReviews(productId: string): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }
    return (data || []).map((r: any) => ({
      id: r.id,
      product_id: r.product_id,
      user_id: r.user_id,
      user_name: 'Verified Customer',
      rating: Number(r.rating || 5),
      comment: r.comment || '',
      created_at: r.created_at
    }));
  } catch {
    return [];
  }
}

export async function createReview(data: {
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  order_id?: string;
  image_url?: string;
}): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('reviews')
      .insert({
        user_id: data.user_id,
        product_id: data.product_id,
        order_id: data.order_id || '00000000-0000-0000-0000-000000000000',
        rating: data.rating,
        comment: data.comment,
        image_url: data.image_url,
        status: 'approved'
      });

    if (error) {
      console.error('[SupabaseApi] createReview error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[SupabaseApi] createReview exception:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 10. SUPPLIERS & SOURCING REQUESTS
// -------------------------------------------------------------

export async function fetchSuppliers(): Promise<Supplier[]> {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('rating', { ascending: false });

    if (error) {
      console.error('[SupabaseApi] fetchSuppliers error:', error.message);
      return [];
    }
    return (data || []).map((s: any) => ({
      id: s.id,
      name: s.name,
      country: s.country,
      city: s.city,
      category: s.category,
      phone: s.phone,
      email: s.email,
      logo: s.logo,
      description: s.description,
      products: Array.isArray(s.products) ? s.products : [],
      verified: Boolean(s.verified),
      rating: Number(s.rating || 5.0),
      rating_count: Number(s.rating_count || 0)
    }));
  } catch {
    return [];
  }
}

export async function createSupplier(supplierData: {
  name: string;
  country: string;
  city: string;
  category: string;
  phone?: string;
  email?: string;
  logo?: string;
  description: string;
  products?: string[];
  verified?: boolean;
}): Promise<Supplier | null> {
  try {
    const payload = {
      name: supplierData.name,
      country: supplierData.country,
      city: supplierData.city,
      category: supplierData.category,
      phone: supplierData.phone || '+250 793 032 430',
      email: supplierData.email || 'supplier@zendo.rw',
      logo: supplierData.logo || 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=300&q=80',
      description: supplierData.description,
      products: supplierData.products || ['Custom OEM Manufacturing'],
      verified: supplierData.verified ?? true,
      rating: 5.0,
      rating_count: 1
    };

    const { data, error } = await supabase
      .from('suppliers')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('[SupabaseApi] createSupplier error:', error.message);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      country: data.country,
      city: data.city,
      category: data.category,
      phone: data.phone,
      email: data.email,
      logo: data.logo,
      description: data.description,
      products: data.products || [],
      verified: Boolean(data.verified),
      rating: Number(data.rating || 5.0),
      rating_count: Number(data.rating_count || 0)
    };
  } catch (err) {
    console.error('[SupabaseApi] createSupplier exception:', err);
    return null;
  }
}

export async function deleteSupplier(supplierId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('suppliers').delete().eq('id', supplierId);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchSourcingRequests(): Promise<SourcingRequest[]> {
  try {
    const { data, error } = await supabase
      .from('sourcing_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SupabaseApi] fetchSourcingRequests error:', error.message);
      return [];
    }
    return (data || []).map((r: any) => ({
      id: r.id,
      tracking_code: `SHK-${r.id.slice(0, 6).toUpperCase()}`,
      user_id: r.user_id,
      product_name: r.product_name,
      quantity: Number(r.quantity || 1),
      unit: r.unit || 'Units',
      country: r.country || 'Global',
      budget: Number(r.budget || 0),
      description: r.description || '',
      status: (r.status || 'requested') as any,
      supplier_name: r.supplier_name,
      quote_amount: r.quote_amount ? Number(r.quote_amount) : undefined,
      quote_notes: r.quote_notes,
      tracking: Array.isArray(r.tracking) ? r.tracking : [],
      created_at: r.created_at
    }));
  } catch {
    return [];
  }
}

export async function createSourcingRequest(data: {
  user_id?: string;
  product_name: string;
  quantity: number;
  unit: string;
  country: string;
  budget: number;
  description: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
}): Promise<SourcingRequest | null> {
  try {
    const { data: inserted, error } = await supabase
      .from('sourcing_requests')
      .insert({
        ...data,
        status: 'requested',
        tracking: [
          {
            timestamp: new Date().toISOString(),
            status: 'requested',
            note: 'Sourcing request submitted to Zendo Kigali logistics desk.'
          }
        ]
      })
      .select()
      .single();

    if (error || !inserted) {
      console.error('[SupabaseApi] createSourcingRequest error:', error?.message);
      return null;
    }

    return {
      id: inserted.id,
      tracking_code: `SHK-${inserted.id.slice(0, 6).toUpperCase()}`,
      user_id: inserted.user_id,
      product_name: inserted.product_name,
      quantity: Number(inserted.quantity || 1),
      unit: inserted.unit || 'Units',
      country: inserted.country || 'Global',
      budget: Number(inserted.budget || 0),
      description: inserted.description || '',
      status: inserted.status as any,
      tracking: inserted.tracking || [],
      created_at: inserted.created_at
    };
  } catch (err) {
    console.error('[SupabaseApi] createSourcingRequest exception:', err);
    return null;
  }
}

export async function updateSourcingRequest(
  requestId: string,
  updates: {
    status?: string;
    supplier_name?: string;
    quote_amount?: number;
    quote_notes?: string;
    new_tracking_note?: string;
  }
): Promise<boolean> {
  try {
    const { data: existing } = await supabase
      .from('sourcing_requests')
      .select('tracking')
      .eq('id', requestId)
      .single();

    let updatedTracking = Array.isArray(existing?.tracking) ? [...existing.tracking] : [];
    if (updates.new_tracking_note) {
      updatedTracking.push({
        timestamp: new Date().toISOString(),
        status: updates.status || 'in_transit',
        note: updates.new_tracking_note
      });
    }

    const payload: any = {
      updated_at: new Date().toISOString()
    };
    if (updates.status) payload.status = updates.status;
    if (updates.supplier_name) payload.supplier_name = updates.supplier_name;
    if (updates.quote_amount !== undefined) payload.quote_amount = updates.quote_amount;
    if (updates.quote_notes) payload.quote_notes = updates.quote_notes;
    if (updates.new_tracking_note) payload.tracking = updatedTracking;

    const { error } = await supabase
      .from('sourcing_requests')
      .update(payload)
      .eq('id', requestId);

    if (error) {
      console.error('[SupabaseApi] updateSourcingRequest error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[SupabaseApi] updateSourcingRequest exception:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 11. AUDIT LOGS & PLATFORM SETTINGS
// -------------------------------------------------------------

export async function createAuditLog(
  action: string,
  targetType?: string,
  targetId?: string,
  metadata?: any,
  userId?: string
): Promise<void> {
  try {
    await supabase
      .from('audit_logs')
      .insert({
        action,
        target_type: targetType,
        target_id: targetId,
        metadata: metadata || {},
        user_id: userId
      })
      .catch(() => {});
  } catch {}
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  try {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    return (data || []).map((l: any) => ({
      id: l.id,
      user_id: l.user_id || 'system',
      user_name: 'Admin User',
      action: l.action,
      entity_type: l.target_type || 'system',
      entity_id: l.target_id || '',
      details: typeof l.metadata === 'string' ? l.metadata : JSON.stringify(l.metadata || {}),
      created_at: l.created_at
    }));
  } catch {
    return [];
  }
}
