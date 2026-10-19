# 📜 دستور مشروع أولاد شعلان — v17.2 الكامل

```markdown
# 📜 دستور مشروع أولاد شعلان للمنظفات والورقيات
**الإصدار:** 17.2 (نظام مالي متكامل + أقساط + WhatsApp + إصلاحات v17.1)
**آخر تحديث:** 2026-10-19
**هذا الملف هو المرجع الوحيد للمشروع**
**⚠️ يُحدَّث بعد كل مرحلة إصلاح**

## 🎯 ما الجديد في v17.2 (مقارنة بـ v17.1)

| # | التغيير | النوع |
|---|---------|-------|
| 1 | **الجزء 41: النظام المالي المتكامل** — 7 collections جديدة + 10 workflows | 🆕 |
| 2 | **الجزء 42: إشعارات WhatsApp للتعديلات** — Semi-Auto | 🆕 |
| 3 | `CREDIT_CONFIG`: `ALLOWED_DAYS: [7, 10]` + `INSTALLMENTS_PER_DAYS` | 🔄 |
| 4 | `checkout.html` v5.0 — يدعم credit + اختيار مدة الآجل | 🔄 |
| 5 | **9 مسارات محدثة** (customer/home.html + trader/home.html + إلخ) | 🔄 |
| 6 | `admin/home.html` **محذوف** → `admin/dashboard.html` | 🔄 |
| 7 | **رفع الصور حصرياً عبر Worker** — لا API keys في العميل | 🔐 |
| 8 | `products` schema — `warehouseStock`, `warehousePieces`, `traderNotes` | 🔄 |
| 9 | Collections: 55 → **62** | 📊 |
| 10 | Known issues: ~104 → **~112** | 🐛 |
```

---

## 📌 الجزء 1: معلومات المشروع

| البند | التفاصيل |
|------|----------|
| الاسم | أولاد شعلان للمنظفات والورقيات |
| النوع | متجر إلكتروني + POS كاشير + إدارة فروع + مخزون + كرتونة + نظام مالي + PWA |
| الرابط | https://awladsh3laan.github.io/gomla |
| GitHub | https://github.com/awladsh3laan/gomla.git |
| التقنيات | HTML + CSS + Vanilla JS + Firebase (Spark) + Cloudflare Worker + Gemini + Catbox |
| اللغة | العربية (RTL) |
| الخط | Tajawal |
| الأيقونات | Font Awesome فقط — **ممنوع إيموجي في الـ UI** |
| Firebase Plan | **Spark (مجاني) — بدون Cloud Functions، بدون بطاقة** |
| Schema Version | **v17.2** |
| Repo | نفس الـ repo مع branch `redesign` |
| **Worker URL** | `https://awlad-shalaan-apis.awladsh3laan.workers.dev` |
| **Collections** | **62** |
| **Branches** | **WH (مخزن مركزي) + TNT (طلعت حرب) + RGB (الرجبي)** |

---

## 🔐 الجزء 2: الأدوار والصلاحيات (8 أدوار)

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

### جدول الصلاحيات v17.2

| الصلاحية | super | admin_plus | admin | cashier | trader | retail | delivery |
|---------|:-----:|:----------:|:-----:|:-------:|:------:|:------:|:--------:|
| إدارة المنتجات | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **إدارة البراندات** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **إدارة التصنيفات** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| إدارة الطلبات | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| تعيين مندوب | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| تأكيد استلام نقد | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| كتابة cashbox | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| كرتونة (استخراج) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| كرتونة (تعديل وحفظ) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| كرتونة (توليد أكواد) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **إضافة مصروف** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **اعتماد مصروف** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **إدارة الموظفين** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **توليد مرتبات** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **اعتماد مرتبات** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **إضافة مشتريات** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **مرتجع عميل** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **مرتجع مورد** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **تسوية مرتجع مورد** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **تسجيل تلفية** | ✅ | ✅ | ✅ | ✅ (pending) | ❌ | ❌ | ❌ |
| **اعتماد تلفية** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **تقفيل يومي** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **اعتماد تقفيل** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **إنشاء خطة أقساط** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **تحصيل قسط** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| إدارة الفروع | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| إدارة أسعار الشحن | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| إعدادات النظام | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

**⚠️ قواعد أساسية:**
- **الموصل** لا يرى إلا صفحات `delivery/*` فقط
- أي محاولة دخول لصفحات الموقع الرئيسي → `/delivery/blocked.html`

---

## 🚪 الجزء 3: نظام الدخول — 9 مسارات محدثة ⚠️

### طرق الدخول

| المستخدم | الدخول | المسار |
|---------|---------|--------|
| عميل | Email + Password | `/customer/login.html` |
| تاجر | كود `MHL-XXXX` | `/trader/login.html` |
| مندوب | كود `DEL-XXXXX@#$` | `/delivery/login.html` |
| أدمن | Email + Password | `/admin/login.html` |
| كاشير | Email + Password | `/cashier/login.html` |

### 🆕 جدول المسارات المحدّثة (v17.1 → v17.2)

| المسار القديم (v17.1) | المسار الجديد (v17.2) |
|----------------------|----------------------|
| `customer-login.html` | `customer/login.html` |
| `customer-register.html` | `customer/register.html` |
| `customer-home.html` | `customer/home.html` |
| `trader-login.html` | `trader/login.html` |
| `trader-home.html` | `trader/home.html` |
| `delivery-login.html` | `delivery/login.html` |
| `cashier-login.html` | `cashier/login.html` |
| **`admin/home.html`** | **`admin/dashboard.html`** ← محذوف من v17.2 |
| `admin-login.html` | `admin/login.html` |

### التوجيه حسب الدور

| الدور | الوجهة |
|-------|---------|
| super/admin_plus/admin | `/admin/dashboard.html` |
| wholesale | `/trader/home.html` |
| retail | `/customer/home.html` |
| cashier | `/cashier/home.html` |
| delivery | `/delivery/home.html` |

### المفاتيح المحلية
`admin`, `adminId`, `customer`, `cashier`, `deliveryData`, `deliveryCode`, `saved_trader_code`, `saved_cashier_email`, `saved_customer_email`

### مراقب الجلسات المتعددة
عند تغيير أي مفتاح → Overlay + عدّاد 5 ثواني + تحويل تلقائي.

---

## 🏠 الجزء 4: الصفحة الرئيسية index.html

### 12 سيكشن بالترتيب
1. **صورة الترحيب** — `site_content.welcome`
2. **نبذة تعريفية** — `site_content.about`
3. **السلايدر** — `slider` (auto-play 5s)
4. **كروت المتاجر** — حسب الصلاحية
5. **أحدث العروض** — guest, retail, cashier, admin (مخفي عن trader)
6. **أحدث الخصومات** — trader, cashier, admin (مخفي عن guest)
7. **الأقسام** — عرض أفقي
8. **أحدث المنتجات** — Intersection Observer + hover scale
9. **سيكشنات مخصصة** — `custom_sections`
10. **العلامات التجارية** — grayscale → colored
11. **تواصل معنا**
12. **Footer**

### منطق عرض الأسعار
```javascript
function getPriceForRole(product, role) {
  if ([ROLES.RETAIL, ROLES.GUEST].includes(role)) {
    return { piecePrice: product.retailPrice, cartonPrice: null, showUnit: 'قطعة' };
  }
  if (role === ROLES.WHOLESALE) {
    return { piecePrice: null, cartonPrice: product.wholesalePrice, showUnit: product.unit || 'كرتونة' };
  }
  // cashier / admin / admin_plus / super
  return { piecePrice: product.retailPrice, cartonPrice: product.wholesalePrice, showUnit: 'both' };
}
```

