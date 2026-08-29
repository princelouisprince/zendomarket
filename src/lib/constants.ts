import {
  Category,
  Product,
  Seller,
  Supplier,
  SourcingRequest,
  Order,
  CurrencyCode,
  CurrencyConfig
} from '../types';

export const SUPABASE_URL = 'https://iuxybpqnvrrqdutfavaa.supabase.co';
export const SUPABASE_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1eHlicHFudnJycWR1dGZhdmFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzY4NDI0MCwiZXhwIjoyMTAzMjYwMjQwfQ.U3Affc4hWj6FkY8S8k4LyaarzfNAqHPrpGRQllgZ_6g';

export const SUPPORT_PHONE = '+250 793 032 430';
export const SUPPORT_PHONE_LOCAL = '0793032430';
export const SUPPORT_WHATSAPP_NUMBER = '250793032430';
export const SUPPORT_WHATSAPP_LINK = 'https://wa.me/250793032430';
export const SUPPORT_EMAIL = 'support@zendo.rw';
export const HEADQUARTERS_LOCATION = 'Kigali, Rwanda';

export const PLATFORM_COMMISSION_DEFAULT = 8; // 8%

// -------------------------------------------------------------
// Multi-Currency Exchange Configuration
// -------------------------------------------------------------
export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    exchangeRateFromUSD: 1.0,
    formatDecimals: 2
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    exchangeRateFromUSD: 0.92,
    formatDecimals: 2
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    exchangeRateFromUSD: 0.79,
    formatDecimals: 2
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    flag: '🇨🇦',
    exchangeRateFromUSD: 1.36,
    formatDecimals: 2
  },
  AUD: {
    code: 'AUD',
    symbol: 'AU$',
    name: 'Australian Dollar',
    flag: '🇦🇺',
    exchangeRateFromUSD: 1.52,
    formatDecimals: 2
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    flag: '🇯🇵',
    exchangeRateFromUSD: 154.5,
    formatDecimals: 0
  },
  RWF: {
    code: 'RWF',
    symbol: 'FRW',
    name: 'Rwandan Franc',
    flag: '🇷🇼',
    exchangeRateFromUSD: 1380,
    formatDecimals: 0
  },
  KES: {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    flag: '🇰🇪',
    exchangeRateFromUSD: 130,
    formatDecimals: 0
  }
};

export const DEFAULT_CURRENCY: CurrencyCode = 'RWF';

/**
 * Format any USD base amount into the selected currency
 */
export function formatCurrency(
  amountInUSD: number,
  currencyCode: CurrencyCode = 'RWF'
): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES.RWF;
  const converted = (amountInUSD || 0) * config.exchangeRateFromUSD;

  if (config.formatDecimals === 0) {
    return `${config.symbol} ${new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(Math.round(converted))}`;
  }

  return `${config.symbol} ${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: config.formatDecimals,
    maximumFractionDigits: config.formatDecimals
  }).format(converted)}`;
}

/**
 * Backwards compatibility helper for existing references
 */
export function formatFRW(amountInUSD: number, currencyCode?: CurrencyCode): string {
  return formatCurrency(amountInUSD, currencyCode || 'USD');
}

// -------------------------------------------------------------
// International Countries & Country Codes
// -------------------------------------------------------------
export interface CountryOption {
  code: string;
  name: string;
  phoneCode: string;
  flag: string;
  currency: CurrencyCode;
}

