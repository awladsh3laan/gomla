// ============================================================
// 🧠 main.js — v8.4 (كامل ومنظم)
// 📌 الملف الموحد للدوال الأساسية
// الإصدار: 8.4
// آخر تحديث: 2026-10-21
// ============================================================

// ============================================================
// 1️⃣ إدارة المستخدمين والصلاحيات
// ============================================================

function getCurrentUser() {
  const adminData = localStorage.getItem('admin');
  const customerData = localStorage.getItem('customer');
  const cashierData = localStorage.getItem('cashier');
  const deliveryData = localStorage.getItem('deliveryData');

  if (adminData) {
    return { type: 'admin', data: JSON.parse(adminData) };
  }
  if (cashierData) {
    return { type: 'cashier', data: JSON.parse(cashierData) };
  }
  if (deliveryData) {
    return { type: 'delivery', data: JSON.parse(deliveryData) };
  }
  if (customerData) {
    return { type: 'customer', data: JSON.parse(customerData) };
  }
  return null;
}

function getUserRole() {
  const user = getCurrentUser();
  if (!user) {
    return ROLES.GUEST;
  }
  return user.data.role || ROLES.GUEST;
}

function isSuperAdmin() {
  const user = getCurrentUser();
  return !!(
    user &&
    user.type === 'admin' &&
    user.data.role === ROLES.SUPER
  );
}

function isAdminPlus() {
  const user = getCurrentUser();
  return !!(
    user &&
    user.type === 'admin' &&
    user.data.role === ROLES.ADMIN_PLUS
  );
}

function isAdmin() {
  const user = getCurrentUser();
  if (!user || user.type !== 'admin') {
    return false;
  }
  return [
    ROLES.SUPER,
    ROLES.ADMIN_PLUS,
    ROLES.ADMIN
  ].includes(user.data.role);
}

function isCashier() {
  const user = getCurrentUser();
  return !!(user && user.type === 'cashier');
}

function isDelivery() {
  const user = getCurrentUser();
  return !!(
    user &&
    user.type === 'delivery' &&
    user.data.role === ROLES.DELIVERY
  );
}

function isDeliveryActive() {
  const user = getCurrentUser();
  if (!user || user.type !== 'delivery') {
    return false;
  }
  return user.data.active === true;
}

function isWholesale() {
  const user = getCurrentUser();
  return !!(
    user &&
    user.type === 'customer' &&
    user.data.role === ROLES.WHOLESALE
  );
}

function isRetail() {
  const user = getCurrentUser();
  return !!(
    user &&
    user.type === 'customer' &&
    user.data.role === ROLES.RETAIL
  );
}

function isCustomer() {
  return isWholesale() || isRetail();
}

function isGuest() {
  return !getCurrentUser();
}

function getRoleArabicName(role) {
  const names = {
    [ROLES.SUPER]: 'سوبر أدمن',
    [ROLES.ADMIN_PLUS]: 'أدمن بلص',
    [ROLES.ADMIN]: 'أدمن',
    [ROLES.CASHIER]: 'كاشير',
    [ROLES.WHOLESALE]: 'تاجر',
    [ROLES.RETAIL]: 'عميل',
    [ROLES.DELIVERY]: 'موصل',
    [ROLES.GUEST]: 'زائر'
  };
  return names[role] || role || 'غير معروف';
}

function hasPermission(permission) {
  const role = getUserRole();
  const perms = (
    typeof PERMISSIONS !== 'undefined' &&
    PERMISSIONS[role]
  ) || [];

  if (perms.includes('*')) {
    return true;
  }
  return perms.includes(permission);
}

// ============================================================
// 🛡️ دوال الحماية
// ============================================================

function _redirectWithToast(url, message, delay = 1500) {
  if (message && typeof showToast === 'function') {
    showToast(message, 'error');
  }
  setTimeout(() => {
    window.location.href = url;
  }, delay);
}

function protectPage(redirectUrl = '/gomla/customer/login.html') {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = redirectUrl;
    return false;
  }
  return true;
}

function protectAdminPage(requiredRoles = null) {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = '/gomla/admin/login.html';
    return false;
  }

  if (user.type !== 'admin') {
    _redirectWithToast(
      '/gomla/',
      'ليس لديك صلاحية للوصول لهذه الصفحة'
    );
    return false;
  }

  let allowedRoles;
  if (requiredRoles === null || requiredRoles === undefined) {
    allowedRoles = [
      ROLES.SUPER,
      ROLES.ADMIN_PLUS,
      ROLES.ADMIN
    ];
  } else if (Array.isArray(requiredRoles)) {
    allowedRoles = requiredRoles;
  } else {
    allowedRoles = [requiredRoles];
  }

  if (!allowedRoles.includes(user.data.role)) {
    const names = allowedRoles
      .map(r => getRoleArabicName(r))
      .join(' أو ');
    _redirectWithToast(
      '/gomla/admin/dashboard.html',
      `هذه الصفحة تتطلب: ${names}`
    );
    return false;
  }

  return true;
}

function protectSuperAdminPage() {
  return protectAdminPage([ROLES.SUPER]);
}

function protectAdminPlusPage() {
  return protectAdminPage([ROLES.SUPER, ROLES.ADMIN_PLUS]);
}

function protectAnyAdminPage() {
  return protectAdminPage();
}

function protectCashierPage() {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = '/gomla/cashier/login.html';
    return false;
  }

  if (
    user.type === 'admin' &&
    [ROLES.SUPER, ROLES.ADMIN_PLUS, ROLES.ADMIN].includes(user.data.role)
  ) {
    return true;
  }

  if (user.type === 'cashier') {
    return true;
  }

  _redirectWithToast('/gomla/', 'ليس لديك صلاحية');
  return false;
}

function protectCustomerPage(allowedRoles = [ROLES.RETAIL, ROLES.WHOLESALE]) {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = '/gomla/customer/login.html';
    return false;
  }

  if (user.type === 'admin') {
    _redirectWithToast(
      '/gomla/admin/dashboard.html',
      'هذه الصفحة للعملاء فقط'
    );
    return false;
  }

  if (user.type === 'cashier') {
    _redirectWithToast(
      '/gomla/cashier/home.html',
      'هذه الصفحة للعملاء فقط'
    );
    return false;
  }

  if (user.type === 'delivery') {
    _redirectWithToast(
      '/gomla/delivery/home.html',
      'هذه الصفحة للعملاء فقط'
    );
    return false;
  }

  if (!allowedRoles.includes(user.data.role)) {
    _redirectWithToast('/gomla/', 'ليس لديك صلاحية');
    return false;
  }

  return true;
}

function protectDeliveryPage() {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = '/gomla/delivery/login.html';
    return false;
  }

  if (user.type !== 'delivery') {
    _redirectWithToast(
      '/gomla/',
      'هذه الصفحة للموصلين فقط'
    );
    return false;
  }

  if (user.data.active !== true) {
    _redirectWithToast(
      '/gomla/delivery/login.html',
      'حسابك معطل'
    );
    return false;
  }

  return true;
}

// ============================================================
// 🚪 تسجيل الخروج
// ============================================================

function logoutUser() {
  if (!confirm('هل أنت متأكد من تسجيل الخروج؟')) {
    return;
  }

  try {
    if (firebase.auth().currentUser) {
      firebase.auth().signOut().catch(() => {});
    }
  } catch (err) {}

  [
    'admin',
    'customer',
    'cashier',
    'deliveryData',
    'adminId',
    'customerCode',
    'deliveryCode'
  ].forEach(k => localStorage.removeItem(k));

  window.location.href = '/gomla/';
}

window.logoutAdmin = logoutUser;

// ============================================================
// 🔗 مراقب الجلسات المتعددة
// ============================================================

