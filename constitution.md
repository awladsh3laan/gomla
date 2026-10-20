# 📜 دستور المشروع — v17.3 (شامل + جاهز للاستكمال)

```markdown
# 📜 دستور مشروع أولاد شعلان للمنظفات والورقيات
**الإصدار:** 17.3 (Reserve/Available + Total Inventory + Phase 0/1 مكتملة)
**آخر تحديث:** 2026-10-21
**هذا الملف هو المرجع الوحيد للمشروع**

---

## 0️⃣ حالة المشروع في 30 ثانية

| المرحلة | الحالة | ما تم |
|---------|--------|-------|
| **Phase 0** | ✅ مكتملة 100% | 9 ملفات مُصلحة + Worker + Rules |
| **Phase 1** | ✅ مكتملة 100% | Seeds + Migrations (bootstrap.html) |
| **Phase 2** | 🔄 جاري (40%) | dashboard + branches + transfers ✅ |
| **Phase 2 متبقي** | ⏳ | 4 صفحات مخزون + Reserve workflow |
| **Phase 3** | ⏳ لم تبدأ | 20+ صفحة مالية/إدارية |
| **Phase 4** | ⏳ | Worker integration كامل |
| **Phase 5** | ⏳ | Rules صارمة |
| **Phase 6** | ⏳ | دستور نهائي |

**آخر شغل:** `admin/transfers.html` v1.0 ✅
**التالي:** `checkout.html` v6.0 (Reserve) → 4 صفحات مخزون → `admin/orders.html`

---

## 1️⃣ معلومات المشروع

| البند | التفاصيل |
|------|----------|
| الاسم | أولاد شعلان للمنظفات والورقيات |
| النوع | متجر إلكتروني + POS + فروع + مخزون + كرتونة + نظام مالي + PWA |
| الرابط | https://awladsh3laan.github.io/gomla |
| GitHub | https://github.com/awladsh3laan/gomla.git |
| التقنيات | HTML + CSS + Vanilla JS + Firebase (Spark) + Cloudflare Worker + Gemini |
| اللغة | العربية (RTL) |
| الخط | Tajawal |
| الأيقونات | Font Awesome فقط — **ممنوع إيموجي في UI** |
| Firebase Plan | **Spark مجاني** — بدون Cloud Functions |
| Repo | فرع `redesign` |
| **Worker URL** | `https://awlad-shalaan-apis.awladsh3laan.workers.dev` |
| **Collections** | 62 |
| **Branches** | WH (مخزن) + TNT (طلعت حرب) + RGB (الرجبي) |

---

## 2️⃣ الأدوار والصلاحيات (8 أدوار)

```javascript
ROLES = {
  SUPER: 'super',
  ADMIN_PLUS: 'admin_plus',
  ADMIN: 'admin',
  CASHIER: 'cashier',
  WHOLESALE: 'wholesale',
  RETAIL: 'retail',
  DELIVERY: 'delivery',
  GUEST: 'guest'
}
```

### جدول الصلاحيات (مختصر — المرجع: v17.2 الجزء 2)

| الصلاحية | super | admin_plus | admin | cashier | trader | retail | delivery |
|---------|:-----:|:----------:|:-----:|:-------:|:------:|:------:|:--------:|
| المنتجات (إدارة) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| البراندات/التصنيفات | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| الطلبات | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Reserve/Commit (مخزون)** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| تأكيد استلام نقد | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| الصندوق (كتابة) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **الفروع** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **النقل (transfers)** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **مخزون الفرع (عرض)** | ✅ | ✅ | ✅ | ✅ (فرعه فقط) | ❌ | ❌ | ❌ |
| **بيع كاشير (POS)** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| مصروفات (إضافة) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| مصروفات (اعتماد) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **مرتجعات** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **تلفيات** | ✅ | ✅ | ✅ | ✅(pending) | ❌ | ❌ | ❌ |
| **تقفيل يومي** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **أقساط** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| إعدادات النظام | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Bootstrap** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

**قواعد:**
- **الموصل:** صفحات `delivery/*` فقط → غيرها → `/delivery/blocked.html`
- **الكاشير:** كل شيء مرتبط بفرعه فقط (`branchId` من `cashier.branchId`)

---

## 3️⃣ المسارات المحدّثة (v17.2 → v17.3)

| الدور | صفحة الدخول | الوجهة بعد Login |
|-------|-------------|-------------------|
| super/admin_plus/admin | `/admin/login.html` | `/admin/dashboard.html` |
| wholesale | `/trader/login.html` | `/trader/home.html` |
| retail | `/customer/login.html` | `/customer/home.html` |
| cashier | `/cashier/login.html` | `/cashier/home.html` |
| delivery | `/delivery/login.html` | `/delivery/home.html` |

**مسارات قديمة محذوفة:**
- `customer-login.html` → `customer/login.html`
- `trader-login.html` → `trader/login.html`
- `cashier-login.html` → `cashier/login.html`
- `delivery-login.html` → `delivery/login.html`
- `admin/home.html` → **محذوف** → `admin/dashboard.html`

---

## 4️⃣ هيكل الملفات + الحالة