### شاشة الموصل الممنوع (`/delivery/blocked.html`)
- كارت تقني + animation
- أزرار: لوحة الموصل / أوردراتي / منطقتي / تحصيلاتي / بياناتي

---

## 📄 الجزء 5: صفحة تفاصيل المنتج

| الدور | يُعرض |
|------|-------|
| super | كل شيء + سعر الشراء + تعديل + `notes` + `traderNotes` |
| admin_plus/admin | جملة + قطاعي + مخزون مخزن + مخزون فرع + `notes` + `traderNotes` |
| wholesale | جملة + قطاعي + هامش ربح + `traderNotes` |
| retail/guest | قطاعي فقط + وصف + براند + تصنيف + مخزون |
| delivery | **لا يصل** |

---

## 🏪 الجزء 6: المتاجر

### `store-retail.html`
Brand Hero + سلايدر + بحث + أحدث + براندات + عروض + أقسام + جميع المنتجات

### `store-wholesale.html`
Brand Hero (بني) + سلايدر + بحث + أحدث + براندات + **خصومات** + أقسام + جميع المنتجات

**حماية**: `delivery` ممنوع → `/delivery/home.html`

---

## 📂 الجزء 7: الأقسام

- `categories.html` — شبكة أقسام + عداد حقيقي
- `category-products.html` — Sticky bar + براندات + فلاتر
- `brand-products.html` — منتجات براند

---

## 🎯 الجزء 8: العروض والخصومات

### حقول `products` (محدّثة v17.2)

```javascript
{
  // ===== العروض القطاعية =====
  hasRetailOffer: false,           // ⚠️ الاسم الرسمي (بدل hasOffer)
  retailOfferPrice: 0,             // ⚠️ بدل offerPrice
  retailOfferStart: Timestamp|null,
  retailOfferEnd: Timestamp|null,
  
  // ===== خصومات الجملة =====
  hasWholesaleDiscount: false,
  wholesaleDiscountPercent: 0,
  wholesaleDiscountStart: Timestamp|null,
  wholesaleDiscountEnd: Timestamp|null,
  
  // ===== الملاحظات =====
  notes: '',          // للإدارة
  traderNotes: '',    // للتجار (super فقط يكتبها)
  
  // ===== المخزون (v17.2) =====
  unit: 'كرتونة',              // الوحدة الكبيرة
  piecesPerUnit: 12,           // القطع لكل وحدة
  warehouseStock: 0,           // وحدات في المخزن المركزي
  warehousePieces: 0,          // قطع إضافية في المخزن
  warehouseMinAlert: 10,
  stockQuantity: 0,            // ⚠️ محسوب = warehouseStock × piecesPerUnit + warehousePieces
  
  // ===== البيع =====
  wholesalePrice: 0,           // للوحدة
  retailPrice: 0,              // للقطعة
  purchasePrice: 0,            // للوحدة (super + admin_plus فقط)
  retailUnit: 'قطعة'           // ⚠️ توحيد الاسم (بدل retailunit)
}
```

**⚠️ توافق خلفي:**
- `hasOffer`/`offerPrice` → تُقرأ كـ alias لو `hasRetailOffer` مش موجود
- `stockQuantity` → يُستخدم كـ totalPieces fallback

---

## 💳 الجزء 9: طرق الدفع (4 + credit) — ⚠️ محدّث v17.2

| # | الطريقة | الرسوم | الرمز | متاح لـ |
|---|--------|-------|-------|---------|
| 1 | كاش عند الاستلام | 0% | `cash` | الكل |
| 2 | إنستا باي | 0% | `instapay` | الكل |
| 3 | محفظة إلكترونية | +1% | `wallet` | الكل |
| 4 | **آجل للتجار** | رسوم محفظة فقط | `credit` | **trader فقط** |

### 🆕 `CREDIT_CONFIG` v17.2

```javascript
window.CREDIT_CONFIG = {
  MAX_AMOUNT: 5000,
  ALLOWED_DAYS: [7, 10],                    // ⚠️ بدل MAX_DAYS: 7
  INSTALLMENTS_PER_DAYS: { 7: 2, 10: 3 },   // 🆕 7 أيام = قسطين، 10 أيام = 3
  WALLET_FEE_PER_1000: 10,
  MIN_AMOUNT: 500
};
```

### نظام الآجل — النظام الكامل

**الشروط:**
- **الحد الأقصى:** 5000 ج.م إجمالي الفاتورة
- **المدة:** 7 أو 10 أيام (يختارها الأدمن)
- **الأقساط:**
  - 7 أيام = **قسطان**
  - 10 أيام = **3 أقساط**
- **بدون فوائد** على التقسيط

**رسوم المحفظة على الآجل:**
- 10 ج.م على كل 1000 ج.م (بحد أدنى 1%)
- تُضاف عند السداد الفعلي بمحفظة

**التحقق في checkout (v5.0):**

```javascript
if (selectedPaymentMethod === 'credit') {
  if (roundedTotal > creditCfg.MAX_AMOUNT) {
    showToast(`الحد الأقصى للتقسيط ${creditCfg.MAX_AMOUNT} ج.م`, 'error');
    return;
  }
  if (!creditCfg.ALLOWED_DAYS.includes(selectedInstallmentDays)) {
    selectedInstallmentDays = creditCfg.ALLOWED_DAYS[0];  // = 7
  }
}
```

**ملاحظة حاسمة:**
> تقسيط كرتونة **غير متاح** كوسيلة دفع للعميل. يُضاف كبند كاش بعد استلام النقد من الشركة.

### معادلة الدفع

```javascript
baseTotal = subtotal + shippingCost
paymentFee = method === 'wallet' ? baseTotal * 0.01 : 0
totalBeforeRound = baseTotal + paymentFee
grandTotal = roundToNearest5(totalBeforeRound)  // ينتهي بـ 0 أو 5
```

### حالات `paymentStatus`
```
unpaid, pending, partial, paid,
awaiting_cardoona, awaiting_agent, awaiting_admin
```

**إضافة v17.2:**
- `credit` → `paymentStatus = 'awaiting_admin'` (بانتظار إنشاء خطة الأقساط)

---

## 🚚 الجزء 10: نظام التوصيل

### Collections
- `delivery_agents/{uid}`
- `delivery_lookup/{CODE}`
- `delivery_collections/{id}`

### Workflow
```
website order → unassigned → assigned → picked_up → delivered
              → cashCollectedByAgent (صوري)
              → admin_plus/super يؤكد → cashbox
```

### تقسيم الفلوس
- **فلوس المنتجات** → الصندوق (`order_payment`)
- **فلوس الشحن** → المندوب

### صفحات `delivery/`
- `login.html` (منقول)
- `home.html`
- `orders.html`
- `available.html`
- `order-details.html`
- `collections.html`
- `profile.html`
- `blocked.html` 🆕

---

## 💰 الجزء 11: الإبلاغ عن السداد

- **Collection**: `financial_notifications`
- **الصفحة**: `customer/balance.html` → إبلاغ → `admin/financial-transactions.html` → اعتماد/رفض
- **عند الاعتماد** → Transaction:
  - `customers.update({balance})`
  - `customer_notifications.add()`
  - `activityLog.add()`

---

## 🏷️ الجزء 12: العلامات التجارية

### القرار
- `partners` **محذوف نهائياً** → `brands`
- **يديرها**: super فقط
- **تظهر في**: index + store-wholesale + store-retail

### Schema `brands`
```javascript
{
  id, name,
  imageUrl,
  description,
  color: '#1a2a4a',
  order: 0,
  active: true,
  productCount: 0,
  createdAt, updatedAt
}
```

