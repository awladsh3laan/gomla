# 📜 دستور مشروع أولاد شعلان — v17.0 الكامل

```markdown
# 📜 دستور مشروع أولاد شعلان للمنظفات والورقيات
**الإصدار:** 17.0 (Redesign + تعديلات v17.0)
**آخر تحديث:** 2026-10-19
**هذا الملف هو المرجع الوحيد للمشروع**
**⚠️ يُحدَّث بعد كل مرحلة إصلاح**
```

---

## 📌 الجزء 1: معلومات المشروع

| البند | التفاصيل |
|------|----------|
| الاسم | أولاد شعلان للمنظفات والورقيات |
| النوع | متجر إلكتروني + POS كاشير + إدارة فروع + إدارة مخزون + تكامل كرتونة (Gemini) + PWA |
| الرابط | https://awladsh3laan.github.io/gomla |
| GitHub | https://github.com/awladsh3laan/gomla.git |
| التقنيات | HTML + CSS + Vanilla JS + Firebase (Spark) + ImgBB (multi-fallback) + Gemini API + Catbox |
| اللغة | العربية (RTL) |
| الخط | Tajawal |
| الأيقونات | Font Awesome فقط — **ممنوع إيموجي في الـ UI** |
| Firebase Plan | **Spark (مجاني) — بدون Cloud Functions، بدون بطاقة ائتمان** |
| Schema Version | **v17.0** |
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

### جدول الصلاحيات v17.0

| الصلاحية | super | admin_plus | admin | cashier | trader | retail | delivery |
|---------|-------|-----------|-------|---------|--------|--------|----------|
| إدارة المنتجات | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| إدارة الطلبات | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| تعيين مندوب | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **تأكيد استلام نقد** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **كتابة cashbox** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **كرتونة (Gemini)** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **إدارة الفروع** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **مبيعات كاشير (إنشاء)** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **مبيعات كاشير (تعديل)** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **فاتورة يدوية (مباشر)** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **فاتورة يدوية (pending)** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **إدارة أسعار الشحن** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| إعدادات النظام | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| توليد أكواد | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| إدارة المحتوى | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| إدارة العلامات التجارية | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| مراجعة طلبات التسجيل | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| عرض أسعار الجملة | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| عرض أسعار القطاعي | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| الشراء | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

**⚠️ قاعدة أساسية v17.0:**
- **الموصل** لا يرى إلا صفحات `delivery/*` فقط
- أي محاولة دخول لصفحات الموقع الرئيسي → شاشة "ليس لديك صلاحيات" بتقنية عالية

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

### حماية صفحات الدخول
كل صفحة دخول فيها IIFE قبل أي كود:
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

---

## 🏠 الجزء 4: الصفحة الرئيسية index.html (Redesign v17.0)

### 12 سيكشن بالترتيب

#### 1. صورة الترحيب المتحركة
- صورة أو فيديو (رابط يدوي من `site_content.welcome`)
- تحريك: fade-in + parallax عند scroll

#### 2. نبذة تعريفية عن الموقع + أولاد شعلان
- قسمان متتاليان:
  - **الموقع**: 3-4 سطور عن المنصة
  - **الشركة**: من `site_content.about`
- أنيميشن slide-in

#### 3. السلايدر
- من `slider` collection
- Auto-play 5s + navigation dots
- دعم 3 أحجام (موبايل/تابلت/ديسكتوب)

#### 4. كروت المتاجر (حسب الصلاحية)
| الدور | المتاجر المرئية |
|-------|----------------|
| guest / retail | متجر قطاعي فقط |
| trader | متجر جملة + قطاعي |
| cashier / admin / admin_plus / super | متجر جملة + قطاعي |
| delivery | **لا شيء** (شاشة رفض) |

#### 5. أحدث العروض (Offers) — للكل ماعدا trader
- أنيميشن احترافي (كارد داخل + hover)
- **هيدر السيكشن فيه عداد تنازلي للعروض القريبة من الانتهاء**
- **رسالة منبثقة (Toast/Popup) عند دخول الصفحة** — تنزل تلقائياً داخل السيكشن بعد 7 ثوانٍ
- يعرض للـ: guest, retail, cashier, admin, admin_plus, super
- **مخفي عن**: trader
- السعر المعروض حسب الدور

#### 6. أحدث الخصومات (Discounts) — للتجار والإدارة
- نفس أسلوب العروض
- **رسالة منبثقة** 7 ثوانٍ
- يعرض للـ: trader, cashier, admin, admin_plus, super
- **مخفي عن**: guest, retail

#### 7. الأقسام (عرض أفقي)
- كارت لكل قسم: صورة + اسم
- Scroll أفقي
- أنيميشن `dropIn` عند التحميل
- عدّاد المنتجات في كل قسم

#### 8. أحدث المنتجات (عرض احترافي)
- شبكة grid مع scroll عمودي
- **أنيميشن Intersection Observer** — الكارد يظهر عند دخوله viewport
- Hover scale 1.05 + رفع ظل
- 10 منتجات (Load more عند الحاجة)

#### 9. سيكشنات مخصصة (custom_sections)
- نفس v15.0 — من `sections-manager.html`

