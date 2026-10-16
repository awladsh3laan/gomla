# 📜 دستور مشروع أولاد شعلان للمنظفات والورقيات

**الإصدار:** 14.0 (النسخة الشاملة المحدثة — لما بعد المرحلة 2.5)
**آخر تحديث:** 2026-10-16
**هذا الملف هو المرجع الوحيد للمشروع**
**⚠️ استخدم هذا الملف كمرجع أساسي عند بدء محادثة جديدة**

---

## 📌 الجزء الأول: معلومات المشروع

| البند | التفاصيل |
|------|----------|
| **الاسم** | أولاد شعلان للمنظفات والورقيات |
| **النوع** | متجر إلكتروني (جملة + قطاعي) + لوحة تحكم + أنظمة مالية + كاشير + باركود + شركاء + نظام توصيل + إدارة محتوى |
| **الرابط** | https://awladsh3laan.github.io/gomla |
| **GitHub** | https://github.com/awladsh3laan/gomla.git |
| **التقنيات** | HTML + CSS + Vanilla JS + Firebase |
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

**تصميم الصفحة:** بني غامق (`#2d1b16` → `#3e2723` → `#5d4037`) + ذهبي

---

### 🆕 نظام دخول الموصلين (v1.0)

**صيغة الكود:**
```
DEL-{5 حروف/أرقام} + {علامة مميزة}
```

**العلامات:** `@#$`, `@#%`, `@#&`, `@#*`, `@$%`, `@$&`, `@$*`, `#$%`, `#$&`, `#$*`, `$%&`, `$%*`

**الإيميل والـ Auth:**
```
Email:    del-{code-lowercase}@delivery.awladshalaan.com
Password: {code}
```

**خطوات الدخول:**
1. الموصل يفتح `delivery-login.html` (تصميم عمودين + أخضر داكن)
2. يدخل الكود
3. النظام يقرأ `delivery_lookup/{CODE}`
4. `signInWithEmailAndPassword(authEmail, code)`
5. التحقق من UID
6. جلب البيانات من `delivery_agents/{uid}`
7. التحقق من `active === true`
8. حفظ في `localStorage.deliveryData`
9. التوجيه لـ `delivery/home.html`

**تصميم الصفحة:** أخضر داكن (`#064e3b` → `#047857` → `#059669`)

---

### 🎨 تصميم صفحات الدخول الموحّد (v14.0)

**كل صفحات login بتصميم عمودين:**
- 🖼️ **العمود الأيسر:** صورة الترحيب + أنيميشنات (imageZoomIn, shineSweep, floating-dots)
- 🔐 **العمود الأيمن:** الفورم

| الصفحة | اللون | الصورة |
|--------|-------|--------|
| `admin/login.html` | Navy + Gold | `welcom-admin.jpg` |
| `cashier-login.html` | بنفسجي (`#4c1d95` → `#7c3aed`) | `welcome-cashier.jpg` |
| `customer-login.html` | سماوي + ذهبي (`#0c4a6e` → `#0284c7` → `#c9a84c`) | `welcome-customer.jpg` |
| `trader-login.html` | بني + ذهبي (`#2d1b16` → `#3e2723` → `#5d4037`) | `welcom-trader.jpg` |
| `delivery-login.html` | أخضر داكن (`#064e3b` → `#059669`) | `welcom-delivarey.jpg` |

**الأنيميشنات الموحدة:**
- `cardEnter` — دخول البطاقة
- `imageZoomIn` — تكبير الصورة
- `shineSweep` — شريط لامع على الصورة
- `badgePulse` — نبض البادج
- `iconSpin` — دوران أيقونة البادج
- `textFloat` — طفو النص
- `dotFloat` — نقاط ضوئية عائمة
- `iconFloat` — أيقونة الفورم العائمة
- `rippleRing` — حلقة حول الأيقونة
- `bgFloat1/2` — دوائر خلفية متحركة

---

### 🆕 Firebase Secondary App

**الاستخدام:** `admin/generate-codes.html` + `admin/delivery-agents.html`

**الحل:**
```javascript
const secondaryApp = firebase.initializeApp(firebaseConfig, 'Secondary-' + Date.now());
const secondaryAuth = secondaryApp.auth();
await secondaryAuth.createUserWithEmailAndPassword(email, password);
await secondaryAuth.signOut();
await secondaryApp.delete();
```

---

### 🆕 نظام طلبات التسجيل (v14.0)

**كولكشن جديد:** `registration_requests`

```javascript
{
  type: 'trader' | 'delivery',
  requestedCode: 'trader_code' | 'delivery_code',
  
  // بيانات مشتركة
  name, phone, whatsapp,
  
  // للتاجر
  shopName, city, fullAddress,
  businessType: 'cash' | 'credit',
  creditLimit: 0-5000,
  paymentDays: 1-10,
  
  // للموصل
  vehicleType, coverageArea,
  
  notes, attachments,
  status: 'pending' | 'approved' | 'rejected',
  reviewedBy, reviewedByName, reviewedAt,
  adminNotes,
  createdAt, updatedAt
}
```

**الآلية:**
1. المستخدم يفتح `register-guide.html`
2. يختار نوع التسجيل:
   - 🛒 عميل → زر يفتح `customer-register.html` (ذاتي فوري)
   - 🏪 تاجر → 3 أزرار: (فورم Modal → Firestore) / (واتساب) / (إيميل)
   - 🚚 موصل → 3 أزرار: (فورم Modal → Firestore) / (واتساب) / (إيميل)
3. الأدمن يشوف الطلبات في `admin/registration-requests.html`
4. يوافق أو يرفض
5. عند الموافقة → ينشئ الحساب يدوياً من `generate-codes.html` أو `delivery-agents.html`

---

### الأدوار والصلاحيات

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

### 👑 السوبر أدمن (super)
- كل شيء بدون قيود
- إدارة كاملة + رؤية سعر الشراء
- إدارة الصلاحيات والإعدادات + الشركاء + السيكشنات
- توليد أكواد التجار + الموصلين
- **إدارة المحتوى** (`admin/content-manager.html`)
- استقبال وحل النزاعات المالية
- **حذف الطلبات نهائياً من Firebase**
- **حذف الموصلين**

### 💎 أدمن بلص (admin_plus)
- إدارة المنتجات كاملة
- إدارة الطلبات والعملاء والمتاجر
- إدارة الفروع والمبيعات والصندوق
- **إدارة الموصلين** (إضافة / تعديل / تعطيل)
- **مراجعة طلبات التسجيل** (`admin/registration-requests.html`)
- استقبال الإبلاغات المالية
- ❌ ممنوع: الصلاحيات، الإعدادات، توليد الأكواد، الشركاء، الحذف النهائي، إدارة المحتوى

