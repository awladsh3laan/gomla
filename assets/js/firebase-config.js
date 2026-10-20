// ============================================================
// 🔥 firebase-config.js — v8.3
// 📌 المصدر الوحيد لـ db و auth والثوابت
// ⚠️ ممنوع تعريف db أو auth في أي ملف آخر
// ⚠️ ممنوع وضع أي مفاتيح API حساسة هنا. استخدم Cloudflare Worker.
// ✅ جميع الخدمات الخارجية (ImgBB / Gemini / PDF) تتم عبر WORKER_URL فقط
// الإصدار: 8.3
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

window.db.enablePersistence({ synchronizeTabs: true })
  .catch(err => {
    if (err.code !== 'failed-precondition' && err.code !== 'unimplemented') {
      console.warn('⚠️ Offline persistence:', err.code);
    }
  });

// ============================================================
// 🛡️ Cloudflare Worker — بوابة الخدمات الآمنة (المصدر الوحيد)
// ============================================================
window.WORKER_URL = 'https://awlad-shalaan-apis.awladsh3laan.workers.dev';

window.WORKER_ENDPOINTS = {
  uploadImage: `${window.WORKER_URL}/api/upload-image`,
  gemini:      `${window.WORKER_URL}/api/gemini`,
  pdf:         `${window.WORKER_URL}/api/pdf`,
  health:      `${window.WORKER_URL}/health`
};

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
// 🛡️ الصلاحيات (PERMISSIONS) — v17.2
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
    'expenses.create', 'expenses.approve',
    'employees.manage', 'salary.manage',
    'returns.create', 'returns.approve',
    'damages.create', 'damages.approve',
    'daily-close.manage',
    'installments.create', 'installments.collect',
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
    'cashier-sales.view',
    'expenses.create',
    'returns.create',
    'damages.create', 'damages.approve'
  ],
  cashier: [
    'branch.sales.create',
    'branch.inventory.view',
    'branch.inventory.edit',
    'barcode.scan',
    'shop.browse', 'shop.order',
    'cashier-sales.view.own',
    'damages.create'
  ],
  wholesale: [
    'shop.wholesale',
    'orders.view.own', 'orders.create',
    'invoices.view.own',
    'balance.view.own',
    'tracking.view.own',
    'credit.use',
    'installments.view.own'
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
window.STORE_TYPES = { WHOLESALE: 'wholesale', RETAIL: 'retail' };

// ============================================================
// 📥 مصادر الطلبات
// ============================================================
window.ORDER_SOURCES = {
  WEBSITE: 'website', CASHIER: 'cashier',
  CARDOONA: 'cardoona', MANUAL: 'manual'
};

// ============================================================
// 💰 الحدود المالية
// ============================================================
window.WHOLESALE_MIN_ORDER = 1500;
window.RETAIL_MIN_ORDER = 0;

// ============================================================
// 💳 نظام الآجل (Credit) — v17.2
// ============================================================
window.CREDIT_CONFIG = {
  MAX_AMOUNT: 5000,
  ALLOWED_DAYS: [7, 10],
  INSTALLMENTS_PER_DAYS: { 7: 2, 10: 3 },
  WALLET_FEE_PER_1000: 10,
  MIN_AMOUNT: 500
};

// ============================================================
// 💸 فئات المصروفات
// ============================================================
window.EXPENSE_CATEGORIES = {
  rent: 'إيجار', utilities: 'كهرباء ومياه', marketing: 'تسويق',
  maintenance: 'صيانة', transport: 'مواصلات',
  office_supplies: 'أدوات مكتبية', other: 'أخرى'
};

// ============================================================
// 🔄 أسباب المرتجعات
// ============================================================
window.RETURN_REASONS = {
  defective: 'معيب', wrong_item: 'منتج خاطئ', not_needed: 'غير مطلوب',
  expired: 'منتهي الصلاحية', other: 'أخرى'
};

// ============================================================
// 👥 أنواع الموظفين
// ============================================================
window.EMPLOYEE_TYPES = {
  admin_plus: 'أدمن بلص', admin: 'أدمن', cashier: 'كاشير',
  delivery: 'مندوب', branch_manager: 'مسئول فرع',
  worker: 'عامل', accountant: 'محاسب'
};

// ============================================================
// 💼 أنواع المرتجعات
// ============================================================
window.RETURN_TYPES = { CUSTOMER: 'customer', SUPPLIER: 'supplier' };

window.RETURN_SETTLEMENT_TYPES = {
  CASH_REFUND: 'cash_refund', REPLACEMENT: 'replacement',
  CREDIT_NOTE: 'credit_note', PENDING: 'pending'
};

window.RETURN_STATUS = {
  PENDING: 'pending', APPROVED: 'approved', SETTLED: 'settled',
  REJECTED: 'rejected', CANCELLED: 'cancelled'
};

// ============================================================
// 📅 حالات الأقساط
// ============================================================
window.INSTALLMENT_STATUS = {
  ACTIVE: 'active', COMPLETED: 'completed',
  OVERDUE: 'overdue', CANCELLED: 'cancelled'
};

window.INSTALLMENT_STATUS_LABELS = {
  active: 'نشطة', completed: 'مكتملة',
  overdue: 'متأخرة', cancelled: 'ملغاة'
};

// ============================================================
// 📊 حالات التقفيل اليومي
// ============================================================
window.DAILY_CLOSE_STATUS = {
  OPEN: 'open', CLOSED: 'closed',
  APPROVED: 'approved', REJECTED: 'rejected'
};

// ============================================================
// 🏢 أنواع الفروع
// ============================================================
window.BRANCH_TYPES = {
  RETAIL: 'retail', WHOLESALE: 'wholesale', WAREHOUSE: 'warehouse'
};

window.DEFAULT_BRANCHES = {
  WH: { code: 'WH', name: 'المخزن المركزي', type: 'warehouse' },
  TNT: { code: 'TNT', name: 'طلعت حرب', type: 'retail' },
  RGB: { code: 'RGB', name: 'الرجبي', type: 'retail' }
};

// ============================================================
// 🚚 أسعار الشحن (defaults — قابلة للتعديل من admin/shipping-rates)
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
// ⚠️ Alias للتوافق مع checkout.html (v4.0 و v5.0)
window.SHIPPING_RATES = window.SHIPPING_RATES_DEFAULTS;
const SHIPPING_RATES = window.SHIPPING_RATES;
// ============================================================
// 🏷️ أكواد المدن للتجار
// ============================================================
window.CITY_CODES = {
  'المحلة': 'MHL', 'المنصورة': 'MNS', 'طنطا': 'TNT', 'أخرى': 'OTH'
};

// ============================================================
// 📋 حالات الطلب
// ============================================================
window.ORDER_STATUS = {
  PENDING: 'pending', PROCESSING: 'processing',
  PREPARING: 'preparing', AWAITING_APPROVAL: 'awaiting_approval',
  SHIPPED: 'shipped', DELIVERED: 'delivered', CANCELLED: 'cancelled'
};

// ============================================================
// 📋 حالات الدفع — 7 حالات
// ============================================================
window.PAYMENT_STATUS = {
  UNPAID: 'unpaid', PENDING: 'pending', PARTIAL: 'partial', PAID: 'paid',
  AWAITING_CARDOONA: 'awaiting_cardoona',
  AWAITING_AGENT: 'awaiting_agent',
  AWAITING_ADMIN: 'awaiting_admin'
};

window.PAYMENT_STATUS_LABELS = {
  unpaid: 'غير مدفوع', pending: 'في انتظار المراجعة',
  partial: 'دفع جزئي', paid: 'مدفوع',
  awaiting_cardoona: 'في انتظار تأكيد كرتونة',
  awaiting_agent: 'في انتظار تأكيد المندوب',
  awaiting_admin: 'في انتظار تأكيد الأدمن'
};

// ============================================================
// 🚚 حالات التوصيل
// ============================================================
window.DELIVERY_STATUS = {
  UNASSIGNED: 'unassigned', ASSIGNED: 'assigned',
  PICKED_UP: 'picked_up', DELIVERED: 'delivered', FAILED: 'failed'
};

// ============================================================
// 💳 طرق الدفع — 4 طرق (+ credit للتجار)
// ============================================================
window.PAYMENT_METHODS = {
  CASH: 'cash', INSTAPAY: 'instapay',
  WALLET: 'wallet', CREDIT: 'credit'
};

window.PAYMENT_METHOD_LABELS = {
  cash: 'الدفع عند الاستلام', instapay: 'إنستا باي',
  wallet: 'محفظة إلكترونية', credit: 'آجل (للتجار فقط)'
};

window.WALLET_FEE_PERCENT = 1;

// ============================================================
// 💰 حالات الصندوق
// ============================================================
window.CASHBOX_STATUS = {
  PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected'
};

window.CASHBOX_CATEGORY = {
  ORDER_PAYMENT: 'order_payment', CASHIER_SALE: 'cashier_sale',
  CARDOONA_SALE: 'cardoona_sale', MANUAL_SALE: 'manual_sale',
  SUPPLIER_PAYMENT: 'supplier_payment', SALARY: 'salary',
  DAMAGE: 'damage', OTHER: 'other'
};

window.CASHBOX_CATEGORIES_EXTENDED = {
  ORDER_PAYMENT: 'order_payment', CASHIER_SALE: 'cashier_sale',
  CARDOONA_SALE: 'cardoona_sale', MANUAL_SALE: 'manual_sale',
  INSTALLMENT_PAYMENT: 'installment_payment', EXPENSE: 'expense',
  SUPPLIER_PAYMENT: 'supplier_payment', SUPPLIER_REFUND: 'supplier_refund',
  CUSTOMER_REFUND: 'customer_refund', SALARY: 'salary',
  DAMAGE: 'damage', OTHER: 'other'
};

// ============================================================
// 🎯 حالات كرتونة
// ============================================================
window.CARDOONA_STATUS = {
  EXTRACTED: 'extracted', EDITED: 'edited',
  CONFIRMED: 'confirmed', CANCELLED: 'cancelled'
};

// ============================================================
// 🚚 إعدادات الموصلين
// ============================================================
window.DELIVERY_CONFIG = {
  CODE_PREFIX: 'DEL-', CODE_LENGTH: 5,
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
  TEXT: 'text', QUOTE: 'quote', LIST: 'list', CARDS: 'cards',
  TABLE: 'table', CONTACT: 'contact', STEPS: 'steps', FAQ: 'faq'
};

window.CONTENT_TYPE_LABELS = {
  text: 'فقرة نصية', quote: 'اقتباس مميز', list: 'قائمة نقطية',
  cards: 'شبكة كروت', table: 'جدول', contact: 'كروت تواصل',
  steps: 'خطوات مرقمة', faq: 'أسئلة وأجوبة'
};

// ============================================================
// 🗄️ أسماء الكوليكشنز — 62 كوليكشن
// ============================================================
window.COLLECTIONS = {
  ADMINS: 'admins', CASHIERS: 'cashiers', CUSTOMERS: 'customers', USERS: 'users',
  DELIVERY_AGENTS: 'delivery_agents', DELIVERY_LOOKUP: 'delivery_lookup',
  TRADER_LOOKUP: 'trader_lookup',
  PRODUCTS: 'products', CATEGORIES: 'categories', BRANDS: 'brands',
  BRANCHES: 'branches', BRANCH_INVENTORY: 'branch_inventory',
  TRANSFERS: 'transfers', INVENTORY_SNAPSHOTS: 'inventory_snapshots',
  CART: 'cart', WISHLIST: 'wishlist',
  ORDERS: 'orders', INVOICES: 'invoices', INVOICE_ARCHIVES: 'invoice_archives',
  MANUAL_SALES: 'manual_sales', CASHIER_SALES: 'cashier_sales',
  SUPPLIERS: 'suppliers', PURCHASES: 'purchases',
  CASHBOX: 'cashbox', DAILY_SALES: 'daily_sales',
  FINANCIAL_NOTIFICATIONS: 'financial_notifications',
  EXPENSES: 'expenses', SALARIES: 'salaries', DAMAGES: 'damages',
  EMPLOYEES: 'employees', SALARY_PAYMENTS: 'salary_payments',
  RETURNS: 'returns', SUPPLIER_RETURNS_PENDING: 'supplier_returns_pending',
  INSTALLMENT_PLANS: 'installment_plans', DAILY_CLOSES: 'daily_closes',
  WHATSAPP_OUTBOX: 'whatsapp_outbox',
  NOTIFICATIONS: 'notifications', CUSTOMER_NOTIFICATIONS: 'customer_notifications',
  ADMIN_NOTIFICATIONS: 'admin_notifications',
  ACTIVITY_LOG: 'activityLog', BARCODE_SCANS: 'barcode_scans',
  QUOTES: 'quotes', NEWS: 'news', ADS: 'ads', SLIDER: 'slider',
  CUSTOM_SECTIONS: 'custom_sections', SITE_CONTENT: 'site_content',
  PUBLIC_STATS: 'public_stats', SHIPPING_RATES: 'shipping_rates',
  PRIVACY_SECTIONS: 'privacy_sections', SHIPPING_SECTIONS: 'shipping_sections',
  EXCHANGE_SECTIONS: 'exchange_sections', TERMS_SECTIONS: 'terms_sections',
  FAQ_SECTIONS: 'faq_sections',
  SUPPORT_TICKETS: 'support_tickets',
  DELIVERY_COLLECTIONS: 'delivery_collections',
  REGISTRATION_REQUESTS: 'registration_requests',
  CARDOONA_INVOICES: 'cardoona_invoices',
  CARDOONA_EXTRACTIONS: 'cardoona_extractions'
  // 🆕 v17.3 — Reserve
PRODUCTS_RESERVED: 'reservedPieces',
};
// 🆕 Helper للـ Bootstrap
window.BOOTSTRAP_SETUP_DOC = 'setup_status';
// ============================================================
// 📄 Meta Docs
// ============================================================
window.META_DOCS = {
  PRIVACY_META: 'privacy_meta', SHIPPING_META: 'shipping_meta',
  EXCHANGE_META: 'exchange_meta', TERMS_META: 'terms_meta',
  FAQ_META: 'faq_meta', UPLOAD_STATS: 'upload_stats',
  ABOUT: 'about', WELCOME: 'welcome'
};

// ============================================================
// 📄 الصفحات القانونية
// ============================================================
window.LEGAL_PAGES = {
  privacy: { key: 'privacy', label: 'سياسة الخصوصية', collection: 'privacy_sections', meta: 'privacy_meta', page: '/gomla/privacy-policy.html', icon: 'fa-lock' },
  shipping: { key: 'shipping', label: 'سياسة الشحن', collection: 'shipping_sections', meta: 'shipping_meta', page: '/gomla/shipping-policy.html', icon: 'fa-truck-fast' },
  exchange: { key: 'exchange', label: 'الاستبدال والإرجاع', collection: 'exchange_sections', meta: 'exchange_meta', page: '/gomla/exchange-policy.html', icon: 'fa-exchange-alt' },
  terms: { key: 'terms', label: 'الشروط والأحكام', collection: 'terms_sections', meta: 'terms_meta', page: '/gomla/terms.html', icon: 'fa-file-contract' },
  faq: { key: 'faq', label: 'الأسئلة الشائعة', collection: 'faq_sections', meta: 'faq_meta', page: '/gomla/faq.html', icon: 'fa-question-circle' }
};

// ============================================================
// 📱 إعدادات الموبايل
// ============================================================
window.MOBILE_BREAKPOINT = 768;

// ============================================================
// 🎨 إعدادات ضغط الصور (لا تحمل أي مفتاح)
// ============================================================
window.IMAGE_CONFIG = {
  maxSizeMB: 1,
  maxWidthOrHeight: 800,
  fileType: 'image/jpeg',
  quality: 0.8
};

// ============================================================
// 🖼️ رفع الصور عبر Cloudflare Worker
// ⚠️ المفاتيح الحقيقية في Worker Secrets (غير موجودة هنا)
// ============================================================
window.uploadImage = async function(file, onProgress) {
  if (!file) throw new Error('لا يوجد ملف');
  if (!window.WORKER_URL) {
    throw new Error('WORKER_URL غير معرّف - تحقق من إعدادات Cloudflare');
  }

  // ضغط (اختياري — لو المكتبة متاحة)
  let compressed = file;
  try {
    if (typeof imageCompression === 'function') {
      compressed = await imageCompression(file, window.IMAGE_CONFIG);
    }
  } catch (e) {
    console.warn('⚠️ ضغط الصورة فشل، استخدام الأصل:', e);
  }

  if (onProgress) onProgress(20);

  const formData = new FormData();
formData.append('image', compressed);  // ✅
  let response;
  try {
    response = await fetch(window.WORKER_ENDPOINTS.uploadImage, {
      method: 'POST',
      body: formData
    });
  } catch (err) {
    throw new Error('تعذّر الاتصال بالسيرفر — تحقق من Cloudflare Worker');
  }

  if (onProgress) onProgress(85);

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`فشل رفع الصورة (${response.status}) ${errText}`);
  }

  const data = await response.json().catch(() => ({}));
  if (!data || !data.url) {
    throw new Error('السيرفر لم يُرجع رابط الصورة');
  }

  if (onProgress) onProgress(100);
  return data.url;
};

// ============================================================
// ✅ تأكيد التحميل
// ============================================================
console.log('✅ firebase-config.js v8.3 loaded');
console.log('🔥 Firebase Project:', firebaseConfig.projectId);
console.log('🛡️ Worker URL:', window.WORKER_URL ? 'Set' : '⚠️ NOT SET');
console.log('🔐 API Keys in client: NONE ✅ (كل الخدمات عبر Worker)');
console.log('👥 Roles:', Object.keys(window.ROLES).length);
console.log('🗄️ Collections:', Object.keys(window.COLLECTIONS).length);
console.log('💳 Credit Days:', window.CREDIT_CONFIG.ALLOWED_DAYS.join(', '));
console.log('🏢 Branches:', Object.keys(window.DEFAULT_BRANCHES).join(', '));