```
📁 gomla/
├── 📁 assets/
│   ├── css/
│   │   ├── style.css              ✅
│   │   ├── invoice-print.css      ✅
│   │   └── pwa.css                ✅
│   ├── js/
│   │   ├── firebase-config.js     ✅ v8.3 (بدون API keys)
│   │   ├── main.js                ✅ v8.2 (9 مسارات محدّثة)
│   │   ├── public.js              ✅
│   │   ├── invoice-print.js       ✅
│   │   └── pwa-register.js        ⏳
│   ├── components/
│   │   ├── header.html            ✅ (يحتاج فحص WhatsApp/Email)
│   │   ├── footer.html            ✅ (يحتاج فحص WhatsApp/Email)
│   │   └── sidebar.html           ✅
│   └── images/                    ✅
│
├── 📁 admin/                      (34 صفحة)
│   ├── login.html                 ✅
│   ├── dashboard.html             ✅ v1.0 (Phase 2)
│   ├── bootstrap.html             ✅ v1.1 (Phase 1)
│   ├── products.html              ✅ v3.2 (pageState)
│   ├── customers.html             ✅ v2.0
│   ├── branches.html              ✅ v1.0 (Phase 2)
│   ├── transfers.html             ✅ v1.0 (Phase 2)
│   ├── orders.html                ⏳ **التالي — يحتاج Reserve/Commit/Release**
│   ├── invoices.html              ⏳
│   ├── cashbox.html               ⏳
│   ├── inventory-reports.html     ⏳ 🆕 v17.3 (Total Inventory)
│   ├── branch-inventory.html      ⏳ 🆕 v17.3 (عرض فرع)
│   ├── financial-reports.html     ⏳
│   ├── expenses.html              ⏳
│   ├── employees.html             ⏳
│   ├── salary-payments.html       ⏳
│   ├── returns.html               ⏳
│   ├── supplier-returns.html      ⏳
│   ├── purchases.html             ⏳
│   ├── damages.html               ⏳
│   ├── daily-closes.html          ⏳
│   ├── debts.html                 ⏳
│   ├── cash-flow.html             ⏳
│   ├── installments.html          ⏳
│   ├── settings.html              ⏳
│   ├── shipping-rates.html        ⏳
│   ├── suppliers.html             ⏳
│   ├── daily-sales.html           ⏳
│   ├── extract-pdf.html           ⏳
│   ├── cardoona-traders.html      ⏳
│   ├── brands-manager.html        ⏳
│   ├── reports.html               ⏳
│   ├── barcode-scanner.html       ⏳
│   ├── generate-codes.html        ✅
│   ├── delivery-agents.html       ✅
│   ├── assign-delivery.html       ⏳
│   ├── delivery-settlements.html  ⏳
│   ├── registration-requests.html ✅
│   ├── financial-transactions.html✅
│   ├── support.html               ✅
│   ├── content-manager.html       ✅
│   ├── sections-manager.html      ✅
│   ├── cashier-sales-manage.html  ⏳
│   └── profile.html               ⏳
│
├── 📁 cashier/                    (6 صفحات)
│   ├── login.html                 ✅
│   ├── home.html                  ⏳
│   ├── sales.html                 ⏳ (POS)
│   ├── inventory.html             ⏳ 🆕 v17.3 (فرعه فقط)
│   ├── history.html               ⏳
│   └── reports.html               ⏳
│
├── 📁 customer/                   (7 صفحات)
│   ├── login.html                 ✅
│   ├── register.html              ✅
│   ├── home.html                  ✅ v3.0
│   ├── orders.html                ✅
│   ├── invoices.html              ✅
│   ├── balance.html               ✅
│   └── profile.html               ✅
│
├── 📁 trader/
│   ├── login.html                 ✅
│   └── home.html                  ✅
│
├── 📁 delivery/                   (8 صفحات)
│   ├── login.html                 ✅
│   ├── home.html                  ✅
│   ├── orders.html                ✅
│   ├── available.html             ✅
│   ├── order-details.html         ✅
│   ├── collections.html           ✅
│   ├── profile.html               ✅
│   └── blocked.html               ✅
│
├── 📄 الصفحات العامة (26)
│   ├── index.html                 ⏳ (Redesign)
│   ├── store-wholesale.html       ✅ v2.0
│   ├── store-retail.html          ✅ (يحتاج فحص Reserve)
│   ├── categories.html            ✅
│   ├── category-products.html     ✅
│   ├── brand-products.html        ✅
│   ├── offers.html                ⏳
│   ├── discounts.html             ⏳
│   ├── cart.html                  ✅
│   ├── checkout.html              ⏳ **v6.0 — Reserve** (التالي)
│   ├── order-success.html         ⏳
│   ├── invoice.html               ⏳
│   ├── product-details.html       ⏳
│   ├── login.html                 ✅
│   ├── register-guide.html        ✅
│   ├── tracking.html              ✅
│   ├── wishlist.html              ✅
│   ├── notification.html          ✅
│   ├── support.html               ✅
│   ├── about.html                 ✅
│   ├── privacy-policy.html        ✅
│   ├── shipping-policy.html       ✅
│   ├── exchange-policy.html       ✅
│   ├── terms.html                 ✅
│   └── faq.html                   ✅
│
├── CONSTITUTION.md                ✅ (هذا الملف - v17.3)
├── firestore.rules                ✅ v1.2 (الصق في Firebase)
└── README.md                      ⏳
```

**أرقام:**
- ✅ مكتمل: ~32 صفحة
- ⏳ متبقي: ~30 صفحة
- **🆕 في v17.3:** 3 صفحات (`inventory-reports`, `branch-inventory`, `cashier/inventory`)

---

## 5️⃣ Collections (62)

### المستخدمون (7)
`admins`, `cashiers`, `customers`, `users`, `delivery_agents`, `delivery_lookup`, `trader_lookup`

### المنتجات والعلامات (3)
`products`, `categories`, `brands`

### الفروع والمخزون (4)
`branches`, `branch_inventory`, `transfers`, `inventory_snapshots`

### التجارة (6)
`cart`, `wishlist`, `orders`, `invoices`, `invoice_archives`, `manual_sales`

### البيع المباشر (1)
`cashier_sales`