### 🛡️ الأدمن (admin)
- إدارة المنتجات (بدون حذف)
- عرض سعر الشراء (قراءة)
- تعديل سعر البيع
- إدارة الطلبات والفواتير
- تعديل بيانات العملاء (اسم/هاتف فقط)
- ❌ ممنوع: حذف المنتجات، تعديل سعر الشراء، الصلاحيات، الفروع، الموصلين، إدارة المحتوى

### 🏪 التاجر (wholesale)
- Firebase Auth حقيقي (يدخل بالكود)
- تسوق من متجر الجملة
- حد أدنى 1500 ج.م
- عرض كل الأسعار والهامش
- ملاحظات التاجر
- إمكانية الإبلاغ عن السداد
- ❌ ممنوع: سعر الشراء، لوحة التحكم، صفحة العروض

### 👤 العميل (retail)
- تسوق من متجر القطاعي
- حد أقصى = المخزون
- سعر قطاعي فقط
- المفضلة + عروض
- إمكانية الإبلاغ عن السداد
- ❌ ممنوع: أسعار الجملة والشراء، الهامش، صفحة الخصومات

### 👻 الزائر (guest)
- تصفح متجر القطاعي
- إضافة للسلة وإنشاء طلب
- تتبع الطلبات (isGuest)
- ❌ ممنوع: متجر الجملة، لوحة التحكم، العروض، الخصومات

### 🧑‍💻 الكاشير (cashier)
- تصفح المتجرين
- إنشاء فواتير من فرعه
- إدارة مخزون الفرع
- قارئ الباركود
- ❌ ممنوع: عملاء المتاجر، المتاجر، الصفحات الإدارية

### 🚚 الموصل (delivery)
- Firebase Auth حقيقي (يدخل بالكود)
- عرض لوحة خاصة `delivery/home.html`
- استلام الأوردرات المسندة له
- **طلب أوردرات من منطقته** (`delivery/available.html`)
- تأكيد الاستلام من المخزن
- تأكيد التسليم للعميل
- **تحصيل الكاش من العملاء**
- متابعة تحصيلاته (`delivery/collections.html`)
- عرض بروفايله (`delivery/profile.html`)
- ❌ ممنوع: باقي المتجر، لوحة التحكم، العملاء، المنتجات

**قواعد مالية مهمة:**
- 💵 فلوس المنتجات → تُسلَّم للأدمن (تدخل الصندوق تحت بند "أوردرات دليفري")
- 🚚 فلوس الشحن → من حق الموصل (أجرة توصيله)

---

### 🛡️ دوال الحماية المتقدمة

| الدالة | الأدوار المسموح بها | الاستخدام |
|-------|---------------------|-----------|
| `protectPage()` | أي مسجل | صفحات عامة |
| `protectAdminPage()` | SUPER + ADMIN_PLUS + ADMIN | صفحات أدمن عامة |
| `protectSuperAdminPage()` | SUPER فقط | settings, generate-codes, partners, content-manager |
| `protectAdminPlusPage()` | SUPER + ADMIN_PLUS | suppliers, purchases, cashbox, financial-transactions, delivery-agents, **registration-requests** |
| `protectCashierPage()` | CASHIER + كل الأدمن | صفحات cashier |
| `protectCustomerPage()` | RETAIL + WHOLESALE | صفحات العملاء |
| `protectDeliveryPage()` | DELIVERY (active) | صفحات delivery |

**منطق الحماية:**
1. مش مسجل → صفحة الدخول المناسبة
2. مسجل بدور غير مصرح:
   - عميل يدخل صفحة أدمن → `/gomla/` + Toast "ليس لديك صلاحية"
   - أدمن يدخل صفحة super → `admin/home.html` + Toast "الصفحة تتطلب: ..."
   - موصل معطل → `delivery-login.html` + Toast
3. مسجل بالدور الصحيح → ✅ يدخل

**دوال مساعدة:**
- `getRoleArabicName(role)`
- `_redirectWithToast(url, msg, delay)`
- `isSuperAdmin()`, `isAdminPlus()`, `isAdmin()`, `isCashier()`, `isWholesale()`, `isRetail()`, `isCustomer()`, `isGuest()`, `isDelivery()`, `isDeliveryActive()`

---

### 🔔 نظام الجلسات المتعددة

**الملفات المراقبة:**
```javascript
const WATCHED_KEYS = ['admin', 'customer', 'cashier', 'deliveryData'];
```

**عند تغيير المفاتيح في tab آخر:**
- Overlay احترافي
- عدّاد دائري SVG 5 ثواني
- زر "الانتقال الآن"
- إعادة تحميل/تحويل تلقائي

**صفحات مستثناة:** `*-login.html` + `login.html`

**تفريق login/logout:**
- login جديد → "تم تسجيل الدخول بحساب آخر (موصل/تاجر)" + reload
- logout → "تم تسجيل الخروج" + تحويل للرئيسية

---

## 🏠 الجزء الثالث: الصفحة الرئيسية index.html

### هيكل الصفحة (8 سيكشنات)

```
1. 🎞️ سيكشن السلايدر (من Firestore)
2. 🏪 سيكشن كروت المتاجر (جملة + قطاعي)
3. سيكشن أحدث المنتجات
4. سيكشن أحدث العروض
5. سيكشن المنتجات الأكثر طلباً
6. سيكشنات مخصصة (من لوحة التحكم)
7. سيكشن نبذة عن أولاد شعلان
8. سيكشن تواصل معنا (واتساب + جيميل)
```

### السيكشنات المخصصة

**5 أنواع متاحة:** إعلانات بنرات / عرض منتجات / كروت بروابط / فيديوهات / صور
**الكولكشن:** `custom_sections`
**اللوحة:** `admin/sections-manager.html` (سوبر أدمن فقط)

---

## 📄 الجزء الرابع: صفحة تفاصيل المنتج product-details.html

### عرض حسب الصلاحية

**🏪 للتاجر والأدمن:** سعر الجملة + سعر المستهلك + هامش الربح + المخزون + ملاحظات التاجر

**👤 للعميل والزائر:** السعر القطاعي + "قطعة" + الوصف + البراند + التصنيف + المخزون

**👑 للسوبر أدمن:** كل ما سبق + سعر الشراء + زر تعديل المنتج

---

## 🏪 الجزء الخامس: المتاجر

### 1. المتجر القطاعي store-retail.html

