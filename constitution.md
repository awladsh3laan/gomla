# 📜 دستور مشروع أولاد شعلان — v15.0 الكامل

```markdown
# 📜 دستور مشروع أولاد شعلان للمنظفات والورقيات

**الإصدار:** 15.0 (النسخة الشاملة المحدثة — بعد إصلاح الأخطاء + نظام الطباعة + PWA)
**آخر تحديث:** 2026-10-18
**هذا الملف هو المرجع الوحيد للمشروع**
**⚠️ استخدم هذا الملف كمرجع أساسي عند بدء محادثة جديدة**

---

## 📌 الجزء الأول: معلومات المشروع

| البند | التفاصيل |
|------|----------|
| **الاسم** | أولاد شعلان للمنظفات والورقيات |
| **النوع** | متجر إلكتروني (جملة + قطاعي) + لوحة تحكم + أنظمة مالية + كاشير + باركود + شركاء + نظام توصيل + إدارة محتوى + **PWA** |
| **الرابط** | https://awladsh3laan.github.io/gomla |
| **GitHub** | https://github.com/awladsh3laan/gomla.git |
| **التقنيات** | HTML + CSS + Vanilla JS + Firebase + **Backblaze B2 + Cloudflare Workers** |
| **اللغة** | العربية (RTL) |
| **الخط** | Tajawal |
| **الأيقونات** | Font Awesome **فقط** — ممنوع أي إيموجي في الـ UI |

---

## 🔐 الجزء الثاني: نظام الدخول والصلاحيات

### نظام الدخول الموحد

```
Firebase Auth + localStorage + كود سري للتجار + كود سري للموصلين + Firebase Secondary App
```

| المستخدم | الدخول | التسجيل |
|---------|--------|---------|
| العميل (قطاعي) | Email + Password | تسجيل ذاتي |
| التاجر (جملة) | كود سري `MHL-XXXX` | طلب انضمام (register-guide) |
| الموصل | كود سري `DEL-XXXXX@#$` | طلب انضمام (register-guide) |
| الأدمن | Email + Password | السوبر أدمن |
| أدمن بلص | Email + Password | السوبر أدمن |
| السوبر أدمن | Email + Password | ثابت |
| الزائر | لا يحتاج دخول | تصفح فقط |
| الكاشير | Email + Password | السوبر أدمن |

---

### 🆕 نظام الحماية الموحّد (v14.0)

**كل صفحات الدخول/التسجيل بتعمل حماية مزدوجة:**

#### 1. حماية فورية IIFE (قبل أي كود — تمنع وميض الصفحة)

```javascript
(function protectLoginPage() {
  try {
    const admin = localStorage.getItem('admin');
    const customer = localStorage.getItem('customer');
    const cashier = localStorage.getItem('cashier');
    const deliveryData = localStorage.getItem('deliveryData');

    if (admin || customer || cashier || deliveryData) {
      window.location.replace('/gomla/');
    }
  } catch (e) {
    console.warn('protectLoginPage error:', e);
  }
})();
```

#### 2. حماية ثانية بعد تحميل main.js

```javascript
document.addEventListener('DOMContentLoaded', function() {
  if (typeof getCurrentUser === 'function') {
    const user = getCurrentUser();
    if (user) {
      if (typeof showToast === 'function') {
        showToast('أنت مسجل دخول بالفعل — جاري تحويلك...', 'info');
      }
      setTimeout(() => {
        window.location.replace('/gomla/');
      }, 1000);
    }
  }
});
```

#### 3. الصفحات المحمية:
- ✅ `admin/login.html`
- ✅ `cashier-login.html`
- ✅ `customer-login.html`
- ✅ `trader-login.html`
- ✅ `delivery-login.html`
- ✅ `customer-register.html`
- ✅ `register-guide.html`

**القاعدة:** أي مستخدم مسجل دخول → تحويل موحّد إلى `/gomla/` بدون استثناء.

---

### 🆕 نظام دخول التجار (v2.0)

```
Email:    {code-lowercase}@trader.awladshalaan.com
Password: {code}
```

**خطوات الدخول:**
1. التاجر يدخل الكود في `trader-login.html` (تصميم عمودين + لون بني)
2. النظام يقرأ `trader_lookup/{CODE}` للحصول على `authEmail`
3. `signInWithEmailAndPassword(authEmail, code)`
4. التحقق من تطابق UID مع `customerId`
5. جلب البيانات من `customers/{uid}`
6. حفظ في localStorage + التوجيه لـ `trader-home.html`

---

### 🆕 نظام دخول الموصلين (v1.0)

**صيغة الكود:** `DEL-{5 حروف/أرقام} + {علامة مميزة}`
**العلامات:** `@#$`, `@#%`, `@#&`, `@#*`, `@$%`, `@$&`, `@$*`, `#$%`, `#$&`, `#$*`, `$%&`, `$%*`

```
Email:    del-{code-lowercase}@delivery.awladshalaan.com
Password: {code}
```

**خطوات الدخول:** (نفسها سابقة — يحفظ في `localStorage.deliveryData` ويوجه لـ `delivery/home.html`)

---

### 🎨 تصميم صفحات الدخول الموحّد

| الصفحة | اللون | الصورة |
|--------|-------|--------|
| `admin/login.html` | Navy + Gold | `welcom-admin.jpg` |
| `cashier-login.html` | بنفسجي (`#4c1d95` → `#7c3aed`) | `welcome-cashier.jpg` |
| `customer-login.html` | سماوي + ذهبي | `welcome-customer.jpg` |
| `trader-login.html` | بني + ذهبي | `welcom-trader.jpg` |
| `delivery-login.html` | أخضر داكن | `welcom-delivarey.jpg` |

**تصميم عمودين:** صورة + أنيميشنات (يمين) + فورم (يسار)

---

### 🆕 Firebase Secondary App

**الاستخدام:** `admin/generate-codes.html` + `admin/delivery-agents.html`

```javascript
const secondaryApp = firebase.initializeApp(firebaseConfig, 'Secondary-' + Date.now());
const secondaryAuth = secondaryApp.auth();
await secondaryAuth.createUserWithEmailAndPassword(email, password);
await secondaryAuth.signOut();
await secondaryApp.delete();
```

---

### 🆕 نظام طلبات التسجيل (v14.0)

**كولكشن:** `registration_requests`

```javascript
{
  type: 'trader' | 'delivery',
  requestedCode: 'trader_code' | 'delivery_code',
  name, phone, whatsapp,
  // للتاجر
  shopName, city, fullAddress,
  businessType: 'cash' | 'credit',
  creditLimit: 0-5000, paymentDays: 1-10,
  // للموصل
  vehicleType, coverageArea,
  notes, attachments,
  status: 'pending' | 'approved' | 'rejected',
  reviewedBy, reviewedByName, reviewedAt, adminNotes,
  createdAt, updatedAt
}
```

**الآلية:**
1. المستخدم يفتح `register-guide.html`
2. يختار نوع التسجيل → فورم Modal → Firestore
3. الأدمن يشوف الطلبات في `admin/registration-requests.html`
4. يوافق/يرفض → عند الموافقة ينشئ الحساب يدوياً

---

### الأدوار والصلاحيات

```javascript
ROLES = {
  SUPER: 'super',        // كل شيء
  ADMIN_PLUS: 'admin_plus', // إدارة + موصلين + طلبات تسجيل
  ADMIN: 'admin',        // إدارة أساسية
  CASHIER: 'cashier',
  WHOLESALE: 'wholesale',
  RETAIL: 'retail',
  DELIVERY: 'delivery',
  GUEST: 'guest'
}
```