export const INTERNATIONAL_COUNTRIES: CountryOption[] = [
  { code: 'US', name: 'United States', phoneCode: '+1', flag: '🇺🇸', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', phoneCode: '+44', flag: '🇬🇧', currency: 'GBP' },
  { code: 'DE', name: 'Germany', phoneCode: '+49', flag: '🇩🇪', currency: 'EUR' },
  { code: 'FR', name: 'France', phoneCode: '+33', flag: '🇫🇷', currency: 'EUR' },
  { code: 'AE', name: 'United Arab Emirates', phoneCode: '+971', flag: '🇦🇪', currency: 'USD' },
  { code: 'JP', name: 'Japan', phoneCode: '+81', flag: '🇯🇵', currency: 'JPY' },
  { code: 'CA', name: 'Canada', phoneCode: '+1', flag: '🇨🇦', currency: 'CAD' },
  { code: 'AU', name: 'Australia', phoneCode: '+61', flag: '🇦🇺', currency: 'AUD' },
  { code: 'SG', name: 'Singapore', phoneCode: '+65', flag: '🇸🇬', currency: 'USD' },
  { code: 'CN', name: 'China', phoneCode: '+86', flag: '🇨🇳', currency: 'USD' },
  { code: 'RW', name: 'Rwanda', phoneCode: '+250', flag: '🇷🇼', currency: 'RWF' },
  { code: 'KE', name: 'Kenya', phoneCode: '+254', flag: '🇰🇪', currency: 'KES' },
  { code: 'ZA', name: 'South Africa', phoneCode: '+27', flag: '🇿🇦', currency: 'USD' },
  { code: 'NG', name: 'Nigeria', phoneCode: '+234', flag: '🇳🇬', currency: 'USD' },
  { code: 'BR', name: 'Brazil', phoneCode: '+55', flag: '🇧🇷', currency: 'USD' },
  { code: 'IN', name: 'India', phoneCode: '+91', flag: '🇮🇳', currency: 'USD' },
  { code: 'IT', name: 'Italy', phoneCode: '+39', flag: '🇮🇹', currency: 'EUR' },
  { code: 'ES', name: 'Spain', phoneCode: '+34', flag: '🇪🇸', currency: 'EUR' },
  { code: 'NL', name: 'Netherlands', phoneCode: '+31', flag: '🇳🇱', currency: 'EUR' },
  { code: 'CH', name: 'Switzerland', phoneCode: '+41', flag: '🇨🇭', currency: 'EUR' }
];

// Rwanda Province → Districts hierarchy
export const RWANDA_PROVINCES = [
  'Kigali City',
  'Northern Province',
  'Southern Province',
  'Eastern Province',
  'Western Province'
] as const;

export const RWANDA_DISTRICTS_BY_PROVINCE: Record<string, string[]> = {
  'Kigali City': ['Nyarugenge', 'Gasabo', 'Kicukiro'],
  'Northern Province': ['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'],
  'Southern Province': ['Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'],
  'Eastern Province': ['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'],
  'Western Province': ['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro']
};

// All Rwanda districts flat list (for backwards compat)
export const RWANDA_DISTRICTS: string[] = Object.values(RWANDA_DISTRICTS_BY_PROVINCE).flat();

// International: Countries with Provinces/States
export const INTERNATIONAL_COUNTRY_PROVINCES: Record<string, string[]> = {
  Rwanda: RWANDA_DISTRICTS,
  Uganda: ['Central', 'Eastern', 'Northern', 'Western'],
  Kenya: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi'],
  Tanzania: ['Dar es Salaam', 'Dodoma', 'Mwanza', 'Arusha', 'Mbeya'],
  Ethiopia: ['Addis Ababa', 'Oromia', 'Amhara', 'SNNP', 'Tigray'],
  'South Africa': ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Limpopo'],
  Nigeria: ['Lagos', 'Abuja (FCT)', 'Kano', 'Rivers', 'Ogun', 'Oyo'],
  Ghana: ['Greater Accra', 'Ashanti', 'Brong-Ahafo', 'Central', 'Northern'],
  'United States': ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Washington'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  Germany: ['Bavaria', 'Berlin', 'Hamburg', 'North Rhine-Westphalia', 'Saxony'],
  France: ['Île-de-France (Paris)', 'Provence-Alpes', 'Auvergne-Rhône-Alpes', 'Occitanie'],
  UAE: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'],
  China: ['Guangdong', 'Shanghai', 'Beijing', 'Zhejiang', 'Jiangsu', 'Sichuan'],
  India: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Gujarat'],
  Japan: ['Tokyo', 'Osaka', 'Kanagawa', 'Aichi', 'Hokkaido'],
  Canada: ['Ontario', 'British Columbia', 'Quebec', 'Alberta', 'Manitoba'],
  Australia: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia'],
  Brazil: ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná'],
  Singapore: ['Central Region', 'North Region', 'East Region', 'West Region', 'North-East Region'],
};

export const RWANDA_SECTORS: Record<string, string[]> = {
  Nyarugenge: ['Gitega', 'Kanyinya', 'Kigali', 'Kimisagara', 'Mageragere', 'Muhima', 'Nyakabanda', 'Nyamirambo', 'Rwezamenyo'],
  Gasabo: ['Bumbogo', 'Gatsata', 'Gikomero', 'Gisozi', 'Jabana', 'Jali', 'Kacyiru', 'Kimihurura', 'Kimironko', 'Kinyinya', 'Ndera', 'Nduba', 'Remera', 'Rusororo', 'Rutunga'],
  Kicukiro: ['Gahanga', 'Gatenga', 'Gikondo', 'Kagarama', 'Kanombe', 'Kicukiro', 'Kigarama', 'Masaka', 'Niboye', 'Nyarugunga'],
};


// -------------------------------------------------------------
// Categories
// -------------------------------------------------------------
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Furniture & Home',
    icon: 'Sofa',
    slug: 'furniture',
    sort_order: 1,
    subcategories: [
      'Sofas & Couches',
      'Beds & Mattresses',
      'Tables & Chairs',
      'Wardrobes & Cabinets',
      'Office Furniture',
      'Outdoor Furniture'
    ]
  },
  {
    id: 'cat-2',
    name: 'Electronics',
    icon: 'Smartphone',
    slug: 'electronics',
    sort_order: 2,
    subcategories: [
      'Smartphones',
      'Laptops & Computers',
      'TVs & Home Entertainment',
      'Audio & Speakers',
      'Cameras & Photography',
      'Gaming Consoles',
      'Accessories (chargers, cables, cases)'
    ]
  },
  {
    id: 'cat-3',
    name: 'Fashion',
    icon: 'Shirt',
    slug: 'fashion',
    sort_order: 3,
    subcategories: [
      "Men's Clothing",
      "Women's Clothing",
      "Kids' Clothing",
      'Shoes (men/women/kids)',
      'Bags & Wallets',
      'Watches & Jewelry',
      'Traditional / African Wear (Imyambaro)'
    ]
  },
  {
    id: 'cat-4',
    name: 'Beauty & Personal Care',
    icon: 'Sparkles',
    slug: 'beauty',
    sort_order: 4,
    subcategories: [
      'Skincare',
      'Haircare',
      'Makeup & Cosmetics',
      'Fragrances & Perfumes',
      'Health & Wellness Products'
    ]
  },
  {
    id: 'cat-5',
    name: 'Home & Kitchen',
    icon: 'Home',
    slug: 'home-kitchen',
    sort_order: 5,
    subcategories: [
      'Kitchen Appliances (blenders, cookers, fridges)',
      'Cookware & Utensils',
      'Home Decor',
      'Bedding & Curtains',
      'Cleaning Supplies'
    ]
  },
  {
    id: 'cat-6',
    name: 'Office & Stationery',
    icon: 'Briefcase',
    slug: 'office-stationery',
    sort_order: 6,
    subcategories: [
      'Office Supplies',
      'Printers & Ink',
      'Furniture (office)',
      'Books & Educational Materials'
    ]
  },
  {
    id: 'cat-7',
    name: 'Automotive',
    icon: 'Car',
    slug: 'automotive',
    sort_order: 7,
    subcategories: [
      'Car Parts & Accessories',
      'Motorbike & Moto Parts',
      'Tires & Wheels',
      'Car Care & Tools'
    ]
  },
  {
    id: 'cat-8',
    name: 'Agriculture',
    icon: 'Sprout',
    slug: 'agriculture',
    sort_order: 8,
    subcategories: [
      'Seeds & Fertilizers',
      'Farm Tools & Equipment',
      'Irrigation Supplies',
      'Livestock & Poultry Supplies',
      'Animal Feeds'
    ]
  },
  {
    id: 'cat-9',
    name: 'Construction & Hardware',
    icon: 'Hammer',
    slug: 'construction-hardware',
    sort_order: 9,
    subcategories: [
      'Building Materials (cement, bricks, iron sheets)',
      'Plumbing Supplies',
      'Electrical Supplies',
      'Paint & Finishes',
      'Tools & Safety Gear'
    ]
  },
  {
    id: 'cat-10',
    name: 'Sports & Outdoors',
    icon: 'Dumbbell',
    slug: 'sports-outdoors',
    sort_order: 10,
    subcategories: [
      'Sports Equipment',
      'Fitness & Gym Gear',
      'Bicycles',
      'Camping & Outdoor'
    ]
  },
  {
    id: 'cat-11',
    name: 'Kids & Toys',
    icon: 'Baby',
    slug: 'kids-toys',
    sort_order: 11,
    subcategories: [
      'Toys & Games',
      'Baby Products',
      'School Supplies'
    ]
  },
  {
    id: 'cat-12',
    name: 'Health Products',
    icon: 'HeartPulse',
    slug: 'health-products',
    sort_order: 12,
    subcategories: [
      'Medical Supplies',
      'First Aid',
      'Supplements & Vitamins'
    ]
  },
  {
    id: 'cat-13',
    name: 'Other',
    icon: 'Package',
    slug: 'other',
    sort_order: 13,
    subcategories: [
      'Miscellaneous',
      'Services (repairs, deliveries, custom orders)'
    ]
  }
];

