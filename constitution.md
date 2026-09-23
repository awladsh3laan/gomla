# 📜 دستور مشروع أولاد شعلان للمنظفات والورقيات

**الإصدار:** 7.0 (النسخة النهائية المحدثة)  
**آخر تحديث:** 2026-09-22  
**هذا الملف هو المرجع الوحيد للمشروع**

---

# 📌 الجزء الأول: معلومات المشروع

| البند | التفاصيل |
|-------|----------|
| **الاسم** | أولاد شعلان للمنظفات والورقيات |
| **النوع** | متجر إلكتروني (جملة + قطاعي) + لوحة تحكم + أنظمة مالية + كاشير + باركود |
| **الرابط** | https://awladsh3laan.github.io/gomla |
| **GitHub** | https://github.com/awladsh3laan/gomla.git |
| **التقنيات** | HTML + CSS + Vanilla JS + Firebase |
| **اللغة** | العربية (RTL) |
| **الخط** | Tajawal |

---

# 🏠 الجزء الثاني: الصفحة الرئيسية `index.html`

## هيكل الصفحة (8 سيكشنات)

```
1. 🎞️ سيكشن السلايدر (من Firestore)
2. 🏪 سيكشن كروت المتاجر (جملة + قطاعي)
3. 🆕 سيكشن أحدث المنتجات
4. 🆕 سيكشن أحدث العروض
5. 🆕 سيكشن المنتجات الأكثر طلباً
6. 🆕 سيكشنات مخصصة (من لوحة التحكم)
7. 🆕 سيكشن نبذة عن أولاد شعلان
8. 🆕 سيكشن تواصل معنا (واتساب + جيميل)
```

### تفاصيل السيكشنات المخصصة:

**5 أنواع متاحة:**
1. **إعلانات بنرات** - صورة + عنوان + رابط
2. **عرض منتجات معينة** - اختيار يدوي من المنتجات
3. **كروت بروابط** - صورة/أيقونة + عنوان + وصف + رابط
4. **فيديوهات** - روابط يوتيوب
5. **صور** - معرض صور

**الكولكشن:** `custom_sections`
**اللوحة:** `admin/sections-manager.html` (سوبر أدمن فقط)

---

# 📄 الجزء الثالث: صفحة تفاصيل المنتج `product-details.html`

## عرض حسب الصلاحية

### 🏪 للتاجر والأدمن:
```
✅ سعر الجملة (الوحدة)
✅ سعر الجملة (القطعة)
✅ سعر البيع للمستهلك
✅ هامش الربح في القطعة
✅ هامش الربح في الوحدة
✅ المخزون المتاح
✅ الحد الأقصى للطلب
✅ ملاحظات (تظهر للتاجر فقط)
✅ زر إضافة للسلة
```

### 👤 للعميل والزائر:
```
✅ السعر القطاعي فقط + "قطعة"
✅ الوصف
✅ البراند
✅ التصنيف
✅ المخزون المتاح
✅ زر إضافة للسلة
❌ ممنوع رؤية أسعار الجملة
❌ ممنوع رؤية أسعار الشراء
❌ ممنوع رؤية الهامش
```

### 👑 للسوبر أدمن إضافات:
```
✅ كل ما سبق +
✅ عرض سعر الشراء
✅ زر تعديل المنتج
```

---

# 🏪 الجزء الرابع: المتاجر

## 1. المتجر القطاعي `store-retail.html`

### 🆕 سيكشن "أولاد شعلان ستور" (Brand Hero)

```
- صورة من: https://i.ibb.co/v4xBgMPP/Picsart-26-09-21-04-43-12-322.png
- انيميشن احترافي:
  * Logo Pulse (نبض + دوران بسيط)
  * Shimmer Bar (شريط ذهبي علوي)
  * Text Shine (نص متلألئ)
  * Float Shapes (دوائر ذهبية عائمة)
- الشعار "أولاد شعلان ستور"
- 3 مميزات: منتجات أصلية، توصيل سريع، دعم فوري
```