### المالية (12)
`suppliers`, `purchases`, `cashbox`, `daily_sales`, `financial_notifications`, `expenses`, `salaries`, `damages`, `employees` ✅ **مُنشأ**, `salary_payments` ⏳, `returns` ⏳, `supplier_returns_pending` ⏳

### الإشعارات (4)
`notifications`, `customer_notifications`, `admin_notifications`, `whatsapp_outbox`

### السجلات (2)
`activityLog`, `barcode_scans`

### المحتوى (8)
`quotes`, `news`, `ads`, `slider`, `custom_sections`, `site_content`, `public_stats` ✅ **مُنشأ**, `shipping_rates` ✅ **مُنشأ**

### الصفحات القانونية (5 + 5 meta)
`privacy_sections`, `shipping_sections`, `exchange_sections`, `terms_sections`, `faq_sections` + 5 meta

### الدعم والتوصيل (3)
`support_tickets`, `delivery_collections`, `registration_requests`

### كرتونة (2)
`cardoona_invoices`, `cardoona_extractions`

### 🆕 v17.3 Collections
`installment_plans` ⏳, `daily_closes` ⏳

**الإجمالي: 62 collection**

---

## 6️⃣ Schema Versions (v17.3)

### `products` — Master + WH Stock

```javascript
{
  // البيانات الأساسية
  id, name, categoryId, categoryName, brandId, brandName,
  description, notes, traderNotes,
  barcode, sku, keywords,
  
  // الوحدات (v17.2)
  unit: 'كرتونة' | 'بالة' | 'كجم' | 'علبة' | 'قطعة' | ...,
  piecesPerUnit: 12,
  retailUnit: 'قطعة',
  
  // 🆕 v17.3 (Proposed — لم يُنفذ بعد)
  primaryUnit: 'كرتونة',     // الوحدة الرئيسية للحساب
  unitBreakdown: {           // تفصيل اختياري
    كرتونة: 12,
    بالة: 60,
    باكت: 4
  },
  
  // المخزون في المخزن المركزي
  warehouseStock: 0,          // وحدات (كراتين)
  warehousePieces: 0,         // قطع متبقية
  warehouseMinAlert: 10,
  reservedQty: 0,             // 🆕 v17.3 — محجوز (WH فقط)
  stockQuantity: 0,           // = warehouseStock × piecesPerUnit + warehousePieces
  
  // الأسعار
  wholesalePrice: 0,          // للوحدة
  retailPrice: 0,             // للقطعة
  purchasePrice: 0,           // super + admin_plus فقط
  
  // العروض (v17.2)
  hasRetailOffer: false,
  retailOfferPrice: 0,
  retailOfferStart: null,
  retailOfferEnd: null,
  
  // الخصومات
  hasWholesaleDiscount: false,
  wholesaleDiscountPercent: 0,
  wholesaleDiscountStart: null,
  wholesaleDiscountEnd: null,
  
  // النشر
  available: true,
  maxOrder: null,
  lowStockThreshold: 5,
  
  createdAt, updatedAt, createdBy, updatedBy
}
```

**توافق خلفي:**
- `hasOffer` → alias لـ `hasRetailOffer`
- `offerPrice` → alias لـ `retailOfferPrice`
- `stockQuantity` → محسوب دايماً

### `branch_inventory` — الفروع

```javascript
{
  id: `${branchId}_${productId}`,
  branchId: 'TNT' | 'RGB',
  productId: 'prod_xyz',
  
  // 🆕 v17.3 — 3 حقول (piecesQty, reservedQty, availableQty)
  piecesQty: 0,             // الكمية الفعلية
  reservedQty: 0,           // محجوز لطلبات pending
  availableQty: 0,          // = piecesQty - reservedQty (اللي بيتعرض)
  
  minAlert: 10,
  productName, productImage, unit, piecesPerUnit,
  lastUpdated, updatedBy
}
```

### `branches`

```javascript
{
  id: 'WH' | 'TNT' | 'RGB',
  code: 'WH' | 'TNT' | 'RGB',
  name: 'المخزن المركزي' | 'طلعت حرب' | 'الرجبي',
  type: 'warehouse' | 'retail' | 'wholesale',
  isWarehouse: false,
  address, phone, managerId, managerName,
  regions: [],
  active: true,
  createdAt, updatedAt, createdBy, updatedBy
}
```

### `orders`

```javascript
{
  // العميل
  customerId, customerName, customerPhone, customerPhone2,
  customerAddress, deliveryAddress, deliveryChoice,
  isGuest, storeType, userRole,
  
  // 🆕 v17.3 — Reserve fields
  reserved: false,
  reservedAt: null,
  released: false,
  releasedAt: null,
  releaseReason: '',
  
  // الفرع
  branchId: 'WH' | 'TNT' | 'RGB',
  
  // الشحن
  region, regionLocked, deliveryDate, notes,
  
  // المنتجات
  items: [{
    productId, productName, quantity, unit, price, total, imageUrl
  }],
  
  // المبالغ
  subtotal, shippingCost, total, isFreeShipping,
  
  // الدفع
  paymentMethod, paymentMethodLabel, paymentFeePercent,
  paymentFee, grandTotal, paymentProof, paymentProofUploadedAt,
  installmentDays, installmentStatus,
  
  // التوصيل
  deliveryStatus, deliveryAgentId, deliveryAgentName,
  deliveryAgentPhone, assignedAt, assignedBy,
  pickedUpAt, deliveredAt, failedReason, deliveryNotes,
  
  // تحصيل
  cashCollected, cashCollectedAt, cashHandedToAdmin, cashHandedAt,
  
  // الحالة
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'auto_cancelled',
  paymentStatus: 'unpaid' | 'pending' | 'paid' | 'awaiting_admin' | 'awaiting_cardoona' | 'awaiting_agent',
  paid, remaining,
  
  // الفواتير
  invoiceGenerated: false,
  invoiceId: '',
  
  // Balance
  balanceApplied: false,
  balanceAppliedAt: null,
  
  // التتبع
  modifications: [],       // [{at, by, changes}]
  notifications_sent: [],
  
  // التواريخ
  orderDate, createdAt, updatedAt
}
```