// -------------------------------------------------------------
// Initial International Sellers
// -------------------------------------------------------------
export const INITIAL_SELLERS: Seller[] = [
  {
    id: 'sel-1',
    user_id: 'd1111111-1111-1111-1111-111111111111',
    business_name: 'Apex Global Tech Solutions',
    store_name: 'Apex Global Tech Solutions',
    description: 'Premier authorized distributor for Apple, Sony, Dell, DJI, and Samsung hardware with worldwide priority express dispatch.',
    logo: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=200&q=80',
    cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    phone: '+1 (415) 890-3400',
    email: 'sales@apextechglobal.com',
    country: 'United States',
    city: 'San Francisco, CA',
    district: 'California',
    sector: 'Silicon Valley',
    address: '500 Howard Street, Suite 400, San Francisco, CA 94105',
    status: 'active',
    verified: true,
    rating: 4.9,
    rating_count: 342
  },
  {
    id: 'sel-2',
    user_id: 'd2222222-2222-2222-2222-222222222222',
    business_name: 'Nordic & Milano Luxury Living',
    store_name: 'Nordic & Milano Luxury Living',
    description: 'Bespoke Scandinavian interior designs, Italian leather crafts, and minimalist ergonomic executive furniture.',
    logo: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=200&q=80',
    cover: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    phone: '+44 20 7946 0912',
    email: 'concierge@nordicmilanohome.com',
    country: 'United Kingdom',
    city: 'London',
    district: 'London',
    sector: 'Kensington & Chelsea',
    address: '88 Sloane Avenue, Chelsea, London SW3 3DX',
    status: 'active',
    verified: true,
    rating: 4.95,
    rating_count: 215
  },
  {
    id: 'sel-3',
    user_id: 'd3333333-3333-3333-3333-333333333333',
    business_name: 'Tokyo Precision Optics & Robotics',
    store_name: 'Tokyo Precision Optics & Robotics',
    description: 'High-end mirrorless cameras, cinematography lenses, 4K drones, and precision consumer robotics straight from Japan.',
    logo: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=200&q=80',
    cover: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    phone: '+81 3 5555 0143',
    email: 'trade@tokyoprecision.jp',
    country: 'Japan',
    city: 'Tokyo',
    district: 'Tokyo',
    sector: 'Ginza',
    address: '6-10-1 Ginza, Chuo-ku, Tokyo 104-0061',
    status: 'active',
    verified: true,
    rating: 4.88,
    rating_count: 180
  }
];