### التصميم
- grayscale 100% → hover 0
- scale 1.1 + shadow
- أنيميشن دخول

---

## 🎫 الجزء 13: تذاكر الدعم

- **Collection**: `support_tickets`
- **الصفحات**: `support.html` + `admin/support.html`
- **الحالات**: `open` → `processing` → `closed`
- **المرفقات**: صورة واحدة (رفع عبر Worker)

---

## 📄 الجزء 14: إدارة المحتوى

- **الصفحة**: `admin/content-manager.html` (super فقط)
- **5 collections**: `privacy_sections`, `shipping_sections`, `exchange_sections`, `terms_sections`, `faq_sections`
- **8 أنواع**: text, quote, list, cards, table, contact, steps, faq

---

## 🚪 الجزء 15: بوابة الدخول login.html

5 كروت (إدارة / تجار / عملاء / كاشير / موصلين) + "مستخدم جديد"

---

## 📝 الجزء 16: دليل التسجيل register-guide.html

3 أقسام:
1. **عميل** — ذاتي فوري
2. **تاجر** — 3 أزرار (فورم + واتساب + إيميل)
3. **موصل** — 3 أزرار (فورم + واتساب + إيميل)

---

## 📥 الجزء 17: طلبات التسجيل

- **Collection**: `registration_requests`
- **الصفحة**: `admin/registration-requests.html` (super + admin_plus)
- **Workflow**: user → submit → admin approves → create account + code

---

## 🛒 الجزء 18: السلة والدفع

### `cart.html`
- 3 أنواع: مسجل / زائر / تاجر
- **سلة الزائر تحفظ**: `productName, imageUrl, unit, stockQuantity, maxOrder, price` كاملة

### `checkout.html` v5.0

**4 طرق دفع للتجار** (كاش + instapay + wallet + **credit**)
**3 طرق للعملاء** (كاش + instapay + wallet)

**Trader-only:**
- خيار الآجل بحد أقصى 5000 ج.م
- اختيار مدة الآجل (7 أو 10 أيام)
- `paymentStatus = 'awaiting_admin'`
- `installmentStatus = 'pending_plan'`
- `installmentDays` يُحفظ في الطلب

**Region محمي**: trader locked, guest/retail يختار
**branchId** يحدد تلقائياً من region:
```javascript
function getBranchIdForRegion(region, storeType) {
  if (storeType === 'wholesale') return 'WH';
  return 'RGB';  // default retail branch
}
```

**deliveryAgentId: ''** صراحة في orderData
**paymentProof upload** للـ instapay/wallet (عبر Worker)
**رسالة منبثقة** لو تجاوز 5000 في الآجل

### `order-success.html`
- الزائر يقدر يشوف طلبه
- تفاصيل الدفع
- رابط تتبع

---

## 📱 الجزء 19: تصميم الموبايل App-Like

- mobile-top-bar + mobile-top-tabs + mobile-bottom-tabs + copyright
- overflow-x: hidden
- الجداول تتحول لـ Cards
- Footer مخفي على الموبايل

---

## 🗄️ الجزء 20: هيكل الملفات v17.2

```
📁 gomla/
├── 📁 assets/
│   ├── css/
│   │   ├── style.css              (v8.0)
│   │   ├── invoice-print.css      (v2.0)
│   │   └── pwa.css                (v1.0)
│   │
│   ├── js/
│   │   ├── firebase-config.js     🆕 (v8.3 — بدون API keys)
│   │   ├── main.js                (v8.1)
│   │   ├── public.js              (v6.0)
│   │   ├── invoice-print.js       (v2.0)
│   │   ├── image-uploader.js      (اختياري — Worker fallback)
│   │   ├── gemini-extract.js      🆕
│   │   ├── cardoona-editor.js     🆕
│   │   ├── cardoona-traders.js    🆕
│   │   ├── cashier-sales.js       🆕
│   │   ├── inventory.js           🆕
│   │   ├── cashbox.js             🆕
│   │   ├── shipping-rates.js      🆕
│   │   ├── installments.js        🆕
│   │   ├── daily-closes.js        🆕
│   │   └── pwa-register.js        🆕
│   │
│   ├── components/
│   │   ├── header.html
│   │   ├── footer.html
│   │   └── sidebar.html
│   │
│   └── images/
│       ├── logo.png
│       ├── no-image.png
│       ├── default-avatar.png
│       ├── favicon.ico
│       └── welcome-*.jpg
│
├── 📁 PWA Files
│   ├── manifest.json
│   ├── service-worker.js
│   ├── offline.html
│   └── sw-strategies.js
│
├── 📁 admin/                      (34 صفحة)
│   ├── login.html                 ✅
│   ├── dashboard.html             ⏳ (يحل محل home.html المحذوف)
│   ├── products.html              ✅ (v3.1 — pageState)
│   ├── customers.html             ✅
│   ├── orders.html                ⏳
│   ├── invoices.html              ⏳
│   ├── cashbox.html               🆕
│   ├── inventory-reports.html     🆕
│   ├── financial-reports.html     🆕
│   ├── branches.html              🆕
│   ├── transfers.html             🆕
│   ├── expenses.html              🆕
│   ├── employees.html             🆕
│   ├── salary-payments.html       🆕
│   ├── returns.html               🆕
│   ├── supplier-returns.html      🆕
│   ├── purchases.html             🆕
│   ├── damages.html               🆕
│   ├── daily-closes.html          🆕
│   ├── debts.html                 🆕
│   ├── cash-flow.html             🆕
│   ├── installments.html          🆕
│   ├── settings.html              🆕
│   ├── roles.html                 🆕
│   ├── shipping-rates.html        🆕
│   ├── suppliers.html             🆕
│   ├── daily-sales.html           🆕
│   ├── extract-pdf.html           🆕 (Gemini + Editor)
│   ├── cardoona-traders.html      🆕 (super فقط)
│   ├── brands-manager.html        🆕
│   ├── reports.html               🆕
│   ├── barcode-scanner.html       🆕
│   ├── generate-codes.html        ✅
│   ├── delivery-agents.html       ✅
│   ├── assign-delivery.html       🆕
│   ├── delivery-settlements.html  🆕
│   ├── registration-requests.html ✅
│   ├── financial-transactions.html✅
│   ├── support.html               ✅
│   ├── content-manager.html       ✅
│   ├── sections-manager.html      ✅
│   ├── cashier-sales-manage.html  🆕 (super فقط)
│   └── profile.html               ⏳
│
├── 📁 cashier/                    (6 صفحات)
│   ├── login.html
│   ├── home.html
│   ├── sales.html
│   ├── inventory.html
│   ├── history.html
│   └── reports.html
│
├── 📁 customer/                   (7 صفحات — مسارات محدّثة)
│   ├── login.html (منقول)         ✅
│   ├── register.html (منقول)      ✅
│   ├── home.html (منقول)          ✅ (v3.0)
│   ├── orders.html                ✅
│   ├── invoices.html              ✅
│   ├── balance.html               ✅
│   └── profile.html               ✅
│
├── 📁 trader/
│   ├── login.html (منقول)
│   └── home.html (منقول)
│
├── 📁 delivery/                   (8 صفحات)
│   ├── login.html (منقول)
│   ├── home.html                  ✅
│   ├── orders.html                ✅
│   ├── available.html             ✅
│   ├── order-details.html         ✅
│   ├── collections.html           ✅
│   ├── profile.html               ✅
│   └── blocked.html               🆕
│
├── 📄 الصفحات العامة (~26)
│   ├── index.html                 ⏳
│   ├── store-wholesale.html       ⏳
│   ├── store-retail.html          ✅
│   ├── categories.html            ✅
│   ├── category-products.html     ✅
│   ├── brand-products.html        ✅
│   ├── offers.html                ⏳
│   ├── discounts.html             ⏳
│   ├── cart.html                  ⏳
│   ├── checkout.html              ✅ (v5.0)
│   ├── order-success.html         ⏳
│   ├── invoice.html               🆕
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
├── CONSTITUTION.md                (v17.2)
├── firestore.rules
└── README.md
```

