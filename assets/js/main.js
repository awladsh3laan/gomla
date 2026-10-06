// ============================================================
// 🧠 main.js - الملف الموحد للدوال الأساسية
// 📌 يحتوي على كل شيء: المستخدم، الصلاحيات، المكونات، السلة، المفضلة،
//    الإشعارات، رفع الصور، التواريخ، Toast، ومكونات الموبايل
// الإصدار: 6.0
// آخر تحديث: 2026-09-19
// ============================================================

// ============================================================
// 1️⃣ إدارة المستخدمين والصلاحيات
// ============================================================

/**
 * الحصول على بيانات المستخدم الحالي
 * @returns {Object|null} { type: 'admin'|'customer'|'cashier', data: {...} }
 */
function getCurrentUser() {
  const adminData = localStorage.getItem('admin');
  const customerData = localStorage.getItem('customer');
  const cashierData = localStorage.getItem('cashier');
  
  if (adminData) return { type: 'admin', data: JSON.parse(adminData) };
  if (cashierData) return { type: 'cashier', data: JSON.parse(cashierData) };
  if (customerData) return { type: 'customer', data: JSON.parse(customerData) };
  return null;
}

/**
 * الحصول على رتبة المستخدم
 */
function getUserRole() {
  const user = getCurrentUser();
  if (!user) return ROLES.GUEST;
  return user.data.role || ROLES.GUEST;
}

// ============================================================
// 🎭 دوال التحقق من الأدوار
// ============================================================

function isSuperAdmin() {
  const user = getCurrentUser();
  return !!(user && user.type === 'admin' && user.data.role === ROLES.SUPER);
}

function isAdminPlus() {
  const user = getCurrentUser();
  return !!(user && user.type === 'admin' && user.data.role === ROLES.ADMIN_PLUS);
}

function isAdmin() {
  const user = getCurrentUser();
  if (!user || user.type !== 'admin') return false;
  return [ROLES.SUPER, ROLES.ADMIN_PLUS, ROLES.ADMIN].includes(user.data.role);
}

function isCashier() {
  const user = getCurrentUser();
  return !!(user && user.type === 'cashier');
}

function isWholesale() {
  const user = getCurrentUser();
  return !!(user && user.type === 'customer' && user.data.role === ROLES.WHOLESALE);
}

function isRetail() {
  const user = getCurrentUser();
  return !!(user && user.type === 'customer' && user.data.role === ROLES.RETAIL);
}

function isCustomer() {
  return isWholesale() || isRetail();
}

function isGuest() {
  return !getCurrentUser();
}

/**
 * اسم الدور بالعربي (للعرض)
 */
function getRoleArabicName(role) {
  const names = {
    [ROLES.SUPER]: 'سوبر أدمن',
    [ROLES.ADMIN_PLUS]: 'أدمن بلص',
    [ROLES.ADMIN]: 'أدمن',
    [ROLES.CASHIER]: 'كاشير',
    [ROLES.WHOLESALE]: 'تاجر',
    [ROLES.RETAIL]: 'عميل',
    [ROLES.GUEST]: 'زائر'
  };
  return names[role] || role || 'غير معروف';
}

/**
 * التحقق من صلاحية معينة
 */
function hasPermission(permission) {
  const role = getUserRole();
  const perms = (typeof PERMISSIONS !== 'undefined' && PERMISSIONS[role]) || [];
  if (perms.includes('*')) return true;
  return perms.includes(permission);
}

// ============================================================
// 🛡️ دوال الحماية - النسخة المطوّرة
// ============================================================

/**
 * إعادة توجيه ذكية مع رسالة Toast (تأخير 1.5 ثانية)
 */
function _redirectWithToast(url, message, delay = 1500) {
  if (message && typeof showToast === 'function') {
    showToast(message, 'error');
  }
  setTimeout(() => {
    window.location.href = url;
  }, delay);
}

/**
 * ============================================================
 * 🔒 حماية الصفحات العامة (تحتاج تسجيل دخول)
 * ============================================================
 * @param {string} redirectUrl - لو مش مسجل (افتراضي: customer-login)
 */
function protectPage(redirectUrl = '/gomla/customer-login.html') {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = redirectUrl;
    return false;
  }
  return true;
}

/**
 * ============================================================
 * 🔒 حماية صفحات الأدمن - النسخة المطوّرة
 * ============================================================
 * 
 * @param {Array<string>|string|null} requiredRoles - الأدوار المسموح بها
 *   - null (افتراضي): يقبل SUPER + ADMIN_PLUS + ADMIN
 *   - string: دور واحد
 *   - Array: أي دور من القائمة
 * 
 * المنطق:
 *   1) مش مسجل → admin/login.html
 *   2) مسجل لكن type !== 'admin' → الرئيسية + Toast
 *   3) مسجل كأدمن لكن دوره غير مصرح → admin/home.html + Toast
 *   4) OK → يرجع true
 */
function protectAdminPage(requiredRoles = null) {
  const user = getCurrentUser();
  
  // ===== 1) مش مسجل دخول =====
  if (!user) {
    window.location.href = '/gomla/admin/login.html';
    return false;
  }
  
  // ===== 2) مسجل لكن مش من نوع admin (عميل/تاجر/كاشير) =====
  if (user.type !== 'admin') {
    _redirectWithToast(
      '/gomla/',
      '⚠️ ليس لديك صلاحية للوصول لهذه الصفحة'
    );
    return false;
  }
  
  // ===== 3) تحديد الأدوار المسموح بها =====
  let allowedRoles;
  
  if (requiredRoles === null || requiredRoles === undefined) {
    allowedRoles = [ROLES.SUPER, ROLES.ADMIN_PLUS, ROLES.ADMIN];
  } else if (Array.isArray(requiredRoles)) {
    allowedRoles = requiredRoles;
  } else {
    allowedRoles = [requiredRoles];
  }
  
  // ===== 4) التحقق من الدور =====
  const userRole = user.data.role;
  
  if (!allowedRoles.includes(userRole)) {
    const requiredNames = allowedRoles.map(r => getRoleArabicName(r)).join(' أو ');
    _redirectWithToast(
      '/gomla/admin/home.html',
      `⚠️ هذه الصفحة تتطلب: ${requiredNames}`
    );
    return false;
  }
  
  return true;
}

/**
 * 🔒 حماية السوبر أدمن فقط
 */
function protectSuperAdminPage() {
  return protectAdminPage([ROLES.SUPER]);
}

/**
 * 🔒 حماية أدمن بلص + سوبر أدمن
 */
function protectAdminPlusPage() {
  return protectAdminPage([ROLES.SUPER, ROLES.ADMIN_PLUS]);
}

/**
 * 🔒 حماية الأدمن (أي مستوى أدمن)
 */
function protectAnyAdminPage() {
  return protectAdminPage(); // افتراضي: كل الأدمن
}

/**
 * ============================================================
 * 🔒 حماية صفحات الكاشير
 * ============================================================
 * يقبل: cashier + أي أدمن
 */
function protectCashierPage() {
  const user = getCurrentUser();
  
  // مش مسجل → صفحة دخول الكاشير
  if (!user) {
    window.location.href = '/gomla/cashier-login.html';
    return false;
  }
  
  // أدمن → مسموح
  if (user.type === 'admin') {
    if ([ROLES.SUPER, ROLES.ADMIN_PLUS, ROLES.ADMIN].includes(user.data.role)) {
      return true;
    }
  }
  
  // كاشير → مسموح
  if (user.type === 'cashier') {
    return true;
  }
  
  // أي حد تاني → الرئيسية
  _redirectWithToast(
    '/gomla/',
    '⚠️ ليس لديك صلاحية للوصول لهذه الصفحة'
  );
  return false;
}

/**
 * ============================================================
 * 🔒 حماية صفحات العميل / التاجر
 * ============================================================
 * @param {Array<string>} allowedRoles - افتراضي: RETAIL + WHOLESALE
 */
function protectCustomerPage(allowedRoles = [ROLES.RETAIL, ROLES.WHOLESALE]) {
  const user = getCurrentUser();
  
  // مش مسجل → صفحة دخول العملاء
  if (!user) {
    window.location.href = '/gomla/customer-login.html';
    return false;
  }
  
  // أدمن → لوحة التحكم
  if (user.type === 'admin') {
    _redirectWithToast('/gomla/admin/home.html', '⚠️ هذه الصفحة للعملاء فقط');
    return false;
  }
  
  // كاشير → صفحة الكاشير
  if (user.type === 'cashier') {
    _redirectWithToast('/gomla/cashier/home.html', '⚠️ هذه الصفحة للعملاء فقط');
    return false;
  }
  
  // عميل/تاجر لكن دوره غير مسموح
  if (!allowedRoles.includes(user.data.role)) {
    _redirectWithToast('/gomla/', '⚠️ ليس لديك صلاحية للوصول لهذه الصفحة');
    return false;
  }
  
  return true;
}

// ============================================================
// 🚪 تسجيل الخروج
// ============================================================

function logoutUser() {
  if (!confirm('هل أنت متأكد من تسجيل الخروج؟')) return;
  
  // مسح البيانات مع إغلاق جلسة Firebase
  firebase.auth().signOut()
    .catch((err) => console.warn('SignOut error:', err))
    .finally(() => {
      localStorage.removeItem('admin');
      localStorage.removeItem('customer');
      localStorage.removeItem('cashier');
      localStorage.removeItem('adminId');
      localStorage.removeItem('customerCode');
      
      window.location.href = '/gomla/';
    });
}

// ============================================================
// 🔗 تصدير الدوال الجديدة
// ============================================================

window.isAdminPlus = isAdminPlus;
window.isCustomer = isCustomer;
window.getRoleArabicName = getRoleArabicName;
window.protectAdminPlusPage = protectAdminPlusPage;
window.protectAnyAdminPage = protectAnyAdminPage;
window.protectCustomerPage = protectCustomerPage;
// ============================================================
// 3️⃣ مراقب الجلسات المتعددة (Multi-Session Watcher)
// ============================================================
// 📌 المشكلة: Firebase Auth بيستخدم جلسة واحدة لكل browser
// 📌 عند تسجيل دخول جديد في tab تاني، الـ tab الحالي مش حاسس
// 📌 الحل: نراقب localStorage + نعرض Overlay + إعادة تحميل
// ============================================================