// -------------------------------------------------------------
// Initial International Products (Base Prices in USD)
// -------------------------------------------------------------
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    seller_id: 'sel-1',
    seller_name: 'Apex Global Tech Solutions',
    seller_user_id: 'ef9b5076-0f6f-484d-b24e-f58db44990ed',
    category_id: 'cat-2',
    category_name: 'Electronics',
    subcategory: 'Laptops & Computers',
    name: 'Apple MacBook Air 13.6" M3 (16GB Unified RAM, 512GB SSD)',
    description: 'Supercharged by the cutting-edge 3-nanometer Apple M3 chip with 8-core CPU and 10-core GPU. Liquid Retina display with 500 nits brightness, MagSafe 3 charging, dual Thunderbolt 4 ports, and up to 18 hours of all-day battery life.',
    price: 1299,
    discount_price: 1199,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=85'
    ],
    quantity: 35,
    sku: 'MAC-M3-13-MID',
    brand: 'Apple',
    color: 'Midnight Black',
    status: 'approved',
    featured: true,
    rating: 4.95,
    review_count: 84,
    created_at: '2025-01-15T10:00:00Z'
  },
  {
    id: 'prod-2',
    seller_id: 'sel-1',
    seller_name: 'Apex Global Tech Solutions',
    seller_user_id: 'ef9b5076-0f6f-484d-b24e-f58db44990ed',
    category_id: 'cat-2',
    category_name: 'Electronics',
    subcategory: 'Smartphones',
    name: 'Samsung Galaxy S24 Ultra 5G (512GB, Titanium Aerospace Gray)',
    description: 'Powered by Galaxy AI live translation and Circle to Search. 200MP Quad Telephoto camera with 100x Space Zoom, titanium frame, 6.8" QHD+ 120Hz Dynamic AMOLED 2X flat display.',
    price: 1419,
    discount_price: 1299,
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1200&q=85'
    ],
    quantity: 40,
    sku: 'SAM-S24U-512-GRY',
    brand: 'Samsung',
    color: 'Titanium Gray',
    status: 'approved',
    featured: true,
    rating: 4.88,
    review_count: 112,
    created_at: '2025-01-16T10:00:00Z'
  },
  {
    id: 'prod-3',
    seller_id: 'sel-2',
    seller_name: 'Nordic & Milano Luxury Living',
    seller_user_id: 'ef9b5076-0f6f-484d-b24e-f58db44990ed',
    category_id: 'cat-1',
    category_name: 'Furniture & Home',
    subcategory: 'Tables & Chairs',
    name: 'Handcrafted Nordic Solid Oak Executive Dining Table (6-8 Seater)',
    description: 'Sculpted from sustainably certified European and East African white oak timber with hand-rubbed organic matte oil finish. Floating beveled edge design with reinforced internal steel core.',
    price: 890,
    discount_price: 749,
    images: [
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=85'
    ],
    quantity: 12,
    sku: 'OAK-TAB-08-NORD',
    brand: 'Nordic Artisans',
    color: 'Natural White Oak',
    status: 'approved',
    featured: true,
    rating: 5.0,
    review_count: 36,
    created_at: '2025-01-17T10:00:00Z'
  },
  {
    id: 'prod-4',
    seller_id: 'sel-2',
    seller_name: 'Nordic & Milano Luxury Living',
    seller_user_id: 'ef9b5076-0f6f-484d-b24e-f58db44990ed',
    category_id: 'cat-1',
    category_name: 'Furniture & Home',
    subcategory: 'Sofas & Couches',
    name: 'Modern Cloud Velvet Sectional 4-Piece Living Room Sofa',
    description: 'Ultra-deep seating with high-resiliency foam cushions and stain-resistant performance velvet upholstery. Modular configuration designed for spacious comfort.',
    price: 1150,
    discount_price: 990,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85'
    ],
    quantity: 8,
    sku: 'SOFA-CLD-04-GRY',
    brand: 'Milano Living',
    color: 'Slate Charcoal',
    status: 'approved',
    featured: true,
    rating: 4.92,
    review_count: 28,
    created_at: '2025-01-18T10:00:00Z'
  },
  {
    id: 'prod-5',
    seller_id: 'sel-1',
    seller_name: 'Apex Global Tech Solutions',
    seller_user_id: 'ef9b5076-0f6f-484d-b24e-f58db44990ed',
    category_id: 'cat-2',
    category_name: 'Electronics',
    subcategory: 'Audio & Speakers',
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    description: 'Two processors and eight microphones for unprecedented noise cancellation. Auto NC Optimizer, crystal clear hands-free calling with 4 beamforming mics, up to 30-hour battery life.',
    price: 399,
    discount_price: 348,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85'
    ],
    quantity: 50,
    sku: 'SONY-WH1000XM5-BLK',
    brand: 'Sony',
    color: 'Silver Platinum',
    status: 'approved',
    featured: true,
    rating: 4.9,
    review_count: 142,
    created_at: '2025-01-19T10:00:00Z'
  },
  {
    id: 'prod-6',
    seller_id: 'sel-2',
    seller_name: 'Nordic & Milano Luxury Living',
    seller_user_id: 'ef9b5076-0f6f-484d-b24e-f58db44990ed',
    category_id: 'cat-3',
    category_name: 'Fashion',
    subcategory: 'Watches & Jewelry',
    name: 'Milano Heritage Automatic Chronograph Sapphire Watch',
    description: 'Precision Swiss-caliber automatic mechanical movement with 42-hour power reserve. Anti-reflective sapphire crystal glass, 316L surgical stainless steel casing.',
    price: 580,
    discount_price: 495,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85'
    ],
    quantity: 20,
    sku: 'MIL-WAT-CHR-AUTO',
    brand: 'Milano Horology',
    color: 'Midnight Blue & Rose Gold',
    status: 'approved',
    featured: true,
    rating: 4.92,
    review_count: 67,
    created_at: '2025-01-20T10:00:00Z'
  },
  {
    id: 'prod-7',
    seller_id: 'sel-1',
    seller_name: 'Apex Global Tech Solutions',
    seller_user_id: 'ef9b5076-0f6f-484d-b24e-f58db44990ed',
    category_id: 'cat-8',
    category_name: 'Agriculture',
    subcategory: 'Irrigation Supplies',
    name: 'Solar-Powered Smart Drip Irrigation Kit & Controller (1 Hectare)',
    description: 'High-efficiency solar automated drip irrigation controller with pressure valves, micro-emitters, and soil moisture sensor for high-yield farming.',
    price: 450,
    discount_price: 390,
    images: [
      'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=1200&q=85'
    ],
    quantity: 30,
    sku: 'AGR-DRIP-SOL-01',
    brand: 'AgriTech Africa',
    color: 'Industrial Green',
    status: 'approved',
    featured: true,
    rating: 4.88,
    review_count: 19,
    created_at: '2025-01-21T10:00:00Z'
  },
  {
    id: 'prod-8',
    seller_id: 'sel-3',
    seller_name: 'Tokyo Precision Optics & Robotics',
    seller_user_id: 'ef9b5076-0f6f-484d-b24e-f58db44990ed',
    category_id: 'cat-9',
    category_name: 'Construction & Hardware',
    subcategory: 'Tools & Safety Gear',
    name: 'Heavy Duty 20V Cordless Brushless Rotary Hammer Drill Kit',
    description: 'Brushless motor delivering 2.6 Joules of impact energy. Includes 2x 4.0Ah Lithium batteries, rapid charger, and heavy-duty protective carry case.',
    price: 260,
    discount_price: 220,
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=85'
    ],
    quantity: 45,
    sku: 'TOOL-HAM-20V-MAX',
    brand: 'Apex Force',
    color: 'Industrial Orange',
    status: 'approved',
    featured: false,
    rating: 4.95,
    review_count: 42,
    created_at: '2025-01-22T10:00:00Z'
  },
  {
    id: 'prod-9',
    seller_id: 'sel-1',
    seller_name: 'Apex Global Tech Solutions',
    seller_user_id: 'ef9b5076-0f6f-484d-b24e-f58db44990ed',
    category_id: 'cat-7',
    category_name: 'Automotive',
    subcategory: 'Car Care & Tools',
    name: 'Professional OBD2 Diagnostic Bluetooth Scanner & ECU Code Reader',
    description: 'Comprehensive real-time engine diagnostics, ABS/SRS diagnostics, battery voltage check, and live sensor telemetry for all global OBDII vehicles.',
    price: 85,
    discount_price: 69,
    images: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=85'
    ],
    quantity: 60,
    sku: 'AUTO-OBD-SCAN-PRO',
    brand: 'DiagPro Global',
    color: 'Carbon Black',
    status: 'approved',
    featured: false,
    rating: 4.85,
    review_count: 53,
    created_at: '2025-01-23T10:00:00Z'
  },
  {
    id: 'prod-10',
    seller_id: 'sel-2',
    seller_name: 'Nordic & Milano Luxury Living',
    seller_user_id: 'ef9b5076-0f6f-484d-b24e-f58db44990ed',
    category_id: 'cat-4',
    category_name: 'Beauty & Personal Care',
    subcategory: 'Skincare',
    name: 'Organic African Botanical Anti-Aging Hydrating Facial Serum (50ml)',
    description: 'Enriched with cold-pressed Marula oil, Rwandan green tea polyphenols, and hyaluronic acid. Deeply revitalizes, tightens, and restores skin barrier.',
    price: 48,
    discount_price: 39,
    images: [
      'https://images.unsplash.com/photo-1608248597359-0a2b53549646?auto=format&fit=crop&w=1200&q=85'
    ],
    quantity: 100,
    sku: 'BEAUTY-SER-BOT-50',
    brand: 'Botanica Kigali',
    color: 'Amber Gold',
    status: 'approved',
    featured: false,
    rating: 4.97,
    review_count: 88,
    created_at: '2025-01-24T10:00:00Z'
  },
  {
    id: 'prod-11',
    seller_id: 'sel-2',
    seller_name: 'Nordic & Milano Luxury Living',
    seller_user_id: 'ef9b5076-0f6f-484d-b24e-f58db44990ed',
    category_id: 'cat-5',
    category_name: 'Home & Kitchen',
    subcategory: 'Kitchen Appliances (blenders, cookers, fridges)',
    name: '1500W High-Speed Commercial Grade Blender & Food Processor',
    description: 'Stainless steel Japanese 6-blade assembly, 2.0L BPA-free pitcher, 10 variable speed dials, and preset pulse mode for smoothies, nut butters, and hot soups.',
    price: 165,
    discount_price: 139,
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=1200&q=85'
    ],
    quantity: 40,
    sku: 'KIT-BLND-1500W',
    brand: 'ChefMaster Pro',
    color: 'Brushed Silver',
    status: 'approved',
    featured: false,
    rating: 4.91,
    review_count: 31,
    created_at: '2025-01-25T10:00:00Z'
  },
  {
    id: 'prod-12',
    seller_id: 'sel-1',
    seller_name: 'Apex Global Tech Solutions',
    seller_user_id: 'ef9b5076-0f6f-484d-b24e-f58db44990ed',
    category_id: 'cat-10',
    category_name: 'Sports & Outdoors',
    subcategory: 'Bicycles',
    name: 'Aluminum Alloy 27.5" Full Suspension Mountain Bike (21 Speed)',
    description: 'Lightweight hydroformed aluminum frame, dual hydraulic disc brakes, lockout suspension front fork, and Shimano gear system built for rugged terrain.',
    price: 520,
    discount_price: 460,
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=85'
    ],
    quantity: 18,
    sku: 'SPORT-MTB-275-ALU',
    brand: 'Apex Trails',
    color: 'Matte Blue & Lime',
    status: 'approved',
    featured: false,
    rating: 4.89,
    review_count: 24,
    created_at: '2025-01-26T10:00:00Z'
  }
];