#### 10. العلامات التجارية (Brands — بدل Partners)
- **صور رمادية (grayscale: 100%)**
- **عند hover → تتم تلوينها (grayscale: 0)** + scale 1.1
- عرض أفقي / شبكة

#### 11. تواصل معنا
- 3 كروت: واتساب، إيميل، تذكرة دعم
- ألوان مخصصة

#### 12. Footer
- من `footer.html`

### منطق عرض الأسعار حسب الصلاحية

```javascript
function getPriceForRole(product, role) {
  if ([ROLES.RETAIL, ROLES.GUEST].includes(role)) {
    return {
      piecePrice: product.retailPrice,
      cartonPrice: null,
      showUnit: 'قطعة'
    };
  }
  if (role === ROLES.WHOLESALE) {
    return {
      piecePrice: null,
      cartonPrice: product.wholesalePrice,
      showUnit: product.unit || 'كرتونة'
    };
  }
  // cashier / admin / admin_plus / super
  return {
    piecePrice: product.retailPrice,
    cartonPrice: product.wholesalePrice,
    showUnit: 'both'  // يعرض الاثنين
  };
}
```

### شاشة الموصل الممنوع

صفحة `/delivery/blocked.html` أو modal داخل الصفحة الرئيسية:
- **كارت تقني عالي المستوى** مع animation خلفية (particles/parallax)
- نص: **"ليس لديك صلاحيات عرض أي صفحات من الموقع أو التطبيق إلا صفحاتك الخاصة فقط"**
- أزرار لأنشطته:
  - لوحة الموصل
  - أوردراتي
  - منطقتي (Available)
  - تحصيلاتي
  - بياناتي

---

## 📄 الجزء 5: صفحة تفاصيل المنتج

| الدور | يُعرض |
|------|-------|
| super | كل شيء + سعر الشراء + تعديل |
| admin_plus / admin | جملة (وحدة) + قطاعي (قطعة) + مخزون مخزن + مخزون كل فرع + notes + traderNotes |
| wholesale | جملة + قطاعي + هامش ربح + مخزون + traderNotes |
| retail / guest | قطاعي فقط + وصف + براند + تصنيف + مخزون متاح |
| delivery | **لا يصل** (يُعاد توجيهه) |

---

## 🏪 الجزء 6: المتاجر

### store-retail.html — قطاعي
Brand Hero + سلايدر + بحث + أحدث + براندات + عروض + أقسام + جميع المنتجات

### store-wholesale.html — جملة
Brand Hero (بني) + سلايدر + بحث + أحدث + براندات + **خصومات** + أقسام + جميع المنتجات + **علامات تجارية**

**⚠️ حماية v17.0**: `delivery` ممنوع من الدخول → توجيه لـ `/delivery/home.html`

**الـ partners section محذوف** — بدله brands

---

## 📂 الجزء 7: الأقسام

- `categories.html`: شبكة أقسام + عدّاد حقيقي
- `category-products.html`: Sticky bar + شريط براندات + فلاتر
- `brand-products.html`: منتجات براند

---

## 🎯 الجزء 8: العروض والخصومات (Schema موحد v17.0)

### الحقول الموحدة في `products`
```javascript
{
  // العروض (قطاعي)
  hasRetailOffer: false,
  retailOfferPrice: 0,
  retailOfferStart: Timestamp|null,
  retailOfferEnd: Timestamp|null,
  
  // الخصومات (جملة)
  hasWholesaleDiscount: false,
  wholesaleDiscountPercent: 0,
  wholesaleDiscountStart: Timestamp|null,
  wholesaleDiscountEnd: Timestamp|null,
  
  // ملاحظات
  notes: '',          // للجميع
  traderNotes: ''     // للتجار والإدارة فقط
}
```

**⚠️ مهم**: `admin/products.html` **لازم** يكتب الحقول دي بالظبط. أي صفحة تقرأ منهم.

**⚠️ توافق خلفي مؤقت**: الحقل القديم `hasOffer` + `offerPrice` يُقرأ كـ alias لو `hasRetailOffer` مش موجود (فترة انتقالية).

---

## 💳 الجزء 9: طرق الدفع (v17.0)

### 5 طرق (بعد التعديل)

| # | الطريقة | الرسوم | الرمز | متاح لـ |
|---|--------|-------|-------|---------|
| 1 | كاش عند الاستلام | 0% | `cash` | الكل |
| 2 | إنستا باي | 0% | `instapay` | الكل |
| 3 | محفظة إلكترونية | +1% | `wallet` | الكل |
| 4 | **آجل للتجار فقط** | رسوم محفظة فقط | `credit` | **trader فقط** |
| 5 | ~~كرتونة تقسيط~~ | **مرفوض** | — | — |

### 🆕 نظام الآجل (Credit) — تفاصيل دقيقة

**الشروط**:
- **الحد الأقصى**: 5000 ج.م **إجمالي الفاتورة**
- **المدة القصوى**: 7 أيام فقط لا غير
- **بدون فوائد أو رسوم إضافية** على التقسيط نفسه

**رسوم المحفظة الإلكترونية على الآجل**:
- **10 ج.م على كل 1000 ج.م** (بحد أدنى 1% من المبلغ)
- تُضاف تلقائياً لو طريقة السداد الفعلية محفظة إلكترونية
- مثال: فاتورة آجل 3000 ج.م تُسدد بمحفظة → رسوم 30 ج.م (3 × 10)

