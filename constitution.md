تمام ✅ — دي النسخة الكاملة المحدّثة من الدستور مع كل الإضافات الجديدة.

---

# 📜 دستور مشروع أولاد شعلان للمنظفات والورقيات

**الإصدار:** 13.0 (النسخة الشاملة المحدثة)
**آخر تحديث:** 2026-10-13
**هذا الملف هو المرجع الوحيد للمشروع**

---

## 📌 الجزء الأول: معلومات المشروع

| البند | التفاصيل |
|------|----------|
| **الاسم** | أولاد شعلان للمنظفات والورقيات |
| **النوع** | متجر إلكتروني (جملة + قطاعي) + لوحة تحكم + أنظمة مالية + كاشير + باركود + شركاء + نظام توصيل |
| **الرابط** | https://awladsh3laan.github.io/gomla |
| **GitHub** | https://github.com/awladsh3laan/gomla.git |
| **التقنيات** | HTML + CSS + Vanilla JS + Firebase |
| **اللغة** | العربية (RTL) |
| **الخط** | Tajawal |
| **الأيقونات** | Font Awesome **فقط** — ممنوع أي إيموجي في الـ UI |

---

## 🔐 الجزء الثاني: نظام الدخول والصلاحيات

### نظام الدخول

```
Firebase Auth + localStorage + كود سري للتجار + كود سري للموصلين + Firebase Secondary App
```

| المستخدم | الدخول | التسجيل |
|---------|--------|---------|
| العميل (قطاعي) | Email + Password | تسجيل ذاتي |
| التاجر (جملة) | كود سري → Firebase Auth | السوبر أدمن |
| **الموصل (جديد)** | **كود سري `DEL-XXXXX@#$` → Firebase Auth** | **السوبر أدمن + أدمن بلص** |
| الأدمن | Email + Password | السوبر أدمن |
| أدمن بلص | Email + Password | السوبر أدمن |
| السوبر أدمن | Email + Password | ثابت |
| الزائر | لا يحتاج دخول | تصفح فقط |
| الكاشير | Email + Password | السوبر أدمن |

---

### 🆕 نظام دخول التجار (v2.0)

كل تاجر عنده حساب Firebase Auth حقيقي:

```
Email:    {code-lowercase}@trader.awladshalaan.com
Password: {code}
```

**خطوات الدخول:**
1. التاجر يدخل الكود في `trader-login.html`
2. النظام يقرأ `trader_lookup/{CODE}` للحصول على `authEmail`
3. `signInWithEmailAndPassword(authEmail, code)`
4. التحقق من تطابق UID مع `customerId`
5. جلب البيانات من `customers/{uid}`
6. حفظ في localStorage + التوجيه لـ `trader-home.html`

---

### 🆕 نظام دخول الموصلين (v1.0)

**صيغة الكود:**
```
DEL-{5 حروف/أرقام} + {علامة مميزة}
```

**العلامات المميزة المتاحة:**
```
@#$, @#%, @#&, @#*, @$%, @$&, @$*, #$%, #$&, #$*, $%&, $%*
```

**الحروف:** `A-Z` بدون `I, O` + `0-9` بدون `0, 1`

**أمثلة:**
```
DEL-A2B4C5@#$
DEL-X7Y9Z3@#%
DEL-K5M8N2#$&
```

**الإيميل والـ Auth:**
```
Email:    del-{code-lowercase}@delivery.awladshalaan.com
Password: {code}
```

**ملاحظة:** الموصل يدخل **بالكود فقط** — الإيميل والباسورد للاستخدام الفني.

**خطوات الدخول:**
1. الموصل يفتح `delivery-login.html`
2. يدخل الكود
3. النظام يقرأ `delivery_lookup/{CODE}`
4. `signInWithEmailAndPassword(authEmail, code)`
5. التحقق من UID = `deliveryAgentId`
6. جلب البيانات من `delivery_agents/{uid}`
7. **التحقق من `active === true`**
8. حفظ في `localStorage.deliveryData`
9. التوجيه لـ `delivery/home.html`

---

### 🆕 Firebase Secondary App

**الاستخدام:** `admin/generate-codes.html` + `admin/delivery-agents.html`

**السبب:** عند استخدام `createUserWithEmailAndPassword` العادي، بيتم تسجيل دخول الحساب الجديد وطرد السوبر أدمن.