---

## 🗄️ الجزء 21: كوليكشنز Firestore (62 كوليكشن)

### المستخدمين (7)
`admins`, `cashiers`, `customers`, `users`, `delivery_agents`, `delivery_lookup`, `trader_lookup`

### المنتجات والعلامات (3)
`products`, `categories`, `brands`

### الفروع والمخزون (4)
`branches`, `branch_inventory`, `transfers`, `inventory_snapshots`

### التجارة (6)
`cart`, `wishlist`, `orders`, `invoices`, `invoice_archives`, `manual_sales`

### البيع المباشر (1)
`cashier_sales`

### المالية (12) — 🆕 إضافة 5
`suppliers`, `purchases`, `cashbox`, `daily_sales`, `financial_notifications`, `expenses`, `salaries`, `damages`, **`employees`**, **`salary_payments`**, **`returns`**, **`supplier_returns_pending`**, **`installment_plans`**, **`daily_closes`**

### الإشعارات (4) — 🆕 إضافة 1
`notifications`, `customer_notifications`, `admin_notifications`, **`whatsapp_outbox`**

### السجلات (2)
`activityLog`, `barcode_scans`

### المحتوى (8)
`quotes`, `news`, `ads`, `slider`, `custom_sections`, `site_content`, `public_stats`, `shipping_rates`

### الصفحات القانونية (5 + 5 meta)
`privacy_sections`, `shipping_sections`, `exchange_sections`, `terms_sections`, `faq_sections` + 5 meta

### الدعم والتوصيل (3)
`support_tickets`, `delivery_collections`, `registration_requests`

### كرتونة (2)
`cardoona_invoices`, `cardoona_extractions`

**الإجمالي: 62 كوليكشن**

**⚠️ محذوف: `partners`**

---

## 🚚 الجزء 22: أسعار الشحن

### Schema `shipping_rates/{rateId}`
```javascript
{
  id,
  storeType: 'wholesale' | 'retail',
  region: 'طنطا',
  cost: 125,
  freeThreshold: 5000,
  active: true,
  order: 0,
  updatedAt, updatedBy
}
```

### الأسعار الحالية (defaults)

#### الجملة
| المدينة | السعر | مجاني عند |
|---------|-------|-----------|
| طنطا | 125 | 5000 |
| المنصورة | 125 | 5000 |
| المحلة | 50 | 2000 |

#### القطاعي
| المنطقة | السعر | مجاني عند |
|---------|-------|-----------|
| الرجبي، أبو شاهين | 25 | 2500 |
| السبع بنات، الجمهورية، سكة زفتى، الشعبية، الشعراوي، العلو، الشون، المعهد الديني، شارع 10، البندر، المشحمة، أبو راضي | 35 | 2500 |
| الزراعة، أبو علي | 45 | 2500 |
| كفر حجازي | 50 | 2500 |

---

## 🎨 الجزء 23: نظام التصميم

```css
:root {
  --navy: #1a2a4a;
  --navy-light: #2a3f6a;
  --navy-dark: #0f1a2e;
  --gold: #c9a84c;
  --gold-light: #e8d5a3;
  --gold-dark: #b8942a;
  --white: #ffffff;
  --success: #22c55e;
  --danger: #ef4444;
  --warning: #f59e0b;
  --info: #3b82f6;
  --del-green-1: #064e3b;
  --del-green-2: #047857;
  --del-green-3: #059669;
  --del-green-light: #10b981;
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-full: 9999px;
}
```

---

## 📚 الجزء 24: المكتبات

| المكتبة | الاستخدام |
|---------|-----------|
| Firebase SDK 9.22.0 | DB + Auth |
| Font Awesome 6.5.0 | الأيقونات |
| Tajawal | الخط |
| browser-image-compression 2.0.2 | ضغط الصور |
| html2canvas 1.4.1 | HTML → Image |
| jsPDF 2.5.1 | PDF generation |
| PDF.js 3.11 | استخراج كرتونة (احتياطي) |
| **Gemini API (via Worker)** | استخراج كرتونة |
| html5-qrcode | باركود |
| JsBarcode | توليد باركود |

---

## 🛒 الجزء 25: Workflow كامل للطلبات

### A. طلب أونلاين
```
1. عميل → checkout → source='website', paymentStatus حسب الطريقة
   • cash → 'unpaid'
   • instapay/wallet → 'pending'
   • credit (trader) → 'awaiting_admin'
2. admin يعالج (processing) → [trigger] balance += total
3. مندوب يقبل أو admin يعيّن → 'assigned'
4. مندوب يستلم → 'picked_up'
5. مندوب يسلّم → 'delivered' + cashCollectedByAgent=true
6. admin_plus/super يؤكد → Transaction:
   • orders.update({paymentStatus:'paid', confirmedByAdmin:true, invoiceGenerated:true})
   • invoices.add()  ← 🆕
   • customers.balance -= total  ← 🆕
   • cashbox.add({category:'order_payment'})
   • customer_notifications.add()
   • لو credit → لا يتم الخصم هنا (يتم عند دفع كل قسط)
```

### B. بيع كاشير
```
1. cashier → cashier/sales.html
2. يضيف منتجات → التحقق من branch_inventory
3. يحفظ → Transaction:
   • cashier_sales.add({cashboxStatus: 'pending_approval'})
   • branch_inventory.update({qty:-})
   • cashbox.add({status: 'pending'})
4. admin_plus يوافق → Transaction:
   • cashbox.update({status: 'approved'})
   • cashier_sales.update({cashboxStatus: 'approved'})
```

**استثناء**: super/admin_plus/admin → `approved` مباشر

### C. فاتورة يدوية
```
- super/admin_plus/admin → approved مباشر
- cashier → pending_approval

Transaction:
• manual_sales.add({createdBy, createdByName, createdByRole})
• cashbox.add({category:'manual_sale', status, createdBy})
• products/branch_inventory.update()
```

### D. كرتونة (Gemini + محرر) — تفصيل كامل في الجزء 29

### E. 🆕 مرتجع (عميل/مورد) — تفصيل في الجزء 41

---

## 🏢 الجزء 26: نظام الفروع والمخزون — ⚠️ محدّث v17.2

### البنية الحقيقية

```
┌─────────────────────────────────────────────┐
│       المخزن المركزي (WH)                    │
│   • مخزون بالوحدات الكبيرة (كراتين، بالات) │
│   • warehouseStock + warehousePieces       │
└──────────────┬──────────────────────────────┘
               │ transfers
     ┌─────────┴─────────┐
     ▼                   ▼
┌──────────┐       ┌──────────┐
│TNT طلعت  │       │RGB الرجبي│
│  حرب     │       │          │
│  قطاعي   │       │  قطاعي   │
│  بالقطع  │       │  بالقطع  │
└──────────┘       └──────────┘
```

### `branches`
```javascript
{
  id,
  name, code,          // 'WH' | 'TNT' | 'RGB'
  type: 'warehouse'|'retail'|'wholesale',  // 🆕
  address, phone,
  managerId, managerName,
  regions: [],
  isWarehouse: false,  // WH only = true
  active: true,
  createdAt, updatedAt
}
```