**Brand Hero:**
- صورة: `https://i.ibb.co/v4xBgMPP/Picsart-26-09-21-04-43-12-322.png`
- الشعار: "أولاد شعلان ستور"
- 3 مميزات: منتجات أصلية، توصيل سريع، دعم فوري

**السيكشنات:**
```
1. Brand Hero
2. السلايدر
3. البحث
4. أحدث المنتجات (سعر قطاعي)
5. البراندات
6. العروض (offers.html)
7. الأقسام (categories.html)
8. جميع المنتجات
```

### 2. المتجر الجملة store-wholesale.html

**Brand Hero:**
- صورة: `https://i.ibb.co/RTCSsZxg/Picsart-26-09-23-04-01-50-093.png`
- الشعار: "أولاد شعلان جملة"
- 4 مميزات: خصومات للتجار، فواتير آجلة، توصيل سريع، دعم مخصص

**السيكشنات:**
```
1. Brand Hero
2. السلايدر
3. البحث
4. أحدث المنتجات (سعر جملة)
5. البراندات
6. الخصومات (discounts.html)
7. الأقسام (categories.html?type=wholesale)
8. جميع المنتجات
9. شركاء النجاح
```

### 3. الفرق بين المتجرين

| العنصر | القطاعي | الجملة |
|--------|---------|--------|
| الجمهور | العملاء والزوار | التجار فقط |
| السعر | قطاعي | جملة + هامش |
| الوحدة | قطعة | كرتونة/بالة |
| العروض | ✅ (offers.html) | ❌ |
| الخصومات | ❌ | ✅ (discounts.html) |
| الشركاء | ❌ | ✅ |
| ملاحظات التاجر | ❌ | ✅ |

---

## 📂 الجزء السادس: صفحة الأقسام categories.html

**الهيكل:**
```
1. شريط العنوان (Hero Bar)
2. شبكة الأقسام
```

**المميزات:** أنيميشن dropIn + تأخير 0.05s لكل كارت + عدد المنتجات حقيقي + الفلترة للفارغة + الرابط الذكي `?type=retail/wholesale`

---

## 📄 الجزء السابع: صفحة منتجات القسم category-products.html

**الهيكل:**
```
1. Breadcrumb
2. شريط مضغوط (Sticky)
3. شرائح البراندات (Chips)
4. فلاتر (ترتيب + توفّر)
5. شبكة المنتجات
```

**السعر حسب المستخدم:** عميل → retailPrice + "قطعة" / تاجر → wholesalePrice + وحدة المنتج

---

## 🎯 الجزء الثامن: نظام العروض والخصومات

| النظام | المتجر | يظهر لـ | الصفحة | الوحدة |
|--------|--------|---------|--------|--------|
| العروض | القطاعي | العملاء والزوار | offers.html | قطعة |
| الخصومات | الجملة | التجار والأدمن | discounts.html | كرتونة/بالة |

### حقول المنتج

```javascript
{
  hasRetailOffer: false,
  retailOfferPrice: 0,
  retailOfferStartDate: null,
  retailOfferEndDate: null,
  
  hasWholesaleDiscount: false,
  wholesaleDiscountPercent: 0,
  wholesaleDiscountStartDate: null,
  wholesaleDiscountEndDate: null,
  
  traderNotes: ''
}
```

---

## 💳 الجزء التاسع: نظام طرق الدفع

### المفهوم

عند إتمام الطلب، العميل يختار طريقة دفع واحدة:

| # | الطريقة | الرسوم | الرمز |
|---|--------|-------|-------|
| 1 | الدفع عند الاستلام | 0% | `cash` |
| 2 | إنستا باي | 0% | `instapay` |
| 3 | محفظة إلكترونية | **+1%** | `wallet` |

### رقم الحساب
```
01068385028
```

### المعادلة

```javascript
baseTotal = subtotal + shippingCost
paymentFee = method === 'wallet' ? baseTotal × 0.01 : 0
totalBeforeRound = baseTotal + paymentFee
grandTotal = roundToNearest5(totalBeforeRound)
```

### 🔢 قاعدة التدوير

**الإجمالي دائمًا رقم صحيح ينتهي بـ 0 أو 5:**
```javascript
function roundToNearest5(amount) {
  return Math.round(amount / 5) * 5;
}
```

**أمثلة:**
| الأصلي | بعد التدوير |
|--------|-------------|
| 1139.25 | 1140 |
| 1226 | 1225 |
| 8 → 10 | 3 → 5 |
| 9 → 10 | 6 → 5 |
| 11 → 10 | 7 → 5 |
| 12 → 10 | 2 → 0 |

### حقول الطلب الجديدة

```javascript
{
  paymentMethod: 'cash' | 'instapay' | 'wallet',
  paymentMethodLabel: 'الدفع عند الاستلام',
  paymentFeePercent: 0 | 0 | 1,
  paymentFee: 0 | 0 | 11.25,
  grandTotal: 1135,
  paymentProof: '',
  paymentProofUploadedAt: null,
  paymentStatus: 'unpaid' | 'pending' | 'paid',
  paid: 0,
  remaining: grandTotal
}
```

### في checkout.html
- 3 كروت قابلة للاختيار
- ملخص الطلب يتحدث لحظياً (مع صف رسوم المحفظة)

### في order-success.html
- صندوق طريقة الدفع (ملون حسب الطريقة)
- رقم الحساب + زر نسخ
- عرض صورة الإثبات (Thumbnail)
- الإجمالي النهائي المُدوّر

---

## 🚚 الجزء العاشر: نظام الموصلين

### المفهوم

نظام كامل لموظفي التوصيل بحيث:
- يشوفوا أوردراتهم فقط + أوردرات منطقتهم المتاحة
- يأكدوا الاستلام من المخزن
- يأكدوا التسليم للعميل
- يأكدوا تحصيل الفلوس
- الأدمن يتابع كل واحد عنده كام فلوس

### 🗄️ الكولكشنز

#### 1. `delivery_agents/{uid}`

```javascript
{
  uid, name, phone, phone2,
  email: "del-{code}@delivery.awladshalaan.com",
  code: "DEL-A2B4C5@#$",
  area, vehicle, vehicleNumber,
  active: true, role: 'delivery', type: 'delivery',
  avatar,
  totalDelivered: 0, totalCollected: 0,
  currentCashOnHand: 0, pendingOrdersCount: 0,
  createdAt, updatedAt, createdBy,
  lastLoginAt, disabledAt, disabledReason
}
```

#### 2. `delivery_lookup/{CODE}`
Doc ID = الكود
```javascript
{
  deliveryAgentId, authEmail, name, phone,
  area, vehicle, code, role, type,
  avatar, active, currentCashOnHand, totalDelivered,
  createdAt, updatedAt
}
```

