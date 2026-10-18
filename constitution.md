# 📜 دستور مشروع أولاد شعلان — v17.1 الكامل

```markdown
# 📜 دستور مشروع أولاد شعلان للمنظفات والورقيات
**الإصدار:** 17.1 (Redesign + محرر كرتونة ديناميكي + إدارة تجار كرتونة)
**آخر تحديث:** 2026-10-19
**هذا الملف هو المرجع الوحيد للمشروع**
**⚠️ يُحدَّث بعد كل مرحلة إصلاح**
```

---

## 📌 الجزء 1: معلومات المشروع

| البند | التفاصيل |
|------|----------|
| الاسم | أولاد شعلان للمنظفات والورقيات |
| النوع | متجر إلكتروني + POS كاشير + إدارة فروع + إدارة مخزون + تكامل كرتونة (Gemini + محرر) + PWA |
| الرابط | https://awladsh3laan.github.io/gomla |
| GitHub | https://github.com/awladsh3laan/gomla.git |
| التقنيات | HTML + CSS + Vanilla JS + Firebase (Spark) + ImgBB + 3 fallbacks + Gemini API + Catbox |
| اللغة | العربية (RTL) |
| الخط | Tajawal |
| الأيقونات | Font Awesome فقط — **ممنوع إيموجي في الـ UI** |
| Firebase Plan | **Spark (مجاني) — بدون Cloud Functions، بدون بطاقة ائتمان** |
| Schema Version | **v17.1** |
| Repo | نفس الـ repo مع branch `redesign` |

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

### جدول الصلاحيات v17.1

| الصلاحية | super | admin_plus | admin | cashier | trader | retail | delivery |
|---------|-------|-----------|-------|---------|--------|--------|----------|
| إدارة المنتجات | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| إدارة الطلبات | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| تعيين مندوب | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **تأكيد استلام نقد** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **كتابة cashbox** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **كرتونة (استخراج)** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **كرتونة (تعديل وحفظ)** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **كرتونة (توليد أكواد تجار)** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **إدارة الفروع** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **مبيعات كاشير (إنشاء)** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **مبيعات كاشير (تعديل)** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **فاتورة يدوية (مباشر)** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **فاتورة يدوية (pending)** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **إدارة أسعار الشحن** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| إعدادات النظام | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| توليد أكواد أدمن | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| إدارة المحتوى | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| إدارة العلامات التجارية | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| مراجعة طلبات التسجيل | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| عرض أسعار الجملة | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| عرض أسعار القطاعي | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| الشراء | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

**⚠️ قواعد أساسية:**
- **الموصل** لا يرى إلا صفحات `delivery/*` فقط
- أي محاولة دخول لصفحات الموقع الرئيسي → شاشة "ليس لديك صلاحيات"

---

## 🚪 الجزء 3: نظام الدخول

### طرق الدخول
| المستخدم | الدخول |
|---------|---------|
| عميل | Email + Password |
| تاجر | كود `MHL-XXXX` |
| مندوب | كود `DEL-XXXXX@#$` |
| أدمن/أدمن بلص/سوبر | Email + Password |
| كاشير | Email + Password |

### حماية صفحات الدخول (IIFE)
```javascript
(function protectLoginPage() {
  if (admin || customer || cashier || deliveryData) {
    window.location.replace('/gomla/');
  }
})();
```

### التوجيه حسب الدور
| الدور | الوجهة |
|-------|---------|
| super/admin_plus/admin | `/admin/home.html` |
| wholesale | `/trader/home.html` |
| retail | `/customer/home.html` |
| cashier | `/cashier/home.html` |
| delivery | `/delivery/home.html` |

### المفاتيح المحلية
`admin`, `adminId`, `customer`, `cashier`, `deliveryData`, `deliveryCode`, `saved_trader_code`, `saved_cashier_email`, `saved_customer_email`

### مراقب الجلسات المتعددة
عند تغيير أي مفتاح → Overlay + عدّاد 5 ثواني + تحويل تلقائي.

---

## 🏠 الجزء 4: الصفحة الرئيسية index.html (Redesign)

### 12 سيكشن بالترتيب

#### 1. صورة الترحيب المتحركة
- صورة/فيديو من `site_content.welcome`
- أنيميشن fade-in + parallax

#### 2. نبذة تعريفية
- **الموقع**: 3-4 سطور
- **الشركة**: من `site_content.about`
- Slide-in animation

#### 3. السلايدر
- من `slider` collection
- Auto-play 5s + dots

#### 4. كروت المتاجر (حسب الصلاحية)
| الدور | المتاجر |
|-------|---------|
| guest / retail | متجر قطاعي فقط |
| trader | متجر جملة + قطاعي |
| cashier / admin / admin_plus / super | جملة + قطاعي |
| delivery | **شاشة رفض** |

#### 5. أحدث العروض (Offers)
- **يعرض للـ**: guest, retail, cashier, admin, admin_plus, super
- **مخفي عن**: trader
- **هيدر السيكشن** مع عداد تنازلي
- **رسالة منبثقة** عند الدخول → تنزل تلقائياً داخل السيكشن بعد 7 ثوانٍ
- أنيميشن احترافي (كارد داخل + hover)

#### 6. أحدث الخصومات (Discounts)
- **يعرض للـ**: trader, cashier, admin, admin_plus, super
- **مخفي عن**: guest, retail
- **رسالة منبثقة** 7 ثوانٍ
- نفس الأسلوب الاحترافي

#### 7. الأقسام (عرض أفقي)
- كارت لكل قسم: صورة + اسم
- Scroll أفقي + أنيميشن `dropIn`
- عدّاد المنتجات

#### 8. أحدث المنتجات
- شبكة grid
- **Intersection Observer** — الكارد يظهر عند دخول viewport
- Hover scale 1.05 + رفع ظل

#### 9. سيكشنات مخصصة (custom_sections)

#### 10. العلامات التجارية (Brands)
- **صور رمادية (grayscale 100%)**
- **Hover → colored (grayscale 0)** + scale 1.1
- عرض أفقي

#### 11. تواصل معنا
- واتساب + إيميل + تذكرة دعم

#### 12. Footer

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