### السيكشنات:
```
1. 🏪 سيكشن "أولاد شعلان ستور" (مخصص للقطاعي فقط)
2. 🎞️ السلايدر
3. 🔍 البحث الذكي
4. 🆕 أحدث المنتجات (سعر قطاعي فقط)
5. 🏷️ البراندات
6. 🎯 العروض
7. 📂 الأقسام (زر عرض الكل → categories.html)
8. 📦 جميع المنتجات + تحميل المزيد
```

**⚠️ قواعد خاصة:**
- **كل الأسعار قطاعي فقط**
- **الوحدة دائماً "قطعة"**
- **ممنوع عرض أسعار الجملة أو الشراء**
- **لا يوجد سكرول تلقائي** (المستخدم يتحكم بنفسه)

## 2. المتجر الجملة `store-wholesale.html` (⏳ قيد التنفيذ)

**هيكون فيه:**
- سيكشن Brand Hero خاص بالتجار
- كل الأسعار (جملة + قطعة + هامش)
- الحد الأقصى للطلب
- الملاحظات

---

# 📂 الجزء الخامس: صفحة الأقسام `categories.html`

## الهيكل (5 سيكشنات)

```
1. 🏷️ عنوان الصفحة (Hero)
2. 🎞️ السلايدر المصغر
3. 🔍 البحث المصغر
4. 🎯 العروض المصغرة
5. 📂 شبكة الأقسام الكاملة
```

## مميزات الشبكة:

- **الأنيميشن:** `dropIn` (نزول من الأعلى بسرعة وخفيفة)
- **التأخير المتتالي:** كل كارت يتأخر 0.05s
- **عدد المنتجات:** **حقيقي** من Firestore (يُحسب لكل قسم)
- **الفلترة:** الأقسام الفارغة لا تظهر
- **الرابط الذكي:** `?type=retail/wholesale` حسب المستخدم

## ⚠️ قواعد خاصة:

- الكروت **تُفلتر** حسب نوع المستخدم
- لو المستخدم **زائر/عميل** → يمرر `?type=retail`
- لو المستخدم **تاجر/أدمن** → يمرر `?type=wholesale`

---

# 🚫 الجزء السادس: إلغاء السكرول التلقائي

## القاعدة الجديدة:

```
❌ ممنوع أي سكرول تلقائي في المشروع
✅ المستخدم يتحكم بنفسه في كل السكرول الأفقي
```

**التعديلات المطبقة:**
- حذف `autoScroll()` من `store-retail.html`
- حذف استدعاءات `autoScroll()` من كل الدوال
- نفس الشيء في كل الصفحات القادمة

---

# 🔍 الجزء السابع: نافذة البحث الموحدة (Search Modal)

## المميزات:

```
✅ نافذة Modal احترافية (بدل prompt())
✅ تعمل في كل الصفحات
✅ Debounce 300ms
✅ بحث فوري (Live Search)
✅ 6 اقتراحات سريعة
✅ ESC للإغلاق
✅ Enter للبحث الكامل
✅ عرض النتائج مع صور + أسعار
✅ السعر حسب صلاحية المستخدم
```

## الملفات:

| الملف | المحتوى |
|-------|---------|
| `style.css` | كلاسات `.search-modal-*` |
| `main.js` | دوال `openSearchModal()`, `closeSearchModal()`, `handleModalSearch()` |
| كل صفحة | HTML نافذة البحث (قبل `</body>`) |

## HTML نافذة البحث (يُضاف في كل صفحة):