**التحقق في checkout.html**:
```javascript
if (storeType === 'wholesale' && paymentMethod === 'credit') {
  if (grandTotal > 5000) {
    showMessage({
      title: 'الحد الأقصى للتقسيط',
      body: 'الحد الأقصى للتقسيط معنا هو 5000 جنيه فقط. يُرجى تقليل الطلب أو اختيار طريقة دفع أخرى.',
      icon: 'fa-exclamation-triangle'
    });
    return false;
  }
  // المدة القصوى
  installmentDays = Math.min(installmentDays || 7, 7);
  // رسوم المحفظة لو دفع بمحفظة
  if (settlementMethod === 'wallet') {
    walletFee = Math.ceil(grandTotal / 1000) * 10;
  }
}
```

**ملاحظة حاسمة**:
> **تقسيط كرتونة غير متاح كوسيلة دفع للعميل.** يتم استخراج الفواتير من كرتونة عبر Gemini، ثم تُضاف في النظام كبند كاش بعد استلام النقد من الشركة.

### معادلة الدفع العامة
```javascript
baseTotal = subtotal + shippingCost
paymentFee = method === 'wallet' ? baseTotal * 0.01 : 0
totalBeforeRound = baseTotal + paymentFee
grandTotal = roundToNearest5(totalBeforeRound)  // ينتهي بـ 0 أو 5
```

### حالات `paymentStatus`
```
unpaid              → كاش لم يستلم
pending             → instapay/wallet في المراجعة
partial             → دفع جزئي
paid                → مدفوع
awaiting_cardoona   → في انتظار تأكيد كرتونة
awaiting_agent      → مندوب استلم (تأكيد صوري)
awaiting_admin      → في انتظار تأكيد الأدمن
```

---

## 🚚 الجزء 10: نظام التوصيل

### Collections
- `delivery_agents/{uid}`
- `delivery_lookup/{CODE}`
- `delivery_collections/{id}`

### Workflow (نفس v16.0)
```
website order → unassigned → assigned → picked_up → delivered
              → cashCollectedByAgent (صوري)
              → admin_plus/super يؤكد → cashbox
```

### تقسيم الفلوس
- **فلوس المنتجات** → الصندوق (`order_payment`)
- **فلوس الشحن** → من حق المندوب

### صفحات delivery/
- `delivery/login.html` (منقول من الجذر)
- `delivery/home.html`
- `delivery/orders.html`
- `delivery/available.html`
- `delivery/order-details.html`
- `delivery/collections.html`
- `delivery/profile.html`
- `delivery/blocked.html` 🆕

**⚠️ v17.0**: مندوب مش قادر يدخل أي صفحة من الموقع الرئيسي. Rules تمنع، Frontend يعرض شاشة "blocked".

---

## 💰 الجزء 11: الإبلاغ عن السداد

- **Collection**: `financial_notifications`
- **الصفحة**: `customer/balance.html` → إبلاغ → `admin/financial-transactions.html` → اعتماد/رفض
- **عند الاعتماد** → Transaction:
  - `customers.update({balance})`
  - `customer_notifications.add()`
  - `activityLog.add()`

---

## 🏷️ الجزء 12: العلامات التجارية (Brands) — بدل الشركاء

### قرار v17.0
- **`partners` collection محذوف نهائياً**
- **يُستبدل بـ `brands`** الموجود بالفعل
- **يديرها**: super فقط (إضافة/تعديل/حذف)
- **تظهر في**:
  - الصفحة الرئيسية (سيكشن 10)
  - متجر الجملة (سيكشن "علاماتنا التجارية")
  - متجر القطاعي (سيكشن "علاماتنا التجارية")

### Schema `brands`
```javascript
{
  id, name,
  imageUrl,          // شعار
  description,       // وصف
  color: '#1a2a4a',  // لون البراند
  order: 0,          // للترتيب
  active: true,
  productCount: 0,   // denormalized
  createdAt, updatedAt
}
```

### التصميم في الصفحة
- **صور رمادية (grayscale 100%)**
- **hover → colored** (grayscale 0) + scale 1.1 + shadow
- أنيميشن دخول

---

## 🎫 الجزء 13: تذاكر الدعم

- **Collection**: `support_tickets`
- **الصفحات**: `support.html` + `admin/support.html`
- **الحالات**: `open` → `processing` → `closed`
- **المرفقات**: صورة واحدة (ImgBB primary + fallback)

---

## 📄 الجزء 14: إدارة المحتوى

- **الصفحة**: `admin/content-manager.html` (super فقط)
- **5 collections**: `privacy_sections`, `shipping_sections`, `exchange_sections`, `terms_sections`, `faq_sections`
- **8 أنواع**: text, quote, list, cards, table, contact, steps, faq
- **Fallback default content** في كل صفحة

---

## 🚪 الجزء 15: بوابة الدخول login.html

5 كروت (إدارة / تجار / عملاء / كاشير / موصلين)
+ قسم "مستخدم جديد" (تسجيل عميل / طلب تاجر / انضم للتوصيل)

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
- **مهم جداً**: سلة الزائر تحفظ `productName, imageUrl, unit, stockQuantity, maxOrder, price` كاملة (مش بس productId)