### شاشة الموصل الممنوع
`/delivery/blocked.html`:
- كارت تقني عالي المستوى
- Animation خلفية (particles/parallax)
- نص: "ليس لديك صلاحيات عرض أي صفحات من الموقع أو التطبيق إلا صفحاتك الخاصة فقط"
- أزرار: لوحة الموصل / أوردراتي / منطقتي / تحصيلاتي / بياناتي

---

## 📄 الجزء 5: صفحة تفاصيل المنتج

| الدور | يُعرض |
|------|-------|
| super | كل شيء + سعر الشراء + تعديل |
| admin_plus / admin | جملة (وحدة) + قطاعي (قطعة) + مخزون مخزن + مخزون كل فرع + notes + traderNotes |
| wholesale | جملة + قطاعي + هامش ربح + مخزون + traderNotes |
| retail / guest | قطاعي فقط + وصف + براند + تصنيف + مخزون |
| delivery | **لا يصل** |

---

## 🏪 الجزء 6: المتاجر

### store-retail.html
Brand Hero + سلايدر + بحث + أحدث + براندات + عروض + أقسام + جميع المنتجات

### store-wholesale.html
Brand Hero (بني) + سلايدر + بحث + أحدث + براندات + **خصومات** + أقسام + جميع المنتجات + **علامات تجارية**

**حماية**: `delivery` ممنوع → توجيه لـ `/delivery/home.html`

---

## 📂 الجزء 7: الأقسام

- `categories.html`: شبكة أقسام + عدّاد حقيقي
- `category-products.html`: Sticky bar + براندات + فلاتر
- `brand-products.html`: منتجات براند

---

## 🎯 الجزء 8: العروض والخصومات (Schema موحد)

### حقول `products`
```javascript
{
  hasRetailOffer: false,
  retailOfferPrice: 0,
  retailOfferStart: Timestamp|null,
  retailOfferEnd: Timestamp|null,
  
  hasWholesaleDiscount: false,
  wholesaleDiscountPercent: 0,
  wholesaleDiscountStart: Timestamp|null,
  wholesaleDiscountEnd: Timestamp|null,
  
  notes: '',          // للجميع
  traderNotes: ''     // للتجار والإدارة فقط
}
```

**⚠️ توافق خلفي مؤقت**: `hasOffer`/`offerPrice` تُقرأ كـ alias لو `hasRetailOffer` مش موجود.

---

## 💳 الجزء 9: طرق الدفع (5 طرق)

| # | الطريقة | الرسوم | الرمز | متاح لـ |
|---|--------|-------|-------|---------|
| 1 | كاش عند الاستلام | 0% | `cash` | الكل |
| 2 | إنستا باي | 0% | `instapay` | الكل |
| 3 | محفظة إلكترونية | +1% | `wallet` | الكل |
| 4 | **آجل للتجار** | رسوم محفظة فقط | `credit` | **trader فقط** |
| 5 | ~~كرتونة~~ | **مرفوض** | — | — |

### نظام الآجل (Credit)
**الشروط**:
- **الحد الأقصى**: 5000 ج.م إجمالي الفاتورة
- **المدة القصوى**: 7 أيام فقط
- **بدون فوائد** على التقسيط

**رسوم المحفظة على الآجل**:
- **10 ج.م على كل 1000 ج.م** (بحد أدنى 1%)
- تُضاف لو السداد الفعلي بمحفظة إلكترونية
- مثال: 3000 ج.م آجل تُسدد بمحفظة → 30 ج.م رسوم

**التحقق في checkout**:
```javascript
if (storeType === 'wholesale' && paymentMethod === 'credit') {
  if (grandTotal > 5000) {
    showMessage({
      title: 'الحد الأقصى للتقسيط',
      body: 'الحد الأقصى للتقسيط معنا هو 5000 جنيه فقط.',
      icon: 'fa-exclamation-triangle'
    });
    return false;
  }
  installmentDays = Math.min(installmentDays || 7, 7);
  if (settlementMethod === 'wallet') {
    walletFee = Math.ceil(grandTotal / 1000) * 10;
  }
}
```

**ملاحظة حاسمة**:
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

### صفحات delivery/
- `delivery/login.html` (منقول)
- `delivery/home.html`
- `delivery/orders.html`
- `delivery/available.html`
- `delivery/order-details.html`
- `delivery/collections.html`
- `delivery/profile.html`
- `delivery/blocked.html`

---

## 💰 الجزء 11: الإبلاغ عن السداد

- **Collection**: `financial_notifications`
- **الصفحة**: `customer/balance.html` → إبلاغ → `admin/financial-transactions.html` → اعتماد/رفض
- **عند الاعتماد** → Transaction:
  - `customers.update({balance})`
  - `customer_notifications.add()`
  - `activityLog.add()`

---

## 🏷️ الجزء 12: العلامات التجارية (Brands)

### قرار
- **`partners` collection محذوف نهائياً**
- **يُستبدل بـ `brands`**
- **يديرها**: super فقط
- **تظهر في**:
  - الصفحة الرئيسية (سيكشن 10)
  - متجر الجملة (سيكشن "علاماتنا التجارية")
  - متجر القطاعي (سيكشن "علاماتنا التجارية")

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
- **grayscale 100%**
- **hover → grayscale 0** + scale 1.1 + shadow
- أنيميشن دخول

---

## 🎫 الجزء 13: تذاكر الدعم

- **Collection**: `support_tickets`
- **الصفحات**: `support.html` + `admin/support.html`
- **الحالات**: `open` → `processing` → `closed`
- **المرفقات**: صورة واحدة (ImgBB + fallbacks)

---

## 📄 الجزء 14: إدارة المحتوى

- **الصفحة**: `admin/content-manager.html` (super فقط)
- **5 collections**: `privacy_sections`, `shipping_sections`, `exchange_sections`, `terms_sections`, `faq_sections`
- **8 أنواع**: text, quote, list, cards, table, contact, steps, faq
- **Fallback default content** في كل صفحة

---

## 🚪 الجزء 15: بوابة الدخول login.html

5 كروت (إدارة / تجار / عملاء / كاشير / موصلين)
+ قسم "مستخدم جديد"

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