#### 3. `delivery_collections/{id}`

```javascript
{
  deliveryAgentId, deliveryAgentName,
  orderId, orderNumber, amount,
  type: 'collect' | 'settle',
  method: 'cash' | 'instapay' | 'wallet',
  status: 'pending' | 'confirmed',
  confirmedBy, confirmedByName, notes,
  createdAt
}
```

### حقول الطلب الإضافية

```javascript
{
  // التوصيل
  deliveryAgentId, deliveryAgentName, deliveryAgentPhone,
  assignedAt, assignedBy,
  deliveryStatus: 'unassigned' | 'assigned' | 'picked_up' | 'delivered' | 'failed',
  pickedUpAt, deliveredAt, failedReason, deliveryNotes,
  
  // التحصيل
  cashCollected, cashCollectedAt,
  cashHandedToAdmin, cashHandedAt,
  
  // تأكيد العميل
  confirmedByCustomer, customerConfirmedAt, customerFeedback
}
```

### سير العمل الكامل

```
1. العميل يعمل أوردر → deliveryStatus: 'unassigned'
2. الأدمن يعيّن موصل → deliveryStatus: 'assigned'
   ⚠️ أو الموصل يقبل بنفسه من available.html → assignedBy: 'self'
3. الموصل يستلم من المخزن → 'picked_up', pickedUpAt: now
4. الموصل يسلّم للعميل → 'delivered', deliveredAt: now
   → لو cash: يحصّل المبلغ → currentCashOnHand += amount
5. الأدمن يصفّي مع الموصل → delivery_collections: type 'settle'
```

### 💰 تقسيم الفلوس

```
الفلوس اللي الموصل بيحصلها من العميل:
├── 💵 فلوس المنتجات (subtotal) → الصندوق تحت بند "أوردرات دليفري"
└── 🚚 فلوس الشحن (shippingCost) → من حق الموصل
```

**مثال:**
```
أوردر 1135 ج.م
  ├── منتجات: 1000 ج.م → الصندوق
  └── شحن: 125 ج.م → جيب الموصل
```

### 📄 صفحات الموصلين — الحالة

| # | الملف | الحالة |
|---|-------|-------|
| 1 | `delivery-login.html` | ✅ تم (v1.0 + حماية) |
| 2 | `delivery/home.html` | ✅ تم (v1.0) |
| 3 | `delivery/orders.html` | ✅ تم (v1.0) |
| 4 | `delivery/available.html` | ✅ تم (v1.0) |
| 5 | `delivery/order-details.html` | ✅ تم (v1.0) |
| 6 | `delivery/collections.html` | ✅ تم (v1.0) |
| 7 | `delivery/profile.html` | ✅ تم (v1.0) |

### 📄 صفحات إدارة الموصلين — الحالة

| # | الملف | الحالة |
|---|-------|-------|
| 1 | `admin/delivery-agents.html` | ✅ تم (v1.0) |
| 2 | `admin/assign-delivery.html` | ⏳ متبقي |
| 3 | `admin/delivery-settlements.html` | ⏳ متبقي |

---

## 💰 الجزء الحادي عشر: نظام الإبلاغ عن السداد

### المفهوم

لو العميل/التاجر دفع للمسؤول لكن المسؤول نسي يسجل الدفع:
1. العميل يفتح `customer/balance.html`
2. يضغط "أبلغ عن سداد"
3. يملأ الموديل → `financial_notifications`
4. يظهر في `admin/financial-transactions.html`
5. الأدمن يعتمد/يرفض
6. عند الاعتماد: خصم تلقائي من الرصيد + إشعار

### كولكشن `financial_notifications`

```javascript
{
  type: 'customer_payment' | 'trader_payment' | 'debt_claim' | 'purchase_payment' | 'dispute',
  senderId, senderName, senderRole, senderPhone, senderCode,
  amount, paymentDate, method, receiver, reference,
  notes, receiptUrl,
  status: 'pending' | 'approved' | 'rejected',
  reviewedBy, reviewedByName, reviewedAt, adminNotes,
  balanceAtReport,
  createdAt, updatedAt
}
```

---

## 🤝 الجزء الثاني عشر: نظام الشركاء

**المفهوم:** الشركاء = التجار والمحلات. يظهروا في سيكشن "شركاء النجاح" في متجر الجملة. السوبر أدمن فقط يديرهم.

```javascript
// partners collection
{ id, name, description, imageUrl, order, active, createdAt, updatedAt }
```

---

## 🎫 الجزء الثالث عشر: نظام تذاكر الدعم

### كولكشن `support_tickets`

```javascript
{
  ticketNumber: "TKT-123456",
  senderId, senderName, senderRole, senderPhone, senderCode,
  category: 'complaint'|'inquiry'|'request'|'suggestion'|'financial',
  priority: 'normal'|'high'|'urgent',
  subject, details, attachments: [],
  status: 'open' | 'processing' | 'closed',
  replies: [{by, byName, byRole, text, at, isInitial}],
  rating: 0,
  createdAt, updatedAt, lastReplyAt, closedAt
}
```

### الصفحات
- `support.html` — للعملاء (FAQ + فتح تذكرة + متابعة)
- `admin/support.html` — للإدارة (SUPER + ADMIN_PLUS + ADMIN)

---

## 🔒 الجزء الرابع عشر: نظام إدارة المحتوى الموحّد (v14.0)

### المفهوم

**صفحة إدارة واحدة** (`admin/content-manager.html`) تدير **5 صفحات قانونية ومعلوماتية** من مكان واحد.

### الصفحات الـ5

| # | الصفحة العامة | الكولكشن | Meta |
|---|--------------|----------|------|
| 1 | `privacy-policy.html` | `privacy_sections` | `privacy_meta` |
| 2 | `shipping-policy.html` | `shipping_sections` | `shipping_meta` |
| 3 | `exchange-policy.html` | `exchange_sections` | `exchange_meta` |
| 4 | `terms.html` | `terms_sections` | `terms_meta` |
| 5 | `faq.html` | `faq_sections` | `faq_meta` |

### هيكل `admin/content-manager.html`

- 5 تبويبات في الأعلى
- إحصائيات (إجمالي/نشطة/مخفية/آخر تحديث)
- إضافة/تعديل/حذف/ترتيب/إخفاء الأقسام
- استيراد افتراضي لكل تبويب
- 8 أنواع محتوى: `text`, `quote`, `list`, `cards`, `table`, `contact`, `steps`, `faq`