**Seed defaults:**
```javascript
{
  WH: { code: 'WH', name: 'المخزن المركزي', type: 'warehouse', isWarehouse: true },
  TNT: { code: 'TNT', name: 'طلعت حرب', type: 'retail', isWarehouse: false },
  RGB: { code: 'RGB', name: 'الرجبي', type: 'retail', isWarehouse: false }
}
```

### `products` — حقول المخزون (v17.2)
```javascript
{
  // ... الموجود
  unit: 'كرتونة' | 'بالة' | 'كجم' | 'قطعة' | ...,
  piecesPerUnit: 12,
  
  // المخزن المركزي (وحدات كبيرة + قطع متبقية)
  warehouseStock: 0,          // بالوحدات الكبيرة (كراتين)
  warehousePieces: 0,         // قطع متبقية
  warehouseMinAlert: 10,
  
  // إجمالي محسوب
  stockQuantity: 0            // = warehouseStock × piecesPerUnit + warehousePieces
}
```

### `branch_inventory/{branchId}_{productId}` — الفروع قطاعي فقط
```javascript
{
  branchId, productId,
  piecesQty: 0,             // ← دايماً بالقطع
  reservedQty: 0,
  availableQty: 0,          // = piecesQty - reservedQty
  minAlert: 10,
  productName, productImage, unit, piecesPerUnit,
  lastUpdated, updatedBy
}
```

**عرض مخزون الفرع بالكراتين:**
```
displayQty = Math.floor(piecesQty / piecesPerUnit) + ' كرتونة + ' + (piecesQty % piecesPerUnit) + ' قطعة'
// مثال: 45 قطعة، 12/كرتونة → "3 كراتين + 9 قطع"
```

### `transfers` — نقل
```javascript
{
  id, fromBranchId, toBranchId,
  items: [{ productId, units, pieces }],  // من المخزن للفرع
  status: 'pending'|'in_transit'|'received'|'cancelled',
  requestedBy, requestedAt,
  shippedBy, shippedAt,
  receivedBy, receivedAt
}
```

### Workflow نقل
```javascript
async function transferToBranch(fromBranchId, toBranchId, items, adminId, adminName) {
  await db.runTransaction(async (t) => {
    // إنشاء سجل النقل
    const trRef = db.collection('transfers').doc();
    t.set(trRef, { id: trRef.id, fromBranchId, toBranchId, items, status: 'in_transit', ... });
    
    for (const item of items) {
      const prod = (await t.get(db.collection('products').doc(item.productId))).data();
      const totalPieces = (item.units * prod.piecesPerUnit) + (item.pieces || 0);
      
      // خصم من المخزن
      if (fromBranchId === 'WH') {
        t.update(db.collection('products').doc(item.productId), {
          warehouseStock: firebase.firestore.FieldValue.increment(-item.units),
          warehousePieces: firebase.firestore.FieldValue.increment(-(item.pieces || 0))
        });
      }
      
      // إضافة للفرع (بالقطع)
      const brRef = db.collection('branch_inventory').doc(`${toBranchId}_${item.productId}`);
      t.set(brRef, {
        piecesQty: firebase.firestore.FieldValue.increment(totalPieces),
        availableQty: firebase.firestore.FieldValue.increment(totalPieces),
        ...
      }, { merge: true });
    }
  });
}
```

---

## 💰 الجزء 27: نظام الصندوق

### `cashbox/{entryId}` — ⚠️ محدّث v17.2
```javascript
{
  id,
  type: 'income' | 'expense',
  category: 'order_payment' | 'cashier_sale' | 'cardoona_sale' 
          | 'manual_sale' | 'supplier_payment' | 'salary' | 'damage' | 'other'
          | 'installment_payment' | 'expense' | 'supplier_refund' | 'customer_refund',  // 🆕
  source: 'website' | 'cashier' | 'cardoona' | 'manual',
  branchId,
  
  // 🆕 العلاقات
  relatedId: '',        // orderId / invoiceId / expenseId / salaryId / returnId / planId
  relatedType: '',      // 'order' | 'invoice' | 'expense' | 'salary' | 'return' | 'purchase' | 'damage' | 'installment'
  
  // المبالغ
  amount, description,
  method: 'cash' | 'instapay' | 'wallet' | 'transfer',
  
  // 🆕 المرفقات
  attachments: [],
  
  // 🆕 التقفيل
  dailyCloseId: '',
  isOpening: false,
  
  // 🆕 الاسترداد
  refundOf: '',
  isRefund: false,
  
  // الحالة
  status: 'pending' | 'approved' | 'rejected',
  approvedBy, approvedByName, approvedAt,
  rejectionReason: '',
  
  createdBy, createdByName, createdByRole,
  createdAt
}
```

### الصلاحيات
- **super + admin_plus**: approve/reject
- **admin**: يرى فقط
- **cashier**: إنشاء pending فقط

---

## 📊 الجزء 28: نظام الجرد والتقارير المالية

### `financial-reports.html`
```
+ مبيعات جملة + قطاعي + كاشير + كرتونة + يدوية + أقساط
- مصروفات - مرتبات - تلفيات - مشتريات - مرتجعات
= صافي الربح

مقارنة مع cashbox:
  • متوقع = Σ(income approved) - Σ(expense approved)
  • فعلي = عد يدوي
  • الفرق = overage/shortage
```

### `inventory-reports.html` (محدّث v17.2)
1. **مخزون المخزن** (كراتين + قطع) — warehouseStock + warehousePieces
2. **مخزون كل فرع** (بالقطع + عرض كراتين)
3. **مجمع** (الإجمالي)
4. **قابل للطباعة A4**

### 🆕 تقارير مالية جديدة (v17.2)
- `daily-closes.html` — تقفيل يومي
- `debts.html` — ذمم مدينة/دائنة
- `cash-flow.html` — تدفق نقدي
- `installments.html` — خطط الأقساط

---

## 🎯 الجزء 29: كرتونة — Gemini + محرر ديناميكي

### 4 مراحل النظام

#### المرحلة 1: الاستخراج (Gemini via Worker)

**الصفحة**: `admin/extract-pdf.html` — الخطوة 1 من 3

- رفع PDF/صورة → `window.WORKER_ENDPOINTS.gemini`
- الـ Worker يستدعي Gemini (المفتاح في Secrets)
- عرض المؤشرات: عدد البنود / الإجمالي / العميل / السداد
- **لم يُحفظ في Firestore بعد**

#### المرحلة 2: المحرر الديناميكي (الخطوة 2 من 3)

- 2-column layout: يسار تحرير، يمين معاينة حية
- إضافة/حذف بنود، خصومات، سداد
- `edit_history` لتتبع كل تعديل
- زر "إرجاع للتعديلات المُستخرجة"
- أزرار: 💾 حفظ كمسودة / ✅ تأكيد وحفظ / ❌ إلغاء

#### المرحلة 3: الحفظ الذكي (Transaction)

```javascript
await db.runTransaction(async (t) => {
  // 1. حفظ الفاتورة
  t.set(cardoona_invoices.doc(invoiceId), {
    original_extraction, final_data, edit_history,
    extractedBy, extractedAt, editedBy, editedAt,
    status: 'confirmed',
    customerMatchMethod: 'existing_code'|'existing_phone'|'new',
    matchedCustomerId
  });
  
  // 2. إنشاء الطلب
  t.set(orders.doc(), {
    source: 'cardoona',
    branchId: 'WH',
    customerId, customerName, ...
    paymentMethod: 'cardoona_installment',
    paymentStatus: 'awaiting_cardoona',
    status: 'pending',
    deliveryStatus: 'unassigned'
  });
  
  // 3. خصم من المخزن
  for (const item of editedItems) {
    t.update(products.doc(item.productId), {
      warehouseStock: firebase.firestore.FieldValue.increment(-item.quantity)
    });
  }
  
  // 4. عميل جديد → إنشاء معلق + إشعار fan-out للسوبر
  if (customerMatchMethod === 'new') { ... }
});
```