**الحل:**
```javascript
const secondaryApp = firebase.initializeApp(firebaseConfig, 'Secondary-' + Date.now());
const secondaryAuth = secondaryApp.auth();
await secondaryAuth.createUserWithEmailAndPassword(email, password);
await secondaryAuth.signOut();
await secondaryApp.delete();
```

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
  DELIVERY: 'delivery',      // 🆕 جديد
  GUEST: 'guest'
}
```

### 👑 السوبر أدمن (super)

- كل شيء بدون قيود
- إدارة كاملة لكل شيء
- رؤية سعر الشراء
- إدارة الصلاحيات والإعدادات
- إدارة الشركاء والسيكشنات
- توليد أكواد التجار + الموصلين
- استقبال وحل النزاعات المالية
- **حذف الطلبات نهائياً من Firebase**
- **حذف الموصلين**

### 💎 أدمن بلص (admin_plus)

- إدارة المنتجات كاملة
- إنشاء فواتير لأي عميل
- إدارة الطلبات والعملاء والمتاجر
- إدارة الفروع والمبيعات والصندوق
- إدارة السلايدر والسيكشنات
- استقبال الإبلاغات المالية والبت فيها
- **إدارة الموصلين (إضافة / تعديل / تعطيل)**
- ❌ ممنوع: الصلاحيات، الإعدادات، توليد الأكواد، الشركاء، الحذف النهائي

### 🛡️ الأدمن (admin)

- إدارة المنتجات (بدون حذف)
- عرض سعر الشراء (قراءة)
- تعديل سعر البيع
- إدارة الطلبات والفواتير
- تعديل بيانات العملاء (اسم/هاتف فقط)
- ❌ ممنوع: حذف المنتجات، تعديل سعر الشراء، الصلاحيات، الفروع، الموصلين

### 🏪 التاجر (wholesale)

- Firebase Auth حقيقي
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
- المفضلة
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

### 🚚 الموصل (delivery) 🆕

- Firebase Auth حقيقي (يدخل بالكود)
- عرض لوحة خاصة `delivery/home.html`
- استلام الأوردرات المسندة له
- طلب أوردرات من منطقته
- تأكيد الاستلام من المخزن
- تأكيد التسليم للعميل
- **تحصيل الكاش من العملاء**
- متابعة تحصيلاته
- تسجيل مصروفاته من الشحن (أجرة توصيله)
- ❌ ممنوع: باقي المتجر، لوحة التحكم، العملاء، المنتجات

**قواعد مالية مهمة:**
- فلوس المنتجات → تُسلَّم للأدمن (تدخل الصندوق)
- فلوس الشحن → من حق الموصل (أجرة توصيله)

---

### 🛡️ دوال الحماية المتقدمة (v12.0)

| الدالة | الأدوار المسموح بها | الاستخدام |
|-------|---------------------|-----------|
| `protectPage()` | أي مسجل | صفحات عامة |
| `protectAdminPage()` | SUPER + ADMIN_PLUS + ADMIN | صفحات أدمن عامة |
| `protectSuperAdminPage()` | SUPER فقط | settings, generate-codes, partners |
| `protectAdminPlusPage()` | SUPER + ADMIN_PLUS | suppliers, purchases, cashbox, financial-transactions, **delivery-agents** |
| `protectCashierPage()` | CASHIER + كل الأدمن | صفحات cashier |
| `protectCustomerPage()` | RETAIL + WHOLESALE | صفحات العملاء |
| 🆕 `protectDeliveryPage()` | DELIVERY (active) | صفحات delivery |

**منطق الحماية:**
1. مش مسجل → صفحة الدخول المناسبة
2. مسجل بدور غير مصرح:
   - عميل يدخل صفحة أدمن → `/gomla/` + Toast "ليس لديك صلاحية"
   - أدمن يدخل صفحة super → `admin/home.html` + Toast "الصفحة تتطلب: ..."
   - موصل معطل → `delivery-login.html` + Toast
3. مسجل بالدور الصحيح → ✅ يدخل

**دوال مساعدة:**
- `getRoleArabicName(role)` — أسماء الأدوار بالعربي
- `_redirectWithToast(url, msg, delay)` — تحويل ذكي
- `isSuperAdmin()`, `isAdminPlus()`, `isAdmin()`, `isCashier()`, `isWholesale()`, `isRetail()`, `isCustomer()`, `isGuest()`, **`isDelivery()`**, **`isDeliveryActive()`**

---

### 🔔 نظام الجلسات المتعددة (v12.0)

**الملفات المراقبة:**
```javascript
const WATCHED_KEYS = ['admin', 'customer', 'cashier', 'deliveryData'];
```

**عند تغيير المفاتيح (admin, customer, cashier, deliveryData) في tab آخر:**
- عرض Overlay احترافي
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
3. 🆕 سيكشن أحدث المنتجات
4. 🆕 سيكشن أحدث العروض
5. 🆕 سيكشن المنتجات الأكثر طلباً
6. 🆕 سيكشنات مخصصة (من لوحة التحكم)
7. 🆕 سيكشن نبذة عن أولاد شعلان
8. 🆕 سيكشن تواصل معنا (واتساب + جيميل)
```

### السيكشنات المخصصة

**5 أنواع متاحة:**
1. إعلانات بنرات
2. عرض منتجات معينة
3. كروت بروابط
4. فيديوهات
5. صور

**الكولكشن:** `custom_sections`
**اللوحة:** `admin/sections-manager.html` (سوبر أدمن فقط)

---

## 📄 الجزء الرابع: صفحة تفاصيل المنتج product-details.html

### عرض حسب الصلاحية

**🏪 للتاجر والأدمن:**
- ✅ سعر الجملة (الوحدة)
- ✅ سعر الجملة (القطعة)
- ✅ سعر البيع للمستهلك
- ✅ هامش الربح في القطعة
- ✅ هامش الربح في الوحدة
- ✅ المخزون + الحد الأقصى
- ✅ ملاحظات (للتاجر فقط)

**👤 للعميل والزائر:**
- ✅ السعر القطاعي + "قطعة"
- ✅ الوصف
- ✅ البراند
- ✅ التصنيف
- ✅ المخزون
- ❌ ممنوع أسعار الجملة والشراء

**👑 للسوبر أدمن:**
- ✅ كل ما سبق +
- ✅ سعر الشراء
- ✅ زر تعديل المنتج

---

## 🏪 الجزء الخامس: المتاجر

### 1. المتجر القطاعي store-retail.html

**سيكشن Brand Hero**
- صورة: `https://i.ibb.co/v4xBgMPP/Picsart-26-09-21-04-43-12-322.png`
- انيميشن احترافي
- الشعار: "أولاد شعلان ستور"
- 3 مميزات: منتجات أصلية، توصيل سريع، دعم فوري

**السيكشنات:**
```
1. 🏪 Brand Hero (خاص بالقطاعي)
2. 🎞️ السلايدر
3. 🔍 البحث
4. 🆕 أحدث المنتجات (سعر قطاعي فقط)
5. 🏷️ البراندات
6. 🎯 العروض (link → offers.html)
7. 📂 الأقسام (link → categories.html)
8. 📦 جميع المنتجات
```

### 2. المتجر الجملة store-wholesale.html

**سيكشن Brand Hero (خاص بالجملة)**
- صورة: `https://i.ibb.co/RTCSsZxg/Picsart-26-09-23-04-01-50-093.png`
- انيميشن احترافي بألوان ذهبية داكنة
- الشعار: "أولاد شعلان جملة"
- 4 مميزات: خصومات للتجار، فواتير آجلة، توصيل سريع، دعم مخصص