### `transfers`

```javascript
{
  id,
  fromBranchId, fromBranchName, fromBranchCode,
  toBranchId, toBranchName, toBranchCode,
  items: [{
    productId, productName, productImage,
    unit, piecesPerUnit,
    units, extraPieces, totalPieces
  }],
  totalItems, totalPieces,
  status: 'completed' | 'cancelled',
  notes,
  requestedBy, requestedByName, requestedAt,
  completedAt, completedBy, completedByName
}
```

### `employees` (v17.2)

```javascript
{
  id, name, phone,
  employeeType: 'admin_plus' | 'admin' | 'cashier' | 'delivery' | 'branch_manager' | 'worker' | 'accountant',
  branchId, userId, userType,
  baseSalary, allowances: {housing, transport, phone, other},
  incentiveConfig: {perDelivery, perSuccessfulCollection},
  active, advances, notes,
  createdAt, updatedAt
}
```

### `cashbox` (v17.2)

```javascript
{
  id,
  type: 'income' | 'expense',
  category: 'order_payment' | 'cashier_sale' | 'cardoona_sale' | 'manual_sale' |
            'installment_payment' | 'expense' | 'supplier_payment' | 'supplier_refund' |
            'customer_refund' | 'salary' | 'damage' | 'other',
  source: 'website' | 'cashier' | 'cardoona' | 'manual',
  branchId,
  relatedId, relatedType,
  amount, description,
  method: 'cash' | 'instapay' | 'wallet' | 'transfer',
  attachments: [],
  dailyCloseId, isOpening,
  refundOf, isRefund,
  status: 'pending' | 'approved' | 'rejected',
  approvedBy, approvedByName, approvedAt, rejectionReason,
  createdBy, createdByName, createdByRole, createdAt
}
```

---

## 7️⃣ المراحل — التفاصيل

### ✅ Phase 0 — مكتملة 100% (2026-10-19)

**الملفات اللي اتعملت:**

| # | الملف | الإصدار | ما تم |
|---|-------|---------|-------|
| 1 | `firebase-config.js` | v8.3 | بدون أي API keys — كل شيء عبر Worker |
| 2 | `main.js` | v8.2 | 9 مسارات محدّثة + `logoutAdmin` + مسارات صور absolute |
| 3 | `admin/products.html` | v3.2 | `pageState` object (حل تصادم `isAdminPlus`) + إزالة `showToast` المحلية + الاعتماد على `window.uploadImage` |
| 4 | `admin/customers.html` | v2.0 | إصلاح شامل + تبويبات (قطاعي/جملة/كرتونة) |
| 5 | `customer/home.html` | v3.0 | مسارات محدّثة + `validateInstallmentDays` |
| 6 | `checkout.html` | v5.0 | دعم `credit` + اختيار مدة الآجل + `branchId` من region |
| 7 | `store-wholesale.html` | v2.0 | إزالة DOCTYPE مكرر + fallback للـ composite index + إزالة `partners` |
| 8 | Cloudflare Worker | v2.0 | `/api/upload-image` + `/api/gemini` + `/api/pdf` |
| 9 | `firestore.rules` | v1.2 | 62 collection — مرنة مؤقتاً (Phase 5 = صارمة) |

**مشاكل تم حلها في Phase 0:**
- ✅ مفاتيح API مكشوفة في العميل (A1)
- ✅ `hasOffer` vs `hasRetailOffer` (C3)
- ✅ `retailunit` vs `retailUnit` (B6)
- ✅ `showToast` recursion (B8)
- ✅ حذف تصنيف/براند = حذف منتجات (B4)
- ✅ `isAdminPlus` redeclaration
- ✅ `DOCTYPE` مكرر في store-wholesale
- ✅ `SHIPPING_RATES` is not defined
- ✅ `logoutAdmin()` غير موجودة (B10)
- ✅ مسارات صور relative (B11)
- ✅ 9 مسارات قديمة (B21, B22, B40)
- ✅ `deliveryAgentId: ''` غير مضمون (C10)

### ✅ Phase 1 — مكتملة 100% (2026-10-20)

**`admin/bootstrap.html` v1.1 — Seeds + Migrations**

**Seeds المُنفذة:**

| Seed | عدد docs | الحالة |
|------|---------|--------|
| `branches` | 3 (WH, TNT, RGB) | ✅ |
| `employees` | 5 موظفين | ✅ |
| `shipping_rates` | 20 (3 جملة + 17 قطاعي) | ✅ |
| `public_stats` | 1 | ✅ |

**Migrations المُنفذة:**

| Migration | المتوقع | الحالة |
|-----------|---------|--------|
| `products_stock` | `stockQuantity` → `warehouseStock`/`warehousePieces` | ✅ |
| `products_retail_offer` | `hasOffer` → `hasRetailOffer` | ✅ |
| `products_retail_unit` | `retailunit` → `retailUnit` | ✅ |
| `customers_balance` | إضافة `balance`/`active` | ✅ |
| `orders_delivery` | إضافة `deliveryAgentId`/`deliveryStatus` | ✅ |

**مشاكل تم حلها في Phase 1:**
- ✅ `products.stockQuantity` غير موحد
- ✅ `hasOffer` مش متحفظ (C4)
- ✅ `customerId vs uid` (C9)
- ✅ Schema موحد للمخزون
- ✅ `public_stats` موجود