**تفاصيل كل دور:** (نفس v14.0 — راجع الجدول التفصيلي سابقاً)

---

### 🛡️ دوال الحماية المتقدمة

| الدالة | الأدوار |
|-------|---------|
| `protectPage()` | أي مسجل |
| `protectAdminPage()` | SUPER + ADMIN_PLUS + ADMIN |
| `protectSuperAdminPage()` | SUPER فقط |
| `protectAdminPlusPage()` | SUPER + ADMIN_PLUS |
| `protectCashierPage()` | CASHIER + كل الأدمن |
| `protectCustomerPage()` | RETAIL + WHOLESALE |
| `protectDeliveryPage()` | DELIVERY (active) |

---

### 🔔 نظام الجلسات المتعددة

**المفاتيح المراقبة:** `['admin', 'customer', 'cashier', 'deliveryData']`
**عند التغيير:** Overlay احترافي + عدّاد 5 ثواني + تحويل تلقائي

---

## 🏠 الجزء الثالث: الصفحة الرئيسية index.html

### 8 سيكشنات:
```
1. السلايدر (من Firestore)
2. كروت المتاجر (جملة + قطاعي)
3. أحدث المنتجات
4. أحدث العروض
5. المنتجات الأكثر طلباً
6. سيكشنات مخصصة (custom_sections)
7. نبذة عن أولاد شعلان
8. تواصل معنا
```

---

## 📄 الجزء الرابع: صفحة تفاصيل المنتج

**عرض حسب الصلاحية:**
- **تاجر/أدمن:** سعر جملة + مستهلك + هامش + مخزون + ملاحظات
- **عميل/زائر:** سعر قطاعي + وصف + براند + تصنيف + مخزون
- **سوبر أدمن:** كل ما سبق + سعر شراء + تعديل

---

## 🏪 الجزء الخامس: المتاجر

### المتجر القطاعي (`store-retail.html`):
```
Brand Hero → السلايدر → البحث → أحدث المنتجات → البراندات
→ العروض → الأقسام → جميع المنتجات
```

### المتجر الجملة (`store-wholesale.html`):
```
Brand Hero → السلايدر → البحث → أحدث المنتجات → البراندات
→ الخصومات → الأقسام → جميع المنتجات → شركاء النجاح
```

**الفرق:** الجمهور / السعر / الوحدة / العروض / الشركاء / ملاحظات التاجر

---

## 📂 الجزء السادس: صفحة الأقسام

- Hero Bar + شبكة أقسام
- أنيميشن `dropIn` + عدد المنتجات حقيقي
- رابط ذكي: `?type=retail/wholesale`

---

## 📄 الجزء السابع: منتجات القسم

- Breadcrumb + Sticky Bar + شرائح براندات + فلاتر + شبكة منتجات
- السعر حسب المستخدم

---

## 🎯 الجزء الثامن: العروض والخصومات

| النظام | المتجر | يظهر لـ | الصفحة | الوحدة |
|--------|--------|---------|--------|--------|
| العروض | القطاعي | العملاء والزوار | `offers.html` | قطعة |
| الخصومات | الجملة | التجار والأدمن | `discounts.html` | كرتونة/بالة |

---

## 💳 الجزء التاسع: طرق الدفع

| # | الطريقة | الرسوم | الرمز |
|---|--------|-------|-------|
| 1 | الدفع عند الاستلام | 0% | `cash` |
| 2 | إنستا باي | 0% | `instapay` |
| 3 | محفظة إلكترونية | **+1%** | `wallet` |

**رقم الحساب:** `01068385028`

### المعادلة:
```javascript
baseTotal = subtotal + shippingCost
paymentFee = method === 'wallet' ? baseTotal × 0.01 : 0
totalBeforeRound = baseTotal + paymentFee
grandTotal = roundToNearest5(totalBeforeRound)
```

### قاعدة التدوير:
```javascript
function roundToNearest5(amount) {
  return Math.round(amount / 5) * 5;
}
```

**حقول الطلب الجديدة:**
```javascript
{
  paymentMethod, paymentMethodLabel,
  paymentFeePercent, paymentFee, grandTotal,
  paymentProof, paymentProofUploadedAt,
  paymentStatus: 'unpaid' | 'pending' | 'paid',
  paid: 0, remaining: grandTotal
}
```

---

## 🚚 الجزء العاشر: نظام الموصلين

### الكولكشنز:
- `delivery_agents/{uid}` — بيانات الموصل
- `delivery_lookup/{CODE}` — كود الدخول
- `delivery_collections/{id}` — التحصيلات

### سير العمل:
```
1. العميل يعمل أوردر → deliveryStatus: 'unassigned'
2. الأدمن يعيّن → 'assigned'
   أو الموصل يقبل بنفسه من available.html
3. الموصل يستلم من المخزن → 'picked_up'
4. الموصل يسلّم للعميل → 'delivered'
   → لو cash: يحصّل المبلغ
5. الأدمن يؤكد استلام المبلغ → (workflow جديد v15.0 — راجع الجزء 33)
```

### 💰 تقسيم الفلوس:
```
الفلوس اللي الموصل بيحصلها من العميل:
├── 💵 فلوس المنتجات (subtotal) → الصندوق تحت بند "أوردرات دليفري"
└── 🚚 فلوس الشحن (shippingCost) → من حق الموصل
```

### صفحات الموصلين — كلها ✅:
`delivery-login.html` / `home.html` / `orders.html` / `available.html` / `order-details.html` / `collections.html` / `profile.html`

### صفحات إدارة الموصلين:
- `admin/delivery-agents.html` ✅
- `admin/assign-delivery.html` ✅ (v1.0 — v15.0)
- `admin/delivery-settlements.html` ⏳

---

## 💰 الجزء الحادي عشر: الإبلاغ عن السداد

**كولكشن:** `financial_notifications`
**الصفحة:** `customer/balance.html` → إبلاغ → `admin/financial-transactions.html` → اعتماد/رفض

---

## 🤝 الجزء الثاني عشر: نظام الشركاء

**كولكشن:** `partners` — الشركاء = التجار والمحلات
**يظهر في:** سيكشن "شركاء النجاح" في متجر الجملة
**يدير:** سوبر أدمن فقط

---

## 🎫 الجزء الثالث عشر: تذاكر الدعم

**كولكشن:** `support_tickets`
**الصفحات:** `support.html` (للعملاء) + `admin/support.html` (للإدارة)

---

## 🔒 الجزء الرابع عشر: إدارة المحتوى الموحّد

**صفحة:** `admin/content-manager.html` (سوبر أدمن فقط)

| # | الصفحة | الكولكشن |
|---|--------|----------|
| 1 | `privacy-policy.html` | `privacy_sections` |
| 2 | `shipping-policy.html` | `shipping_sections` |
| 3 | `exchange-policy.html` | `exchange_sections` |
| 4 | `terms.html` | `terms_sections` |
| 5 | `faq.html` | `faq_sections` |

**8 أنواع محتوى:** `text`, `quote`, `list`, `cards`, `table`, `contact`, `steps`, `faq`

---

## 🚪 الجزء الخامس عشر: بوابة الدخول login.html