```html
<div class="search-modal-overlay" id="searchModalOverlay" onclick="closeSearchModal(event)">
  <div class="search-modal" onclick="event.stopPropagation()">
    <div class="search-modal-header">
      <i class="fas fa-search search-icon"></i>
      <input type="text" id="searchModalInput" 
             placeholder="ابحث عن منتج..."
             autocomplete="off"
             oninput="handleModalSearch(this.value)"
             onkeydown="handleSearchKeydown(event)">
      <button class="search-modal-close" onclick="closeSearchModal()">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="search-modal-body" id="searchModalBody">
      <div id="searchInitialContent">
        <div class="search-suggestions-header">
          <i class="fas fa-fire"></i> اقتراحات سريعة
        </div>
        <div class="search-suggestions-chips">
          <a href="/gomla/offers.html" class="search-chip">
            <i class="fas fa-percent"></i> العروض
          </a>
          <!-- ... المزيد -->
        </div>
      </div>
      <div class="search-results" id="searchResults"></div>
    </div>
    <div class="search-keyboard-hint">
      <span><kbd>ESC</kbd> للإغلاق</span>
      <span><kbd>Enter</kbd> للبحث</span>
    </div>
  </div>
</div>
```

---

# 🔐 الجزء الثامن: نظام الدخول والصلاحيات

## نظام الدخول

```
Firebase Auth + localStorage + كود سري للتجار
```

| المستخدم | الدخول | التسجيل |
|----------|--------|---------|
| **العميل** | Email + Password | تسجيل ذاتي |
| **التاجر** | كود سري فقط | السوبر أدمن |
| **الأدمن** | Email + Password | السوبر أدمن |
| **السوبر أدمن** | Email + Password | ثابت |
| **الزائر** | لا يحتاج دخول | تصفح فقط |
| **الكاشير** | Email + Password | السوبر أدمن |

## الأدوار والصلاحيات (محدثة)

### 👑 السوبر أدمن (super)
```
✅ كل شيء بدون قيود
✅ إدارة المنتجات (إضافة/تعديل/حذف)
✅ إدارة العملاء والتجار
✅ إدارة الطلبات والفواتير
✅ إدارة الموردين والمشتريات
✅ استخراج الفواتير من PDF
✅ الصندوق والتقارير المالية
✅ إدارة الفروع
✅ إدارة الكاشير
✅ إدارة المستويات والمكافآت
✅ توليد أكواد التجار
✅ الإعدادات العامة
✅ إدارة السيكشنات المخصصة
✅ إدارة محتوى الموقع (site_content)
✅ رؤية سعر الشراء
✅ تجاوز كل الحدود
```

### 🛡️ الأدمن (admin)
```
✅ إدارة المنتجات (بدون حذف)
✅ عرض سعر الشراء (قراءة)
✅ تعديل سعر البيع
✅ إدارة الطلبات
✅ إدارة الفواتير
✅ تعديل بيانات العملاء (اسم/هاتف فقط)
✅ تسجيل دفعات
✅ إنشاء فواتير وطلبات
✅ عرض التقارير المالية
❌ ممنوع حذف المنتجات
❌ ممنوع تعديل سعر الشراء
❌ ممنوع تغيير صورة/كود/اسم محل/عنوان/باسورد
❌ ممنوع إدارة الصلاحيات
❌ ممنوع إدارة الفروع
❌ ممنوع حذف مستخدم
```

### 🏪 التاجر (wholesale)
```
✅ تسوق من متجر الجملة
✅ إضافة للسلة (بحد أقصى المنتج)
✅ إنشاء طلبات (1500+ ج.م)
✅ عرض طلباته وفواتيره
✅ عرض الذمة المالية
✅ عرض تفاصيل المنتج (كل الأسعار + الهامش)
✅ عرض الملاحظات
✅ تتبع طلباته
❌ ممنوع رؤية سعر الشراء
❌ ممنوع الوصول للوحة التحكم
```

### 👤 العميل (retail)
```
✅ تسوق من متجر القطاعي
✅ إضافة للسلة (بحد المخزون)
✅ إنشاء طلبات
✅ عرض طلباته وفواتيره
✅ عرض الذمة المالية
✅ عرض تفاصيل المنتج (سعر قطاعي فقط)
✅ تتبع طلباته
✅ المفضلة
❌ ممنوع رؤية أسعار الجملة والشراء
```