(function () {
  'use strict';

  const WATCHED_KEYS = [
    'admin',
    'customer',
    'cashier',
    'deliveryData'
  ];

  const COUNTDOWN_SECONDS = 5;

  const EXCLUDED_PAGES = [
    '/login.html',
    '/customer/login.html',
    '/customer/register.html',
    '/trader/login.html',
    '/cashier/login.html',
    '/delivery/login.html',
    '/admin/login.html'
  ];

  let lastSnapshot = null;
  let overlayShown = false;
  let countdownTimer = null;

  function takeSnapshot() {
    return {
      admin: localStorage.getItem('admin'),
      customer: localStorage.getItem('customer'),
      cashier: localStorage.getItem('cashier'),
      deliveryData: localStorage.getItem('deliveryData')
    };
  }

  function snapshotsAreEqual(a, b) {
    return (
      a &&
      b &&
      a.admin === b.admin &&
      a.customer === b.customer &&
      a.cashier === b.cashier &&
      a.deliveryData === b.deliveryData
    );
  }

  function isExcludedPage() {
    const p = window.location.pathname;
    return EXCLUDED_PAGES.some(x => p.endsWith(x));
  }

  function getRoleNameFromKey(key, data) {
    if (!data) {
      return 'حساب آخر';
    }

    if (key === 'admin') {
      const n = {
        super: 'سوبر أدمن',
        admin_plus: 'أدمن بلص',
        admin: 'أدمن'
      };
      return n[data.role] || 'أدمن';
    }

    if (key === 'cashier') {
      return 'كاشير';
    }

    if (key === 'deliveryData') {
      return 'موصل';
    }

    if (key === 'customer') {
      if (data.role === 'wholesale') {
        return 'تاجر';
      }
      if (data.role === 'retail') {
        return 'عميل';
      }
    }

    return 'حساب آخر';
  }

  function buildOverlayHTML(type, roleName) {
    const isLogin = type === 'login';

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
          <div class="session-notice-top-bar" style="background:${config.iconBg};"></div>
          <div class="session-notice-icon" style="background:${config.iconBg};">
            <i class="fas ${config.iconClass}" style="color:${config.iconColor};"></i>
          </div>
          <h2 class="session-notice-title" style="color:${config.titleColor};">
            ${config.title}
          </h2>
          <p class="session-notice-message">
            ${config.message}
          </p>
          <p class="session-notice-submessage">
            <i class="fas fa-info-circle"></i> ${config.subMessage}
          </p>
          <div class="session-notice-counter-wrap">
            <svg class="session-counter-svg" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" stroke-width="8" />
              <circle id="sessionCounterCircle" cx="60" cy="60" r="52" fill="none" stroke="url(#counterGradient)" stroke-width="8" stroke-linecap="round" stroke-dasharray="326.7" stroke-dashoffset="0" transform="rotate(-90 60 60)" />
              <defs>
                <linearGradient id="counterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#c9a84c" />
                  <stop offset="100%" stop-color="#b8942a" />
                </linearGradient>
              </defs>
            </svg>
            <div class="session-counter-number" id="sessionCounterNumber">
              ${COUNTDOWN_SECONDS}
            </div>
          </div>
          <div class="session-notice-hint">
            سيتم التنفيذ خلال <strong id="sessionCounterHint">${COUNTDOWN_SECONDS}</strong> ثواني
          </div>
          <button class="session-notice-btn" id="sessionGoBtn" style="background:${config.iconBg};">
            <i class="fas fa-arrow-left"></i> الانتقال الآن
          </button>
        </div>
      </div>
    `;
  }

  function showOverlay(type, roleName) {
    if (overlayShown) {
      return;
    }
    overlayShown = true;
    injectStyles();

    const container = document.createElement('div');
    container.innerHTML = buildOverlayHTML(type, roleName);
    document.body.appendChild(container.firstElementChild);
    document.body.style.overflow = 'hidden';

    let seconds = COUNTDOWN_SECONDS;
    let elapsed = 0;

    const numberEl = document.getElementById('sessionCounterNumber');
    const hintEl = document.getElementById('sessionCounterHint');
    const circleEl = document.getElementById('sessionCounterCircle');
    const goBtn = document.getElementById('sessionGoBtn');
    const CIRCUMFERENCE = 326.7;

    function executeAction() {
      if (countdownTimer) {
        clearInterval(countdownTimer);
      }

      if (type === 'logout') {
        [
          'admin',
          'customer',
          'cashier',
          'deliveryData',
          'adminId',
          'customerCode',
          'deliveryCode'
        ].forEach(k => localStorage.removeItem(k));
        window.location.href = '/gomla/';
      } else {
        window.location.reload();
      }
    }

    goBtn.addEventListener('click', executeAction);

    countdownTimer = setInterval(() => {
      seconds--;
      elapsed++;

      if (numberEl) {
        numberEl.textContent = Math.max(0, seconds);
      }
      if (hintEl) {
        hintEl.textContent = Math.max(0, seconds);
      }
      if (circleEl) {
        circleEl.style.strokeDashoffset =
          CIRCUMFERENCE * Math.min(elapsed / COUNTDOWN_SECONDS, 1);
      }

      if (seconds <= 0) {
        clearInterval(countdownTimer);
        countdownTimer = null;
        executeAction();
      }
    }, 1000);
  }

  function injectStyles() {
    if (document.getElementById('sessionNoticeStyles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'sessionNoticeStyles';
    style.textContent = `
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
        background: #fff;
        border-radius: 20px;
        padding: 32px 28px 28px;
        max-width: 440px;
        width: 100%;
        box-shadow: 0 25px 70px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.2);
        text-align: center;
        position: relative;
        overflow: hidden;
        animation: snSlideUp 0.5s cubic-bezier(0.22,1,0.36,1);
        font-family: 'Tajawal', sans-serif;
      }
      @keyframes snSlideUp {
        0% { opacity: 0; transform: translateY(30px) scale(0.95); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      .session-notice-top-bar {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        height: 6px;
      }
      .session-notice-icon {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        font-size: 2.2rem;
        box-shadow: 0 12px 32px rgba(0,0,0,0.2);
        animation: snIconPulse 2s ease-in-out infinite;
        position: relative;
      }
      @keyframes snIconPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      .session-notice-title {
        font-size: 1.4rem;
        font-weight: 900;
        margin-bottom: 10px;
        line-height: 1.3;
      }
      .session-notice-message {
        font-size: 0.95rem;
        color: #4b5563;
        line-height: 1.6;
        margin-bottom: 8px;
      }
      .session-notice-message strong {
        color: #1a2a4a;
        font-weight: 900;
      }
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
      }
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
        line-height: 1;
      }
      .session-notice-hint {
        font-size: 0.85rem;
        color: #6b7280;
        margin-bottom: 22px;
      }
      .session-notice-hint strong {
        color: #c9a84c;
        font-weight: 900;
        font-size: 1rem;
      }
      .session-notice-btn {
        width: 100%;
        padding: 15px 24px;
        border: none;
        border-radius: 100px;
        color: #fff;
        font-weight: 900;
        font-size: 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: all .3s ease;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        font-family: inherit;
      }
      .session-notice-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(0,0,0,0.3);
      }
    `;
    document.head.appendChild(style);
  }

  function handleStorageChange(e) {
    if (!e.key || !WATCHED_KEYS.includes(e.key)) {
      return;
    }
    if (overlayShown) {
      return;
    }
    if (isExcludedPage()) {
      return;
    }

    const newSnapshot = takeSnapshot();
    if (snapshotsAreEqual(newSnapshot, lastSnapshot)) {
      return;
    }
    lastSnapshot = newSnapshot;

    if (e.newValue === null) {
      showOverlay('logout', null);
    } else {
      let newUser = null;
      try {
        newUser = JSON.parse(e.newValue);
      } catch (err) {}
      showOverlay('login', getRoleNameFromKey(e.key, newUser));
    }
  }

  function initSessionWatcher() {
    if (isExcludedPage()) {
      return;
    }
    lastSnapshot = takeSnapshot();
    window.addEventListener('storage', handleStorageChange);
  }

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

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================================
// 3️⃣ دوال التواريخ
// ============================================================

function formatDate(ts) {
  if (!ts) {
    return '---';
  }
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return '---';
  }
}

function formatDateTime(ts) {
  if (!ts) {
    return '---';
  }
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '---';
  }
}

function formatDateForInput(date) {
  if (!date) {
    return '';
  }
  const d = date.toDate ? date.toDate() : new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatTime(ts) {
  if (!ts) {
    return '---';
  }
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '---';
  }
}

// ============================================================
// 4️⃣ رفع الصور
// ============================================================

async function uploadImage(file, onProgress) {
  if (!file) {
    return null;
  }

  if (!window.WORKER_URL) {
    console.error('❌ WORKER_URL غير محدد');
    showToast('خطأ في إعدادات رفع الصور', 'error');
    return null;
  }

  try {
    if (onProgress) {
      onProgress(10);
    }

    const compressedFile = await imageCompression(file, IMAGE_CONFIG);

    if (onProgress) {
      onProgress(40);
    }

    const formData = new FormData();
    formData.append('image', compressedFile);

    if (onProgress) {
      onProgress(60);
    }

    const response = await fetch(`${window.WORKER_URL}/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${response.status}`);
    }

    const data = await response.json();

    if (onProgress) {
      onProgress(100);
    }

    if (data.success && data.url) {
      return data.url;
    }

    throw new Error(data.error || 'فشل رفع الصورة');
  } catch (error) {
    console.error('❌ uploadImage:', error);
    showToast('فشل رفع الصورة: ' + error.message, 'error');
    return null;
  }
}

// ============================================================
// 5️⃣ دوال مساعدة
// ============================================================

function generateCode(prefix = '', length = 4) {
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
  let r = prefix;
  for (let i = 0; i < length; i++) {
    r += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return r;
}

function generateDeliveryCode() {
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ23456789';
  const prefix = (DELIVERY_CONFIG && DELIVERY_CONFIG.CODE_PREFIX) || 'DEL-';
  const length = (DELIVERY_CONFIG && DELIVERY_CONFIG.CODE_LENGTH) || 5;
  const markers = (DELIVERY_CONFIG && DELIVERY_CONFIG.MARKERS) || ['@#$'];

  let code = prefix;
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code + markers[Math.floor(Math.random() * markers.length)];
}

function generateDeliveryEmail(code) {
  if (!code) {
    return '';
  }

  const domain =
    (DELIVERY_CONFIG && DELIVERY_CONFIG.EMAIL_DOMAIN) ||
    'delivery.awladshalaan.com';

  let safe = code
    .toLowerCase()
    .replace(/@/g, '-40')
    .replace(/#/g, '-35')
    .replace(/\$/g, '-36')
    .replace(/%/g, '-37')
    .replace(/&/g, '-38')
    .replace(/\*/g, '-42');

  return `${safe}@${domain}`;
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => showToast('تم النسخ', 'success'))
      .catch(() => showToast('فشل النسخ', 'error'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    showToast('تم النسخ', 'success');
  }
}

function validatePhone(phone) {
  return /^01[0-9]{9}$/.test(phone);
}

function roundToNearest5(amount) {
  return Math.round(amount / 5) * 5;
}

function calculatePaymentFee(baseTotal, method) {
  if (method === 'wallet') {
    return baseTotal * (WALLET_FEE_PERCENT / 100);
  }
  return 0;
}

function calculateAutoMaxOrder(s) {
  s = parseInt(s) || 0;
  if (s < 2) {
    return 0;
  }
  if (s < 8) {
    return 1;
  }
  if (s < 10) {
    return 2;
  }
  if (s < 15) {
    return 3;
  }
  if (s < 30) {
    return 4;
  }
  if (s < 50) {
    return 5;
  }
  if (s === 50) {
    return 7;
  }
  return 7 + Math.floor((s - 50) / 5) * 2;
}

function calculateShipping(region, subtotal, storeType) {
  const rates = window.SHIPPING_RATES_DEFAULTS[storeType];

  if (!rates || !rates[region]) {
    return {
      cost: 0,
      isFree: false,
      available: false
    };
  }

  const rate = rates[region];
  const isFree = subtotal >= rate.freeThreshold;

  return {
    cost: isFree ? 0 : rate.cost,
    isFree,
    available: true,
    freeThreshold: rate.freeThreshold
  };
}

function logActivity(action, details = '') {
  const user = getCurrentUser();
  if (!user || !window.db) {
    return;
  }

  db.collection(COLLECTIONS.ACTIVITY_LOG)
    .add({
      userId: user.data.id || user.data.uid || 'unknown',
      userName: user.data.name || 'unknown',
      userRole: user.data.role || 'unknown',
      action,
      details,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      url: window.location.pathname
    })
    .catch(() => {});
}

// ============================================================
// 6️⃣ نظام السلة
// ============================================================

async function addToCart(productId, quantity = 1, customPrice = null) {
  const user = getCurrentUser();

  if (!user) {
    return addToGuestCart(productId, quantity, customPrice);
  }

  try {
    const productDoc = await db
      .collection(COLLECTIONS.PRODUCTS)
      .doc(productId)
      .get();

    if (!productDoc.exists) {
      showToast('المنتج غير موجود', 'error');
      return false;
    }

    const product = productDoc.data();
    const userId = user.data.id || user.data.uid;

    const isWholesaleUser = [
      ROLES.WHOLESALE,
      ROLES.ADMIN,
      ROLES.SUPER,
      ROLES.ADMIN_PLUS
    ].includes(user.data.role);

    let price = customPrice || (
      isWholesaleUser
        ? (product.wholesalePrice || 0)
        : (product.retailPrice || 0)
    );

    const existing = await db
      .collection(COLLECTIONS.CART)
      .where('userId', '==', userId)
      .where('productId', '==', productId)
      .get();

    const existingQty = existing.empty
      ? 0
      : (existing.docs[0].data().quantity || 0);

    if (
      isWholesaleUser &&
      product.maxOrder &&
      existingQty + quantity > product.maxOrder
    ) {
      showToast(`الحد الأقصى ${product.maxOrder}`, 'warning');
      return false;
    }

    if (
      !isWholesaleUser &&
      existingQty + quantity > (product.stockQuantity || 0)
    ) {
      showToast(`المخزون ${product.stockQuantity || 0} فقط`, 'warning');
      return false;
    }

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
        stockQuantity: product.stockQuantity || 0,
        storeType: isWholesaleUser ? 'wholesale' : 'retail',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } else {
      await db
        .collection(COLLECTIONS.CART)
        .doc(existing.docs[0].id)
        .update({
          quantity: existingQty + quantity,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    showToast('تم الإضافة للسلة', 'success');
    updateCartBadge();
    return true;
  } catch (err) {
    console.error('addToCart:', err);
    showToast('حدث خطأ', 'error');
    return false;
  }
}

async function addToGuestCart(productId, quantity, customPrice) {
  try {
    const productDoc = await db
      .collection(COLLECTIONS.PRODUCTS)
      .doc(productId)
      .get();

    if (!productDoc.exists) {
      showToast('المنتج غير موجود', 'error');
      return false;
    }

    const product = productDoc.data();
    let guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
    const idx = guestCart.findIndex(item => item.productId === productId);

    if (idx >= 0) {
      guestCart[idx].quantity += quantity;
    } else {
      guestCart.push({
        productId,
        productName: product.name,
        imageUrl: product.imageUrl || '',
        quantity,
        unit: product.unit || 'قطعة',
        price: customPrice || product.retailPrice || 0,
        stockQuantity: product.stockQuantity || 0,
        maxOrder: product.maxOrder || null,
        addedAt: new Date().toISOString()
      });
    }

    localStorage.setItem('guest_cart', JSON.stringify(guestCart));
    showToast('تم الإضافة للسلة', 'success');
    updateCartBadge();
    return true;
  } catch (err) {
    console.error('addToGuestCart:', err);
    showToast('حدث خطأ', 'error');
    return false;
  }
}

async function getCartItems() {
  const user = getCurrentUser();

  if (!user) {
    return JSON.parse(localStorage.getItem('guest_cart') || '[]');
  }

  try {
    const userId = user.data.id || user.data.uid;
    const snap = await db
      .collection(COLLECTIONS.CART)
      .where('userId', '==', userId)
      .get();

    const items = [];
    snap.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
    return items;
  } catch {
    return [];
  }
}

async function updateCartItemQty(cartItemId, newQty) {
  const user = getCurrentUser();
  if (!user) {
    return;
  }

  try {
    await db
      .collection(COLLECTIONS.CART)
      .doc(cartItemId)
      .update({
        quantity: newQty,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    updateCartBadge();
  } catch (err) {
    console.error(err);
  }
}

async function removeFromCart(cartItemId) {
  const user = getCurrentUser();
  if (!user) {
    return;
  }

  try {
    await db.collection(COLLECTIONS.CART).doc(cartItemId).delete();
    updateCartBadge();
    showToast('تم الحذف', 'success');
  } catch (err) {
    console.error(err);
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
    const snap = await db
      .collection(COLLECTIONS.CART)
      .where('userId', '==', userId)
      .get();

    const batch = db.batch();
    snap.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    updateCartBadge();
  } catch (err) {
    console.error(err);
  }
}

async function updateCartBadge() {
  try {
    const items = await getCartItems();
    const total = items.reduce((s, i) => s + (i.quantity || 0), 0);

    const b1 = document.getElementById('cart-badge');
    if (b1) {
      b1.textContent = total;
      b1.style.display = total > 0 ? 'inline-flex' : 'none';
    }

    const b2 = document.getElementById('mobile-cart-badge');
    if (b2) {
      b2.textContent = total;
      b2.style.display = total > 0 ? 'inline-flex' : 'none';
    }
  } catch (err) {}
}

// ============================================================
// 7️⃣ المفضلة
// ============================================================

async function addToWishlist(productId) {
  const user = getCurrentUser();
  if (!user) {
    showToast('سجل الدخول أولاً', 'warning');
    return;
  }

  try {
    const userId = user.data.id || user.data.uid;

    const ex = await db
      .collection(COLLECTIONS.WISHLIST)
      .where('userId', '==', userId)
      .where('productId', '==', productId)
      .get();

    if (!ex.empty) {
      showToast('في المفضلة بالفعل', 'warning');
      return;
    }

    await db.collection(COLLECTIONS.WISHLIST).add({
      userId,
      productId,
      addedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    showToast('تم الإضافة للمفضلة', 'success');
  } catch {
    showToast('حدث خطأ', 'error');
  }
}

async function removeFromWishlist(productId) {
  const user = getCurrentUser();
  if (!user) {
    return;
  }

  try {
    const userId = user.data.id || user.data.uid;

    const snap = await db
      .collection(COLLECTIONS.WISHLIST)
      .where('userId', '==', userId)
      .where('productId', '==', productId)
      .get();

    const batch = db.batch();
    snap.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    showToast('تم الحذف', 'success');
  } catch {}
}

async function isInWishlist(productId) {
  const user = getCurrentUser();
  if (!user) {
    return false;
  }

  try {
    const userId = user.data.id || user.data.uid;

    const snap = await db
      .collection(COLLECTIONS.WISHLIST)
      .where('userId', '==', userId)
      .where('productId', '==', productId)
      .get();

    return !snap.empty;
  } catch {
    return false;
  }
}

// ============================================================
// 8️⃣ الإشعارات
// ============================================================

async function loadNotifications() {
  const user = getCurrentUser();
  if (!user) {
    return [];
  }

  try {
    const userId = user.data.id || user.data.uid;
    const collection = user.type === 'admin'
      ? 'admin_notifications'
      : 'customer_notifications';

    const snap = await db
      .collection(collection)
      .where('userId', '==', userId)
      .where('read', '==', false)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const n = [];
    snap.forEach(doc => n.push({ id: doc.id, ...doc.data() }));
    return n;
  } catch {
    return [];
  }
}

async function updateNotificationBadge() {
  const n = await loadNotifications();

  const b1 = document.getElementById('notification-badge');
  const b2 = document.getElementById('mobile-notification-badge');

  if (b1) {
    b1.textContent = n.length;
    b1.style.display = n.length > 0 ? 'inline-flex' : 'none';
  }

  if (b2) {
    b2.textContent = n.length;
    b2.style.display = n.length > 0 ? 'inline-flex' : 'none';
  }
}

function toggleNotifications() {
  const dd = document.getElementById('notifications-dropdown');
  if (!dd) {
    return;
  }

  const isShown = dd.classList.contains('show');

  document
    .querySelectorAll('.notifications-dropdown')
    .forEach(el => el.classList.remove('show'));

  if (!isShown) {
    dd.classList.add('show');

    loadNotifications().then(list => {
      if (list.length === 0) {
        dd.innerHTML =
          '<div class="notification-empty">' +
          '<i class="fas fa-bell-slash"></i> لا توجد إشعارات' +
          '</div>';
        return;
      }

      dd.innerHTML = list.map(n => `
        <div class="notification-item" onclick="markNotificationRead('${n.id}')">
          <div class="notification-title">${n.title || 'إشعار'}</div>
          <div class="notification-body">${n.body || n.message || ''}</div>
          <div class="notification-time">${formatDateTime(n.createdAt)}</div>
        </div>
      `).join('');
    });
  }
}

async function markNotificationRead(id) {
  const user = getCurrentUser();
  if (!user) {
    return;
  }

  const collection = user.type === 'admin'
    ? 'admin_notifications'
    : 'customer_notifications';

  try {
    await db.collection(collection).doc(id).update({ read: true });
    updateNotificationBadge();
    toggleNotifications();
  } catch {}
}

// ============================================================
// 9️⃣ تحميل المكونات (header / footer / sidebar / mobile)
// ============================================================

async function loadHeader() {
  const p = document.getElementById('header-placeholder');
  if (!p) {
    return;
  }

  try {
    const r = await fetch('/gomla/assets/components/header.html');
    p.innerHTML = await r.text();
    updateHeader();
  } catch (e) {
    console.warn('Header:', e);
  }
}

function updateHeader() {
  const user = getCurrentUser();
  const guest = document.getElementById('guest-mode');
  const um = document.getElementById('user-mode');

  if (user && um) {
    if (guest) {
      guest.style.display = 'none';
    }
    um.style.display = 'flex';

    const av = document.getElementById('userAvatar');
    const nm = document.getElementById('userName');
    const ro = document.getElementById('userRole');

    if (av) {
      av.src = user.data.avatar || '/gomla/assets/images/default-avatar.png';
    }
    if (nm) {
      nm.textContent = user.data.name || 'مستخدم';
    }
    if (ro) {
      const n = {
        super: 'سوبر أدمن',
        admin_plus: 'أدمن بلص',
        admin: 'أدمن',
        cashier: 'كاشير',
        wholesale: 'تاجر',
        retail: 'عميل',
        delivery: 'موصل'
      };
      ro.textContent = n[user.data.role] || 'مستخدم';
    }

    updateHeaderButtons(user.data.role);
  } else if (guest) {
    guest.style.display = 'flex';
    if (um) {
      um.style.display = 'none';
    }
  }
}

function updateHeaderButtons(role) {
  const c = document.getElementById('header-center-buttons');
  if (!c) {
    return;
  }

  let html = '';

  if ([ROLES.SUPER, ROLES.ADMIN_PLUS, ROLES.ADMIN].includes(role)) {
    html = `
      <a href="/gomla/admin/dashboard.html" class="btn btn-sm btn-outline">لوحة التحكم</a>
      <a href="/gomla/admin/orders.html" class="btn btn-sm btn-outline">الطلبات</a>
      <div class="dropdown-wrapper">
        <button class="btn btn-sm btn-outline">المتاجر</button>
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
  } else if (role === ROLES.DELIVERY) {
    html = `
      <a href="/gomla/delivery/home.html" class="btn btn-sm btn-outline">لوحة الموصل</a>
      <a href="/gomla/delivery/orders.html" class="btn btn-sm btn-outline">أوردراتي</a>
      <a href="/gomla/delivery/available.html" class="btn btn-sm btn-outline">منطقتي</a>
    `;
  } else if (role === ROLES.WHOLESALE) {
    html = `
      <a href="/gomla/store-wholesale.html" class="btn btn-sm btn-outline">المتجر</a>
      <a href="/gomla/customer/orders.html" class="btn btn-sm btn-outline">طلباتي</a>
      <a href="/gomla/support.html" class="btn btn-sm btn-outline">الدعم</a>
    `;
  } else if (role === ROLES.RETAIL) {
    html = `
      <a href="/gomla/store-retail.html" class="btn btn-sm btn-outline">المتجر</a>
      <a href="/gomla/customer/orders.html" class="btn btn-sm btn-outline">طلباتي</a>
      <a href="/gomla/support.html" class="btn btn-sm btn-outline">الدعم</a>
    `;
  }

  c.innerHTML = html;
}