// -------------------------------------------------------------
// Initial International Suppliers
// -------------------------------------------------------------
export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'f1000000-0000-0000-0000-000000000001',
    name: 'Shenzhen MicroTech & Silicon Manufacturing Corp',
    country: 'China',
    city: 'Shenzhen (Baoan High-Tech Park)',
    category: 'Electronics & Computing',
    phone: '+86 755 8899 4432',
    email: 'b2b-export@sz-microtech.cn',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80',
    description: 'ISO-9001 certified OEM/ODM electronics manufacturer specializing in custom PCBs, smart accessories, IoT devices, and computing peripherals.',
    products: ['OEM Tablets', 'Lithium Power Stations', 'Microchips', 'Commercial Displays', 'Smart Wearables'],
    verified: true,
    rating: 4.94,
    rating_count: 512
  },
  {
    id: 'f1000000-0000-0000-0000-000000000002',
    name: 'Frankfurt Precision Machinen & Solar Energy GmbH',
    country: 'Germany',
    city: 'Frankfurt am Main',
    category: 'Industrial & Robotics',
    phone: '+49 69 9002 8110',
    email: 'export@frankfurt-machinen.de',
    logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=200&q=80',
    description: 'World leader in automated food processing, commercial solar inverters, packaging robotics, and sustainable industrial solutions.',
    products: ['Commercial Solar Inverters', 'Automated Packaging Lines', 'CNC Milling Machines', 'Industrial Hydraulic Presses'],
    verified: true,
    rating: 4.91,
    rating_count: 320
  },
  {
    id: 'f1000000-0000-0000-0000-000000000003',
    name: 'London & Milan Global Textiles & Luxury Goods',
    country: 'United Kingdom',
    city: 'London (Mayfair District)',
    category: 'Luxury Fashion & Watches',
    phone: '+44 20 7946 0888',
    email: 'concierge@london-milantextiles.co.uk',
    logo: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=200&q=80',
    description: 'High-end wholesale luxury supplier partnering with over 200 European and global boutique apparel, leather goods, and fashion ateliers.',
    products: ['Fine Cashmere Fabrics', 'Haute Couture Apparel', 'Handmade Leather Goods', 'Horology Accessories'],
    verified: true,
    rating: 4.88,
    rating_count: 145
  },
  {
    id: 'f1000000-0000-0000-0000-000000000004',
    name: 'Osaka Precision Robotics & Optical Sensor Labs',
    country: 'Japan',
    city: 'Osaka (Umeda Innovation Hub)',
    category: 'Cameras & Drones',
    phone: '+81 6 6345 8820',
    email: 'global-inquiry@osakarobotics.jp',
    logo: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=200&q=80',
    description: 'Precision manufacturing of cinematography optics, aerospace sensors, commercial drones, and advanced micro-motors.',
    products: ['4K Optical Lenses', 'Drone Gimbal Stabilizers', 'Laser Rangefinders', 'Precision Stepper Motors'],
    verified: true,
    rating: 4.97,
    rating_count: 280
  }
];