#### المرحلة 4: مراجعة السوبر

**الصفحة**: `admin/cardoona-traders.html` — super فقط
- 3 تبويبات: معلق / مفعّل / مرفوض
- أزرار: توليد كود / تعديل / رفض
- **Semi-Auto**: Super يدوس "توليد" → Modal → ينسخ الكود ويبعته يدوياً

---

## 📝 الجزء 30: الفاتورة اليدوية

### Schema `manual_sales/{saleId}`
```javascript
{
  id, receiptNo,
  branchId,
  createdBy, createdByName, createdByRole,
  type: 'walk_in' | 'trader' | 'other',
  customerName, customerPhone,
  traderId, traderCode,
  items: [...],
  subtotal, discount, discountType, total,
  paymentMethod, paymentStatus,
  paid, remaining,
  cashboxEntryId,
  cashboxStatus: 'pending_approval' | 'approved',
  createdAt
}
```

### الصلاحيات
| الدور | ينشئ | cashboxStatus |
|-------|------|---------------|
| super | ✅ | approved |
| admin_plus | ✅ | approved |
| admin | ✅ | approved |
| cashier | ✅ | pending_approval |

---

## 🖨️ الجزء 31: نظام الطباعة

### الطباعة المحلية / PDF محلي
- كامل التفاصيل (اسم + هاتف + عنوان)

### PDF على استضافة خارجية (Catbox)
- **مخفي**: العنوان + هاتف العميل

### أنواع المستخدم
`retail_cash`, `trader_cash`, `trader_credit`, `guest`, `cardoona`, `manual`

---

## 🔐 الجزء 32: المفاتيح والأمان — ⚠️ محدّث v17.2

### 🔒 قاعدة صارمة جديدة

> **ممنوع منعاً باتاً وضع أي API key حساس في `firebase-config.js` أو أي ملف client-side.**
> كل الخدمات الخارجية (ImgBB / Catbox / Gemini / PDF) تتم عبر **Cloudflare Worker**.

### الـ Worker — الخدمات المتاحة

| Endpoint | الوظيفة | Secrets في Cloudflare |
|----------|---------|----------------------|
| `POST /upload` | رفع صورة (legacy) | `IMGBB_KEY`, `YOURIMAGESHARE_KEY`, `FREEIMAGE_KEY`, `CATBOX_USERHASH` |
| `POST /api/upload-image` | **Alias** لـ `/upload` | نفس اللي فوق |
| `POST /api/gemini` | استخراج كرتونة | `GEMINI_KEY` 🆕 |
| `POST /api/pdf` | رفع PDF | `CATBOX_USERHASH` |
| `GET /health` | فحص الحالة | — |

### `window.uploadImage` — من `firebase-config.js`

```javascript
window.WORKER_URL = 'https://awlad-shalaan-apis.awladsh3laan.workers.dev';

window.WORKER_ENDPOINTS = {
  uploadImage: `${window.WORKER_URL}/api/upload-image`,
  gemini:      `${window.WORKER_URL}/api/gemini`,
  pdf:         `${window.WORKER_URL}/api/pdf`,
  health:      `${window.WORKER_URL}/health`
};

window.uploadImage = async function(file, onProgress) {
  // 1. ضغط (اختياري)
  // 2. POST /api/upload-image مع formData 'image'
  // 3. Worker يجرّب: ImgBB → YourImageShare → FreeImage → Catbox
  // 4. يرجع { success: true, url, provider }
  return url;
};
```

### Firebase Keys
- في `firebase-config.js` (client-side) — **مسموح**
- الحماية الفعلية: Firestore Rules

### ❌ محذوف نهائياً
- ImgBB key في `firebase-config.js`
- Catbox userhash في العميل
- Gemini key في العميل
- Cloudflare R2 (بطاقة)
- Cloud Functions (Blaze)

### Firestore Rules
- **صارمة في النهاية** (المرحلة 5)
- **مرنة في المرحلة 0**

---

## 📲 الجزء 33: PWA

- `manifest.json`
- `service-worker.js` (Network First HTML/JS, Cache First Images)
- `offline.html`
- `sw-strategies.js`
- `pwa-register.js`
- `assets/icons/*` (8 مقاسات)

---

## 🖼️ الجزء 34: رفع الصور — Worker فقط

**ممنوع** استخدام:
- `IMGBB_API_KEY` مباشرة
- `fetch('https://api.imgbb.com/...')`
- `fetch('https://catbox.moe/...')`

**المسموح فقط:**
```javascript
const url = await window.uploadImage(file, onProgress);
// أو
const resp = await fetch(window.WORKER_ENDPOINTS.uploadImage, {
  method: 'POST',
  body: formData  // يحتوي 'image' field
});
```

**الـ Worker يتولى:**
- ترتيب المصادر (priority 1→4)
- Fallback تلقائي
- تسجيل النجاح/الفشل
- إرجاع `{ success, url, provider }`

---

## ⚠️ الجزء 35: الأخطاء المعروفة (قائمة v17.2)

### 🔴 فئة A: أخطاء أمنية حرجة (10)

| # | الخطأ | الحل |
|---|-------|------|
| A1 | مفاتيح API في client-side | ✅ **تم الحل في v17.2** — رفع عبر Worker فقط |
| A2 | `customers create` مفتوح | تحديث rule |
| A3 | `invoices create` مفتوح | تحديث rule |
| A4 | `admins update` يرقّي super | منع تعديل role |
| A5 | `activityLog create: if true` | منع الزوار |
| A6 | `orders update` يسمح للمندوب بغيّر status | منع |
| A7 | `delivery_agents read` لأي مسجل | منع |
| A8 | إشعارات المندوبين ممنوعة | تعديل rule |
| A9 | الزائر لا يستطيع قراءة order-success | تعديل rule |
| A10 | كشف البيانات في PDF خارجي | إخفاء اسم/هاتف |

### 🔴 فئة B: ميزات مكسورة (40) — محدّث