**5 كروت دخول:** الإدارة / التجار / العملاء / الكاشير / الموصلين
**قسم "مستخدم جديد؟":** تسجيل عميل + طلب كود تاجر + انضم لفريق التوصيل

**التوجيه حسب الدور:**
| الدور | الوجهة |
|-------|--------|
| Super/Admin+/Admin | `/admin/home.html` |
| Wholesale | `/trader-home.html` |
| Retail | `/customer-home.html` |
| Cashier | `/cashier/home.html` |
| Delivery | `/delivery/home.html` |

---

## 📝 الجزء السادس عشر: دليل التسجيل register-guide.html

**صفحة واحدة تشرح كل طرق التسجيل:**
1. تسجيل عميل — ذاتي فوري
2. تسجيل تاجر — 3 أزرار (فورم + واتساب + إيميل)
3. تسجيل موصل — 3 أزرار (فورم + واتساب + إيميل)

---

## 📄 الجزء السابع عشر: إدارة طلبات التسجيل

**صفحة:** `admin/registration-requests.html` (سوبر + أدمن بلص)
**الميزات:** 4 إحصائيات + 6 تبويبات + بحث + موافقة/رفض

---

## 🛒 الجزء الثامن عشر: السلة والدفع

- **cart.html:** دعم مسجل + زائر + تاجر
- **checkout.html (v4.0):** 3 طرق دفع + تدوير + رفع إثبات
- **order-success.html (v2.0):** صندوق دفع + رقم حساب + إثبات

---

## 📱 الجزء التاسع عشر: تصميم الموبايل App-Like

**المبادئ:**
```
❌ لا يوجد هيدر كامل
❌ لا يوجد فوتر
✅ شريط علوي مبسط (ثابت)
✅ تبويبات عليا حسب الصلاحية
✅ تبويبات سفلى حسب الصفحة
✅ شريط حقوق فقط
```

**قواعد:**
```
✅ overflow-x: hidden
✅ overscroll-behavior-x: contain
✅ تحويل الجداول لـ Cards
✅ padding-top للـ body
```

---

## 🗄️ الجزء العشرون: هيكل الملفات الكامل (v15.0)

```
📁 gomla/
├── 📁 assets/
│   ├── css/
│   │   ├── style.css              (v7.0)
│   │   ├── invoice-print.css      🆕 (v1.0 — نظام الطباعة)
│   │   └── pwa.css                🆕 (v1.0 — تنسيقات PWA)
│   │
│   ├── js/
│   │   ├── firebase-config.js     (v7.0)
│   │   ├── main.js                (v7.0)
│   │   ├── public.js
│   │   ├── invoice-print.js       🆕 (v1.1 — الطباعة الموحدة)
│   │   ├── invoice-storage.js     🆕 (v1.0 — Backblaze B2)
│   │   └── pwa-register.js        🆕 (v1.0 — تسجيل Service Worker)
│   │
│   ├── components/
│   │   ├── header.html
│   │   ├── footer.html            (v2.0)
│   │   └── sidebar.html
│   │
│   └── images/ + icons/           🆕 (أيقونات PWA)
│       ├── icon-72.png
│       ├── icon-96.png
│       ├── icon-128.png
│       ├── icon-144.png
│       ├── icon-152.png
│       ├── icon-192.png
│       ├── icon-384.png
│       └── icon-512.png
│
├── 📁 PWA Files (جذر المشروع)     🆕
│   ├── manifest.json              🆕 (إعدادات التطبيق)
│   ├── service-worker.js          🆕 (التخزين المؤقت)
│   ├── offline.html               🆕 (صفحة "لا إنترنت")
│   └── sw-strategies.js           🆕 (استراتيجيات التخزين)
│
├── 📁 admin/
│   ├── login.html                 ✅ (v2.1 + حماية)
│   ├── home.html                  ⏳
│   ├── dashboard.html             ⏳
│   ├── products.html              ⏳
│   ├── customers.html             ⏳
│   ├── orders.html                ✅ (v4.0 🆕 — Bottom Sheet + Cards)
│   ├── invoices.html              ⏳
│   ├── suppliers.html             ⏳
│   ├── purchases.html             ⏳
│   ├── extract-pdf.html           ⏳
│   ├── cashbox.html               ⏳ (يحتاج بند أوردرات دليفري)
│   ├── daily-sales.html           ⏳
│   ├── barcode-scanner.html       ⏳
│   ├── financial-reports.html     ⏳
│   ├── ranks-levels.html          ⏳
│   ├── settings.html              ⏳
│   ├── branches.html              ⏳
│   ├── cashier.html               ⏳
│   ├── generate-codes.html        ✅
│   ├── sections-manager.html      ✅
│   ├── partners-manager.html      ✅
│   ├── financial-transactions.html ✅
│   ├── support.html               ✅
│   ├── content-manager.html       ✅
│   ├── delivery-agents.html       ✅
│   ├── assign-delivery.html       ✅ (v1.0 🆕)
│   ├── delivery-settlements.html  ⏳
│   ├── registration-requests.html ✅
│   └── profile.html               ⏳
│
├── 📁 cashier/
│   ├── home.html                  ⏳
│   ├── sales.html                 ⏳
│   ├── inventory.html             ⏳
│   ├── purchases.html             ⏳
│   └── barcode-scanner.html       ⏳
│
├── 📁 customer/
│   ├── profile.html               ⏳
│   ├── orders.html                ⏳ (تحديث زر تأكيد الاستلام)
│   ├── invoices.html              ⏳
│   └── balance.html               ✅
│
├── 📁 delivery/                   ✅ كل الصفحات
│   ├── home.html                  ✅
│   ├── orders.html                ✅
│   ├── available.html             ✅
│   ├── order-details.html         ✅
│   ├── collections.html           ✅
│   └── profile.html               ✅
│
├── 📄 الصفحات العامة:
│   ├── index.html                 ✅
│   ├── store-wholesale.html       ✅
│   ├── store-retail.html          ✅
│   ├── categories.html            ✅
│   ├── category-products.html     ✅
│   ├── brand-products.html        ✅
│   ├── offers.html                ✅
│   ├── discounts.html             ✅
│   ├── cart.html                  ✅
│   ├── checkout.html              ✅ (v4.0)
│   ├── order-success.html         ✅ (v2.0)
│   ├── product-details.html       ✅
│   ├── login.html                 ✅ (v3.0)
│   ├── customer-register.html     ✅
│   ├── customer-login.html        ✅
│   ├── trader-login.html          ✅
│   ├── cashier-login.html         ✅
│   ├── delivery-login.html        ✅
│   ├── customer-home.html         ⏳
│   ├── trader-home.html           ⏳
│   ├── tracking.html              ✅
│   ├── wishlist.html              ✅
│   ├── notifications.html         ✅
│   ├── support.html               ✅
│   ├── about.html                 ✅
│   ├── privacy-policy.html        ✅
│   ├── shipping-policy.html       ✅
│   ├── exchange-policy.html       ✅
│   ├── terms.html                 ✅
│   ├── faq.html                   ✅
│   └── register-guide.html        ✅
│
├── 📁 worker/                     🆕 (Cloudflare Worker)
│   └── awlad-shalaan-invoice-worker.js  🆕 (v1.0)
│
├── CONSTITUTION.md
└── README.md
```

---

## 🗄️ الجزء الحادي والعشرون: كولكشنز Firestore (48 كولكشن)

