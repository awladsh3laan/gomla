// ============================================================
// 🔥 firebase-config.js - الإعدادات الموحدة للمشروع
// 📌 المصدر الوحيد لـ db و auth والثوابت
// ⚠️ ممنوع تعريف db أو auth في أي ملف آخر
// الإصدار: 7.0
// آخر تحديث: 2026-10-13
// 🆕 v7.0: إضافة 4 كولكشنز للمحتوى (shipping/exchange/terms/faq)
//         + تحديث رقم الواتساب + إضافة كل الكولكشنز المستقبلية
// ============================================================

// ============================================================
// 🔥 إعدادات Firebase
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyCdU3HadKWtzKtTAO9x7mcVPq6eodTqPzA",
  authDomain: "awlad-shalaan-wholesale.firebaseapp.com",
  projectId: "awlad-shalaan-wholesale",
  storageBucket: "awlad-shalaan-wholesale.firebasestorage.app",
  messagingSenderId: "390602001768",
  appId: "1:390602001768:web:05ec185f34ff0b5f7c1add"
};

// ============================================================
// 🔑 المفاتيح العالمية
// ============================================================
const IMGBB_API_KEY = "cb056b7fd83c81129d5468c5d03287b4";
const GEMINI_API_KEY = "AQ.Ab8RN6J_44fb2fdP2YWWxwq0aNnG7DXJnSv3O8whicffxAj_g";
const WHATSAPP_NUMBER = "01068385028";

// ============================================================
// 🚀 تهيئة Firebase
// ============================================================
firebase.initializeApp(firebaseConfig);

// ============================================================
// 🌐 التصدير العالمي (المصدر الوحيد)
// ============================================================
window.db = firebase.firestore();
window.auth = firebase.auth();

// ============================================================
// 💾 تفعيل Offline Persistence
// ============================================================
window.db.enablePersistence({ synchronizeTabs: true })
  .catch(err => {
    if (err.code !== 'failed-precondition' && err.code !== 'unimplemented') {
      console.warn('⚠️ Offline persistence:', err.code);
    }
  });

// ============================================================
// 🔑 تصدير المفاتيح
// ============================================================
window.IMGBB_API_KEY = IMGBB_API_KEY;
window.GEMINI_API_KEY = GEMINI_API_KEY;
window.WHATSAPP_NUMBER = WHATSAPP_NUMBER;

// ============================================================
// 👥 الأدوار (ROLES)
// ============================================================
window.ROLES = {
  SUPER: 'super',
  ADMIN_PLUS: 'admin_plus',
  ADMIN: 'admin',
  CASHIER: 'cashier',
  WHOLESALE: 'wholesale',
  RETAIL: 'retail',
  DELIVERY: 'delivery',
  GUEST: 'guest'
};

// ============================================================
// 🛡️ الصلاحيات (PERMISSIONS)
// ============================================================
window.PERMISSIONS = {
  super: ['*'],
  admin_plus: [
    'products.view', 'products.create', 'products.edit',
    'orders.view', 'orders.edit', 'orders.create',
    'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.payment',
    'customers.view', 'customers.edit.basic',
    'reports.view', 'reports.payment',
    'cashier.use',
    'suppliers.view', 'suppliers.edit',
    'purchases.view', 'purchases.edit',
    'cashbox.view', 'cashbox.edit',
    'financial.view', 'financial.approve',
    'sections.manage', 'partners.view',
    'delivery.manage'
  ],
  admin: [
    'products.view', 'products.create', 'products.edit',
    'orders.view', 'orders.edit', 'orders.create',
    'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.payment',
    'customers.view', 'customers.edit.basic',
    'reports.view', 'reports.payment',
    'cashier.use'
  ],
  cashier: [
    'branch.sales.create', 'branch.inventory.edit',
    'branch.purchases.create', 'branch.reports.view',
    'barcode.scan', 'shop.browse', 'shop.order'
  ],
  wholesale: [
    'shop.wholesale', 'orders.view.own', 'orders.create',
    'invoices.view.own', 'balance.view.own', 'tracking.view.own'
  ],
  retail: [
    'shop.retail', 'orders.view.own', 'orders.create',
    'invoices.view.own', 'balance.view.own', 'tracking.view.own',
    'wishlist.use'
  ],
  delivery: [
    'delivery.orders.view.own',
    'delivery.orders.pickup',
    'delivery.orders.deliver',
    'delivery.cash.collect',
    'delivery.available.view',
    'delivery.profile.view',
    'delivery.collections.view'
  ],
  guest: [
    'shop.retail', 'orders.create.guest'
  ]
};

// ============================================================
// 🏪 أنواع المتاجر
// ============================================================
window.STORE_TYPES = {
  WHOLESALE: 'wholesale',
  RETAIL: 'retail'
};

// ============================================================
// 💰 الحدود المالية
// ============================================================
window.WHOLESALE_MIN_ORDER = 1500;
window.RETAIL_MIN_ORDER = 0;