### 👻 الزائر (guest)
```
✅ تصفح متجر القطاعي
✅ عرض المنتجات والأسعار
✅ إضافة للسلة
✅ إنشاء طلب بدون تسجيل
✅ تأكيد الطلب
❌ ممنوع متجر الجملة
❌ ممنوع تتبع الطلبات
❌ ممنوع الوصول للوحة التحكم
```

### 🧑‍💻 الكاشير (cashier)
```
✅ تصفح المتجرين
✅ إنشاء طلب من المتجرين
✅ تتبع الطلبات
✅ إنشاء فاتورة مبيعات من فرعه
✅ إدارة مخزون الفرع
✅ إنشاء فاتورة مشتريات للفرع
✅ استخدام قارئ الباركود
❌ ممنوع عرض عملاء المتاجر
❌ ممنوع الوصول للمتاجر
❌ ممنوع الوصول لأي صفحة إدارية
```

---

# 🗄️ الجزء التاسع: هيكل الملفات

```
📁 gomla/
├── 📁 assets/
│   ├── css/style.css
│   ├── js/
│   │   ├── firebase-config.js
│   │   ├── main.js
│   │   └── public.js
│   ├── components/
│   │   ├── header.html
│   │   ├── footer.html
│   │   └── sidebar.html
│   └── images/
│
├── 📁 admin/
│   ├── login.html
│   ├── home.html
│   ├── dashboard.html
│   ├── products.html
│   ├── customers.html
│   ├── orders.html
│   ├── invoices.html
│   ├── suppliers.html
│   ├── purchases.html
│   ├── extract-pdf.html
│   ├── cashbox.html
│   ├── daily-sales.html
│   ├── barcode-scanner.html
│   ├── financial-reports.html
│   ├── ranks-levels.html
│   ├── settings.html
│   ├── branches.html
│   ├── cashier.html
│   ├── generate-codes.html
│   ├── sections-manager.html  ← 🆕
│   └── profile.html
│
├── 📁 cashier/
│   ├── home.html
│   ├── sales.html
│   ├── inventory.html
│   ├── purchases.html
│   └── barcode-scanner.html
│
├── 📁 customer/
│   ├── profile.html
│   ├── orders.html
│   ├── invoices.html
│   └── balance.html
│
├── index.html
├── store-wholesale.html
├── store-retail.html
├── categories.html           ← 🆕
├── category-products.html
├── brand-products.html
├── offers.html
├── cart.html
├── checkout.html
├── order-success.html
├── product-details.html
├── tracking.html
├── wishlist.html
├── notifications.html
├── support.html
├── customer-login.html
├── trader-login.html
├── cashier-login.html
├── customer-home.html
├── trader-home.html
├── about.html
├── privacy-policy.html
├── shipping-policy.html
├── exchange-policy.html
├── CONSTITUTION.md
└── README.md
```

---

# 🗄️ الجزء العاشر: كولكشنز Firestore

| الكولكشن | الوصف | الوصول |
|----------|-------|--------|
| `admins` | المديرين والسوبر أدمن | خاص |
| `cashiers` | الكاشير | خاص |
| `customers` | العملاء والتجار | حسب الصلاحية |
| `users` | احتياطي | حسب الصلاحية |
| `products` | المنتجات | عام (قراءة) |
| `categories` | التصنيفات | عام |
| `brands` | البراندات | عام |
| `cart` | السلة | المستخدم نفسه |
| `wishlist` | المفضلة | المستخدم نفسه |
| `orders` | الطلبات | حسب الصلاحية |
| `invoices` | الفواتير | حسب الصلاحية |
| `suppliers` | الموردين | الإدارة |
| `purchases` | المشتريات | الإدارة + الكاشير |
| `cashbox` | الصندوق | الإدارة |
| `daily_sales` | المبيعات اليومية | الإدارة + الكاشير |
| `branches` | الفروع | عام (قراءة) |
| `branch_inventory` | مخزون الفروع | الإدارة + الكاشير |
| `ranks` | الرتب | عام |
| `levels` | المستويات | عام |
| `rewards` | المكافآت | حسب الصلاحية |
| `notifications` | الإشعارات | المستخدم نفسه |
| `activityLog` | سجل النشاط | الإدارة |
| `quotes` | المقولات | عام |
| `news` | الأخبار | عام |
| `ads` | الإعلانات | عام |
| `slider` | السلايدر | عام |
| `barcode_scans` | سجل الباركود | الإدارة + الكاشير |
| `custom_sections` | 🆕 السيكشنات المخصصة | عام (قراءة) |
| `site_content` | 🆕 محتوى الموقع | عام (قراءة) |