async function loadFooter() {
  const p = document.getElementById('footer-placeholder');
  if (!p) {
    return;
  }

  try {
    const r = await fetch('/gomla/assets/components/footer.html');
    p.innerHTML = await r.text();
    updateFooter();
  } catch (e) {
    console.warn('Footer:', e);
  }
}

function updateFooter() {
  const user = getCurrentUser();
  const role = user ? user.data.role : ROLES.GUEST;

  const c1 = document.getElementById('footer-col-1');
  if (c1) {
    c1.innerHTML = `
      <a href="/gomla/support.html">الدعم و المساعدة</a>
      <a href="/gomla/faq.html">الأسئلة الشائعة</a>
      <a href="/gomla/about.html">من نحن</a>
      <a href="/gomla/privacy-policy.html">سياسة الخصوصية</a>
      <a href="/gomla/shipping-policy.html">سياسة الشحن</a>
      <a href="/gomla/exchange-policy.html">سياسة الاستبدال</a>
      <a href="/gomla/terms.html">الشروط والأحكام</a>
    `;
  }

  const c2 = document.getElementById('footer-col-2');
  if (c2) {
    if ([ROLES.SUPER, ROLES.ADMIN_PLUS, ROLES.ADMIN].includes(role)) {
      c2.innerHTML = `
        <a href="/gomla/admin/dashboard.html">لوحة التحكم</a>
        <a href="/gomla/admin/products.html">المنتجات</a>
        <a href="/gomla/admin/orders.html">الطلبات</a>
        <a href="/gomla/admin/customers.html">العملاء</a>
        <a href="/gomla/admin/invoices.html">الفواتير</a>
      `;
    } else if (role === ROLES.DELIVERY) {
      c2.innerHTML = `
        <a href="/gomla/delivery/home.html">لوحة الموصل</a>
        <a href="/gomla/delivery/orders.html">أوردراتي</a>
        <a href="/gomla/delivery/available.html">منطقتي</a>
        <a href="/gomla/delivery/collections.html">تحصيلاتي</a>
        <a href="/gomla/delivery/profile.html">بياناتي</a>
      `;
    } else if (role === ROLES.WHOLESALE) {
      c2.innerHTML = `
        <a href="/gomla/store-wholesale.html">المتجر</a>
        <a href="/gomla/customer/orders.html">طلباتي</a>
        <a href="/gomla/customer/invoices.html">فواتيري</a>
        <a href="/gomla/customer/balance.html">الذمة المالية</a>
        <a href="/gomla/discounts.html">الخصومات</a>
      `;
    } else if (role === ROLES.RETAIL) {
      c2.innerHTML = `
        <a href="/gomla/store-retail.html">المتجر</a>
        <a href="/gomla/customer/orders.html">طلباتي</a>
        <a href="/gomla/customer/invoices.html">فواتيري</a>
        <a href="/gomla/wishlist.html">المفضلة</a>
        <a href="/gomla/offers.html">العروض</a>
      `;
    } else {
      c2.innerHTML = `
        <a href="/gomla/store-retail.html">متجر القطاعي</a>
        <a href="/gomla/login.html">تسجيل الدخول</a>
        <a href="/gomla/register-guide.html">تسجيل حساب جديد</a>
      `;
    }
  }

  const c3 = document.getElementById('footer-col-3');
  if (c3) {
    if (role === ROLES.SUPER) {
      c3.innerHTML = `
        <a href="/gomla/admin/settings.html">الإعدادات</a>
        <a href="/gomla/admin/generate-codes.html">توليد الأكواد</a>
        <a href="/gomla/admin/delivery-agents.html">إدارة الموصلين</a>
        <a href="/gomla/admin/content-manager.html">إدارة المحتوى</a>
        <a href="/gomla/admin/cashbox.html">الصندوق</a>
        <a href="/gomla/admin/financial-reports.html">التقارير</a>
      `;
    } else if (role === ROLES.ADMIN_PLUS) {
      c3.innerHTML = `
        <a href="/gomla/admin/delivery-agents.html">إدارة الموصلين</a>
        <a href="/gomla/admin/profile.html">بياناتي</a>
      `;
    } else if (role === ROLES.ADMIN) {
      c3.innerHTML = `
        <a href="/gomla/admin/profile.html">بياناتي</a>
      `;
    } else {
      c3.innerHTML = '';
    }
  }

  const cr = document.getElementById('footer-copyright');
  if (cr) {
    cr.textContent = 'تم تنفيذ النظام كاملاً بواسطة Famo';
  }
}