### 🔄 Phase 2 — جاري (40%)

**المكتمل:**

| # | الصفحة | الإصدار | ما تم |
|---|--------|---------|-------|
| 1 | `admin/dashboard.html` | v1.0 | 5 كروت إحصائية + Quick Access حسب الدور + التنبيهات الذكية + آخر طلبات/فواتير |
| 2 | `admin/branches.html` | v1.0 | إدارة كاملة للفروع + realtime + حماية WH + Multi-select للمناطق |
| 3 | `admin/transfers.html` | v1.0 | نقل المخزون (WH↔فرع، فرع↔فرع) + Product Picker + Transaction ذرّي + سجل كامل |

**المتبقي في Phase 2 (من v17.3):**

| # | الصفحة | الأولوية | السبب |
|---|--------|---------|-------|
| 1 | `checkout.html` v6.0 | 🔴 حرج | Reserve logic في Transaction |
| 2 | `admin/orders.html` | 🔴 حرج | Commit/Release عند تغيير الحالة |
| 3 | `admin/inventory-reports.html` | 🔴 حرج | Total Inventory (WH + branches) |
| 4 | `admin/branch-inventory.html` | 🔴 حرج | عرض مخزون فرع مع البحث |
| 5 | `cashier/inventory.html` | 🔴 حرج | الكاشير يشوف فرعه |
| 6 | `cashier/sales.html` | 🔴 حرج | POS كامل |

### ⏳ Phases 3-6

| المرحلة | المدة | المخرجات |
|---------|-------|----------|
| **3** | 11-14 يوم | 20+ صفحة مالية/إدارية (expenses, employees, returns, cardoona, إلخ) |
| **4** | 1-2 يوم | Worker integration كامل (Gemini + PDF) |
| **5** | 2-3 يوم | Rules صارمة + اختبار |
| **6** | 1 يوم | دستور v17.4 |

---

## 8️⃣ 🆕 v17.3 — الميزات الجديدة

### 8.1 — Total Inventory

**المفهوم:**
```
TotalPieces(productId) = 
  (warehouseStock × piecesPerUnit + warehousePieces)   // WH
  + Σ branch_inventory[pid].piecesQty                  // كل الفروع
```

**الاستخدام:**

| الصفحة | يظهر |
|--------|------|
| `store-wholesale.html` | WH فقط (`warehouseStock` + `warehousePieces`) |
| `store-retail.html` | Total (WH + branch) — الفرع حسب region |
| `admin/inventory-reports.html` | Total + تفصيل WH/كل فرع |
| `admin/branch-inventory.html` | فرع واحد فقط |
| `cashier/inventory.html` | فرع الكاشير فقط |

### 8.2 — Reserve/Available Workflow

**3 حقول في `branch_inventory`:**

```
piecesQty = الكمية الفعلية
reservedQty = محجوز لطلبات pending
availableQty = piecesQty - reservedQty
```

**3 مراحل:**

| المرحلة | Action | Result |
|---------|--------|--------|
| **Reserve** (checkout) | `reservedQty += qty`, `availableQty -= qty` | `availableQty` ينقص → ما يظهرش للعميل التاني |
| **Commit** (delivered + confirm) | `piecesQty -= qty`, `reservedQty -= qty` | خصم نهائي |
| **Release** (cancelled) | `reservedQty -= qty`, `availableQty += qty` | إرجاع للعرض |

**قاعدة صارمة:**
- **Store pages + Cashier:** يقرأ من `availableQty` فقط
- **Admin reports:** يشوف الثلاثة
- **Reserve فقط في checkout (مش في add-to-cart)**

### 8.3 — primaryUnit + unitBreakdown (Proposed)

**مش منفذ — مقترح للمرحلة القادمة:**

```javascript
products.primaryUnit = 'كرتونة'   // الوحدة الرئيسية للحساب
products.unitBreakdown = {
  كرتونة: 12,
  بالة: 60,
  باكت: 4
}
```

**الهدف:** عرض "3000 قطعة = 250 كرتونة" بدل "3000 قطعة" فقط.

### 8.4 — الكاشير Branch Lock

**قاعدة:**
- `cashier.branchId` يُستخدم دايماً — لا يمكن اختيار فرع آخر
- كل عمليات الكاشير تحصل في `branch_inventory` الخاص بفرعه
- البيع يخصم من `availableQty` (مش `piecesQty`)

---

## 9️⃣ Workflows محدّثة (v17.3)

### A) طلب أونلاين (website)

```
1. Guest/Customer → cart → checkout
2. checkout v6.0 (NEW):
   ┌─ TRANSACTION ─────────────────────────┐
   │ if wholesale:                          │
   │   products.reservedQty += qty         │
   │ else:                                  │
   │   branch_inventory.RGB.reservedQty += │
   │   branch_inventory.RGB.availableQty -=│
   │ orders.add({reserved: true})          │
   └────────────────────────────────────────┘
3. Admin يعالج → status='processing' + balanceApplied
4. Delivery → assigned → picked_up
5. Delivered → cashCollected
6. Admin Confirm:
   ┌─ TRANSACTION ─────────────────────────┐
   │ if wholesale:                          │
   │   products.warehouseStock -= units    │
   │   products.reservedQty -= qty         │
   │ else:                                  │
   │   branch_inventory.piecesQty -= qty   │
   │   branch_inventory.reservedQty -= qty │
   │   // availableQty ماتتغيرش             │
   │ orders.update({                        │
   │   status:'delivered', reserved:false, │
   │   paymentStatus:'paid', invoiceGenerated: true│
   │ })                                     │
   │ invoices.add()                         │
   │ cashbox.add({category:'order_payment'})│
   └────────────────────────────────────────┘
```