---

# 📊 الجزء الحادي عشر: هيكل البيانات

## المنتج
```javascript
{
  id, name, imageUrl,
  categoryId, categoryName,
  brandId, brandName,
  description, notes,
  purchasePrice, wholesalePrice, retailPrice,
  unit, retailUnit, piecesPerUnit,
  stockQuantity, lowStockThreshold, maxOrder,
  available, hasOffer, offerPrice,
  offerStartDate, offerEndDate,
  barcode, sku, keywords,
  salesCount, viewsCount,
  createdAt, updatedAt, updatedBy
}
```

## السيكشن المخصص (جديد)
```javascript
{
  id,
  type, // banner | products | cards | videos | images
  title,
  icon, // fa-star, fa-fire, ...
  order, // ترتيب الظهور
  active, // true/false
  items: [
    // حسب النوع:
    // banner: { imageUrl, title, link }
    // cards: { imageUrl, icon, title, description, link }
    // videos: { videoUrl, title }
    // images: { imageUrl, title }
  ],
  productIds: [], // للسيكشن من نوع products
  createdAt, updatedAt
}
```

## محتوى الموقع (جديد)
```javascript
// site_content/about
{
  title: "نبذة عن أولاد شعلان",
  content: "المحتوى ...",
  updatedAt
}
```

---

# 💰 الجزء الثاني عشر: الأنظمة المالية

## الحدود الدنيا والقصوى

### متجر الجملة
```
الحد الأدنى للفاتورة: 1500 ج.م
الحد الأقصى لكل منتج: تلقائي حسب المخزون
```

### جدول الحد الأقصى التلقائي
| المخزون | الحد الأقصى |
|---------|------------|
| 2 | 0 (غير متوفر) |
| 8 | 2 |
| 10 | 3 |
| 15 | 4 |
| 30 | 5 |
| 50 | 7 |
| > 50 | +2 لكل 5 وحدات |

### متجر القطاعي
```
الحد الأقصى للطلب = المخزون الحالي بالقطع
لا يوجد حد أدنى
```

## أسعار الشحن

### الجملة
| المدينة | السعر | شحن مجاني عند |
|---------|-------|---------------|
| طنطا | 125 | 5000 |
| المنصورة | 125 | 5000 |
| المحلة | 50 | 2000 |

### القطاعي
| المنطقة | السعر | شحن مجاني عند |
|---------|-------|---------------|
| الرجبي، أبو شاهين | 25 | 2500 |
| السبع بنات، الجمهورية، سكة زفتى، الشعبية، الشعراوي، العلو، الشون، المعهد الديني، شارع 10، البندر، المشحمة، أبو راضي | 35 | 2500 |
| الزراعة، أبو علي | 45 | 2500 |
| كفر حجازي | 50 | 2500 |

---

# 🎨 الجزء الثالث عشر: نظام التصميم