### كولكشن `sections` الموحد

```javascript
{
  order: 1,
  title: "مقدمة",
  icon: "fa-book-open",
  bodyType: "text" | "list" | "cards" | "table" | "quote" | "contact" | "steps" | "faq",
  body: "...",
  items: [],
  active: true,
  createdAt, updatedAt
}
```

### قواعد Firestore

```javascript
match /privacy_sections/{sectionId} {
  allow read: if true;
  allow create, update, delete: if isSuperAdmin();
}
// + نفس القاعدة لكل من:
// shipping_sections, exchange_sections, terms_sections, faq_sections
```

---

## 🚪 الجزء الخامس عشر: بوابة الدخول login.html (v3.0)

### الهيكل

```
1. خلفية كحلية متدرجة + دوائر ذهبية متحركة + نقاط ضوئية
2. Hero: صورة ترحيب + نص جانبي + 4 features
3. 5 كروت دخول:
   - 👑 الإدارة (Navy)
   - 🏪 التجار (Gold)
   - 👤 العملاء (Blue)
   - 🧑‍💻 الكاشير (Purple)
   - 🚚 الموصلين (Green)
4. قسم "مستخدم جديد؟":
   - تسجيل عميل → customer-register.html
   - طلب كود تاجر → register-guide.html#trader-section
   - انضم لفريق التوصيل → register-guide.html#delivery-section
5. زر العودة للرئيسية
```

**صورة الترحيب:** `https://i.ibb.co/YFcjtFHQ/welcome-user.jpg`

**التوجيه حسب الدور:**
| الدور | الوجهة |
|-------|--------|
| Super/Admin+/Admin | `/admin/home.html` |
| Wholesale | `/trader-home.html` |
| Retail | `/customer-home.html` |
| Cashier | `/cashier/home.html` |
| Delivery | `/delivery/home.html` |

---

## 📝 الجزء السادس عشر: دليل التسجيل register-guide.html (v1.0)

### الفكرة

صفحة واحدة تشرح **كل طرق التسجيل** في المنصة:

1. 🛒 **تسجيل عميل** — زر ينقل لـ `customer-register.html` (ذاتي فوري)
2. 🏪 **تسجيل تاجر** — 3 أزرار (فورم Modal + واتساب + إيميل)
3. 🚚 **تسجيل موصل** — 3 أزرار (فورم Modal + واتساب + إيميل)

### الهيكل

```
1. Hero + 3 أزرار سريعة (scroll للأقسام)
2. قسم عميل (أزرق) — مميزات + خطوات + زر "افتح صفحة تسجيل عميل"
3. قسم تاجر (بني/ذهبي) — مميزات + بيانات + نظام الآجل + 3 أزرار
4. قسم موصل (أخضر) — مميزات + بيانات + تقسيم الفلوس + 3 أزرار
5. مقارنة سريعة (جدول)
6. التواصل (واتساب + إيميل + دعم)
```

### نموذج طلب التاجر (Modal)

الحقول: الاسم + المحل + المدينة + العنوان + واتساب + طريقة التعامل + (ليميت الآجل + مدة السداد لو آجل) + ملاحظات

### نموذج طلب الموصل (Modal)

الحقول: الاسم + واتساب + نوع المركبة + المنطقة + ملاحظات

### آلية الإرسال

عند ضغط "إرسال الطلب" →
1. حفظ في `registration_requests` (Firestore)
2. إنشاء إشعار في `admin_notifications`
3. عرض رسالة نجاح
4. **سؤال:** "هل تحب إرسال نسخة عبر الواتساب لتسريع المراجعة؟"
5. لو أيوه → يفتح واتساب مع نص جاهز

### الملفات المرتبطة

- `register-guide.html` — ✅ تم
- `admin/registration-requests.html` — ✅ تم (صفحة إدارة الطلبات للسوبر/أدمن بلص)

---

## 📄 الجزء السابع عشر: إدارة طلبات التسجيل admin/registration-requests.html

### المفهوم

صفحة للسوبر أدمن + أدمن بلص لمراجعة طلبات التجار والموصلين.

### الميزات
- 4 إحصائيات (إجمالي/معلّقة/تجار/موصلين)
- 6 تبويبات فلترة
- بحث (اسم/هاتف/محل)
- كارت لكل طلب + تفاصيل كاملة
- **موافقة** → تتحول لـ `approved` → يظهر زر "إنشاء حساب"
- **رفض** → Modal بسبب الرفض

### التوجيه عند الموافقة
- تاجر → `generate-codes.html`
- موصل → `delivery-agents.html`

---

## 🛒 الجزء الثامن عشر: السلة والدفع

### cart.html
- دعم المسجل (Firestore) + الزائر (localStorage) + التاجر (Firestore)
- الحد الأدنى للجملة (1500 ج.م)

### checkout.html (v4.0)
- 3 طرق دفع + تدوير الإجمالي
- رفع إثبات تحويل (ImgBB)

### order-success.html (v2.0)
- صندوق الدفع + رقم الحساب + إثبات التحويل

---

## 📱 الجزء التاسع عشر: تصميم الموبايل (App-Like)

### المبادئ

```
❌ لا يوجد هيدر كامل
❌ لا يوجد فوتر
✅ شريط علوي مبسط (ثابت)
✅ تبويبات عليا حسب الصلاحية (ثابتة)
✅ تبويبات سفلى حسب الصفحة
✅ شريط حقوق فقط في الأسفل
```

### قواعد مهمة

```
✅ overflow-x: hidden على html/body
✅ overscroll-behavior-x: contain
✅ min-width: 0 على الآباء
✅ تحويل الجداول لـ Cards
✅ padding-top للـ body
✅ منع السكرول التلقائي (استثناء: السلايدر الرئيسي)
```

---

## 🗄️ الجزء العشرون: هيكل الملفات المحدّث (v14.0)