| الكولكشن | الوصف |
|----------|-------|
| `admins`, `cashiers`, `customers`, `users` | المستخدمين |
| `products`, `categories`, `brands` | المنتجات |
| `cart`, `wishlist`, `orders`, `invoices` | التجارة |
| `suppliers`, `purchases`, `cashbox`, `daily_sales` | مالي |
| `branches`, `branch_inventory` | فروع |
| `ranks`, `levels`, `rewards` | تحفيز |
| `notifications`, `customer_notifications`, `admin_notifications` | إشعارات |
| `activityLog`, `quotes`, `news`, `ads`, `slider` | محتوى |
| `barcode_scans`, `custom_sections`, `site_content`, `partners` | إضافي |
| `trader_lookup`, `delivery_lookup` | lookup |
| `delivery_agents`, `delivery_collections` | توصيل |
| `financial_notifications`, `support_tickets`, `public_stats` | متنوع |
| `privacy_sections`, `shipping_sections`, `exchange_sections`, `terms_sections`, `faq_sections` | محتوى قانوني |
| `registration_requests` | تسجيل |
| **🆕 `invoice_archives`** | أرشيف JSON للفواتير |

**الإجمالي:** 48 كولكشن

---

## 🚚 الجزء الثاني والعشرون: أسعار الشحن

### الجملة:
| المدينة | السعر | مجاني عند |
|---------|-------|-----------|
| طنطا | 125 | 5000 |
| المنصورة | 125 | 5000 |
| المحلة | 50 | 2000 |

### القطاعي:
| المنطقة | السعر | مجاني عند |
|---------|-------|-----------|
| الرجبي، أبو شاهين | 25 | 2500 |
| السبع بنات، الجمهورية، سكة زفتى، الشعبية، الشعراوي، العلو، الشون، المعهد الديني، شارع 10، البندر، المشحمة، أبو را���ي | 35 | 2500 |
| الزراعة، أبو علي | 45 | 2500 |
| كفر حجازي | 50 | 2500 |

---

## 🎨 الجزء الثالث والعشرون: نظام التصميم

```css
:root {
  --navy: #1a2a4a;   --navy-light: #2a3f6a;   --navy-dark: #0f1a2e;
  --gold: #c9a84c;   --gold-light: #e8d5a3;   --gold-dark: #b8942a;
  --white: #ffffff;  --ddd: #0088FC;
  --success: #22c55e; --danger: #ef4444; --warning: #f59e0b; --info: #3b82f6;
  --del-green-1: #064e3b; --del-green-2: #047857;
  --del-green-3: #059669; --del-green-light: #10b981;
}
```

---

## 📚 الجزء الرابع والعشرون: المكتبات

| المكتبة | الاستخدام |
|---------|-----------|
| Firebase SDK 9.22.0 | DB + Auth |
| Font Awesome 6.5.0 | الأيقونات |
| Tajawal | الخط |
| browser-image-compression | ضغط الصور |
| PDF.js | قراءة PDF |
| Gemini API | استخراج ذكي |
| html5-qrcode | باركود |
| JsBarcode | توليد باركود |
| **html2canvas 1.4.1** 🆕 | تحويل HTML لصورة |
| **jsPDF 2.5.1** 🆕 | توليد PDF |

---

# 🆕 الأجزاء الجديدة في v15.0

## 🖨️ الجزء الثاني والثلاثون: نظام الطباعة الموحد

### الملفات:
- `assets/css/invoice-print.css` — ستايل A4 موحد
- `assets/js/invoice-print.js` (v1.1) — منطق الطباعة والمعاينة
- `assets/js/invoice-storage.js` (v1.0) — الربط مع Cloudflare Worker

### الاستخدام في أي صفحة:

```html
<!-- ترتيب تحميل صارم -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="../assets/js/invoice-storage.js"></script>  <!-- قبل invoice-print -->
<script src="../assets/js/invoice-print.js"></script>     <!-- الأخير -->
```

```javascript
// معاينة
InvoicePrint.preview(order);

// طباعة مباشرة
InvoicePrint.print(order);

// طباعة عدة أوردرات
InvoicePrint.printAll(orders);

// حفظ PDF → رفع على B2
InvoicePrint.saveAsPdf(order).then(r => {
  console.log('key:', r.key);  // خزّنها في Firestore
});
```

### أنواع المستخدمين على الفاتورة:

| النوع | الشرط | البادج |
|-------|-------|--------|
| `retail_cash` | `storeType: 'retail'` | عميل نقدي |
| `trader_cash` | `storeType: 'wholesale'` + `businessType: 'cash'` | تاجر نقدي |
| `trader_credit` | `storeType: 'wholesale'` + `businessType: 'credit'` | تاجر أجل |
| `guest` | `isGuest: true` | زائر |

### بيانات المندوب على الفاتورة:
- تظهر لكل الطلبات لو موجود `deliveryAgentName`
- **اسم المندوب + هاتفه + المركبة (سيارة/موتوسيكل/دراجة)**

### أحداث:
- `window.dispatchEvent(new CustomEvent('invoice-uploaded', { detail: {...} }))` بعد كل رفع ناجح

---

## 🔐 الجزء الثالث والثلاثون: Cloudflare Worker + Backblaze B2

### المكونات:

| المكون | الغرض |
|--------|-------|
| **Cloudflare Worker** | حماية المفاتيح + توقيع Presigned URLs |
| **Backblaze B2** | تخزين PDFs بأمان (خاص) |
| **Frontend Token** | مصادقة إضافية للـ Worker |

### إعدادات Worker:

```
URL: https://awlad-shalaan-invoice-worker.awladsh3laan.workers.dev
Secrets: B2_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET, B2_ENDPOINT, B2_REGION, FRONTEND_TOKEN
```

### Endpoints:

| Endpoint | Method | الغرض |
|----------|--------|-------|
| `/health` | GET | فحص الصحة |
| `/sign-upload` | POST | رابط رفع مؤقت (10 دقائق) |
| `/sign-view` | POST | رابط عرض مؤقت (ساعة — 7 أيام حد أقصى) |
| `/delete` | POST | حذف ملف |

### نمط الحماية:
```
FRONTEND_TOKEN في Header X-Frontend-Token
+ توقيع HMAC-SHA256 (AWS Sig V4)
```

### الاستخدام:

```javascript
// رفع PDF
const result = await InvoiceStorage.uploadPdf(blob, orderNo, customerName);
// → { ok: true, key: 'invoices/2026/10/xxx.pdf', size, uploadedAt }

// فتح PDF
await InvoiceStorage.openInvoice(key);

// تنزيل
await InvoiceStorage.downloadInvoice(key, 'invoice.pdf');
```

### ⚠️ مصير B2 في v15.0:

**الاستراتيجية الجديدة:**
- **الأساسي:** حفظ JSON في Firestore (`orders/{id}.invoice`)
- **الاحتياطي:** PDF في B2 عند الحاجة فقط (تصدير، أرشفة سنوية)
- **السبب:** توفير مساحة، سرعة، ومرونة

---

## 📲 الجزء الرابع والثلاثون: PWA (الموقع كتطبيق موبايل)

### المفهوم:
تحويل الموقع إلى **تطبيق فعلي** على الموبايل (Android + iOS) يمكن تثبيته من المتصفح بدون متجر.

### الملفات المطلوبة:

#### 1. `manifest.json` (جذر المشروع)