## الألوان
```css
:root {
  --navy: #1a2a4a;
  --navy-light: #2a3f6a;
  --navy-dark: #0f1a2e;
  --gold: #c9a84c;
  --gold-light: #e8d5a3;
  --gold-dark: #b8942a;
  --white: #ffffff;
  
  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-400: #94a3b8;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;
  
  --success: #22c55e;
  --danger: #ef4444;
  --warning: #f59e0b;
  --info: #3b82f6;
  
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 20px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 40px rgba(0,0,0,0.12);
  
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-full: 9999px;
  
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## الأنيميشن الموحد

```css
/* نزول الكروت (Drop In) */
@keyframes dropIn {
  0% { opacity: 0; transform: translateY(-40px) scale(0.9); }
  60% { opacity: 1; transform: translateY(4px) scale(1.01); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

/* نبض اللوجو */
@keyframes logo-pulse {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.05) rotate(2deg); }
}

/* شريط متلألئ */
@keyframes shimmer-move {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* نص متلألئ */
@keyframes text-shine {
  to { background-position: 200% center; }
}

/* عائم */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

---

# 📱 الجزء الرابع عشر: تصميم الموبايل (App-Like)

## القواعد الأساسية

```
❌ لا يوجد هيدر كامل
❌ لا يوجد فوتر
✅ شريط علوي مبسط
✅ تبويبات عليا حسب الصلاحية
✅ تبويبات سفلى حسب الصفحة
✅ شريط حقوق فقط في الأسفل
```

## Media Queries الذكية

```css
/* موبايل حقيقي (شاشة صغيرة + لمس) */
@media (max-width: 768px) and (pointer: coarse) {
  /* إخفاء الهيدر والفوتر */
  .smart-header, .smart-footer { display: none; }
  /* إظهار مكونات الموبايل */
  #mobile-top-bar, #mobile-top-tabs, 
  #mobile-bottom-tabs, #mobile-copyright { display: block; }
}

/* موبايل في Desktop Mode (شاشة كبيرة + لمس) */
@media (min-width: 769px) and (pointer: coarse) {
  /* الهيدر يظهر مع تعديلات */
}
```

## HTML موحد لكل صفحة

```html
<body>
  <!-- مكونات الموبايل -->
  <div id="mobile-top-bar"></div>
  <div id="mobile-top-tabs"></div>
  
  <!-- الهيدر (للأجهزة الكبيرة) -->
  <div id="header-placeholder"></div>
  
  <!-- محتوى الصفحة -->
  <main class="page-content">
    <div class="container">
      <!-- ... -->
    </div>
  </main>
  
  <!-- التبويبات السفلى -->
  <div id="mobile-bottom-tabs"></div>
  <div id="mobile-copyright"></div>
  
  <!-- الفوتر -->
  <div id="footer-placeholder"></div>
  
  <!-- السايدبار -->
  <div id="sidebar-placeholder"></div>
  
  <!-- Toast -->
  <div id="toast-container"></div>
  
  <!-- نافذة البحث -->
  <div class="search-modal-overlay" id="searchModalOverlay">
    <!-- ... -->
  </div>
  
  <!-- Scripts -->
</body>
```

---

# 📋 الجزء الخامس عشر: قواعد الصرامة

## Firestore Rules
```
- كل قراءة/كتابة تمر عبر قواعد صارمة
- ممنوع تجاوز الصلاحيات
- ممنوع قراءة سعر الشراء لغير السوبر أدمن
- الكاشير لا يمكنه الوصول إلا لبيانات فرعه
```

## JavaScript Validation
```
- التحقق من الصلاحية قبل كل عملية
- التحقق من الحدود (الكمية/السعر)
- التحقق من حالة المستخدم
- رسالة خطأ واضحة
```

## activityLog
```
تسجيل كل محاولة تجاوز:
{
  userId, userRole, action,
  details, timestamp, ip
}
```

---

# 🚀 الجزء السادس عشر: المراحل التنفيذية

## ✅ المرحلة صفر: التنظيف (100% مكتملة)

```
✅ حذف core.js, sidebar.js, admin.js
✅ كتابة CONSTITUTION.md
✅ إعادة كتابة firebase-config.js
✅ إعادة كتابة main.js
✅ إعادة كتابة public.js
✅ إصلاح style.css
✅ توحيد header.html, footer.html, sidebar.html
✅ تحديث قواعد Firestore
```

## 🔄 المرحلة 1: الصفحة الرئيسية والمتاجر (85% مكتملة)

| # | الملف | الحالة |
|---|-------|--------|
| 1 | `index.html` | ✅ |
| 2 | `public.js` | ✅ |
| 3 | `admin/sections-manager.html` | ✅ |
| 4 | `product-details.html` | ✅ |
| 5 | `store-retail.html` | ✅ |
| 6 | `categories.html` | ✅ |
| 7 | `store-wholesale.html` | ⏳ |
| 8 | `category-products.html` | ⏳ |
| 9 | `brand-products.html` | ⏳ |
| 10 | `offers.html` | ⏳ |
| 11 | `cart.html` | ⏳ |
| 12 | `checkout.html` | ⏳ |
| 13 | `order-success.html` | ⏳ |

## ⏳ المرحلة 2: صفحات العملاء (0%)

```
customer-login.html
trader-login.html
cashier-login.html
customer-home.html
trader-home.html
customer/profile.html
customer/orders.html
customer/invoices.html
customer/balance.html
tracking.html
wishlist.html
notifications.html
support.html
```

## ⏳ المرحلة 3: لوحة التحكم (0%)

```
admin/login.html
admin/home.html
admin/dashboard.html
admin/products.html
admin/customers.html
admin/orders.html
admin/invoices.html
admin/generate-codes.html
admin/profile.html
```

## ⏳ المرحلة 4: الأنظمة المالية (0%)

```
admin/suppliers.html
admin/purchases.html
admin/extract-pdf.html
admin/cashbox.html
admin/financial-reports.html
```

## ⏳ المرحلة 5: الأنظمة التشغيلية (0%)

```
admin/settings.html
admin/branches.html
admin/daily-sales.html
admin/barcode-scanner.html
admin/cashier.html
admin/ranks-levels.html
cashier/home.html
cashier/sales.html
cashier/inventory.html
cashier/purchases.html
cashier/barcode-scanner.html
```

---

# 🔑 الجزء السابع عشر: المفاتيح

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCdU3HadKWtzKtTAO9x7mcVPq6eodTqPzA",
  authDomain: "awlad-shalaan-wholesale.firebaseapp.com",
  projectId: "awlad-shalaan-wholesale",
  storageBucket: "awlad-shalaan-wholesale.firebasestorage.app",
  messagingSenderId: "390602001768",
  appId: "1:390602001768:web:05ec185f34ff0b5f7c1add"
};