### B) طلب ملغي

```
TRANSACTION:
  if wholesale:
    products.reservedQty -= qty
  else:
    branch_inventory.reservedQty -= qty
    branch_inventory.availableQty += qty
  orders.update({released:true, status:'cancelled'})
```

### C) Auto-Release (بعد 24 ساعة)

```
Cron-like (عبر admin manual أو on-login check):
  Orders where reserved=true and createdAt < now-24h:
    → Release (زي B)
    → orders.update({status:'auto_cancelled', releaseReason:'auto_timeout'})
```

### D) بيع كاشير (POS)

```
1. cashier/sales.html — يضيف منتجات من مخزون فرعه (availableQty)
2. يحفظ:
   TRANSACTION:
     branch_inventory.piecesQty -= qty
     branch_inventory.availableQty -= qty
     cashier_sales.add({cashboxStatus: 'pending_approval'})
     cashbox.add({status: 'pending'})
3. admin_plus يوافق:
   TRANSACTION:
     cashbox.update({status: 'approved'})
     cashier_sales.update({cashboxStatus: 'approved'})
```

### E) كرتونة (كما في v17.2)

### F) فاتورة يدوية (كما في v17.2)

### G) نقل المخزون (transfers — v1.0 ✅)

```
TRANSACTION:
  for each item:
    // Deduct from source
    if from WH:
      warehouseStock/Pieces -= totalPieces
    else:
      branch_inventory.piecesQty -= totalPieces
    
    // Add to destination
    if to WH:
      warehouseStock/Pieces += totalPieces
    else:
      branch_inventory.piecesQty += totalPieces
  
  transfers.add({status: 'completed'})
```

### H) شراء (purchases)

```
TRANSACTION:
  products.warehouseStock += qty (WH only)
  if cash: cashbox.add({category:'supplier_payment'})
  if credit: suppliers.balance += total
```

---

## 🔟 المشاكل المعروفة (v17.3)

### ✅ تم حلها (Phase 0 + 1 + 2)

| # | المشكلة | الحل |
|---|---------|------|
| A1 | API keys في client | ✅ Worker فقط |
| A2-A10 | Security issues | 🟡 Rules مرنة (Phase 5 = صارمة) |
| B4, B5, B6, B7, B8, B9 | products issues | ✅ products.html v3.2 |
| B10 | logoutAdmin مفقودة | ✅ main.js v8.2 |
| B11 | مسارات صور relative | ✅ main.js v8.2 |
| B15 | region غير محمي | ✅ checkout v5.0 |
| B21, B22, B38, B40 | مسارات قديمة | ✅ main.js v8.2 |
| B29 | store-wholesale HTML مكسور | ✅ v2.0 |
| C3 | hasOffer vs hasRetailOffer | ✅ migration |
| C4 | hasWholesaleDiscount | ✅ products v3.2 |
| C7 | notes vs traderNotes | ✅ products v3.2 |
| C9 | customerId vs uid | ✅ migration |
| C10 | deliveryAgentId | ✅ migration + checkout v5.0 |
| H1 | Gemini JSON غير صحيح | ✅ Worker validation |
| H2 | edit_history | ✅ cardoona workflow |

### ⏳ متبقية — حرجة (v17.3)

| # | المشكلة | الملف | الأولوية |
|---|---------|-------|---------|
| **N1** | `checkout.html` لا يعمل Reserve | `checkout.html` | 🔴 **حرج — أوفرسيل** |
| **N2** | `availableQty` غير مستخدم — المتجر يعرض `piecesQty` | `store-retail.html` | 🔴 **حرج** |
| **N3** | `admin/orders.html` غير موجود — لا Commit/Release | صفحة جديدة | 🔴 **حرج** |
| **N4** | لا صفحة لعرض Total Inventory | صفحة جديدة | 🔴 **حرج** |
| **N5** | لا صفحة لعرض مخزون فرع | صفحة جديدة | 🔴 **حرج** |
| **N6** | لا صفحة مخزون للكاشير | صفحة جديدة | 🔴 **حرج** |
| **N7** | لا POS كاشير | صفحة جديدة | 🔴 **حرج** |
| **N8** | Auto-release غير موجود | `checkout`/`orders` | 🟡 مهم |

### ⏳ متبقية — مراحل 3-5

| # | المشكلة | المرحلة |
|---|---------|---------|
| B2 | dashboard يستخدم orders_wholesale/retail | Phase 3 |
| B3 | invoices.html SyntaxError | Phase 3 |
| B12 | updatePublicStats محظورة | Phase 3 |
| B13, B14 | cart issues | Phase 3 |
| B16 | order-success للزائر | Phase 3 |
| B17, B18 | registration/auth | Phase 3 |
| B19, B20 | delivery | Phase 3 |
| B23-B28 | عروض/خصومات | Phase 3 |
| B30-B37, B39 | misc | Phase 3 |
| C1, C2 | orders/invoices موحدين | Phase 3 |
| C6, C8 | paymentStatus + discount | Phase 3 |
| D | 30 صفحة ناقصة | Phase 3 |
| F | architecture | Phase 5 |
| I | financial (المرتجعات، المرتبات، إلخ) | Phase 3 |
| **N8** | auto-release | Phase 3 |

---

## 1️⃣1️⃣ ⚠️ قواعد استراتيجية صارمة (must follow)

### Rule 1: `main.js` = المصدر الوحيد للدوال العامة

**ممنوع إعادة تعريف:**
- `showToast`
- `getCurrentUser`
- `uploadImage`
- `formatDate`
- `protectAnyAdminPage`
- `addToCart`
- `generateCode`
- إلخ