```json
{
  "name": "أولاد شعلان جملة",
  "short_name": "أولاد شعلان",
  "description": "متجر أولاد شعلان للمنظفات والورقيات - جملة وقطاعي",
  "start_url": "/gomla/",
  "scope": "/gomla/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#1a2a4a",
  "theme_color": "#1a2a4a",
  "lang": "ar",
  "dir": "rtl",
  "icons": [
    { "src": "/gomla/assets/icons/icon-72.png",  "sizes": "72x72",   "type": "image/png" },
    { "src": "/gomla/assets/icons/icon-96.png",  "sizes": "96x96",   "type": "image/png" },
    { "src": "/gomla/assets/icons/icon-128.png", "sizes": "128x128", "type": "image/png" },
    { "src": "/gomla/assets/icons/icon-144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "/gomla/assets/icons/icon-152.png", "sizes": "152x152", "type": "image/png" },
    { "src": "/gomla/assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/gomla/assets/icons/icon-384.png", "sizes": "384x384", "type": "image/png" },
    { "src": "/gomla/assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "screenshots": [
    { "src": "/gomla/assets/icons/screen-mobile.png", "sizes": "1080x1920", "type": "image/png", "form_factor": "narrow" }
  ],
  "shortcuts": [
    { "name": "المتجر القطاعي", "url": "/gomla/store-retail.html", "icon": "/gomla/assets/icons/icon-96.png" },
    { "name": "المتجر الجملة", "url": "/gomla/store-wholesale.html", "icon": "/gomla/assets/icons/icon-96.png" },
    { "name": "طلباتي", "url": "/gomla/customer/orders.html", "icon": "/gomla/assets/icons/icon-96.png" }
  ]
}
```

#### 2. `service-worker.js` (جذر المشروع)

```javascript
/* ============================================================
   📲 Service Worker — أولاد شعلان PWA
   Version: 1.0  |  2026-10-18
   ============================================================ */

const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/gomla/',
  '/gomla/index.html',
  '/gomla/offline.html',
  '/gomla/assets/css/style.css',
  '/gomla/assets/css/invoice-print.css',
  '/gomla/assets/js/main.js',
  '/gomla/assets/js/firebase-config.js',
  '/gomla/assets/js/invoice-print.js',
  '/gomla/assets/js/invoice-storage.js',
  '/gomla/assets/icons/icon-192.png',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => !k.endsWith(CACHE_VERSION))
            .map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // تجاهل Firebase / Worker / الخارج
  if (
    url.hostname.includes('firebase') ||
    url.hostname.includes('firebaseio') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('workers.dev') ||
    url.hostname.includes('backblazeb2') ||
    request.method !== 'GET'
  ) {
    return; // default browser behavior
  }

  // الصور: Cache First
  if (request.destination === 'image' || url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          const clone = response.clone();
          caches.open(IMAGE_CACHE).then(cache => cache.put(request, clone));
          return response;
        }).catch(() => caches.match('/gomla/assets/icons/icon-192.png'));
      })
    );
    return;
  }

  // HTML / JS / CSS: Network First
  event.respondWith(
    fetch(request)
      .then(response => {
        const clone = response.clone();
        caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request).then(cached => {
        return cached || caches.match('/gomla/offline.html');
      }))
  );
});

// Message from client (تحديث cache)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
```

#### 3. `pwa-register.js` (assets/js/)

```javascript
/* ============================================================
   📲 PWA Registration — أولاد شعلان
   ============================================================ */

(function () {
  'use strict';

  // سجل Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/gomla/service-worker.js')
        .then(reg => {
          console.log('✅ Service Worker registered:', reg.scope);
        })
        .catch(err => {
          console.warn('❌ Service Worker registration failed:', err);
        });
    });
  }

  // PWA Install Prompt
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installed');
    deferredPrompt = null;
    hideInstallButton();
  });

  function showInstallButton() {
    const btn = document.getElementById('pwa-install-btn');
    if (btn) btn.style.display = 'flex';
  }

  function hideInstallButton() {
    const btn = document.getElementById('pwa-install-btn');
    if (btn) btn.style.display = 'none';
  }

  window.installPWA = async function () {
    if (!deferredPrompt) {
      if (typeof showToast === 'function') {
        showToast('لتثبيت التطبيق: افتح القائمة → "تثبيت التطبيق"', 'info');
      }
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('PWA install outcome:', outcome);
    deferredPrompt = null;
    hideInstallButton();
  };

  // تحقق إن التطبيق مفتوح كـ PWA (standalone)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                       window.navigator.standalone === true;
  if (isStandalone) {
    document.documentElement.classList.add('pwa-standalone');
  }
})();
```

