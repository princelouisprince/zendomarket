export type Language = 'en' | 'rw' | 'fr' | 'sw';

export interface Translations {
  // Common
  common: {
    loading: string;
    search: string;
    searchPlaceholder: string;
    welcome: string;
    login: string;
    register: string;
    logout: string;
    myAccount: string;
    myOrders: string;
    myWishlist: string;
    cart: string;
    checkout: string;
    continueShopping: string;
    addToCart: string;
    removeFromCart: string;
    updateQuantity: string;
    subtotal: string;
    total: string;
    shipping: string;
    freeShipping: string;
    applyCoupon: string;
    couponApplied: string;
    invalidCoupon: string;
    proceedToCheckout: string;
    emptyCart: string;
    yourCartIsEmpty: string;
    currency: string;
    language: string;
    darkMode: string;
    lightMode: string;
    back: string;
    next: string;
    previous: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    view: string;
    close: string;
    open: string;
    submit: string;
    confirm: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    yes: string;
    no: string;
    or: string;
    and: string;
    all: string;
    none: string;
    searchResults: string;
    noResults: string;
    filter: string;
    sort: string;
    sortBy: string;
    price: string;
    rating: string;
    newest: string;
    popularity: string;
    relevance: string;
    page: string;
    of: string;
    itemsPerPage: string;
    showing: string;
    to: string;
    results: string;
    clear: string;
    select: string;
    selected: string;
    loadingData: string;
    pleaseWait: string;
    refresh: string;
    retry: string;
    errorOccurred: string;
    tryAgain: string;
    networkError: string;
    serverError: string;
    unknownError: string;
  };

  // Navigation
  nav: {
    home: string;
    products: string;
    categories: string;
    sellers: string;
    sourcing: string;
    becomeSeller: string;
    trackOrder: string;
    about: string;
    contact: string;
    faq: string;
    terms: string;
    privacy: string;
    language: string;
    currency: string;
    profile: string;
    dashboard: string;
    settings: string;
    logout: string;
    browse: string;
    source: string;
    sell: string;
    suppliers: string;
    searchPlaceholder: string;
  };

  // Hero
  hero: {
    title: string;
    subtitle: string;
    punchline: string;
    shopProducts: string;
    becomeSeller: string;
    sourceProduct: string;
    findSuppliers: string;
    cta1: string;
    cta2: string;
    cta3: string;
    featured1: string;
    featured2: string;
    featured3: string;
    // Slide badges
    slide1Badge: string;
    slide2Badge: string;
    slide3Badge: string;
    slide4Badge: string;
    // Slide titles
    slide1Title1: string;
    slide1Title2: string;
    slide2Title1: string;
    slide2Title2: string;
    slide3Title1: string;
    slide3Title2: string;
    slide4Title1: string;
    slide4Title2: string;
    // Slide subtitles
    slide1Sub: string;
    slide2Sub: string;
    slide3Sub: string;
    slide4Sub: string;
    // Slide CTAs
    slide1Cta1: string;
    slide1Cta2: string;
    slide2Cta1: string;
    slide2Cta2: string;
    slide3Cta1: string;
    slide3Cta2: string;
    slide4Cta1: string;
    slide4Cta2: string;
    // Hero search
    heroSearchPlaceholder: string;
    heroSearchBtn: string;
    // Trust badges
    trustEscrow: string;
    trustShipping: string;
    trustReturn: string;
  };

  // Home page sections
  home: {
    popularCategories: string;
    popularCategoriesSubtitle: string;
    exploreAll: string;
    flashDeals: string;
    flashDealsSubtitle: string;
    promotionEndsIn: string;
    trendingCatalog: string;
    trendingCatalogSubtitle: string;
    tabFeatured: string;
    tabDeals: string;
    tabNew: string;
    merchantHub: string;
    merchantHubTitle: string;
    merchantHubSubtitle: string;
    applyMerchant: string;
    learnMore: string;
    rfqBadge: string;
    rfqTitle1: string;
    rfqTitle2: string;
    rfqSubtitle: string;
    submitRfq: string;
    suppliersTitle: string;
    suppliersSubtitle: string;
    viewDirectory: string;
    verifiedPartner: string;
    items: string;
  };

  // Products
  products: {
    allProducts: string;
    featuredProducts: string;
    newArrivals: string;
    bestSellers: string;
    onSale: string;
    inStock: string;
    outOfStock: string;
    limitedStock: string;
    freeDelivery: string;
    codAvailable: string;
    verifiedSeller: string;
    addToWishlist: string;
    removeFromWishlist: string;
    quickView: string;
    viewDetails: string;
    productDetails: string;
    description: string;
    specifications: string;
    reviews: string;
    writeReview: string;
    relatedProducts: string;
    frequentlyBoughtTogether: string;
    youMayAlsoLike: string;
    quantity: string;
    sku: string;
    brand: string;
    category: string;
    seller: string;
    rating: string;
    reviewsCount: string;
    inWishlist: string;
    addedToCart: string;
    addedToWishlist: string;
    removedFromCart: string;
    removedFromWishlist: string;
  };

  // Categories
  categories: {
    allCategories: string;
    electronics: string;
    fashion: string;
    home: string;
    automotive: string;
    sports: string;
    health: string;
    industrial: string;
    cameras: string;
    appliances: string;
    solar: string;
    food: string;
    drones: string;
  };

  // Auth
  auth: {
    login: string;
    register: string;
    forgotPassword: string;
    resetPassword: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    phone: string;
    rememberMe: string;
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    forgotTitle: string;
    forgotSubtitle: string;
    resetTitle: string;
    resetSubtitle: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    signIn: string;
    signUp: string;
    sendResetLink: string;
    backToLogin: string;
    passwordResetSent: string;
    passwordChanged: string;
    loginSuccess: string;
    registerSuccess: string;
    loginError: string;
    registerError: string;
    resetError: string;
    invalidCredentials: string;
    emailAlreadyExists: string;
    weakPassword: string;
    passwordMismatch: string;
    emailRequired: string;
    passwordRequired: string;
    nameRequired: string;
  };

  // Checkout
  checkout: {
    title: string;
    subtitle: string;
    customerInfo: string;
    shippingAddress: string;
    billingAddress: string;
    paymentMethod: string;
    orderSummary: string;
    placeOrder: string;
    processing: string;
    orderSuccess: string;
    orderFailed: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
    saveAddress: string;
    useSavedAddress: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolder: string;
    saveCard: string;
    payWithCard: string;
    payWithPayPal: string;
    payWithMobileMoney: string;
    cashOnDelivery: string;
    deliveryInstructions: string;
    estimatedDelivery: string;
    deliveryOptions: string;
    standardDelivery: string;
    expressDelivery: string;
    sameDayDelivery: string;
    freeDelivery: string;
    pickup: string;
    termsAndConditions: string;
    agreeToTerms: string;
    orderConfirmation: string;
    orderNumber: string;
    trackingNumber: string;
    estimatedArrival: string;
    deliveryAddress: string;
    contactInfo: string;
    orderPlaced: string;
    thankYouForOrder: string;
    emailConfirmation: string;
    trackOrderStatus: string;
  };

  // Orders
  orders: {
    myOrders: string;
    orderHistory: string;
    orderDetails: string;
    orderStatus: string;
    tracking: string;
    orderDate: string;
    orderTotal: string;
    orderItems: string;
    shippingAddress: string;
    paymentMethod: string;
    paymentStatus: string;
    pending: string;
    confirmed: string;
    processing: string;
    shipped: string;
    delivered: string;
    cancelled: string;
    refunded: string;
    statusHistory: string;
    trackPackage: string;
    contactSupport: string;
    reorder: string;
    cancelOrder: string;
    returnOrder: string;
    viewInvoice: string;
    downloadInvoice: string;
    noOrders: string;
    noOrdersMessage: string;
  };

  // Wishlist
  wishlist: {
    myWishlist: string;
    addToCart: string;
    removeFromWishlist: string;
    moveToCart: string;
    emptyWishlist: string;
    emptyWishlistMessage: string;
    addToCartSuccess: string;
    removeFromWishlistSuccess: string,
  };

  // Seller Dashboard
  seller: {
    dashboard: string;
    overview: string;
    products: string;
    settings: string;
    addProduct: string;
    editProduct: string;
    deleteProduct: string;
    productDetails: string;
    productImages: string;
    productPricing: string;
    productInventory: string;
    productShipping: string;
    sales: string;
    revenue: string;
    orders: string;
    customers: string;
    reviews: string;
    earnings: string;
    payouts: string;
    storeSettings: string;
    profileSettings: string;
    paymentSettings: string;
    shippingSettings: string;
    notificationSettings: string;
    analytics: string;
    performance: string;
    topProducts: string;
    recentOrders: string;
    customerFeedback: string;
    salesChart: string;
    revenueChart: string;
    orderChart: string;
    customerChart: string;
    totalSales: string;
    totalRevenue: string;
    totalOrders: string;
    totalCustomers: string;
    averageRating: string;
    responseTime: string;
    fulfillmentRate: string;
    returnRate: string;
    pendingProducts: string;
    approvedProducts: string;
    rejectedProducts: string;
    activeOrders: string;
    completedOrders: string;
    pendingPayouts: string;
    completedPayouts: string,
    totalEarnings: string;
    availableBalance: string;
    withdraw: string;
    withdrawalHistory: string;
    bankAccount: string;
    mobileMoney: string;
    payoutRequest: string;
    payoutProcessing: string;
    payoutCompleted: string;
    payoutFailed: string;
  };

  // Admin Dashboard
  admin: {
    dashboard: string;
    overview: string;
    users: string;
    sellers: string;
    products: string;
    orders: string;
    categories: string;
    settings: string;
    analytics: string;
    reports: string;
    logs: string;
    totalUsers: string;
    totalSellers: string;
    totalProducts: string;
    totalOrders: string;
    totalRevenue: string;
    pendingApprovals: string;
    activeSellers: string;
    activeProducts: string;
    recentActivity: string;
    systemHealth: string;
    databaseStatus: string;
    apiStatus: string;
    storageStatus: string;
    performance: string;
    uptime: string;
    responseTime: string;
    errorRate: string;
    bandwidth: string;
    storage: string;
    usersChart: string;
    sellersChart: string;
    productsChart: string;
    ordersChart: string;
    revenueChart: string;
    approveUser: string;
    rejectUser: string;
    approveSeller: string;
    rejectSeller: string;
    approveProduct: string;
    rejectProduct: string;
    suspendUser: string;
    suspendSeller: string;
    suspendProduct: string;
    deleteProduct: string;
    editCategory: string;
    addCategory: string;
    deleteCategory: string;
    systemSettings: string;
    emailSettings: string;
    paymentSettings: string;
    shippingSettings: string;
    taxSettings: string;
    securitySettings: string;
    maintenanceMode: string;
    backup: string;
    restore: string;
    exportData: string;
    importData: string,
    generateReport: string;
    viewLogs: string;
    clearLogs: string;
  };

  // Sourcing
  sourcing: {
    title: string;
    subtitle: string;
    submitRequest: string;
    myRequests: string;
    requestStatus: string;
    product: string;
    quantity: string;
    unit: string;
    budget: string;
    description: string;
    country: string;
    submit: string;
    submitted: string;
    processing: string;
    quoted: string;
    approved: string;
    paid: string;
    inTransit: string;
    delivered: string;
    cancelled: string;
    tracking: string;
    supplier: string;
    quote: string;
    notes: string;
    history: string;
    submitSuccess: string;
    submitError: string;
    noRequests: string;
    noRequestsMessage: string;
  };

  // About
  about: {
    title: string;
    subtitle: string;
    mission: string;
    vision: string;
    values: string;
    story: string;
    team: string;
    partners: string;
    careers: string;
    contact: string;
    location: string;
    hours: string;
    phone: string;
    email: string;
    address: string;
  };

  // Footer
  footer: {
    aboutUs: string;
    customerService: string;
    myAccount: string;
    followUs: string;
    newsletter: string;
    subscribe: string;
    subscribeSuccess: string;
    subscribeError: string;
    copyright: string;
    allRightsReserved: string;
    termsOfService: string;
    privacyPolicy: string;
    cookiePolicy: string;
    sitemap: string;
    contactUs: string;
    faq: string;
    shipping: string;
    returns: string;
    sizeGuide: string;
    storeLocator: string;
    giftCards: string;
    affiliate: string;
    studentDiscount: string;
    militaryDiscount: string;
    firstResponderDiscount: string;
    // Extended Footer Elements
    trust1Title: string;
    trust1Desc: string;
    trust2Title: string;
    trust2Desc: string;
    trust3Title: string;
    trust3Desc: string;
    trust4Title: string;
    trust4Desc: string;
    brandDescription: string;
    headquarters: string;
    phoneSupport: string;
    marketplaceTitle: string;
    allProductsCatalog: string;
    verifiedSuppliers: string;
    factorySourcingRfq: string;
    trackOrderStatus: string;
    merchantHubTitle: string;
    applyVerifiedSeller: string;
    sellerOperationsHub: string;
    aboutZendoRwanda: string;
    acceptedPaymentsTitle: string;
    acceptedPaymentsDesc: string;
    momoPayment: string;
    airtelPayment: string;
    visaPayment: string;
    mastercardPayment: string;
    cashOnDelivery: string;
    allRightsReservedText: string;
  };

  // Errors
  errors: {
    pageNotFound: string;
    pageNotFoundMessage: string;
    goHome: string;
    serverError: string;
    serverErrorMessage: string;
    tryAgain: string;
    somethingWentWrong: string;
    unexpectedError: string;
  };