**السيكشنات:**
```
1. 🏪 Brand Hero (خاص بالجملة)
2. 🎞️ السلايدر
3. 🔍 البحث
4. 🆕 أحدث المنتجات (سعر جملة)
5. 🏷️ البراندات
6. 💰 الخصومات (link → discounts.html)
7. 📂 الأقسام (link → categories.html?type=wholesale)
8. 📦 جميع المنتجات
9. 🤝 شركاء النجاح
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

### الهيكل المبسّط

```
1. 🏷️ شريط العنوان (Hero Bar)
2. 📂 شبكة الأقسام
```

**مميزات الشبكة:**
- الأنيميشن: dropIn (نزول من الأعلى)
- التأخير المتتالي: كل كارت 0.05s
- عدد المنتجات: حقيقي من Firestore
- الفلترة: الأقسام الفارغة لا تظهر
- الرابط الذكي: `?type=retail/wholesale`

---

## 📄 الجزء السابع: صفحة منتجات القسم category-products.html

**الهيكل:**
```
1. 🏷️ Breadcrumb
2. 🎯 شريط مضغوط (Sticky)
3. 🏷️ شرائح البراندات (Chips)
4. 🔍 فلاتر (ترتيب + توفّر)
5. 📦 شبكة المنتجات
```

**السعر حسب المستخدم:**
- عميل → retailPrice + "قطعة"
- تاجر → wholesalePrice + وحدة المنتج

---

## 🎯 الجزء التاسع: نظام العروض والخصومات

### القاعدة الأساسية

| النظام | المتجر | يظهر لـ | الصفحة | الوحدة |
|--------|--------|---------|--------|--------|
| العروض | القطاعي | العملاء والزوار | offers.html | قطعة |
| الخصومات | الجملة | التجار والأدمن | discounts.html | كرتونة/بالة |

### حقول المنتج

```javascript
{
  // 🎯 العروض (للقطاعي)
  hasRetailOffer: false,
  retailOfferPrice: 0,
  retailOfferStartDate: null,
  retailOfferEndDate: null,
  
  // 💰 الخصومات (للجملة)
  hasWholesaleDiscount: false,
  wholesaleDiscountPercent: 0,
  wholesaleDiscountStartDate: null,
  wholesaleDiscountEndDate: null,
  
  // 📝 ملاحظات للتاجر
  traderNotes: ''
}
```

---

## 💳 الجزء العاشر: نظام طرق الدفع (v13.0) 🆕

### المفهوم

عند إتمام الطلب، العميل يختار طريقة دفع واحدة من 3:

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

### 🔢 قاعدة التدوير (الأهم)

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
| 8 | 10 |
| 9 | 10 |
| 11 | 10 |
| 12 | 10 |
| 3 | 5 |
| 6 | 5 |
| 7 | 5 |
| 2 | 0 |

### حقول الطلب الجديدة

```javascript
{
  // ... الحقول القديمة
  
  // 🆕 الدفع
  paymentMethod: 'cash' | 'instapay' | 'wallet',
  paymentMethodLabel: 'الدفع عند الاستلام',
  paymentFeePercent: 0 | 0 | 1,
  paymentFee: 0 | 0 | 11.25,
  grandTotal: 1135,        // الإجمالي النهائي المُدوّر
  paymentProof: '',        // صورة إثبات التحويل (اختياري)
  paymentProofUploadedAt: null,
  
  // حالة الدفع
  paymentStatus: 'unpaid' | 'pending' | 'paid',
  paid: 0,
  remaining: grandTotal
}
```

### في `checkout.html`

**3 كروت قابلة للاختيار:**
- 💵 الدفع عند الاستلام — بدون رسوم
- 🏦 إنستا باي — بدون رسوم + رقم الحساب + رفع إثبات
- 📱 محفظة إلكترونية — +1% + رقم الحساب + رفع إثبات

**ملخص الطلب يتحدث لحظيًا:**
```
منتجات:           1000.00 ج.م
شحن:               125.00 ج.م
رسوم محفظة (1%):    11.25 ج.م   ← يظهر بس لو wallet
──────────────────────────────────
الإجمالي:            1135 ج.م   ← رقم صحيح
```

### في `order-success.html`

- صندوق طريقة الدفع (ملون حسب الطريقة)
- رقم الحساب + زر نسخ (للإنستا باي والمحفظة)
- حالة الإثبات: "بانتظار التحقق" أو "يحتاج تحويل"
- عرض صورة الإثبات (Thumbnail)
- الإجمالي النهائي المُدوّر

---

## 🚚 الجزء الحادي عشر: نظام الموصلين (v1.0) 🆕

### المفهوم

نظام كامل لموظفي التوصيل بحيث:
- يشوفوا أوردراتهم فقط + أوردرات منطقتهم
- يأكدوا الاستلام من المخزن
- يأكدوا التسليم للعميل
- يأكدوا تحصيل الفلوس
- الأدمن يتابع كل واحد عنده كام فلوس

### 🗄️ الكولكشنز الجديدة

#### 1. `delivery_agents/{uid}`

```javascript
{
  uid: "firebase-uid",
  name: "محمد أحمد",
  phone: "01012345678",
  phone2: "",
  email: "del-{code}@delivery.awladshalaan.com",
  code: "DEL-A2B4C5@#$",
  
  // عمل
  area: "طنطا",              // المنطقة
  vehicle: "موتوسيكل",       // نوع المركبة
  vehicleNumber: "",         // رقم المركبة
  
  // حالة
  active: true,
  role: "delivery",
  type: "delivery",
  avatar: "",
  
  // إحصائيات
  totalDelivered: 0,
  totalCollected: 0,
  currentCashOnHand: 0,      // 💰 الكاش الحالي معه
  pendingOrdersCount: 0,
  
  // تواريخ
  createdAt: Timestamp,
  updatedAt: Timestamp,
  createdBy: "super-uid",
  lastLoginAt: null,
  disabledAt: null,
  disabledReason: ""
}
```

#### 2. `delivery_lookup/{CODE}`

Doc ID = الكود (مثال: `DEL-A2B4C5@#$`)

```javascript
{
  deliveryAgentId: "firebase-uid",
  authEmail: "del-...@delivery.awladshalaan.com",
  name: "محمد أحمد",
  phone: "01012345678",
  area: "طنطا",
  vehicle: "موتوسيكل",
  code: "DEL-A2B4C5@#$",
  role: "delivery",
  type: "delivery",
  avatar: "",
  active: true,
  currentCashOnHand: 0,
  totalDelivered: 0,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**القواعد:**
```javascript
allow get: if true;              // للتحقق عند الدخول
allow list: if false;            // ممنوع سرد
allow write: if isAdminOrHigher();
```

#### 3. `delivery_collections/{id}`

```javascript
{
  deliveryAgentId: "uid",
  deliveryAgentName: "محمد أحمد",
  orderId: "order-id",
  orderNumber: "ORD-12345",
  amount: 1135,
  type: 'collect' | 'settle',      // تحصيل من عميل | تصفية مع الأدمن
  method: 'cash' | 'instapay' | 'wallet',
  status: 'pending' | 'confirmed',
  confirmedBy: "",
  confirmedByName: "",
  notes: "",
  createdAt: Timestamp
}
```

### 📝 الحقول الجديدة في `orders`

```javascript
{
  // ... الحقول القديمة
  
  // 🚚 التوصيل
  deliveryAgentId: '',
  deliveryAgentName: '',
  deliveryAgentPhone: '',
  assignedAt: null,
  assignedBy: '',
  
  deliveryStatus: 'unassigned' | 'assigned' | 'picked_up' | 'delivered' | 'failed',
  pickedUpAt: null,
  deliveredAt: null,
  failedReason: '',
  deliveryNotes: '',
  
  // 💰 التحصيل
  cashCollected: 0,
  cashCollectedAt: null,
  cashHandedToAdmin: false,
  cashHandedAt: null,
  
  // 🆕 تأكيد العميل
  confirmedByCustomer: false,
  customerConfirmedAt: null,
  customerFeedback: ''
}
```

### 🔄 سير العمل الكامل

```
1. العميل يعمل أوردر
   → orders/{id} status: 'pending'
   → deliveryStatus: 'unassigned'