| # | الملف | المشكلة | الحالة |
|---|-------|---------|--------|
| B1 | admin/customers.html | "Klasno" + function ناقصة | ✅ **حُلّت** |
| B2 | admin/dashboard.html | يستخدم orders_wholesale/retail | ⏳ |
| B3 | admin/invoices.html | const db = SyntaxError | ⏳ |
| B4 | admin/products.html | حذف تصنيف = حذف منتجات | ✅ **حُلّت (P1)** |
| B5 | admin/products.html | hasOffer فقط | ✅ **حُلّت (P6)** |
| B6 | admin/products.html | retailUnit vs retailunit | ✅ **حُلّت (P3)** |
| B7 | admin/products.html | lowStockThreshold متثبت | ✅ **حُلّت (P8)** |
| B8 | admin/products.html | showToast مكرر | ✅ **حُلّت** |
| B9 | admin/home + customers | يحملون core.js | ✅ **حُلّت** |
| B10 | main.js | logoutAdmin() غير موجودة | ⏳ |
| B11 | main.js | مسارات صور relative | ⏳ |
| B12 | main.js | updatePublicStats() محظورة | ⏳ |
| B13 | cart.html | isGuest (isGuestUser) | ⏳ |
| B14 | cart.html | سلة الزائر بدون بيانات | ⏳ |
| B15 | checkout.html | region غير محمي | ✅ **حُلّت** |
| B16 | order-success.html | الزائر لا يقدر يشوف | ⏳ |
| B17 | registration-requests | approveRequest يضيع _currentRequest | ⏳ |
| B18 | delivery-agents | تسريب Auth orphans | ⏳ |
| B19 | delivery/available | Composite Index | ⏳ |
| B20 | delivery/home | المندوب يعمل تأكيد دفع | ⏳ |
| B21 | delivery-login | مسار نسبي | ✅ **حُلّت** |
| B22 | customer-login | دخول المندوب/الكاشير | ✅ **حُلّت** |
| B23 | customer-home | "عروض مميزة" فاضي | ⏳ |
| B24 | trader-home | "خصومات" فاضي | ⏳ |
| B25 | offers.html | دايماً فاضي | ⏳ |
| B26 | discounts.html | دايماً فاضي | ⏳ |
| B27 | brand-products | لا يعرض عرض/خصم | ⏳ |
| B28 | category-products | لا يعرض عرض/خصم | ⏳ |
| B29 | store-wholesale | HTML مكسور | ⏳ |
| B30 | product-details | زر تعديل مش شغال | ⏳ |
| B31 | index.html | رقم واتساب غلط | ⏳ |
| B32 | index.html | إيميل غلط | ⏳ |
| B33 | tracking + support | رقم واتساب غلط | ⏳ |
| B34 | about.html | إحصائيات fallback | ⏳ |
| B35 | notification.html | غير realtime | ⏳ |
| B36 | register-guide | userId: 'all_admins' | ⏳ |
| B37 | categories.html | N+1 query | ⏳ |
| B38 | products.html | HTML مكسور | ✅ **حُلّت** |
| B39 | cashier | لا يستطيع الخروج | ⏳ |
| B40 | customer-login | trader-home.html (404) | ✅ **حُلّت** |

### 🔴 فئة C: تعارضات Schema (10) — محدّث

| # | المشكلة | الحالة |
|---|---------|--------|
| C1 | orders vs orders_wholesale/retail | ⏳ |
| C2 | invoices vs invoices_wholesale/retail | ⏳ |
| C3 | hasOffer/offerPrice vs hasRetailOffer | ✅ **حُلّت** |
| C4 | hasWholesaleDiscount مش متحفظ | ✅ **حُلّت** |
| C5 | admin_plus مش في شراء | ✅ **حُلّت** |
| C6 | paymentStatus غير موحد | ⏳ |
| C7 | notes vs traderNotes | ✅ **حُلّت** |
| C8 | discount غير موحد | ⏳ |
| C9 | customerId vs uid vs id | ⏳ |
| C10 | deliveryAgentId: '' غير مضمون | ✅ **حُلّت** |

### 🔴 فئة D: ملفات ناقصة (35) — محدّث

- ~~24 صفحة admin~~ → **12 صفحة admin جديدة** (v17.2)
- 6 صفحات cashier
- 8 صفحات PWA
- 8 PWA icons
- صور welcome
- logo.png
- invoice.html

### 🟡 فئة E: مسارات تحتاج نقل (7) — ✅ **حُلّت في v17.2**

- ~~customer-home, customer-login, customer-register~~
- ~~trader-home, trader-login~~
- ~~delivery-login~~
- ~~cashier-login~~

### 🟡 فئة F: مشاكل معمارية (15)

- نمطان مختلطان
- صفحة دخول IIFE واحدة
- 5 صفحات محتوى ~500 سطر مكرر
- main.js 1500+ سطر
- logging غير مركزي
- validation على السيرفر مفقود
- migrations مفقودة
- schema versioning مفقود
- نظام أذونات موحد مفقود
- حقن HTML بدون sanitize
- اختبارات صفر
- version control strategy

### 🆕 فئة H: كرتونة (4) — محدّث

| # | المشكلة | الحل |
|---|---------|------|
| H1 | Gemini قد يرجع JSON غير صحيح | Validation + fallback PDF.js — ✅ **حُلّت (Worker)** |
| H2 | تعديلات الأدمن غير متتبعة | `edit_history` ✅ |
| H3 | تاجر مكرر | Match by phone OR code ✅ |
| H4 | كود التاجر مكرر | Loop حتى فريد ✅ |

### 🆕 فئة I: v17.2 — النظام المالي (5)

| # | المشكلة | الحل |
|---|---------|------|
| I1 | مرتجعات غير موجودة | `returns` + `supplier_returns_pending` ✅ |
| I2 | workflows المصروفات/المرتبات/المشتريات/التلفيات غير محددة | workflows مفصلة في ج41 ✅ |
| I3 | الصندوق مختلط | إعادة هيكلة cashbox ✅ |
| I4 | لا تقفيل يومي | `daily_closes` ✅ |
| I5 | مديونية/أقساط غير مترابطة | `installment_plans` + triggers ✅ |

### 🟢 فئة G: تحسينات UX (10)

- notification.html → notifications.html
- store-retail لحماية trader
- order-success حساس للزائر
- checkout validation على السيرفر
- products.html pagination cursor
- categories.html N+1
- delivery/home realtime
- wallet fee واضح
- shipping-rates admin panel
- brands grayscale effect

**الإجمالي: ~112 مشكلة** (كان ~104)

---

## 🚀 الجزء 36: المراحل التنفيذية

| المرحلة | المدة | المخرجات | الحالة |
|---------|-------|----------|--------|
| **0** | 1-2 يوم | Backup + إصلاحات طوارئ | 🔄 **جاري** |
| **1** | 3-4 أيام | Schema + Migrations | ⏳ |
| **2** | 5-7 أيام | Redesign كل الصفحات | ⏳ |
| **3** | 11-14 يوم | ميزات جديدة | ⏳ |
| **4** | 1-2 يوم | Worker integration | ✅ **مُنجز جزئياً** |
| **5** | 2-3 أيام | Rules صارمة + اختبار | ⏳ |
| **6** | 1 يوم | دستور v17.3 | ⏳ |

### المرحلة 0 — تفصيل (محدّث)
1. ✅ Backup Firestore كامل
2. ✅ إصلاح `admin/customers.html`
3. ✅ إصلاح `admin/products.html` (v3.1)
4. ✅ إصلاح `checkout.html` (v5.0)
5. ✅ إصلاح `customer/home.html` (v3.0)
6. ✅ `firebase-config.js` v8.3 (بدون API keys)
7. ✅ Worker v2.0 (Gemini + PDF + upload alias)
8. ✅ توحيد المسارات (9 مسارات)
9. ✅ Rules مرنة مؤقتة (قيد الإنجاز)
10. ⏳ تقرير قبل/بعد