```
📁 gomla/
├── 📁 assets/
│   ├── css/style.css
│   ├── js/
│   │   ├── firebase-config.js      (v7.0) ✅
│   │   ├── main.js                 (v7.0) ✅
│   │   └── public.js
│   ├── components/
│   │   ├── header.html             ✅
│   │   ├── footer.html             ✅ (v2.0 - واتساب محدّث)
│   │   └── sidebar.html
│   └── images/
│
├── 📁 admin/
│   ├── login.html                  ✅ (v2.1 + حماية)
│   ├── home.html                   ⏳
│   ├── dashboard.html              ⏳
│   ├── products.html               ⏳
│   ├── customers.html              ⏳
│   ├── orders.html                 ✅ (v3.0 يحتاج تحديث عمود الموصل)
│   ├── invoices.html               ⏳
│   ├── suppliers.html              ⏳
│   ├── purchases.html              ⏳
│   ├── extract-pdf.html            ⏳
│   ├── cashbox.html                ⏳ (يحتاج بند أوردرات دليفري)
│   ├── daily-sales.html            ⏳
│   ├── barcode-scanner.html        ⏳
│   ├── financial-reports.html      ⏳
│   ├── ranks-levels.html           ⏳
│   ├── settings.html               ⏳
│   ├── branches.html               ⏳
│   ├── cashier.html                ⏳
│   ├── generate-codes.html         ✅
│   ├── sections-manager.html       ✅
│   ├── partners-manager.html       ✅
│   ├── financial-transactions.html ✅
│   ├── support.html                ✅ (v1.0)
│   ├── content-manager.html        ✅ (v1.0 - يدمج 5 صفحات)
│   ├── delivery-agents.html        ✅ (v1.0)
│   ├── assign-delivery.html        ⏳ (التالي)
│   ├── delivery-settlements.html   ⏳
│   ├── registration-requests.html  ✅ (v1.0)
│   └── profile.html                ⏳
│
├── 📁 cashier/
│   ├── home.html                   ⏳
│   ├── sales.html                  ⏳
│   ├── inventory.html              ⏳
│   ├── purchases.html              ⏳
│   └── barcode-scanner.html        ⏳
│
├── 📁 customer/
│   ├── profile.html                ⏳
│   ├── orders.html                 ⏳ (يحتاج زر تأكيد الاستلام)
│   ├── invoices.html               ⏳
│   └── balance.html                ✅
│
├── 📁 delivery/                    ✅ كل الصفحات
│   ├── home.html                   ✅ (v1.0)
│   ├── orders.html                 ✅ (v1.0)
│   ├── available.html              ✅ (v1.0)
│   ├── order-details.html          ✅ (v1.0)
│   ├── collections.html            ✅ (v1.0)
│   └── profile.html                ✅ (v1.0)
│
├── 📄 الصفحات العامة:
├── index.html                      ✅
├── store-wholesale.html            ✅
├── store-retail.html               ✅
├── categories.html                 ✅
├── category-products.html          ✅
├── brand-products.html             ✅
├── offers.html                     ✅
├── discounts.html                  ✅
├── cart.html                       ✅
├── checkout.html                   ✅ (v4.0)
├── order-success.html              ✅ (v2.0)
├── product-details.html            ✅
├── login.html                      ✅ (v3.0 - 5 كروت)
├── customer-register.html          ✅ (v2.0 + حماية)
├── customer-login.html             ✅ (v2.0 - عمودين + سماوي/ذهبي + حماية)
├── trader-login.html               ✅ (v3.0 - عمودين + بني + حماية)
├── cashier-login.html              ✅ (v2.0 - عمودين + بنفسجي + حماية)
├── delivery-login.html             ✅ (v1.0 - عمودين + أخضر + حماية)
├── customer-home.html              ⏳
├── trader-home.html                ⏳
├── tracking.html                   ✅
├── wishlist.html                   ✅
├── notifications.html              ✅
├── support.html                    ✅
├── about.html                      ✅
├── privacy-policy.html             ✅
├── shipping-policy.html            ✅ (v1.0)
├── exchange-policy.html            ✅ (v1.0)
├── terms.html                      ✅ (v1.0)
├── faq.html                        ✅ (v1.0)
├── register-guide.html             ✅ (v1.0 + حماية)
├── CONSTITUTION.md
└── README.md
```

---

## 🗄️ الجزء الحادي والعشرون: كولكشنز Firestore المحدّثة

| الكولكشن | الوصف | الوصول |
|----------|-------|--------|
| `admins` | المديرين + السوبر + أدمن بلص | خاص |
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
| `notifications` | الإشعارات العامة | المستخدم نفسه |
| `customer_notifications` | إشعارات العملاء | المستخدم نفسه |
| `admin_notifications` | إشعارات الأدمن | المستخدم نفسه |
| `activityLog` | سجل النشاط | الإدارة |
| `quotes` | المقولات | عام |
| `news` | الأخبار | عام |
| `ads` | الإعلانات | عام |
| `slider` | السلايدر | عام |
| `barcode_scans` | سجل الباركود | الإدارة + الكاشير |
| `custom_sections` | السيكشنات المخصصة | عام (قراءة) |
| `site_content` | محتوى الموقع | عام (قراءة) |
| `partners` | الشركاء | عام (قراءة) |
| `trader_lookup` | كود التاجر (Doc ID = الكود) | get عام، list ممنوع |
| `financial_notifications` | إبلاغات السداد | حسب الصلاحية |
| `support_tickets` | تذاكر الدعم | حسب الصلاحية |
| `public_stats` | الإحصائيات العامة | عام (قراءة) |
| `delivery_agents` | الموصلين | حسب الصلاحية |
| `delivery_lookup` | كود الموصل (Doc ID = الكود) | get عام، list ممنوع |
| `delivery_collections` | تحصيلات الموصلين | حسب الصلاحية |
| **🆕 `privacy_sections`** | سياسة الخصوصية | عام (قراءة) |
| **🆕 `shipping_sections`** | سياسة الشحن | عام (قراءة) |
| **🆕 `exchange_sections`** | الاستبدال والإرجاع | عام (قراءة) |
| **🆕 `terms_sections`** | الشروط والأحكام | عام (قراءة) |
| **🆕 `faq_sections`** | الأسئلة الشائعة | عام (قراءة) |
| **🆕 `registration_requests`** | طلبات التسجيل | حسب الصلاحية |

**الإجمالي:** 47 كولكشن

---

## 🚚 الجزء الثاني والعشرون: أسعار الشحن

### الجملة

| المدينة | السعر | شحن مجاني عند |
|---------|-------|---------------|
| طنطا | 125 | 5000 |
| المنصورة | 125 | 5000 |
| المحلة | 50 | 2000 |

### القطاعي

| المنطقة | السعر | مجاني عند |
|---------|-------|-----------|
| الرجبي، أبو شاهين | 25 | 2500 |
| السبع بنات، الجمهورية، سكة زفتى، الشعبية، الشعراوي، العلو، الشون، المعهد الديني، شارع 10، البندر، المشحمة، أبو راضي | 35 | 2500 |
| الزراعة، أبو علي | 45 | 2500 |
| كفر حجازي | 50 | 2500 |

---

## 🎨 الجزء الثالث والعشرون: نظام التصميم

### الألوان