2. الأدمن (SUPER/ADMIN_PLUS) يفتح admin/orders
   → يفلتر: "غير معيّن"
   → يختار موصل → "تعيين"
   → deliveryStatus: 'assigned'

3. الموصل يفتح delivery/home.html
   → يشوف: أوردرات جديدة / جاري التوصيل / تم التسليم
   → يضغط "استلمت الأوردر"
   → deliveryStatus: 'picked_up', pickedUpAt: now

4. يوصل للعميل → يسلم الأوردر
   → يضغط "تم التسليم"
   → deliveryStatus: 'delivered', deliveredAt: now
   → لو الدفع كاش:
      يظهر modal "تحصيل المبلغ"
   → cashCollected: 1135, cashCollectedAt: now
   → delivery_agents.currentCashOnHand += amount
   → delivery_collections: type 'collect'

5. في نهاية اليوم / دورياً
   → الأدمن يفتح admin/delivery-settlements.html
   → يشوف: "محمد عنده 5000 ج.م كاش"
   → يستلم الفلوس منه فعلياً
   → يضغط "تصفية"
   → delivery_collections: type 'settle'
   → currentCashOnHand -= amount
```

### 💰 تقسيم الفلوس (قاعدة مهمة)

```
الفلوس اللي الموصل بيحصلها من العميل
    │
    ├── 💵 فلوس المنتجات (subtotal)
    │   → تدخل الصندوق تحت بند "أوردرات دليفري"
    │
    └── 🚚 فلوس الشحن (shippingCost)
        → دي حق الموصل نفسه (أجرة توصيله)
        → الأدمن مبيستلمهاش منه وقت التصفية
```

**مثال:**
```
أوردر 1135 ج.م
  ├── منتجات: 1000 ج.م → الصندوق
  └── شحن: 125 ج.م → جيب الموصل (بعد التصفية)
