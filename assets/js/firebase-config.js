// ============================================================
// 🔥 firebase-config.js — v8.1
// 📌 المصدر الوحيد لـ db و auth والثوابت
// ⚠️ ممنوع تعريف db أو auth في أي ملف آخر
// ⚠️ ممنوع وضع أي مفاتيح API حساسة هنا. استخدم Cloudflare Worker.
// الإصدار: 8.1
// آخر تحديث: 2026-10-19
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
// 🚀 تهيئة Firebase
// ============================================================
firebase.initializeApp(firebaseConfig);

window.db = firebase.firestore();
window.auth = firebase.auth();

// Offline persistence
window.db.enablePersistence({ synchronizeTabs: true })
  .catch(err => {
    if (err.code !== 'failed-precondition' && err.code !== 'unimplemented') {
      console.warn('⚠️ Offline persistence:', err.code);
    }
  });

// ============================================================
// 🛡️ Cloudflare Worker — بوابة الخدمات الآمنة
// ============================================================
// الـ Worker ده هو اللي بيتعامل مع ImgBB / Gemini / B2
// المفاتيح الحقيقية متخزنة كـ Secrets جوه Cloudflare، مش هنا.
window.WORKER_URL = 'https://awlad-shalaan-apis.awladsh3laan.workers.dev';
// ⚠️ لازم ترفع الـ Worker وتاخد الرابط الفعلي وتحطه هنا.

// ============================================================
// 🔑 مفاتيح عامة (مسموح بيها في العميل)
// ============================================================
window.WHATSAPP_NUMBER = '01068385028';
window.PAYMENT_ACCOUNT = '01068385028';
window.SUPPORT_EMAIL = 'awladsh3laan@gmail.com';
window.SITE_URL = 'https://awladsh3laan.github.io/gomla';
window.SITE_NAME = 'أولاد شعلان للمنظفات والورقيات';
window.SUPPORT_WHATSAPP_LINK = `https://wa.me/2${window.WHATSAPP_NUMBER}`;