### cart.html
- 3 أنواع: مسجل / زائر / تاجر
- **سلة الزائر تحفظ**: `productName, imageUrl, unit, stockQuantity, maxOrder, price` كاملة

### checkout.html v5.0
- **4 طرق دفع للتجار** (كاش + instapay + wallet + **credit**)
- **3 طرق للعملاء** (كاش + instapay + wallet)
- **Trader-only**: خيار الآجل بحد أقصى 5000 ج.م + مدة 7 أيام
- **Region محمي**: trader locked, guest/retail يختار
- **branchId** يحدد تلقائياً من region
- **deliveryAgentId: ''** صراحة في orderData
- **paymentProof upload** للـ instapay/wallet
- **رسالة منبثقة** لو تجاوز 5000 في الآجل

### order-success.html
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

## 🗄️ الجزء 20: هيكل الملفات v17.1

```
📁 gomla/
├── 📁 assets/
│   ├── css/
│   │   ├── style.css              (v8.0)
│   │   ├── invoice-print.css      (v2.0)
│   │   └── pwa.css                (v1.0)
│   │
│   ├── js/
│   │   ├── firebase-config.js     (v8.0)
│   │   ├── main.js                (v8.0)
│   │   ├── public.js              (v7.0)
│   │   ├── invoice-print.js       (v2.0)
│   │   ├── image-uploader.js      🆕 (v1.0 — 4 fallbacks)
│   │   ├── gemini-extract.js      🆕 (v1.0)
│   │   ├── cardoona-editor.js     🆕 (v1.0 — محرر ديناميكي)
│   │   ├── cardoona-traders.js    🆕 (v1.0 — إدارة تجار كرتونة)
│   │   ├── cashier-sales.js       🆕 (v1.0)
│   │   ├── inventory.js           🆕 (v1.0)
│   │   ├── cashbox.js             🆕 (v1.0)
│   │   ├── shipping-rates.js      🆕 (v1.0)
│   │   └── pwa-register.js        🆕 (v1.0)
│   │
│   ├── components/
│   │   ├── header.html
│   │   ├── footer.html
│   │   └── sidebar.html
│   │
│   ├── images/
│   │   ├── logo.png
│   │   ├── no-image.png
│   │   ├── default-avatar.png
│   │   ├── favicon.ico
│   │   └── welcome-*.jpg
│   │
│   └── icons/                     PWA icons (8)
│
├── 📁 PWA Files
│   ├── manifest.json
│   ├── service-worker.js
│   ├── offline.html
│   └── sw-strategies.js
│
├── 📁 admin/                      (28 صفحة)
│   ├── login.html                 ✅
│   ├── home.html                  ⏳
│   ├── dashboard.html             ⏳
│   ├── products.html              ⏳
│   ├── customers.html             ⏳ (إصلاح عاجل)
│   ├── orders.html                ⏳
│   ├── invoices.html              ⏳
│   ├── cashbox.html               🆕
│   ├── inventory-reports.html     🆕
│   ├── financial-reports.html     🆕
│   ├── branches.html              🆕 (admin_plus)
│   ├── transfers.html             🆕 (admin_plus)
│   ├── expenses.html              🆕
│   ├── settings.html              🆕
│   ├── roles.html                 🆕
│   ├── shipping-rates.html        🆕
│   ├── suppliers.html             🆕
│   ├── purchases.html             🆕
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
│   ├── financial-transactions.html ✅
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
├── 📁 customer/                   (7 صفحات)
│   ├── login.html (نقل)
│   ├── register.html (نقل)
│   ├── home.html (نقل)
│   ├── orders.html                ✅
│   ├── invoices.html              ✅
│   ├── balance.html               ✅
│   └── profile.html               ✅
│
├── 📁 trader/
│   ├── login.html (نقل)
│   └── home.html (نقل)
│
├── 📁 delivery/                   (8 صفحات)
│   ├── login.html (نقل)
│   ├── home.html                  ✅
│   ├── orders.html                ✅
│   ├── available.html             ✅
│   ├── order-details.html         ✅
│   ├── collections.html           ✅
│   ├── profile.html               ✅
│   └── blocked.html               🆕
│
├── 📄 الصفحات العامة (~26)
│   ├── index.html                 ⏳ (Redesign كامل)
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
├── CONSTITUTION.md
├── firestore.rules
└── README.md
```

---

## 🗄️ الجزء 21: كوليكشنز Firestore (55 كولكشن)

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

### المالية (8)
`suppliers`, `purchases`, `cashbox`, `daily_sales`, `financial_notifications`, `expenses`, `salaries`, `damages`

### الإشعارات (3)
`notifications`, `customer_notifications`, `admin_notifications`

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

**الإجمالي: 55 كوليكشن**

**⚠️ محذوف: `partners`**

---

## 🚚 الجزء 22: أسعار الشحن (قابلة للإدارة)

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

### صفحة `admin/shipping-rates.html` (super + admin_plus)
- إضافة/تعديل/حذف منطقة
- تغيير السعر + عتبة الشحن المجاني
- تفعيل/إلغاء
- Live preview

### الأسعار الحالية (default seed)

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
  --transition-base: 0.3s ease;
  --transition-fast: 0.15s ease;
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
| **Gemini API** | استخراج كرتونة (أساسي) |
| html5-qrcode | باركود |
| JsBarcode | توليد باركود |

---

## 🛒 الجزء 25: Workflow كامل للطلبات

### A. طلب أونلاين
```
1. عميل → checkout → source='website', deliveryAgentId='', paymentStatus='unpaid'|'pending'
2. admin يعالج (processing)
3. مندوب يقبل أو admin يعيّن → 'assigned'
4. مندوب يستلم → 'picked_up'
5. مندوب يسلّم → 'delivered' + cashCollectedByAgent=true
6. admin_plus/super يؤكد → Transaction:
   • orders.update({paymentStatus:'paid', confirmedByAdmin:true})
   • cashbox.add({category:'order_payment', status:'approved'})
   • customer_notifications.add()
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

### C. فاتورة يدوية (4 أدوار)
```
- super/admin_plus/admin → approved مباشر
- cashier → pending_approval