  // Success
  success: {
    operationComplete: string;
    dataSaved: string;
    changesApplied: string;
    requestSubmitted: string;
    emailSent: string;
    passwordReset: string;
    accountCreated: string;
    loggedOut: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      loading: 'Loading...',
      search: 'Search',
      searchPlaceholder: 'Search products, categories...',
      welcome: 'Welcome',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      myAccount: 'My Account',
      myOrders: 'My Orders',
      myWishlist: 'My Wishlist',
      cart: 'Cart',
      checkout: 'Checkout',
      continueShopping: 'Continue Shopping',
      addToCart: 'Add to Cart',
      removeFromCart: 'Remove from Cart',
      updateQuantity: 'Update Quantity',
      subtotal: 'Subtotal',
      total: 'Total',
      shipping: 'Shipping',
      freeShipping: 'Free Shipping',
      applyCoupon: 'Apply Coupon',
      couponApplied: 'Coupon Applied',
      invalidCoupon: 'Invalid Coupon',
      proceedToCheckout: 'Proceed to Checkout',
      emptyCart: 'Your cart is empty',
      yourCartIsEmpty: 'Your cart is empty',
      currency: 'Currency',
      language: 'Language',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      close: 'Close',
      open: 'Open',
      submit: 'Submit',
      confirm: 'Confirm',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info',
      yes: 'Yes',
      no: 'No',
      or: 'or',
      and: 'and',
      all: 'All',
      none: 'None',
      searchResults: 'Search Results',
      noResults: 'No results found',
      filter: 'Filter',
      sort: 'Sort',
      sortBy: 'Sort by',
      price: 'Price',
      rating: 'Rating',
      newest: 'Newest',
      popularity: 'Popularity',
      relevance: 'Relevance',
      page: 'Page',
      of: 'of',
      itemsPerPage: 'items per page',
      showing: 'Showing',
      to: 'to',
      results: 'results',
      clear: 'Clear',
      select: 'Select',
      selected: 'Selected',
      loadingData: 'Loading data...',
      pleaseWait: 'Please wait...',
      refresh: 'Refresh',
      retry: 'Retry',
      errorOccurred: 'An error occurred',
      tryAgain: 'Please try again',
      networkError: 'Network error',
      serverError: 'Server error',
      unknownError: 'Unknown error',
    },
    nav: {
      home: 'Home',
      products: 'Products',
      categories: 'Categories',
      sellers: 'Sellers',
      sourcing: 'Sourcing',
      becomeSeller: 'Become Seller',
      trackOrder: 'Track Order',
      about: 'About',
      contact: 'Contact',
      faq: 'FAQ',
      terms: 'Terms',
      privacy: 'Privacy',
      language: 'Language',
      currency: 'Currency',
      profile: 'Profile',
      dashboard: 'Dashboard',
      settings: 'Settings',
      logout: 'Logout',
      browse: 'Browse',
      source: 'Source',
      sell: 'Sell',
      suppliers: 'Suppliers',
      searchPlaceholder: 'Search products, brands and sellers…',
    },
    hero: {
      title: 'ZENDO',
      subtitle: 'Your digital gateway to products, suppliers and markets.',
      punchline: 'Buy locally. Sell online. Source across Africa.',
      shopProducts: 'Shop Products',
      becomeSeller: 'Become a Seller',
      sourceProduct: 'Source a Product',
      findSuppliers: 'Find Suppliers',
      cta1: 'Shop Now',
      cta2: 'Become Seller',
      cta3: 'Track Order',
      featured1: 'Electronics',
      featured2: 'Fashion',
      featured3: 'Home & Living',
      slide1Badge: 'Premier Global Multi-Vendor Marketplace',
      slide2Badge: 'Express Worldwide Cross-Border Logistics',
      slide3Badge: 'Verified International Merchants & Brands',
      slide4Badge: 'Haute Horology, Fashion & Designer Goods',
      slide1Title1: 'Building Value.',
      slide1Title2: 'Empowering Global Growth.',
      slide2Title1: 'Next-Gen Tech &',
      slide2Title2: 'Industrial Direct Sourcing.',
      slide3Title1: 'Curated Luxury.',
      slide3Title2: 'Uncompromising Authenticity.',
      slide4Title1: 'Global Designer',
      slide4Title2: 'Bridging Continents & Trade.',
      slide1Sub: 'Connect with certified manufacturers, international tech distributors, and premium vendors worldwide with guaranteed escrow protection and direct air cargo.',
      slide2Sub: 'Streamline your international supply chain with direct OEM factory pricing, DHL Express delivery in 2–4 days, and multi-currency billing.',
      slide3Sub: 'Discover high-grade computing, smart home innovations, precision robotics, and designer collections with 100% verified authenticity seal.',
      slide4Sub: 'From Milan and London luxury fashion to Tokyo precision hardware — access thousands of curated international collections with end-to-end tracking.',
      slide1Cta1: 'Explore Marketplace',
      slide1Cta2: 'Global Sourcing (RFQ)',
      slide2Cta1: 'Browse Electronics',
      slide2Cta2: 'Verified Suppliers',
      slide3Cta1: 'Shop New Arrivals',
      slide3Cta2: 'Become a Global Seller',
      slide4Cta1: 'Explore Luxury & Fashion',
      slide4Cta2: 'Track Shipment',
      heroSearchPlaceholder: 'Search global products, brands & parts (e.g. MacBook M3, DJI Drone, S24 Ultra...)',
      heroSearchBtn: 'Search Worldwide',
      trustEscrow: '100% Escrow Buyer Protection',
      trustShipping: 'Worldwide Express Shipping',
      trustReturn: '14-Day Global Return Policy',
    },
    home: {
      popularCategories: 'Popular Global Categories',
      popularCategoriesSubtitle: 'Curated international catalog from certified global manufacturers and verified brands',
      exploreAll: 'Explore All Categories',
      flashDeals: 'Global Flash Deals',
      flashDealsSubtitle: 'Limited quantity factory-direct discounts with express dispatch',
      promotionEndsIn: 'Promotion ends in:',
      trendingCatalog: 'Trending International Catalog',
      trendingCatalogSubtitle: 'Explore authentic high-demand merchandise backed by Zendo 100% buyer escrow protection',
      tabFeatured: 'Featured',
      tabDeals: 'Top Discounts',
      tabNew: 'New Arrivals',
      merchantHub: 'International Merchant Hub',
      merchantHubTitle: 'Sell to Millions of Verified Global Buyers',
      merchantHubSubtitle: 'Launch your verified global storefront with 0 setup fees. Access multi-currency automated payouts, cross-border logistics integrations, and verified buyer networks.',
      applyMerchant: 'Apply as Global Merchant',
      learnMore: 'Learn More',
      rfqBadge: 'Worldwide Factory Sourcing (RFQ)',
      rfqTitle1: 'Global Factory Sourcing',
      rfqTitle2: 'Custom OEM Quotes in 24 Hours',
      rfqSubtitle: 'Looking for custom manufacturing, machinery, or wholesale electronics? Submit your specs and target budget. Our sourcing specialists negotiate directly with certified factories in Shenzhen, Frankfurt, Tokyo, and London.',
      submitRfq: 'Submit Sourcing RFQ',
      suppliersTitle: 'Verified Global Suppliers & Manufacturers',
      suppliersSubtitle: 'Direct B2B partner hubs across North America, Europe, Asia, and Africa',
      viewDirectory: 'View Full Directory',
      verifiedPartner: 'Verified Global Partner',
      items: 'items',
    },
    products: {
      allProducts: 'All Products',
      featuredProducts: 'Featured Products',
      newArrivals: 'New Arrivals',
      bestSellers: 'Best Sellers',
      onSale: 'On Sale',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      limitedStock: 'Limited Stock',
      freeDelivery: 'Free Delivery',
      codAvailable: 'COD Available',
      verifiedSeller: 'Verified Seller',
      addToWishlist: 'Add to Wishlist',
      removeFromWishlist: 'Remove from Wishlist',
      quickView: 'Quick View',
      viewDetails: 'View Details',
      productDetails: 'Product Details',
      description: 'Description',
      specifications: 'Specifications',
      reviews: 'Reviews',
      writeReview: 'Write a Review',
      relatedProducts: 'Related Products',
      frequentlyBoughtTogether: 'Frequently Bought Together',
      youMayAlsoLike: 'You May Also Like',
      quantity: 'Quantity',
      sku: 'SKU',
      brand: 'Brand',
      category: 'Category',
      seller: 'Seller',
      rating: 'Rating',
      reviewsCount: 'Reviews',
      inWishlist: 'In Wishlist',
      addedToCart: 'Added to Cart',
      addedToWishlist: 'Added to Wishlist',
      removedFromCart: 'Removed from Cart',
      removedFromWishlist: 'Removed from Wishlist',
    },
    categories: {
      allCategories: 'All Categories',
      electronics: 'Electronics',
      fashion: 'Fashion',
      home: 'Home',
      automotive: 'Automotive',
      sports: 'Sports',
      health: 'Health',
      industrial: 'Industrial',
      cameras: 'Cameras',
      appliances: 'Appliances',
      solar: 'Solar',
      food: 'Food',
      drones: 'Drones',
    },
    auth: {
      login: 'Login',
      register: 'Register',
      forgotPassword: 'Forgot Password',
      resetPassword: 'Reset Password',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      phone: 'Phone',
      rememberMe: 'Remember Me',
      loginTitle: 'Welcome Back',
      loginSubtitle: 'Sign in to your account',
      registerTitle: 'Create Account',
      registerSubtitle: 'Join ZENDO Marketplace',
      forgotTitle: 'Forgot Password',
      forgotSubtitle: 'Reset your password',
      resetTitle: 'Reset Password',
      resetSubtitle: 'Enter your new password',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      signIn: 'Sign In',
      signUp: 'Sign Up',
      sendResetLink: 'Send Reset Link',
      backToLogin: 'Back to Login',
      passwordResetSent: 'Password reset link sent',
      passwordChanged: 'Password changed successfully',
      loginSuccess: 'Login successful',
      registerSuccess: 'Registration successful',
      loginError: 'Login failed',
      registerError: 'Registration failed',
      resetError: 'Password reset failed',
      invalidCredentials: 'Invalid credentials',
      emailAlreadyExists: 'Email already exists',
      weakPassword: 'Password is too weak',
      passwordMismatch: 'Passwords do not match',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      nameRequired: 'Name is required',
    },
    checkout: {
      title: 'Checkout',
      subtitle: 'Complete your order',
      customerInfo: 'Customer Information',
      shippingAddress: 'Shipping Address',
      billingAddress: 'Billing Address',
      paymentMethod: 'Payment Method',
      orderSummary: 'Order Summary',
      placeOrder: 'Place Order',
      processing: 'Processing...',
      orderSuccess: 'Order placed successfully!',
      orderFailed: 'Order failed',
      firstName: 'First Name',
      lastName: 'Last Name',
      address: 'Address',
      city: 'City',
      state: 'State/Province',
      postalCode: 'Postal Code',
      country: 'Country',
      phone: 'Phone',
      email: 'Email',
      saveAddress: 'Save Address',
      useSavedAddress: 'Use Saved Address',
      cardNumber: 'Card Number',
      expiryDate: 'Expiry Date',
      cvv: 'CVV',
      cardHolder: 'Card Holder',
      saveCard: 'Save Card',
      payWithCard: 'Pay with Card',
      payWithPayPal: 'Pay with PayPal',
      payWithMobileMoney: 'Pay with Mobile Money',
      cashOnDelivery: 'Cash on Delivery',
      deliveryInstructions: 'Delivery Instructions',
      estimatedDelivery: 'Estimated Delivery',
      deliveryOptions: 'Delivery Options',
      standardDelivery: 'Standard Delivery',
      expressDelivery: 'Express Delivery',
      sameDayDelivery: 'Same Day Delivery',
      freeDelivery: 'Free Delivery',
      pickup: 'Pickup',
      termsAndConditions: 'Terms and Conditions',
      agreeToTerms: 'I agree to the terms and conditions',
      orderConfirmation: 'Order Confirmation',
      orderNumber: 'Order Number',
      trackingNumber: 'Tracking Number',
      estimatedArrival: 'Estimated Arrival',
      deliveryAddress: 'Delivery Address',
      contactInfo: 'Contact Information',
      orderPlaced: 'Order Placed',
      thankYouForOrder: 'Thank you for your order!',
      emailConfirmation: 'You will receive an email confirmation',
      trackOrderStatus: 'Track your order status',
    },
    orders: {
      myOrders: 'My Orders',
      orderHistory: 'Order History',
      orderDetails: 'Order Details',
      orderStatus: 'Order Status',
      tracking: 'Tracking',
      orderDate: 'Order Date',
      orderTotal: 'Order Total',
      orderItems: 'Order Items',
      shippingAddress: 'Shipping Address',
      paymentMethod: 'Payment Method',
      paymentStatus: 'Payment Status',
      pending: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded',
      statusHistory: 'Status History',
      trackPackage: 'Track Package',
      contactSupport: 'Contact Support',
      reorder: 'Reorder',
      cancelOrder: 'Cancel Order',
      returnOrder: 'Return Order',
      viewInvoice: 'View Invoice',
      downloadInvoice: 'Download Invoice',
      noOrders: 'No Orders',
      noOrdersMessage: 'You have no orders yet',
    },
    wishlist: {
      myWishlist: 'My Wishlist',
      addToCart: 'Add to Cart',
      removeFromWishlist: 'Remove from Wishlist',
      moveToCart: 'Move to Cart',
      emptyWishlist: 'Empty Wishlist',
      emptyWishlistMessage: 'Your wishlist is empty',
      addToCartSuccess: 'Added to cart',
      removeFromWishlistSuccess: 'Removed from wishlist',
    },
    seller: {
      dashboard: 'Seller Dashboard',
      overview: 'Overview',
      products: 'Products',
      settings: 'Settings',
      addProduct: 'Add Product',
      editProduct: 'Edit Product',
      deleteProduct: 'Delete Product',
      productDetails: 'Product Details',
      productImages: 'Product Images',
      productPricing: 'Product Pricing',
      productInventory: 'Product Inventory',
      productShipping: 'Product Shipping',
      sales: 'Sales',
      revenue: 'Revenue',
      orders: 'Orders',
      customers: 'Customers',
      reviews: 'Reviews',
      earnings: 'Earnings',
      payouts: 'Payouts',
      storeSettings: 'Store Settings',
      profileSettings: 'Profile Settings',
      paymentSettings: 'Payment Settings',
      shippingSettings: 'Shipping Settings',
      notificationSettings: 'Notification Settings',
      analytics: 'Analytics',
      performance: 'Performance',
      topProducts: 'Top Products',
      recentOrders: 'Recent Orders',
      customerFeedback: 'Customer Feedback',
      salesChart: 'Sales Chart',
      revenueChart: 'Revenue Chart',
      orderChart: 'Order Chart',
      customerChart: 'Customer Chart',
      totalSales: 'Total Sales',
      totalRevenue: 'Total Revenue',
      totalOrders: 'Total Orders',
      totalCustomers: 'Total Customers',
      averageRating: 'Average Rating',
      responseTime: 'Response Time',
      fulfillmentRate: 'Fulfillment Rate',
      returnRate: 'Return Rate',
      pendingProducts: 'Pending Products',
      approvedProducts: 'Approved Products',
      rejectedProducts: 'Rejected Products',
      activeOrders: 'Active Orders',
      completedOrders: 'Completed Orders',
      pendingPayouts: 'Pending Payouts',
      completedPayouts: 'Completed Payouts',
      totalEarnings: 'Total Earnings',
      availableBalance: 'Available Balance',
      withdraw: 'Withdraw',
      withdrawalHistory: 'Withdrawal History',
      bankAccount: 'Bank Account',
      mobileMoney: 'Mobile Money',
      payoutRequest: 'Payout Request',
      payoutProcessing: 'Payout Processing',
      payoutCompleted: 'Payout Completed',
      payoutFailed: 'Payout Failed',
    },
    admin: {
      dashboard: 'Admin Dashboard',
      overview: 'Overview',
      users: 'Users',
      sellers: 'Sellers',
      products: 'Products',
      orders: 'Orders',
      categories: 'Categories',
      settings: 'Settings',
      analytics: 'Analytics',
      reports: 'Reports',
      logs: 'Logs',
      totalUsers: 'Total Users',
      totalSellers: 'Total Sellers',
      totalProducts: 'Total Products',
      totalOrders: 'Total Orders',
      totalRevenue: 'Total Revenue',
      pendingApprovals: 'Pending Approvals',
      activeSellers: 'Active Sellers',
      activeProducts: 'Active Products',
      recentActivity: 'Recent Activity',
      systemHealth: 'System Health',
      databaseStatus: 'Database Status',
      apiStatus: 'API Status',
      storageStatus: 'Storage Status',
      performance: 'Performance',
      uptime: 'Uptime',
      responseTime: 'Response Time',
      errorRate: 'Error Rate',
      bandwidth: 'Bandwidth',
      storage: 'Storage',
      usersChart: 'Users Chart',
      sellersChart: 'Sellers Chart',
      productsChart: 'Products Chart',
      ordersChart: 'Orders Chart',
      revenueChart: 'Revenue Chart',
      approveUser: 'Approve User',
      rejectUser: 'Reject User',
      approveSeller: 'Approve Seller',
      rejectSeller: 'Reject Seller',
      approveProduct: 'Approve Product',
      rejectProduct: 'Reject Product',
      suspendUser: 'Suspend User',
      suspendSeller: 'Suspend Seller',
      suspendProduct: 'Suspend Product',
      deleteProduct: 'Delete Product',
      editCategory: 'Edit Category',
      addCategory: 'Add Category',
      deleteCategory: 'Delete Category',
      systemSettings: 'System Settings',
      emailSettings: 'Email Settings',
      paymentSettings: 'Payment Settings',
      shippingSettings: 'Shipping Settings',
      taxSettings: 'Tax Settings',
      securitySettings: 'Security Settings',
      maintenanceMode: 'Maintenance Mode',
      backup: 'Backup',
      restore: 'Restore',
      exportData: 'Export Data',
      importData: 'Import Data',
      generateReport: 'Generate Report',
      viewLogs: 'View Logs',
      clearLogs: 'Clear Logs',
    },
    sourcing: {
      title: 'Global Sourcing',
      subtitle: 'Request products from international suppliers',
      submitRequest: 'Submit Request',
      myRequests: 'My Requests',
      requestStatus: 'Request Status',
      product: 'Product',
      quantity: 'Quantity',
      unit: 'Unit',
      budget: 'Budget',
      description: 'Description',
      country: 'Country',
      submit: 'Submit',
      submitted: 'Submitted',
      processing: 'Processing',
      quoted: 'Quoted',
      approved: 'Approved',
      paid: 'Paid',
      inTransit: 'In Transit',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      tracking: 'Tracking',
      supplier: 'Supplier',
      quote: 'Quote',
      notes: 'Notes',
      history: 'History',
      submitSuccess: 'Request submitted successfully',
      submitError: 'Failed to submit request',
      noRequests: 'No Requests',
      noRequestsMessage: 'You have no sourcing requests',
    },
    about: {
      title: 'About Us',
      subtitle: 'Learn more about ZENDO Marketplace',
      mission: 'Our Mission',
      vision: 'Our Vision',
      values: 'Our Values',
      story: 'Our Story',
      team: 'Our Team',
      partners: 'Our Partners',
      careers: 'Careers',
      contact: 'Contact',
      location: 'Location',
      hours: 'Hours',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
    },
    footer: {
      aboutUs: 'About Us',
      customerService: 'Customer Service',
      myAccount: 'My Account',
      followUs: 'Follow Us',
      newsletter: 'Newsletter',
      subscribe: 'Subscribe',
      subscribeSuccess: 'Subscribed successfully',
      subscribeError: 'Subscription failed',
      copyright: 'Copyright',
      allRightsReserved: 'All rights reserved',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      cookiePolicy: 'Cookie Policy',
      sitemap: 'Sitemap',
      contactUs: 'Contact Us',
      faq: 'FAQ',
      shipping: 'Shipping',
      returns: 'Returns',
      sizeGuide: 'Size Guide',
      storeLocator: 'Store Locator',
      giftCards: 'Gift Cards',
      affiliate: 'Affiliate',
      studentDiscount: 'Student Discount',
      militaryDiscount: 'Military Discount',
      firstResponderDiscount: 'First Responder Discount',
      trust1Title: '100% Escrow Protection',
      trust1Desc: 'Certified verified merchants',
      trust2Title: 'Rwanda Nationwide Courier',
      trust2Desc: 'Door-to-door delivery across all 30 districts',
      trust3Title: '24/7 Customer Support',
      trust3Desc: 'Hotline: +250 793 032 430',
      trust4Title: 'Global Factory Sourcing',
      trust4Desc: 'Direct quotes from verified manufacturing hubs',
      brandDescription: "Building Value. Empowering Growth. ZENDO is Rwanda's premier multi-vendor marketplace connecting verified vendors, global suppliers, and consumers with seamless MTN MoMo, Airtel Money, and card checkout.",
      headquarters: 'Headquarters: Kigali City Center, Nyarugenge, Kigali, Rwanda',
      phoneSupport: 'Phone / WhatsApp: +250 793 032 430',
      marketplaceTitle: 'Marketplace',
      allProductsCatalog: 'All Products Catalog',
      verifiedSuppliers: 'Verified Suppliers',
      factorySourcingRfq: 'Factory Sourcing RFQ',
      trackOrderStatus: 'Track Order Status',
      merchantHubTitle: 'Merchant Hub',
      applyVerifiedSeller: 'Apply as Verified Seller',
      sellerOperationsHub: 'Seller Operations Hub',
      aboutZendoRwanda: 'About ZENDO Rwanda',
      acceptedPaymentsTitle: 'Accepted Payments',
      acceptedPaymentsDesc: 'Instant local MoMo and international cards:',
      momoPayment: 'MTN MoMo (*182#)',
      airtelPayment: 'Airtel Money (*185#)',
      visaPayment: 'Visa',
      mastercardPayment: 'Mastercard',
      cashOnDelivery: 'Cash on Delivery',
      allRightsReservedText: 'ZENDO Marketplace Rwanda. All rights reserved. Building Value. Empowering Growth.',
    },
    errors: {
      pageNotFound: 'Page Not Found',
      pageNotFoundMessage: 'The page you are looking for does not exist',
      goHome: 'Go Home',
      serverError: 'Server Error',
      serverErrorMessage: 'Something went wrong on our end',
      tryAgain: 'Please try again later',
      somethingWentWrong: 'Something went wrong',
      unexpectedError: 'An unexpected error occurred',
    },
    success: {
      operationComplete: 'Operation completed successfully',
      dataSaved: 'Data saved successfully',
      changesApplied: 'Changes applied successfully',
      requestSubmitted: 'Request submitted successfully',
      emailSent: 'Email sent successfully',
      passwordReset: 'Password reset successfully',
      accountCreated: 'Account created successfully',
      loggedOut: 'Logged out successfully',
    },
  },
  rw: {
    common: {
      loading: 'Inyirisha...',
      search: 'Shakisha',
      searchPlaceholder: 'Shakisha ibicuruzwa, uduciro...',
      welcome: 'Murakaza neza',
      login: 'Kwinjira',
      register: 'Iyandikishe',
      logout: 'Sohoka',
      myAccount: 'Akonti yanjye',
      myOrders: 'I biriherwe njanje',
      myWishlist: 'Imyaka yanjye',
      cart: 'Akonti',
      checkout: 'Ihindura',
      continueShopping: 'Komeza ugura',
      addToCart: 'Shyiramo muri konti',
      removeFromCart: 'Kura muri konti',
      updateQuantity: 'Hindura umubare',
      subtotal: 'Igiteranyo',
      total: 'Igiteranyo rihuse',
      shipping: 'Itumba',
      freeShipping: 'Itumba bure',
      applyCoupon: 'Shyiramo kuponu',
      couponApplied: 'Kuponu yashyizweho',
      invalidCoupon: 'Kuponi si yo',
      proceedToCheckout: 'Komeza guhindura',
      emptyCart: 'Konti yawe iraguye',
      yourCartIsEmpty: 'Konti yawe iraguye',
      currency: 'Ifaranga',
      language: 'Ururimi',
      darkMode: 'Ubumweru',
      lightMode: 'Umunyu',
      back: 'Subira inyuma',
      next: 'Komeza',
      previous: 'Ibanjirije',
      save: 'Bika',
      cancel: 'Kureka',
      delete: 'Siba',
      edit: 'Hindura',
      view: 'Reba',
      close: 'Funga',
      open: 'Vura',
      submit: 'Ohereza',
      confirm: 'Emeza',
      success: 'Byakunze',
      error: 'Ikosa',
      warning: 'Iburira',
      info: 'Ibisobanuro',
      yes: 'Yego',
      no: 'Oya',
      or: 'cyangwa',
      and: 'na',
      all: 'Byose',
      none: 'Nta na kimwe',
      searchResults: 'Ibisakishwa',
      noResults: 'Nta bisakishwa bibonetse',
      filter: 'Guhitamo',
      sort: 'Itonderanya',
      sortBy: 'Itonderanya',
      price: 'Igiciro',
      rating: 'Icyemezo',
      newest: 'Zemashya',
      popularity: 'Ibyifuzwa',
      relevance: 'Ubusobanuro',
      page: 'Paji',
      of: 'ya',
      itemsPerPage: 'ibintu buri paji',
      showing: 'erekana',
      to: 'kugeza',
      results: 'ibisakishwa',
      clear: 'Siba',
      select: 'Hitamo',
      selected: 'Byahiswe',
      loadingData: 'Iyirira ibyavuga...',
      pleaseWait: 'Nyamunekerezwa...',
      refresh: 'Kongera amakuru',
      retry: 'Gerageza nanone',
      errorOccurred: 'Habaye ikosa',
      tryAgain: 'Gerageza nanone',
      networkError: 'Ikosa ya murandasi',
      serverError: 'Ikosa ya seriveri',
      unknownError: 'Ikosa itazwi',
    },
    nav: {
      home: 'Ahabanza',
      products: 'Ibicuruzwa',
      categories: 'Uduciro',
      sellers: 'Abaguzi',
      sourcing: 'Gukora ibicuruzwa',
      becomeSeller: 'Ube umuguzi',
      trackOrder: 'Kureba ibiriherwe',
      about: 'Ibyerekeye',
      contact: 'Twandikire',
      faq: 'Ibibazo',
      terms: 'Amabwiriza',
      privacy: 'Ubuhanzi',
      language: 'Ururimi',
      currency: 'Ifaranga',
      profile: 'Umwirondoro',
      dashboard: 'Konti',
      settings: 'Igenzura',
      logout: 'Sohoka',
      browse: 'Reba',
      source: 'Gushaka',
      sell: 'Gurisha',
      suppliers: 'Abatunga',
      searchPlaceholder: 'Shakisha ibicuruzwa, brands no gucuruza…',
    },
    hero: {
      title: 'ZENDO',
      subtitle: "Irembo ryawe rya digitale ku bicuruzwa, abagemura n'amasoko.",
      punchline: 'Gura hafi. Gurisha kuri murandasi. Shakira muri Afurika yose.',
      shopProducts: 'Gura Ibicuruzwa',
      becomeSeller: 'Ba Umucuruzi',
      sourceProduct: 'Tumiza Igicuruzwa',
      findSuppliers: 'Shaka Abagemuzi',
      cta1: 'Gura',
      cta2: 'Ube umuguzi',
      cta3: 'Kureba ibiriherwe',
      featured1: 'Ikoranabuhanga',
      slide1Badge: 'Isoko Nini y\'Isi Yose',
      slide2Badge: 'Koherezwa vuba mu Isi Yose',
      slide3Badge: 'Abaguzi n\'Amasoko Yemejwe',
      slide4Badge: 'Imideli y\'Isi Yose n\'Ubwiza',
      slide1Title1: 'Gukora agaciro.',
      slide1Title2: 'Gutera imbere mu Isi Yose.',
      slide2Title1: 'Ikoranabuhanga rishya &',
      slide2Title2: 'Ibicuruzwa vya Inganda.',
      slide3Title1: 'Ubwiza bwatoranyijwe.',
      slide3Title2: 'Ukuri kw\'ikirenga.',
      slide4Title1: 'Imideli y\'Isi Yose',
      slide4Title2: 'Guhuza ibihugu & ubucuruzi.',
      slide1Sub: 'Huza n\'ababari bemejwe, abasangiji b\'ikoranabuhanga mpuzamahanga, n\'abaguzi b\'hafi, hamwe n\'uburinzi bw\'amafaranga.',
      slide2Sub: 'Unguka imishinga yawe y\'mpuzamahanga hamwe n\'ibiciro bya OEM, itumanaho ryihuse mu minsi 2-4, n\'amafaranga menshi.',
      slide3Sub: 'Menya ibikoresho by\'ikoranabuhanga, ubukungu bw\'amazu, robotike, n\'ibinyabiziga hamwe n\'ikimenyetso cy\'ukuri 100%.',
      slide4Sub: 'Uhereye ku bwiza bwa Milan no London kugeza ku bikoresho bya Tokyo — bona umubare munini w\'ibicuruzwa mpuzamahanga.',
      slide1Cta1: 'Reba Isoko',
      slide1Cta2: 'Gushaka Inganda (RFQ)',
      slide2Cta1: 'Reba Ikoranabuhanga',
      slide2Cta2: 'Abatunga Bemejwe',
      slide3Cta1: 'Gura Ibipya',
      slide3Cta2: 'Ube Umuguzi w\'Isi Yose',
      slide4Cta1: 'Reba Ubwiza & Imideli',
      slide4Cta2: 'Kureba Kohereza',
      heroSearchPlaceholder: 'Shakisha ibicuruzwa, brands & ibice (nk. MacBook M3, DJI Drone...)',
      heroSearchBtn: 'Shakisha mu Isi Yose',
      trustEscrow: '100% Uburinzi bw\'Amafaranga',
      trustShipping: 'Kohereza vuba mu Isi Yose',
      trustReturn: 'Gusubiza mu minsi 14',
    },
    home: {
      popularCategories: 'Ibyiciro Bizwi',
      popularCategoriesSubtitle: 'Igitabo cy\'mpuzamahanga gikorwa n\'ababari bemejwe n\'amasoko yemejwe',
      exploreAll: 'Reba Ibyiciro Byose',
      flashDeals: 'Amasezerano Yihuse y\'Isi Yose',
      flashDealsSubtitle: 'Ibiciro by\'inganda bifunguye n\'kohereza vuba',
      promotionEndsIn: 'Promotion irangira:',
      trendingCatalog: 'Igitabo Gishya mpuzamahanga',
      trendingCatalogSubtitle: 'Shakisha ibicuruzwa by\'isi yose hamwe n\'uburinzi bw\'amafaranga 100% ya Zendo',
      tabFeatured: 'Byahiswe',
      tabDeals: 'Ibiciro Byinshi',
      tabNew: 'Ibipya',
      merchantHub: 'Aho Gurishira ku Isi Yose',
      merchantHubTitle: 'Gurisha Miliyoni y\'Abantu mu Isi Yose',
      merchantHubSubtitle: 'Tangira iduka ryawe ry\'mpuzamahanga nta mafaranga yo gutangirira. Bona amafaranga menshi, itumanaho ry\'mpuzamahanga, n\'abantu bemejwe.',
      applyMerchant: 'Saba kuba Umuguzi w\'Isi Yose',
      learnMore: 'Wige Byinshi',
      rfqBadge: 'Gushaka Inganda mu Isi Yose (RFQ)',
      rfqTitle1: 'Gushaka Inganda mu Isi Yose',
      rfqTitle2: 'Ibiciro bya OEM mu masaha 24',
      rfqSubtitle: 'Ushaka gukora ibicuruzwa, imitambo, cyangwa ikoranabuhanga? Ohereza ibibazo byawe kandi inzobere zacu zizabigira.',
      submitRfq: 'Ohereza Ibisabwa (RFQ)',
      suppliersTitle: 'Abatunga Bemejwe mu Isi Yose',
      suppliersSubtitle: 'Gutumanahana mu B2B mu Amerika y\'Amajyaruguru, Uburayi, Aziya, n\'Afurika',
      viewDirectory: 'Reba Urutonde Rwose',
      verifiedPartner: 'Umutunga Wemejwe',
      items: 'ibicuruzwa',
    },
    products: {
      allProducts: 'Ibicuruzwa byose',
      featuredProducts: 'Ibicuruzwa byihuse',
      newArrivals: 'Zemashya',
      bestSellers: 'Ibyagurishijwe cyane',
      onSale: 'Bihujwe',
      inStock: 'Bihari',
      outOfStock: 'Ntibihari',
      limitedStock: 'Bibaye bwa gahunda',
      freeDelivery: 'Itumba bure',
      codAvailable: 'Ishura hakenewe',
      verifiedSeller: 'Umuguzi wemewe',
      addToWishlist: 'Shyiramo imyaka',
      removeFromWishlist: 'Kura imyaka',
      quickView: 'Reba vuba',
      viewDetails: 'Reba ibisobanuro',
      productDetails: 'Ibisobanuro bya icuruzwa',
      description: 'Ubusobanuro',
      specifications: 'Imiterere',
      reviews: 'Icyemezo',
      writeReview: 'Andika icyemezo',
      relatedProducts: 'Ibicuruzwa bisangiye',
      frequentlyBoughtTogether: 'Ibicuruzwa bihujwe hamwe',
      youMayAlsoLike: 'Byakwandishiye',
      quantity: 'Umubare',
      sku: 'SKU',
      brand: 'Umwandikashyaka',
      category: 'Uduciro',
      seller: 'Umuguzi',
      rating: 'Icyemezo',
      reviewsCount: 'Icyemezo',
      inWishlist: 'Muri imyaka',
      addedToCart: 'Byarashyizwe muri konti',
      addedToWishlist: 'Byarashyizwe muri imyaka',
      removedFromCart: 'Byasibwe muri konti',
      removedFromWishlist: 'Byasibwe muri imyaka',
    },
    categories: {
      allCategories: 'Uduciro twose',
      electronics: 'Ikoranabuhanga',
      fashion: 'Imyambarire',
      home: 'Imbaho',
      automotive: 'Modoka',
      sports: 'Imikino',
      health: 'Ubuzima',
      industrial: 'Inganda',
      cameras: 'Kamera',
      appliances: 'Ibikoresho',
      solar: 'Solar',
      food: 'Ibiribwa',
      drones: 'Drones',
    },
    auth: {
      login: 'Kwinjira',
      register: 'Iyandikishe',
      forgotPassword: 'Wibutsa ijambo ryibanga',
      resetPassword: 'Hindura ijambo ryibanga',
      email: 'Imeli',
      password: 'Ijambo ryibanga',
      confirmPassword: 'Emeza ijambo ryibanga',
      fullName: 'Amazina yose',
      phone: 'Numero ya telephone',
      rememberMe: 'Mporanora',
      loginTitle: 'Murakaza neza',
      loginSubtitle: 'Kwinjira muri konti yawe',
      registerTitle: 'Shyiramo konti',
      registerSubtitle: 'Winjira muri ZENDO Marketplace',
      forgotTitle: 'Wibutsa ijambo ryibanga',
      forgotSubtitle: 'Hindura ijambo ryibanga',
      resetTitle: 'Hindura ijambo ryibanga',
      resetSubtitle: 'Shyiramo ijambo ryibanga rishya',
      alreadyHaveAccount: 'Waba ufite konti?',
      dontHaveAccount: 'Utaba konti?',
      signIn: 'Kwinjira',
      signUp: 'Iyandikishe',
      sendResetLink: 'Ohereza ihuza ryo guhindura',
      backToLogin: 'Subira kwinjira',
      passwordResetSent: 'Ihuza ryo guhindura ijambo ryibanga ryoherejwe',
      passwordChanged: 'Ijambo ryibanga ryahinduwe neza',
      loginSuccess: 'Kwinjira byakunze',
      registerSuccess: 'Iyandikisha byakunze',
      loginError: 'Kwinjira byaratanye',
      registerError: 'Iyandikisha byaratanye',
      resetError: 'Guhindura ijambo ryibanga byaratanye',
      invalidCredentials: 'Amagambo ntabwo ar',
      emailAlreadyExists: 'Iyi imeli mbere yarasohowe',
      weakPassword: 'Ijambo ryibanga rirabagira',
      passwordMismatch: 'Amagambo arasa',
      emailRequired: 'Imeli ikenewe',
      passwordRequired: 'Ijambo ryibanga rikenerwa',
      nameRequired: 'Amazina bikenerwa',
    },
    checkout: {
      title: 'Ihindura',
      subtitle: 'Vugisha ibiriherwe',
      customerInfo: 'Amakuru yumukiliya',
      shippingAddress: 'Aderesi yitumbwa',
      billingAddress: 'Aderesi yishyura',
      paymentMethod: 'Uburyo bwo kwishyura',
      orderSummary: 'Igisummarurwa cyibirherwe',
      placeOrder: 'Ohereza ibiriherwe',
      processing: 'Iyirira...',
      orderSuccess: 'Ibirerwe byoherejwe neza!',
      orderFailed: 'Ibirerwe byaratanye',
      firstName: 'Izina rya mbere',
      lastName: 'Izina ryindi',
      address: 'Aderesi',
      city: 'Umujyi',
      state: 'Intara',
      postalCode: 'Imyaka',
      country: 'Igihugu',
      phone: 'Telephone',
      email: 'Imeli',
      saveAddress: 'Bika aderesi',
      useSavedAddress: 'Koresha aderesi yabitswe',
      cardNumber: 'Umubare wa kadi',
      expiryDate: 'Itariki rya gasuka',
      cvv: 'CVV',
      cardHolder: 'Nyirikadi',
      saveCard: 'Bika kadi',
      payWithCard: 'Shyura na kadi',
      payWithPayPal: 'Shyura na PayPal',
      payWithMobileMoney: 'Shyura na Mobile Money',
      cashOnDelivery: 'Ishura mugihe',
      deliveryInstructions: 'Ibisobanuro byitumba',
      estimatedDelivery: 'Itariki ryitumbwa ryateganijwe',
      deliveryOptions: 'Amahitamo yitumba',
      standardDelivery: 'Itumba bisanzwe',
      expressDelivery: 'Itumba bwihuse',
      sameDayDelivery: 'Itumba mubihe',
      freeDelivery: 'Itumba bure',
      pickup: 'Gukura',
      termsAndConditions: 'Amabwiriza nshinga',
      agreeToTerms: 'Emeza amabwiriza nshinga',
      orderConfirmation: 'Igenzura ryibirerwe',
      orderNumber: 'Umubare wibirerwe',
      trackingNumber: 'Umubare wakurikirana',
      estimatedArrival: 'Itariki yatanzanijwe yigeruka',
      deliveryAddress: 'Aderesi yitumbwa',
      contactInfo: 'Amakuru zo guhamagara',
      orderPlaced: 'Ibirerwe byoherejwe',
      thankYouForOrder: 'Murakoze kubikora ibiriherwe!',
      emailConfirmation: 'Uzakoresha imeli yigenzura',
      trackOrderStatus: 'Kureba imiterere yibirerwe',
    },
    orders: {
      myOrders: 'I biriherwe njanje',
      orderHistory: 'Amateka yibirerwe',
      orderDetails: 'Ibisobanuro byibirerwe',
      orderStatus: 'Imiterere yibirerwe',
      tracking: 'Kurikirana',
      orderDate: 'Itariki yibirerwe',
      orderTotal: 'Igiteranyo cyibirerwe',
      orderItems: 'Ibintu byibirerwe',
      shippingAddress: 'Aderesi yitumbwa',
      paymentMethod: 'Uburyo bwo kwishyura',
      paymentStatus: 'Imiterere yishyura',
      pending: 'Igiye gukorerwa',
      confirmed: 'Yemewe',
      processing: 'Iri gukorwa',
      shipped: 'Byoherejwe',
      delivered: 'Byarageze',
      cancelled: 'Byavanywe',
      refunded: 'Byaragabanyijwe',
      statusHistory: 'Amateka yimiterere',
      trackPackage: 'Kurikirana akabati',
      contactSupport: 'Hamagara serivisi',
      reorder: 'Ohera nanone',
      cancelOrder: 'Vanya ibiriherwe',
      returnOrder: 'Subiza ibiriherwe',
      viewInvoice: 'Reba invoice',
      downloadInvoice: 'Shyukura invoice',
      noOrders: 'Nta biriherwe',
      noOrdersMessage: 'Nta biriherwe ufite',
    },
    wishlist: {
      myWishlist: 'Imyaka yanjye',
      addToCart: 'Shyiramo muri konti',
      removeFromWishlist: 'Kura imyaka',
      moveToCart: 'Simbuza muri konti',
      emptyWishlist: 'Imyaka iraguye',
      emptyWishlistMessage: 'Imyaka yawe iraguye',
      addToCartSuccess: 'Byarashyizwe muri konti',
      removeFromWishlistSuccess: 'Byasibwe muri imyaka',
    },
    seller: {
      dashboard: 'Konti y\'umuguzi',
      overview: 'Ikigaragara',
      products: 'Ibicuruzwa',
      orders: 'Ibirerwe',
      earnings: 'Ishami',
      settings: 'Igenzura',
      addProduct: 'Shyiramo icuruzwa',
      editProduct: 'Hindura icuruzwa',
      deleteProduct: 'Siba icuruzwa',
      productDetails: 'Ibisobanuro byicuruzwa',
      productImages: 'Amashusho yicuruzwa',
      productPricing: 'Igiciro cyicuruzwa',
      productInventory: 'Imbogami zicuruzwa',
      productShipping: 'Itumba ryicuruzwa',
      sales: 'Ibicuruzwa',
      revenue: 'Amanota',
      customers: 'Abakiliya',
      reviews: 'Icyemezo',
      payouts: 'Imyitwarire',
      storeSettings: 'Igenzura ryagurisha',
      profileSettings: 'Igenzura ryumwirondoro',
      paymentSettings: 'Igenzura ryishyura',
      shippingSettings: 'Igenzura ryitumba',
      notificationSettings: 'Igenzura ryamenyesha',
      analytics: 'Analizi',
      performance: 'Ukwihangana',
      topProducts: 'Ibicuruzwa byihuse',
      recentOrders: 'Ibirerwe bisanze',
      customerFeedback: 'Ibitekerezo byabakiliya',
      salesChart: 'Grafika yibicuruzwa',
      revenueChart: 'Grafika yamanota',
      orderChart: 'Grafika yibirerwe',
      customerChart: 'Grafika yabakiliya',
      totalSales: 'Ibicuruzwa byose',
      totalRevenue: 'Amanota yose',
      totalOrders: 'Ibirerwe byose',
      totalCustomers: 'Abakiliya bose',
      averageRating: 'Icyemezo cyo hamwe',
      responseTime: 'Igikorongorerwa',
      fulfillmentRate: 'Ubwisubire',
      returnRate: 'Igiciro cyisubira',
      pendingProducts: 'Ibicuruzwa biri gukorwa',
      approvedProducts: 'Ibicuruzwa byemewe',
      rejectedProducts: 'Ibicuruzwa byavanywe',
      activeOrders: 'Ibirerwe bikora',
      completedOrders: 'Ibirerwe byarangiye',
      pendingPayouts: 'Imyitwarire biri gukorwa',
      completedPayouts: 'Imyitwarire byarangiye',
      totalEarnings: 'Ishami rihose',
      availableBalance: 'Balance ihari',
      withdraw: 'Gukura',
      withdrawalHistory: 'Amateka yagukura',
      bankAccount: 'Konti ya banki',
      mobileMoney: 'Mobile Money',
      payoutRequest: 'Icyifuzo cyimyitwarire',
      payoutProcessing: 'Imyitwarire iri gukorwa',
      payoutCompleted: 'Imyitwarire yarangiye',
      payoutFailed: 'Imyitwarire iratanye',
    },
    admin: {
      dashboard: 'Konti y\'ubuyobozi',
      overview: 'Ikigaragara',
      users: 'Abakoresha',
      sellers: 'Abaguzi',
      products: 'Ibicuruzwa',
      orders: 'Ibirerwe',
      categories: 'Uduciro',
      settings: 'Igenzura',
      analytics: 'Analizi',
      reports: 'Ibisobanuro',
      logs: 'Amateka',
      totalUsers: 'Abakoresha bose',
      totalSellers: 'Abaguzi bose',
      totalProducts: 'Ibicuruzwa byose',
      totalOrders: 'Ibirerwe byose',
      totalRevenue: 'Amanota yose',
      pendingApprovals: 'Imyemezo biri gukorwa',
      activeSellers: 'Abaguzi bakora',
      activeProducts: 'Ibicuruzwa bikora',
      recentActivity: 'Ibikorwa bisanze',
      systemHealth: 'Ubuzima bwa sistemu',
      databaseStatus: 'Imiterere ya database',
      apiStatus: 'Imiterere ya API',
      storageStatus: 'Imiterere ya storage',
      performance: 'Ukwihangana',
      uptime: 'Ugutangira',
      responseTime: 'Igikorongorerwa',
      errorRate: 'Igiciro cyikosa',
      bandwidth: 'Bandwidth',
      storage: 'Storage',
      usersChart: 'Grafika yabakoresha',
      sellersChart: 'Grafika yabaguzi',
      productsChart: 'Grafika yibicuruzwa',
      ordersChart: 'Grafika yibirerwe',
      revenueChart: 'Grafika yamanota',
      approveUser: 'Emeza umukoresha',
      rejectUser: 'Kuraho umukoresha',
      approveSeller: 'Emeza umuguzi',
      rejectSeller: 'Kuraho umuguzi',
      approveProduct: 'Emeza icuruzwa',
      rejectProduct: 'Kuraho icuruzwa',
      suspendUser: 'Hagarika umukoresha',
      suspendSeller: 'Hagarika umuguzi',
      suspendProduct: 'Hagarika icuruzwa',
      deleteProduct: 'Siba icuruzwa',
      editCategory: 'Hindura uduciro',
      addCategory: 'Shyiramo uduciro',
      deleteCategory: 'Siba uduciro',
      systemSettings: 'Igenzura rya sistemu',
      emailSettings: 'Igenzura ryimeli',
      paymentSettings: 'Igenzura ryishyura',
      shippingSettings: 'Igenzura ryitumba',
      taxSettings: 'Igenzura rya tax',
      securitySettings: 'Igenzura ryuburenguzira',
      maintenanceMode: 'Uburyo bwo kubaka',
      backup: 'Backup',
      restore: 'Restore',
      exportData: 'Gushyira amakuru',
      importData: 'Kuvana amakuru',
      generateReport: 'Hakanya ibisobanuro',
      viewLogs: 'Reba amateka',
      clearLogs: 'Siba amateka',
    },
    sourcing: {
      title: 'Gukora ibicuruzwa',
      subtitle: 'Ibicuruzwa bivuye hanze yigihugu',
      submitRequest: 'Ohereza icyifuzo',
      myRequests: 'Ibyifuzo byanjye',
      requestStatus: 'Imiterere yicyifuzo',
      product: 'Icuruzwa',
      quantity: 'Umubare',
      unit: 'Igice',
      budget: 'Budget',
      description: 'Ubusobanuro',
      country: 'Igihugu',
      submit: 'Ohereza',
      submitted: 'Byoherejwe',
      processing: 'Iri gukorwa',
      quoted: 'Byoherejwe igiciro',
      approved: 'Byemewe',
      paid: 'Byishuye',
      inTransit: 'Iri mu nzira',
      delivered: 'Byageze',
      cancelled: 'Byavanywe',
      tracking: 'Kurikirana',
      supplier: 'Umucuruzi',
      quote: 'Igiciro',
      notes: 'Ibisobanuro',
      history: 'Amateka',
      submitSuccess: 'Icyifuzo cyoherejwe neza',
      submitError: 'Byahindutse kwohereza icyifuzo',
      noRequests: 'Nta byifuzo',
      noRequestsMessage: 'Nta byifuzo ufite',
    },
    about: {
      title: 'Ibyerekeye',
      subtitle: 'Menya ibiremere ZENDO Marketplace',
      mission: 'Intego yacu',
      vision: 'Icyerekeye',
      values: 'Uduciro ducu',
      story: 'Inkuru yacu',
      team: 'Itsinda ryacu',
      partners: 'Abanyamabanga',
      careers: 'Akazi',
      contact: 'Twandikire',
      location: 'Aho turi',
      hours: 'Amasaha',
      phone: 'Telephone',
      email: 'Imeli',
      address: 'Aderesi',
    },
    footer: {
      aboutUs: 'Ibyerekeye',
      customerService: 'Serivisi yabakiliya',
      myAccount: 'Konti yanjye',
      followUs: 'Dufurira',
      newsletter: 'Newsletter',
      subscribe: 'Andikisha',
      subscribeSuccess: 'Andikishije neza',
      subscribeError: 'Byahindutse kwandikisha',
      copyright: 'Uburenguzira',
      allRightsReserved: 'Uburenguzira bwose burikiwe',
      termsOfService: 'Amabwiriza nshinga',
      privacyPolicy: 'Politiki yubuhanzi',
      cookiePolicy: 'Politiki ya cookie',
      sitemap: 'Sitemap',
      contactUs: 'Twandikire',
      faq: 'Ibibazo',
      shipping: 'Itumba',
      returns: 'Gusubiza',
      sizeGuide: 'Inama zingano',
      storeLocator: 'Aho gukura',
      giftCards: 'Karat za gifts',
      affiliate: 'Affiliate',
      studentDiscount: 'Ishyirwa ryabanyeshuri',
      militaryDiscount: 'Ishyirwa ryagisirikari',
      firstResponderDiscount: 'Ishyirwa ryabasirikare ibyagozwa',
      trust1Title: "100% Uburinzi bw'Amafaranga",
      trust1Desc: 'Abacuruzi bemejwe kandi bizerwa',
      trust2Title: 'Iposita mu Rwanda Hose',
      trust2Desc: 'Kugeza ku muryango mu turere twose 30',
      trust3Title: "Ubufasha bw'Abakiriya 24/7",
      trust3Desc: 'Hotline: +250 793 032 430',
      trust4Title: 'Gushaka Inganda mu Isi Yose',
      trust4Desc: 'Ibiciro bya mbere biva mu nganda zizewe',
      brandDescription: "Gukora agaciro. Gutera imbere. ZENDO ni isoko rya mbere mu Rwanda rihuza abacuruzi bemejwe, abatunganya ibicuruzwa ku isi yose, n'abaguzi bakoresheje MTN MoMo, Airtel Money, n'amakarita.",
      headquarters: 'Icyicaro: Kigali City Center, Nyarugenge, Kigali, Rwanda',
      phoneSupport: 'Telefoni / WhatsApp: +250 793 032 430',
      marketplaceTitle: 'Isoko',
      allProductsCatalog: 'Ibicuruzwa Byose',
      verifiedSuppliers: 'Abatunga Bemejwe',
      factorySourcingRfq: 'Gusaba Inganda (RFQ)',
      trackOrderStatus: 'Kurebaaho Ibicuruzwa Bigeze',
      merchantHubTitle: "Ah'Abacuruzi",
      applyVerifiedSeller: 'Saba kuba Umucuruzi Wemejwe',
      sellerOperationsHub: "Konti y'Ubucuruzi",
      aboutZendoRwanda: 'Ibyerekeye ZENDO Rwanda',
      acceptedPaymentsTitle: 'Uburyo bwo Kwishyura',
      acceptedPaymentsDesc: 'Kwishyura ako kanya kuri MoMo no ku makarita:',
      momoPayment: 'MTN MoMo (*182#)',
      airtelPayment: 'Airtel Money (*185#)',
      visaPayment: 'Visa',
      mastercardPayment: 'Mastercard',
      cashOnDelivery: 'Kwishyura Uhawe Ibicuruzwa',
      allRightsReservedText: 'ZENDO Marketplace Rwanda. Uburenganzira bwose burabitswe. Gukora agaciro. Gutera imbere.',
    },
    errors: {
      pageNotFound: 'Paji ntibonetse',
      pageNotFoundMessage: 'Paji ushaka ntaho',
      goHome: 'Subira ahabanza',
      serverError: 'Ikosa ya seriveri',
      serverErrorMessage: 'Habaye ikosa ruri twa',
      tryAgain: 'Gerageza nanone nyuma',
      somethingWentWrong: 'Habaye ikosa',
      unexpectedError: 'Habaye ikosa itazwi',
    },
    success: {
      operationComplete: 'Ikikorwa cyarangiye neza',
      dataSaved: 'Amakuru abyitswe neza',
      changesApplied: 'Amahinduka yashyizwemo neza',
      requestSubmitted: 'Icyifuzo cyoherejwe neza',
      emailSent: 'Imeli yoherejwe neza',
      passwordReset: 'Ijambo ryibanga ryahinduwe neza',
      accountCreated: 'Konti yashyizwe neza',
      loggedOut: 'Sohoka neza',
    },
  },
  fr: {
    common: {
      loading: 'Chargement...',
      search: 'Rechercher',
      searchPlaceholder: 'Rechercher des produits, catégories...',
      welcome: 'Bienvenue',
      login: 'Connexion',
      register: 'Inscription',
      logout: 'Déconnexion',
      myAccount: 'Mon Compte',
      myOrders: 'Mes Commandes',
      myWishlist: 'Ma Liste de Souhaits',
      cart: 'Panier',
      checkout: 'Commander',
      continueShopping: 'Continuer vos achats',
      addToCart: 'Ajouter au panier',
      removeFromCart: 'Retirer du panier',
      updateQuantity: 'Mettre à jour la quantité',
      subtotal: 'Sous-total',
      total: 'Total',
      shipping: 'Livraison',
      freeShipping: 'Livraison gratuite',
      applyCoupon: 'Appliquer le coupon',
      couponApplied: 'Coupon appliqué',
      invalidCoupon: 'Coupon invalide',
      proceedToCheckout: 'Passer à la caisse',
      emptyCart: 'Votre panier est vide',
      yourCartIsEmpty: 'Votre panier est vide',
      currency: 'Devise',
      language: 'Langue',
      darkMode: 'Mode sombre',
      lightMode: 'Mode clair',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      view: 'Voir',
      close: 'Fermer',
      open: 'Ouvrir',
      submit: 'Soumettre',
      confirm: 'Confirmer',
      success: 'Succès',
      error: 'Erreur',
      warning: 'Avertissement',
      info: 'Information',
      yes: 'Oui',
      no: 'Non',
      or: 'ou',
      and: 'et',
      all: 'Tous',
      none: 'Aucun',
      searchResults: 'Résultats de recherche',
      noResults: 'Aucun résultat trouvé',
      filter: 'Filtrer',
      sort: 'Trier',
      sortBy: 'Trier par',
      price: 'Prix',
      rating: 'Note',
      newest: 'Plus récent',
      popularity: 'Popularité',
      relevance: 'Pertinence',
      page: 'Page',
      of: 'de',
      itemsPerPage: 'articles par page',
      showing: 'Affichage',
      to: 'à',
      results: 'résultats',
      clear: 'Effacer',
      select: 'Sélectionner',
      selected: 'Sélectionné',
      loadingData: 'Chargement des données...',
      pleaseWait: 'Veuillez patienter...',
      refresh: 'Actualiser',
      retry: 'Réessayer',
      errorOccurred: 'Une erreur s\'est produite',
      tryAgain: 'Veuillez réessayer',
      networkError: 'Erreur réseau',
      serverError: 'Erreur serveur',
      unknownError: 'Erreur inconnue',
    },
    nav: {
      home: 'Accueil',
      products: 'Produits',
      categories: 'Catégories',
      sellers: 'Vendeurs',
      sourcing: 'Approvisionnement',
      becomeSeller: 'Devenir Vendeur',
      trackOrder: 'Suivre la commande',
      about: 'À propos',
      contact: 'Contact',
      faq: 'FAQ',
      terms: 'Conditions',
      privacy: 'Confidentialité',
      language: 'Langue',
      currency: 'Devise',
      profile: 'Profil',
      dashboard: 'Tableau de bord',
      settings: 'Paramètres',
      logout: 'Déconnexion',
      browse: 'Parcourir',
      source: 'Sourcing',
      sell: 'Vendre',
      suppliers: 'Fournisseurs',
      searchPlaceholder: 'Rechercher produits, marques et vendeurs…',
    },
    hero: {
      title: 'ZENDO',
      subtitle: 'Votre passerelle numérique vers les produits, les fournisseurs et les marchés.',
      punchline: 'Achetez localement. Vendez en ligne. Sourcez à travers l\'Afrique.',
      shopProducts: 'Acheter des produits',
      becomeSeller: 'Devenir vendeur',
      sourceProduct: 'Sourcer un produit',
      findSuppliers: 'Trouver des fournisseurs',
      cta1: 'Acheter maintenant',
      cta2: 'Devenir vendeur',
      cta3: 'Suivre la commande',
      featured1: 'Électronique',
      featured2: 'Mode',
      featured3: 'Maison & Décoration',
      slide1Badge: 'Marché Mondial Multi-Vendeurs Premier',
      slide2Badge: 'Logistique Express Mondiale',
      slide3Badge: 'Marchands & Marques Internationaux Vérifiés',
      slide4Badge: 'Haute Horlogerie, Mode & Créateurs',
      slide1Title1: 'Créer de la valeur.',
      slide1Title2: 'Propulser la Croissance Mondiale.',
      slide2Title1: 'Tech Nouvelle Génération &',
      slide2Title2: 'Sourcing Direct Industriel.',
      slide3Title1: 'Luxe Sélectionné.',
      slide3Title2: 'Authenticité Absolue.',
      slide4Title1: 'Créateur Mondial',
      slide4Title2: 'Relier les Continents & le Commerce.',
      slide1Sub: 'Connectez-vous avec des fabricants certifiés, des distributeurs tech internationaux et des vendeurs premium partout dans le monde.',
      slide2Sub: 'Optimisez votre chaîne d\'approvisionnement internationale avec la tarification OEM directe, livraison DHL Express en 2–4 jours.',
      slide3Sub: 'Découvrez de l\'informatique haut de gamme, des innovations maison intelligentes, et des collections de créateurs avec sceau d\'authenticité 100% vérifié.',
      slide4Sub: 'De la mode luxe de Milan et Londres aux équipements de précision de Tokyo — accédez à des milliers de collections internationales sélectionnées.',
      slide1Cta1: 'Explorer le Marché',
      slide1Cta2: 'Sourcing Mondial (RFQ)',
      slide2Cta1: 'Voir l\'Électronique',
      slide2Cta2: 'Fournisseurs Vérifiés',
      slide3Cta1: 'Nouvelles Arrivées',
      slide3Cta2: 'Devenir Vendeur Mondial',
      slide4Cta1: 'Explorer Luxe & Mode',
      slide4Cta2: 'Suivre Expédition',
      heroSearchPlaceholder: 'Rechercher produits, marques & pièces (ex. MacBook M3, DJI Drone...)',
      heroSearchBtn: 'Rechercher Mondialement',
      trustEscrow: 'Protection Escrow 100%',
      trustShipping: 'Expédition Express Mondiale',
      trustReturn: 'Retour Mondial sous 14 Jours',
    },
    home: {
      popularCategories: 'Catégories Mondiales Populaires',
      popularCategoriesSubtitle: 'Catalogue international sélectionné par des fabricants mondiaux certifiés et des marques vérifiées',
      exploreAll: 'Explorer Toutes les Catégories',
      flashDeals: 'Ventes Flash Mondiales',
      flashDealsSubtitle: 'Remises directes usine en quantité limitée avec expédition express',
      promotionEndsIn: 'La promotion se termine dans:',
      trendingCatalog: 'Catalogue International Tendance',
      trendingCatalogSubtitle: 'Explorez des marchandises authentiques très demandées soutenues par la protection escrow acheteur 100% Zendo',
      tabFeatured: 'En Vedette',
      tabDeals: 'Meilleures Réductions',
      tabNew: 'Nouvelles Arrivées',
      merchantHub: 'Hub International Marchand',
      merchantHubTitle: 'Vendez à des Millions d\'Acheteurs Mondiaux Vérifiés',
      merchantHubSubtitle: 'Lancez votre vitrine mondiale vérifiée sans frais de démarrage. Accédez aux paiements automatisés multi-devises, aux intégrations logistiques transfrontalières.',
      applyMerchant: 'Postuler en tant que Marchand Mondial',
      learnMore: 'En Savoir Plus',
      rfqBadge: 'Approvisionnement Usine Mondial (RFQ)',
      rfqTitle1: 'Approvisionnement Usine Mondial',
      rfqTitle2: 'Devis OEM Personnalisés en 24 Heures',
      rfqSubtitle: 'Vous cherchez de la fabrication personnalisée, des machines ou de l\'électronique en gros? Soumettez vos specs et budget cible. Nos spécialistes négocient directement avec des usines certifiées.',
      submitRfq: 'Soumettre RFQ',
      suppliersTitle: 'Fournisseurs & Fabricants Mondiaux Vérifiés',
      suppliersSubtitle: 'Partenariats B2B directs en Amérique du Nord, Europe, Asie et Afrique',
      viewDirectory: 'Voir le Répertoire Complet',
      verifiedPartner: 'Partenaire Mondial Vérifié',
      items: 'articles',
    },
    products: {
      allProducts: 'Tous les produits',
      featuredProducts: 'Produits en vedette',
      newArrivals: 'Nouveautés',
      bestSellers: 'Meilleures ventes',
      onSale: 'En promotion',
      inStock: 'En stock',
      outOfStock: 'Rupture de stock',
      limitedStock: 'Stock limité',
      freeDelivery: 'Livraison gratuite',
      codAvailable: 'Paiement à la livraison disponible',
      verifiedSeller: 'Vendeur vérifié',
      addToWishlist: 'Ajouter à la liste de souhaits',
      removeFromWishlist: 'Retirer de la liste de souhaits',
      quickView: 'Aperçu rapide',
      viewDetails: 'Voir les détails',
      productDetails: 'Détails du produit',
      description: 'Description',
      specifications: 'Spécifications',
      reviews: 'Avis',
      writeReview: 'Écrire un avis',
      relatedProducts: 'Produits associés',
      frequentlyBoughtTogether: 'Souvent achetés ensemble',
      youMayAlsoLike: 'Vous aimerez aussi',
      quantity: 'Quantité',
      sku: 'SKU',
      brand: 'Marque',
      category: 'Catégorie',
      seller: 'Vendeur',
      rating: 'Note',
      reviewsCount: 'Avis',
      inWishlist: 'Dans la liste de souhaits',
      addedToCart: 'Ajouté au panier',
      addedToWishlist: 'Ajouté à la liste de souhaits',
      removedFromCart: 'Retiré du panier',
      removedFromWishlist: 'Retiré de la liste de souhaits',
    },
    categories: {
      allCategories: 'Toutes les catégories',
      electronics: 'Électronique',
      fashion: 'Mode',
      home: 'Maison',
      automotive: 'Automobile',
      sports: 'Sports',
      health: 'Santé',
      industrial: 'Industriel',
      cameras: 'Caméras',
      appliances: 'Appareils',
      solar: 'Solaire',
      food: 'Alimentation',
      drones: 'Drones',
    },
    auth: {
      login: 'Connexion',
      register: 'Inscription',
      forgotPassword: 'Mot de passe oublié',
      resetPassword: 'Réinitialiser le mot de passe',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      fullName: 'Nom complet',
      phone: 'Téléphone',
      rememberMe: 'Se souvenir de moi',
      loginTitle: 'Bon retour',
      loginSubtitle: 'Connectez-vous à votre compte',
      registerTitle: 'Créer un compte',
      registerSubtitle: 'Rejoignez ZENDO Marketplace',
      forgotTitle: 'Mot de passe oublié',
      forgotSubtitle: 'Réinitialisez votre mot de passe',
      resetTitle: 'Réinitialiser le mot de passe',
      resetSubtitle: 'Entrez votre nouveau mot de passe',
      alreadyHaveAccount: 'Vous avez déjà un compte?',
      dontHaveAccount: 'Vous n\'avez pas de compte?',
      signIn: 'Se connecter',
      signUp: 'S\'inscrire',
      sendResetLink: 'Envoyer le lien de réinitialisation',
      backToLogin: 'Retour à la connexion',
      passwordResetSent: 'Lien de réinitialisation envoyé',
      passwordChanged: 'Mot de passe changé avec succès',
      loginSuccess: 'Connexion réussie',
      registerSuccess: 'Inscription réussie',
      loginError: 'Échec de la connexion',
      registerError: 'Échec de l\'inscription',
      resetError: 'Échec de la réinitialisation',
      invalidCredentials: 'Identifiants invalides',
      emailAlreadyExists: 'Email existe déjà',
      weakPassword: 'Mot de passe trop faible',
      passwordMismatch: 'Les mots de passe ne correspondent pas',
      emailRequired: 'Email requis',
      passwordRequired: 'Mot de passe requis',
      nameRequired: 'Nom requis',
    },
    checkout: {
      title: 'Commander',
      subtitle: 'Complétez votre commande',
      customerInfo: 'Informations client',
      shippingAddress: 'Adresse de livraison',
      billingAddress: 'Adresse de facturation',
      paymentMethod: 'Mode de paiement',
      orderSummary: 'Résumé de la commande',
      placeOrder: 'Passer la commande',
      processing: 'Traitement...',
      orderSuccess: 'Commande passée avec succès!',
      orderFailed: 'Échec de la commande',
      firstName: 'Prénom',
      lastName: 'Nom',
      address: 'Adresse',
      city: 'Ville',
      state: 'État/Province',
      postalCode: 'Code postal',
      country: 'Pays',
      phone: 'Téléphone',
      email: 'Email',
      saveAddress: 'Enregistrer l\'adresse',
      useSavedAddress: 'Utiliser l\'adresse enregistrée',
      cardNumber: 'Numéro de carte',
      expiryDate: 'Date d\'expiration',
      cvv: 'CVV',
      cardHolder: 'Titulaire de la carte',
      saveCard: 'Enregistrer la carte',
      payWithCard: 'Payer par carte',
      payWithPayPal: 'Payer avec PayPal',
      payWithMobileMoney: 'Payer avec Mobile Money',
      cashOnDelivery: 'Paiement à la livraison',
      deliveryInstructions: 'Instructions de livraison',
      estimatedDelivery: 'Livraison estimée',
      deliveryOptions: 'Options de livraison',
      standardDelivery: 'Livraison standard',
      expressDelivery: 'Livraison express',
      sameDayDelivery: 'Livraison le jour même',
      freeDelivery: 'Livraison gratuite',
      pickup: 'Retrait',
      termsAndConditions: 'Conditions générales',
      agreeToTerms: 'J\'accepte les conditions générales',
      orderConfirmation: 'Confirmation de commande',
      orderNumber: 'Numéro de commande',
      trackingNumber: 'Numéro de suivi',
      estimatedArrival: 'Arrivée estimée',
      deliveryAddress: 'Adresse de livraison',
      contactInfo: 'Informations de contact',
      orderPlaced: 'Commande passée',
      thankYouForOrder: 'Merci pour votre commande!',
      emailConfirmation: 'Vous recevrez une confirmation par email',
      trackOrderStatus: 'Suivez l\'état de votre commande',
    },
    orders: {
      myOrders: 'Mes commandes',
      orderHistory: 'Historique des commandes',
      orderDetails: 'Détails de la commande',
      orderStatus: 'État de la commande',
      tracking: 'Suivi',
      orderDate: 'Date de commande',
      orderTotal: 'Total de la commande',
      orderItems: 'Articles de la commande',
      shippingAddress: 'Adresse de livraison',
      paymentMethod: 'Mode de paiement',
      paymentStatus: 'État du paiement',
      pending: 'En attente',
      confirmed: 'Confirmée',
      processing: 'En traitement',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
      refunded: 'Remboursée',
      statusHistory: 'Historique des statuts',
      trackPackage: 'Suivre le colis',
      contactSupport: 'Contacter le support',
      reorder: 'Commander à nouveau',
      cancelOrder: 'Annuler la commande',
      returnOrder: 'Retourner la commande',
      viewInvoice: 'Voir la facture',
      downloadInvoice: 'Télécharger la facture',
      noOrders: 'Aucune commande',
      noOrdersMessage: 'Vous n\'avez pas encore de commandes',
    },
    wishlist: {
      myWishlist: 'Ma liste de souhaits',
      addToCart: 'Ajouter au panier',
      removeFromWishlist: 'Retirer de la liste de souhaits',
      moveToCart: 'Déplacer vers le panier',
      emptyWishlist: 'Liste de souhaits vide',
      emptyWishlistMessage: 'Votre liste de souhaits est vide',
      addToCartSuccess: 'Ajouté au panier',
      removeFromWishlistSuccess: 'Retiré de la liste de souhaits',
    },
    seller: {
      dashboard: 'Tableau de bord vendeur',
      overview: 'Aperçu',
      products: 'Produits',
      orders: 'Commandes',
      earnings: 'Gains',
      settings: 'Paramètres',
      addProduct: 'Ajouter un produit',
      editProduct: 'Modifier le produit',
      deleteProduct: 'Supprimer le produit',
      productDetails: 'Détails du produit',
      productImages: 'Images du produit',
      productPricing: 'Tarification du produit',
      productInventory: 'Inventaire du produit',
      productShipping: 'Livraison du produit',
      sales: 'Ventes',
      revenue: 'Revenus',
      customers: 'Clients',
      reviews: 'Avis',
      payouts: 'Paiements',
      storeSettings: 'Paramètres du magasin',
      profileSettings: 'Paramètres du profil',
      paymentSettings: 'Paramètres de paiement',
      shippingSettings: 'Paramètres de livraison',
      notificationSettings: 'Paramètres de notification',
      analytics: 'Analytique',
      performance: 'Performance',
      topProducts: 'Meilleurs produits',
      recentOrders: 'Commandes récentes',
      customerFeedback: 'Commentaires clients',
      salesChart: 'Graphique des ventes',
      revenueChart: 'Graphique des revenus',
      orderChart: 'Graphique des commandes',
      customerChart: 'Graphique des clients',
      totalSales: 'Ventes totales',
      totalRevenue: 'Revenus totaux',
      totalOrders: 'Commandes totales',
      totalCustomers: 'Clients totaux',
      averageRating: 'Note moyenne',
      responseTime: 'Temps de réponse',
      fulfillmentRate: 'Taux de réalisation',
      returnRate: 'Taux de retour',
      pendingProducts: 'Produits en attente',
      approvedProducts: 'Produits approuvés',
      rejectedProducts: 'Produits rejetés',
      activeOrders: 'Commandes actives',
      completedOrders: 'Commandes terminées',
      pendingPayouts: 'Paiements en attente',
      completedPayouts: 'Paiements terminés',
      totalEarnings: 'Gains totaux',
      availableBalance: 'Solde disponible',
      withdraw: 'Retirer',
      withdrawalHistory: 'Historique des retraits',
      bankAccount: 'Compte bancaire',
      mobileMoney: 'Mobile Money',
      payoutRequest: 'Demande de paiement',
      payoutProcessing: 'Paiement en cours',
      payoutCompleted: 'Paiement terminé',
      payoutFailed: 'Paiement échoué',
    },
    admin: {
      dashboard: 'Tableau de bord admin',
      overview: 'Aperçu',
      users: 'Utilisateurs',
      sellers: 'Vendeurs',
      products: 'Produits',
      orders: 'Commandes',
      categories: 'Catégories',
      settings: 'Paramètres',
      analytics: 'Analytique',
      reports: 'Rapports',
      logs: 'Journaux',
      totalUsers: 'Utilisateurs totaux',
      totalSellers: 'Vendeurs totaux',
      totalProducts: 'Produits totaux',
      totalOrders: 'Commandes totales',
      totalRevenue: 'Revenus totaux',
      pendingApprovals: 'Approbations en attente',
      activeSellers: 'Vendeurs actifs',
      activeProducts: 'Produits actifs',
      recentActivity: 'Activité récente',
      systemHealth: 'Santé du système',
      databaseStatus: 'État de la base de données',
      apiStatus: 'État de l\'API',
      storageStatus: 'État du stockage',
      performance: 'Performance',
      uptime: 'Temps de disponibilité',
      responseTime: 'Temps de réponse',
      errorRate: 'Taux d\'erreur',
      bandwidth: 'Bande passante',
      storage: 'Stockage',
      usersChart: 'Graphique des utilisateurs',
      sellersChart: 'Graphique des vendeurs',
      productsChart: 'Graphique des produits',
      ordersChart: 'Graphique des commandes',
      revenueChart: 'Graphique des revenus',
      approveUser: 'Approuver l\'utilisateur',
      rejectUser: 'Rejeter l\'utilisateur',
      approveSeller: 'Approuver le vendeur',
      rejectSeller: 'Rejeter le vendeur',
      approveProduct: 'Approuver le produit',
      rejectProduct: 'Rejeter le produit',
      suspendUser: 'Suspendre l\'utilisateur',
      suspendSeller: 'Suspendre le vendeur',
      suspendProduct: 'Suspendre le produit',
      deleteProduct: 'Supprimer le produit',
      editCategory: 'Modifier la catégorie',
      addCategory: 'Ajouter une catégorie',
      deleteCategory: 'Supprimer la catégorie',
      systemSettings: 'Paramètres système',
      emailSettings: 'Paramètres email',
      paymentSettings: 'Paramètres de paiement',
      shippingSettings: 'Paramètres de livraison',
      taxSettings: 'Paramètres fiscaux',
      securitySettings: 'Paramètres de sécurité',
      maintenanceMode: 'Mode maintenance',
      backup: 'Sauvegarde',
      restore: 'Restauration',
      exportData: 'Exporter les données',
      importData: 'Importer les données',
      generateReport: 'Générer un rapport',
      viewLogs: 'Voir les journaux',
      clearLogs: 'Effacer les journaux',
    },
    sourcing: {
      title: 'Approvisionnement mondial',
      subtitle: 'Demander des produits aux fournisseurs internationaux',
      submitRequest: 'Soumettre une demande',
      myRequests: 'Mes demandes',
      requestStatus: 'État de la demande',
      product: 'Produit',
      quantity: 'Quantité',
      unit: 'Unité',
      budget: 'Budget',
      description: 'Description',
      country: 'Pays',
      submit: 'Soumettre',
      submitted: 'Soumis',
      processing: 'En traitement',
      quoted: 'Devisé',
      approved: 'Approuvé',
      paid: 'Payé',
      inTransit: 'En transit',
      delivered: 'Livré',
      cancelled: 'Annulé',
      tracking: 'Suivi',
      supplier: 'Fournisseur',
      quote: 'Devis',
      notes: 'Notes',
      history: 'Historique',
      submitSuccess: 'Demande soumise avec succès',
      submitError: 'Échec de la soumission de la demande',
      noRequests: 'Aucune demande',
      noRequestsMessage: 'Vous n\'avez pas de demandes d\'approvisionnement',
    },
    about: {
      title: 'À propos de nous',
      subtitle: 'En savoir plus sur ZENDO Marketplace',
      mission: 'Notre mission',
      vision: 'Notre vision',
      values: 'Nos valeurs',
      story: 'Notre histoire',
      team: 'Notre équipe',
      partners: 'Nos partenaires',
      careers: 'Carrières',
      contact: 'Contact',
      location: 'Emplacement',
      hours: 'Heures',
      phone: 'Téléphone',
      email: 'Email',
      address: 'Adresse',
    },
    footer: {
      aboutUs: 'À propos de nous',
      customerService: 'Service client',
      myAccount: 'Mon compte',
      followUs: 'Suivez-nous',
      newsletter: 'Newsletter',
      subscribe: 'S\'abonner',
      subscribeSuccess: 'Abonnement réussi',
      subscribeError: 'Échec de l\'abonnement',
      copyright: 'Copyright',
      allRightsReserved: 'Tous droits réservés',
      termsOfService: 'Conditions d\'utilisation',
      privacyPolicy: 'Politique de confidentialité',
      cookiePolicy: 'Politique de cookies',
      sitemap: 'Plan du site',
      contactUs: 'Contactez-nous',
      faq: 'FAQ',
      shipping: 'Livraison',
      returns: 'Retours',
      sizeGuide: 'Guide des tailles',
      storeLocator: 'Localisateur de magasin',
      giftCards: 'Cartes cadeaux',
      affiliate: 'Affiliation',
      studentDiscount: 'Remise étudiant',
      militaryDiscount: 'Remise militaire',
      firstResponderDiscount: 'Remise premiers secours',
      trust1Title: 'Protection Escrow 100%',
      trust1Desc: 'Marchands certifiés et vérifiés',
      trust2Title: 'Livraison dans tout le Rwanda',
      trust2Desc: 'Livraison à domicile dans les 30 districts',
      trust3Title: 'Support Client 24/7',
      trust3Desc: 'Assistance: +250 793 032 430',
      trust4Title: 'Sourcing Usine Mondial',
      trust4Desc: 'Devis directs des hubs industriels vérifiés',
      brandDescription: "Créer de la valeur. Autonomiser la croissance. ZENDO est la première place de marché multi-vendeurs au Rwanda connectant des vendeurs vérifiés, des fournisseurs mondiaux et des clients avec paiement instantané MTN MoMo, Airtel Money et carte bancaire.",
      headquarters: 'Siège: Kigali City Center, Nyarugenge, Kigali, Rwanda',
      phoneSupport: 'Téléphone / WhatsApp: +250 793 032 430',
      marketplaceTitle: 'Marché',
      allProductsCatalog: 'Catalogue de tous les produits',
      verifiedSuppliers: 'Fournisseurs Vérifiés',
      factorySourcingRfq: 'Demande de Sourcing Usine (RFQ)',
      trackOrderStatus: 'Suivi de Commande',
      merchantHubTitle: 'Espace Marchand',
      applyVerifiedSeller: 'Devenir Vendeur Vérifié',
      sellerOperationsHub: "Centre d'Opérations Vendeur",
      aboutZendoRwanda: 'À propos de ZENDO Rwanda',
      acceptedPaymentsTitle: 'Moyens de Paiement Acceptés',
      acceptedPaymentsDesc: 'Paiement local MoMo et cartes bancaires internationales :',
      momoPayment: 'MTN MoMo (*182#)',
      airtelPayment: 'Airtel Money (*185#)',
      visaPayment: 'Visa',
      mastercardPayment: 'Mastercard',
      cashOnDelivery: 'Paiement à la livraison',
      allRightsReservedText: 'ZENDO Marketplace Rwanda. Tous droits réservés. Créer de la valeur. Autonomiser la croissance.',
    },
    errors: {
      pageNotFound: 'Page non trouvée',
      pageNotFoundMessage: 'La page que vous recherchez n\'existe pas',
      goHome: 'Retour à l\'accueil',
      serverError: 'Erreur serveur',
      serverErrorMessage: 'Quelque chose s\'est mal passé de notre côté',
      tryAgain: 'Veuillez réessayer plus tard',
      somethingWentWrong: 'Quelque chose s\'est mal passé',
      unexpectedError: 'Une erreur inattendue s\'est produite',
    },
    success: {
      operationComplete: 'Opération terminée avec succès',
      dataSaved: 'Données enregistrées avec succès',
      changesApplied: 'Modifications appliquées avec succès',
      requestSubmitted: 'Demande soumise avec succès',
      emailSent: 'Email envoyé avec succès',
      passwordReset: 'Mot de passe réinitialisé avec succès',
      accountCreated: 'Compte créé avec succès',
      loggedOut: 'Déconnexion réussie',
    },
  },
  sw: {
    common: {
      loading: 'Inapakia...',
      search: 'Tafuta',
      searchPlaceholder: 'Tafuta bidhaa, vikundi...',
      welcome: 'Karibu',
      login: 'Ingia',
      register: 'Jiunge',
      logout: 'Ondoka',
      myAccount: 'Akaunti yangu',
      myOrders: 'Oda zangu',
      myWishlist: 'Orodha zangu',
      cart: 'Gari',
      checkout: 'Lipa',
      continueShopping: 'Endeleza kununua',
      addToCart: 'Weka kwenye gari',
      removeFromCart: 'Ondoa kwenye gari',
      updateQuantity: 'Sasisha idadi',
      subtotal: 'Jumla ya awali',
      total: 'Jumla',
      shipping: 'Usafiri',
      freeShipping: 'Usafiri bure',
      applyCoupon: 'Tumia kipunguzo',
      couponApplied: 'Kipunguzo imetumikwa',
      invalidCoupon: 'Kipunguzo si sahihi',
      proceedToCheckout: 'Endeleza kulipa',
      emptyCart: 'Gari lako ni tupu',
      yourCartIsEmpty: 'Gari lako ni tupu',
      currency: 'Sarafu',
      language: 'Lugha',
      darkMode: 'Hali giza',
      lightMode: 'Hali angavu',
      back: 'Rudi',
      next: 'Endeleza',
      previous: 'Iliyopita',
      save: 'Hifadhi',
      cancel: 'Ghairi',
      delete: 'Futa',
      edit: 'Hariri',
      view: 'Angalia',
      close: 'Funga',
      open: 'Fungua',
      submit: 'Tuma',
      confirm: 'Thibitisha',
      success: 'Mafanikio',
      error: 'Kosa',
      warning: 'Onyo',
      info: 'Maelezo',
      yes: 'Ndio',
      no: 'Hapana',
      or: 'au',
      and: 'na',
      all: 'Zote',
      none: 'Hakuna',
      searchResults: 'Matoke ya utafutaji',
      noResults: 'Hakuna matoke yaliyopatikana',
      filter: 'Chuja',
      sort: 'Panga',
      sortBy: 'Panga kwa',
      price: 'Bei',
      rating: 'Mnyororo',
      newest: 'Mpya',
      popularity: 'Umaarufu',
      relevance: 'Uhusiano',
      page: 'Ukurasa',
      of: 'ya',
      itemsPerPage: 'vitu kila ukurasa',
      showing: 'Inaonyesha',
      to: 'hadi',
      results: 'matoke',
      clear: 'Futa',
      select: 'Chagua',
      selected: 'Imechaguliwa',
      loadingData: 'Inapakia data...',
      pleaseWait: 'Tafadhali subiri...',
      refresh: 'Onyesha upya',
      retry: 'Jaribu tena',
      errorOccurred: 'Kosa imetokea',
      tryAgain: 'Tafadhali jaribu tena',
      networkError: 'Kosa ya mtandao',
      serverError: 'Kosa ya seva',
      unknownError: 'Kosa isiyojulikana',
    },
    nav: {
      home: 'Nyumbani',
      products: 'Bidhaa',
      categories: 'Vikundi',
      sellers: 'Wauzaji',
      sourcing: 'Uchukuzi',
      becomeSeller: 'Kuwa Mauzaji',
      trackOrder: 'Fuatilia oda',
      about: 'Kuhusu',
      contact: 'Wasiliana',
      faq: 'Maswali',
      terms: 'Masharti',
      privacy: 'Faragha',
      language: 'Lugha',
      currency: 'Sarafu',
      profile: 'Wasifu',
      dashboard: 'Dashibodi',
      settings: 'Mipangilio',
      logout: 'Ondoka',
      browse: 'Vinjari',
      source: 'Chanzo',
      sell: 'Uza',
      suppliers: 'Wasambazaji',
      searchPlaceholder: 'Tafuta bidhaa, brands na wauzaji…',
    },
    hero: {
      title: 'ZENDO',
      subtitle: 'Lango lako la kidijitali kwa bidhaa, wasambazaji na masoko.',
      punchline: 'Nunua ndani ya nchi. Uza mtandaoni. Tafuta kote Afrika.',
      shopProducts: 'Nunua Bidhaa',
      becomeSeller: 'Kuwa Muuzaji',
      sourceProduct: 'Agiza Bidhaa',
      findSuppliers: 'Tafuta Wasambazaji',
      cta1: 'Nunua Sasa',
      cta2: 'Kuwa Muuzaji',
      cta3: 'Fuatilia Oda',
      featured1: 'Elektroniki',
      slide1Badge: 'Soko Kuu la Wauzaji Wengi Duniani',
      slide2Badge: 'Usafirishaji wa Haraka Duniani',
      slide3Badge: 'Wafanyabiashara & Bidhaa Zilizothibitishwa',
      slide4Badge: 'Saa za Anasa, Mitindo & Bidhaa za Wasanii',
      slide1Title1: 'Kujenga Thamani.',
      slide1Title2: 'Kukuza Ukuaji Duniani.',
      slide2Title1: 'Teknolojia ya Kisasa &',
      slide2Title2: 'Usambazaji wa Viwanda.',
      slide3Title1: 'Anasa Iliyochaguliwa.',
      slide3Title2: 'Uhalisi Usiokataliwa.',
      slide4Title1: 'Msanifu wa Kimataifa',
      slide4Title2: 'Kuunganisha Mabara & Biashara.',
      slide1Sub: 'Unganisha na watengenezaji walioidhinishwa, wasambazaji wa teknolojia wa kimataifa, na wachuuzi wa hali ya juu duniani kote.',
      slide2Sub: 'Rahisisha mnyororo wako wa ugavi wa kimataifa na bei za OEM, uwasilishaji wa DHL Express katika siku 2-4, na muundo wa sarafu nyingi.',
      slide3Sub: 'Gundua kompyuta za hali ya juu, uvumbuzi wa nyumba smart, robotiki sahihi, na makusanyo ya wasanifu na muhuri wa uhalisi ulioidhinishwa 100%.',
      slide4Sub: 'Kutoka mitindo ya kifahari ya Milan na London hadi vifaa vya usahihi vya Tokyo — pata maelfu ya makusanyo ya kimataifa yaliyochaguliwa.',
      slide1Cta1: 'Chunguza Soko',
      slide1Cta2: 'Usambazaji Duniani (RFQ)',
      slide2Cta1: 'Tazama Elektroniki',
      slide2Cta2: 'Wasambazaji Waliothibitishwa',
      slide3Cta1: 'Nunua Vipya',
      slide3Cta2: 'Kuwa Mfanyabiashara wa Kimataifa',
      slide4Cta1: 'Chunguza Anasa & Mitindo',
      slide4Cta2: 'Fuatilia Usafirishaji',
      heroSearchPlaceholder: 'Tafuta bidhaa, brands & vipande (mf. MacBook M3, DJI Drone...)',
      heroSearchBtn: 'Tafuta Duniani',
      trustEscrow: 'Ulinzi wa Escrow 100%',
      trustShipping: 'Usafirishaji wa Haraka Duniani',
      trustReturn: 'Sera ya Kurudisha kwa Siku 14',
    },
    home: {
      popularCategories: 'Makundi Maarufu ya Kimataifa',
      popularCategoriesSubtitle: 'Orodha ya kimataifa iliyochaguliwa kutoka kwa watengenezaji na bidhaa zilizoidhinishwa',
      exploreAll: 'Chunguza Makundi Yote',
      flashDeals: 'Mauzo ya Haraka ya Kimataifa',
      flashDealsSubtitle: 'Punguzo la moja kwa moja kutoka kiwanda kwa idadi ndogo na usafirishaji wa haraka',
      promotionEndsIn: 'Orodha inaisha:',
      trendingCatalog: 'Orodha ya Kimataifa Inayoongezeka',
      trendingCatalogSubtitle: 'Chunguza bidhaa za hali ya juu zinazohitajika sana zinalindwa na ulinzi wa escrow 100% wa Zendo',
      tabFeatured: 'Zilizoangaziwa',
      tabDeals: 'Punguzo Bora',
      tabNew: 'Vipya',
      merchantHub: 'Kituo cha Wafanyabiashara wa Kimataifa',
      merchantHubTitle: 'Uza kwa Mamilioni ya Wanunuzi wa Kimataifa',
      merchantHubSubtitle: 'Anzisha duka lako la kimataifa lilioidhinishwa bila ada za kuanza. Pata malipo ya kiotomatiki ya sarafu nyingi na mitandao ya wanunuzi walioidhinishwa.',
      applyMerchant: 'Omba kuwa Mfanyabiashara wa Kimataifa',
      learnMore: 'Jifunza Zaidi',
      rfqBadge: 'Usambazaji wa Kiwanda Duniani (RFQ)',
      rfqTitle1: 'Usambazaji wa Kiwanda Duniani',
      rfqTitle2: 'Nukuu za OEM za Desturi kwa Masaa 24',
      rfqSubtitle: 'Unatafuta utengenezaji maalum, mashine, au elektroniki kwa jumla? Wasilisha specs na bajeti yako. Wataalamu wetu wanashughulikia moja kwa moja na viwanda vilivyoidhinishwa.',
      submitRfq: 'Wasilisha RFQ',
      suppliersTitle: 'Wasambazaji & Watengenezaji wa Kimataifa Waliothibitishwa',
      suppliersSubtitle: 'Vituo vya ushirikiano wa B2B katika Amerika Kaskazini, Ulaya, Asia, na Afrika',
      viewDirectory: 'Tazama Orodha Kamili',
      verifiedPartner: 'Mshirika Aliyethibitishwa',
      items: 'bidhaa',
    },
    products: {
      allProducts: 'Bidhaa zote',
      featuredProducts: 'Bidhaa zilizopendekezwa',
      newArrivals: 'Bidhaa mpya',
      bestSellers: 'Bidhaa zinazouzwa sana',
      onSale: 'Zinauzwa',
      inStock: 'Zipo',
      outOfStock: 'Hazipo',
      limitedStock: 'Zipo kidogo',
      freeDelivery: 'Usafiri bure',
      codAvailable: 'Lipa kwenye kupevuli inapatikana',
      verifiedSeller: 'Mauzaji mwenye uhakika',
      addToWishlist: 'Weka kwenye orodha',
      removeFromWishlist: 'Ondoa kwenye orodha',
      quickView: 'Angalia haraka',
      viewDetails: 'Angalia maelezo',
      productDetails: 'Maelezo ya bidhaa',
      description: 'Maelezo',
      specifications: 'Vipimo',
      reviews: 'Maoni',
      writeReview: 'Andika maoni',
      relatedProducts: 'Bidhaa zinazohusiana',
      frequentlyBoughtTogether: 'Zinazouzwa pamoja mara kwa mara',
      youMayAlsoLike: 'Unaweza kupenda pia',
      quantity: 'Idadi',
      sku: 'SKU',
      brand: 'Chapa',
      category: 'Kundi',
      seller: 'Mauzaji',
      rating: 'Mnyororo',
      reviewsCount: 'Maoni',
      inWishlist: 'Kwenye orodha',
      addedToCart: 'Imewekwa kwenye gari',
      addedToWishlist: 'Imewekwa kwenye orodha',
      removedFromCart: 'Imeondolewa kwenye gari',
      removedFromWishlist: 'Imeondolewa kwenye orodha',
    },
    categories: {
      allCategories: 'Vikundi vyote',
      electronics: 'Elektroniki',
      fashion: 'Mavazi',
      home: 'Nyumba',
      automotive: 'Magari',
      sports: 'Michezo',
      health: 'Afya',
      industrial: 'Viwanda',
      cameras: 'Kamera',
      appliances: 'Vifaa',
      solar: 'Jua',
      food: 'Chakula',
      drones: 'Drones',
    },
    auth: {
      login: 'Ingia',
      register: 'Jiunge',
      forgotPassword: 'Umesahau neno la siri',
      resetPassword: 'Badilisha neno la siri',
      email: 'Barua pepe',
      password: 'Neno la siri',
      confirmPassword: 'Thibitisha neno la siri',
      fullName: 'Jina kamili',
      phone: 'Simu',
      rememberMe: 'Nikumbuke',
      loginTitle: 'Karibu tena',
      loginSubtitle: 'Ingia kwenye akaunti yako',
      registerTitle: 'Fungua akaunti',
      registerSubtitle: 'Jiunge ZENDO Marketplace',
      forgotTitle: 'Umesahau neno la siri',
      forgotSubtitle: 'Badilisha neno la siri',
      resetTitle: 'Badilisha neno la siri',
      resetSubtitle: 'Weka neno la siri jipya',
      alreadyHaveAccount: 'Tayari una akaunti?',
      dontHaveAccount: 'Huna akaunti?',
      signIn: 'Ingia',
      signUp: 'Jiunge',
      sendResetLink: 'Tuma kiungo cha kubadilisha',
      backToLogin: 'Rudi kwenye kuingia',
      passwordResetSent: 'Kiungo cha kubadilisha neno la siri kimetumwa',
      passwordChanged: 'Neno la siri limebadilishwa kikamilifu',
      loginSuccess: 'Kuingia imefanikiwa',
      registerSuccess: 'Kujiunga imefanikiwa',
      loginError: 'Kuinga imeshindwa',
      registerError: 'Kujiunga imeshindwa',
      resetError: 'Kubadilisha neno la siri imeshindwa',
      invalidCredentials: ' credentials sio sahihi',
      emailAlreadyExists: 'Barua pepe tayari ipo',
      weakPassword: 'Neno la siri ni dhaifu',
      passwordMismatch: 'Maneno ya siri hayafanani',
      emailRequired: 'Barua pepe inahitajika',
      passwordRequired: 'Neno la siri inahitajika',
      nameRequired: 'Jina linahitajika',
    },
    checkout: {
      title: 'Lipa',
      subtitle: 'Kamilisha oda yako',
      customerInfo: 'Maelezo ya mteja',
      shippingAddress: 'Anwani ya usafiri',
      billingAddress: 'Anwani ya malipo',
      paymentMethod: 'Njia ya malipo',
      orderSummary: 'Muhtasari wa oda',
      placeOrder: 'Tuma oda',
      processing: 'Inashughulikia...',
      orderSuccess: 'Oda imetumwa kikamilifu!',
      orderFailed: 'Oda imeshindwa',
      firstName: 'Jina la kwanza',
      lastName: 'Jina la mwisho',
      address: 'Anwani',
      city: 'Jiji',
      state: 'Mkoa',
      postalCode: 'Namba ya posta',
      country: 'Nchi',
      phone: 'Simu',
      email: 'Barua pepe',
      saveAddress: 'Hifadhi anwani',
      useSavedAddress: 'Tumia anwani iliyohifadhiwa',
      cardNumber: 'Namba ya kadi',
      expiryDate: 'Tarehe ya kuisha',
      cvv: 'CVV',
      cardHolder: 'Mmiliki wa kadi',
      saveCard: 'Hifadhi kadi',
      payWithCard: 'Lipa kwa kadi',
      payWithPayPal: 'Lipa kwa PayPal',
      payWithMobileMoney: 'Lipa kwa Mobile Money',
      cashOnDelivery: 'Lipa kwenye kupevuli',
      deliveryInstructions: 'Maelezo ya usafiri',
      estimatedDelivery: 'Usafiri uliokusubiriwa',
      deliveryOptions: 'Chaguo za usafiri',
      standardDelivery: 'Usafiri wa kawaida',
      expressDelivery: 'Usafiri wa haraka',
      sameDayDelivery: 'Usafiri wa siku moja',
      freeDelivery: 'Usafiri bure',
      pickup: 'Chukua',
      termsAndConditions: 'Masharti na sheria',
      agreeToTerms: 'Nakubaliana na masharti na sheria',
      orderConfirmation: 'Uthibitisho wa oda',
      orderNumber: 'Namba ya oda',
      trackingNumber: 'Namba ya kufuatilia',
      estimatedArrival: 'Uwasilishaji uliokusubiriwa',
      deliveryAddress: 'Anwani ya usafiri',
      contactInfo: 'Maelezo ya mawasiliano',
      orderPlaced: 'Oda imetumwa',
      thankYouForOrder: 'Asante kwa oda yako!',
      emailConfirmation: 'Utapokea uthibitisho kupitia barua pepe',
      trackOrderStatus: 'Fuatilia hali ya oda yako',
    },
    orders: {
      myOrders: 'Oda zangu',
      orderHistory: 'Historia ya oda',
      orderDetails: 'Maelezo ya oda',
      orderStatus: 'Hali ya oda',
      tracking: 'Kufuatilia',
      orderDate: 'Tarehe ya oda',
      orderTotal: 'Jumla ya oda',
      orderItems: 'Vitu vya oda',
      shippingAddress: 'Anwani ya usafiri',
      paymentMethod: 'Njia ya malipo',
      paymentStatus: 'Hali ya malipo',
      pending: 'Inasubiri',
      confirmed: 'Imethibitishwa',
      processing: 'Inashughulikia',
      shipped: 'Imetumwa',
      delivered: 'Imewasilishwa',
      cancelled: 'Imefutwa',
      refunded: 'Imerudishwa',
      statusHistory: 'Historia ya hali',
      trackPackage: 'Fuatilia kifurushi',
      contactSupport: 'Wasiliana na huduma',
      reorder: 'Tuma tena',
      cancelOrder: 'Futa oda',
      returnOrder: 'Rudisha oda',
      viewInvoice: 'Angalia ankara',
      downloadInvoice: 'Pakua ankara',
      noOrders: 'Hakuna oda',
      noOrdersMessage: 'Huna oda bado',
    },
    wishlist: {
      myWishlist: 'Orodha yangu',
      addToCart: 'Weka kwenye gari',
      removeFromWishlist: 'Ondoa kwenye orodha',
      moveToCart: 'Hamisha kwenye gari',
      emptyWishlist: 'Orodha tupu',
      emptyWishlistMessage: 'Orodha yako ni tupu',
      addToCartSuccess: 'Imewekwa kwenye gari',
      removeFromWishlistSuccess: 'Imeondolewa kwenye orodha',
    },
    seller: {
      dashboard: 'Dashibodi ya muuzaji',
      overview: 'Muhtasari',
      products: 'Bidhaa',
      settings: 'Mipangilio',
      addProduct: 'Weka bidhaa',
      editProduct: 'Hariri bidhaa',
      deleteProduct: 'Futa bidhaa',
      productDetails: 'Maelezo ya bidhaa',
      productImages: 'Picha za bidhaa',
      productPricing: 'Bei ya bidhaa',
      productInventory: 'Duka la bidhaa',
      productShipping: 'Usafiri wa bidhaa',
      sales: 'Mauzo',
      revenue: 'Mapato',
      orders: 'Oda',
      customers: 'Wateja',
      reviews: 'Maoni',
      earnings: 'Mapato',
      payouts: 'Malipo',
      storeSettings: 'Mipangilio ya duka',
      profileSettings: 'Mipangilio ya wasifu',
      paymentSettings: 'Mipangilio ya malipo',
      shippingSettings: 'Mipangilio ya usafiri',
      notificationSettings: 'Mipangilio ya arifa',
      analytics: 'Uchambuzi',
      performance: 'Ukamilifu',
      topProducts: 'Bidhaa bora',
      recentOrders: 'Oda za hivi karibuni',
      customerFeedback: 'Maoni ya wateja',
      salesChart: 'Chati ya mauzo',
      revenueChart: 'Chati ya mapato',
      orderChart: 'Chati ya oda',
      customerChart: 'Chati ya wateja',
      totalSales: 'Mauzo yote',
      totalRevenue: 'Mapato yote',
      totalOrders: 'Oda zote',
      totalCustomers: 'Wateja wote',
      averageRating: 'Mnyororo wa wastani',
      responseTime: 'Muda wa majibu',
      fulfillmentRate: 'Kiwango cha utekelezi',
      returnRate: 'Kiwango cha kurudisha',
      pendingProducts: 'Bidhaa zinasubiri',
      approvedProducts: 'Bidhaa zilizoidhinishwa',
      rejectedProducts: 'Bidhaa zilizokataliwa',
      activeOrders: 'Oda zinazofanya kazi',
      completedOrders: 'Oda zilizokamilika',
      pendingPayouts: 'Malipo yanayosubiri',
      completedPayouts: 'Malipo yaliyokamilika',
      totalEarnings: 'Mapato yote',
      availableBalance: 'Salio iliyopo',
      withdraw: 'Ondoa',
      withdrawalHistory: 'Historia ya kutoa',
      bankAccount: 'Akaunti ya benki',
      mobileMoney: 'Mobile Money',
      payoutRequest: 'Ombi la malipo',
      payoutProcessing: 'Malipo inashughulikia',
      payoutCompleted: 'Malipo imekamilika',
      payoutFailed: 'Malipo imeshindwa',
    },
    admin: {
      dashboard: 'Dashibodi ya admin',
      overview: 'Muhtasari',
      users: 'Watumiaji',
      sellers: 'Wauzaji',
      products: 'Bidhaa',
      orders: 'Oda',
      categories: 'Vikundi',
      settings: 'Mipangilio',
      analytics: 'Uchambuzi',
      reports: 'Ripoti',
      logs: 'Kumbukumbu',
      totalUsers: 'Watumiaji wote',
      totalSellers: 'Wauzaji wote',
      totalProducts: 'Bidhaa zote',
      totalOrders: 'Oda zote',
      totalRevenue: 'Mapato yote',
      pendingApprovals: 'Idhini zinazosubiri',
      activeSellers: 'Wauzaji wanaofanya kazi',
      activeProducts: 'Bidhaa zinazofanya kazi',
      recentActivity: 'Shughuli za hivi karibuni',
      systemHealth: 'Afya ya mfumo',
      databaseStatus: 'Hali ya database',
      apiStatus: 'Hali ya API',
      storageStatus: 'Hali ya uhifadhi',
      performance: 'Ukamilifu',
      uptime: 'Wakati wa upo',
      responseTime: 'Muda wa majibu',
      errorRate: 'Kiwango cha kosa',
      bandwidth: 'Bandwidth',
      storage: 'Uhifadhi',
      usersChart: 'Chati ya watumiaji',
      sellersChart: 'Chati ya wauzaji',
      productsChart: 'Chati ya bidhaa',
      ordersChart: 'Chati ya oda',
      revenueChart: 'Chati ya mapato',
      approveUser: 'Idhinisha mtumiaji',
      rejectUser: 'Kataa mtumiaji',
      approveSeller: 'Idhinisha mauzaji',
      rejectSeller: 'Kataa mauzaji',
      approveProduct: 'Idhinisha bidhaa',
      rejectProduct: 'Kataa bidhaa',
      suspendUser: 'Sitisha mtumiaji',
      suspendSeller: 'Sitisha mauzaji',
      suspendProduct: 'Sitisha bidhaa',
      deleteProduct: 'Futa bidhaa',
      editCategory: 'Hariri kundi',
      addCategory: 'Weka kundi',
      deleteCategory: 'Futa kundi',
      systemSettings: 'Mipangilio ya mfumo',
      emailSettings: 'Mipangilio ya barua pepe',
      paymentSettings: 'Mipangilio ya malipo',
      shippingSettings: 'Mipangilio ya usafiri',
      taxSettings: 'Mipangilio ya kodi',
      securitySettings: 'Mipangilio ya usalama',
      maintenanceMode: 'Hali ya matengenezo',
      backup: 'Hifadhi nakala',
      restore: 'Rudisha',
      exportData: 'Toa data',
      importData: 'Ingiza data',
      generateReport: 'Tengeneza ripoti',
      viewLogs: 'Angalia kumbukumbu',
      clearLogs: 'Futa kumbukumbu',
    },
    sourcing: {
      title: 'Uchukuzi wa kimataifa',
      subtitle: 'Omba bidhaa kutoka wauzaji wa kimataifa',
      submitRequest: 'Tuma ombi',
      myRequests: 'Ombi zangu',
      requestStatus: 'Hali ya ombi',
      product: 'Bidhaa',
      quantity: 'Idadi',
      unit: 'Kipande',
      budget: 'Bajeti',
      description: 'Maelezo',
      country: 'Nchi',
      submit: 'Tuma',
      submitted: 'Imetumwa',
      processing: 'Inashughulikia',
      quoted: 'Imetolewa bei',
      approved: 'Imeidhinishwa',
      paid: 'Imelipwa',
      inTransit: 'Inasafiri',
      delivered: 'Imewasilishwa',
      cancelled: 'Imefutwa',
      tracking: 'Kufuatilia',
      supplier: 'Muuza',
      quote: 'Bei',
      notes: 'Maelezo',
      history: 'Historia',
      submitSuccess: 'Ombi imetumwa kikamilifu',
      submitError: 'Imeshindwa kutuma ombi',
      noRequests: 'Hakuna ombi',
      noRequestsMessage: 'Huna ombi za uchukuzi',
    },
    about: {
      title: 'Kuhusu',
      subtitle: 'Jifaidi zaidi kuhusu ZENDO Marketplace',
      mission: 'Dhamira yetu',
      vision: 'Lengo letu',
      values: 'Thamani zetu',
      story: 'Hadithi yetu',
      team: 'Timu yetu',
      partners: 'Washirika',
      careers: 'Kazi',
      contact: 'Wasiliana',
      location: 'Mahaliipo',
      hours: 'Saa',
      phone: 'Simu',
      email: 'Barua pepe',
      address: 'Anwani',
    },
    footer: {
      aboutUs: 'Kuhusu sisi',
      customerService: 'Huduma kwa wateja',
      myAccount: 'Akaunti yangu',
      followUs: 'Tufuate',
      newsletter: 'Jarida la habari',
      subscribe: 'Jiunge',
      subscribeSuccess: 'Umejiunga kikamilifu',
      subscribeError: 'Imeshindwa kujiunga',
      copyright: 'Haki miliki',
      allRightsReserved: 'Haki zote zimehifadhiwa',
      termsOfService: 'Masharti ya huduma',
      privacyPolicy: 'Sera ya faragha',
      cookiePolicy: 'Sera ya kuki',
      sitemap: 'Ramani ya tovuti',
      contactUs: 'Wasiliana nasi',
      faq: 'Maswali',
      shipping: 'Usafiri',
      returns: 'Kurudisha',
      sizeGuide: 'Mwongozo wa ukubwa',
      storeLocator: 'Kiguta duka',
      giftCards: 'Kadi za zawadi',
      affiliate: 'Mshirika',
      studentDiscount: 'Punguzo kwa wanafunzi',
      militaryDiscount: 'Punguzo kwa jeshi',
      firstResponderDiscount: 'Punguzo kwa wahudumu wa kwanza',
      trust1Title: 'Ulinzi wa Escrow 100%',
      trust1Desc: 'Wafanyabiashara walioidhinishwa na kuthibitishwa',
      trust2Title: 'Uwasilishaji kote nchini Rwanda',
      trust2Desc: 'Uwasilishaji wa mlangoni katika wilaya zote 30',
      trust3Title: 'Huduma kwa Wateja 24/7',
      trust3Desc: 'Nambari ya simu: +250 793 032 430',
      trust4Title: 'Usambazaji wa Kiwanda Duniani',
      trust4Desc: 'Nukuu za moja kwa moja kutoka vituo vya viwanda',
      brandDescription: 'Kujenga Thamani. Kuwasha Ukuaji. ZENDO ni soko kuu la wauzaji wengi nchini Rwanda linalounganisha wauzaji walioidhinishwa, wasambazaji wa kimataifa, na wanunuzi kwa malipo rahisi ya MTN MoMo, Airtel Money na kadi.',
      headquarters: 'Makao Makuu: Kigali City Center, Nyarugenge, Kigali, Rwanda',
      phoneSupport: 'Simu / WhatsApp: +250 793 032 430',
      marketplaceTitle: 'Soko Kuu',
      allProductsCatalog: 'Katalogi ya Bidhaa Zote',
      verifiedSuppliers: 'Wasambazaji Waliothibitishwa',
      factorySourcingRfq: 'Ombi la Usambazaji Kiwandani (RFQ)',
      trackOrderStatus: 'Fuatilia Hali ya Oda',
      merchantHubTitle: 'Kituo cha Wafanyabiashara',
      applyVerifiedSeller: 'Omba Kuwa Muuzaji Aliyethibitishwa',
      sellerOperationsHub: 'Kituo cha Uendeshaji cha Muuzaji',
      aboutZendoRwanda: 'Kuhusu ZENDO Rwanda',
      acceptedPaymentsTitle: 'Njia za Malipo Zinazokubalika',
      acceptedPaymentsDesc: 'Malipo ya haraka ya MoMo ya ndani na kadi za kimataifa:',
      momoPayment: 'MTN MoMo (*182#)',
      airtelPayment: 'Airtel Money (*185#)',
      visaPayment: 'Visa',
      mastercardPayment: 'Mastercard',
      cashOnDelivery: 'Lipa Baada ya Kupokea',
      allRightsReservedText: 'ZENDO Marketplace Rwanda. Haki zote zimehifadhiwa. Kujenga Thamani. Kuwasha Ukuaji.',
    },
    errors: {
      pageNotFound: 'Ukurasa haujapatikana',
      pageNotFoundMessage: 'Ukurasa unatafuta hauipo',
      goHome: 'Rudi nyumbani',
      serverError: 'Kosa la seva',
      serverErrorMessage: 'Kimejitokea kitu upande wetu',
      tryAgain: 'Tafadhali jaribu tena baadaye',
      somethingWentWrong: 'Kimejitokea kitu',
      unexpectedError: 'Kosa lisilotarajiwa imetokea',
    },
    success: {
      operationComplete: 'Uendeshaji umekamilika kikamilifu',
      dataSaved: 'Data imehifadhiwa kikamilifu',
      changesApplied: 'Mabadiliko yamekubaliwa kikamilifu',
      requestSubmitted: 'Ombi imetumwa kikamilifu',
      emailSent: 'Barua pepe imetumwa kikamilifu',
      passwordReset: 'Neno la siri limebadilishwa kikamilifu',
      accountCreated: 'Akaunti imeundwa kikamilifu',
      loggedOut: 'Umeondoka kikamilifu',
    },
  },
};