```css
:root {
  --navy: #1a2a4a;
  --navy-light: #2a3f6a;
  --navy-dark: #0f1a2e;
  --gold: #c9a84c;
  --gold-light: #e8d5a3;
  --gold-dark: #b8942a;
  --white: #ffffff;
  --ddd: #0088FC;
  
  --success: #22c55e;
  --danger: #ef4444;
  --warning: #f59e0b;
  --info: #3b82f6;
  
  /* ألوان الموصلين */
  --del-green-1: #064e3b;
  --del-green-2: #047857;
  --del-green-3: #059669;
  --del-green-light: #10b981;
}
```

### الأنيميشن الموحد

`dropIn`, `logo-pulse`, `shimmer-move`, `text-shine`, `float`, `heartBeat`, `pulseDot`, `bellRing`, `shineSweep`, `imageZoomIn`, `iconFloat`, `rippleRing`, `cardEnter`, `badgePulse`, `iconSpin`, `textFloat`, `dotFloat`, `bgFloat1/2`

---

## 📚 الجزء الرابع والعشرون: المكتبات

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

## 🚀 الجزء الخامس والعشرون: المراحل التنفيذية

### ✅ المرحلة صفر: التنظيف (100%)

### ✅ المرحلة 1: الصفحة الرئيسية والمتاجر (100%)

### ✅ المرحلة 2: صفحات العملاء (85%)
**تم إنجازها:**
- customer-register.html ✅
- customer-login.html ✅ (v2.0)
- cart.html ✅
- checkout.html ✅ (v4.0)
- order-success.html ✅ (v2.0)
- wishlist.html ✅
- notifications.html ✅
- tracking.html ✅
- support.html ✅
- about.html ✅
- privacy-policy.html ✅
- shipping-policy.html ✅
- exchange-policy.html ✅
- terms.html ✅
- faq.html ✅
- register-guide.html ✅

**متبقي:**
- customer/orders.html (تحديث زر تأكيد الاستلام)
- customer/profile.html
- customer/invoices.html
- customer/balance.html (تحتاج مراجعة)

### 🚧 المرحلة 2.5: الموصلين + طرق الدفع (90%)
**تم إنجازها:**
- ✅ تحديث `main.js` v7.0
- ✅ تحديث `firestore.rules` v7.1
- ✅ تحديث `firebase-config.js` v7.0
- ✅ تحديث `checkout.html` v4.0
- ✅ تحديث `order-success.html` v2.0
- ✅ تحديث `admin/login.html` v2.1 + حماية
- ✅ تحديث `login.html` v3.0
- ✅ `delivery-login.html` v1.0 + حماية
- ✅ `delivery/home.html` v1.0
- ✅ `delivery/orders.html` v1.0
- ✅ `delivery/available.html` v1.0
- ✅ `delivery/order-details.html` v1.0
- ✅ `delivery/collections.html` v1.0
- ✅ `delivery/profile.html` v1.0
- ✅ `admin/delivery-agents.html` v1.0
- ✅ `admin/registration-requests.html` v1.0
- ✅ `admin/content-manager.html` v1.0
- ✅ `register-guide.html` v1.0 + حماية
- ✅ `cashier-login.html` v2.0 + حماية
- ✅ `customer-login.html` v2.0 + حماية
- ✅ `trader-login.html` v3.0 + حماية
- ✅ `customer-register.html` v2.0 + حماية
- ✅ تحديث `footer.html` v2.0

**متبقي:**
- ⏳ `admin/assign-delivery.html`
- ⏳ `admin/delivery-settlements.html`
- ⏳ تحديث `admin/orders.html` (عمود الموصل)
- ⏳ تحديث `admin/cashbox.html` (بند أوردرات دليفري)
- ⏳ تحديث `customer/orders.html` (زر تأكيد الاستلام)

### 🚧 المرحلة 6: صفحات المحتوى القانوني (100%)
- about.html ✅
- privacy-policy.html ✅
- shipping-policy.html ✅
- exchange-policy.html ✅
- terms.html ✅
- faq.html ✅

### ✅ المرحلة 7: صفحة دليل التسجيل (100%)
- `register-guide.html` ✅
- `admin/registration-requests.html` ✅

### ⏳ المرحلة 3: لوحة التحكم (0%)
```
admin/login.html                  ✅ (v2.1 محدّث)
admin/home.html                   ⏳
admin/dashboard.html              ⏳
admin/products.html               ⏳
admin/customers.html              ⏳
admin/orders.html                 ✅ (v3.0 يحتاج تحديث)
admin/invoices.html               ⏳
admin/profile.html                ⏳
admin/generate-codes.html         ✅
admin/registration-requests.html  ✅ (جديد)
```

### ⏳ المرحلة 4: الأنظمة المالية (0%)
```
admin/suppliers.html              ⏳
admin/purchases.html              ⏳
admin/extract-pdf.html            ⏳
admin/cashbox.html                ⏳
admin/financial-reports.html      ⏳
```

### ⏳ المرحلة 5: الأنظمة التشغيلية (0%)
```
admin/settings.html               ⏳
admin/branches.html               ⏳
admin/daily-sales.html            ⏳
admin/barcode-scanner.html        ⏳
admin/cashier.html                ⏳
admin/ranks-levels.html           ⏳
cashier/home.html                 ⏳
cashier/sales.html                ⏳
cashier/inventory.html            ⏳
cashier/purchases.html            ⏳
cashier/barcode-scanner.html      ⏳
```

---