### checkout.html v5.0 (v17.0 update)
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

## 🗄️ الجزء 20: هيكل الملفات v17.0

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
│   │   ├── image-uploader.js      🆕 (v1.0 — ImgBB + 3 fallbacks)
│   │   ├── gemini-extract.js      🆕 (v1.0 — استخراج كرتونة)
│   │   ├── cashier-sales.js       🆕 (v1.0)
│   │   ├── inventory.js           🆕 (v1.0)
│   │   ├── cashbox.js             🆕 (v1.0)
│   │   ├── shipping-rates.js      🆕 (v1.0 — إدارة أسعار الشحن)
│   │   └── pwa-register.js        🆕 (v1.0)
│   │
│   ├── components/
│   │   ├── header.html
│   │   ├── footer.html
│   │   └── sidebar.html
│   │
│   ├── images/
│   │   ├── logo.png               🆕
│   │   ├── no-image.png
│   │   ├── default-avatar.png
│   │   ├── favicon.ico
│   │   └── welcome-*.jpg
│   │
│   └── icons/                     🆕 PWA icons (8)
│
├── 📁 PWA Files
│   ├── manifest.json
│   ├── service-worker.js
│   ├── offline.html
│   └── sw-strategies.js
│
├── 📁 admin/                      (26 صفحة)
│   ├── login.html ✅
│   ├── home.html ⏳
│   ├── dashboard.html ⏳
│   ├── products.html ⏳
│   ├── customers.html ⏳ (إصلاح عاجل)
│   ├── orders.html ⏳
│   ├── invoices.html ⏳
│   ├── cashbox.html 🆕
│   ├── inventory-reports.html 🆕
│   ├── financial-reports.html 🆕
│   ├── branches.html 🆕 (admin_plus)
│   ├── transfers.html 🆕 (admin_plus)
│   ├── expenses.html 🆕
│   ├── settings.html 🆕
│   ├── roles.html 🆕
│   ├── shipping-rates.html 🆕
│   ├── suppliers.html 🆕
│   ├── purchases.html 🆕
│   ├── daily-sales.html 🆕
│   ├── extract-pdf.html 🆕 (Gemini)
│   ├── brands-manager.html 🆕 (بدل partners)
│   ├── reports.html 🆕
│   ├── barcode-scanner.html 🆕
│   ├── generate-codes.html ✅
│   ├── delivery-agents.html ✅
│   ├── assign-delivery.html 🆕
│   ├── delivery-settlements.html 🆕
│   ├── registration-requests.html ✅
│   ├── financial-transactions.html ✅
│   ├── support.html ✅
│   ├── content-manager.html ✅
│   ├── sections-manager.html ✅
│   ├── cashier-sales-manage.html 🆕 (super فقط للتعديل)
│   └── profile.html ⏳
│
├── 📁 cashier/                    (6 صفحات)
│   ├── login.html (نقل)
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
│   ├── orders.html ✅
│   ├── invoices.html ✅
│   ├── balance.html ✅
│   └── profile.html ✅
│
├── 📁 trader/
│   ├── login.html (نقل)
│   └── home.html (نقل)
│
├── 📁 delivery/                   (8 صفحات)
│   ├── login.html (نقل)
│   ├── home.html ✅
│   ├── orders.html ✅
│   ├── available.html ✅
│   ├── order-details.html ✅
│   ├── collections.html ✅
│   ├── profile.html ✅
│   └── blocked.html 🆕
│
├── 📄 الصفحات العامة (~26)
│   ├── index.html ⏳ (Redesign كامل)
│   ├── store-wholesale.html ⏳
│   ├── store-retail.html ✅
│   ├── categories.html ✅
│   ├── category-products.html ✅
│   ├── brand-products.html ✅
│   ├── offers.html ⏳
│   ├── discounts.html ⏳
│   ├── cart.html ⏳
│   ├── checkout.html ✅ (v5.0)
│   ├── order-success.html ⏳
│   ├── invoice.html 🆕
│   ├── product-details.html ⏳
│   ├── login.html ✅
│   ├── register-guide.html ✅
│   ├── tracking.html ✅
│   ├── wishlist.html ✅
│   ├── notification.html ✅
│   ├── support.html ✅
│   ├── about.html ✅
│   ├── privacy-policy.html ✅
│   ├── shipping-policy.html ✅
│   ├── exchange-policy.html ✅
│   ├── terms.html ✅
│   └── faq.html ✅
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

### الفروع والمخزون (4) 🆕
`branches`, `branch_inventory`, `transfers`, `inventory_snapshots`

### التجارة (6)
`cart`, `wishlist`, `orders`, `invoices`, `invoice_archives`, `manual_sales`

### البيع المباشر (1) 🆕
`cashier_sales`

### المالية (8)
`suppliers`, `purchases`, `cashbox`, `daily_sales`, `financial_notifications`, `expenses`, `salaries`, `damages`

### الإشعارات (3)
`notifications`, `customer_notifications`, `admin_notifications`

### السجلات (2)
`activityLog`, `barcode_scans`

### المحتوى (8)
`quotes`, `news`, `ads`, `slider`, `custom_sections`, `site_content`, `public_stats`, `shipping_rates` 🆕