const IMGBB_API_KEY = "cb056b7fd83c81129d5468c5d03287b4";
const GEMINI_API_KEY = "AQ.Ab8RN6J_44fb2fdP2YWWxwq0aNnG7DXJnSv3O8whicffxAj_g";
const WHATSAPP_NUMBER = "01120282953";
```

---

# 📚 الجزء الثامن عشر: المكتبات

| المكتبة | الاستخدام |
|---------|-----------|
| Firebase SDK 9.22.0 | قاعدة البيانات والمصادقة |
| Font Awesome 6.5.0 | الأيقونات |
| Google Fonts (Tajawal) | الخط |
| browser-image-compression | ضغط الصور |
| PDF.js | قراءة PDF |
| Gemini API | استخراج ذكي |
| html5-qrcode | قارئ الباركود |
| JsBarcode | توليد الباركود |

---

# ✅ الجزء التاسع عشر: قرارات نهائية

| # | القرار |
|---|--------|
| 1 | الدخول: Firebase Auth + localStorage + كود للتجار |
| 2 | العملاء: Email + Password |
| 3 | التجار: كود فقط |
| 4 | الصور: ImgBB فقط |
| 5 | ممنوع base64 و Firebase Storage |
| 6 | PDF: PDF.js + Gemini API |
| 7 | سعر الشراء: سوبر أدمن فقط |
| 8 | الحد الأدنى للجملة: 1500 |
| 9 | الحد الأقصى للقطاعي: المخزون |
| 10 | تبويبات العملاء: 4 + 4 فرعية |
| 11 | **الصفحة الرئيسية: 8 سيكشنات** |
| 12 | **الموبايل: تطبيق حقيقي بدون هيدر/فوتر** |
| 13 | **لا سكرول تلقائي — المستخدم يتحكم** |
| 14 | **نافذة البحث موحدة في كل الصفحات** |
| 15 | **صفحة الأقسام منفصلة (`categories.html`)** |
| 16 | **سيكشن "أولاد شعلان ستور" للقطاعي فقط** |
| 17 | **السيكشنات المخصصة من لوحة التحكم** |
| 18 | **الأنيميشن الموحد: `dropIn` للكروت** |
| 19 | الفروع: قابلة للإضافة |
| 20 | المستويات: قابلة للتخصيص |
| 21 | الترتيب: المرحلة صفر → 5 |

---

# 🎯 الجزء العشرون: تعليمات المحادثة الجديدة

```
عند بدء محادثة جديدة:
1. ارفع CONSTITUTION.md
2. ارفع آخر ملفات عملنا عليها
3. اكتب:
   "أنا أعمل على مشروع أولاد شعلان جملة.
   راجع الدستور أولاً.
   آخر ملف: [اسم الملف]
   المرحلة: [رقم المرحلة]
   أكمل من حيث توقفنا."