async function loadSidebar() {
  const p = document.getElementById('sidebar-placeholder');
  if (!p) {
    return;
  }

  try {
    const r = await fetch('/gomla/assets/components/sidebar.html');
    p.innerHTML = await r.text();
    updateSidebar();
    initSidebarToggle();
  } catch (e) {
    console.warn('Sidebar:', e);
  }
}

function updateSidebar() {
  const user = getCurrentUser();
  const role = user ? user.data.role : ROLES.GUEST;

  const av = document.getElementById('sidebarAvatar');
  const nm = document.getElementById('sidebarUsername');
  const ro = document.getElementById('sidebarUserRole');

  if (user) {
    if (av) {
      av.src = user.data.avatar || '/gomla/assets/images/default-avatar.png';
    }
    if (nm) {
      nm.textContent = user.data.name || 'مستخدم';
    }
    if (ro) {
      const n = {
        super: 'سوبر أدمن',
        admin_plus: 'أدمن بلص',
        admin: 'أدمن',
        cashier: 'كاشير',
        wholesale: 'تاجر',
        retail: 'عميل',
        delivery: 'موصل'
      };
      ro.textContent = n[role] || 'مستخدم';
    }
  } else {
    if (av) {
      av.src = '/gomla/assets/images/default-avatar.png';
    }
    if (nm) {
      nm.textContent = 'زائر عزيز';
    }
    if (ro) {
      ro.textContent = 'مرحباً بك';
    }
  }

  const nav = document.getElementById('sidebarNav');
  if (!nav) {
    return;
  }

  let links = [];

  if (role === ROLES.SUPER) {
    links = [
      { icon: 'fa-home', text: 'الرئيسية', url: '/gomla' },
      { icon: 'fa-tachometer-alt', text: 'لوحة التحكم', url: '/gomla/admin/dashboard.html' },
      { icon: 'fa-key', text: 'توليد الأكواد', url: '/gomla/admin/generate-codes.html' },
      { icon: 'fa-truck-fast', text: 'إدارة الموصلين', url: '/gomla/admin/delivery-agents.html' },
      { icon: 'fa-boxes', text: 'المنتجات', url: '/gomla/admin/products.html' },
      { icon: 'fa-users', text: 'العملاء والتجار', url: '/gomla/admin/customers.html' },
      { icon: 'fa-shopping-bag', text: 'الطلبات', url: '/gomla/admin/orders.html' },
      { icon: 'fa-file-invoice', text: 'الفواتير', url: '/gomla/admin/invoices.html' },
      { icon: 'fa-file-invoice-dollar', text: 'المعاملات المالية', url: '/gomla/admin/financial-transactions.html' },
      { icon: 'fa-cash-register', text: 'الصندوق', url: '/gomla/admin/cashbox.html' },
      { icon: 'fa-chart-line', text: 'التقارير المالية', url: '/gomla/admin/financial-reports.html' },
      { icon: 'fa-warehouse', text: 'المخزون', url: '/gomla/admin/inventory-reports.html' },
      { icon: 'fa-tags', text: 'أسعار الشحن', url: '/gomla/admin/shipping-rates.html' },
      { icon: 'fa-file-pdf', text: 'استخراج كرتونة', url: '/gomla/admin/extract-pdf.html' },
      { icon: 'fa-cog', text: 'الإعدادات', url: '/gomla/admin/settings.html' },
      { icon: 'fa-ticket-alt', text: 'إدارة الدعم', url: '/gomla/admin/support.html' },
      { icon: 'fa-file-alt', text: 'إدارة المحتوى', url: '/gomla/admin/content-manager.html' },
      { icon: 'fa-user-plus', text: 'طلبات التسجيل', url: '/gomla/admin/registration-requests.html' }
    ];
  } else if (role === ROLES.ADMIN_PLUS) {
    links = [
      { icon: 'fa-home', text: 'الرئيسية', url: '/gomla' },
      { icon: 'fa-tachometer-alt', text: 'لوحة التحكم', url: '/gomla/admin/dashboard.html' },
      { icon: 'fa-truck-fast', text: 'إدارة الموصلين', url: '/gomla/admin/delivery-agents.html' },
      { icon: 'fa-boxes', text: 'المنتجات', url: '/gomla/admin/products.html' },
      { icon: 'fa-users', text: 'العملاء والتجار', url: '/gomla/admin/customers.html' },
      { icon: 'fa-shopping-bag', text: 'الطلبات', url: '/gomla/admin/orders.html' },
      { icon: 'fa-file-invoice', text: 'الفواتير', url: '/gomla/admin/invoices.html' },
      { icon: 'fa-file-invoice-dollar', text: 'المعاملات المالية', url: '/gomla/admin/financial-transactions.html' },
      { icon: 'fa-cash-register', text: 'الصندوق', url: '/gomla/admin/cashbox.html' },
      { icon: 'fa-chart-line', text: 'التقارير المالية', url: '/gomla/admin/financial-reports.html' },
      { icon: 'fa-warehouse', text: 'المخزون', url: '/gomla/admin/inventory-reports.html' },
      { icon: 'fa-tags', text: 'أسعار الشحن', url: '/gomla/admin/shipping-rates.html' },
      { icon: 'fa-file-pdf', text: 'استخراج كرتونة', url: '/gomla/admin/extract-pdf.html' },
      { icon: 'fa-ticket-alt', text: 'إدارة الدعم', url: '/gomla/admin/support.html' },
      { icon: 'fa-user-plus', text: 'طلبات التسجيل', url: '/gomla/admin/registration-requests.html' }
    ];
  } else if (role === ROLES.ADMIN) {
    links = [
      { icon: 'fa-home', text: 'الرئيسية', url: '/gomla' },
      { icon: 'fa-tachometer-alt', text: 'لوحة التحكم', url: '/gomla/admin/dashboard.html' },
      { icon: 'fa-boxes', text: 'المنتجات', url: '/gomla/admin/products.html' },
      { icon: 'fa-users', text: 'العملاء', url: '/gomla/admin/customers.html' },
      { icon: 'fa-shopping-bag', text: 'الطلبات', url: '/gomla/admin/orders.html' },
      { icon: 'fa-file-invoice', text: 'الفواتير', url: '/gomla/admin/invoices.html' },
      { icon: 'fa-chart-line', text: 'التقارير', url: '/gomla/admin/financial-reports.html' },
      { icon: 'fa-ticket-alt', text: 'إدارة الدعم', url: '/gomla/admin/support.html' }
    ];
  } else if (role === ROLES.DELIVERY) {
    links = [
      { icon: 'fa-home', text: 'لوحة الموصل', url: '/gomla/delivery/home.html' },
      { icon: 'fa-box', text: 'أوردراتي', url: '/gomla/delivery/orders.html' },
      { icon: 'fa-map-marked-alt', text: 'أوردرات منطقتي', url: '/gomla/delivery/available.html' },
      { icon: 'fa-money-bill-wave', text: 'تحصيلاتي', url: '/gomla/delivery/collections.html' },
      { icon: 'fa-user', text: 'بياناتي', url: '/gomla/delivery/profile.html' }
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
      { icon: 'fa-house', text: 'لوحة التجار', url: '/gomla/trader/home.html' },
      { icon: 'fa-percent', text: 'الخصومات', url: '/gomla/discounts.html' },
      { icon: 'fa-store', text: 'متجر الجملة', url: '/gomla/store-wholesale.html' },
      { icon: 'fa-shopping-bag', text: 'طلباتي', url: '/gomla/customer/orders.html' },
      { icon: 'fa-file-invoice', text: 'فواتيري', url: '/gomla/customer/invoices.html' },
      { icon: 'fa-coins', text: 'الذمة المالية', url: '/gomla/customer/balance.html' },
      { icon: 'fa-truck', text: 'تتبع الطلبات', url: '/gomla/tracking.html' },
      { icon: 'fa-headset', text: 'الدعم والمساعدة', url: '/gomla/support.html' }
    ];
  } else if (role === ROLES.RETAIL) {
    links = [
      { icon: 'fa-home', text: 'الرئيسية', url: '/gomla' },
      { icon: 'fa-home', text: 'لوحة العملاء', url: '/gomla/customer/home.html' },
      { icon: 'fa-store', text: 'متجر القطاعي', url: '/gomla/store-retail.html' },
      { icon: 'fa-shopping-bag', text: 'طلباتي', url: '/gomla/customer/orders.html' },
      { icon: 'fa-file-invoice', text: 'فواتيري', url: '/gomla/customer/invoices.html' },
      { icon: 'fa-truck', text: 'تتبع الطلبات', url: '/gomla/tracking.html' },
      { icon: 'fa-heart', text: 'المفضلة', url: '/gomla/wishlist.html' },
      { icon: 'fa-headset', text: 'الدعم والمساعدة', url: '/gomla/support.html' },
      { icon: 'fa-percent', text: 'العروض', url: '/gomla/offers.html' }
    ];
  } else {
    links = [
      { icon: 'fa-home', text: 'الرئيسية', url: '/gomla/' },
      { icon: 'fa-headset', text: 'الدعم والمساعدة', url: '/gomla/support.html' },
      { icon: 'fa-store', text: 'متجر القطاعي', url: '/gomla/store-retail.html' },
      { icon: 'fa-user-plus', text: 'تسجيل دخول عميل', url: '/gomla/customer/login.html' },
      { icon: 'fa-user-plus', text: 'طريقة التسجيل معنا', url: '/gomla/register-guide.html' }
    ];
  }

  const currentPath = window.location.pathname;

  nav.innerHTML = links.map(l => {
    const activeClass = currentPath === l.url ? ' active' : '';
    return `
      <a href="${l.url}" class="sidebar-link${activeClass}">
        <i class="fas ${l.icon}"></i>
        <span>${l.text}</span>
      </a>
    `;
  }).join('');

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

function loadMobileTopBar() {
  const p = document.getElementById('mobile-top-bar');
  if (!p) {
    return;
  }

  const user = getCurrentUser();

  p.innerHTML = `
    <div class="mobile-top-bar-content">
      <div class="mobile-top-bar-left">
        <button class="top-bar-btn" onclick="openSearchModal()" title="بحث">
          <i class="fas fa-search"></i>
        </button>
      </div>
      <div class="mobile-top-bar-center">
        <a href="/gomla/" class="mobile-logo"><span>أولاد شعلان</span></a>
      </div>
      <div class="mobile-top-bar-right">
        <button class="top-bar-btn" onclick="toggleNotifications()" title="إشعارات">
          <i class="fas fa-bell"></i>
          <span class="badge-count" id="mobile-notification-badge">0</span>
        </button>
        ${user && user.type !== 'delivery' ? `
          <button class="top-bar-btn" onclick="openCart()" title="السلة">
            <i class="fas fa-shopping-cart"></i>
            <span class="badge-count" id="mobile-cart-badge">0</span>
          </button>
        ` : ''}
        ${user ? `
          <button class="top-bar-btn avatar-btn" onclick="openProfile()" title="بياناتي">
            <img src="${user.data.avatar || '/gomla/assets/images/default-avatar.png'}" alt="المستخدم">
          </button>
          <button class="top-bar-btn" onclick="logoutUser()" title="خروج">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        ` : `
          <a href="/gomla/login.html" class="top-bar-btn" title="دخول">
            <i class="fas fa-user"></i>
          </a>
        `}
      </div>
    </div>
  `;
}

function loadMobileTopTabs() {
  const p = document.getElementById('mobile-top-tabs');
  if (!p) {
    return;
  }

  const role = getUserRole();
  let tabs = [];

  if ([ROLES.SUPER, ROLES.ADMIN_PLUS].includes(role)) {
    tabs = [
      { text: 'لوحة التحكم', url: '/gomla/admin/dashboard.html', icon: 'fa-tachometer-alt' },
      { text: 'الطلبات', url: '/gomla/admin/orders.html', icon: 'fa-shopping-bag' },
      { text: 'المنتجات', url: '/gomla/admin/products.html', icon: 'fa-boxes' },
      { text: 'الصندوق', url: '/gomla/admin/cashbox.html', icon: 'fa-cash-register' },
      { text: 'جملة', url: '/gomla/store-wholesale.html' },
      { text: 'قطاعي', url: '/gomla/store-retail.html' }
    ];
  } else if (role === ROLES.ADMIN) {
    tabs = [
      { text: 'لوحة التحكم', url: '/gomla/admin/dashboard.html', icon: 'fa-tachometer-alt' },
      { text: 'العملاء', url: '/gomla/admin/customers.html', icon: 'fa-users' },
      { text: 'الطلبات', url: '/gomla/admin/orders.html', icon: 'fa-shopping-bag' },
      { text: 'المنتجات', url: '/gomla/admin/products.html', icon: 'fa-boxes' },
      { text: 'جملة', url: '/gomla/store-wholesale.html' },
      { text: 'قطاعي', url: '/gomla/store-retail.html' }
    ];
  } else if (role === ROLES.DELIVERY) {
    tabs = [
      { text: 'لوحتي', url: '/gomla/delivery/home.html', icon: 'fa-home' },
      { text: 'أوردراتي', url: '/gomla/delivery/orders.html', icon: 'fa-box' },
      { text: 'منطقتي', url: '/gomla/delivery/available.html', icon: 'fa-map-marked-alt' },
      { text: 'تحصيلاتي', url: '/gomla/delivery/collections.html', icon: 'fa-money-bill-wave' }
    ];
  } else if (role === ROLES.CASHIER) {
    tabs = [
      { text: 'مبيعات', url: '/gomla/cashier/sales.html', icon: 'fa-file-invoice' },
      { text: 'مشتريات', url: '/gomla/cashier/purchases.html', icon: 'fa-shopping-cart' },
      { text: 'جملة', url: '/gomla/store-wholesale.html', icon: 'fa-store' },
      { text: 'قطاعي', url: '/gomla/store-retail.html', icon: 'fa-shopping-basket' }
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
    tabs = [
      { text: 'أولاد شعلان ستور', url: '/gomla/store-retail.html', icon: 'fa-store' },
      { text: 'تسجيل كعميل', url: '/gomla/customer/register.html', icon: 'fa-user-plus' },
      { text: 'تسجيل كتاجر', url: '/gomla/support.html', icon: 'fa-store-alt' },
      { text: 'تسجيل الدخول', url: '/gomla/login.html', icon: 'fa-sign-in-alt' }
    ];
  }

  const cp = window.location.pathname;

  p.innerHTML = `
    <div class="mobile-tabs-scroll">
      ${tabs.map(t => {
        const activeClass = cp === t.url ? ' active' : '';
        return `
          <a href="${t.url}" class="mobile-tab-btn${activeClass}">
            <i class="fas ${t.icon}"></i>
            <span>${t.text}</span>
          </a>
        `;
      }).join('')}
    </div>
  `;
}

function toggleMobileTabDropdown(el) {
  const dd = el.querySelector('.mobile-tab-dropdown');
  if (!dd) {
    return;
  }

  const s = dd.classList.contains('show');

  document
    .querySelectorAll('.mobile-tab-dropdown')
    .forEach(x => x.classList.remove('show'));

  if (!s) {
    dd.classList.add('show');
  }
}

function loadMobileBottomTabs() {
  const p = document.getElementById('mobile-bottom-tabs');
  if (!p) {
    return;
  }

  const path = window.location.pathname;
  let tabs = [];

  if (path.includes('delivery/')) {
    tabs = [
      { text: 'لوحتي', url: '/gomla/delivery/home.html', icon: 'fa-home' },
      { text: 'أوردراتي', url: '/gomla/delivery/orders.html', icon: 'fa-box' },
      { text: 'منطقتي', url: '/gomla/delivery/available.html', icon: 'fa-map-marked-alt' },
      { text: 'تحصيلاتي', url: '/gomla/delivery/collections.html', icon: 'fa-money-bill-wave' },
      { text: 'القائمة', url: '#', icon: 'fa-bars', onclick: 'openSidebar()' }
    ];
  } else if (
    path === '/' ||
    path.includes('index.html') ||
    path.includes('store-')
  ) {
    tabs = [
      { text: 'رئيسية', url: '/gomla', icon: 'fa-home' },
      { text: 'الأقسام', url: '/gomla/categories.html', icon: 'fa-th-large' },
      { text: 'المفضلة', url: '/gomla/wishlist.html', icon: 'fa-heart' },
      { text: 'السلة', url: '/gomla/cart.html', icon: 'fa-shopping-cart' },
      { text: 'القائمة', url: '#', icon: 'fa-bars', onclick: 'openSidebar()' }
    ];
  } else if (path.includes('cart.html')) {
    tabs = [
      { text: 'المتجر', url: '/gomla/store-retail.html', icon: 'fa-store' },
      { text: 'الرئيسية', url: '/gomla/', icon: 'fa-home' },
      { text: 'تفريغ', url: '#', icon: 'fa-trash', onclick: 'clearCart()' },
      { text: 'تأكيد الطلب', url: '/gomla/checkout.html', icon: 'fa-check-circle' },
      { text: 'القائمة', url: '#', icon: 'fa-bars', onclick: 'openSidebar()' }
    ];
  } else {
    tabs = [
      { text: 'الرئيسية', url: '/gomla/', icon: 'fa-home' },
      { text: 'المتجر', url: '/gomla/store-retail.html', icon: 'fa-store' },
      { text: 'السلة', url: '/gomla/cart.html', icon: 'fa-shopping-cart' },
      { text: 'المفضلة', url: '/gomla/wishlist.html', icon: 'fa-heart' },
      { text: 'القائمة', url: '#', icon: 'fa-bars', onclick: 'openSidebar()' }
    ];
  }

  p.innerHTML = tabs.map(t => {
    if (t.onclick) {
      return `
        <button class="mobile-bottom-tab" onclick="${t.onclick}">
          <i class="fas ${t.icon}"></i>
          <span>${t.text}</span>
        </button>
      `;
    }
    return `
      <a href="${t.url}" class="mobile-bottom-tab">
        <i class="fas ${t.icon}"></i>
        <span>${t.text}</span>
      </a>
    `;
  }).join('');
}

function loadMobileCopyright() {
  const p = document.getElementById('mobile-copyright');
  if (!p) {
    return;
  }

  p.innerHTML = `
    <div class="mobile-copyright-bar">
      تم تنفيذ النظام كاملاً بواسطة <strong>Famo</strong>
    </div>
  `;
}

// ============================================================
// 🔍 البحث
// ============================================================

function openSearchModal() {
  const o = document.getElementById('searchModalOverlay');
  const i = document.getElementById('searchModalInput');

  if (!o) {
    window.location.href = '/gomla/store-retail.html';
    return;
  }

  o.classList.add('show');
  document.body.style.overflow = 'hidden';

  if (i) {
    i.value = '';
    setTimeout(() => i.focus(), 100);
  }

  const ic = document.getElementById('searchInitialContent');
  const rc = document.getElementById('searchResults');

  if (ic) {
    ic.style.display = 'block';
  }
  if (rc) {
    rc.innerHTML = '';
  }
}

function closeSearchModal(e) {
  if (e && e.target !== e.currentTarget) {
    return;
  }

  const o = document.getElementById('searchModalOverlay');
  if (o) {
    o.classList.remove('show');
    document.body.style.overflow = '';
  }

  const i = document.getElementById('searchModalInput');
  if (i) {
    i.value = '';
  }
}

function handleSearchKeydown(e) {
  if (e.key === 'Escape') {
    closeSearchModal();
  } else if (e.key === 'Enter') {
    const v = e.target.value.trim();
    if (v) {
      const u = getCurrentUser();
      const role = u ? u.data.role : ROLES.GUEST;
      const type = [
        ROLES.WHOLESALE,
        ROLES.ADMIN,
        ROLES.SUPER,
        ROLES.ADMIN_PLUS
      ].includes(role) ? 'wholesale' : 'retail';

      window.location.href =
        `/gomla/store-${type}.html?search=${encodeURIComponent(v)}`;
    }
  }
}

function quickSearch(term) {
  const i = document.getElementById('searchModalInput');
  if (i) {
    i.value = term;
    handleModalSearch(term);
  }
}

async function handleModalSearch(term) {
  const rc = document.getElementById('searchResults');
  const ic = document.getElementById('searchInitialContent');

  if (!rc) {
    return;
  }

  if (!term || term.trim().length < 2) {
    if (ic) {
      ic.style.display = 'block';
    }
    rc.innerHTML = '';
    return;
  }

  if (ic) {
    ic.style.display = 'none';
  }

  rc.innerHTML = `
    <div class="search-loading">
      <i class="fas fa-spinner fa-spin"></i>
      <p style="margin-top:8px;">جاري البحث...</p>
    </div>
  `;

  setTimeout(async () => {
    try {
      const t = term.trim().toLowerCase();
      const u = getCurrentUser();
      const role = u ? u.data.role : ROLES.GUEST;

      const isWh = [
        ROLES.WHOLESALE,
        ROLES.ADMIN,
        ROLES.SUPER,
        ROLES.ADMIN_PLUS
      ].includes(role);

      const snap = await db
        .collection(COLLECTIONS.PRODUCTS)
        .where('available', '==', true)
        .limit(50)
        .get();

      const results = [];

      snap.forEach(doc => {
        const p = doc.data();
        const name = (p.name || '').toLowerCase();
        const brand = (p.brandName || '').toLowerCase();
        const kw = (p.keywords || '').toLowerCase();
        const bc = (p.barcode || '').toLowerCase();

        if (
          name.includes(t) ||
          brand.includes(t) ||
          kw.includes(t) ||
          bc === t
        ) {
          results.push({ id: doc.id, ...p });
        }
      });

      if (results.length === 0) {
        rc.innerHTML = `
          <div class="search-empty">
            <i class="fas fa-search-minus"></i>
            <p>لا توجد نتائج لـ "${term}"</p>
          </div>
        `;
        return;
      }

      rc.innerHTML =
        `<div class="search-suggestions-header">
          <i class="fas fa-check-circle"></i> ${results.length} نتيجة
        </div>` +
        results.slice(0, 15).map(p => {
          const price = isWh ? (p.wholesalePrice || 0) : (p.retailPrice || 0);
          const unit = isWh ? (p.unit || 'كرتونة') : 'قطعة';

          return `
            <a href="/gomla/product-details.html?id=${p.id}" class="search-result-item">
              <img
                src="${p.imageUrl || '/gomla/assets/images/no-image.png'}"
                alt="${p.name}"
                onerror="this.src='/gomla/assets/images/no-image.png'"
              >
              <div class="search-result-info">
                <div class="search-result-name">${p.name}</div>
                <div class="search-result-meta">
                  <span class="search-result-price">
                    ${price.toFixed(2)} ج.م <small>/ ${unit}</small>
                  </span>
                  ${p.brandName ? `
                    <span>
                      <i class="fas fa-tag" style="color:var(--gold);"></i>
                      ${p.brandName}
                    </span>
                  ` : ''}
                </div>
              </div>
              <i class="fas fa-arrow-left search-result-arrow"></i>
            </a>
          `;
        }).join('');
    } catch (e) {
      rc.innerHTML = `
        <div class="search-empty">
          <i class="fas fa-exclamation-triangle"></i>
          <p>حدث خطأ في البحث</p>
        </div>
      `;
    }
  }, 300);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const o = document.getElementById('searchModalOverlay');
    if (o && o.classList.contains('show')) {
      closeSearchModal();
    }
  }
});