### الصفحات القانونية (5 + 5 meta)
`privacy_sections`, `shipping_sections`, `exchange_sections`, `terms_sections`, `faq_sections`, + 5 meta

### الدعم والتوصيل (3)
`support_tickets`, `delivery_collections`, `registration_requests`

### كرتونة (2) 🆕
`cardoona_invoices`, `cardoona_extractions`

**الإجمالي: 55 كوليكشن**

**⚠️ محذوف: `partners`** (يُستبدل بـ `brands`)

---

## 🚚 الجزء 22: أسعار الشحن (v17.0 — قابلة للإدارة)

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

### صفحة `admin/shipping-rates.html` 🆕 (super + admin_plus)
- إضافة/تعديل/حذف منطقة
- تغيير السعر
- تغيير عتبة الشحن المجاني
- تفعيل/إلغاء منطقة
- Live preview

**الأسعار الحالية (default seed)**:

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
| **PDF.js 3.11** | استخراج كرتونة (احتياطي) |
| **Gemini API** 🆕 | استخراج كرتونة (أساسي) |
| html5-qrcode | باركود |
| JsBarcode | توليد باركود |

---

## 🛒 الجزء 25: Workflow كامل للطلبات

(نفس v16.0 — order flow / cashier flow / cardoona flow / manual flow)

---

## 🏢 الجزء 26: نظام الفروع والمخزون (v17.0)

### `branches` — إدارة admin_plus
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

**⚠️ v17.0**: إدارة الفروع لـ `super` + `admin_plus` فقط

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
  ...existing...,
  warehouseStock: 0,
  warehousePieces: 0,
  warehouseMinAlert: 10
}
```

### `transfers` — نقل بين الفروع
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

### الصلاحيات v17.0
- **super + admin_plus**: approve/reject
- **admin**: لا (فقط يرى)
- **cashier**: إنشاء pending فقط

---

## 📊 الجزء 28: نظام الجرد والتقارير المالية

### financial-reports.html — نفس v16.0

```
+ مبيعات جملة + قطاعي + كاشير + كرتونة + يدوية
- مصروفات - مرتبات - تلفيات - مشتريات
= صافي الربح

مقارنة مع cashbox
```

### inventory-reports.html — جرد 3 مستويات
1. **مخزون المخزن** (كراتين + قطع)
2. **مخزون كل فرع** على حدة
3. **مجمع** (الإجمالي)
4. **قابل للطباعة A4**

---

## 🎯 الجزء 29: كرتونة — Gemini (v17.0)

### القرار الحاسم
**استخراج الفواتير عبر Gemini API** (أساسي) + PDF.js (احتياطي)

### الإعدادات
```javascript
const GEMINI_CONFIG = {
  apiKey: 'AIzaSy...',  // في firebase-config.js
  model: 'gemini-1.5-flash',
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
};
```

### Prompt احترافي (v17.0)

```
أنت مساعد متخصص في استخراج بيانات الفواتير من ملفات PDF العربية.

استخرج كامل البيانات من الفاتورة المرفقة كما هي دون تغيير أو اختصار.

⚠️ قواعد صارمة:
1. لا تُغيّر أو تختصر أي بيانات.
2. المنتجات المتكررة بنفس الصيغة أو مقاربة (اختلاف وزن/رائحة) تُستخرج كبنود منفصلة.
3. التركيز على عدد الكميات كما هي (لا تقريب).
4. التركيز على الوحدة كما هي (قطعة، كرتونة، كجم، علبة...).
5. التركيز على سعر الوحدة (القطعة) وليس الإجمالي.
   مثال: منتج 3 × 15 = 45 → احفظ "price: 15" وليس 45.
6. التركيز على عدد البنود كما هو (لا إنقاص، لا تزويد).
7. التركيز على الخصومات (إن وُجدت): 
   - خصم كرتونة
   - خصم تاجر تجزئة
   - خصم يدوي
   كل واحد باسمه ومبلغه.
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
  "customer": {
    "name": "...",
    "phone": "...",
    "address": "..."
  },
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

تأكد: كل الأسعار والكميات مطابقة للفاتورة الأصلية.
```

### Workflow
```
1. super/admin_plus → admin/extract-pdf.html
2. يرفع PDF → يُرسل لـ Gemini (Base64)
3. Gemini يحلل ويُرجع JSON
4. Preview في صفحة → المراجع يعدل يدوياً لو لازم
5. تأكيد → Firestore Transaction:
   • cardoona_invoices.add()
   • orders.add({ source: 'cardoona', paymentStatus: 'awaiting_cardoona' })
   • products.update({ warehouseStock: -qty })
   • financial_notifications.add({ type: 'cardoona_pending' })
6. عند استلام النقد من الشركة → admin_plus/super يدوس "استلمت"
   → Transaction:
     • orders.update({ paymentStatus: 'paid' })
     • cashbox.add({ category: 'cardoona_sale', status: 'approved' })