**الاستخدام:** `window.xxx()` فقط.

### Rule 2: لا API keys في `firebase-config.js`

كل الخدمات الخارجية عبر:
```javascript
window.uploadImage(file)  // → Worker
window.WORKER_ENDPOINTS.gemini  // → Worker
window.WORKER_ENDPOINTS.pdf     // → Worker
```

### Rule 3: كل عملية مخزون = Transaction

`checkout`, `orders`, `transfers`, `sales`, `purchases`, `returns` — كلها في `db.runTransaction`.

### Rule 4: `pageState` object في كل صفحة

بدل `let isAdminPlus` (يسبب تصادم). استخدم:
```javascript
const pageState = { isSuper: false, isAdminPlus: false, ... };
```

### Rule 5: `window.showToast` من `main.js` فقط

لا `function showToast` في أي صفحة.

---

## 1️⃣2️⃣ المفاتيح والإعدادات

```javascript
// Firebase (مسموح في client)
const firebaseConfig = {
  apiKey: "AIzaSyCdU3HadKWtzKtTAO9x7mcVPq6eodTqPzA",
  authDomain: "awlad-shalaan-wholesale.firebaseapp.com",
  projectId: "awlad-shalaan-wholesale",
  storageBucket: "awlad-shalaan-wholesale.firebasestorage.app",
  messagingSenderId: "390602001768",
  appId: "1:390602001768:web:05ec185f34ff0b5f7c1add"
};

// Worker — المصدر الوحيد للخدمات الخارجية
window.WORKER_URL = 'https://awlad-shalaan-apis.awladsh3laan.workers.dev';
window.WORKER_ENDPOINTS = {
  uploadImage: `${WORKER_URL}/api/upload-image`,
  gemini: `${WORKER_URL}/api/gemini`,
  pdf: `${WORKER_URL}/api/pdf`,
  health: `${WORKER_URL}/health`
};

// Constants
window.WHATSAPP_NUMBER = '01068385028';
window.PAYMENT_ACCOUNT = '01068385028';
window.SUPPORT_EMAIL = 'awladsh3laan@gmail.com';
window.SITE_URL = 'https://awladsh3laan.github.io/gomla';
```

**🚫 ممنوع في client:**
- `IMGBB_API_KEY`
- `CATBOX_USERHASH`
- `GEMINI_API_KEY`

---

## 1️⃣3️⃣ CREDIT_CONFIG + الثوابت الأساسية

```javascript
window.CREDIT_CONFIG = {
  MAX_AMOUNT: 5000,
  ALLOWED_DAYS: [7, 10],
  INSTALLMENTS_PER_DAYS: { 7: 2, 10: 3 },
  WALLET_FEE_PER_1000: 10,
  MIN_AMOUNT: 500
};

window.WALLET_FEE_PERCENT = 1;
window.WHOLESALE_MIN_ORDER = 1500;
window.RETAIL_MIN_ORDER = 0;

window.DEFAULT_BRANCHES = {
  WH:  { code: 'WH',  name: 'المخزن المركزي', type: 'warehouse' },
  TNT: { code: 'TNT', name: 'طلعت حرب',       type: 'retail' },
  RGB: { code: 'RGB', name: 'الرجبي',         type: 'retail' }
};
```

---

## 1️⃣4️⃣ Firestore Rules (v1.2 — الصق في Console)

**الملف الكامل موجود في `/gomstore.rules`** — راجعها في المشروع.

**الخلاصة:**
- Public read: `products`, `categories`, `brands`, `slider`, `site_content`, `shipping_rates`, `public_stats`
- Admins فقط: `employees`, `salary_payments`, `returns`, `supplier_returns_pending`, `installment_plans`, `daily_closes`, `whatsapp_outbox`
- Owner read: `customers`, `delivery_agents`, `cart`, `wishlist`
- Staff (admin + cashier + delivery): `orders`, `invoices`, `branch_inventory`, `cashier_sales`
- Default: deny all

**⚠️ Phase 5:** Rules صارمة + اختبار شامل

---

## 1️⃣5️⃣ القرارات النهائية (v17.1 → v17.3)

### v17.1 (1-126) — محفوظة
### v17.2 (127-150) — محفوظة
### 🆕 v17.3 (151-175):

| # | القرار |
|---|--------|
| 151 | **Total Inventory** = WH + Σ branches — موثق في الجزء 26 |
| 152 | **`products` = master data + WH stock** — مش إجمالي المخزون |
| 153 | **`branch_inventory` = المصدر الوحيد لمخزون الفروع** |
| 154 | **Reserve عند checkout فقط** — مش عند add-to-cart |
| 155 | **Auto-release بعد 24 ساعة** من reserve لو مفيش دفع |
| 156 | **Store pages** تقرأ `availableQty` (مش `piecesQty`) |
| 157 | **Cashier يبيع** من `availableQty` فقط |
| 158 | **Admin reports** تشوف الثلاثة (`piecesQty`, `reservedQty`, `availableQty`) |
| 159 | **3 حقول جديدة في `branch_inventory`:** `piecesQty`, `reservedQty`, `availableQty` |
| 160 | **حقلان جديدان في `products`:** `reservedQty` (WH reserve) |
| 161 | **`orders.reserved`** boolean — يُميّز الطلبات المحجوزة |
| 162 | **`orders.released`** boolean + `releaseReason` |
| 163 | **`cashier/inventory.html`** — الكاشير يشوف فرعه فقط |
| 164 | **`cashier/sales.html`** — POS يبيع من `availableQty` |
| 165 | **`admin/inventory-reports.html`** — Total + تفصيل |
| 166 | **`admin/branch-inventory.html`** — فرع واحد مع Search |
| 167 | **`checkout.html` v6.0** — Reserve في Transaction |
| 168 | **`admin/orders.html`** — Commit/Release عند تغيير الحالة |
| 169 | **`products.primaryUnit`** (Proposed — لم ينفذ) |
| 170 | **`products.unitBreakdown`** (Proposed — لم ينفذ) |
| 171 | **`transfers` v1.0** — Transaction ذرّي + كامل ✅ |
| 172 | **3 صفحات Phase 2 مكتملة** (dashboard, branches, transfers) |
| 173 | **الكاشير branch lock** — من `cashier.branchId` |
| 174 | **`checkout` يرسل `branchId` صراحة** (WH للجملة، RGB للقطاعي) |
| 175 | **`admin/orders.html`** = التالي بعد checkout v6.0 |