## 🔑 الجزء السادس والعشرون: المفاتيح

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
const WHATSAPP_NUMBER = "01068385028";
const PAYMENT_ACCOUNT = "01068385028";
const SUPPORT_EMAIL = "awladsh3laan@gmail.com";
```

---

## 📊 الجزء السابع والعشرون: إحصائيات المشروع (v14.0)

| المقياس | العدد |
|---------|------|
| الصفحات المكتملة | **~55** |
| الصفحات المتبقية (المرحلة 2.5) | **5** |
| صفحات المرحلة 3-5 | **~30** |
| الكولكشنز في Firestore | **47** |
| الأنظمة الكاملة | **47** |
| نسبة الإنجاز الكلي | **~72%** |

| المرحلة | الحالة |
|---------|--------|
| المرحلة صفر | ✅ 100% |
| المرحلة 1 | ✅ 100% |
| المرحلة 2 | 🚧 85% |
| المرحلة 2.5 (الموصلين + الدفع) | 🚧 90% |
| المرحلة 3 | ⏳ 0% |
| المرحلة 4 | ⏳ 0% |
| المرحلة 5 | ⏳ 0% |
| المرحلة 6 (المحتوى) | ✅ 100% |
| المرحلة 7 (التسجيل) | ✅ 100% |

---

## 🎯 الجزء الثامن والعشرون: الأنظمة الكاملة (47 نظام)

| # | النظام | الحالة |
|---|--------|--------|
| 1 | المصادقة (Auth + Code + Secondary App) | ✅ |
| 2 | الهيدر الذكي | ✅ |
| 3 | الفوتر الذكي | ✅ |
| 4 | السايدبار الذكي | ✅ |
| 5 | تصميم الموبايل | ✅ |
| 6 | المنتجات | ✅ |
| 7 | التصنيفات | ✅ |
| 8 | البراندات | ✅ |
| 9 | العروض (قطاعي) | ✅ |
| 10 | الخصومات (جملة) | ✅ |
| 11 | الشركاء | ✅ |
| 12 | السيكشنات المخصصة | ✅ |
| 13 | المفضلة | ✅ |
| 14 | الإشعارات | ✅ |
| 15 | العملاء والتجار | ✅ |
| 16 | الطلبات | ✅ |
| 17 | الفواتير | ✅ |
| 18 | السلة | ✅ |
| 19 | الموردين | ⏳ |
| 20 | المشتريات | ⏳ |
| 21 | استخراج PDF | ⏳ |
| 22 | الصندوق | ⏳ |
| 23 | المبيعات اليومية | ⏳ |
| 24 | الفروع | ⏳ |
| 25 | المستويات | ⏳ |
| 26 | الكاشير + الباركود | ⏳ |
| 27 | دخول التجار | ✅ |
| 28 | إنشاء الحسابات (Secondary App) | ✅ |
| 29 | الإبلاغ عن السداد | ✅ |
| 30 | النزاعات المالية | ✅ |
| 31 | حماية الصفحات المتقدمة | ✅ |
| 32 | الجلسات المتعددة | ✅ |
| 33 | Timeline الطلب | ✅ |
| 34 | الإشعارات المتقدمة | ✅ |
| 35 | المفضلة الذكية | ✅ |
| 36 | منع السكرول الأفقي | ✅ |
| 37 | تتبع الطلب | ✅ |
| 38 | كشف الحساب | ✅ |
| 39 | تذاكر الدعم | ✅ |
| 40 | إدارة المحتوى الموحّد | ✅ |
| 41 | طرق الدفع (3 + تدوير) | ✅ |
| 42 | نظام الموصلين + التوصيل | ✅ |
| 43 | **دخول الموصلين بالكود** | ✅ |
| 44 | **قبول الأوردرات الذاتي** | ✅ |
| 45 | **طلبات التسجيل** | ✅ |
| 46 | **حماية صفحات Login الموحّدة** | ✅ |
| 47 | **دليل التسجيل register-guide** | ✅ |

---

## 🎯 الجزء التاسع والعشرون: تعليمات المحادثة الجديدة

```
عند بدء محادثة جديدة:
1. ارفع CONSTITUTION.md (هذا الملف - v14.0)
2. ارفع آخر ملفات عملنا عليها
3. اكتب:
   "أنا أعمل على مشروع أولاد شعلان جملة.
   راجع الدستور v14.0 أولاً.
   آخر ملف: [اسم الملف]
   المرحلة: [رقم المرحلة]
   أكمل من حيث توقفنا."
```

---

## 🚀 الجزء الثلاثون: الخطوة القادمة (Next Session)

### المتبقي في المرحلة 2.5:

**الترتيب المقترح:**

1. ⏳ **`admin/assign-delivery.html`** ← **التالي**
   - توزيع الأوردرات غير المعيّنة على الموصلين
   - فلاتر (منطقة / تاريخ / حالة)
   - إحصائيات الموصلين (كم أوردر عنده)
   - تعيين بأزرار سريعة

2. ⏳ **`admin/delivery-settlements.html`**
   - عرض كل موصل + الكاش اللي معاه
   - زر "تصفية" → modal يخصم من `currentCashOnHand`
   - تسجيل في `delivery_collections` (type: settle)

3. ⏳ **تحديث `admin/orders.html`**
   - إضافة عمود "الموصل"
   - فلتر "غير معيّن / معيّن"
   - زر "تعيين" سريع

4. ⏳ **تحديث `admin/cashbox.html`**
   - إضافة بند "أوردرات دليفري"
   - مجموع فلوس المنتجات من أوردرات الموصلين

5. ⏳ **تحديث `customer/orders.html`**
   - إضافة زر "تأكيد الاستلام"
   - تقييم الموصل (اختياري)
   - إبلاغ عن مشكلة

### بعدها:
- المرحلة 3 (لوحة التحكم — 9 صفحات)
- المرحلة 4 (الأنظمة المالية — 5 صفحات)
- المرحلة 5 (الأنظمة التشغيلية — 11 صفحة)

---

## ✅ الجزء الحادي والثلاثون: القرارات النهائية المحدّثة (v14.0)

1-51. **كل القرارات السابقة محفوظة**

**+ الإضافات الجديدة (v14.0):**
52. **حماية موحّدة لكل صفحات Login/Register** — IIFE + بعد main.js
53. **تحويل موحّد لـ `/gomla/`** لأي مستخدم مسجل
54. **5 صفحات login بتصميم عمودين** (admin/cashier/customer/trader/delivery)
55. **دخول الموصلين بأزرار قبول** من `available.html` (assignedBy: 'self')
56. **نظام طلبات التسجيل** في `registration_requests`
57. **صفحة إدارة طلبات التسجيل** للسوبر + أدمن بلص
58. **إدارة المحتوى الموحّد** (5 صفحات في تبويبات)
59. **حماية فورية IIFE** بتمنع وميض الصفحة
60. **WhatsApp/PAYMENT محدّث: 01068385028**

---

## 📝 ملاحظات مهمة

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

---

## ✅ هذا هو المرجع الرسمي الكامل للمشروع (v14.0)

**آخر تحديث:** 2026-10-16
**الإصدار:** 14.0
**الحالة:** المرحلة 2.5 على وشك الاكتمال (90%)

**عند بدء محادثة جديدة:**
- ارفع هذا الملف أولاً
- ارفع آخر ملفات عملنا عليها
- أخبرني بالخطوة القادمة

---

**دي النسخة الكاملة من الدستور v14.0 ✅**

**قولي دلوقتي:**
- **"احفظ وأبدأ"** → هنجهز الملف الأخير للتحميل
- **"فيه تعديل"** → هعدله
- **"ابدأ الـ 5 صفحات المتبقية"** → هبدأ فوراً