(function() {
  'use strict';

  // ===== الإعدادات =====
  const WATCHED_KEYS = ['admin', 'customer', 'cashier'];
  const COUNTDOWN_SECONDS = 5;
  const EXCLUDED_PAGES = [
    '/login.html',
    '/customer-login.html',
    '/trader-login.html',
    '/cashier-login.html',
    '/admin/login.html'
  ];

  // ===== الحالة =====
  let lastSnapshot = null;
  let overlayShown = false;
  let countdownTimer = null;

  // ============================================================
  // 📸 أخذ Snapshot للمفاتيح
  // ============================================================
  function takeSnapshot() {
    return {
      admin: localStorage.getItem('admin'),
      customer: localStorage.getItem('customer'),
      cashier: localStorage.getItem('cashier')
    };
  }

  function snapshotsAreEqual(a, b) {
    if (!a || !b) return false;
    return a.admin === b.admin &&
           a.customer === b.customer &&
           a.cashier === b.cashier;
  }

  // ============================================================
  // 🚫 هل الصفحة الحالية مستثناة؟
  // ============================================================
  function isExcludedPage() {
    const path = window.location.pathname;
    return EXCLUDED_PAGES.some(excluded => path.endsWith(excluded));
  }

  // ============================================================
  // 🎭 اسم الدور بالعربي (من الـ localStorage key + البيانات)
  // ============================================================
  function getRoleNameFromKey(key, data) {
    if (!data) return 'حساب آخر';
    
    if (key === 'admin') {
      const names = {
        super: 'سوبر أدمن',
        admin_plus: 'أدمن بلص',
        admin: 'أدمن'
      };
      return names[data.role] || 'أدمن';
    }
    
    if (key === 'cashier') return 'كاشير';
    
    if (key === 'customer') {
      if (data.role === 'wholesale') return 'تاجر';
      if (data.role === 'retail') return 'عميل';
    }
    
    return 'حساب آخر';
  }

  // ============================================================
  // 🎨 بناء الـ Overlay
  // ============================================================
  function buildOverlayHTML(type, roleName) {
    const isLogin = type === 'login';
    const isLogout = type === 'logout';

    // الألوان والأيقونات
    const config = isLogin
      ? {
          iconClass: 'fa-user-check',
          iconBg: 'linear-gradient(135deg, #22c55e, #16a34a)',
          iconColor: '#ffffff',
          title: 'تم تسجيل الدخول بحساب آخر',
          titleColor: '#16a34a',
          message: `تم تسجيل الدخول بحساب <strong>${roleName}</strong> في نافذة أخرى`,
          subMessage: 'سيتم إعادة تحميل الصفحة تلقائياً لتحديث الجلسة'
        }
      : {
          iconClass: 'fa-sign-out-alt',
          iconBg: 'linear-gradient(135deg, #ef4444, #dc2626)',
          iconColor: '#ffffff',
          title: 'تم تسجيل الخروج',
          titleColor: '#dc2626',
          message: 'تم تسجيل الخروج من حسابك في نافذة أخرى',
          subMessage: 'سيتم تحويلك إلى الصفحة الرئيسية'
        };

    return `
      <div class="session-notice-overlay" id="sessionNoticeOverlay">
        <div class="session-notice-box">
          
          <!-- شريط علوي ملون -->
          <div class="session-notice-top-bar" style="background:${config.iconBg};"></div>

          <!-- الأيقونة -->
          <div class="session-notice-icon" style="background:${config.iconBg};">
            <i class="fas ${config.iconClass}" style="color:${config.iconColor};"></i>
          </div>

          <!-- العنوان -->
          <h2 class="session-notice-title" style="color:${config.titleColor};">
            ${config.title}
          </h2>

          <!-- الرسالة -->
          <p class="session-notice-message">
            ${config.message}
          </p>

          <!-- الرسالة الفرعية -->
          <p class="session-notice-submessage">
            <i class="fas fa-info-circle"></i>
            ${config.subMessage}
          </p>

          <!-- العدّاد الدائري -->
          <div class="session-notice-counter-wrap">
            <svg class="session-counter-svg" viewBox="0 0 120 120">
              <!-- الدائرة الخلفية -->
              <circle 
                cx="60" cy="60" r="52" 
                fill="none" 
                stroke="#e5e7eb" 
                stroke-width="8" />
              <!-- الدائرة المتحركة -->
              <circle 
                id="sessionCounterCircle"
                cx="60" cy="60" r="52" 
                fill="none" 
                stroke="url(#counterGradient)" 
                stroke-width="8" 
                stroke-linecap="round"
                stroke-dasharray="326.7"
                stroke-dashoffset="0"
                transform="rotate(-90 60 60)" />
              <!-- تدرج لوني -->
              <defs>
                <linearGradient id="counterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#c9a84c" />
                  <stop offset="100%" stop-color="#b8942a" />
                </linearGradient>
              </defs>
            </svg>
            
            <!-- الرقم في الوسط -->
            <div class="session-counter-number" id="sessionCounterNumber">
              ${COUNTDOWN_SECONDS}
            </div>
          </div>

          <!-- النص التوضيحي -->
          <div class="session-notice-hint">
            سيتم التنفيذ خلال <strong id="sessionCounterHint">${COUNTDOWN_SECONDS}</strong> ثواني
          </div>

          <!-- زر الانتقال الفوري -->
          <button class="session-notice-btn" id="sessionGoBtn" style="background:${config.iconBg};">
            <i class="fas fa-arrow-left"></i>
            الانتقال الآن
          </button>

        </div>
      </div>
    `;
  }

  // ============================================================
  // 🎬 عرض الـ Overlay
  // ============================================================
  function showOverlay(type, roleName) {
    if (overlayShown) return;
    overlayShown = true;

    // حقن CSS إذا لم يكن موجوداً
    injectStyles();

    // إنشاء الـ Overlay
    const container = document.createElement('div');
    container.innerHTML = buildOverlayHTML(type, roleName);
    const overlay = container.firstElementChild;
    document.body.appendChild(overlay);

    // منع السكرول
    document.body.style.overflow = 'hidden';

    // ===== بدء العدّاد =====
    let seconds = COUNTDOWN_SECONDS;
    const numberEl = document.getElementById('sessionCounterNumber');
    const hintEl = document.getElementById('sessionCounterHint');
    const circleEl = document.getElementById('sessionCounterCircle');
    const goBtn = document.getElementById('sessionGoBtn');

    // طول محيط الدائرة
    const CIRCUMFERENCE = 326.7;
    let elapsed = 0;

    // دالة التنفيذ
    function executeAction() {
      if (countdownTimer) clearInterval(countdownTimer);
      
      if (type === 'logout') {
        // مسح localStorage وإعادة توجيه
        localStorage.removeItem('admin');
        localStorage.removeItem('customer');
        localStorage.removeItem('cashier');
        localStorage.removeItem('adminId');
        localStorage.removeItem('customerCode');
        window.location.href = '/gomla/';
      } else {
        // login بحساب جديد → reload
        window.location.reload();
      }
    }

    // زر الانتقال الفوري
    goBtn.addEventListener('click', executeAction);

    // العدّاد كل ثانية
    countdownTimer = setInterval(() => {
      seconds--;
      elapsed += 1;

      // تحديث الرقم
      if (numberEl) numberEl.textContent = Math.max(0, seconds);
      if (hintEl) hintEl.textContent = Math.max(0, seconds);

      // تحديث الدائرة (تدريجياً)
      const progress = Math.min(elapsed / COUNTDOWN_SECONDS, 1);
      const offset = CIRCUMFERENCE * progress;
      if (circleEl) circleEl.style.strokeDashoffset = offset;

      // نهاية العدّاد
      if (seconds <= 0) {
        clearInterval(countdownTimer);
        countdownTimer = null;
        executeAction();
      }
    }, 1000);
  }

  // ============================================================
  // 💉 حقن CSS (مرة واحدة فقط)
  // ============================================================
  function injectStyles() {
    if (document.getElementById('sessionNoticeStyles')) return;

    const style = document.createElement('style');
    style.id = 'sessionNoticeStyles';
    style.textContent = `
      /* ============================================================
         🎨 Overlay الجلسات المتعددة
         ============================================================ */
      .session-notice-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 26, 46, 0.88);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: snFadeIn 0.3s ease;
        overflow-y: auto;
      }

      @keyframes snFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .session-notice-box {
        background: #ffffff;
        border-radius: 20px;
        padding: 32px 28px 28px;
        max-width: 440px;
        width: 100%;
        box-shadow: 
          0 25px 70px rgba(0, 0, 0, 0.5),
          0 0 0 1px rgba(201, 168, 76, 0.2);
        text-align: center;
        position: relative;
        overflow: hidden;
        animation: snSlideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1);
      }

      @keyframes snSlideUp {
        0% {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      /* شريط علوي */
      .session-notice-top-bar {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        height: 6px;
      }

      /* الأيقونة الدائرية */
      .session-notice-icon {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        font-size: 2.2rem;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
        animation: snIconPulse 2s ease-in-out infinite;
        position: relative;
      }

      .session-notice-icon::before {
        content: '';
        position: absolute;
        inset: -8px;
        border-radius: 50%;
        background: inherit;
        opacity: 0.2;
        animation: snIconRipple 2s ease-out infinite;
      }

      @keyframes snIconPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      @keyframes snIconRipple {
        0% {
          transform: scale(1);
          opacity: 0.3;
        }
        100% {
          transform: scale(1.4);
          opacity: 0;
        }
      }

      /* العنوان */
      .session-notice-title {
        font-size: 1.4rem;
        font-weight: 900;
        margin-bottom: 10px;
        line-height: 1.3;
        font-family: 'Tajawal', sans-serif;
      }

      /* الرسالة */
      .session-notice-message {
        font-size: 0.95rem;
        color: #4b5563;
        line-height: 1.6;
        margin-bottom: 8px;
        font-family: 'Tajawal', sans-serif;
      }

      .session-notice-message strong {
        color: #1a2a4a;
        font-weight: 900;
      }

      /* الرسالة الفرعية */
      .session-notice-submessage {
        font-size: 0.82rem;
        color: #9ca3af;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 22px;
        padding: 6px 14px;
        background: #f9fafb;
        border-radius: 20px;
        font-family: 'Tajawal', sans-serif;
      }

      .session-notice-submessage i {
        color: #c9a84c;
        font-size: 0.75rem;
      }

      /* العدّاد الدائري */
      .session-notice-counter-wrap {
        position: relative;
        width: 130px;
        height: 130px;
        margin: 0 auto 16px;
      }

      .session-counter-svg {
        width: 100%;
        height: 100%;
        display: block;
      }

      #sessionCounterCircle {
        transition: stroke-dashoffset 1s linear;
      }

      .session-counter-number {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2.8rem;
        font-weight: 900;
        color: #1a2a4a;
        font-family: 'Tajawal', sans-serif;
        line-height: 1;
        animation: snNumberPulse 1s ease-in-out infinite;
      }

      @keyframes snNumberPulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.08); }
      }

      /* النص التوضيحي */
      .session-notice-hint {
        font-size: 0.85rem;
        color: #6b7280;
        margin-bottom: 22px;
        font-family: 'Tajawal', sans-serif;
      }

      .session-notice-hint strong {
        color: #c9a84c;
        font-weight: 900;
        font-size: 1rem;
      }

      /* الزر */
      .session-notice-btn {
        width: 100%;
        padding: 15px 24px;
        border: none;
        border-radius: 100px;
        color: #ffffff;
        font-family: 'Tajawal', sans-serif;
        font-weight: 900;
        font-size: 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: all 0.3s ease;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        position: relative;
        overflow: hidden;
      }

      .session-notice-btn::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.25);
        transform: translate(-50%, -50%);
        transition: width 0.5s ease, height 0.5s ease;
      }

      .session-notice-btn:hover::before {
        width: 500px;
        height: 500px;
      }

      .session-notice-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
      }

      .session-notice-btn:active {
        transform: translateY(0);
      }

      .session-notice-btn i,
      .session-notice-btn span {
        position: relative;
        z-index: 1;
      }

      /* ============================================================
         📱 Responsive
         ============================================================ */
      @media (max-width: 480px) {
        .session-notice-overlay {
          padding: 14px;
        }

        .session-notice-box {
          padding: 26px 20px 22px;
          border-radius: 16px;
        }

        .session-notice-icon {
          width: 68px;
          height: 68px;
          font-size: 1.8rem;
          margin-bottom: 16px;
        }

        .session-notice-title {
          font-size: 1.15rem;
        }

        .session-notice-message {
          font-size: 0.88rem;
        }

        .session-notice-submessage {
          font-size: 0.75rem;
          padding: 5px 12px;
        }

        .session-notice-counter-wrap {
          width: 110px;
          height: 110px;
        }

        .session-counter-number {
          font-size: 2.3rem;
        }

        .session-notice-hint {
          font-size: 0.78rem;
          margin-bottom: 18px;
        }

        .session-notice-btn {
          padding: 13px 20px;
          font-size: 0.92rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================================
  // 🎯 معالج storage event
  // ============================================================
  function handleStorageChange(e) {
    // تجاهل لو مش مفتاح من اللي بنراقبهم
    if (!e.key || !WATCHED_KEYS.includes(e.key)) return;

    // تجاهل لو الـ Overlay ظاهر بالفعل
    if (overlayShown) return;

    // تجاهل لو الصفحة الحالية مستثناة
    if (isExcludedPage()) return;

    // خذ snapshot جديدة
    const newSnapshot = takeSnapshot();

    // لو مفيش تغيير فعلي، تجاهل
    if (snapshotsAreEqual(newSnapshot, lastSnapshot)) return;

    // في تغيير فعلي!
    const oldSnapshot = lastSnapshot;
    lastSnapshot = newSnapshot;

    // حدد نوع التغيير
    if (e.newValue === null) {
      // ===== حالة logout =====
      console.log('🔄 Session change detected: LOGOUT');
      showOverlay('logout', null);
    } else {
      // ===== حالة login جديد =====
      let newUser = null;
      try {
        newUser = JSON.parse(e.newValue);
      } catch (err) {
        console.warn('Could not parse new user data:', err);
      }

      const roleName = getRoleNameFromKey(e.key, newUser);
      console.log(`🔄 Session change detected: LOGIN as ${roleName}`);
      showOverlay('login', roleName);
    }
  }

  // ============================================================
  // 🚀 بدء المراقبة
  // ============================================================
  function initSessionWatcher() {
    // تجاهل لو الصفحة مستثناة
    if (isExcludedPage()) {
      console.log('ℹ️ Session watcher: excluded page');
      return;
    }

    // خذ snapshot أولية
    lastSnapshot = takeSnapshot();

    // استمع للتغييرات
    window.addEventListener('storage', handleStorageChange);

    console.log('✅ Session watcher initialized');
  }

  // بدء عند تحميل الصفحة
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSessionWatcher);
  } else {
    initSessionWatcher();
  }

})();
// ============================================================
// 2️⃣ نظام Toast
// ============================================================

function showToast(message, type = 'info', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
  container.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================================
// 3️⃣ دوال التواريخ
// ============================================================

function formatDate(timestamp) {
  if (!timestamp) return '---';
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  } catch {
    return '---';
  }
}

function formatDateTime(timestamp) {
  if (!timestamp) return '---';
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch {
    return '---';
  }
}

function formatDateForInput(date) {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

function formatTime(timestamp) {
  if (!timestamp) return '---';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
}

// ============================================================
// 4️⃣ نظام رفع الصور (ImgBB فقط)
// ============================================================

async function uploadImage(file, onProgress) {
  if (!file) return null;
  
  try {
    if (onProgress) onProgress(10);
    
    // ضغط الصورة
    const compressedFile = await imageCompression(file, IMAGE_CONFIG);
    if (onProgress) onProgress(40);
    
    // رفع على ImgBB
    const formData = new FormData();
    formData.append('image', compressedFile);
    
    if (onProgress) onProgress(60);
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    if (onProgress) onProgress(100);
    
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || 'فشل الرفع');
    }
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    showToast('⚠️ فشل رفع الصورة: ' + error.message, 'error');
    return null;
  }
}

// ============================================================
// 5️⃣ دوال مساعدة
// ============================================================

function generateCode(prefix = '', length = 4) {
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
  let result = prefix;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => showToast('✅ تم النسخ', 'success'))
      .catch(() => showToast('❌ فشل النسخ', 'error'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    showToast('✅ تم النسخ', 'success');
  }
}

function validatePhone(phone) {
  return /^01[0-9]{9}$/.test(phone);
}

/**
 * حساب الحد الأقصى التلقائي للطلب (للجملة)
 */
function calculateAutoMaxOrder(stockQuantity) {
  const stock = parseInt(stockQuantity) || 0;
  if (stock < 2) return 0;
  if (stock < 8) return 1;
  if (stock < 10) return 2;
  if (stock < 15) return 3;
  if (stock < 30) return 4;
  if (stock < 50) return 5;
  if (stock === 50) return 7;
  // أكثر من 50: كل 5 وحدات +2
  const extra = Math.floor((stock - 50) / 5);
  return 7 + (extra * 2);
}

/**
 * حساب تكلفة الشحن
 */
function calculateShipping(region, subtotal, storeType) {
  const rates = SHIPPING_RATES[storeType];
  if (!rates || !rates[region]) return { cost: 0, isFree: false, available: false };
  
  const rate = rates[region];
  const isFree = subtotal >= rate.freeThreshold;
  return {
    cost: isFree ? 0 : rate.cost,
    isFree: isFree,
    available: true,
    freeThreshold: rate.freeThreshold
  };
}

/**
 * تسجيل النشاط
 */
function logActivity(action, details = '') {
  const user = getCurrentUser();
  if (!user || !window.db) return;
  
  db.collection(COLLECTIONS.ACTIVITY_LOG).add({
    userId: user.data.id || user.data.uid || 'unknown',
    userName: user.data.name || 'unknown',
    userRole: user.data.role || 'unknown',
    action: action,
    details: details,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    url: window.location.pathname
  }).catch(() => {});
}

// ============================================================
// 6️⃣ نظام السلة (Cart)
// ============================================================

async function addToCart(productId, quantity = 1, customPrice = null) {
  const user = getCurrentUser();
  
  // إذا كان زائر → حفظ في localStorage
  if (!user) {
    return addToGuestCart(productId, quantity, customPrice);
  }
  
  try {
    const productDoc = await db.collection(COLLECTIONS.PRODUCTS).doc(productId).get();
    if (!productDoc.exists) {
      showToast('❌ المنتج غير موجود', 'error');
      return false;
    }
    
    const product = productDoc.data();
    const userId = user.data.id || user.data.uid;
    const userRole = user.data.role;
    const isWholesale = userRole === ROLES.WHOLESALE || userRole === ROLES.ADMIN || userRole === ROLES.SUPER;
    
    // حساب السعر
    let price = customPrice;
    if (!price) {
      price = isWholesale ? (product.wholesalePrice || 0) : (product.retailPrice || 0);
    }
    
    // التحقق من الحد الأقصى
    if (isWholesale && product.maxOrder) {
      const existing = await db.collection(COLLECTIONS.CART)
        .where('userId', '==', userId)
        .where('productId', '==', productId)
        .get();
      
      const existingQty = existing.empty ? 0 : (existing.docs[0].data().quantity || 0);
      if (existingQty + quantity > product.maxOrder) {
        showToast(`⚠️ الحد الأقصى للطلب ${product.maxOrder}`, 'warning');
        return false;
      }
    }
    
    // التحقق من المخزون (للقطاعي)
    if (!isWholesale) {
      const stock = product.stockQuantity || 0;
      const existing = await db.collection(COLLECTIONS.CART)
        .where('userId', '==', userId)
        .where('productId', '==', productId)
        .get();
      
      const existingQty = existing.empty ? 0 : (existing.docs[0].data().quantity || 0);
      if (existingQty + quantity > stock) {
        showToast(`⚠️ المخزون المتاح ${stock} فقط`, 'warning');
        return false;
      }
    }
    
    // إضافة أو تحديث
    const existing = await db.collection(COLLECTIONS.CART)
      .where('userId', '==', userId)
      .where('productId', '==', productId)
      .get();
    
    if (existing.empty) {
      await db.collection(COLLECTIONS.CART).add({
        userId,
        productId,
        productName: product.name,
        imageUrl: product.imageUrl || '',
        quantity,
        unit: product.unit || 'قطعة',
        price,
        maxOrder: product.maxOrder || null,
        storeType: isWholesale ? 'wholesale' : 'retail',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } else {
      const doc = existing.docs[0];
      await db.collection(COLLECTIONS.CART).doc(doc.id).update({
        quantity: (doc.data().quantity || 0) + quantity,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
    
    showToast('✅ تم الإضافة للسلة', 'success');
    updateCartBadge();
    return true;
    
  } catch (error) {
    console.error('Error adding to cart:', error);
    showToast('❌ حدث خطأ', 'error');
    return false;
  }
}

function addToGuestCart(productId, quantity, customPrice) {
  let guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
  
  const existingIndex = guestCart.findIndex(item => item.productId === productId);
  
  if (existingIndex >= 0) {
    guestCart[existingIndex].quantity += quantity;
  } else {
    guestCart.push({
      productId,
      quantity,
      price: customPrice || 0,
      addedAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem('guest_cart', JSON.stringify(guestCart));
  showToast('✅ تم الإضافة للسلة', 'success');
  updateCartBadge();
  return true;
}

async function getCartItems() {
  const user = getCurrentUser();
  
  if (!user) {
    return JSON.parse(localStorage.getItem('guest_cart') || '[]');
  }
  
  try {
    const userId = user.data.id || user.data.uid;
    const snapshot = await db.collection(COLLECTIONS.CART)
      .where('userId', '==', userId)
      .get();
    
    const items = [];
    snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
    return items;
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
}

async function updateCartItemQty(cartItemId, newQty) {
  const user = getCurrentUser();
  if (!user) return;
  
  try {
    await db.collection(COLLECTIONS.CART).doc(cartItemId).update({
      quantity: newQty,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    updateCartBadge();
  } catch (error) {
    console.error('Error updating cart:', error);
  }
}

async function removeFromCart(cartItemId) {
  const user = getCurrentUser();
  if (!user) return;
  
  try {
    await db.collection(COLLECTIONS.CART).doc(cartItemId).delete();
    updateCartBadge();
    showToast('✅ تم الحذف', 'success');
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
}

async function clearCart() {
  const user = getCurrentUser();
  
  if (!user) {
    localStorage.removeItem('guest_cart');
    updateCartBadge();
    return;
  }
  
  try {
    const userId = user.data.id || user.data.uid;
    const snapshot = await db.collection(COLLECTIONS.CART)
      .where('userId', '==', userId)
      .get();
    
    const batch = db.batch();
    snapshot.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    
    updateCartBadge();
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
}

async function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  const mobileBadge = document.getElementById('mobile-cart-badge');
  
  try {
    const items = await getCartItems();
    const total = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    if (badge) {
      badge.textContent = total;
      badge.style.display = total > 0 ? 'inline-flex' : 'none';
    }
    if (mobileBadge) {
      mobileBadge.textContent = total;
      mobileBadge.style.display = total > 0 ? 'inline-flex' : 'none';
    }
  } catch (error) {
    console.error('Error updating cart badge:', error);
  }
}

// ============================================================
// 7️⃣ نظام المفضلة (Wishlist)
// ============================================================

async function addToWishlist(productId) {
  const user = getCurrentUser();
  if (!user) {
    showToast('⚠️ سجل الدخول أولاً', 'warning');
    return;
  }
  
  try {
    const userId = user.data.id || user.data.uid;
    const existing = await db.collection(COLLECTIONS.WISHLIST)
      .where('userId', '==', userId)
      .where('productId', '==', productId)
      .get();
    
    if (!existing.empty) {
      showToast('⚠️ المنتج في المفضلة بالفعل', 'warning');
      return;
    }
    
    await db.collection(COLLECTIONS.WISHLIST).add({
      userId,
      productId,
      addedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    showToast('❤️ تم الإضافة للمفضلة', 'success');
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    showToast('❌ حدث خطأ', 'error');
  }
}

async function removeFromWishlist(productId) {
  const user = getCurrentUser();
  if (!user) return;
  
  try {
    const userId = user.data.id || user.data.uid;
    const snapshot = await db.collection(COLLECTIONS.WISHLIST)
      .where('userId', '==', userId)
      .where('productId', '==', productId)
      .get();
    
    const batch = db.batch();
    snapshot.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    
    showToast('✅ تم الحذف من المفضلة', 'success');
  } catch (error) {
    console.error('Error removing from wishlist:', error);
  }
}

async function isInWishlist(productId) {
  const user = getCurrentUser();
  if (!user) return false;
  
  try {
    const userId = user.data.id || user.data.uid;
    const snapshot = await db.collection(COLLECTIONS.WISHLIST)
      .where('userId', '==', userId)
      .where('productId', '==', productId)
      .get();
    
    return !snapshot.empty;
  } catch (error) {
    return false;
  }
}

// ============================================================
// 8️⃣ نظام الإشعارات
// ============================================================

async function loadNotifications() {
  const user = getCurrentUser();
  if (!user) return [];
  
  try {
    const userId = user.data.id || user.data.uid;
    const collection = user.type === 'admin' ? 'admin_notifications' : 'customer_notifications';
    
    const snapshot = await db.collection(collection)
      .where('userId', '==', userId)
      .where('read', '==', false)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();
    
    const notifications = [];
    snapshot.forEach(doc => notifications.push({ id: doc.id, ...doc.data() }));
    return notifications;
  } catch (error) {
    console.error('Error loading notifications:', error);
    return [];
  }
}

async function updateNotificationBadge() {
  const badge = document.getElementById('notification-badge');
  const mobileBadge = document.getElementById('mobile-notification-badge');
  
  const notifications = await loadNotifications();
  const count = notifications.length;
  
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  }
  if (mobileBadge) {
    mobileBadge.textContent = count;
    mobileBadge.style.display = count > 0 ? 'inline-flex' : 'none';
  }
}

function toggleNotifications() {
  const dropdown = document.getElementById('notifications-dropdown');
  if (!dropdown) return;
  
  const isShown = dropdown.classList.contains('show');
  
  document.querySelectorAll('.notifications-dropdown').forEach(el => el.classList.remove('show'));
  
  if (!isShown) {
    dropdown.classList.add('show');
    loadNotifications().then(notifications => {
      if (notifications.length === 0) {
        dropdown.innerHTML = '<div class="notification-empty"><i class="fas fa-bell-slash"></i> لا توجد إشعارات</div>';
        return;
      }
      
      let html = '';
      notifications.forEach(notif => {
        html += `
          <div class="notification-item" onclick="markNotificationRead('${notif.id}')">
            <div class="notification-title">${notif.title || 'إشعار'}</div>
            <div class="notification-body">${notif.body || notif.message || ''}</div>
            <div class="notification-time">${formatDateTime(notif.createdAt)}</div>
          </div>
        `;
      });
      dropdown.innerHTML = html;
    });
  }
}

async function markNotificationRead(notificationId) {
  const user = getCurrentUser();
  if (!user) return;
  
  const collection = user.type === 'admin' ? 'admin_notifications' : 'customer_notifications';
  
  try {
    await db.collection(collection).doc(notificationId).update({ read: true });
    updateNotificationBadge();
    toggleNotifications();
  } catch (error) {
    console.error('Error marking notification:', error);
  }
}

// ============================================================
// 9️⃣ تحميل المكونات (Header / Footer / Sidebar)
// ============================================================

async function loadHeader() {
  const placeholder = document.getElementById('header-placeholder');
  if (!placeholder) return;
  
  try {
    const res = await fetch('/gomla/assets/components/header.html');
    const html = await res.text();
    placeholder.innerHTML = html;
    updateHeader();
  } catch (error) {
    console.warn('⚠️ Header loading failed:', error);
  }
}

function updateHeader() {
  const user = getCurrentUser();
  const guestMode = document.getElementById('guest-mode');
  const userMode = document.getElementById('user-mode');
  
  if (user && userMode) {
    guestMode.style.display = 'none';
    userMode.style.display = 'flex';
    
    const avatar = document.getElementById('userAvatar');
    const name = document.getElementById('userName');
    const role = document.getElementById('userRole');
    
    if (avatar) avatar.src = user.data.avatar || 'assets/images/default-avatar.png';
    if (name) name.textContent = user.data.name || 'مستخدم';
    if (role) {
      const roleNames = {
        super: '👑 سوبر أدمن',
        admin: '🛡️ مشرف',
        cashier: '🧑‍💻 كاشير',
        wholesale: '🏪 تاجر',
        retail: '👤 عميل'
      };
      role.textContent = roleNames[user.data.role] || 'مستخدم';
    }
    
    updateHeaderButtons(user.data.role);
  } else if (guestMode) {
    guestMode.style.display = 'flex';
    if (userMode) userMode.style.display = 'none';
  }
}

function updateHeaderButtons(role) {
  const container = document.getElementById('header-center-buttons');
  if (!container) return;
  
  let html = '';
  
  if (role === ROLES.SUPER || role === ROLES.ADMIN) {
    html = `
      <a href="/gomla/admin/dashboard.html" class="btn btn-sm btn-outline">لوحة التحكم</a>
      <a href="/gomla/admin/orders.html" class="btn btn-sm btn-outline">الطلبات</a>
      <div class="dropdown-wrapper">
        <button class="btn btn-sm btn-outline">المتاجر ▾</button>
        <div class="dropdown-menu">
          <a href="/gomla/store-wholesale.html"><i class="fas fa-store"></i> متجر الجملة</a>
          <a href="/gomla/store-retail.html"><i class="fas fa-shopping-cart"></i> متجر القطاعي</a>
        </div>
      </div>
    `;
  } else if (role === ROLES.CASHIER) {
    html = `
      <a href="/gomla/cashier/home.html" class="btn btn-sm btn-outline">لوحة الكاشير</a>
      <a href="/gomla/cashier/sales.html" class="btn btn-sm btn-gold">فاتورة جديدة</a>
    `;
  } else if (role === ROLES.WHOLESALE) {
    html = `
      <a href="/gomla/store-wholesale.html" class="btn btn-sm btn-outline">المتجر</a>
      <a href="/gomla/customer/orders.html" class="btn btn-sm btn-outline">طلباتي</a>
    `;
  } else if (role === ROLES.RETAIL) {
    html = `
      <a href="/gomla/store-retail.html" class="btn btn-sm btn-outline">المتجر</a>
      <a href="/gomla/customer/orders.html" class="btn btn-sm btn-outline">طلباتي</a>
    `;
  }
  
  container.innerHTML = html;
}

async function loadFooter() {
  const placeholder = document.getElementById('footer-placeholder');
  if (!placeholder) return;
  
  try {
    const res = await fetch('/gomla/assets/components/footer.html');
    const html = await res.text();
    placeholder.innerHTML = html;
    updateFooter();
  } catch (error) {
    console.warn('⚠️ Footer loading failed:', error);
  }
}

function updateFooter() {
  const user = getCurrentUser();
  const role = user ? user.data.role : ROLES.GUEST;
  
  // العمود 1: ثابت
  const col1 = document.getElementById('footer-col-1');
  if (col1) {
    col1.innerHTML = `
      <a href="/gomla/about.html">من نحن</a>
      <a href="/gomla/privacy-policy.html">سياسة الخصوصية</a>
      <a href="/gomla/shipping-policy.html">سياسة الشحن</a>
      <a href="/gomla/exchange-policy.html">سياسة الاستبدال</a>
    `;
  }
  
  // العمود 2
  const col2 = document.getElementById('footer-col-2');
  if (col2) {
    if (role === ROLES.SUPER || role === ROLES.ADMIN) {
      col2.innerHTML = `
        <a href="/gomla/admin/dashboard.html">لوحة التحكم</a>
        <a href="/gomla/admin/products.html">المنتجات</a>
        <a href="/gomla/admin/orders.html">الطلبات</a>
        <a href="/gomla/admin/customers.html">العملاء</a>
        <a href="/gomla/admin/invoices.html">الفواتير</a>
      `;
    } else if (role === ROLES.WHOLESALE) {
      col2.innerHTML = `
        <a href="/gomla/store-wholesale.html">المتجر</a>
        <a href="/gomla/customer/orders.html">طلباتي</a>
        <a href="/gomla/customer/invoices.html">فواتيري</a>
        <a href="/gomla/customer/balance.html">الذمة المالية</a>
        <a href="/gomla/discounts.html">الخصومات</a>
      `;
    } else if (role === ROLES.RETAIL) {
      col2.innerHTML = `
        <a href="/gomla/store-retail.html">المتجر</a>
        <a href="/gomla/customer/orders.html">طلباتي</a>
        <a href="/gomla/customer/invoices.html">فواتيري</a>
        <a href="/gomla/wishlist.html">المفضلة</a>
        <a href="/gomla/offers.html">العروض</a>
      `;
    } else {
      col2.innerHTML = `
        <a href="/gomla/store-retail.html">متجر القطاعي</a>
        <a href="/gomla/login.html">تسجيل الدخول</a>
      `;
    }
  }
  
  // العمود 3
  const col3 = document.getElementById('footer-col-3');
  if (col3) {
    if (role === ROLES.SUPER) {
      col3.innerHTML = `
        <a href="/gomla/admin/settings.html">الإعدادات</a>
        <a href="/gomla/admin/generate-codes.html">توليد الأكواد</a>
        <a href="/gomla/admin/cashbox.html">الصندوق</a>
        <a href="/gomla/admin/financial-reports.html">التقارير</a>
      `;
    } else if (role === ROLES.ADMIN) {
      col3.innerHTML = `
        <a href="/gomla/admin/profile.html">بياناتي</a>
      `;
    } else {
      col3.innerHTML = '';
    }
  }
  
  // حقوق
  const copyright = document.getElementById('footer-copyright');
  if (copyright) {
    copyright.textContent = 'تم تنفيذ النظام كاملاً بواسطة Famo';
  }
}

async function loadSidebar() {
  const placeholder = document.getElementById('sidebar-placeholder');
  if (!placeholder) return;
  
  try {
    const res = await fetch('/gomla/assets/components/sidebar.html');
    const html = await res.text();
    placeholder.innerHTML = html;
    updateSidebar();
    initSidebarToggle();
  } catch (error) {
    console.warn('⚠️ Sidebar loading failed:', error);
  }
}

function updateSidebar() {
  const user = getCurrentUser();
  const role = user ? user.data.role : ROLES.GUEST;
  
  // معلومات المستخدم
  const avatar = document.getElementById('sidebarAvatar');
  const name = document.getElementById('sidebarUsername');
  const userRole = document.getElementById('sidebarUserRole');
  
  if (user) {
    if (avatar) avatar.src = user.data.avatar || 'assets/images/default-avatar.png';
    if (name) name.textContent = user.data.name || 'مستخدم';
    if (userRole) {
      const roleNames = {
        super: '👑 سوبر أدمن',
        admin: '🛡️ مشرف',
        cashier: '🧑‍💻 كاشير',
        wholesale: '🏪 تاجر',
        retail: '👤 عميل'
      };
      userRole.textContent = roleNames[role] || 'مستخدم';
    }
  } else {
    if (avatar) avatar.src = 'assets/images/default-avatar.png';
    if (name) name.textContent = 'زائر عزيز';
    if (userRole) userRole.textContent = 'مرحباً بك';
  }
  
  // الروابط
  const nav = document.getElementById('sidebarNav');
  if (!nav) return;
  
  let links = [];
  
  if (role === ROLES.SUPER) {
    links = [
      { icon: 'fa-home', text: 'الرئيسية', url: '/gomla' },
      { icon: 'fa-home', text: 'لوحة المسئول', url: '/gomla/admin/home.html' },
      { icon: 'fa-tachometer-alt', text: 'لوحة التحكم', url: '/gomla/admin/dashboard.html' },
      { icon: 'fa-key', text: 'توليد الأكواد', url: '/gomla/admin/generate-codes.html' },
      { icon: 'fa-boxes', text: 'المنتجات', url: '/gomla/admin/products.html' },
      { icon: 'fa-file-pdf', text: 'استخراج PDF', url: '/gomla/admin/extract-pdf.html' },
      { icon: 'fa-users', text: 'العملاء والتجار', url: '/gomla/admin/customers.html' },
      { icon: 'fa-shopping-bag', text: 'الطلبات', url: '/gomla/admin/orders.html' },
      { icon: 'fa-file-invoice', text: 'الفواتير', url: '/gomla/admin/invoices.html' },
      { icon: 'fa-file-invoice-dollar', text: 'المعاملات المالية', url: '/gomla/admin/financial-transactions.html' },
      { icon: 'fa-truck', text: 'الموردين', url: '/gomla/admin/suppliers.html' },
      { icon: 'fa-shopping-cart', text: 'المشتريات', url: '/gomla/admin/purchases.html' },
      { icon: 'fa-store', text: 'الفروع', url: '/gomla/admin/branches.html' },
      { icon: 'fa-calendar-day', text: 'المبيعات اليومية', url: '/gomla/admin/daily-sales.html' },
      { icon: 'fa-cash-register', text: 'الصندوق', url: '/gomla/admin/cashbox.html' },
      { icon: 'fa-chart-line', text: 'التقارير المالية', url: '/gomla/admin/financial-reports.html' },
      { icon: 'fa-barcode', text: 'قارئ الباركود', url: '/gomla/admin/barcode-scanner.html' },
      { icon: 'fa-trophy', text: 'المستويات', url: '/gomla/admin/ranks-levels.html' },
      { icon: 'fa-cog', text: 'الإعدادات', url: '/gomla/admin/settings.html' }
    ];
  } else if (role === ROLES.ADMINPLUS) {
    links = [
      { icon: 'fa-home', text: 'الرئيسية', url: '/gomla' },
      { icon: 'fa-home', text: 'لوحة المسئول', url: '/gomla/admin/home.html' },
      { icon: 'fa-tachometer-alt', text: 'لوحة التحكم', url: '/gomla/admin/dashboard.html' },
      { icon: 'fa-key', text: 'توليد الأكواد', url: '/gomla/admin/generate-codes.html' },
      { icon: 'fa-boxes', text: 'المنتجات', url: '/gomla/admin/products.html' },
      { icon: 'fa-file-pdf', text: 'استخراج PDF', url: '/gomla/admin/extract-pdf.html' },
      { icon: 'fa-users', text: 'العملاء والتجار', url: '/gomla/admin/customers.html' },
      { icon: 'fa-shopping-bag', text: 'الطلبات', url: '/gomla/admin/orders.html' },
      { icon: 'fa-file-invoice', text: 'الفواتير', url: '/gomla/admin/invoices.html' },
      { icon: 'fa-file-invoice-dollar', text: 'المعاملات المالية', url: '/gomla/admin/financial-transactions.html' },
      { icon: 'fa-truck', text: 'الموردين', url: '/gomla/admin/suppliers.html' },
      { icon: 'fa-shopping-cart', text: 'المشتريات', url: '/gomla/admin/purchases.html' },
      { icon: 'fa-store', text: 'الفروع', url: '/gomla/admin/branches.html' },
      { icon: 'fa-calendar-day', text: 'المبيعات اليومية', url: '/gomla/admin/daily-sales.html' },
      { icon: 'fa-cash-register', text: 'الصندوق', url: '/gomla/admin/cashbox.html' },
      { icon: 'fa-chart-line', text: 'التقارير المالية', url: '/gomla/admin/financial-reports.html' }
    ];
  } else if (role === ROLES.ADMIN) {
    links = [
      { icon: 'fa-home', text: 'الرئيسية', url: '/gomla' },
      { icon: 'fa-home', text: 'لوحة المسئول', url: '/gomla/admin/home.html' },
      { icon: 'fa-tachometer-alt', text: 'لوحة التحكم', url: '/gomla/admin/dashboard.html' },
      { icon: 'fa-boxes', text: 'المنتجات', url: '/gomla/admin/products.html' },
      { icon: 'fa-users', text: 'العملاء', url: '/gomla/admin/customers.html' },
      { icon: 'fa-shopping-bag', text: 'الطلبات', url: '/gomla/admin/orders.html' },
      { icon: 'fa-file-invoice', text: 'الفواتير', url: '/gomla/admin/invoices.html' },
      { icon: 'fa-chart-line', text: 'التقارير', url: '/gomla/admin/financial-reports.html' }
    ];
  } else if (role === ROLES.CASHIER) {
    links = [
      { icon: 'fa-home', text: 'الرئيسية', url: '/gomla' },
      { icon: 'fa-home', text: 'لوحة الكاشير', url: '/gomla/cashier/home.html' },
      { icon: 'fa-file-invoice', text: 'فاتورة جديدة', url: '/gomla/cashier/sales.html' },
      { icon: 'fa-boxes', text: 'مخزون الفرع', url: '/gomla/cashier/inventory.html' },
      { icon: 'fa-shopping-cart', text: 'المشتريات', url: '/gomla/cashier/purchases.html' },
      { icon: 'fa-barcode', text: 'الباركود', url: '/gomla/cashier/barcode-scanner.html' }
    ];
  } else if (role === ROLES.WHOLESALE) {
    links = [
      { icon: 'fa-home', text: 'الرئيسية', url: '/gomla' },
      { icon: 'fa-home', text: 'لوحة التُجار', url: '/gomla/trader-home.html' },
      { icon: 'fa-store', text: 'متجر الجملة', url: '/gomla/store-wholesale.html' },
      { icon: 'fa-shopping-bag', text: 'طلباتي', url: '/gomla/customer/orders.html' },
      { icon: 'fa-file-invoice', text: 'فواتيري', url: '/gomla/customer/invoices.html' },
      { icon: 'fa-coins', text: 'الذمة المالية', url: '/gomla/customer/balance.html' },
      { icon: 'fa-truck', text: 'تتبع الطلبات', url: '/gomla/tracking.html' },
      { text: 'الخصومات', url: '/gomla/discounts.html', icon: 'fa-percent' }
    ];
  } else if (role === ROLES.RETAIL) {
    links = [
      { icon: 'fa-home', text: 'الرئيسية', url: '/gomla' },      
      { icon: 'fa-home', text: 'لوحة العملاء', url: '/gomla/customer-home.html' },
      { icon: 'fa-store', text: 'متجر القطاعي', url: '/gomla/store-retail.html' },
      { icon: 'fa-shopping-bag', text: 'طلباتي', url: '/gomla/customer/orders.html' },
      { icon: 'fa-file-invoice', text: 'فواتيري', url: '/gomla/customer/invoices.html' },
      { icon: 'fa-truck', text: 'تتبع الطلبات', url: '/gomla/tracking.html' },
      { icon: 'fa-heart', text: 'المفضلة', url: '/gomla/wishlist.html' },
      { icon: 'fa-percent', text: 'العروض', url: '/gomla/offers.html' }
    ];
  } else {
    links = [
      { icon: 'fa-home', text: 'الرئيسية', url: '/gomla/' },
      { icon: 'fa-store', text: 'متجر القطاعي', url: '/gomla/store-retail.html' },
      { icon: 'fa-user-plus', text: 'تسجيل عميل', url: '/gomla/customer-login.html' }
    ];
  }
  
  let html = '';
  const currentPath = window.location.pathname;
  links.forEach(link => {
    const isActive = currentPath === link.url;
    html += `
      <a href="${link.url}" class="sidebar-link ${isActive ? 'active' : ''}">
        <i class="fas ${link.icon}"></i>
        <span>${link.text}</span>
      </a>
    `;
  });
  nav.innerHTML = html;
  
  // زر الخروج
  const footer = document.querySelector('.sidebar-footer');
  if (footer) {
    if (user) {
      footer.innerHTML = `
        <button class="sidebar-action-btn" onclick="logoutUser()">
          <i class="fas fa-sign-out-alt"></i> تسجيل الخروج
        </button>
      `;
    } else {
      footer.innerHTML = `
        <a href="/gomla/login.html" class="sidebar-action-btn">
          <i class="fas fa-sign-in-alt"></i> تسجيل الدخول
        </a>
      `;
    }
  }
}

function initSidebarToggle() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('smartSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const close = document.getElementById('sidebarClose');
  
  if (toggle && sidebar && overlay) {
    toggle.onclick = () => {
      sidebar.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
  }
  
  if (close && sidebar && overlay) {
    close.onclick = () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };
  }
  
  if (overlay) {
    overlay.onclick = () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };
  }
}

// ============================================================
// 🔟 مكونات الموبايل
// ============================================================

function isMobile() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

/**
 * الشريط العلوي للموبايل
 */
function loadMobileTopBar() {
  const placeholder = document.getElementById('mobile-top-bar');
  if (!placeholder) return;
  
  const user = getCurrentUser();
  const showUser = user !== null;
  
  let html = `
    <div class="mobile-top-bar-content">
      <div class="mobile-top-bar-left">
        <button class="top-bar-btn" onclick="openSearchModal()" title="بحث">
          <i class="fas fa-search"></i>
        </button>
      </div>
      
      <div class="mobile-top-bar-center">
        <a href="/gomla/" class="mobile-logo">
          <span>أولاد شعلان</span>
        </a>
      </div>
      
      <div class="mobile-top-bar-right">
        <button class="top-bar-btn" onclick="toggleNotifications()" title="إشعارات">
          <i class="fas fa-bell"></i>
          <span class="badge-count" id="mobile-notification-badge">0</span>
        </button>
        
        <button class="top-bar-btn" onclick="openCart()" title="السلة">
          <i class="fas fa-shopping-cart"></i>
          <span class="badge-count" id="mobile-cart-badge">0</span>
        </button>
        
        ${showUser ? `
          <button class="top-bar-btn avatar-btn" onclick="openProfile()" title="بياناتي">
            <img src="${user.data.avatar || 'assets/images/default-avatar.png'}" alt="المستخدم">
          </button>
          
          <button class="top-bar-btn" onclick="logoutUser()" title="خروج">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        ` : `
          <a href="/gomla/alogin.html" class="top-bar-btn" title="دخول">
            <i class="fas fa-user"></i>
          </a>
        `}
      </div>
    </div>
  `;
  
  placeholder.innerHTML = html;
}

/**
 * التبويبات العليا حسب الصلاحية
 */
function loadMobileTopTabs() {
  const placeholder = document.getElementById('mobile-top-tabs');
  if (!placeholder) return;
  
  const role = getUserRole();
  let tabs = [];
  
  if (role === ROLES.SUPER) {
    tabs = [
      { text: 'لوحة التحكم', url: '/gomla/admin/dashboard.html', icon: 'fa-tachometer-alt' },
      { text: 'الطلبات', url: '/gomla/admin/orders.html', icon: 'fa-shopping-bag' },
      { text: 'المنتجات', url: '/gomla/admin/products.html', icon: 'fa-boxes' },
      { text: 'الصندوق', url: '/gomla/admin/cashbox.html', icon: 'fa-cash-register' },
      { text: 'متجر الجملة', url: '/gomla/store-wholesale.html' },
      { text: 'متجر القطاعي', url: '/gomla/store-retail.html' }
    ];
  } else if (role === ROLES.ADMIN_PLUS) {
    tabs = [
      { text: 'لوحة التحكم', url: '/gomla/admin/dashboard.html', icon: 'fa-tachometer-alt' },
      { text: 'الطلبات', url: '/gomla/admin/orders.html', icon: 'fa-shopping-bag' },
      { text: 'المنتجات', url: '/gomla/admin/products.html', icon: 'fa-boxes' },
      { text: 'الصندوق', url: '/gomla/admin/cashbox.html', icon: 'fa-cash-register' },
      { text: 'متجر الجملة', url: '/gomla/store-wholesale.html' },
      { text: 'متجر القطاعي', url: '/gomla/store-retail.html' }
    ];

  } else if (role === ROLES.ADMIN) {
    tabs = [
      { text: 'لوحة التحكم', url: '/gomla/admin/dashboard.html', icon: 'fa-tachometer-alt' },
      { text: 'العملاء', url: '/gomla/admin/customers.html', icon: 'fa-users' },
      { text: 'الطلبات', url: '/gomla/admin/orders.html', icon: 'fa-shopping-bag' },
      { text: 'المنتجات', url: '/gomla/admin/products.html', icon: 'fa-boxes' },
      { text: 'مبيعات الفروع', url: '/gomla/admin/daily-sales.html', icon: 'fa-chart-bar' },
      { text: 'متجر الجملة', url: '/gomla/store-wholesale.html' },
      { text: 'متجر القطاعي', url: '/gomla/store-retail.html' }
    ];
  } else if (role === ROLES.CASHIER) {
    tabs = [
      { text: 'مبيعات', url: '/gomla/cashier/sales.html', icon: 'fa-file-invoice' },
      { text: 'مشتريات', url: '/gomla/cashier/purchases.html', icon: 'fa-shopping-cart' },
      { text: 'متجر جملة', url: '/gomla/store-wholesale.html', icon: 'fa-store' },
      { text: 'متجر قطاعي', url: '/gomla/store-retail.html', icon: 'fa-shopping-basket' }
    ];
  } else if (role === ROLES.WHOLESALE) {
    tabs = [
      { text: 'المتجر', url: '/gomla/store-wholesale.html', icon: 'fa-store' },
      { text: 'تتبع الطلبات', url: '/gomla/tracking.html', icon: 'fa-truck' },
      { text: 'آخر الطلبات', url: '/gomla/customer/orders.html', icon: 'fa-history' },
      { text: 'الخصومات', url: '/gomla/discounts.html', icon: 'fa-percent' }
    ];
  } else if (role === ROLES.RETAIL) {
    tabs = [
      { text: 'المتجر', url: '/gomla/store-retail.html', icon: 'fa-store' },
      { text: 'تتبع الطلبات', url: '/gomla/tracking.html', icon: 'fa-truck' },
      { text: 'آخر الطلبات', url: '/gomla/customer/orders.html', icon: 'fa-history' },
      { text: 'عروض', url: '/gomla/offers.html', icon: 'fa-percent' }
    ];
  } else {
    // الزائر
    tabs = [
      { text: 'أولاد شعلان ستور', url: '/gomla/store-retail.html', icon: 'fa-store' },
      { text: 'تسجيل كعميل', url: '/gomla/customer-register.html', icon: 'fa-user-plus' },
      { text: 'تسجيل كتاجر', url: '/gomla/support.html', icon: 'fa-store-alt' },
      { text: 'تسجيل الدخول', url: '/gomla/login.html', icon: 'fa-sign-in-alt' }
    ];
  }
  
  const currentPath = window.location.pathname;
  
  let html = '<div class="mobile-tabs-scroll">';
  tabs.forEach(tab => {
    const isActive = currentPath === tab.url;
    
    if (tab.dropdown) {
      html += `
        <div class="mobile-tab-btn dropdown ${isActive ? 'active' : ''}" onclick="toggleMobileTabDropdown(this)">
          <i class="fas ${tab.icon}"></i>
          <span>${tab.text}</span>
          <i class="fas fa-chevron-down" style="font-size:0.7rem;"></i>
          <div class="mobile-tab-dropdown">
            ${tab.dropdown.map(item => `<a href="${item.url}">${item.text}</a>`).join('')}
          </div>
        </div>
      `;
    } else {
      html += `
        <a href="${tab.url}" class="mobile-tab-btn ${isActive ? 'active' : ''}">
          <i class="fas ${tab.icon}"></i>
          <span>${tab.text}</span>
        </a>
      `;
    }
  });
  html += '</div>';
  
  placeholder.innerHTML = html;
}

function toggleMobileTabDropdown(el) {
  const dropdown = el.querySelector('.mobile-tab-dropdown');
  if (!dropdown) return;
  const isShown = dropdown.classList.contains('show');
  document.querySelectorAll('.mobile-tab-dropdown').forEach(d => d.classList.remove('show'));
  if (!isShown) dropdown.classList.add('show');
}

/**
 * التبويبات السفلى حسب الصفحة
 */
function loadMobileBottomTabs() {
  const placeholder = document.getElementById('mobile-bottom-tabs');
  if (!placeholder) return;
  
  const path = window.location.pathname;
  const role = getUserRole();
  let tabs = [];
  
  // الصفحات الرئيسية
  if (path === '/' || path.includes('index.html') || path.includes('store-')) {
    tabs = [
      { text: 'رئيسية', url: '/gomla', icon: 'fa-home' },
      { text: 'الأقسام', url: '/gomla/categories.html', icon: 'fa-th-large' },
      { text: 'المفضلة', url: '/gomla/wishlist.html', icon: 'fa-heart' },
      { text: 'السلة', url: '/gomla/cart.html', icon: 'fa-shopping-cart' },
      { text: 'القائمة', url: '#', icon: 'fa-bars', onclick: 'openSidebar()' }
    ];
  }
  // صفحة المنتجات
  else if (path.includes('admin/products.html')) {
    tabs = [
 { text: 'لوحة التحكم', url: '/gomla/admin/dashboard.html', icon: 'fa-plus' },   
  { text: 'إضافة منتج', url: '#', icon: 'fa-plus', onclick: 'openAddModal()' },
      { text: 'إضافة براند', url: '#', icon: 'fa-copyright', onclick: 'openBrandModal()' },
      { text: 'إضافة تصنيف', url: '#', icon: 'fa-tags', onclick: 'openCategoryModal()' },
      { text: 'نسخة احتياطية', url: '#', icon: 'fa-download', onclick: 'exportProducts()' },
      { text: 'القائمة', url: '#', icon: 'fa-bars', onclick: 'openSidebar()' }
    ];
  }
  // صفحة الطلبات
  else if (path.includes('admin/orders.html')) {
    tabs = [
      { text: 'تصدير', url: '#', icon: 'fa-file-export', onclick: 'exportOrders()' },
      { text: 'تحديث', url: '#', icon: 'fa-sync-alt', onclick: 'loadOrders()' },
      { text: 'بحث', url: '#', icon: 'fa-search', onclick: 'focusSearch()' },
      { text: 'إحصائيات', url: '#', icon: 'fa-chart-pie', onclick: 'scrollToStats()' },
      { text: 'القائمة', url: '#', icon: 'fa-bars', onclick: 'openSidebar()' }
    ];
  }
  // صفحة الفواتير
  else if (path.includes('admin/invoices.html')) {
    tabs = [
      { text: 'فاتورة جديدة', url: '#', icon: 'fa-plus', onclick: 'openAddInvoice()' },
      { text: 'تصدير', url: '#', icon: 'fa-file-export', onclick: 'exportInvoices()' },
      { text: 'بحث', url: '#', icon: 'fa-search', onclick: 'focusSearch()' },
      { text: 'ملخص', url: '#', icon: 'fa-chart-pie', onclick: 'scrollToStats()' },
      { text: 'القائمة', url: '#', icon: 'fa-bars', onclick: 'openSidebar()' }
    ];
  }
  // صفحة العملاء
  else if (path.includes('admin/customers.html')) {
    tabs = [
      { text: 'إضافة عميل', url: '#', icon: 'fa-user-plus', onclick: 'openAddCustomer()' },
      { text: 'إضافة تاجر', url: '#', icon: 'fa-store', onclick: 'openAddTrader()' },
      { text: 'بحث', url: '#', icon: 'fa-search', onclick: 'focusSearch()' },
      { text: 'توزيع', url: '#', icon: 'fa-map-marker-alt', onclick: 'scrollToDistribution()' },
      { text: 'القائمة', url: '#', icon: 'fa-bars', onclick: 'openSidebar()' }
    ];
  }
  // صفحة لوحة التحكم
  else if (path.includes('admin/dashboard.html')) {
    tabs = [
      { text: 'الإحصائيات', url: '#', icon: 'fa-chart-pie', onclick: 'scrollToStats()' },
      { text: 'الطلبات', url: '/gomla/admin/orders.html', icon: 'fa-shopping-bag' },
      { text: 'الفواتير', url: '/gomla/admin/invoices.html', icon: 'fa-file-invoice' },
      { text: 'التقارير', url: '/gomla/admin/financial-reports.html', icon: 'fa-chart-line' },
      { text: 'القائمة', url: '#', icon: 'fa-bars', onclick: 'openSidebar()' }
    ];
  }
  // صفحة الكاشير
  else if (path.includes('cashier/')) {
    tabs = [
      { text: 'فاتورة جديدة', url: '/gomla/cashier/sales.html', icon: 'fa-file-invoice' },
      { text: 'مخزون', url: '/gomla/cashier/inventory.html', icon: 'fa-boxes' },
      { text: 'مشتريات', url: '/gomla/cashier/purchases.html', icon: 'fa-shopping-cart' },
      { text: 'باركود', url: '/gomla/cashier/barcode-scanner.html', icon: 'fa-barcode' },
      { text: 'القائمة', url: '#', icon: 'fa-bars', onclick: 'openSidebar()' }
    ];
  }
  // صفحة السلة
  else if (path.includes('cart.html')) {
    tabs = [
      { text: 'المتجر', url: '/gomla/store-retail.html', icon: 'fa-store' },
      { text: 'الرئيسية', url: '/gomla/', icon: 'fa-home' },
      { text: 'تفريغ', url: '#', icon: 'fa-trash', onclick: 'clearCart()' },
      { text: 'تأكيد الطلب', url: '/gomla/checkout.html', icon: 'fa-check-circle' },
      { text: 'القائمة', url: '#', icon: 'fa-bars', onclick: 'openSidebar()' }
    ];
  }
  // صفحة افتراضية
  else {
    tabs = [
      { text: 'الرئيسية', url: '/gomla/', icon: 'fa-home' },
      { text: 'المتجر', url: '/gomla/store-retail.html', icon: 'fa-store' },
      { text: 'السلة', url: '/gomla/cart.html', icon: 'fa-shopping-cart' },
      { text: 'المفضلة', url: '/gomla/wishlist.html', icon: 'fa-heart' },
      { text: 'القائمة', url: '#', icon: 'fa-bars', onclick: 'openSidebar()' }
    ];
  }
  
  let html = '';
  tabs.forEach(tab => {
    if (tab.onclick) {
      html += `
        <button class="mobile-bottom-tab" onclick="${tab.onclick}">
          <i class="fas ${tab.icon}"></i>
          <span>${tab.text}</span>
        </button>
      `;
    } else {
      html += `
        <a href="${tab.url}" class="mobile-bottom-tab">
          <i class="fas ${tab.icon}"></i>
          <span>${tab.text}</span>
        </a>
      `;
    }
  });
  
  placeholder.innerHTML = html;
}

/**
 * شريط الحقوق
 */
function loadMobileCopyright() {
  const placeholder = document.getElementById('mobile-copyright');
  if (!placeholder) return;
  
  placeholder.innerHTML = `
    <div class="mobile-copyright-bar">
      تم تنفيذ النظام كاملاً بواسطة <strong>Famo</strong>
    </div>
  `;
}

// ============================================================
// 🔍 نظام البحث الموحد (يعمل في كل الصفحات)
// ============================================================

let searchTimeoutGlobal = null;

/**
 * فتح نافذة البحث
 */
function openSearchModal() {
  const overlay = document.getElementById('searchModalOverlay');
  const input = document.getElementById('searchModalInput');
  
  if (!overlay) {
    // لو النافذة مش موجودة → انتقل لصفحة البحث
    window.location.href = '/gomla/search.html';
    return;
  }
  
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 100);
  }
  
  const initialContent = document.getElementById('searchInitialContent');
  const resultsContainer = document.getElementById('searchResults');
  if (initialContent) initialContent.style.display = 'block';
  if (resultsContainer) resultsContainer.innerHTML = '';
}

/**
 * إغلاق نافذة البحث
 */
function closeSearchModal(event) {
  if (event && event.target !== event.currentTarget) return;
  
  const overlay = document.getElementById('searchModalOverlay');
  if (overlay) {
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
  
  const input = document.getElementById('searchModalInput');
  if (input) input.value = '';
}

/**
 * التعامل مع ضغطات لوحة المفاتيح
 */
function handleSearchKeydown(event) {
  if (event.key === 'Escape') {
    closeSearchModal();
  } else if (event.key === 'Enter') {
    const value = event.target.value.trim();
    if (value) {
      // الانتقال لصفحة نتائج البحث
      const user = getCurrentUser();
      const role = user ? user.data.role : ROLES.GUEST;
      const type = (role === ROLES.WHOLESALE || role === ROLES.ADMIN || role === ROLES.SUPER) 
        ? 'wholesale' 
        : 'retail';
      
      window.location.href = `/gomla/store-${type}.html?search=${encodeURIComponent(value)}`;
    }
  }
}

/**
 * البحث السريع بكلمة جاهزة
 */
function quickSearch(term) {
  const input = document.getElementById('searchModalInput');
  if (input) {
    input.value = term;
    handleModalSearch(term);
  }
}

/**
 * البحث الفوري
 */
async function handleModalSearch(searchTerm) {
  const resultsContainer = document.getElementById('searchResults');
  const initialContent = document.getElementById('searchInitialContent');
  
  if (!resultsContainer) return;
  
  // لو البحث قصير
  if (!searchTerm || searchTerm.trim().length < 2) {
    if (initialContent) initialContent.style.display = 'block';
    resultsContainer.innerHTML = '';
    return;
  }
  
  // إخفاء المحتوى الأولي
  if (initialContent) initialContent.style.display = 'none';
  
  // عرض التحميل
  resultsContainer.innerHTML = `
    <div class="search-loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p style="margin-top:8px;">جاري البحث...</p>
    </div>
  `;
  
  // Debounce
  if (searchTimeoutGlobal) clearTimeout(searchTimeoutGlobal);
  
  searchTimeoutGlobal = setTimeout(async () => {
    try {
      const term = searchTerm.trim().toLowerCase();
      
      // تحديد نوع المستخدم
      const user = getCurrentUser();
      const role = user ? user.data.role : ROLES.GUEST;
      const isWholesale = role === ROLES.WHOLESALE || role === ROLES.ADMIN || role === ROLES.SUPER;
      
      // جلب المنتجات
      const snapshot = await db.collection(COLLECTIONS.PRODUCTS)
        .where('available', '==', true)
        .limit(50)
        .get();
      
      // فلترة النتائج
      const results = [];
      snapshot.forEach(doc => {
        const p = doc.data();
        const name = (p.name || '').toLowerCase();
        const brand = (p.brandName || '').toLowerCase();
        const keywords = (p.keywords || '').toLowerCase();
        const barcode = (p.barcode || '').toLowerCase();
        
        if (name.includes(term) || 
            brand.includes(term) || 
            keywords.includes(term) ||
            barcode === term) {
          results.push({ id: doc.id, ...p });
        }
      });
      
      // عرض النتائج
      if (results.length === 0) {
        resultsContainer.innerHTML = `
          <div class="search-empty">
            <i class="fas fa-search-minus"></i>
            <p>لا توجد نتائج لـ "${searchTerm}"</p>
            <p style="font-size:0.85rem;margin-top:8px;">جرب كلمات أخرى</p>
          </div>
        `;
        return;
      }
      
      let html = `
        <div class="search-suggestions-header">
          <i class="fas fa-check-circle"></i>
          ${results.length} نتيجة
        </div>
      `;
      
      results.slice(0, 15).forEach(p => {
        // 🔒 السعر حسب نوع المستخدم
        const price = isWholesale ? 
          (p.wholesalePrice || 0) : 
          (p.retailPrice || 0);
        const unit = isWholesale ? 
          (p.unit || 'كرتونة') : 
          'قطعة';
        const stock = p.stockQuantity || 0;
        const isAvailable = stock > 0;
        
        html += `
          <a href="/gomla/product-details.html?id=${p.id}" 
             class="search-result-item">
            <img src="${p.imageUrl || '/gomla/assets/images/no-image.png'}"
                 alt="${p.name}"
                 onerror="this.src='/gomla/assets/images/no-image.png'">
            <div class="search-result-info">
              <div class="search-result-name">${p.name}</div>
              <div class="search-result-meta">
                <span class="search-result-price">
                  ${price.toFixed(2)} ج.م
                  <small>/ ${unit}</small>
                </span>
                ${p.brandName ? `
                  <span><i class="fas fa-tag" style="color:var(--gold);"></i> ${p.brandName}</span>
                ` : ''}
                ${!isAvailable ? `
                  <span style="color:var(--danger);">
                    <i class="fas fa-times-circle"></i> غير متوفر
                  </span>
                ` : ''}
              </div>
            </div>
            <i class="fas fa-arrow-left search-result-arrow"></i>
          </a>
        `;
      });
      
      resultsContainer.innerHTML = html;
      
    } catch (error) {
      console.error('Search error:', error);
      resultsContainer.innerHTML = `
        <div class="search-empty">
          <i class="fas fa-exclamation-triangle"></i>
          <p>حدث خطأ في البحث</p>
        </div>
      `;
    }
  }, 300);
}

// ===== ESC لإغلاق النافذة =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('searchModalOverlay');
    if (overlay && overlay.classList.contains('show')) {
      closeSearchModal();
    }
  }
});

// تصدير للاستخدام العالمي
window.openSearchModal = openSearchModal;
window.closeSearchModal = closeSearchModal;
window.handleSearchKeydown = handleSearchKeydown;
window.handleModalSearch = handleModalSearch;
window.quickSearch = quickSearch;
//نهاية البحث 

function openCart() {
  window.location.href = '/gomla/cart.html';
}

function openProfile() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/gomla/customer-login.html';
    return;
  }
  
  if (user.type === 'admin') {
    window.location.href = '/gomla/admin/profile.html';
  } else if (user.type === 'cashier') {
    window.location.href = '/gomla/cashier/home.html';
  } else {
    window.location.href = '/gomla/customer/profile.html';
  }
}

function openSidebar() {
  const sidebar = document.getElementById('smartSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar && overlay) {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('smartSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar && overlay) {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ============================================================
// 🚀 تشغيل الصفحة
// ============================================================

document.addEventListener('DOMContentLoaded', async function() {
  // تحميل المكونات الأساسية
  loadHeader();
  loadFooter();
  loadSidebar();
  
  // تحميل مكونات الموبايل
  if (isMobile()) {
    loadMobileTopBar();
    loadMobileTopTabs();
    loadMobileBottomTabs();
    loadMobileCopyright();
  }
  
  // تحديث العدادات
  updateCartBadge();
  updateNotificationBadge();
  
  // إغلاق القوائم عند الضغط خارجها
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.notification-badge')) {
      document.querySelectorAll('.notifications-dropdown').forEach(el => el.classList.remove('show'));
    }
    if (!e.target.closest('.dropdown-wrapper') && !e.target.closest('.mobile-tab-dropdown')) {
      document.querySelectorAll('.dropdown-menu, .mobile-tab-dropdown').forEach(el => el.classList.remove('show'));
    }
  });
  
  // إعادة تحميل عند تغيير حجم الشاشة
  window.addEventListener('resize', () => {
    if (isMobile()) {
      loadMobileTopBar();
      loadMobileTopTabs();
      loadMobileBottomTabs();
      loadMobileCopyright();
    }
  });
  
  console.log('✅ main.js v6.0 loaded successfully');
});

// ============================================================
// 🌐 تصدير الدوال عالمياً
// ============================================================

// المستخدم
window.getCurrentUser = getCurrentUser;
window.getUserRole = getUserRole;
window.isSuperAdmin = isSuperAdmin;
window.isAdmin = isAdmin;
window.isCashier = isCashier;
window.isWholesale = isWholesale;
window.isRetail = isRetail;
window.isGuest = isGuest;
window.hasPermission = hasPermission;
window.protectPage = protectPage;
window.protectAdminPage = protectAdminPage;
window.protectSuperAdminPage = protectSuperAdminPage;
window.protectCashierPage = protectCashierPage;
window.logoutUser = logoutUser;

// Toast
window.showToast = showToast;

// التواريخ
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.formatDateForInput = formatDateForInput;
window.formatTime = formatTime;

// الصور
window.uploadImage = uploadImage;

// مساعدة
window.generateCode = generateCode;
window.copyToClipboard = copyToClipboard;
window.validatePhone = validatePhone;
window.calculateAutoMaxOrder = calculateAutoMaxOrder;
window.calculateShipping = calculateShipping;
window.logActivity = logActivity;

// السلة
window.addToCart = addToCart;
window.getCartItems = getCartItems;
window.updateCartItemQty = updateCartItemQty;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.updateCartBadge = updateCartBadge;

// المفضلة
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.isInWishlist = isInWishlist;

// الإشعارات
window.loadNotifications = loadNotifications;
window.updateNotificationBadge = updateNotificationBadge;
window.toggleNotifications = toggleNotifications;
window.markNotificationRead = markNotificationRead;

// المكونات
window.loadHeader = loadHeader;
window.updateHeader = updateHeader;
window.loadFooter = loadFooter;
window.updateFooter = updateFooter;
window.loadSidebar = loadSidebar;
window.updateSidebar = updateSidebar;
window.initSidebarToggle = initSidebarToggle;

// الموبايل
window.isMobile = isMobile;
window.loadMobileTopBar = loadMobileTopBar;
window.loadMobileTopTabs = loadMobileTopTabs;
window.loadMobileBottomTabs = loadMobileBottomTabs;
window.loadMobileCopyright = loadMobileCopyright;
window.openSearch = openSearchModal;
window.openCart = openCart;
window.openProfile = openProfile;
window.openSidebar = openSidebar;
window.closeSidebar = closeSidebar;
window.toggleMobileTabDropdown = toggleMobileTabDropdown;