---

## 1️⃣6️⃣ الخطوة القادمة (بالترتيب)

### 🔴 الأولوية القصوى — Phase 2 متبقي

| # | الملف | ما فيه | المدة |
|---|-------|--------|-------|
| 1 | `checkout.html` v6.0 | Reserve logic + branch_inventory transactions | 2 ساعة |
| 2 | `admin/orders.html` | Commit/Release + Admin actions | 4 ساعات |
| 3 | `admin/inventory-reports.html` | Total Inventory + breakdown | 2 ساعة |
| 4 | `admin/branch-inventory.html` | عرض فرع + بحث | 1 ساعة |
| 5 | `cashier/inventory.html` | مخزون فرع الكاشير | 1 ساعة |
| 6 | `cashier/sales.html` | POS كامل | 3 ساعات |
| 7 | تحديث `store-retail.html` | يعرض `availableQty` مش `piecesQty` | 30 دقيقة |
| 8 | تحديث `store-wholesale.html` | نفس الشيء لـ WH | 30 دقيقة |
| 9 | تحديث `dashboard.html` | كارت "إجمالي المخزون" | 30 دقيقة |
| 10 | تحديث `main.js` | إضافة helper `getAvailableQty(productId, branchId)` | 15 دقيقة |

### 🟡 Phase 3 (بعد Phase 2)
- 20+ صفحة مالية وإدارية
- تحديث `firestore.rules` للـ 62 collection (Phase 5)

---

## 1️⃣7️⃣ كيفية الاستكمال في محادثة جديدة

**عند فتح محادثة جديدة، أرسل هذا الملف (`CONSTITUTION.md` v17.3) وقول:**

```
هذا دستوري v17.3. اقرأه كاملاً.
الحالة: Phase 2 — 40% مكتمل.
آخر شغل: admin/transfers.html v1.0.
التالي: checkout.html v6.0 (Reserve).
أكمل من حيث توقفت.
```

**الملفات اللي في الـ repo (GitHub):**
- `CONSTITUTION.md` ← هذا الملف
- `firestore.rules` ← v1.2
- `assets/js/firebase-config.js` ← v8.3
- `assets/js/main.js` ← v8.2
- `admin/dashboard.html` ← v1.0
- `admin/branches.html` ← v1.0
- `admin/transfers.html` ← v1.0
- `admin/products.html` ← v3.2
- `admin/customers.html` ← v2.0
- `admin/bootstrap.html` ← v1.1
- `customer/home.html` ← v3.0
- `checkout.html` ← v5.0 (سيتم تحديثه لـ v6.0)
- `store-wholesale.html` ← v2.0

---

## 1️⃣8️⃣ ملاحظات ختامية

1. **الدستور حي** — يُحدَّث بعد كل صفحة/مرحلة
2. **كل صورة** تُرفع عبر `window.uploadImage` (Worker)
3. **كل عملية مالية/مخزون** في Transaction
4. **صفر API keys** في client
5. **`main.js`** = مصدر واحد للدوال
6. **`pageState`** object بدل متغيرات مستقلة
7. **Reserve/Available** = قاعدة صارمة
8. **Total Inventory** = WH + Σ branches
9. **Phase 5** = Rules صارمة (بعد كل الصفحات)
10. **Spark Plan** فقط — بدون Cloud Functions

---

**هذا هو المرجع الرسمي الكامل v17.3 ✅**
**آخر تحديث:** 2026-10-21
**الحالة:** Phase 2 — 40% مكتمل
**التالي:** `checkout.html` v6.0 (Reserve logic)
```

---

## 📊 ملخص ما تم في هذه الرسالة

| البند | القيمة |
|-------|--------|
| **حجم الدستور** | ~700 سطر |
| **المراحل المكتملة** | Phase 0 + Phase 1 (100%) |
| **Phase 2 المكتمل** | dashboard + branches + transfers |
| **Phase 2 المتبقي** | checkout v6.0 + orders + 4 inventory pages |
| **المشاكل المحلولة** | ~25 مشكلة (من 112) |
| **المشاكل الحرجة الجديدة** | 8 (N1-N8) |
| **القرارات الجديدة** | 25 (151-175) |
| **الصفحات الجديدة** | 4 (`inventory-reports`, `branch-inventory`, `cashier/inventory`, `cashier/sales`) |
| **الحقول الجديدة** | `reservedQty`, `availableQty`, `reserved`, `released` |

---

## 🎯 الخطوة القادمة

**احفظ هذا الملف في الـ repo باسم `CONSTITUTION.md`.**

**بعد كده، في المحادثة الجديدة:**
- قول: **"المرحلة 2 — 40% مكتمل. أكمل من `checkout.html` v6.0"**

**في المحادثة الحالية (لو مستمر):**
- قول: **"يلا نعمل checkout v6.0"** → أبدأ فوراً

**جاهز! 🚀**