// ============================================================
// 🚚 أسعار الشحن
// ============================================================
window.SHIPPING_RATES = {
  wholesale: {
    'طنطا': { cost: 125, freeThreshold: 5000 },
    'المنصورة': { cost: 125, freeThreshold: 5000 },
    'المحلة': { cost: 50, freeThreshold: 2000 }
  },
  retail: {
    'الرجبي': { cost: 25, freeThreshold: 2500 },
    'أبو شاهين': { cost: 25, freeThreshold: 2500 },
    'السبع بنات': { cost: 35, freeThreshold: 2500 },
    'الجمهورية': { cost: 35, freeThreshold: 2500 },
    'سكة زفتى': { cost: 35, freeThreshold: 2500 },
    'الشعبية': { cost: 35, freeThreshold: 2500 },
    'الشعراوي': { cost: 35, freeThreshold: 2500 },
    'العلو': { cost: 35, freeThreshold: 2500 },
    'الشون': { cost: 35, freeThreshold: 2500 },
    'المعهد الديني': { cost: 35, freeThreshold: 2500 },
    'شارع 10': { cost: 35, freeThreshold: 2500 },
    'البندر': { cost: 35, freeThreshold: 2500 },
    'المشحمة': { cost: 35, freeThreshold: 2500 },
    'أبو راضي': { cost: 35, freeThreshold: 2500 },
    'الزراعة': { cost: 45, freeThreshold: 2500 },
    'أبو علي': { cost: 45, freeThreshold: 2500 },
    'كفر حجازي': { cost: 50, freeThreshold: 2500 }
  }
};

// ============================================================
// 🏷️ أكواد المدن للتجار
// ============================================================
window.CITY_CODES = {
  'المحلة': 'MHL',
  'المنصورة': 'MNS',
  'طنطا': 'TNT',
  'أخرى': 'OTH'
};

// ============================================================
// 📋 حالات الطلب
// ============================================================
window.ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PREPARING: 'preparing',
  AWAITING_APPROVAL: 'awaiting_approval',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// ============================================================
// 📋 حالات الدفع
// ============================================================
window.PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid'
};

// ============================================================
// 🚚 حالات التوصيل
// ============================================================
window.DELIVERY_STATUS = {
  UNASSIGNED: 'unassigned',
  ASSIGNED: 'assigned',
  PICKED_UP: 'picked_up',
  DELIVERED: 'delivered',
  FAILED: 'failed'
};

// ============================================================
// 💳 طرق الدفع
// ============================================================
window.PAYMENT_METHODS = {
  CASH: 'cash',
  INSTAPAY: 'instapay',
  WALLET: 'wallet'
};

window.PAYMENT_METHOD_LABELS = {
  cash: 'الدفع عند الاستلام',
  instapay: 'إنستا باي',
  wallet: 'محفظة إلكترونية'
};

window.WALLET_FEE_PERCENT = 1;
window.PAYMENT_ACCOUNT = '01068385028';

// ============================================================
// 🚚 إعدادات الموصلين
// ============================================================
window.DELIVERY_CONFIG = {
  CODE_PREFIX: 'DEL-',
  CODE_LENGTH: 5,
  EMAIL_DOMAIN: 'delivery.awladshalaan.com',
  MARKERS: ['@#$', '@#%', '@#&', '@#*', '@$%', '@$&', '@$*', '#$%', '#$&', '#$*', '$%&', '$%*'],
  AREAS_WHOLESALE: ['طنطا', 'المنصورة', 'المحلة'],
  AREAS_RETAIL: [
    'الرجبي', 'أبو شاهين', 'السبع بنات', 'الجمهورية', 'سكة زفتى', 'الشعبية',
    'الشعراوي', 'العلو', 'الشون', 'المعهد الديني', 'شارع 10', 'البندر',
    'المشحمة', 'أبو راضي', 'الزراعة', 'أبو علي', 'كفر حجازي'
  ],
  VEHICLES: ['موتوسيكل', 'توك توك', 'سيارة ربع نقل', 'سيارة نص نقل', 'دراجة', 'أخرى']
};

// ============================================================
// 📄 أنواع محتوى الصفحات القانونية
// ============================================================
window.CONTENT_TYPES = {
  TEXT: 'text',
  QUOTE: 'quote',
  LIST: 'list',
  CARDS: 'cards',
  TABLE: 'table',
  CONTACT: 'contact',
  STEPS: 'steps',
  FAQ: 'faq'
};

window.CONTENT_TYPE_LABELS = {
  text: 'فقرة نصية',
  quote: 'اقتباس مميز',
  list: 'قائمة نقطية',
  cards: 'شبكة كروت',
  table: 'جدول',
  contact: 'كروت تواصل',
  steps: 'خطوات مرقمة',
  faq: 'أسئلة وأجوبة'
};