```

---

# 📊 الجزء الحادي والعشرون: إحصائيات المشروع

| العملية | العدد |
|---------|-------|
| ملفات تُمسح | 3 |
| ملفات تُعاد كتابتها | 7 |
| ملفات تُعدل | 16 |
| ملفات جديدة | 22 |
| **الإجمالي** | **48 ملف** |

| المرحلة | المدة | الحالة |
|---------|-------|--------|
| المرحلة صفر | 3-4 أيام | ✅ 100% |
| المرحلة 1 | 5-6 أيام | 🔄 85% |
| المرحلة 2 | 3 أيام | ⏳ 0% |
| المرحلة 3 | 3-4 أيام | ⏳ 0% |
| المرحلة 4 | 4-5 أيام | ⏳ 0% |
| المرحلة 5 | 5-6 أيام | ⏳ 0% |
| **الإجمالي** | **23-28 يوم** | **~30%** |

---

# 🎯 الجزء الثاني والعشرون: الأنظمة الكاملة (24 نظام)

| # | النظام | الحالة |
|---|--------|--------|
| 1 | المصادقة | ✅ |
| 2 | الهيدر الذكي | ✅ |
| 3 | الفوتر الذكي | ✅ |
| 4 | السايدبار الذكي | ✅ |
| 5 | تصميم الموبايل | ✅ |
| 6 | المنتجات | ✅ |
| 7 | التصنيفات | ✅ |
| 8 | البراندات | ✅ |
| 9 | العملاء والتجار | ⏳ |
| 10 | الطلبات | ⏳ |
| 11 | الفواتير | ⏳ |
| 12 | السلة | ⏳ |
| 13 | المفضلة | ✅ |
| 14 | الإشعارات | ✅ |
| 15 | الموردين | ⏳ |
| 16 | المشتريات | ⏳ |
| 17 | استخراج PDF | ⏳ |
| 18 | الصندوق | ⏳ |
| 19 | المبيعات اليومية | ⏳ |
| 20 | الفروع | ⏳ |
| 21 | المستويات | ⏳ |
| 22 | الكاشير | ⏳ |
| 23 | قارئ الباركود | ⏳ |
| 24 | التقارير المالية | ⏳ |
| **🆕** | **السيكشنات المخصصة** | ✅ |
| **🆕** | **صفحة الأقسام** | ✅ |
| **🆕** | **نافذة البحث الموحدة** | ✅ |

---

**✅ هذا هو المرجع الرسمي الكامل للمشروع.**

**عند بدء محادثة جديدة، ارفع هذا الملف أولاً.**

**آخر تحديث: 2026-09-22**