// ============================================================
// 👥 الأدوار (ROLES) — 8 أدوار
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
// 🛡️ الصلاحيات (PERMISSIONS) — v17.1
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
    'cashbox.view', 'cashbox.approve',
    'financial.view', 'financial.approve',
    'sections.manage',
    'delivery.manage',
    'branches.manage',
    'brands.view',
    'shipping-rates.manage',
    'cardoona.extract',
    'cashier-sales.view',
    'registration.view', 'registration.approve'
  ],
  admin: [
    'products.view', 'products.create', 'products.edit',
    'orders.view', 'orders.edit', 'orders.create',
    'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.payment',
    'customers.view', 'customers.edit.basic',
    'reports.view', 'reports.payment',
    'cashier.use',
    'brands.view',
    'cashier-sales.view'
  ],
  cashier: [
    'branch.sales.create',
    'branch.inventory.view',
    'branch.inventory.edit',
    'barcode.scan',
    'shop.browse', 'shop.order',
    'cashier-sales.view.own'
  ],
  wholesale: [
    'shop.wholesale',
    'orders.view.own', 'orders.create',
    'invoices.view.own',
    'balance.view.own',
    'tracking.view.own',
    'credit.use'
  ],
  retail: [
    'shop.retail',
    'orders.view.own', 'orders.create',
    'invoices.view.own',
    'balance.view.own',
    'tracking.view.own',
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
// 📥 مصادر الطلبات — v17.1
// ============================================================
window.ORDER_SOURCES = {
  WEBSITE: 'website',
  CASHIER: 'cashier',
  CARDOONA: 'cardoona',
  MANUAL: 'manual'
};

// ============================================================
// 💰 الحدود المالية
// ============================================================
window.WHOLESALE_MIN_ORDER = 1500;
window.RETAIL_MIN_ORDER = 0;

// ============================================================
// 💳 نظام الآجل (Credit) — v17.1
// ============================================================
window.CREDIT_CONFIG = {
  MAX_AMOUNT: 5000,
  MAX_DAYS: 7,
  WALLET_FEE_PER_1000: 10,
  MIN_AMOUNT: 500
};

// ============================================================
// 🚚 أسعار الشحن (defaults — يمكن تعديلها من admin/shipping-rates)
// ============================================================
window.SHIPPING_RATES_DEFAULTS = {
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
// 📋 حالات الدفع — v17.1 (7 حالات)
// ============================================================
window.PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
  AWAITING_CARDOONA: 'awaiting_cardoona',
  AWAITING_AGENT: 'awaiting_agent',
  AWAITING_ADMIN: 'awaiting_admin'
};

window.PAYMENT_STATUS_LABELS = {
  unpaid: 'غير مدفوع',
  pending: 'في انتظار المراجعة',
  partial: 'دفع جزئي',
  paid: 'مدفوع',
  awaiting_cardoona: 'في انتظار تأكيد كرتونة',
  awaiting_agent: 'في انتظار تأكيد المندوب',
  awaiting_admin: 'في انتظار تأكيد الأدمن'
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
// 💳 طرق الدفع — v17.1 (4 طرق + credit للتجار)
// ============================================================
window.PAYMENT_METHODS = {
  CASH: 'cash',
  INSTAPAY: 'instapay',
  WALLET: 'wallet',
  CREDIT: 'credit'
};

window.PAYMENT_METHOD_LABELS = {
  cash: 'الدفع عند الاستلام',
  instapay: 'إنستا باي',
  wallet: 'محفظة إلكترونية',
  credit: 'آجل (للتجار فقط)'
};

window.WALLET_FEE_PERCENT = 1;

// ============================================================
// 💰 حالات الصندوق
// ============================================================
window.CASHBOX_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

window.CASHBOX_CATEGORY = {
  ORDER_PAYMENT: 'order_payment',
  CASHIER_SALE: 'cashier_sale',
  CARDOONA_SALE: 'cardoona_sale',
  MANUAL_SALE: 'manual_sale',
  SUPPLIER_PAYMENT: 'supplier_payment',
  SALARY: 'salary',
  DAMAGE: 'damage',
  OTHER: 'other'
};

// ============================================================
// 🎯 حالات كرتونة
// ============================================================
window.CARDOONA_STATUS = {
  EXTRACTED: 'extracted',
  EDITED: 'edited',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
};

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
// 🗄️ أسماء الكوليكشنز (52 كوليكشن) — v17.1
// ============================================================
window.COLLECTIONS = {
  ADMINS: 'admins',
  CASHIERS: 'cashiers',
  CUSTOMERS: 'customers',
  USERS: 'users',
  DELIVERY_AGENTS: 'delivery_agents',
  DELIVERY_LOOKUP: 'delivery_lookup',
  TRADER_LOOKUP: 'trader_lookup',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  BRANDS: 'brands',
  BRANCHES: 'branches',
  BRANCH_INVENTORY: 'branch_inventory',
  TRANSFERS: 'transfers',
  INVENTORY_SNAPSHOTS: 'inventory_snapshots',
  CART: 'cart',
  WISHLIST: 'wishlist',
  ORDERS: 'orders',
  INVOICES: 'invoices',
  INVOICE_ARCHIVES: 'invoice_archives',
  MANUAL_SALES: 'manual_sales',
  CASHIER_SALES: 'cashier_sales',
  SUPPLIERS: 'suppliers',
  PURCHASES: 'purchases',
  CASHBOX: 'cashbox',
  DAILY_SALES: 'daily_sales',
  FINANCIAL_NOTIFICATIONS: 'financial_notifications',
  EXPENSES: 'expenses',
  SALARIES: 'salaries',
  DAMAGES: 'damages',
  NOTIFICATIONS: 'notifications',
  CUSTOMER_NOTIFICATIONS: 'customer_notifications',
  ADMIN_NOTIFICATIONS: 'admin_notifications',
  ACTIVITY_LOG: 'activityLog',
  BARCODE_SCANS: 'barcode_scans',
  QUOTES: 'quotes',
  NEWS: 'news',
  ADS: 'ads',
  SLIDER: 'slider',
  CUSTOM_SECTIONS: 'custom_sections',
  SITE_CONTENT: 'site_content',
  PUBLIC_STATS: 'public_stats',
  SHIPPING_RATES: 'shipping_rates',
  PRIVACY_SECTIONS: 'privacy_sections',
  SHIPPING_SECTIONS: 'shipping_sections',
  EXCHANGE_SECTIONS: 'exchange_sections',
  TERMS_SECTIONS: 'terms_sections',
  FAQ_SECTIONS: 'faq_sections',
  SUPPORT_TICKETS: 'support_tickets',
  DELIVERY_COLLECTIONS: 'delivery_collections',
  REGISTRATION_REQUESTS: 'registration_requests',
  CARDOONA_INVOICES: 'cardoona_invoices',
  CARDOONA_EXTRACTIONS: 'cardoona_extractions'
};

// ============================================================
// 📄 Meta Docs (في site_content)
// ============================================================
window.META_DOCS = {
  PRIVACY_META: 'privacy_meta',
  SHIPPING_META: 'shipping_meta',
  EXCHANGE_META: 'exchange_meta',
  TERMS_META: 'terms_meta',
  FAQ_META: 'faq_meta',
  UPLOAD_STATS: 'upload_stats',
  ABOUT: 'about',
  WELCOME: 'welcome'
};

// ============================================================
// 📄 الصفحات القانونية (Meta Map)
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
console.log('✅ firebase-config.js v8.1 loaded successfully');
console.log('🔥 Firebase Project:', firebaseConfig.projectId);
console.log('🛡️ Worker URL:', window.WORKER_URL ? 'Set' : '⚠️ NOT SET');
console.log('👥 Roles:', Object.keys(window.ROLES).length);
console.log('🗄️ Collections:', Object.keys(window.COLLECTIONS).length);
console.log('💳 Payment Methods:', Object.keys(window.PAYMENT_METHODS).join(', '));