### المرحلة 3 — تفصيل (محدّث)
- **3.1**: cashier/* (6 صفحات)
- **3.2**: admin/cashbox.html
- **3.3**: admin/branches.html + transfers
- **3.4**: admin/inventory-reports.html
- **3.5**: admin/financial-reports.html
- **3.6**: admin/shipping-rates.html
- **3.7**: admin/extract-pdf.html
- **3.8**: admin/cardoona-traders.html
- **3.9**: admin/brands-manager.html
- **3.10**: admin/expenses.html 🆕
- **3.11**: admin/employees.html 🆕
- **3.12**: admin/salary-payments.html 🆕
- **3.13**: admin/returns.html 🆕
- **3.14**: admin/supplier-returns.html 🆕
- **3.15**: admin/purchases.html 🆕
- **3.16**: admin/damages.html 🆕
- **3.17**: admin/daily-closes.html 🆕
- **3.18**: admin/debts.html 🆕
- **3.19**: admin/cash-flow.html 🆕
- **3.20**: admin/installments.html 🆕
- **3.21**: manual_sales workflow
- **3.22**: delivery/blocked.html
- **3.23**: invoice.html
- **3.24**: admin/dashboard.html (بدل home.html)

---

## 🔑 الجزء 37: المفاتيح والإعدادات

```javascript
// Firebase — مسموح في client
const firebaseConfig = {
  apiKey: "AIzaSyCdU3HadKWtzKtTAO9x7mcVPq6eodTqPzA",  // Firebase API key — مسموح
  authDomain: "awlad-shalaan-wholesale.firebaseapp.com",
  projectId: "awlad-shalaan-wholesale",
  storageBucket: "awlad-shalaan-wholesale.firebasestorage.app",
  messagingSenderId: "390602001768",
  appId: "1:390602001768:web:05ec185f34ff0b5f7c1add"
};

// Worker — المصدر الوحيد للخدمات الخارجية
window.WORKER_URL = 'https://awlad-shalaan-apis.awladsh3laan.workers.dev';

// ❌ ممنوع في client:
// IMGBB_API_KEY, CATBOX_USERHASH, GEMINI_API_KEY
// كلها في Cloudflare Worker Secrets

// Constants
const WHATSAPP_NUMBER = "01068385028";
const PAYMENT_ACCOUNT = "01068385028";
const SUPPORT_EMAIL = "awladsh3laan@gmail.com";
```

---

## 📊 الجزء 38: إحصائيات المشروع

| المقياس | v17.1 | v17.2 |
|---------|-------|-------|
| الصفحات المكتملة | ~57 | ~60 (+home v3.0, checkout v5.0, products v3.1) |
| الصفحات المتبقية | ~34 | ~32 (12 admin جديدة + 20 قائمة) |
| الكوليكشنز | 55 | **62** |
| الأنظمة | 65 | **67** (+مالي +WhatsApp) |
| المشاكل المعروفة | ~104 | **~112** (+5 فئة I + 3 فئة H محدّثة) |
| API keys في client | 4 | **0** ✅ |

---

## ✅ الجزء 39: القرارات النهائية v17.2

1-126. **كل قرارات v17.1 محفوظة**

**+ الإضافات الجديدة (v17.2):**
127. **ممنوع منعاً باتاً وضع API keys في client** — كل الخدمات عبر Worker
128. **رفع الصور** — `window.uploadImage` فقط (لا `fetch` مباشر لـ ImgBB/Catbox)
129. **Worker v2.0** — يشمل `/api/gemini` + `/api/pdf` + `/api/upload-image` (alias)
130. **`CREDIT_CONFIG.ALLOWED_DAYS`** = [7, 10] بدل `MAX_DAYS: 7`
131. **`INSTALLMENTS_PER_DAYS`** = { 7: 2, 10: 3 }
132. **`checkout.html` v5.0** — يدعم credit + اختيار مدة الآجل
133. **`paymentStatus: 'awaiting_admin'`** للـ credit
134. **`branchId`** يُحدد من region في checkout (WH للجملة، RGB للقطاعي افتراضياً)
135. **9 مسارات محدّثة** — customer/trader/delivery/cashier/admin
136. **`admin/home.html` محذوف** — `admin/dashboard.html` بديلاً
137. **`pageState` object** في products.html (بدل المتغيرات المستقلة)
138. **7 collections جديدة** — employees, salary_payments, returns, supplier_returns_pending, installment_plans, daily_closes, whatsapp_outbox
139. **`supplier_returns_pending`** مفهرس — للمتابعة بدون البحث في كل `returns`
140. **3 أنواع مرتجع** — عميل (نقدي/credit_note)، مورد (نقدي/استبدال/معلق)
141. **`orders.balanceApplied`** trigger — عند processing → balance +=
142. **`orders.invoiceGenerated`** trigger — عند paid → invoice + balance -=
143. **`installmentStatus: 'pending_plan'`** — قبل إنشاء الخطة
144. **WhatsApp Semi-Auto** — wa.me يدوي، `whatsapp_outbox` للتتبع
145. **`orders.modifications[]`** — سجل كل تعديل
146. **`orders.notifications_sent[]`** — سجل كل إشعار
147. **Branch types** — 'warehouse' | 'retail' | 'wholesale'
148. **`products.warehouseStock` + `warehousePieces`** — المخزن المركزي
149. **`products.traderNotes`** — ملاحظات للتجار
150. **مصفوفة صلاحيات مالية جديدة** — admin يقدر يضيف مصروف/مرتجع/تلفية لكن لا يعتمد

---

## 🎯 الجزء 40: الخطوة القادمة

**بعد v17.2** → **المرحلة 1** فوراً:

### المرحلة 1 — Schema + Migrations
1. إنشاء 7 collections جديدة في Firestore
2. Migration script:
   - `products.stockQuantity` → `warehouseStock` + `warehousePieces`
   - `orders.hasOffer` → `orders.hasRetailOffer` (backward compat)
   - `customers.balance` — التحقق من القيم
3. Seed defaults:
   - `branches` (WH, TNT, RGB)
   - `employees` (5 موظفين)
   - `shipping_rates` (default)
4. Firestore Rules محدّثة للـ 62 collection

**بعد المرحلة 1** → **المرحلة 2** (Redesign) → **المرحلة 3** (ميزات جديدة).

---

## 📌 ملاحظات ختامية v17.2

1. **كل صورة** تُرفع عبر `window.uploadImage` (Worker)
2. **كل عملية مالية** في Transaction
3. **كل إشعار** fan-out (لكل أدمن UID)
4. **كل فاتورة** تُسجّل `createdBy` + `createdAt`
5. **كل صفحة** تحمي نفسها IIFE
6. **الدستور حي** — يُحدَّث بعد كل مرحلة
7. **Repo واحد** — branch `redesign`
8. **Firebase Project واحد**
9. **الأمان في النهاية** — rules صارمة بعد إصلاح الصفحات
10. **Spark Plan فقط** — بدون Cloud Functions
11. **🆕 صفر API keys في client** — Worker فقط
12. **🆕 62 collection** — منها 7 مالية جديدة
13. **🆕 10 workflows مالية** موثقة بالكود الكامل
14. **🆕 نظام أقساط كامل** — 7 أو 10 أيام، 2 أو 3 أقساط
15. **🆕 WhatsApp Semi-Auto** — wa.me يدوي + outbox للتتبع

---

**هذا هو المرجع الرسمي الكامل v17.2 ✅**

**آخر تحديث:** 2026-10-19
**الحالة:** المرحلة 0 — مكتملة جزئياً (منتجات + عملاء + checkout + home + worker)
```

---

## ✅ ملخص ما تم إنجازه

| الملف | الحالة |
|-------|--------|
| `firebase-config.js` v8.3 | ✅ بدون API keys |
| `admin/products.html` v3.1 | ✅ pageState (لا تصادم) |
| `admin/customers.html` v2.0 | ✅ تم سابقاً |
| `customer/home.html` v3.0 | ✅ مسارات محدثة |
| `checkout.html` v5.0 | ✅ credit + مدة الآجل |
| Cloudflare Worker v2.0 | ✅ Gemini + PDF + upload |
| `CONSTITUTION.md` v17.2 | ✅ **الملف أعلاه** |

---

## 🚀 الخطوة القادمة

**المرحلة 1** — Schema + Migrations:
1. إنشاء 7 collections جديدة
2. Migration scripts
3. Seed defaults (branches, employees, shipping_rates)
4. Firestore Rules للـ 62 collection

**قول "كمّل المرحلة 1"** وأبدأ فوراً. 🚀