```

### ملاحظات v17.0 حاسمة
- **تقسيط كرتونة غير متاح كوسيلة دفع في checkout** — فقط كبند في النظام
- **يُسجل المبلغ نقداً** بعد استلام النقد من الشركة
- **Gemini يعمل client-side** (بدون Cloud Functions) — المفتاح في firebase-config.js
- **احتياطي**: PDF.js لو Gemini فشل

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

### الصلاحيات v17.0
| الدور | ينشئ | cashboxStatus |
|-------|------|---------------|
| super | ✅ | approved |
| admin_plus | ✅ | approved |
| admin | ✅ | approved |
| cashier | ✅ | **pending_approval** |

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
- احترام الخصوصية

### أنواع المستخدم
- `retail_cash`, `trader_cash`, `trader_credit`, `guest`, `cardoona`, `manual`

---

## 🔐 الجزء 32: المفاتيح والأمان (بدون بطاقة ائتمان)

### ImgBB (primary)
```javascript
const IMGBB_API_KEY = 'cb056b7fd83c81129d5468c5d03287b4';
```
- **الحد**: 32MB ملف / upload
- **مراقبة**: alert عند الاقتراب من الحد

### Fallback API — نظام Image Uploader v17.0

```javascript
const IMAGE_UPLOADERS = [
  { name: 'imgbb',        apiKey: 'cb056b7fd83c81129d5468c5d03287b4', priority: 1 },
  { name: 'yourimageshare', apiKey: '0IRG8GPXkoo337Xo',              priority: 2 },
  { name: 'freeimage',    apiKey: '6d207e02198a847aa98d0a2a901485a5', priority: 3 },
  { name: 'catbox',       userhash: '832ae296445cd944f9957b3b3',     priority: 4 }
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
      // نجرب التالي
    }
  }
  throw new Error('كل مصادر رفع الصور فشلت');
}
```

**النتيجة**: صفر خطر انقطاع. لو imgbb فشل، البدائل شغالة.

### Firebase Keys
- في `firebase-config.js` (client-side) — **لا يمكن إخفاؤها بدون Cloud Functions**
- **الحماية الفعلية**: **Firestore Rules صارمة** (المفتاح آمن فقط لو القواعد صحيحة)
- **بدون بطاقة ائتمان** → لا Blaze

### Gemini Key
- في `firebase-config.js` — **مخاطرة محدودة** (الحد المجاني 15 req/min)
- يمكن تقييده بـ API key restrictions (HTTP referrers) من Google Cloud Console

### Firestore Rules
- **صارمة في النهاية** (المرحلة 5)
- **مرنة في المرحلة 0** (عشان الصفحات تشتغل)

### ❌ محذوف من v16.0
- **Cloudflare R2** (يطلب بطاقة ائتمان)
- **Cloud Functions** (Blaze)

### ✅ بدائل PDF
- **JSON في Firestore** (أساسي)
- **PDF محلي** (on-demand — jsPDF)
- **Catbox** (اختياري للنسخ الخارجية) — مجاني، بدون بطاقة

---

## 📲 الجزء 33: PWA (بدون تغيير)

manifest.json + service-worker.js + offline.html + sw-strategies.js + pwa-register.js + 8 icons

---

## 🖼️ الجزء 34: رفع الصور (متعدد المصادر)

### الملف: `assets/js/image-uploader.js`
```javascript
const IMAGE_PROVIDERS = {
  imgbb: { ... },
  yourimageshare: { ... },
  freeimage: { ... },
  catbox: { ... }
};