```

### 🆕 تأكيد العميل للاستلام

العميل صاحب الأوردر يقدر:
- يأكد الاستلام من `customer/orders.html`
- يقيم الخدمة (اختياري)
- يبلّغ عن مشكلة

**الحقول:**
- `confirmedByCustomer: true`
- `customerConfirmedAt: Timestamp`
- `customerFeedback: "5 نجوم - خدمة ممتازة"`

### 📄 صفحات الموصلين

| # | الملف | الوصف |
|---|-------|-------|
| 1 | `delivery-login.html` | ✅ تم — دخول الموصلين |
| 2 | `delivery/home.html` | ⏳ Dashboard: إحصائيات + ملخص اليوم |
| 3 | `delivery/orders.html` | ⏳ قائمة الأوردرات (مصنفة) |
| 4 | `delivery/available.html` | ⏳ أوردرات منطقتي المتاحة |
| 5 | `delivery/order-details.html` | ⏳ تفاصيل + أزرار (استلام/تسليم/تحصيل) |
| 6 | `delivery/collections.html` | ⏳ سجل تحصيلات الموصل |
| 7 | `delivery/profile.html` | ⏳ بروفايل الموصل |

### 📄 صفحات إدارة الموصلين (Admin)

| # | الملف | الوصف |
|---|-------|-------|
| 1 | `admin/delivery-agents.html` | ✅ تم — إدارة الموصلين |
| 2 | `admin/assign-delivery.html` | ⏳ توزيع الأوردرات |
| 3 | `admin/delivery-settlements.html` | ⏳ تصفية الحسابات |

---

## 💰 الجزء الثاني عشر: نظام الإبلاغ عن السداد (v12.0)

### المفهوم

لو العميل/التاجر دفع للمسؤول لكن المسؤول نسي يسجل الدفع:

1. العميل يفتح `customer/balance.html`
2. يضغط "أبلغ عن سداد"
3. يملأ الموديل (مبلغ، تاريخ، طريقة، صورة إيصال)
4. الإبلاغ يروح لكولكشن `financial_notifications`
5. يظهر في `admin/financial-transactions.html`
6. الأدمن يعتمد/يرفض
7. عند الاعتماد: خصم تلقائي من الرصيد + إشعار للمستخدم

### كولكشن `financial_notifications`

```javascript
{
  type: 'customer_payment' | 'trader_payment' | 'debt_claim' | 'purchase_payment' | 'dispute',
  senderId, senderName, senderRole, senderPhone, senderCode,
  amount, paymentDate, method: 'cash'|'transfer'|'wallet'|'other',
  receiver, reference, notes, receiptUrl,
  status: 'pending' | 'approved' | 'rejected',
  reviewedBy, reviewedByName, reviewedAt, adminNotes,
  balanceAtReport,
  createdAt, updatedAt
}
```

---

## 🤝 الجزء الثالث عشر: نظام الشركاء

### المفهوم

الشركاء = التجار والمحلات اللي بيتعاملوا معانا
يظهروا في سيكشن "شركاء النجاح" في متجر الجملة
فقط السوبر أدمن يقدر يديرهم

### حقول الشريك

```javascript
// partners collection
{
  id, name, description, imageUrl,
  order, active,
  createdAt, updatedAt
}
```

---

## 🎫 الجزء الرابع عشر: نظام تذاكر الدعم (v12.0)

### المفهوم

نظام كامل لتذاكر الدعم مع:
- FAQ (أسئلة شائعة)
- تذاكر دعم مع متابعة
- صفحة إدارة للأدمن
- رد العميل + رد الأدمن

### كولكشن `support_tickets`

```javascript
{
  ticketNumber: "TKT-123456",
  senderId, senderName, senderRole, senderPhone, senderCode,
  category: 'complaint'|'inquiry'|'request'|'suggestion'|'financial',
  priority: 'normal'|'high'|'urgent',
  subject, details,
  attachments: [],
  status: 'open' | 'processing' | 'closed',
  replies: [{by, byName, byRole, text, at, isInitial}],
  rating: 0,
  createdAt, updatedAt, lastReplyAt, closedAt
}
```

### قواعد Firestore

```javascript
match /support_tickets/{ticketId} {
  allow create: if isSignedIn()
                && request.resource.data.senderId == request.auth.uid
                && request.resource.data.status == 'open';
  allow read: if isSignedIn() && resource.data.senderId == request.auth.uid;
  allow read, update: if isAdminOrHigher();
  allow delete: if isSuperAdmin();
}
```

### الصفحات

- `support.html` — للعملاء (FAQ + فتح تذكرة + متابعة)
- `admin/support.html` — للإدارة (SUPER + ADMIN_PLUS + ADMIN)

---

## 🔒 الجزء الخامس عشر: نظام إدارة سياسة الخصوصية (v12.0)

### المفهوم

- صفحة `privacy-policy.html` ديناميكية
- تقرأ الأقسام من `privacy_sections` مرتبة حسب `order`
- صفحة `admin/privacy-manager.html` للسوبر أدمن
- تعديل أي بند بدون فتح الكود
- تاريخ آخر تحديث تلقائي

### كولكشن `privacy_sections`

```javascript
{
  order: 1,
  title: "مقدمة",
  icon: "fa-book-open",
  bodyType: "text" | "list" | "cards" | "table" | "quote" | "contact",
  body: "نص الفقرة...",
  items: [],           // list / cards / table / contact
  active: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### كولكشن `site_content/privacy_meta`

```javascript
{
  lastUpdated: Timestamp,   // يتحدّث تلقائيًا مع أي تعديل
  version: "1.0",
  updatedBy: "admin-uid",
  updatedByName: "السوبر أدمن"
}
```

### قواعد Firestore

```javascript
match /privacy_sections/{sectionId} {
  allow read: if true;
  allow create, update, delete: if isSuperAdmin();
}
match /site_content/{docId} {
  allow read: if true;
  allow write: if isSuperAdmin();
}
```

---

## 🚪 الجزء السادس عشر: بوابة الدخول login.html (v3.0)

### الهيكل

```
1. 🎯 خلفية كحلية متدرجة + دوائر ذهبية متحركة + نقاط ضوئية
2. 🖼️ Hero: صورة ترحيب + نص جانبي + 4 features
3. 🃏 5 كروت دخول:
   - 👑 الإدارة (Navy)
   - 🏪 التجار (Gold)
   - 👤 العملاء (Blue)
   - 🧑‍💻 الكاشير (Purple)
   - 🚚 الموصلين (Green)
4. ➕ قسم "مستخدم جديد؟"
   - تسجيل عميل جديد → customer-register.html
   - طلب كود تاجر → support.html
   - انضم لفريق التوصيل → support.html
5. 📞 زر العودة للرئيسية
```

### صورة الترحيب

```
https://i.ibb.co/YFcjtFHQ/welcome-user.jpg
```

### التوجيه حسب الدور

| الدور | الوجهة |
|-------|--------|
| Super / Admin+ / Admin | `/admin/home.html` |
| Wholesale | `/trader-home.html` |
| Retail | `/customer-home.html` |
| Cashier | `/cashier/home.html` |
| Delivery | `/delivery/home.html` |

---

## 📝 الجزء السابع عشر: تسجيل العملاء customer-register.html

### الحقول

```javascript
{
  id, name, email, phone, address,
  role: 'retail',
  avatar: '', balance: 0,
  active: true, type: 'retail',
  city: '', code: '',
  createdAt, updatedAt
}
```

---

## 🛒 الجزء الثامن عشر: السلة cart.html

### المميزات

- دعم المسجل (Firestore) + الزائر (localStorage) + التاجر (Firestore)
- تعديل الكميات مع الحدود
- الحد الأدنى للجملة (1500 ج.م)
- تنبيه الحد الأدنى (أخضر/أصفر)

### الالتزام بالحدود

- للتاجر: `maxOrder`
- للعميل: `stockQuantity`

---

## 💳 الجزء التاسع عشر: إتمام الطلب checkout.html (v4.0)

### حقول الطلب

```javascript
{
  customerId, customerName, customerPhone, customerPhone2,
  customerAddress, customerAddress2, deliveryChoice,
  deliveryAddress, isGuest, storeType, userRole,
  region, regionLocked, deliveryDate, notes,
  items: [...],
  subtotal, shippingCost, total, isFreeShipping,
  
  // 🆕 الدفع
  paymentMethod, paymentMethodLabel,
  paymentFeePercent, paymentFee, grandTotal,
  paymentProof, paymentProofUploadedAt,
  
  // 🆕 التوصيل
  deliveryStatus, deliveryAgentId, deliveryAgentName,
  deliveryAgentPhone, assignedAt, assignedBy,
  pickedUpAt, deliveredAt, failedReason, deliveryNotes,
  
  // 🆕 التحصيل
  cashCollected, cashCollectedAt,
  cashHandedToAdmin, cashHandedAt,
  
  // 🆕 تأكيد العميل
  confirmedByCustomer, customerConfirmedAt, customerFeedback,
  
  // الحالة
  status, paymentStatus, paid, remaining,
  orderDate, createdAt, updatedAt
}
```

---

## 🎉 الجزء العشرون: نجاح الطلب order-success.html (v2.0)

### الهيكل

```
1. ✅ أيقونة نجاح متحركة
2. 🔢 رقم الطلب (مع زر نسخ)
3. 📅 خط زمني للطلب (4 مراحل)
4. 💳 صندوق طريقة الدفع (ملون حسب الطريقة)
5. ℹ️ معلومات مهمة
6. 👤 بيانات العميل
7. 🚚 بيانات التوصيل
8. 📦 قائمة المنتجات
9. 💰 المبالغ (مع صف رسوم المحفظة لو موجودة)
10. 🔗 أزرار (تتبع/طلباتي/متابعة)
```

---

## 📱 الجزء الحادي والعشرون: تصميم الموبايل (App-Like)

### المبادئ

```
❌ لا يوجد هيدر كامل
❌ لا يوجد فوتر
✅ شريط علوي مبسط (ثابت)
✅ تبويبات عليا حسب الصلاحية (ثابتة)
✅ تبويبات سفلى حسب الصفحة
✅ شريط حقوق فقط في الأسفل
```

### ⚠️ قواعد مهمة

```
✅ overflow-x: hidden على html/body
✅ منع تسرب السكرول للأزرار (wrappers)
✅ overscroll-behavior-x: contain
✅ min-width: 0 على الآباء
✅ تحويل الجداول لـ Cards على الموبايل
✅ إضافة padding-top للـ body
```

---

## 🚫 الجزء الثاني والعشرون: قواعد مهمة

### منع السكرول التلقائي

```
❌ ممنوع أي سكرول تلقائي في المشروع
✅ المستخدم يتحكم بنفسه
⚠️ استثناء: السلايدر الرئيسي (Slider Auto) مسموح
```

### Font Awesome فقط

```
✅ استخدم <i class="fas fa-check-circle"></i>
❌ لا تستخدم أي إيموجي في HTML
❌ لا تستخدم ✅ ⭐ 💡 في النصوص أو Toasts
```

---

## 🗄️ الجزء الثالث والعشرون: هيكل الملفات المحدّث

```
📁 gomla/
├── 📁 assets/
│   ├── css/style.css
│   ├── js/
│   │   ├── firebase-config.js      (v6.1)
│   │   ├── main.js                 (v6.1)
│   │   └── public.js
│   ├── components/
│   │   ├── header.html
│   │   ├── footer.html
│   │   └── sidebar.html
│   └── images/
│
├── 📁 admin/
│   ├── login.html                  ✅ (v2.0 محدّث)
│   ├── home.html
│   ├── dashboard.html
│   ├── products.html
│   ├── customers.html
│   ├── orders.html                 ✅ (v3.0 محدّث)
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
│   ├── sections-manager.html
│   ├── partners-manager.html
│   ├── financial-transactions.html
│   ├── support.html                ✅
│   ├── privacy-manager.html        ✅
│   ├── delivery-agents.html        ✅ (v1.0 جديد)
│   ├── assign-delivery.html        ⏳
│   ├── delivery-settlements.html   ⏳
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
│   ├── orders.html                 ⏳ (لازم تحديث - تأكيد الاستلام)
│   ├── invoices.html
│   └── balance.html
│
├── 📁 delivery/                    🆕
│   ├── home.html                   ⏳
│   ├── orders.html                 ⏳
│   ├── available.html              ⏳
│   ├── order-details.html          ⏳
│   ├── collections.html            ⏳
│   └── profile.html                ⏳
│
├── index.html
├── store-wholesale.html
├── store-retail.html
├── categories.html
├── category-products.html
├── brand-products.html
├── offers.html
├── discounts.html
├── cart.html
├── checkout.html                   ✅ (v4.0 محدّث)
├── order-success.html              ✅ (v2.0 محدّث)
├── product-details.html
├── login.html                      ✅ (v3.0 محدّث)
├── customer-register.html
├── customer-login.html
├── trader-login.html
├── cashier-login.html
├── delivery-login.html             ✅ (v1.0 جديد)
├── customer-home.html
├── trader-home.html
├── tracking.html
├── wishlist.html
├── notifications.html
├── support.html                    ✅
├── about.html                      ✅
├── privacy-policy.html             ✅
├── shipping-policy.html            ⏳
├── exchange-policy.html            ⏳
├── terms.html                      ⏳
├── faq.html                        ⏳
├── CONSTITUTION.md
└── README.md
```

---

## 🗄️ الجزء الرابع والعشرون: كولكشنز Firestore المحدّثة

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
| `financial_notifications` | إبلاغات السداد والنزاعات | حسب الصلاحية |
| `support_tickets` | تذاكر الدعم | حسب الصلاحية |
| `privacy_sections` | أقسام سياسة الخصوصية | عام (قراءة) |
| `public_stats` | الإحصائيات العامة | عام (قراءة) |
| `delivery_agents` | 🆕 الموصلين | حسب الصلاحية |
| `delivery_lookup` | 🆕 كود الموصل (Doc ID = الكود) | get عام، list ممنوع |
| `delivery_collections` | 🆕 تحصيلات الموصلين | حسب الصلاحية |

---

## 🚚 الجزء الخامس والعشرون: أسعار الشحن والمناطق

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

### مناطق الموصلين

**للجملة:** طنطا / المنصورة / المحلة
**للقطاعي:** كل مناطق المحلة المذكورة

---

## 🎨 الجزء السادس والعشرون: نظام التصميم

### الألوان

```css
:root {
  /* الألوان الأساسية */
  --navy: #1a2a4a;
  --navy-light: #2a3f6a;
  --navy-dark: #0f1a2e;
  --gold: #c9a84c;
  --gold-light: #e8d5a3;
  --gold-dark: #b8942a;
  --white: #ffffff;
  --ddd: #0088FC;
  
  /* الرمادي (50-900) */
  /* الألوان الوظيفية */
  --success: #22c55e;
  --danger: #ef4444;
  --warning: #f59e0b;
  --info: #3b82f6;
  
  /* 🆕 ألوان الموصلين */
  --del-green-1: #064e3b;
  --del-green-2: #047857;
  --del-green-3: #059669;
  --del-green-light: #10b981;
}
```

### الأنيميشن الموحد

- `dropIn` — نزول الكروت
- `logo-pulse` — نبض اللوجو
- `shimmer-move` — شريط متلألئ
- `text-shine` — نص متلألئ
- `float` — عائم
- `heartBeat` — نبض القلب
- `pulseDot` — نبض نقطة الإشعارات
- `bellRing` — رجّ الجرس للدعم
- 🆕 `shineSweep` — شريط لامع
- 🆕 `imageZoomIn` — تكبير الصورة
- 🆕 `iconFloat` — أيقونة عائمة
- 🆕 `rippleRing` — حلقة تنتشر

---

## 📚 الجزء السابع والعشرون: المكتبات

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

## 🚀 الجزء الثامن والعشرون: المراحل التنفيذية المحدّثة

### ✅ المرحلة صفر: التنظيف (100%)

### ✅ المرحلة 1: الصفحة الرئيسية والمتاجر (100%)

### ✅ المرحلة 2: صفحات العملاء (74%)

### ✅ المرحلة 2.5: الموصلين + طرق الدفع (جديد - 60%)

**تم إنجازه:**
- ✅ تحديث `main.js` (v6.1) — دور DELIVERY + دوال
- ✅ تحديث `firestore.rules` (v6.5) — قواعد الموصلين
- ✅ تحديث `firebase-config.js` (v6.1) — كولكشنز + ثوابت
- ✅ تحديث `checkout.html` (v4.0) — 3 طرق دفع + تدوير
- ✅ تحديث `order-success.html` (v2.0) — عرض الدفع
- ✅ تحديث `admin/login.html` (v2.0) — تصميم عمودين
- ✅ تحديث `login.html` (v3.0) — 5 كروت + Hero
- ✅ `delivery-login.html` (v1.0) — دخول الموصلين
- ✅ `admin/delivery-agents.html` (v1.0) — إدارة الموصلين
- ✅ `admin/orders.html` (v3.0) — عمود الموصل (لاحقًا)

**المتبقي:**
- ⏳ `delivery/home.html`
- ⏳ `delivery/orders.html`
- ⏳ `delivery/available.html`
- ⏳ `delivery/order-details.html`
- ⏳ `delivery/collections.html`
- ⏳ `delivery/profile.html`
- ⏳ `admin/assign-delivery.html`
- ⏳ `admin/delivery-settlements.html`
- ⏳ تحديث `admin/orders.html` (عمود الموصل)
- ⏳ تحديث `admin/cashbox.html` (بند أوردرات دليفري)
- ⏳ تحديث `customer/orders.html` (تأكيد الاستلام)

### ⏳ المرحلة 3: لوحة التحكم (0%)

```
admin/login.html ✅ (محدّث)
admin/home.html
admin/dashboard.html
admin/products.html
admin/customers.html
admin/orders.html ✅ (محدّث)
admin/invoices.html
admin/profile.html
```

### ⏳ المرحلة 4: الأنظمة المالية (0%)

```
admin/suppliers.html
admin/purchases.html
admin/extract-pdf.html
admin/cashbox.html
admin/financial-reports.html
```

### ⏳ المرحلة 5: الأنظمة التشغيلية (0%)

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

### 🆕 المرحلة 6: صفحات المحتوى القانوني (جديد)

```
about.html ✅
privacy-policy.html ✅
shipping-policy.html ⏳
exchange-policy.html ⏳
terms.html ⏳
faq.html ⏳
```

### 🆕 المرحلة 7: صفحة توضيح التسجيل (جديد - قريباً)

```
register-guide.html ⏳ (سيتم إنشاؤها)
```

**الهدف:** توضيح كيفية التسجيل كتاجر أو موصل جديد خطوة بخطوة.

---

## 🔑 الجزء التاسع والعشرون: المفاتيح

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
```

**⚠️ تحديث:** رقم الواتساب ورقم الحساب = **01068385028** (كان 01120282953 قديمًا)

---

## 📊 الجزء الثلاثون: إحصائيات المشروع

| المقياس | العدد |
|---------|------|
| الصفحات المكتملة | ~45 |
| الصفحات المتبقية (المرحلة 2.5) | ~11 |
| صفحات المرحلة 3-5 | ~30 |
| الكولكشنز في Firestore | **41** |
| الأنظمة الكاملة | **42** |
| نسبة الإنجاز الكلي | ~67% |

| المرحلة | الحالة |
|---------|--------|
| المرحلة صفر | ✅ 100% |
| المرحلة 1 | ✅ 100% |
| المرحلة 2 | 🚧 74% |
| المرحلة 2.5 (الموصلين + الدفع) | 🚧 60% |
| المرحلة 3 | ⏳ 0% |
| المرحلة 4 | ⏳ 0% |
| المرحلة 5 | ⏳ 0% |
| المرحلة 6 (المحتوى) | 🚧 50% |
| المرحلة 7 (التسجيل) | ⏳ 0% |

---

## 🎯 الجزء الحادي والثلاثون: الأنظمة الكاملة (42 نظام)

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
| 27 | دخول التجار (Firebase Auth) | ✅ |
| 28 | إنشاء الحسابات (Secondary App) | ✅ |
| 29 | الإبلاغ عن السداد | ✅ |
| 30 | استقبال النزاعات المالية | ✅ |
| 31 | حماية الصفحات المتقدمة | ✅ |
| 32 | الجلسات المتعددة (storage event) | ✅ |
| 33 | Timeline الطلب | ✅ |
| 34 | الإشعارات المتقدمة (7 تبويبات) | ✅ |
| 35 | المفضلة الذكية | ✅ |
| 36 | منع السكرول الأفقي | ✅ |
| 37 | تتبع الطلب | ✅ |
| 38 | نظام كشف الحساب | ✅ |
| 39 | تذاكر الدعم | ✅ |
| 40 | إدارة سياسة الخصوصية | ✅ |
| 41 | 🆕 طرق الدفع (3 طرق + تدوير) | ✅ |
| 42 | 🆕 نظام الموصلين + التوصيل | 🚧 60% |

---

## 🎯 الجزء الثاني والثلاثون: تعليمات المحادثة الجديدة

```
عند بدء محادثة جديدة:
1. ارفع CONSTITUTION.md (هذا الملف)
2. ارفع آخر ملفات عملنا عليها
3. اكتب:
   "أنا أعمل على مشروع أولاد شعلان جملة.
   راجع الدستور أولاً.
   آخر ملف: [اسم الملف]
   المرحلة: [رقم المرحلة]
   أكمل من حيث توقفنا."
```

---

## 🚀 الجزء الثالث والثلاثون: الخطوة القادمة

### 🔥 ما تم إنجازه في هذه الجلسة:

- ✅ تحديث `main.js` v6.1 (دور DELIVERY + دوال)
- ✅ تحديث `firestore.rules` v6.5 (قواعد الموصلين)
- ✅ تحديث `firebase-config.js` v6.1 (كولكشنز + ثوابت)
- ✅ تحديث `checkout.html` v4.0 (3 طرق دفع + تدوير)
- ✅ تحديث `order-success.html` v2.0 (عرض الدفع)
- ✅ تحديث `admin/login.html` v2.0 (تصميم عمودين)
- ✅ تحديث `admin/orders.html` v3.0 (إصلاح الأخطاء)
- ✅ تحديث `login.html` v3.0 (5 كروت + Hero)
- ✅ `delivery-login.html` v1.0 (جديد)
- ✅ `admin/delivery-agents.html` v1.0 (جديد)
- ✅ `about.html` v1.0 (جديد)
- ✅ `privacy-policy.html` v1.0 (جديد)
- ✅ `admin/privacy-manager.html` v1.0 (جديد)
- ✅ `support.html` v1.0 (جديد)
- ✅ `admin/support.html` v1.0 (جديد)

### 🎯 الخطوة القادمة المتفق عليها:

**1. إنشاء صفحة `register-guide.html`** — توضح كيفية التسجيل كتاجر أو موصل جديد

**بعدها:**
**2. صفحات الموصلين:**
- `delivery/home.html`
- `delivery/orders.html`
- `delivery/available.html`
- `delivery/order-details.html`
- `delivery/collections.html`
- `delivery/profile.html`

**3. صفحات إدارة الموصلين:**
- `admin/assign-delivery.html`
- `admin/delivery-settlements.html`
- تحديث `admin/orders.html`

**4. تحديث `customer/orders.html`** — تأكيد العميل للاستلام

**5. إكمال المرحلة 6:**
- `shipping-policy.html`
- `exchange-policy.html`
- `terms.html`
- `faq.html`

---

## ✅ الجزء الرابع والثلاثون: القرارات النهائية المحدّثة

1. الدخول: Firebase Auth + localStorage + كود للتجار + كود للموصلين
2. العملاء: Email + Password
3. التجار: كود → Firebase Auth
4. **الموصلين: كود `DEL-XXXXX@#$` → Firebase Auth** 🆕
5. أدمن بلص: Email + Password
6. الصور: ImgBB فقط
7. ممنوع base64 و Firebase Storage
8. PDF: PDF.js + Gemini API
9. سعر الشراء: سوبر أدمن فقط
10. الحد الأدنى للجملة: 1500 ج.م
11. الحد الأقصى للقطاعي: المخزون
12. الصفحة الرئيسية: 8 سيكشنات
13. الموبايل: تطبيق حقيقي
14. لا سكرول تلقائي
15. تبويبات الموبايل ثابتة
16. نافذة البحث موحدة
17. صفحة الأقسام مبسطة
18. صفحة القسم: شريط مضغوط Sticky
19. فصل العروض (قطاعي) عن الخصومات (جملة)
20. رتبة أدمن بلص
21. نظام الشركاء
22. بوابة دخول login.html (5 كروت) 🆕
23. تسجيل العملاء ذاتي
24. cart + checkout + order-success منفصلين
25. كل تاجر عنده Firebase Auth حقيقي
26. إيميل التاجر = `{code-lowercase}@trader.awladshalaan.com`
27. باسورد التاجر = الكود نفسه
28. **إيميل الموصل = `del-{code-lowercase}@delivery.awladshalaan.com`** 🆕
29. **باسورد الموصل = الكود نفسه** 🆕
30. إنشاء الحسابات بـ Firebase Secondary App
31. trader_lookup Doc ID = الكود
32. **delivery_lookup Doc ID = الكود** 🆕
33. main.js شغال طبيعي مع Firebase Auth
34. Firestore Rules v6.5
35. دوال حماية متقدمة بـ roles
36. منع العملاء من صفحات الأدمن → الرئيسية + Toast
37. مراقب الجلسات المتعددة بـ storage event
38. Overlay مع عدّاد SVG لتنبيه الجلسة
39. نظام الإبلاغ عن السداد
40. خصم تلقائي من الرصيد عند اعتماد الإبلاغ
41. تحديث trader_lookup تلقائياً
42. منع السكرول الأفقي على كل الصفحات
43. تحويل الجداول لـ Cards على الموبايل
44. **3 طرق دفع (كاش/إنستا/محفظة +1%)** 🆕
45. **تدوير الإجمالي لأقرب 5 (رياضي)** 🆕
46. **رقم الحساب: 01068385028** 🆕
47. **نظام الموصلين الكامل (5 حالات توصيل)** 🆕
48. **تقسيم الفلوس: منتجات → الصندوق، شحن → الموصل** 🆕
49. **تأكيد العميل للاستلام + التحصيل** 🆕
50. **Font Awesome فقط — ممنوع الإيموجي** 🆕
51. **صفحة توضيح التسجيل (register-guide.html)** 🆕

---

## 🎯 الجزء الخامس والثلاثون: خارطة الطريق المستقبلية

### المدى القصير (أسبوع)

1. إنشاء `register-guide.html` 🎯 **التالي**
2. إكمال صفحات الموصلين (6 صفحات)
3. إكمال صفحات إدارة الموصلين (2 صفحتان)
4. تحديث `customer/orders.html` (تأكيد العميل)
5. إكمال المرحلة 6 (4 صفحات)

### المدى المتوسط (شهر)

6. الأنظمة المالية (المرحلة 4)
7. الأنظمة التشغيلية (المرحلة 5)
8. تحديث `admin/cashbox.html` (بند أوردرات دليفري)
9. نظام الكوبونات + النقاط والمكافآت
10. نظام الرتب (VIP)

### المدى الطويل (3 أشهر)

11. Dark Mode + PWA
12. Push Notifications (FCM)
13. تكامل بوابات الدفع (فوري، Paymob)
14. تعدد اللغات (عربي + إنجليزي)
15. تطبيق الموبايل (React Native / Flutter)
16. تكامل مع بوابات الشحن (Aramex, Bosta)
17. **حذف Firebase Auth من الـ Backend** (Cloud Function)

---

## ✅ هذا هو المرجع الرسمي الكامل للمشروع (v13.0)

**عند بدء محادثة جديدة:**
- ارفع هذا الملف أولاً
- ارفع آخر ملفات عملنا عليها
- أخبرني بالخطوة القادمة

**آخر تحديث:** 2026-10-13
**الإصدار:** 13.0

---

## 📝 ملاحظات مهمة

1. **كل الإيموجي في الكود ممنوعة** — Font Awesome فقط
2. **حماية الأدوار مطبقة** في كل صفحة
3. **الجلسات المتعددة مراقبة** (4 مفاتيح الآن: admin, customer, cashier, deliveryData)
4. **الموصلون يدخلون بالكود فقط** (5 حروف + 3 رموز مميزة)
5. **الإجمالي دائمًا رقم صحيح ينتهي بـ 0 أو 5**
6. **فلوس الشحن للموصل، فلوس المنتجات للصندوق**
7. **الأدمن بلص يقدر يدير الموصلين، الحذف للسوبر فقط**

---

**دي النسخة الكاملة من الدستور ✅**

**قولي دلوقتي:**

**أ)** ابدأ بـ `register-guide.html` (صفحة توضيح التسجيل)
**ب)** ابدأ بصفحات الموصلين الـ 6
**ج)** حابب تعدل حاجة في الدستور الأول
**د)** قرار تاني