// ============================================================
// 🔗 التنقل
// ============================================================

function openCart() {
  window.location.href = '/gomla/cart.html';
}

function openProfile() {
  const u = getCurrentUser();

  if (!u) {
    window.location.href = '/gomla/customer/login.html';
    return;
  }

  if (u.type === 'admin') {
    window.location.href = '/gomla/admin/profile.html';
  } else if (u.type === 'cashier') {
    window.location.href = '/gomla/cashier/home.html';
  } else if (u.type === 'delivery') {
    window.location.href = '/gomla/delivery/profile.html';
  } else {
    window.location.href = '/gomla/customer/profile.html';
  }
}

function openSidebar() {
  const s = document.getElementById('smartSidebar');
  const o = document.getElementById('sidebarOverlay');

  if (s && o) {
    s.classList.add('open');
    o.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeSidebar() {
  const s = document.getElementById('smartSidebar');
  const o = document.getElementById('sidebarOverlay');

  if (s && o) {
    s.classList.remove('open');
    o.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ============================================================
// 💳 formatPaymentMethodLabel
// ============================================================

function formatPaymentMethodLabel(method) {
  const labels = {
    cash: 'الدفع عند الاستلام',
    instapay: 'إنستا باي',
    wallet: 'محفظة إلكترونية',
    card: 'بطاقة بنكية',
    credit: 'آجل (تقسيط)',
    cod: 'الدفع عند الاستلام',
    online: 'دفع إلكتروني'
  };

  return labels[method] || method || '—';
}

// ============================================================
// 🆕 v8.4 — formatOrderStatusLabel
// ============================================================

function formatOrderStatusLabel(status) {
  const labels = {
    pending: 'قيد المراجعة',
    processing: 'جاري التحضير',
    ready: 'تم التجهيز',
    shipped: 'جاري الشحن',
    delivered: 'تم التسليم (نقد مع المندوب)',
    paid: 'مدفوع + خالص',
    rejected: 'مرفوض',
    rejected_by_customer: 'رفض العميل',
    cancelled: 'ملغي',
    auto_cancelled: 'ملغي تلقائي',
    returned: 'مرتجع'
  };

  return labels[status] || status || '—';
}

// ============================================================
// 🕒 releaseExpiredOrders — pending فقط
// ============================================================

const ORDER_RESERVATION_HOURS = 3;

async function releaseExpiredOrders() {
  if (!window.db) {
    return { count: 0 };
  }

  try {
    const cutoff = new Date(
      Date.now() - ORDER_RESERVATION_HOURS * 60 * 60 * 1000
    );

    const snap = await db
      .collection('orders')
      .where('reserved', '==', true)
      .where('released', '==', false)
      .where('status', '==', 'pending')
      .where('createdAt', '<', cutoff)
      .limit(20)
      .get();

    if (snap.empty) {
      return { count: 0 };
    }

    let count = 0;

    for (const doc of snap.docs) {
      const order = doc.data();

      if (!order.items || !Array.isArray(order.items)) {
        continue;
      }

      try {
        await db.runTransaction(async t => {
          const oDoc = await t.get(doc.ref);
          const o = oDoc.data();

          if (!o.reserved || o.released) {
            return;
          }

          // ⚠️ لا نمس الموافق عليها
          if (o.status !== 'pending') {
            return;
          }

          const isWholesale = o.storeType === 'wholesale';
          const branchId = o.branchId || 'RGB';

          for (const item of o.items) {
            const qty = item.quantity || 0;

            if (qty <= 0) {
              continue;
            }

            if (isWholesale) {
              t.update(
                db.collection('products').doc(item.productId),
                {
                  reservedPieces:
                    firebase.firestore.FieldValue.increment(-qty)
                }
              );
            } else {
              const invRef = db
                .collection('branch_inventory')
                .doc(`${branchId}_${item.productId}`);

              const invDoc = await t.get(invRef);

              if (invDoc.exists) {
                t.update(invRef, {
                  reservedQty:
                    firebase.firestore.FieldValue.increment(-qty),
                  availableQty:
                    firebase.firestore.FieldValue.increment(qty)
                });
              }
            }
          }

          t.update(doc.ref, {
            released: true,
            releasedAt: firebase.firestore.FieldValue.serverTimestamp(),
            releaseReason: 'auto_timeout_3h',
            status: 'auto_cancelled'
          });
        });

        count++;
      } catch (e) {
        console.warn('release fail', doc.id, e);
      }
    }

    return { count };
  } catch (err) {
    console.warn('releaseExpiredOrders:', err);
    return { count: 0, error: err.message };
  }
}

// ============================================================
// 🆕 v8.4 — ملاحظة تحذيرية على العميل
// ============================================================

async function addCustomerWarningNote(customerId, orderId, message) {
  if (!customerId) {
    return;
  }

  try {
    await db.collection('customers').doc(customerId).update({
      warningNote: message,
      warningNoteSetAt: firebase.firestore.FieldValue.serverTimestamp(),
      warningNoteOrderId: orderId || null
    });
  } catch (e) {
    console.warn('addCustomerWarningNote:', e);
  }
}

async function clearCustomerWarningNote(customerId) {
  if (!customerId) {
    return;
  }

  try {
    await db.collection('customers').doc(customerId).update({
      warningNote: '',
      warningNoteSetAt: null,
      warningNoteOrderId: null
    });
  } catch (e) {
    console.warn('clearCustomerWarningNote:', e);
  }
}

// ============================================================
// 🚀 تشغيل الصفحة
// ============================================================

document.addEventListener('DOMContentLoaded', async function () {
  loadHeader();
  loadFooter();
  loadSidebar();

  if (isMobile()) {
    loadMobileTopBar();
    loadMobileTopTabs();
    loadMobileBottomTabs();
    loadMobileCopyright();
  }

  updateCartBadge();
  updateNotificationBadge();

  document.addEventListener('click', e => {
    if (!e.target.closest('.notification-badge')) {
      document
        .querySelectorAll('.notifications-dropdown')
        .forEach(el => el.classList.remove('show'));
    }

    if (
      !e.target.closest('.dropdown-wrapper') &&
      !e.target.closest('.mobile-tab-dropdown')
    ) {
      document
        .querySelectorAll('.dropdown-menu, .mobile-tab-dropdown')
        .forEach(el => el.classList.remove('show'));
    }
  });

  window.addEventListener('resize', () => {
    if (isMobile()) {
      loadMobileTopBar();
      loadMobileTopTabs();
      loadMobileBottomTabs();
      loadMobileCopyright();
    }
  });

  console.log('✅ main.js v8.4 loaded');
});
// ============================================================
// 🆕 v8.5 — Real-time Watchers + System Pulse
// ============================================================

// ===== 1) watchData — onSnapshot موحد =====
window._activeWatchers = window._activeWatchers || {};

function watchData(collectionName, options, callback) {
  if (!window.db) { console.warn('watchData: db not ready'); return null; }
  options = options || {};
  const key = collectionName + '_' + JSON.stringify(options);
  if (window._activeWatchers[key]) return window._activeWatchers[key];

  let query = db.collection(collectionName);
  if (options.where) options.where.forEach(w => { query = query.where(w[0], w[1], w[2]); });
  if (options.orderBy) options.orderBy.forEach(o => { query = query.orderBy(o[0], o[1] || 'asc'); });
  if (options.limit) query = query.limit(options.limit);

  const unsub = query.onSnapshot(snap => {
    const docs = [];
    snap.forEach(doc => docs.push({ id: doc.id, ...doc.data() }));
    try { callback(docs); } catch (e) { console.warn('watchData callback:', e); }
  }, err => console.warn('watchData [' + collectionName + ']:', err.code));

  window._activeWatchers[key] = unsub;
  return unsub;
}

function unwatchData(collectionName, options) {
  options = options || {};
  const key = collectionName + '_' + JSON.stringify(options);
  if (window._activeWatchers[key]) {
    window._activeWatchers[key]();
    delete window._activeWatchers[key];
  }
}

// ===== 2) watchDoc — لمراقبة doc واحد =====
function watchDoc(collectionName, docId, callback) {
  if (!window.db) return null;
  const key = `${collectionName}/${docId}`;
  if (window._activeWatchers[key]) return window._activeWatchers[key];
  const unsub = db.collection(collectionName).doc(docId).onSnapshot(doc => {
    if (doc.exists) callback({ id: doc.id, ...doc.data() });
    else callback(null);
  }, err => console.warn('watchDoc [' + key + ']:', err.code));
  window._activeWatchers[key] = unsub;
  return unsub;
}

// ===== 3) pulseUpdate — إرسال إشارة "فيه تحديث" =====
async function pulseUpdate(source, detail) {
  if (!window.db) return;
  try {
    const user = getCurrentUser();
    await db.collection('system_pulse').doc('_global').set({
      lastUpdateAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastUpdateBy: user?.data?.id || 'system',
      lastUpdateByName: user?.data?.name || 'system',
      lastUpdateSource: source || 'unknown',
      lastUpdateDetail: detail || '',
      updateCount: firebase.firestore.FieldValue.increment(1)
    }, { merge: true });
  } catch (e) { console.warn('pulseUpdate failed:', e); }
}

// ===== 4) watchSystemPulse — استقبال الإشارات في صفحات الأدمن =====
let _pulseInitialized = false;
let _lastSeenPulseTs = 0;

function watchSystemPulse(onNewUpdate) {
  if (!window.db) return null;
  return db.collection('system_pulse').doc('_global').onSnapshot(doc => {
    if (!doc.exists) return;
    const data = doc.data();
    const newTs = data.lastUpdateAt?.toMillis?.() || 0;

    if (!_pulseInitialized) {
      _lastSeenPulseTs = newTs;
      _pulseInitialized = true;
      return;
    }

    if (newTs > _lastSeenPulseTs) {
      _lastSeenPulseTs = newTs;
      try { onNewUpdate(data); } catch (e) { console.warn('pulse callback:', e); }
    }
  }, err => console.warn('watchSystemPulse:', err.code));
}

// ===== 5) showRefreshBanner — بانر تحديث قابل لإعادة الاستخدام =====
function showRefreshBanner(pulseData, onRefresh) {
  let banner = document.getElementById('_refreshBanner');
  if (banner) banner.remove();

  const sourceLabels = {
    orders: 'الطلبات', transfers: 'النقل', products: 'المنتجات',
    sales: 'المبيعات', inventory: 'المخزون', branches: 'الفروع',
    customers: 'العملاء', settings: 'الإعدادات', damages: 'التالف'
  };
  const sourceLabel = sourceLabels[pulseData?.lastUpdateSource] || 'صفحة أخرى';
  const byName = pulseData?.lastUpdateByName || 'مستخدم آخر';
  const detail = pulseData?.lastUpdateDetail || '';

  banner = document.createElement('div');
  banner.id = '_refreshBanner';
  banner.innerHTML = `
    <div style="
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      background: linear-gradient(135deg, #1e40af, #3b82f6);
      color: white; padding: 14px 20px; border-radius: 12px;
      box-shadow: 0 8px 32px rgba(30,64,175,.4);
      z-index: 99999; max-width: 90vw; min-width: 320px;
      display: flex; align-items: center; gap: 12px;
      animation: slideDown 0.35s ease;
      font-family: Tajawal, sans-serif;
    ">
      <div style="font-size: 1.5rem;"><i class="fas fa-sync-alt"></i></div>
      <div style="flex: 1;">
        <div style="font-weight: 900; font-size: 0.92rem; margin-bottom: 2px;">
          فيه تحديث جديد في ${sourceLabel}
        </div>
        <div style="font-size: 0.75rem; opacity: 0.85;">
          من ${byName}${detail ? ' · ' + detail : ''}
        </div>
      </div>
      <button onclick="document.getElementById('_refreshBanner').remove(); ${onRefresh ? 'window._pulseRefresh()' : 'location.reload()'}"
        style="background: white; color: #1e40af; border: none; padding: 8px 16px;
        border-radius: 8px; font-weight: 900; cursor: pointer; font-family: inherit; white-space: nowrap;">
        <i class="fas fa-redo"></i> تحديث
      </button>
      <button onclick="document.getElementById('_refreshBanner').remove()"
        style="background: transparent; color: white; border: none; cursor: pointer; font-size: 1.2rem; padding: 4px;">
        &times;
      </button>
    </div>
    <style>
      @keyframes slideDown { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }
    </style>
  `;
  document.body.appendChild(banner);

  if (onRefresh) window._pulseRefresh = onRefresh;
  setTimeout(() => { if (banner && banner.parentNode) banner.remove(); }, 30000);
}

// ===== 6) generateInvoiceTrackCode — كود تتبع الفاتورة =====
function generateInvoiceTrackCode() {
  const d = new Date();
  const ymd = d.getFullYear().toString() +
              String(d.getMonth() + 1).padStart(2, '0') +
              String(d.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `INV-${ymd}-${rand}`;
}

// ===== 7) RETURN_WINDOW_HOURS + حساب العد التنازلي =====
const RETURN_WINDOW_HOURS = 48;

function getReturnDeadline(createdAt) {
  if (!createdAt) return null;
  const ms = createdAt.toMillis ? createdAt.toMillis() :
             createdAt.toDate ? createdAt.toDate().getTime() :
             (createdAt instanceof Date ? createdAt.getTime() : 0);
  if (!ms) return null;
  return new Date(ms + RETURN_WINDOW_HOURS * 60 * 60 * 1000);
}

function getReturnRemaining(createdAt) {
  const deadline = getReturnDeadline(createdAt);
  if (!deadline) return { expired: true, ms: 0, hours: 0, minutes: 0, text: 'انتهت', color: 'red' };
  const remaining = deadline.getTime() - Date.now();
  if (remaining <= 0) return { expired: true, ms: 0, hours: 0, minutes: 0, text: 'انتهت مدة الإرجاع', color: 'red' };

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  let color = 'green';
  if (hours < 6) color = 'orange';
  if (hours < 2) color = 'red';

  return {
    expired: false, ms: remaining, hours, minutes,
    text: hours > 0 ? `${hours} ساعة و${minutes} دقيقة` : `${minutes} دقيقة`,
    color
  };
}

function formatReturnDeadline(createdAt) {
  const deadline = getReturnDeadline(createdAt);
  if (!deadline) return '—';
  return deadline.toLocaleString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ===== 8) Cleanup على الخروج =====
window.addEventListener('beforeunload', () => {
  try {
    Object.values(window._activeWatchers).forEach(unsub => { try { unsub(); } catch {} });
  } catch {}
});

// ============================================================
// 🌐 تصدير الدوال
// ============================================================

window.getCurrentUser = getCurrentUser;
window.getUserRole = getUserRole;
window.isSuperAdmin = isSuperAdmin;
window.isAdminPlus = isAdminPlus;
window.isAdmin = isAdmin;
window.isCashier = isCashier;
window.isDelivery = isDelivery;
window.isDeliveryActive = isDeliveryActive;
window.isWholesale = isWholesale;
window.isRetail = isRetail;
window.isCustomer = isCustomer;
window.isGuest = isGuest;
window.hasPermission = hasPermission;

window.protectPage = protectPage;
window.protectAdminPage = protectAdminPage;
window.protectSuperAdminPage = protectSuperAdminPage;
window.protectAdminPlusPage = protectAdminPlusPage;
window.protectAnyAdminPage = protectAnyAdminPage;
window.protectCashierPage = protectCashierPage;
window.protectCustomerPage = protectCustomerPage;
window.protectDeliveryPage = protectDeliveryPage;

window.getRoleArabicName = getRoleArabicName;
window.logoutUser = logoutUser;
window.showToast = showToast;

window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.formatDateForInput = formatDateForInput;
window.formatTime = formatTime;

window.uploadImage = uploadImage;

window.generateCode = generateCode;
window.generateDeliveryCode = generateDeliveryCode;
window.generateDeliveryEmail = generateDeliveryEmail;
window.copyToClipboard = copyToClipboard;
window.validatePhone = validatePhone;
window.roundToNearest5 = roundToNearest5;
window.calculatePaymentFee = calculatePaymentFee;
window.calculateAutoMaxOrder = calculateAutoMaxOrder;
window.calculateShipping = calculateShipping;
window.logActivity = logActivity;

window.addToCart = addToCart;
window.getCartItems = getCartItems;
window.updateCartItemQty = updateCartItemQty;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.updateCartBadge = updateCartBadge;

window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.isInWishlist = isInWishlist;

window.loadNotifications = loadNotifications;
window.updateNotificationBadge = updateNotificationBadge;
window.toggleNotifications = toggleNotifications;
window.markNotificationRead = markNotificationRead;

window.loadHeader = loadHeader;
window.updateHeader = updateHeader;
window.loadFooter = loadFooter;
window.updateFooter = updateFooter;
window.loadSidebar = loadSidebar;
window.updateSidebar = updateSidebar;
window.initSidebarToggle = initSidebarToggle;

window.isMobile = isMobile;
window.loadMobileTopBar = loadMobileTopBar;
window.loadMobileTopTabs = loadMobileTopTabs;
window.loadMobileBottomTabs = loadMobileBottomTabs;
window.loadMobileCopyright = loadMobileCopyright;

window.openSearchModal = openSearchModal;
window.openCart = openCart;
window.openProfile = openProfile;
window.openSidebar = openSidebar;
window.closeSidebar = closeSidebar;
window.toggleMobileTabDropdown = toggleMobileTabDropdown;

window.formatPaymentMethodLabel = formatPaymentMethodLabel;
window.releaseExpiredOrders = releaseExpiredOrders;
window.formatOrderStatusLabel = formatOrderStatusLabel;
window.addCustomerWarningNote = addCustomerWarningNote;
window.clearCustomerWarningNote = clearCustomerWarningNote;
// ===== 9) Exports الجديدة =====
window.watchData = watchData;
window.unwatchData = unwatchData;
window.watchDoc = watchDoc;
window.pulseUpdate = pulseUpdate;
window.watchSystemPulse = watchSystemPulse;
window.showRefreshBanner = showRefreshBanner;
window.generateInvoiceTrackCode = generateInvoiceTrackCode;
window.getReturnDeadline = getReturnDeadline;
window.getReturnRemaining = getReturnRemaining;
window.formatReturnDeadline = formatReturnDeadline;
window.RETURN_WINDOW_HOURS = RETURN_WINDOW_HOURS;

// ============================================================
// 🆕 v8.6 — Draft Persistence (حفظ العمل أثناء refresh)
// ============================================================
const DraftManager = {
  PREFIX: 'gomla_draft_',
  MAX_AGE_HOURS: 24,
  _key(k) { return this.PREFIX + k; },
  save(key, data) {
    try { localStorage.setItem(this._key(key), JSON.stringify({ data, savedAt: Date.now() })); return true; }
    catch (e) { console.warn('DraftManager.save:', e); return false; }
  },
  load(key, maxAge) {
    try {
      const raw = localStorage.getItem(this._key(key));
      if (!raw) return null;
      const p = JSON.parse(raw);
      const ageH = (Date.now() - p.savedAt) / 3600000;
      if (ageH > (maxAge || this.MAX_AGE_HOURS)) { this.clear(key); return null; }
      return { ...p, ageHours: ageH };
    } catch { return null; }
  },
  clear(key) { try { localStorage.removeItem(this._key(key)); } catch {} }
};

function debounce(fn, delay = 300) {
  let t; return function (...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), delay); };
}

function createDraft(config) {
  const { key, getState, onRestore, autoSaveMs = 500, maxAgeHours = 24 } = config;
  const scheduleSave = debounce(() => {
    try { const s = getState(); if (s) DraftManager.save(key, s); } catch (e) { console.warn('draft save:', e); }
  }, autoSaveMs);
  return {
    saveNow() { try { const s = getState(); if (s) DraftManager.save(key, s); } catch {} },
    autoSave: scheduleSave,
    tryRestore() {
      const draft = DraftManager.load(key, maxAgeHours);
      if (draft?.data) { try { onRestore(draft.data); return draft; } catch (e) { console.warn('draft restore:', e); } }
      return null;
    },
    clear() { DraftManager.clear(key); },
    has() { return !!DraftManager.load(key, maxAgeHours); }
  };
}

function bindDraftInputs(selector, saveFn) {
  const c = document.querySelector(selector); if (!c) return;
  c.addEventListener('input', saveFn);
  c.addEventListener('change', saveFn);
}

// 🆕 Beep sound (Web Audio — بدون ملف خارجي)
let _beepCtx = null;
function playBeep(freq = 800, duration = 100) {
  try {
    if (!_beepCtx) _beepCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = _beepCtx.createOscillator(); const gain = _beepCtx.createGain();
    osc.connect(gain); gain.connect(_beepCtx.destination);
    osc.frequency.value = freq; osc.type = 'sine';
    gain.gain.setValueAtTime(0.25, _beepCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, _beepCtx.currentTime + duration / 1000);
    osc.start(); osc.stop(_beepCtx.currentTime + duration / 1000);
  } catch (e) { console.warn('beep:', e); }
}

window.DraftManager = DraftManager;
window.debounce = debounce;
window.createDraft = createDraft;
window.bindDraftInputs = bindDraftInputs;
window.playBeep = playBeep;

console.log('✅ main.js v8.6 DraftManager exports set');