async function uploadImage(file, onProgress) {
  // 1. ضغط
  const compressed = await imageCompression(file, IMAGE_CONFIG);
  
  // 2. محاولة كل مزود بالترتيب
  for (const [name, config] of Object.entries(IMAGE_PROVIDERS)) {
    try {
      const url = await uploadTo(name, config, compressed);
      if (url) {
        // سجل نجاح
        await logUploadSuccess(name, url);
        return url;
      }
    } catch (err) {
      // سجل فشل + جرب التالي
      logUploadFailure(name, err);
    }
  }
  
  throw new Error('فشل رفع الصورة عبر كل المصادر');
}
```

### إدارة الحصص
- تتبع استخدام كل مزود في `site_content.upload_stats`
- تنبيه admin لما يقرب من الحد

---

## ⚠️ الجزء 35: الأخطاء المعروفة (قائمة شاملة)

### 🔴 فئة A: أخطاء أمنية حرجة (10)

| # | الخطأ | الملف | الحل |
|---|-------|-------|------|
| A1 | مفاتيح API مكشوفة | firebase-config.js | **مقبول** (Spark) + rules صارمة |
| A2 | `customers create` مفتوح للجميع | firestore.rules | تحديث rule |
| A3 | `invoices create` مفتوح للجميع | firestore.rules | تحديث rule |
| A4 | `admins update` يرقّي super | firestore.rules | منع تعديل role |
| A5 | `activityLog create: if true` | firestore.rules | منع الزوار |
| A6 | `orders update` يسمح للمندوب بغيّر status | firestore.rules | منع |
| A7 | `delivery_agents read` لأي مسجل | firestore.rules | منع |
| A8 | إشعارات المندوبين ممنوعة من القراءة | firestore.rules | تعديل rule |
| A9 | الزائر لا يستطيع قراءة order-success/tracking | firestore.rules | تعديل rule |
| A10 | `FRONTEND_TOKEN` في العميل (v15) | invoice-storage.js | **محذوف** (R2 مش مستخدم) |

### 🔴 فئة B: ميزات مكسورة (35)

| # | الملف | المشكلة |
|---|-------|---------|
| B1 | admin/customers.html | "Klasno" قبل DOCTYPE + function ناقصة + script src فاضي |
| B2 | admin/dashboard.html | يستخدم orders_wholesale/retail (غير موجودين) |
| B3 | admin/invoices.html | const db = SyntaxError + invoice.html مش موجود |
| B4 | admin/products.html | حذف تصنيف/براند = حذف كل المنتجات |
| B5 | admin/products.html | يحفظ hasOffer فقط، الصفحات تقرأ hasRetailOffer |
| B6 | admin/products.html | retailUnit vs retailunit bug |
| B7 | admin/products.html | lowStockThreshold متثبت على 5 |
| B8 | admin/products.html | showToast مكرر + HTML مكسور |
| B9 | admin/home + customers | يحملون core.js/sidebar.js/admin.js المحذوفين |
| B10 | main.js | logoutAdmin() غير موجودة |
| B11 | main.js | مسارات صور relative |
| B12 | main.js | updatePublicStats() محظورة بالـ rules |
| B13 | cart.html | isGuest (المعرّف isGuestUser) |
| B14 | cart.html | سلة الزائر بدون productName/imageUrl |
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
| B35 | notification.html | غير realtime + batch limit 500 |
| B36 | register-guide | userId: 'all_admins' ضائعة |
| B37 | categories.html | N+1 query |
| B38 | products.html | HTML مكسور (form-row جوه form-row) |
| B39 | coupon/logout | cashier لا يستطيع الخروج |
| B40 | customer-login | يحوّل تاجر لـ trader-home.html (404) |

### 🔴 فئة C: تعارضات Schema (10)

| # | المشكلة |
|---|---------|
| C1 | orders vs orders_wholesale/retail |
| C2 | invoices vs invoices_wholesale/retail |
| C3 | hasOffer/offerPrice vs hasRetailOffer |
| C4 | hasWholesaleDiscount مش متحفظ في admin/products |
| C5 | admin_plus مش في شراء |
| C6 | paymentStatus غير موحد |
| C7 | notes vs traderNotes |
| C8 | discount غير موحد |
| C9 | customerId vs uid vs id |
| C10 | deliveryAgentId: '' غير مضمون في checkout |

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

### 🟢 فئة G: تحسينات UX (10)

- notification.html يحول لـ notifications.html
- store-retail لحماية trader
- order-success يخفي حساس للزائر
- checkout validation على السيرفر
- products.html pagination cursor-based
- categories.html N+1
- delivery/home realtime refresh
- wallet fee واضح
- shipping-rates admin panel
- brands grayscale effect

**الإجمالي: ~**100 مشكلة****

---

## 🚀 الجزء 36: المراحل التنفيذية

| المرحلة | المدة | المخرجات |
|---------|-------|----------|
| **0** | 1-2 يوم | Backup + إصلاحات طوارئ (A2-A9 + B1-B12) |
| **1** | 3-4 أيام | Schema + Migrations (B4-B9 + C1-C10) |
| **2** | 5-7 أيام | Redesign كل الصفحات |
| **3** | 7-10 أيام | ميزات جديدة (كاشير + فروع + جرد + كرتونة Gemini + brands-manager + shipping-rates + manual) |
| **4** | 1-2 يوم | image-uploader.js (4 fallbacks) + Gemini integration |
| **5** | 2-3 أيام | Rules صارمة + اختبار كامل |
| **6** | 1 يوم | دستور v17.1 |

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

---

## 🔑 الجزء 37: المفاتيح والإعدادات

```javascript
// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCdU3HadKWtzKtTAO9x7mcVPq6eodTqPzA",
  authDomain: "awlad-shalaan-wholesale.firebaseapp.com",
  projectId: "awlad-shalaan-wholesale",
  // ...
};