#### 4. `offline.html` (جذر المشروع)

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>لا يوجد إنترنت — أولاد شعلان</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;800&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Tajawal', sans-serif;
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #0f1a2e 0%, #1a2a4a 50%, #2a3f6a 100%);
    color: white; padding: 24px; text-align: center;
  }
  .box {
    max-width: 400px;
    background: rgba(255,255,255,.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 20px;
    padding: 32px 24px;
  }
  .icon {
    font-size: 4rem; color: #c9a84c;
    margin-bottom: 20px;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50% { opacity: .6; transform: scale(1.1); }
  }
  h1 { font-size: 1.5rem; margin-bottom: 12px; }
  p { color: rgba(255,255,255,.7); line-height: 1.7; margin-bottom: 24px; }
  button {
    background: #c9a84c; color: #0f1a2e;
    border: none; padding: 12px 24px;
    border-radius: 10px; font-family: inherit;
    font-weight: 800; font-size: 1rem; cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px;
  }
  button:active { transform: scale(.97); }
</style>
</head>
<body>
  <div class="box">
    <div class="icon"><i class="fas fa-wifi-slash"></i></div>
    <h1>لا يوجد اتصال بالإنترنت</h1>
    <p>
      تحقق من اتصالك بالشبكة، ثم أعد المحاولة.<br>
      الصفحات التي زرتها سابقاً متاحة بدون إنترنت.
    </p>
    <button onclick="location.reload()">
      <i class="fas fa-redo"></i> إعادة المحاولة
    </button>
  </div>
</body>
</html>
```

#### 5. إضافات إلى `<head>` في كل صفحة

```html
<!-- PWA Meta -->
<link rel="manifest" href="/gomla/manifest.json">
<meta name="theme-color" content="#1a2a4a">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="أولاد شعلان">
<link rel="apple-touch-icon" href="/gomla/assets/icons/icon-192.png">
```

#### 6. تحميل `pwa-register.js` في كل صفحة

```html
<!-- قبل إغلاق </body> -->
<script src="/gomla/assets/js/pwa-register.js"></script>
```

#### 7. زر "تثبيت التطبيق" (اختياري في الهيدر)

```html
<button id="pwa-install-btn" onclick="installPWA()" style="display:none;">
  <i class="fas fa-download"></i>
  <span>تثبيت التطبيق</span>
</button>
```

### ملاحظات مهمة:

| النقطة | التفاصيل |
|--------|----------|
| **HTTPS** | لازم (GitHub Pages يدعمه تلقائياً) |
| **iOS** | التثبيت يدوي عبر Safari → Share → Add to Home Screen |
| **Android** | يظهر تلقائياً أو من قائمة Chrome |
| **Firebase** | لا يُخزَّن مؤقتاً (بيانات حية) |
| **Backblaze B2** | لا يُخزَّن مؤقتاً (روابط مؤقتة) |

---

## 🐛 الجزء الخامس والثلاثون: الأخطاء المعروفة والمطلوب إصلاحها

### المرحلة 2.5.1 — إصلاحات عاجلة

| # | الخطأ | التفاصيل | الحل |
|---|-------|----------|------|
| **B1** | **الشحن = 0 بعد التعديل** | في `admin/orders.html` v4.0، لما يوصل المستخدم لخطوة 5 (المراجعة)، حقل `editShippingCost` مش موجود في الصفحة → القيمة بترجع `0` | حفظ القيم في متغيرات عند الخروج من الخطوة 2 |
| **B2** | **طلب الزائر = "منتج" + 0.00** | سلة الزائر بتخزن حقول مختلف عن checkout (اسم `name` بدل `productName`، `price` بدل `retailPrice`) | قراءة مرنة في checkout + توحيد بنية السلة |
| **B3** | **مفيش إمكانية إنشاء طلب** | الزائر يقدر يضيف للسلة لكن عند `placeOrder` بيفشل | فحص: (1) Firestore Rules، (2) دالة `placeOrder`، (3) اسم collection |
| **B4** | **أخطاء غير متفاعلة** | عناصر مش بتشتغل أو في رسائل console errors | تشخيص بعد رفع ملفات: `checkout.html`, `cart.html`, `main.js`, `firestore.rules` |

### متطلبات إصلاح (v15.0):

#### B1 — إصلاح الشحن:
```javascript
// في admin/orders.html
let editShippingDraft = { cost: 0, isFree: false, date: '', time: '' };

// عند الخروج من الخطوة 2 (goToStep):
if (editingStep === 2 && nextStep === 3) {
  editShippingDraft.cost = parseFloat(document.getElementById('editShippingCost')?.value) || 0;
  editShippingDraft.isFree = document.getElementById('editFreeShipping')?.checked || false;
  editShippingDraft.date = document.getElementById('editDeliveryDate')?.value || '';
  editShippingDraft.time = document.getElementById('editDeliveryTime')?.value || '';
}

// عند استخدامها في submitEditChanges:
const shipCost = editShippingDraft.isFree ? 0 : editShippingDraft.cost;
```

#### B2 — إصلاح بيانات الزائر:
```javascript
// في checkout.html — قراءة مرنة
const normalizeItem = (item) => ({
  productId: item.productId || item.id,
  productName: item.productName || item.name || 'منتج',
  quantity: Number(item.quantity || item.qty || 1),
  unit: item.unit || 'قطعة',
  price: Number(item.retailPrice || item.wholesalePrice || item.price || 0),
  imageUrl: item.imageUrl || item.image || ''
});
```

#### B3 — فحص إنشاء الطلب:
1. تحقق من `firestore.rules`:
```javascript
match /orders/{orderId} {
  allow create: if request.auth != null
                || request.resource.data.isGuest == true;
}
```
2. تحقق من `placeOrder` في checkout.html
3. تحقق من `db.collection('orders').add()` بترجع `docRef`

---

## 🔄 الجزء السادس والثلاثون: تعديل Workflow الموافقة (v15.0)

### 🔑 القاعدة الجديدة:

**فقط تعديلات المنتجات تحتاج موافقة العميل — الباقي إشعار فقط.**

### مقارنة:

| التغيير | الحالة القديمة | الحالة الجديدة (v15.0) |
|---------|----------------|-------------------------|
| **المنتجات** (إضافة/حذف/كميات/أسعار) | `awaiting_approval` + موافقة | `awaiting_approval` + موافقة ⚠️ |
| **الشحن** | موافقة | **إشعار فقط** + تحديث مباشر ✅ |
| **التاريخ/الوقت** | موافقة | **إشعار فقط** + تحديث مباشر ✅ |
| **المندوب** | موافقة | **إشعار فقط** + تحديث مباشر ✅ |
| **الملاحظات** | موافقة | **إشعار فقط** ✅ |

### التنفيذ في `submitEditChanges`:

```javascript
// كشف التغييرات
const oldItemsStr = JSON.stringify((editingOrder.items || []).map(i => ({ pid: i.productId, q: i.quantity, p: i.price })));
const newItemsStr = JSON.stringify(finalItems.map(i => ({ pid: i.productId, q: i.quantity, p: i.price })));
const itemsChanged = oldItemsStr !== newItemsStr;
const shippingChanged = ...;
const dateChanged = ...;
const agentChanged = ...;

// 🔑 القاعدة الجديدة
if (itemsChanged) {
  // يحتاج موافقة
  updateData.status = 'awaiting_approval';
  updateData.pendingChanges = { hasChanges: true, ... };
} else {
  // إشعار فقط
  updateData.status = editingOrder.status; // نفس الحالة
  updateData.lastModifiedAt = now;
  updateData.notificationSent = true;
}

// في الحالتين: أرسل إشعار
if (notify) {
  const notifType = itemsChanged ? 'order_updated' : 'order_modified';
  const notifBody = itemsChanged
    ? `تم تعديل منتجات الطلب #${orderNo} — يحتاج موافقتك`
    : `تم تعديل بيانات طلبك #${orderNo} — لا حاجة لاتخاذ إجراء`;

  await db.collection('customer_notifications').add({
    userId: editingOrder.customerId,
    type: notifType,
    title: itemsChanged ? 'تعديلات تحتاج موافقة' : 'تم تحديث طلبك',
    body: notifBody,
    data: { orderId, changes: { itemsChanged, shippingChanged, dateChanged, agentChanged } },
    read: false,
    createdAt: now
  });
}
```

---

## 💵 الجزء السابع والثلاثون: تأكيد استلام المبلغ (Workflow جديد)

### الفكرة:
عندما الأدمن/أدمن بلص/سوبر أدمن يضغط "تأكيد استلام المبلغ"، يتم **كل شيء دفعة واحدة**.

### الشروط (قبل ظهور الزر):
- ✅ `deliveryStatus === 'delivered'`
- ✅ `confirmedByCustomer === true`
- ✅ `paymentStatus !== 'paid'`

### عند التأكيد — يُنفَّذ التالي:

```javascript
async function submitConfirmPayment(orderId) {
  const o = findOrderById(orderId);
  const now = firebase.firestore.FieldValue.serverTimestamp();

  const batch = db.batch();

  // 1) تحديث الطلب
  batch.update(db.collection('orders').doc(orderId), {
    paymentStatus: 'paid',
    paid: o.total,
    remaining: 0,
    status: 'delivered',        // ← تحويل لحالة "تم التسليم"
    cashHandedToAdmin: true,
    cashHandedAt: now,
    cashHandedToAdminBy: currentAdminId,
    paymentConfirmedAt: now,
    paymentConfirmedBy: currentAdminId,
    updatedAt: now
  });

  // 2) إضافة في الصندوق (cashbox) — بند "أوردرات دليفري"
  const cashboxRef = db.collection('cashbox').doc();
  batch.set(cashboxRef, {
    type: 'income',
    category: 'delivery_orders',  // ← بند أوردرات دليفري
    source: 'order_payment',
    orderId: orderId,
    orderNumber: o.orderNo,
    customerName: o.customerName,
    amount: o.subtotal,           // ← فلوس المنتجات فقط
    shippingAmount: o.shippingCost, // ← للمندوب
    totalAmount: o.total,
    paymentMethod: o.paymentMethod,
    deliveryAgentId: o.deliveryAgentId,
    deliveryAgentName: o.deliveryAgentName,
    recordedBy: currentAdminId,
    recordedAt: now,
    notes: `استلام مبلغ طلب #${o.orderNo}`
  });

  // 3) حفظ الفاتورة كـ JSON في Firestore
  const invoiceData = {
    orderNo: o.orderNo,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    customerAddress: o.customerAddress,
    items: o.items,
    subtotal: o.subtotal,
    shippingCost: o.shippingCost,
    isFreeShipping: o.isFreeShipping,
    total: o.total,
    userType: detectUserType(o),  // 'retail_cash' | 'trader_cash' | 'trader_credit' | 'guest'
    paymentMethod: o.paymentMethod,
    paymentStatus: 'paid',
    paidAt: now,
    paidBy: currentAdminId,
    deliveryAgentName: o.deliveryAgentName,
    deliveryVehicle: o.deliveryVehicle,
    generatedAt: now
  };

  batch.update(db.collection('orders').doc(orderId), {
    invoice: invoiceData,
    invoiceSavedAt: now
  });

  // 4) تسجيل في delivery_collections (تصفية)
  const collectionRef = db.collection('delivery_collections').doc();
  batch.set(collectionRef, {
    deliveryAgentId: o.deliveryAgentId,
    deliveryAgentName: o.deliveryAgentName,
    orderId: orderId,
    orderNumber: o.orderNo,
    amount: o.total,
    type: 'settle',
    method: o.paymentMethod,
    status: 'confirmed',
    confirmedBy: currentAdminId,
    createdAt: now
  });

  await batch.commit();

  // 5) إشعارات (خارج batch لأنها كولكشن مختلفة)
  try {
    await db.collection('customer_notifications').add({
      userId: o.customerId,
      type: 'payment_confirmed',
      title: 'تم تأكيد دفعك',
      body: `تم استلام مبلغ ${o.total.toFixed(2)} ج.م لطلب #${o.orderNo}`,
      data: { orderId },
      read: false,
      createdAt: now
    });
  } catch (e) { console.warn(e); }

  try {
    await db.collection('admin_notifications').add({
      userId: o.deliveryAgentId,
      type: 'settlement_confirmed',
      title: 'تمت التصفية',
      body: `تم استلام مبلغ طلب #${o.orderNo}`,
      data: { orderId },
      read: false,
      createdAt: now
    });
  } catch (e) { console.warn(e); }

  showToast('تم تأكيد استلام المبلغ وإضافته للصندوق', 'success');
}
```

### 📦 مصير B2 في هذا النظام:

| السيناريو | الاستخدام |
|-----------|-----------|
| **كل طلب عادي** | JSON في Firestore فقط (2-5 KB) |
| **تصدير PDF عند الطلب** | يرفع على B2 مؤقتاً |
| **أرشفة سنوية** | PDFs لكل الطلبات → B2 |
| **نسخ احتياطي** | JSON كامل → B2 شهرياً |

**السبب:**
- 1800 طلب/شهر × 400 KB = **720 MB** ← 10 GB في سنة تقريباً
- JSON: 1800 × 5 KB = **9 MB** فقط
- B2 يفضل للطوارئ والأرشيف

### مزايا حفظ JSON:

| ✅ ميزة | التفاصيل |
|---------|----------|
| **صغير جداً** | 2-5 KB لكل طلب |
| **سريع** | قراءة فورية من Firestore |
| **قابل للبحث** | Firestore queries تعمل عليه |
| **قابل لإعادة توليد الطباعة** | `InvoicePrint.print(order)` يشتغل عادي |
| **مرن** | تقدر تصدّر PDF في أي وقت لو احتجت |

---

## 🚀 الجزء الثامن والثلاثون: المراحل التنفيذية (v15.0)

### ✅ مكتمل:
- المرحلة صفر: التنظيف — 100%
- المرحلة 1: الصفحة الرئيسية والمتاجر — 100%
- المرحلة 2: صفحات العملاء — 85%
- المرحلة 2.5: الموصلين + الدفع — 95%
  - ✅ `admin/orders.html` v4.0
  - ✅ `admin/assign-delivery.html` v1.0
  - ✅ نظام الطباعة الموحد
  - ✅ Cloudflare Worker + B2
  - ✅ PWA Files
- المرحلة 6: المحتوى القانوني — 100%
- المرحلة 7: دليل التسجيل — 100%

### 🚧 قيد التنفيذ (المرحلة 2.5.1 — إصلاح الأخطاء):
- ⏳ B1: إصلاح الشحن = 0
- ⏳ B2: إصلاح بيانات الزائر
- ⏳ B3: تفعيل إنشاء الطلب
- ⏳ B4: الأخطاء الغير متفاعلة

### ⏳ متبقي:
- `admin/delivery-settlements.html`
- `admin/cashbox.html` (بند أوردرات دليفري)
- `customer/orders.html` (زر تأكيد الاستلام)
- تحديث `admin/orders.html` (Workflow الموافقة الجديد — الجزء 36)
- المرحلة 3: لوحة التحكم — 0%
- المرحلة 4: الأنظمة المالية — 0%
- المرحلة 5: الأنظمة التشغيلية — 0%

---

## 🔑 الجزء التاسع والثلاثون: المفاتيح والإعدادات

```javascript
// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCdU3HadKWtzKtTAO9x7mcVPq6eodTqPzA",
  authDomain: "awlad-shalaan-wholesale.firebaseapp.com",
  projectId: "awlad-shalaan-wholesale",
  storageBucket: "awlad-shalaan-wholesale.firebasestorage.app",
  messagingSenderId: "390602001768",
  appId: "1:390602001768:web:05ec185f34ff0b5f7c1add"
};