// -------------------------------------------------------------
// Initial Sourcing Requests
// -------------------------------------------------------------
export const INITIAL_SOURCING_REQUESTS: SourcingRequest[] = [
  {
    id: 'src-1',
    tracking_code: 'ZND-GLB-8842',
    customer_name: 'Alexander Sterling',
    customer_phone: '+1 (415) 555-0198',
    customer_email: 'a.sterling@sterlingbrands.com',
    product_name: 'High-Capacity Automated Specialty Coffee Roaster & Packaging Line',
    quantity: 1,
    unit: 'Complete Production Line',
    country: 'Germany',
    budget: 45000,
    description: 'Seeking automated 60kg batch coffee roasting system with integrated degassing packaging and nitrogen flushing for international specialty brand export.',
    status: 'quoted',
    supplier_id: 'f1000000-0000-0000-0000-000000000002',
    supplier_name: 'Frankfurt Precision Machinen & Solar Energy GmbH',
    quote_amount: 41800,
    quote_notes: 'Includes ocean freight CIF destination port, installation supervision, and 2-year manufacturer comprehensive warranty.',
    tracking: [
      { status: 'requested', timestamp: '2025-02-10T08:00:00Z', note: 'RFQ received and assigned to global sourcing desk.' },
      { status: 'searching', timestamp: '2025-02-11T10:00:00Z', note: 'Matched with verified German & Swiss industrial manufacturers.' },
      { status: 'quoted', timestamp: '2025-02-13T14:00:00Z', note: 'Comprehensive quote secured at $41,800 USD from Frankfurt Machinen GmbH.' }
    ],
    admin_notes: 'Customer verified credit rating. Ready for escrow contract.',
    created_at: '2025-02-10T08:00:00Z'
  }
];