// Image Uploaders (multi-fallback)
const IMAGE_UPLOADERS = {
  imgbb:          { apiKey: 'cb056b7fd83c81129d5468c5d03287b4', priority: 1 },
  yourimageshare: { apiKey: '0IRG8GPXkoo337Xo',              priority: 2 },
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

| المقياس | v16.0 | v17.0 |
|---------|-------|-------|
| الصفحات المكتملة | ~57 | ~57 |
| الصفحات المتبقية | ~30 | ~32 (+blocked) |
| الكوليكشنز | 54 | **55** |
| الأنظمة | 60 | **63** |
| المشاكل المعروفة | ~100 | ~100 |
| نسبة الإنجاز | Redesign | Redesign |

---

## ✅ الجزء 39: القرارات النهائية v17.0

1-95. **كل قرارات v16.0 محفوظة (مع تعديلات)**

**+ الإضافات الجديدة:**
96. **Image Uploader multi-fallback** (4 مزودين)
97. **إدارة الفروع** تحت admin_plus
98. **مبيعات الكاشير** إنشاء admin_plus+super، تعديل super فقط
99. **الصفحة الرئيسية 12 سيكشن** (جديد)
100. **أحدث العروض/الخصومات** برسالة منبثقة 7 ثوانٍ
101. **الموصل ممنوع** من صفحات الموقع الرئيسي
102. **عرض الأسعار حسب الصلاحية** (5 مستويات)
103. **partners محذوف** → brands بديل
104. **الآجل** بحد 5000 ج.م + مدة 7 أيام + رسوم محفظة 10ج/1000ج
105. **كرتونة تقسيط** غير متاح كوسيلة دفع (بند كاش فقط)
106. **shipping-rates admin panel**
107. **Gemini** أساسي لكرتونة (prompt محسّن)
108. **PDF.js** احتياطي لكرتونة
109. **Cloudflare R2 محذوف** (يطلب بطاقة)
110. **Catbox** بديل PDF خارجي
111. **Firebase Storage** غير مستخدم (البطاقة)
112. **كل الفواتير JSON في Firestore** (أساسي)

---

## 🎯 الجزء 40: الخطوة القادمة

**بعد موافقتك على v17.0**، نبدأ **المرحلة 0** فوراً.

### المرحلة 0 — المهام
1. Backup Firestore كامل
2. إصلاح `customers.html` المكسور
3. إصلاح `store-wholesale.html`
4. توحيد `orders`/`invoices`
5. إصلاح `logoutAdmin`
6. إصلاح صور main.js
7. تصحيح WhatsApp/Email في 4 صفحات
8. إصلاح schema العروض في admin/products
9. **Rules مرنة مؤقتة**
10. تقرير قبل/بعد

**بعد المرحلة 0** → نحدّث الدستور v17.1 وندخل المرحلة 1.

---

## 📌 ملاحظات ختامية

1. **كل صورة/فيلم/نص** يجب أن يكون له بديل (fallback) — لضمان استمرارية الموقع
2. **كل عملية مالية** يجب أن تكون في Transaction (ذرّية)
3. **كل إشعار** يجب أن يكون fan-out (لكل أدمن UID حقيقي)
4. **كل فاتورة** يجب أن تُسجّل `createdBy` + `createdAt`
5. **كل صفحة** يجب أن تحمي نفسها IIFE قبل أي كود
6. **الدستور حي** — يُحدَّث بعد كل مرحلة
7. **الـ Repo واحد** — branch `redesign` للتطوير
8. **Firebase Project واحد** — نفس المشروع
9. **الأمان في النهاية** — rules صارمة بعد إصلاح الصفحات
10. **Spark Plan فقط** — بدون Cloud Functions، بدون بطاقة

---

**هذا هو المرجع الرسمي الكامل v17.0 ✅**

**آخر تحديث:** 2026-10-19
**الحالة:** المرحلة 0 — استعداد للتنفيذ
```

---

# 🎯 رأيي في التعديلات

## ملاحظاتي على تعديلاتك:

### ✅ ممتازة:
1. **ImgBB + 3 fallbacks** — حل ذكي جداً. الحد الفعلي 32MB/upload مش/ساعة. البدائل شغالة.
2. **الموصل ممنوع** — قرار صحيح (أمان + UX)
3. **الآجل بحد 5000 + 7 أيام** — منطقي جداً
4. **رسوم محفظة 10ج/1000ج على الآجل** — يغطي التكلفة الفعلية
5. **شركاء → علامات تجارية** — يستخدم infrastructure موجود
6. **Gemini أولاً** — أفضل من PDF.js (أذكى في فهم النصوص العربية)
7. **إخفاء بيانات في PDF خارجي فقط** — قرار أمني سليم
8. **shipping-rates admin panel** — ضروري جداً
9. **إدارة الفروع تحت admin_plus** — منطقي
10. **تعديل مبيعات كاشير = super فقط** — أمان مالي

### ⚠️ 3 ملاحظات تقنية:

**1. Gemini API — الحصة المجانية**
- **الحد**: 15 request/min, 1M tokens/day (كافي جداً)
- **لا يحتاج بطاقة** ✅
- **لكن**: المفتاح في العميل = أي حد يستهلكه
- **الحل**: API key restrictions (HTTP referrers) من Google Cloud Console — مجاني

**2. لماذا Cloudflare R2 رُفض؟**
- R2 يحتاج بطاقة (للتحقق فقط، حتى في الخطة المجانية)
- **البديل الصحيح**: **Catbox** (اللي إنت عملته) — مجاني، لا بطاقة، 200MB/file
- **JSON في Firestore** = 10MB max/doc — **كافي جداً** لفاتورة

**3. عرض الأسعار (5 مستويات) — تحديث منطقي**
- guest/retail: قطاعي فقط
- trader: جملة فقط
- cashier/admin/admin_plus/super: **الاثنين** (مفيد جداً للتشغيل)
- delivery: **لا شيء** (ممنوع)

---

## 🚀 جاهز للبدء؟

**لو موافق على دستور v17.0**، قول:

**"يلا نبدأ المرحلة 0"**

وأنا هبعتلك في الرد التالي:
- ✅ **Backup Script** (Firestore كامل)
- ✅ **10 ملفات إصلاح** جاهزة (customers.html, store-wholesale.html, main.js, firebase-config.js, admin/products.html, firestore.rules مؤقت, وأكثر)
- ✅ **تقرير قبل/بعد** لكل ملف
- ✅ **خطوات الاختبار**

**كل ملف هيبقى كود كامل جاهز للنسخ المباشر** — بدون "أضف كذا" أو "عدّل كذا". كود نهائي.

**قولي "يلا نبدأ" 🚀**