// Backblaze B2
const B2_CONFIG = {
  endpoint: 's3.us-east-005.backblazeb2.com',
  bucket: 'awlad-shalaan-invoices',
  region: 'us-east-005',
  keyId: '00546f2cb06160f0000000002'
  // applicationKey محفوظ في Cloudflare Worker Secrets
};

// Cloudflare Worker
const WORKER_URL = 'https://awlad-shalaan-invoice-worker.awladsh3laan.workers.dev';
const FRONTEND_TOKEN = '[في invoice-storage.js]';

// Other Keys
const IMGBB_API_KEY = "cb056b7fd83c81129d5468c5d03287b4";
const GEMINI_API_KEY = "AQ.Ab8RN6J_44fb2fdP2YWWxwq0aNnG7DXJnSv3O8whicffxAj_g";
const WHATSAPP_NUMBER = "01068385028";
const PAYMENT_ACCOUNT = "01068385028";
const SUPPORT_EMAIL = "awladsh3laan@gmail.com";
```

---

## 📊 الجزء الأربعون: إحصائيات المشروع (v15.0)

| المقياس | العدد |
|---------|------|
| الصفحات المكتملة | **~60** |
| الصفحات المتبقية (المرحلة 2.5) | **3** |
| صفحات المرحلة 3-5 | **~30** |
| الكولكشنز في Firestore | **48** |
| الأنظمة الكاملة | **52** |
| نسبة الإنجاز الكلي | **~75%** |

| المرحلة | الحالة |
|---------|--------|
| المرحلة صفر | ✅ 100% |
| المرحلة 1 | ✅ 100% |
| المرحلة 2 | 🚧 85% |
| المرحلة 2.5 | 🚧 95% |
| **المرحلة 2.5.1 (إصلاحات)** | 🚧 0% ← **التالي** |
| المرحلة 3 | ⏳ 0% |
| المرحلة 4 | ⏳ 0% |
| المرحلة 5 | ⏳ 0% |
| المرحلة 6 | ✅ 100% |
| المرحلة 7 | ✅ 100% |

---

## 🎯 الجزء الحادي والأربعون: الأنظمة الكاملة (52 نظام)

(47 نظام من v14.0 — كلها محفوظة)

**+ الإضافات الجديدة (v15.0):**
| # | النظام | الحالة |
|---|--------|--------|
| 48 | **نظام الطباعة الموحد (InvoicePrint)** | ✅ |
| 49 | **الرفع الآمن على B2 عبر Worker** | ✅ |
| 50 | **إدارة المندوبين المركزي (assign-delivery)** | ✅ |
| 51 | **PWA — تطبيق موبايل فعلي** | ✅ (ملفات) |
| 52 | **حفظ JSON للفواتير في Firestore** | ✅ (موثق — يطبق في 2.5.1) |

---

## 🎯 الجزء الثاني والأربعون: تعليمات المحادثة الجديدة

```
عند بدء محادثة جديدة:
1. ارفع CONSTITUTION.md (هذا الملف — v15.0)
2. ارفع آخر ملفات عملنا عليها
3. اكتب:
   "أنا أعمل على مشروع أولاد شعلان جملة.
   راجع الدستور v15.0 أولاً.
   آخر ملف: [اسم الملف]
   المرحلة: [رقم المرحلة]
   أكمل من حيث توقفنا."
