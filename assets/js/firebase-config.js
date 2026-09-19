// ============================================================
// 🔥 firebase-config.js - الإعدادات الموحدة للمشروع
// 📌 المصدر الوحيد لـ db و auth والثوابت
// ⚠️ ممنوع تعريف db أو auth في أي ملف آخر
// الإصدار: 6.0
// آخر تحديث: 2026-09-19
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
const WHATSAPP_NUMBER = "01120282953";

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
  ADMIN: 'admin',
  CASHIER: 'cashier',
  WHOLESALE: 'wholesale',
  RETAIL: 'retail',
  GUEST: 'guest'
};

// ============================================================
// 🛡️ الصلاحيات (PERMISSIONS)
// ============================================================
window.PERMISSIONS = {
  super: [
    '*'
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
window.WHOLESALE_MIN_ORDER = 1500;  // ج.م
window.RETAIL_MIN_ORDER = 0;         // لا يوجد حد أدنى

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
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// ============================================================
// 📋 حالات الدفع
// ============================================================
window.PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PARTIAL: 'partial',
  PAID: 'paid'
};

// ============================================================
// 🗄️ أسماء الكولكشنز (لتجنب الأخطاء الإملائية)
// ============================================================
window.COLLECTIONS = {
  ADMINS: 'admins',
  CASHIERS: 'cashiers',
  CUSTOMERS: 'customers',
  USERS: 'users',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  BRANDS: 'brands',
  CART: 'cart',
  WISHLIST: 'wishlist',
  ORDERS: 'orders',
  INVOICES: 'invoices',
  SUPPLIERS: 'suppliers',
  PURCHASES: 'purchases',
  CASHBOX: 'cashbox',
  DAILY_SALES: 'daily_sales',
  BRANCHES: 'branches',
  BRANCH_INVENTORY: 'branch_inventory',
  RANKS: 'ranks',
  LEVELS: 'levels',
  REWARDS: 'rewards',
  NOTIFICATIONS: 'notifications',
  ACTIVITY_LOG: 'activityLog',
  QUOTES: 'quotes',
  NEWS: 'news',
  ADS: 'ads',
  SLIDER: 'slider',
  BARCODE_SCANS: 'barcode_scans'
};

// ============================================================
// 🌍 روابط الموقع
// ============================================================
window.SITE_URL = 'https://awladsh3laan.github.io/gomla';
window.SITE_NAME = 'أولاد شعلان للمنظفات والورقيات';

// ============================================================
// 📱 إعدادات الموبايل
// ============================================================
window.MOBILE_BREAKPOINT = 768;  // أقل من كده = موبايل

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
console.log('✅ firebase-config.js v6.0 loaded successfully');
console.log('🔥 Firebase Project:', firebaseConfig.projectId);
console.log('👥 Roles:', Object.keys(window.ROLES).join(', '));
console.log('🗄️ Collections:', Object.keys(window.COLLECTIONS).length);