Transaction:
• manual_sales.add({createdBy, createdByName, createdByRole})
• cashbox.add({category:'manual_sale', status, createdBy})
• products/branch_inventory.update()
```

### D. كرتونة (Gemini + محرر — تفصيل كامل في الجزء 29)

---

## 🏢 الجزء 26: نظام الفروع والمخزون

### `branches` (يديرها admin_plus + super)
```javascript
{
  id, name, code,  // MHL | TNT | MNS | WH
  address, phone,
  managerId, managerName,
  regions: [],
  isWarehouse: false,
  active: true,
  createdAt, updatedAt
}
```

### `branch_inventory/{branchId_productId}`
```javascript
{
  branchId, productId,
  warehouseQty: 0,
  piecesQty: 0,
  reservedQty: 0,
  availableQty: 0,
  minAlert: 5,
  productName, productImage, unit,
  lastUpdated, updatedBy
}
```

### `products` — إضافة
```javascript
{
  warehouseStock: 0,
  warehousePieces: 0,
  warehouseMinAlert: 10
}
```

### `transfers` — نقل
```javascript
{
  id, fromBranchId, toBranchId,
  items: [{ productId, quantity }],
  status: 'pending' | 'in_transit' | 'received' | 'cancelled',
  requestedBy, requestedAt,
  shippedBy, shippedAt,
  receivedBy, receivedAt
}
```

---

## 💰 الجزء 27: نظام الصندوق

### `cashbox/{entryId}`
```javascript
{
  id,
  type: 'income' | 'expense',
  category: 'order_payment' | 'cashier_sale' | 'cardoona_sale' 
          | 'manual_sale' | 'supplier_payment' | 'salary' | 'damage' | 'other',
  source: 'website' | 'cashier' | 'cardoona' | 'manual',
  branchId,
  
  orderId, orderNo,
  cashierSaleId, manualSaleId,
  
  amount, description,
  method: 'cash' | 'instapay' | 'wallet' | 'transfer',
  
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

### financial-reports.html
```
+ مبيعات جملة + قطاعي + كاشير + كرتونة + يدوية
- مصروفات - مرتبات - تلفيات - مشتريات
= صافي الربح

مقارنة مع cashbox:
  • متوقع = Σ(income approved) - Σ(expense approved)
  • فعلي = عد يدوي
  • الفرق = overage/shortage
```

### inventory-reports.html
1. **مخزون المخزن** (كراتين + قطع)
2. **مخزون كل فرع**
3. **مجمع** (الإجمالي)
4. **قابل للطباعة A4**

---

## 🎯 الجزء 29: كرتونة — Gemini + محرر ديناميكي (v17.1 محدث بالكامل)

### 4 مراحل النظام

#### المرحلة 1: الاستخراج (Gemini)

**الصفحة**: `admin/extract-pdf.html` — الخطوة 1 من 3

- رفع PDF
- إرسال لـ Gemini (Base64)
- Gemini يحلل ويُرجع JSON
- **عرض المؤشرات**: عدد البنود / الإجمالي / العميل / طريقة السداد
- **لم يُحفظ في Firestore بعد** — في الذاكرة فقط

### Prompt Gemini المحسّن

```
أنت مساعد متخصص في استخراج بيانات الفواتير من ملفات PDF العربية.

استخرج كامل البيانات من الفاتورة المرفقة كما هي دون تغيير أو اختصار.

⚠️ قواعد صارمة:
1. لا تُغيّر أو تختصر أي بيانات.
2. المنتجات المتكررة بنفس الصيغة أو مقاربة (اختلاف وزن/رائحة) تُستخرج كبنود منفصلة.
3. التركيز على عدد الكميات كما هي (لا تقريب).
4. التركيز على الوحدة كما هي (قطعة، كرتونة، كجم، علبة...).
5. التركيز على سعر الوحدة (القطعة) وليس الإجمالي.
   مثال: منتج 3 × 15 = 45 → احفظ "price_per_unit: 15" وليس 45.
6. التركيز على عدد البنود كما هو (لا إنقاص، لا تزويد).
7. التركيز على الخصومات (إن وُجدت):
   - خصم كرتونة
   - خصم تاجر تجزئة
   - خصم يدوي
8. التركيز على بند السداد:
   - نقدي
   - تقسيط كرتونة
   - تقسيط + نقدي في نفس الفاتورة (استخرج المبلغين)
9. الإجمالي قبل الخصومات وبعدها.
10. بيانات العميل: اسم، هاتف، عنوان (لو موجودين).

أعد النتيجة كـ JSON فقط بهذا الشكل:
{
  "invoice_no": "...",
  "invoice_date": "YYYY-MM-DD",
  "customer": { "name": "...", "phone": "...", "address": "..." },
  "items": [
    {
      "name": "...",
      "quantity": 0,
      "unit": "...",
      "price_per_unit": 0,
      "total": 0,
      "pieces_per_unit": 0
    }
  ],
  "discounts": {
    "cardoona_discount": 0,
    "retail_trader_discount": 0,
    "manual_discount": 0,
    "total_discount": 0
  },
  "payment": {
    "type": "cash" | "installment" | "both",
    "cash_amount": 0,
    "installment_amount": 0,
    "total_paid": 0,
    "remaining": 0
  },
  "subtotal_before_discount": 0,
  "total_after_discount": 0,
  "notes": "..."
}
```

#### المرحلة 2: المحرر الديناميكي (الخطوة 2 من 3)

**نفس الصفحة** — Layout من عمودين متجاورين:

**اليسار: لوحة التحرير**
```
[بيانات العميل]
- اسم العميل       [input]
- هاتف             [input]
- عنوان            [input]

[البنود] (editable list)
┌────────────────────────────────────────┐
│ # | اسم المنتج | كمية | وحدة | سعر | إجمالي | حذف │
├────────────────────────────────────────┤
│ 1 | شامبو      |  3   | قطعة | 15  |  45    | 🗑️  │
│ 2 | صابون      |  2   | كرتونة| 120 |  240   | 🗑️  │
└────────────────────────────────────────┘
[+ إضافة بند]

[الخصومات]
- خصم كرتونة           [input] [حذف]
- خصم تاجر تجزئة       [input] [حذف]
- خصم يدوي             [input] [حذف]
[+ إضافة خصم]

[طريقة السداد]
- نقدي: [input]
- تقسيط كرتونة: [input]
- إجمالي مدفوع: (auto)
- متبقي: (auto)
```

**اليمين: معاينة حية**
- الفاتورة بتنسيق "أولاد شعلان" الكامل
- **تتحدث فوراً** مع أي تعديل
- فيها: لوجو + رقم + تاريخ + عميل + بنود + خصومات + إجمالي
- **قابلة للطباعة** مباشرة

**أزرار الإجراءات**:
- 🔄 **إرجاع للتعديلات المُستخرجة** (Undo to Gemini extraction)
- 💾 **حفظ كمسودة** (draft — لا يُنشئ طلب)
- ✅ **تأكيد وحفظ** (ينتقل للمرحلة 3)
- ❌ **إلغاء**

**سجل التعديلات** (`edit_history`):
```javascript
edit_history: [
  { at: Timestamp, by: adminId, byName, field: 'customer.name', old: '...', new: '...' },
  { at: Timestamp, by: adminId, byName, action: 'add_item', item: {...} },
  { at: Timestamp, by: adminId, byName, action: 'delete_item', itemIndex: 2 },
  { at: Timestamp, by: adminId, byName, action: 'edit_discount', old: 50, new: 75 }
]
```

#### المرحلة 3: الحفظ الذكي (الخطوة 3 من 3)

عند "تأكيد وحفظ" → Firestore Transaction:

```javascript
await db.runTransaction(async (t) => {
  // 1. حفظ فاتورة كرتونة (أصل + معدل + سجل)
  t.set(db.collection('cardoona_invoices').doc(invoiceId), {
    original_extraction: geminiJson,
    final_data: editedJson,
    edit_history: history,
    extractedBy, extractedByName, extractedAt,
    editedBy, editedByName, editedAt,
    status: 'confirmed',
    customerMatchMethod: 'existing_code' | 'existing_phone' | 'new',
    matchedCustomerId: customerId || null
  });
  
  // 2. إنشاء الطلب
  const orderRef = db.collection('orders').doc();
  t.set(orderRef, {
    source: 'cardoona',
    branchId: warehouseId,
    createdBy, createdByName, createdByRole,
    customerId, customerName, customerPhone, customerAddress,
    storeType: 'wholesale',
    items: editedItems,
    subtotal, discount: totalDiscount, discountType: 'cardoona',
    discounts_breakdown: { cardoona, retail_trader, manual },
    total: finalTotal,
    paymentMethod: 'cardoona_installment',
    paymentStatus: 'awaiting_cardoona',
    cardoonaInvoiceNo: extracted.invoice_no,
    cardoonaPdfUrl: uploadedPdfUrl,
    cardoonaInvoiceId: invoiceId,
    status: 'pending',
    deliveryStatus: 'unassigned'
  });
  
  // 3. خصم من مخزون المخزن
  for (const item of editedItems) {
    t.update(db.collection('products').doc(item.productId), {
      warehouseStock: firebase.firestore.FieldValue.increment(-item.quantity)
    });
  }
  
  // 4. إذا العميل جديد → إنشاء حساب معلق
  if (customerMatchMethod === 'new') {
    const newCustomerRef = db.collection('customers').doc();
    t.set(newCustomerRef, {
      id: newCustomerRef.id,
      name: edited.customer.name,
      phone: edited.customer.phone,
      address: edited.customer.address,
      role: 'wholesale',
      type: 'wholesale',
      active: false,
      pending_approval: true,
      source: 'cardoona',
      code: null,
      authEmail: null,
      balance: 0,
      avatar: '',
      created_from_invoice: invoiceId,
      createdBy, createdByName,
      createdAt: now,
      updatedAt: now
    });
    
    // إشعار fan-out للسوبر أدمن
    const superAdmins = await db.collection('admins')
      .where('role', '==', 'super')
      .where('active', '==', true)
      .get();
    
    superAdmins.forEach(superDoc => {
      t.set(db.collection('admin_notifications').doc(), {
        userId: superDoc.id,
        title: '🆕 تاجر جديد من كرتونة',
        body: `${edited.customer.name} - بانتظار توليد كود`,
        type: 'cardoona_trader_pending',
        customerId: newCustomerRef.id,
        read: false,
        createdAt: now
      });
    });
  }
});
```

#### المرحلة 4: مراجعة السوبر (صفحة منفصلة)

**الصفحة**: `admin/cardoona-traders.html` — **super فقط**

**عرض**:
- كل التجار من كرتونة `customers.where('source', '==', 'cardoona')`
- **3 تبويبات دائمة الظهور**:
  - **معلق** (`pending_approval: true`)
  - **مفعّل** (`active: true, pending_approval: false`)
  - **مرفوض** (`rejected: true`)
- لو مفيش بيانات في تبويب → رسالة "لا يوجد [معلق/مفعل/مرفوض] حالياً"

**جدول كل تاجر**:
- الاسم / الهاتف / العنوان / رقم فاتورة كرتونة / تاريخ / حالة

**أزرار لكل تاجر معلق**:
- 🔑 **توليد كود**
- ✏️ **تعديل البيانات**
- ❌ **رفض** (مع سبب)

### آلية توليد الكود (Semi-Auto — كما اخترت)

**عند الضغط على "توليد كود"**:

1. يفتح Modal يعرض:
   - المدينة (dropdown)
   - الكود المقترح (auto-generated)
   - زر "توليد كود آخر" (إعادة التوليد)
   - زر "تأكيد وتوليد الحساب"

2. عند التأكيد → Transaction:

```javascript
async function generateTraderCode(customerId, city, code) {
  // 1. إنشاء Firebase Auth (Secondary App)
  const secondaryApp = firebase.initializeApp(firebaseConfig, 'TraderCreator_' + Date.now());
  const secondaryAuth = secondaryApp.auth();
  
  const authEmail = `${code.toLowerCase()}@trader.awladshalaan.com`;
  const userCred = await secondaryAuth.createUserWithEmailAndPassword(authEmail, code);
  const uid = userCred.user.uid;
  
  await secondaryAuth.signOut();
  await secondaryApp.delete();
  
  // 2. Transaction: تفعيل التاجر + حفظ lookup + إشعار
  await db.runTransaction(async (t) => {
    t.update(db.collection('customers').doc(customerId), {
      uid: uid,
      code: code,
      authEmail: authEmail,
      active: true,
      pending_approval: false,
      approvedBy: currentAdminId,
      approvedByName: currentAdminName,
      approvedAt: now,
      updatedAt: now
    });
    
    t.set(db.collection('trader_lookup').doc(code), {
      customerId: customerId,
      authEmail: authEmail,
      code: code,
      name: customer.name,
      phone: customer.phone,
      role: 'wholesale',
      active: true,
      createdAt: now
    });
    
    t.set(db.collection('admin_notifications').doc(), {
      userId: customerId,
      title: '✅ تم تفعيل حسابك',
      body: `كودك: ${code} - يمكنك الآن الدخول`,
      type: 'trader_activated',
      read: false,
      createdAt: now
    });
  });
}
```

3. بعد التأكيد → Modal النتيجة يعرض:
   - اسم التاجر
   - الكود (مع زر "نسخ")
   - الإيميل (مع زر "نسخ")
   - زر "إرسال عبر واتساب"
   - زر "إرسال عبر إيميل"
   - زر "إغلاق"

4. **السوبر ينسخ البيانات ويبعتها للتاجر يدوياً** (Semi-Auto).

**عند الرفض**:
```javascript
await db.collection('customers').doc(customerId).update({
  active: false,
  pending_approval: false,
  rejected: true,
  rejectionReason: reason,
  rejectedBy: currentAdminId,
  rejectedAt: now
});
```

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

**ذكر المنشئ** يظهر في:
- الفاتورة المطبوعة
- تقرير المبيعات
- cashbox dashboard
- activityLog

---

## 🖨️ الجزء 31: نظام الطباعة

### الطباعة المحلية / PDF محلي
- كامل التفاصيل (اسم + هاتف + عنوان)

### PDF على استضافة خارجية (Catbox)
- **مخفي**: العنوان + هاتف العميل

### أنواع المستخدم
`retail_cash`, `trader_cash`, `trader_credit`, `guest`, `cardoona`, `manual`

---

## 🔐 الجزء 32: المفاتيح والأمان

### ImgBB (primary)
```javascript
const IMGBB_API_KEY = 'cb056b7fd83c81129d5468c5d03287b4';
```

### Fallback API — نظام Image Uploader

```javascript
const IMAGE_UPLOADERS = [
  { name: 'imgbb',          apiKey: 'cb056b7fd83c81129d5468c5d03287b4', priority: 1 },
  { name: 'yourimageshare', apiKey: '0IRG8GPXkoo337Xo',                 priority: 2 },
  { name: 'freeimage',      apiKey: '6d207e02198a847aa98d0a2a901485a5', priority: 3 },
  { name: 'catbox',         userhash: '832ae296445cd944f9957b3b3',      priority: 4 }
];
```

**آلية `image-uploader.js`**:
```javascript
async function uploadImage(file, onProgress) {
  const compressed = await compressImage(file);
  for (const uploader of IMAGE_UPLOADERS.sort((a,b) => a.priority - b.priority)) {
    try {
      const url = await tryUpload(uploader, compressed, onProgress);
      if (url) return url;
    } catch (err) {
      console.warn(`❌ ${uploader.name} failed:`, err);
    }
  }
  throw new Error('كل مصادر رفع الصور فشلت');
}
```

### Firebase Keys
- في `firebase-config.js` (client-side)
- **الحماية الفعلية**: Firestore Rules صارمة
- **بدون بطاقة** → لا Blaze

### Gemini Key
- في `firebase-config.js`
- يمكن تقييده بـ API key restrictions (HTTP referrers)

### Firestore Rules
- **صارمة في النهاية** (المرحلة 5)
- **مرنة في المرحلة 0**

### ❌ محذوف
- Cloudflare R2 (بطاقة)
- Cloud Functions (Blaze)

### ✅ بدائل PDF
- JSON في Firestore (أساسي)
- PDF محلي (on-demand)
- Catbox (اختياري)

---

## 📲 الجزء 33: PWA

- `manifest.json`
- `service-worker.js` (Network First HTML/JS, Cache First Images)
- `offline.html`
- `sw-strategies.js`
- `pwa-register.js`
- `assets/icons/*` (8 مقاسات)

---

## 🖼️ الجزء 34: رفع الصور (متعدد المصادر)

الملف `assets/js/image-uploader.js`:
- ترتيب priorities
- Fallback تلقائي
- تسجيل النجاح/الفشل في `site_content.upload_stats`
- تنبيه admin عند الاقتراب من الحد

---

## ⚠️ الجزء 35: الأخطاء المعروفة (قائمة شاملة)

### 🔴 فئة A: أخطاء أمنية حرجة (10)

| # | الخطأ | الملف | الحل |
|---|-------|-------|------|
| A1 | مفاتيح API مكشوفة | firebase-config.js | مقبول (Spark) + rules صارمة |
| A2 | `customers create` مفتوح | firestore.rules | تحديث rule |
| A3 | `invoices create` مفتوح | firestore.rules | تحديث rule |
| A4 | `admins update` يرقّي super | firestore.rules | منع تعديل role |
| A5 | `activityLog create: if true` | firestore.rules | منع الزوار |
| A6 | `orders update` يسمح للمندوب بغيّر status | firestore.rules | منع |
| A7 | `delivery_agents read` لأي مسجل | firestore.rules | منع |
| A8 | إشعارات المندوبين ممنوعة من القراءة | firestore.rules | تعديل rule |
| A9 | الزائر لا يستطيع قراءة order-success/tracking | firestore.rules | تعديل rule |
| A10 | كشف البيانات في طباعة PDF خارجي | invoice-print.js | إخفاء اسم/هاتف |

### 🔴 فئة B: ميزات مكسورة (40)

| # | الملف | المشكلة |
|---|-------|---------|
| B1 | admin/customers.html | "Klasno" قبل DOCTYPE + function ناقصة |
| B2 | admin/dashboard.html | يستخدم orders_wholesale/retail |
| B3 | admin/invoices.html | const db = SyntaxError + invoice.html مفقود |
| B4 | admin/products.html | حذف تصنيف/براند = حذف المنتجات |
| B5 | admin/products.html | يحفظ hasOffer فقط |
| B6 | admin/products.html | retailUnit vs retailunit |
| B7 | admin/products.html | lowStockThreshold متثبت 5 |
| B8 | admin/products.html | showToast مكرر + HTML مكسور |
| B9 | admin/home + customers | يحملون core.js/sidebar.js/admin.js |
| B10 | main.js | logoutAdmin() غير موجودة |
| B11 | main.js | مسارات صور relative |
| B12 | main.js | updatePublicStats() محظورة |
| B13 | cart.html | isGuest (المعرّف isGuestUser) |
| B14 | cart.html | سلة الزائر بدون بيانات منتج |
| B15 | checkout.html | region غير محمي |
| B16 | order-success.html | الزائر لا يقدر يشوف |
| B17 | admin/registration-requests | approveRequest يضيع _currentRequest |
| B18 | admin/delivery-agents | تسريب Auth orphans |
| B19 | delivery/available | Composite Index مطلوب |
| B20 | delivery/home + order-details | المندوب يعمل تأكيد دفع بنفسه |
| B21 | delivery-login | مسار نسبي delivery/home.html |
| B22 | customer-login | دخول المندوب/الكاشير مستحيل |
| B23 | customer-home | "عروض مميزة" فاضي |
| B24 | trader-home | "خصومات" فاضي |
| B25 | offers.html | دايماً فاضي |
| B26 | discounts.html | دايماً فاضي |
| B27 | brand-products | لا يعرض عرض/خصم |
| B28 | category-products | لا يعرض عرض/خصم |
| B29 | store-wholesale | HTML مكسور |
| B30 | product-details | زر "تعديل" مش شغال |
| B31 | index.html | رقم واتساب غلط |
| B32 | index.html | إيميل غلط |
| B33 | tracking + support | رقم واتساب غلط |
| B34 | about.html | إحصائيات دايماً fallback |
| B35 | notification.html | غير realtime + batch 500 |
| B36 | register-guide | userId: 'all_admins' |
| B37 | categories.html | N+1 query |
| B38 | products.html | HTML مكسور |
| B39 | cashier | لا يستطيع الخروج |
| B40 | customer-login | trader-home.html (404) |

### 🔴 فئة C: تعارضات Schema (10)

| # | المشكلة |
|---|---------|
| C1 | orders vs orders_wholesale/retail |
| C2 | invoices vs invoices_wholesale/retail |
| C3 | hasOffer/offerPrice vs hasRetailOffer |
| C4 | hasWholesaleDiscount مش متحفظ |
| C5 | admin_plus مش في شراء |
| C6 | paymentStatus غير موحد |
| C7 | notes vs traderNotes |
| C8 | discount غير موحد |
| C9 | customerId vs uid vs id |
| C10 | deliveryAgentId: '' غير مضمون |

### 🔴 فئة D: ملفات ناقصة (35)

- 24 صفحة admin/pages جديدة
- 6 صفحات cashier
- 8 صفحات PWA
- 8 PWA icons
- صور welcome
- logo.png
- invoice.html

### 🟡 فئة E: مسارات تحتاج نقل (7)

- customer-home, customer-login, customer-register
- trader-home, trader-login
- delivery-login
- cashier-login

### 🟡 فئة F: مشاكل معمارية (15)

- نمطان مختلطان (placeholders vs inline)
- صفحة دخول مختلفة (IIFE واحدة)
- 5 صفحات محتوى بـ ~500 سطر مكرر
- main.js 1500+ سطر
- logging غير مركزي
- validation على السيرفر مفقود
- migrations مفقودة
- schema versioning مفقود
- نظام أذونات موحد مفقود
- حقن HTML بدون sanitize
- اختبارات صفر
- version control strategy

### 🆕 فئة H: كرتونة (4)

| # | المشكلة | الحل |
|---|---------|------|
| H1 | Gemini قد يرجع JSON غير صحيح | Validation + fallback PDF.js |
| H2 | تعديلات الأدمن غير متتبعة | `edit_history` في كل حفظ |
| H3 | تاجر مكرر من فاتورة تانية | Match by phone OR code |
| H4 | كود التاجر مكرر | Loop حتى يجد كود فريد |

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

**الإجمالي: ~**104 مشكلة****

---

## 🚀 الجزء 36: المراحل التنفيذية

| المرحلة | المدة | المخرجات |
|---------|-------|----------|
| **0** | 1-2 يوم | Backup + إصلاحات طوارئ |
| **1** | 3-4 أيام | Schema + Migrations |
| **2** | 5-7 أيام | Redesign كل الصفحات |
| **3** | 11-14 يوم | ميزات جديدة (كاشير + فروع + جرد + كرتونة + محرر + تجار كرتونة + brands-manager + shipping-rates + manual) |
| **4** | 1-2 يوم | image-uploader.js + Gemini integration |
| **5** | 2-3 أيام | Rules صارمة + اختبار |
| **6** | 1 يوم | دستور v17.2 |

### المرحلة 0 — تفصيل
1. Backup Firestore كامل
2. إصلاح `customers.html`
3. إصلاح `store-wholesale.html`
4. توحيد `orders`/`invoices`
5. إصلاح `logoutAdmin`
6. إصلاح صور main.js
7. تصحيح WhatsApp/Email
8. إصلاح schema العروض في admin/products
9. **Rules مرنة مؤقتة**
10. تقرير قبل/بعد

### المرحلة 3 — تفصيل
- **3.1**: cashier/* (6 صفحات) + login
- **3.2**: admin/cashbox.html
- **3.3**: admin/branches.html + transfers
- **3.4**: admin/inventory-reports.html
- **3.5**: admin/financial-reports.html
- **3.6**: admin/shipping-rates.html
- **3.7**: admin/extract-pdf.html (Gemini + محرر ديناميكي)
- **3.8**: admin/cardoona-traders.html (super فقط)
- **3.9**: admin/brands-manager.html
- **3.10**: admin/expenses.html
- **3.11**: admin/cashier-sales-manage.html (super فقط)
- **3.12**: admin/assign-delivery + delivery-settlements
- **3.13**: manual_sales workflow
- **3.14**: delivery/blocked.html
- **3.15**: invoice.html

---

## 🔑 الجزء 37: المفاتيح والإعدادات

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

// Image Uploaders (multi-fallback)
const IMAGE_UPLOADERS = {
  imgbb:          { apiKey: 'cb056b7fd83c81129d5468c5d03287b4', priority: 1 },
  yourimageshare: { apiKey: '0IRG8GPXkoo337Xo',                 priority: 2 },
  freeimage:      { apiKey: '6d207e02198a847aa98d0a2a901485a5', priority: 3 },
  catbox:         { userhash: '832ae296445cd944f9957b3b3',      priority: 4 }
};

// Gemini
const GEMINI_API_KEY = "AQ.Ab8RN6J_44fb2fdP2YWWxwq0aNnG7DXJnSv3O8whicffxAj_g";

// Constants
const WHATSAPP_NUMBER = "01068385028";
const PAYMENT_ACCOUNT = "01068385028";
const SUPPORT_EMAIL = "awladsh3laan@gmail.com";
```

---

## 📊 الجزء 38: إحصائيات المشروع

| المقياس | v17.0 | v17.1 |
|---------|-------|-------|
| الصفحات المكتملة | ~57 | ~57 |
| الصفحات المتبقية | ~32 | ~34 (+cardoona-traders + blocked) |
| الكوليكشنز | 55 | **55** |
| الأنظمة | 63 | **65** |
| المشاكل المعروفة | ~100 | **~104** |

---

## ✅ الجزء 39: القرارات النهائية v17.1

1-112. **كل قرارات v17.0 محفوظة**

**+ الإضافات الجديدة (v17.1):**
113. محرر ديناميكي لفاتورة كرتونة بعد الاستخراج
114. معاينة حية في نفس الصفحة (2-column)
115. `edit_history` لتتبع كل تعديل
116. زر "إرجاع للتعديلات المُستخرجة"
117. إذا التاجر غير موجود → إنشاء `customers` معلق
118. إشعار fan-out للسوبر أدمن
119. صفحة `admin/cardoona-traders.html` (super فقط)
120. "توليد كود" يعرض Modal → تأكيد → Semi-Auto
121. Modal النتيجة يعرض الكود + إيميل + أزرار نسخ/واتساب
122. "رفض" مع سبب → إشعار
123. 3 تبويبات دائمة (معلق/مفعل/مرفوض) — تظهر دايماً
124. **محرر مدمج في `admin/extract-pdf.html`** (3 خطوات)
125. **Semi-Auto لتوليد الكود** (السوبر ينسخ ويبعت يدوياً)
126. **"تجار كرتونة" دايماً ظاهر** حتى لو فاضي

---

## 🎯 الجزء 40: الخطوة القادمة

**بعد موافقتك على v17.1** → نبدأ **المرحلة 0** فوراً.

### المرحلة 0 — المهام
1. Backup Firestore كامل
2. إصلاح `customers.html` المكسور
3. إصلاح `store-wholesale.html`
4. توحيد `orders`/`invoices`
5. إصلاح `logoutAdmin`
6. إصلاح صور main.js
7. تصحيح WhatsApp/Email
8. إصلاح schema العروض في admin/products
9. **Rules مرنة مؤقتة**
10. تقرير قبل/بعد

**بعد المرحلة 0** → نحدّث الدستور v17.2 وندخل المرحلة 1.

---

## 📌 ملاحظات ختامية

1. **كل صورة/فيلم/نص** يجب أن يكون له بديل (fallback)
2. **كل عملية مالية** يجب أن تكون في Transaction
3. **كل إشعار** fan-out (لكل أدمن UID)
4. **كل فاتورة** تُسجّل `createdBy` + `createdAt`
5. **كل صفحة** تحمي نفسها IIFE
6. **الدستور حي** — يُحدَّث بعد كل مرحلة
7. **الـ Repo واحد** — branch `redesign`
8. **Firebase Project واحد**
9. **الأمان في النهاية** — rules صارمة بعد إصلاح الصفحات
10. **Spark Plan فقط** — بدون Cloud Functions، بدون بطاقة

---

**هذا هو المرجع الرسمي الكامل v17.1 ✅**

**آخر تحديث:** 2026-10-19
**الحالة:** المرحلة 0 — استعداد للتنفيذ
```

---

# 🎯 خلاصة الدستور v17.1

## ✅ التعديلات المدمجة

| القرار | التطبيق |
|--------|---------|
| **1. A** | محرر مدمج في `admin/extract-pdf.html` (3 خطوات: رفع → تحرير + معاينة → تأكيد) |
| **2. B** | Semi-Auto — Super يدوس "توليد" → Modal يعرض الكود → Super ينسخ ويبعت يدوياً |
| **3. B** | "تجار كرتونة" دايماً ظاهر — 3 تبويبات (معلق/مفعل/مرفوض) + رسائل عند الفراغ |

## ✅ الإضافات الحاسمة

1. **محرر ديناميكي كامل** — إضافة/حذف/تعديل بنود + خصومات + بيانات العميل
2. **معاينة حية** — 2-column layout
3. **`edit_history`** — تتبع كامل لكل تعديل
4. **Undo** — إرجاع للتعديلات المُستخرجة
5. **إنشاء تاجر معلق تلقائياً** — من فاتورة كرتونة
6. **صفحة `cardoona-traders.html`** — super فقط
7. **توليد كود + تفعيل** — Transaction ذرّي
8. **إشعار fan-out** — لكل سوبر أدمن نشط

## 🚀 جاهز للبدء؟

**لو موافق على دستور v17.1**، قول:

**"يلا نبدأ المرحلة 0"**

وأنا هبعتلك في الرد التالي:
- ✅ **Backup Script** كامل (Firestore)
- ✅ **10 ملفات إصلاح** جاهزة (كود نهائي جاهز للنسخ)
- ✅ **قائمة التحقق** قبل/بعد
- ✅ **خطوات الاختبار**

**كود نهائي — بدون "أضف كذا" أو "عدّل كذا"** 🚀