// -------------------------------------------------------------
// Initial Orders
// -------------------------------------------------------------
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-demo-1',
    user_id: 'ef9b5076-0f6f-484d-b24e-f58db44990ed',
    order_number: 'ZND-EXP-90214',
    tracking_code: 'ZND-EXP-90214',
    customer_name: 'Zendo Global Admin',
    customer_phone: '+1 (800) 842-9363',
    customer_email: 'zendogroup.limited@gmail.com',
    delivery_name: 'Zendo Global Logistics Hub',
    delivery_phone: '+1 (800) 842-9363',
    country: 'United States',
    state_province: 'California',
    city: 'San Francisco',
    postal_code: '94105',
    delivery_address: '500 Howard Street, Floor 14, San Francisco, CA 94105, United States',
    items: [
      {
        product_id: 'prod-1',
        name: 'Apple MacBook Air 13.6" M3 (16GB Unified RAM, 512GB SSD)',
        price: 1199,
        quantity: 1,
        seller_user_id: 'ef9b5076-0f6f-484d-b24e-f58db44990ed',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
      }
    ],
    seller_ids: ['sel-1'],
    subtotal: 1199,
    delivery_fee: 25,
    total_amount: 1224,
    total: 1224,
    currency: 'USD',
    status: 'delivered',
    payment_method: 'Credit/Debit Card (Stripe)',
    payment_status: 'paid',
    address: '500 Howard Street, Floor 14, San Francisco, CA',
    created_at: '2025-02-01T10:00:00Z'
  }
];

export const DEMO_USERS = [
  {
    id: '976d1d09-c8bd-4d57-916e-f68a3e1e9337',
    email: 'zendogroup.limited@gmail.com',
    full_name: 'Zendo Global Admin',
    role: 'admin' as const,
    phone: '+1 (800) 842-9363',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  }
];