// ============================================================
// 🗄️ أسماء الكولكشنز (لتجنب الأخطاء الإملائية)
// ============================================================
window.COLLECTIONS = {
  // ===== المستخدمين =====
  ADMINS: 'admins',
  CASHIERS: 'cashiers',
  CUSTOMERS: 'customers',
  USERS: 'users',
  DELIVERY_AGENTS: 'delivery_agents',
  DELIVERY_LOOKUP: 'delivery_lookup',
  DELIVERY_COLLECTIONS: 'delivery_collections',
  TRADER_LOOKUP: 'trader_lookup',
  
  // ===== المنتجات =====
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  BRANDS: 'brands',
  
  // ===== السلة والمفضلة =====
  CART: 'cart',
  WISHLIST: 'wishlist',
  
  // ===== الطلبات والفواتير =====
  ORDERS: 'orders',
  INVOICES: 'invoices',
  
  // ===== المالية =====
  SUPPLIERS: 'suppliers',
  PURCHASES: 'purchases',
  CASHBOX: 'cashbox',
  DAILY_SALES: 'daily_sales',
  FINANCIAL_NOTIFICATIONS: 'financial_notifications',
  
  // ===== الفروع =====
  BRANCHES: 'branches',
  BRANCH_INVENTORY: 'branch_inventory',
  
  // ===== الرتب والمكافآت =====
  RANKS: 'ranks',
  LEVELS: 'levels',
  REWARDS: 'rewards',
  
  // ===== الإشعارات =====
  NOTIFICATIONS: 'notifications',
  ADMIN_NOTIFICATIONS: 'admin_notifications',
  CUSTOMER_NOTIFICATIONS: 'customer_notifications',
  
  // ===== السجلات =====
  ACTIVITY_LOG: 'activityLog',
  BARCODE_SCANS: 'barcode_scans',
  
  // ===== المحتوى العام =====
  QUOTES: 'quotes',
  NEWS: 'news',
  ADS: 'ads',
  SLIDER: 'slider',
  PARTNERS: 'partners',
  CUSTOM_SECTIONS: 'custom_sections',
  SITE_CONTENT: 'site_content',
  PUBLIC_STATS: 'public_stats',
  
  // ===== الصفحات القانونية (5 صفحات) =====
  PRIVACY_SECTIONS: 'privacy_sections',
  SHIPPING_SECTIONS: 'shipping_sections',
  EXCHANGE_SECTIONS: 'exchange_sections',
  TERMS_SECTIONS: 'terms_sections',
  FAQ_SECTIONS: 'faq_sections',
  
  // ===== ميتا المحتوى =====
  PRIVACY_META: 'privacy_meta',
  SHIPPING_META: 'shipping_meta',
  EXCHANGE_META: 'exchange_meta',
  TERMS_META: 'terms_meta',
  FAQ_META: 'faq_meta',
  
  // ===== الدعم =====
  SUPPORT_TICKETS: 'support_tickets'
};

// ============================================================
// 📄 الصفحات القانونية (Meta Map للوصول السريع)
// ============================================================
window.LEGAL_PAGES = {
  privacy: {
    key: 'privacy',
    label: 'سياسة الخصوصية',
    collection: 'privacy_sections',
    meta: 'privacy_meta',
    page: '/gomla/privacy-policy.html',
    icon: 'fa-lock'
  },
  shipping: {
    key: 'shipping',
    label: 'سياسة الشحن',
    collection: 'shipping_sections',
    meta: 'shipping_meta',
    page: '/gomla/shipping-policy.html',
    icon: 'fa-truck-fast'
  },
  exchange: {
    key: 'exchange',
    label: 'الاستبدال والإرجاع',
    collection: 'exchange_sections',
    meta: 'exchange_meta',
    page: '/gomla/exchange-policy.html',
    icon: 'fa-exchange-alt'
  },
  terms: {
    key: 'terms',
    label: 'الشروط والأحكام',
    collection: 'terms_sections',
    meta: 'terms_meta',
    page: '/gomla/terms.html',
    icon: 'fa-file-contract'
  },
  faq: {
    key: 'faq',
    label: 'الأسئلة الشائعة',
    collection: 'faq_sections',
    meta: 'faq_meta',
    page: '/gomla/faq.html',
    icon: 'fa-question-circle'
  }
};

// ============================================================
// 🌍 روابط الموقع
// ============================================================
window.SITE_URL = 'https://awladsh3laan.github.io/gomla';
window.SITE_NAME = 'أولاد شعلان للمنظفات والورقيات';
window.SUPPORT_WHATSAPP_LINK = `https://wa.me/2${WHATSAPP_NUMBER}`;
window.SUPPORT_EMAIL = 'awladsh3laan@gmail.com';

// ============================================================
// 📱 إعدادات الموبايل
// ============================================================
window.MOBILE_BREAKPOINT = 768;

// ============================================================
// 🎨 إعدادات الصور
// ============================================================
window.IMAGE_CONFIG = {
  maxSizeMB: 1,
  maxWidthOrHeight: 800,
  fileType: 'image/jpeg',
  quality: 0.8
};

// ============================================================
// ✅ تأكيد التحميل
// ============================================================
console.log('✅ firebase-config.js v7.0 loaded successfully');
console.log('🔥 Firebase Project:', firebaseConfig.projectId);
console.log('👥 Roles:', Object.keys(window.ROLES).join(', '));
console.log('🗄️ Collections:', Object.keys(window.COLLECTIONS).length);
console.log('📄 Legal Pages:', Object.keys(window.LEGAL_PAGES).join(', '));