```

---

## 🚀 الجزء الثالث والأربعون: الخطوة القادمة

### الأولوية العاجلة (المرحلة 2.5.1):

**الترتيب المقترح:**

1. 🐛 **B1-B4: إصلاح الأخطاء الأربعة**
   - إرسال: `checkout.html`, `cart.html`, `main.js`, `firestore.rules`
   - تشخيص + إصلاح
   - اختبار كامل على الزائر + العميل + التاجر

2. 🔄 **تطبيق Workflow الموافقة الجديد** على `admin/orders.html`
   - المنتجات فقط تحتاج موافقة
   - الباقي إشعار فقط

3. 💵 **تطبيق Workflow تأكيد الدفع** على `admin/orders.html`
   - Cashbox entry + JSON invoice + status: delivered

### بعد ذلك:

4. ⏳ `admin/delivery-settlements.html`
5. ⏳ تحديث `admin/cashbox.html` (بند أوردرات دليفري)
6. ⏳ تحديث `customer/orders.html` (زر تأكيد الاستلام)

### ثم:

7. المرحلة 3 (لوحة التحكم — 9 صفحات)
8. المرحلة 4 (الأنظمة المالية — 5 صفحات)
9. المرحلة 5 (الأنظمة التشغيلية — 11 صفحة)

---

## ✅ الجزء الرابع والأربعون: القرارات النهائية (v15.0)

1-60. **كل القرارات السابقة محفوظة**

**+ الإضافات الجديدة (v15.0):**
61. **نظام طباعة موحد** في `invoice-print.js` v1.1
62. **Cloudflare Worker** كـ proxy آمن لـ B2 (لا مفاتيح في الفرونت)
63. **Backblaze B2** للطوارئ والأرشيف فقط
64. **JSON في Firestore** للفواتير العادية (الأساسي)
65. **PWA كامل** — الموقع يشتغل كتطبيق موبايل
66. **Service Worker** بـ Network First للـ HTML/JS و Cache First للصور
67. **إصلاح Bug B1** — الشحن بعد التعديل
68. **إصلاح Bug B2** — بيانات الزائر
69. **إصلاح Bug B3** — إنشاء الطلب
70. **تعديلات المنتجات فقط تحتاج موافقة** — الباقي إشعار
71. **تأكيد الدفع = Cashbox + JSON invoice + status: delivered**
72. **بيانات المندوب على الفاتورة** لكل الطلبات (سيارة / موتوسكل / دراجة)
73. **48 كولكشن** (زيادة `invoice_archives`)
74. **صفحة `assign-delivery.html`** v1.0
75. **حماية إضافية** لكل صفحات الطباعة (تحقق من الصلاحية قبل الطباعة)

---

## 📝 ملاحظات نهائية

1. **كل الإيموجي ممنوعة** — Font Awesome فقط
2. **حماية الأدوار مطبقة** في كل صفحة
3. **الجلسات المتعددة** (4 مفاتيح: admin, customer, cashier, deliveryData)
4. **الموصلون يدخلون بالكود فقط** `DEL-XXXXX@#$`
5. **التجار يدخلون بالكود فقط** `MHL-XXXX`
6. **الإجمالي دائمًا ينتهي بـ 0 أو 5**
7. **فلوس الشحن للموصل، فلوس المنتجات للصندوق**
8. **أدمن بلص يدير الموصلين + يراجع طلبات التسجيل**
9. **السوبر أدمن فقط يدير المحتوى والشركاء والإعدادات**
10. **تصميم login موحّد (عمودين + صورة + أنيميشنات)**
11. **🆕 نظام الطباعة موحد** — كل الصفحات تستخدم نفس الأسلوب
12. **🆕 B2 للطوارئ فقط** — JSON هو الأساسي
13. **🆕 PWA = تطبيق حقيقي** على الموبايل
14. **🆕 تعديلات المنتجات فقط** تحتاج موافقة
15. **🆕 تأكيد الدفع = Cashbox + JSON + status: delivered**

---

## ✅ هذا هو المرجع الرسمي الكامل للمشروع (v15.0)

**آخر تحديث:** 2026-10-18
**الإصدار:** 15.0
**الحالة:** المرحلة 2.5.1 — إصلاح الأخطاء + تطبيق Workflow الجديد

**عند بدء محادثة جديدة:**
- ارفع هذا الملف أولاً
- ارفع آخر ملفات عملنا عليها
- أخبرني بالخطوة القادمة

---

**دي النسخة الكاملة من الدستور v15.0 ✅**

**قولي دلوقتي:**
- **"احفظ وأبدأ"** → ابدأ مباشرة في المرحلة 2.5.1
- **"فيه تعديل"** → عدّل أي جزء
- **"ابعت الملفات"** → ابدأ في تشخيص B1-B4
```

---

## 📋 ملخص ما تم إضافته في v15.0

| # | القسم | النوع |
|---|-------|-------|
| 1 | **الجزء 32** — نظام الطباعة الموحد | 🆕 جديد كامل |
| 2 | **الجزء 33** — Cloudflare Worker + B2 | 🆕 جديد كامل |
| 3 | **الجزء 34** — PWA (تطبيق موبايل) | 🆕 جديد كامل |
| 4 | **الجزء 35** — الأخطاء B1-B4 | 🆕 جديد كامل |
| 5 | **الجزء 36** — Workflow الموافقة الجديد | 🆕 جديد كامل |
| 6 | **الجزء 37** — Workflow تأكيد الدفع | 🆕 جديد كامل |
| 7 | هيكل الملفات | ✏️ محدّث (PWA + worker + icons) |
| 8 | 48 كولكشن (+ `invoice_archives`) | ✏️ محدّث |
| 9 | 52 نظام (+ 5 جديد) | ✏️ محدّث |
| 10 | القرارات 61-75 | 🆕 جديد |
| 11 | Timeline | ✏️ محدّث (2.5.1) |

**جاهز للخطوة القادمة:** قولي **"احفظ وأبدأ"** أو **"ابعت الملفات"** عشان نبدأ في B1-B4.
