
// 🧠 main.js - الوظائف الموحدة (الإصدار النهائي)
// ============================================================
// 📌 يحتوي على: الهيدر، الفوتر، السايدبار، الصلاحيات،
//    الإشعارات، المفضلة، السلة، النسخ الاحتياطي، الباركود، الشحن
// ============================================================

// ===== استخدام آمن لـ Firebase =====
const db = window.db || firebase.firestore();
const auth = window.auth || firebase.auth();

// ============================================================
// 🔐 إدارة المستخدمين والصلاحيات
// ============================================================

/**
 * الحصول على بيانات المستخدم الحالي
 * @returns {Object|null} { type: 'admin'|'customer'|'guest', data: {...} }
 */
function getCurrentUser() {
  const adminData = localStorage.getItem('admin');
  const customerData = localStorage.getItem('customer');
  if (adminData) return { type: 'admin', data: JSON.parse(adminData) };
  if (customerData) return { type: 'customer', data: JSON.parse(customerData) };
  return null;
}

/**
 * الحصول على رتبة المستخدم
 * @returns {string} 'super' | 'admin' | 'customer' | 'guest'
 */
function getUserRole() {
  const user = getCurrentUser();
  if (!user) return 'guest';
  if (user.type === 'admin') return user.data.role || 'admin';
  return user.data.type || 'customer'; // customer_wholesale أو customer_retail
}

/**
 * حماية الصفحات (للمستخدمين المسجلين فقط)
 */
function protectPage() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/gomla/customer-login.html';
    return false;
  }
  return true;
}

/**
 * حماية صفحات السوبر أدمن فقط
 */
function protectSuperAdminPage() {
  const user = getCurrentUser();
  if (!user || user.type !== 'admin' || user.data.role !== 'super') {
    window.location.href = '/gomla/admin/login.html';
    return false;
  }
  return true;
}

/**
 * تسجيل الخروج
 */
function logoutUser() {
  localStorage.removeItem('admin');
  localStorage.removeItem('customer');
  window.location.href = '/gomla/';
}

// ============================================================
// 🧠 الهيدر الذكي (تحميل وتحديث)
// ============================================================

/**
 * تحميل الهيدر من ملف components/header.html
 */
function loadHeader() {
  fetch('/gomla/assets/components/header.html')
    .then(res => res.text())
    .then(html => {
      const placeholder = document.getElementById('header-placeholder');
      if (placeholder) {
        placeholder.innerHTML = html;
        updateHeader();
      }
    })
    .catch(() => {
      // نسخة احتياطية للهيدر
      const placeholder = document.getElementById('header-placeholder');
      if (placeholder) {
        placeholder.innerHTML = `
          <header class="smart-header">
            <div class="container">
              <div class="logo">أولاد شعلان</div>
              <div class="header-center"><span>مرحباً بك</span></div>
              <div class="header-right"><button onclick="logoutUser()">خروج</button></div>
            </div>
          </header>
        `;
      }
    });
}

/**
 * تحديث الهيدر حسب المستخدم الحالي
 */
function updateHeader() {
  const user = getCurrentUser();
  const guestMode = document.getElementById('guest-mode');
  const customerMode = document.getElementById('customer-mode');
  const adminMode = document.getElementById('admin-mode');
  const adminName = document.getElementById('adminName');
  const customerName = document.getElementById('customerName');
  const userAvatar = document.getElementById('userAvatar');
  const userRole = document.getElementById('userRole');

  // إخفاء الكل أولاً
  if (guestMode) guestMode.style.display = 'none';
  if (customerMode) customerMode.style.display = 'none';
  if (adminMode) adminMode.style.display = 'none';

  // إذا كان مستخدم مسجل
  if (user) {
    if (user.type === 'admin') {
      // وضع المدير
      if (adminMode) adminMode.style.display = 'flex';
      if (adminName) adminName.textContent = user.data.name || 'مدير';
      if (userAvatar) userAvatar.src = user.data.avatar || 'assets/images/default-avatar.png';
      if (userRole) userRole.textContent = user.data.role === 'super' ? 'سوبر أدمن' : 'مشرف';
      updateAdminHeaderButtons(user.data.role);
    } else if (user.type === 'customer') {
      // وضع العميل
      if (customerMode) customerMode.style.display = 'flex';
      if (customerName) customerName.textContent = user.data.name || 'عميل';
      if (userAvatar) userAvatar.src = user.data.avatar || 'assets/images/default-avatar.png';
      if (userRole) userRole.textContent = user.data.type === 'wholesale' ? 'تاجر جملة' : 'عميل قطاعي';
      updateCustomerHeaderButtons(user.data.type);
    }
  } else {
    // وضع الزائر
    if (guestMode) guestMode.style.display = 'flex';
  }
}

/**
 * تحديث أزرار المنتصف للمديرين
 */
function updateAdminHeaderButtons(role) {
  const container = document.getElementById('header-center-buttons');
  if (!container) return;

  let buttons = '';
  if (role === 'super') {
    buttons = `
      <a href="/gomla/admin/profile.html" class="btn btn-sm btn-outline">بياناتي</a>
      <a href="/gomla/admin/dashboard.html" class="btn btn-sm btn-outline">لوحة التحكم</a>
      <div class="dropdown">
        <button class="btn btn-sm btn-outline dropdown-toggle">المتجر ▾</button>
        <div class="dropdown-menu">
          <a href="/gomla/store-wholesale.html">متجر الجملة</a>
          <a href="/gomla/store-retail.html">متجر القطاعي</a>
        </div>
      </div>
      <a href="/gomla/admin/orders.html" class="btn btn-sm btn-outline">الطلبات</a>
      <a href="/gomla/admin/generate-codes.html" class="btn btn-sm btn-gold">توليد كود تاجر</a>
      <button onclick="logoutUser()" class="btn btn-sm btn-danger">خروج</button>
    `;
  } else {
    buttons = `
      <a href="/gomla/admin/profile.html" class="btn btn-sm btn-outline">بياناتي</a>
      <a href="/gomla/store-wholesale.html" class="btn btn-sm btn-outline">متجر جملة</a>
      <a href="/gomla/store-retail.html" class="btn btn-sm btn-outline">متجر قطاعي</a>
      <a href="/gomla/admin/orders.html" class="btn btn-sm btn-outline">الطلبات</a>
      <button onclick="logoutUser()" class="btn btn-sm btn-danger">خروج</button>
    `;
  }
  container.innerHTML = buttons;
}

/**
 * تحديث أزرار المنتصف للعملاء
 */
function updateCustomerHeaderButtons(type) {
  const container = document.getElementById('header-center-buttons');
  if (!container) return;

  const buttons = `
    <a href="/gomla/customer/profile.html" class="btn btn-sm btn-outline">بياناتي</a>
    <a href="/gomla/customer/orders.html" class="btn btn-sm btn-outline">طلباتي</a>
    <a href="/gomla/tracking.html" class="btn btn-sm btn-outline">تتبع الطلبات</a>
    <button onclick="logoutUser()" class="btn btn-sm btn-danger">خروج</button>
  `;
  container.innerHTML = buttons;
}

// ============================================================
// 👣 الفوتر الذكي (تحميل وتحديث)
// ============================================================

/**
 * تحميل الفوتر من ملف components/footer.html
 */
function loadFooter() {
  fetch('/gomla/assets/components/footer.html')
    .then(res => res.text())
    .then(html => {
      const placeholder = document.getElementById('footer-placeholder');
      if (placeholder) {
        placeholder.innerHTML = html;
        updateFooter();
      }
    })
    .catch(() => {
      // نسخة احتياطية للفوتر
      const placeholder = document.getElementById('footer-placeholder');
      if (placeholder) {
        placeholder.innerHTML = `
          <footer class="smart-footer">
            <div class="container">
              <div class="copyright">© 2026 أولاد شعلان جملة</div>
            </div>
          </footer>
        `;
      }
    });
}

/**
 * تحديث الفوتر حسب المستخدم الحالي
 */
function updateFooter() {
  const user = getCurrentUser();
  const role = getUserRole();

  // تحديث القائمة 1 (ثابتة للكل)
  updateFooterColumn1();

  // تحديث القائمة 2 (حسب المستخدم)
  updateFooterColumn2(role);

  // تحديث القائمة 3 (حسب المستخدم)
  updateFooterColumn3(role);

  // تحديث حقوق التصميم
  updateFooterCopyright();
}

/**
 * القائمة 1 (ثابتة للكل)
 */
function updateFooterColumn1() {
  const container = document.getElementById('footer-col-1');
  if (!container) return;
  container.innerHTML = `
    <a href="/gomla/about.html">من نحن</a>
    <a href="/gomla/privacy-policy.html">سياسة الخصوصية</a>
    <a href="/gomla/terms.html">الشروط والأحكام</a>
    <a href="/gomla/how-to-use.html">استخدام الموقع</a>
    <a href="/gomla/download-app.html">تنزيل التطبيق</a>
  `;
}

/**
 * القائمة 2 (حسب المستخدم)
 */
function updateFooterColumn2(role) {
  const container = document.getElementById('footer-col-2');
  if (!container) return;

  let links = '';
  switch (role) {
    case 'super':
    case 'admin':
      links = `
        <a href="/gomla/store-wholesale.html">متجر جملة</a>
        <a href="/gomla/store-retail.html">متجر قطاعي</a>
        <a href="/gomla/admin/roles.html">صلاحياتك</a>
        <a href="/gomla/admin/customers.html">العملاء</a>
        <a href="/gomla/admin/offers.html">العروض</a>
        <a href="/gomla/admin/products.html">منتجات مضافة حديثاً</a>
      `;
      break;
    case 'customer_wholesale':
      links = `
        <a href="/gomla/store-wholesale.html">المتجر (جملة)</a>
        <a href="/gomla/faq-trader.html">أسئلة شائعة (لتجار)</a>
        <a href="/gomla/tracking.html">تتبع الطلبات</a>
        <a href="/gomla/cart.html">السلة</a>
        <a href="/gomla/offers.html">العروض</a>
        <a href="/gomla/best-sellers.html">المنتجات الأكثر مبيعاً</a>
      `;
      break;
    case 'customer_retail':
      links = `
        <a href="/gomla/store-retail.html">المتجر (قطاعي)</a>
        <a href="/gomla/faq-customer.html">أسئلة شائعة (للعملاء)</a>
        <a href="/gomla/tracking.html">تتبع الطلبات</a>
        <a href="/gomla/cart.html">السلة</a>
        <a href="/gomla/offers.html">العروض</a>
        <a href="/gomla/best-sellers.html">المنتجات الأكثر مبيعاً</a>
      `;
      break;
    default: // زائر
      links = `
        <a href="/gomla/store-retail.html">المتجر (قطاعي)</a>
        <a href="/gomla/register.html">تسجيل</a>
        <a href="/gomla/faq-visitor.html">أسئلة شائعة (للزوار)</a>
      `;
  }
  container.innerHTML = links;
}

/**
 * القائمة 3 (حسب المستخدم - للسوبر أدمن)
 */
function updateFooterColumn3(role) {
  const container = document.getElementById('footer-col-3');
  if (!container) return;

  let links = '';
  if (role === 'super') {
    links = `
      <a href="/gomla/admin/manage-about.html">إدارة من نحن</a>
      <a href="/gomla/admin/manage-privacy.html">إدارة سياسة الخصوصية</a>
      <a href="/gomla/admin/manage-faq-visitor.html">إدارة أسئلة الزوار</a>
      <a href="/gomla/admin/manage-faq-customer.html">إدارة أسئلة العملاء</a>
      <a href="/gomla/admin/manage-faq-trader.html">إدارة أسئلة التجار</a>
      <a href="/gomla/admin/manage-download-app.html">إدارة تنزيل التطبيق</a>
      <a href="/gomla/admin/orders.html">الطلبات الواردة</a>
    `;
  } else if (role === 'admin') {
    links = `
      <a href="/gomla/admin/profile.html">بياناتي</a>
      <a href="/gomla/admin/orders.html">الطلبات الواردة</a>
    `;
  } else {
    links = ''; // فارغ للزوار والعملاء
  }
  container.innerHTML = links;
}

/**
 * تحديث حقوق التصميم
 */
function updateFooterCopyright() {
  const isMobile = window.innerWidth < 768;
  const container = document.getElementById('footer-copyright');
  if (!container) return;

  const text = isMobile
    ? 'تم تصميم وتطوير التطبيق بواسطة FAMO'
    : 'تم تصميم وتطوير الموقع بواسطة FAMO';
  container.textContent = text;
}

// ============================================================
// 🧠 السايدبار (تحميل وتحديث)
// ============================================================

/**
 * تحميل السايدبار من ملف components/sidebar.html
 */
function loadSidebar() {
  fetch('/gomla/assets/components/sidebar.html')
    .then(res => res.text())
    .then(html => {
      const placeholder = document.getElementById('sidebar-placeholder');
      if (placeholder) {
        placeholder.innerHTML = html;
        updateSidebar();
        initSidebarToggle();
      }
    })
    .catch(() => {
      // نسخة احتياطية للسايدبار
      const placeholder = document.getElementById('sidebar-placeholder');
      if (placeholder) {
        placeholder.innerHTML = `
          <div class="smart-sidebar" id="smartSidebar">
            <div class="sidebar-header"><span>القائمة</span></div>
            <nav class="sidebar-nav"><a href="/gomla/">الرئيسية</a></nav>
          </div>
          <button class="sidebar-toggle" id="sidebarToggle">☰</button>
          <div class="sidebar-overlay" id="sidebarOverlay"></div>
        `;
      }
    });
}

/**
 * تحديث السايدبار حسب المستخدم
 */
function updateSidebar() {
  const user = getCurrentUser();
  const nav = document.getElementById('sidebarNav');
  if (!nav) return;

  let links = [];

  if (user && user.type === 'admin') {
    const isSuper = user.data.role === 'super';
    links = getAdminSidebarLinks(isSuper);
  } else if (user && user.type === 'customer') {
    links = getCustomerSidebarLinks(user.data.type);
  } else {
    links = getGuestSidebarLinks();
  }

  let html = '';
  links.forEach(link => {
    const isActive = window.location.pathname === link.url;
    html += `
      <a href="${link.url}" class="sidebar-link ${isActive ? 'active' : ''}" ${link.onclick ? `onclick="${link.onclick}"` : ''}>
        <i class="fas ${link.icon}"></i>
        <span>${link.text}</span>
      </a>
    `;
  });

  nav.innerHTML = html;
}

/**
 * روابط السايدبار للمديرين
 */
function getAdminSidebarLinks(isSuper) {
  let links = [
    { icon: 'fa-home', text: 'الرئيسية', url: '/gomla/admin/home.html' },
    { icon: 'fa-tachometer-alt', text: 'لوحة التحكم', url: '/gomla/admin/dashboard.html' },
    { icon: 'fa-boxes', text: 'المنتجات', url: '/gomla/admin/products.html' },
    { icon: 'fa-users', text: 'العملاء', url: '/gomla/admin/customers.html' },
    { icon: 'fa-file-invoice', text: 'الفواتير', url: '/gomla/admin/invoices.html' },
    { icon: 'fa-shopping-cart', text: 'الطلبات', url: '/gomla/admin/orders.html' },
    { icon: 'fa-percent', text: 'العروض', url: '/gomla/admin/offers.html' },
  ];

  if (isSuper) {
    links = links.concat([
      { icon: 'fa-key', text: 'توليد الأكواد', url: '/gomla/admin/generate-codes.html' },
      { icon: 'fa-user-cog', text: 'إدارة الصلاحيات', url: '/gomla/admin/roles.html' },
      { icon: 'fa-cog', text: 'الإعدادات', url: '/gomla/admin/settings.html' },
      { icon: 'fa-paint-brush', text: 'إدارة السايدبار', url: '/gomla/admin/sidebar.html' },
      { icon: 'fa-ad', text: 'الإعلانات', url: '/gomla/admin/ads.html' },
      { icon: 'fa-newspaper', text: 'الأخبار', url: '/gomla/admin/news.html' },
      { icon: 'fa-quote-right', text: 'المقولات', url: '/gomla/admin/quotes.html' },
      { icon: 'fa-download', text: 'نسخ احتياطي', url: '/gomla/admin/backup.html' },
    ]);
  }

  links.push({ icon: 'fa-sign-out-alt', text: 'تسجيل خروج', url: '#', onclick: 'logoutUser()' });
  return links;
}

/**
 * روابط السايدبار للعملاء
 */
function getCustomerSidebarLinks(type) {
  const links = [
    { icon: 'fa-home', text: 'الرئيسية', url: '/gomla/customer/home.html' },
    { icon: 'fa-user', text: 'بياناتي', url: '/gomla/customer/profile.html' },
    { icon: 'fa-box', text: 'طلباتي', url: '/gomla/customer/orders.html' },
    { icon: 'fa-truck', text: 'تتبع الطلبات', url: '/gomla/tracking.html' },
    { icon: 'fa-file-invoice', text: 'فواتيري', url: '/gomla/customer/invoices.html' },
    { icon: 'fa-heart', text: 'المفضلة', url: '/gomla/customer/wishlist.html' },
    { icon: 'fa-percent', text: 'العروض', url: '/gomla/offers.html' },
    { icon: 'fa-headset', text: 'الشكاوى', url: '/gomla/customer/support.html' },
  ];

  if (type === 'wholesale') {
    links.push({ icon: 'fa-coins', text: 'الذمة المالية', url: '/gomla/customer/balance.html' });
    links.push({ icon: 'fa-store', text: 'متجر الجملة', url: '/gomla/store-wholesale.html' });
  } else {
    links.push({ icon: 'fa-store', text: 'متجر القطاعي', url: '/gomla/store-retail.html' });
  }

  links.push({ icon: 'fa-sign-out-alt', text: 'تسجيل خروج', url: '#', onclick: 'logoutUser()' });
  return links;
}

/**
 * روابط السايدبار للزوار
 */
function getGuestSidebarLinks() {
  return [
    { icon: 'fa-home', text: 'الرئيسية', url: '/gomla/' },
    { icon: 'fa-store', text: 'المتجر القطاعي', url: '/gomla/store-retail.html' },
    { icon: 'fa-user-plus', text: 'طريقة التسجيل', url: '/gomla/how-to-register.html' },
    { icon: 'fa-info-circle', text: 'تعرف علينا', url: '/gomla/about.html' },
    { icon: 'fa-question-circle', text: 'أسئلة شائعة', url: '/gomla/faq-visitor.html' },
    { icon: 'fa-key', text: 'دخول العملاء', url: '/gomla/customer-login.html' },
    { icon: 'fa-user-shield', text: 'دخول المديرين', url: '/gomla/admin/login.html' },
  ];
}

/**
 * تفعيل زر المنيو للسايدبار
 */
function initSidebarToggle() {
  const toggleBtn = document.getElementById('sidebarToggle');
  const overlay = document.getElementById('sidebarOverlay');
  const sidebar = document.getElementById('smartSidebar');
  const closeBtn = document.getElementById('sidebarClose');

  if (toggleBtn && sidebar && overlay) {
    toggleBtn.onclick = function() {
      sidebar.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
  }

  if (closeBtn && sidebar && overlay) {
    closeBtn.onclick = function() {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };
  }

  if (overlay) {
    overlay.onclick = function() {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };
  }
}

// ============================================================
// 🍞 Toast Notifications
// ============================================================

/**
 * عرض رسالة منبثقة (Toast)
 * @param {string} message - نص الرسالة
 * @param {string} type - success | error | warning | info
 * @param {number} duration - مدة الظهور بالمللي ثانية
 */
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) {
    const div = document.createElement('div');
    div.id = 'toast-container';
    div.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:8px;max-width:90%;';
    document.body.appendChild(div);
  }

  const colors = {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.getElementById('toast-container').appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================================
// 🔔 نظام الإشعارات
// ============================================================

/**
 * جلب إشعارات المستخدم
 * @param {string} userId - معرف المستخدم
 * @param {string} userType - نوع المستخدم (admin | customer)
 */
function loadNotifications(userId, userType) {
  const collection = userType === 'admin' ? 'admin_notifications' : 'customer_notifications';
  return db.collection(collection)
    .where('userId', '==', userId)
    .where('read', '==', false)
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get()
    .then(snapshot => {
      const notifications = [];
      snapshot.forEach(doc => notifications.push({ id: doc.id, ...doc.data() }));
      return notifications;
    });
}

/**
 * تحديث عدد الإشعارات غير المقروءة
 */
function updateNotificationBadge() {
  const user = getCurrentUser();
  if (!user) return;

  const userId = user.data.id || user.data.uid;
  const userType = user.type;

  loadNotifications(userId, userType)
    .then(notifications => {
      const badge = document.getElementById('notification-badge');
      if (badge) {
        badge.textContent = notifications.length;
        badge.style.display = notifications.length > 0 ? 'inline' : 'none';
      }
    })
    .catch(err => console.error('Error loading notifications:', err));
}

/**
 * عرض قائمة الإشعارات
 */
function showNotificationsDropdown() {
  const user = getCurrentUser();
  if (!user) return;

  const userId = user.data.id || user.data.uid;
  const userType = user.type;

  loadNotifications(userId, userType)
    .then(notifications => {
      const dropdown = document.getElementById('notifications-dropdown');
      if (!dropdown) return;

      if (notifications.length === 0) {
        dropdown.innerHTML = '<div class="notification-empty">لا توجد إشعارات</div>';
        return;
      }

      let html = '';
      notifications.forEach(notif => {
        html += `
          <div class="notification-item" onclick="markNotificationRead('${notif.id}')">
            <div class="notification-title">${notif.title}</div>
            <div class="notification-body">${notif.body}</div>
            <div class="notification-time">${formatDate(notif.createdAt)}</div>
          </div>
        `;
      });
      dropdown.innerHTML = html;
    })
    .catch(err => console.error('Error loading notifications:', err));
}

/**
 * تعيين إشعار كمقروء
 */
function markNotificationRead(notificationId) {
  const user = getCurrentUser();
  if (!user) return;

  const collection = user.type === 'admin' ? 'admin_notifications' : 'customer_notifications';
  db.collection(collection).doc(notificationId).update({ read: true })
    .then(() => {
      updateNotificationBadge();
      showNotificationsDropdown();
    })
    .catch(err => console.error('Error marking notification read:', err));
}

// ============================================================
// ❤️ نظام المفضلة (Wishlist)
// ============================================================

/**
 * إضافة منتج للمفضلة
 */
function addToWishlist(productId) {
  const user = getCurrentUser();
  if (!user) {
    showToast('⚠️ يرجى تسجيل الدخول أولاً', 'warning');
    return;
  }

  const userId = user.data.id || user.data.uid;
  db.collection('wishlist').add({
    userId: userId,
    productId: productId,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    showToast('✅ تم إضافة المنتج للمفضلة', 'success');
  })
  .catch(err => {
    console.error('Error adding to wishlist:', err);
    showToast('❌ حدث خطأ', 'error');
  });
}

/**
 * إزالة منتج من المفضلة
 */
function removeFromWishlist(productId) {
  const user = getCurrentUser();
  if (!user) return;

  const userId = user.data.id || user.data.uid;
  db.collection('wishlist')
    .where('userId', '==', userId)
    .where('productId', '==', productId)
    .get()
    .then(snapshot => {
      const batch = db.batch();
      snapshot.forEach(doc => batch.delete(doc.ref));
      return batch.commit();
    })
    .then(() => {
      showToast('✅ تم إزالة المنتج من المفضلة', 'success');
    })
    .catch(err => {
      console.error('Error removing from wishlist:', err);
      showToast('❌ حدث خطأ', 'error');
    });
}

/**
 * التحقق مما إذا كان المنتج في المفضلة
 */
function isInWishlist(productId) {
  const user = getCurrentUser();
  if (!user) return Promise.resolve(false);

  const userId = user.data.id || user.data.uid;
  return db.collection('wishlist')
    .where('userId', '==', userId)
    .where('productId', '==', productId)
    .get()
    .then(snapshot => !snapshot.empty);
}

// ============================================================
// 🛒 نظام السلة (Cart)
// ============================================================

/**
 * إضافة منتج للسلة
 */
function addToCart(productId, quantity = 1) {
  const user = getCurrentUser();
  if (!user) {
    showToast('⚠️ يرجى تسجيل الدخول أولاً', 'warning');
    return;
  }

  const userId = user.data.id || user.data.uid;
  // البحث عن المنتج في السلة
  db.collection('cart')
    .where('userId', '==', userId)
    .where('productId', '==', productId)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        // إضافة جديد
        return db.collection('cart').add({
          userId: userId,
          productId: productId,
          quantity: quantity,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      } else {
        // تحديث الكمية
        const doc = snapshot.docs[0];
        const currentQty = doc.data().quantity || 0;
        return db.collection('cart').doc(doc.id).update({
          quantity: currentQty + quantity
        });
      }
    })
    .then(() => {
      showToast('✅ تم إضافة المنتج للسلة', 'success');
      updateCartBadge();
    })
    .catch(err => {
      console.error('Error adding to cart:', err);
      showToast('❌ حدث خطأ', 'error');
    });
}

/**
 * جلب عناصر السلة
 */
function getCartItems() {
  const user = getCurrentUser();
  if (!user) return Promise.resolve([]);

  const userId = user.data.id || user.data.uid;
  return db.collection('cart')
    .where('userId', '==', userId)
    .get()
    .then(snapshot => {
      const items = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      return items;
    });
}

/**
 * تحديث عدد عناصر السلة في الشارة
 */
function updateCartBadge() {
  getCartItems()
    .then(items => {
      const total = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      const badge = document.getElementById('cart-badge');
      if (badge) {
        badge.textContent = total;
        badge.style.display = total > 0 ? 'inline' : 'none';
      }
    })
    .catch(err => console.error('Error updating cart badge:', err));
}

/**
 * حذف عنصر من السلة
 */
function removeFromCart(cartItemId) {
  return db.collection('cart').doc(cartItemId).delete()
    .then(() => {
      updateCartBadge();
    })
    .catch(err => {
      console.error('Error removing from cart:', err);
      showToast('❌ حدث خطأ', 'error');
    });
}

// ============================================================
// 💾 نظام النسخ الاحتياطي (للسوبر أدمن فقط)
// ============================================================

/**
 * تصدير جميع البيانات كـ JSON
 */
function exportBackup() {
  if (!protectSuperAdminPage()) return;

  showToast('⏳ جاري تجهيز النسخة الاحتياطية...', 'info');

  const collections = ['products', 'customers', 'invoices', 'orders', 'offers', 'ads', 'news', 'quotes'];
  const backupData = {};

  const promises = collections.map(col => {
    return db.collection(col).get()
      .then(snapshot => {
        backupData[col] = [];
        snapshot.forEach(doc => backupData[col].push({ id: doc.id, ...doc.data() }));
      })
      .catch(err => {
        console.warn(`Error backing up ${col}:`, err);
        backupData[col] = [];
      });
  });

  Promise.all(promises)
    .then(() => {
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('✅ تم تصدير النسخة الاحتياطية بنجاح', 'success');
    })
    .catch(err => {
      console.error('Error exporting backup:', err);
      showToast('❌ حدث خطأ في تصدير النسخة الاحتياطية', 'error');
    });
}

// ============================================================
// 📊 نظام الباركود (للسوبر أدمن)
// ============================================================

/**
 * توليد باركود لمنتج أو فاتورة
 */
function generateBarcode(data, type = 'product') {
  // استخدام مكتبة JsBarcode أو API خارجي
  const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(data)}&code=Code128&dpi=96`;
  return barcodeUrl;
}

/**
 * عرض باركود في الصفحة
 */
function displayBarcode(elementId, data) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const barcodeUrl = generateBarcode(data);
  element.innerHTML = `<img src="${barcodeUrl}" alt="باركود" style="max-width:200px;">`;
}

// ============================================================
//# 📦 نظام الشحن (يتم تفعيله عند إنشاء المتاجر)
// ============================================================

/**
 * حساب تكلفة الشحن
 */
function calculateShipping(weight, city) {
  // قاعدة بيانات مؤقتة للشحن
  const shippingRates = {
    'المحلة': { base: 10, perKg: 2 },
    'المنصورة': { base: 15, perKg: 3 },
    'طنطا': { base: 12, perKg: 2.5 }
  };

  const rate = shippingRates[city] || { base: 20, perKg: 5 };
  return rate.base + (weight * rate.perKg);
}

// ============================================================
// 📅 دوال مساعدة
// ============================================================

/**
 * تنسيق التاريخ
 */
function formatDate(timestamp) {
  if (!timestamp) return '---';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// ============================================================
// 🚀 تشغيل عند تحميل الصفحة
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  // تحميل المكونات الثابتة
  loadHeader();
  loadFooter();
  loadSidebar();

  // تحديث شارات الإشعارات والسلة
  updateNotificationBadge();
  updateCartBadge();

  // مستمع لتغيير حجم الشاشة (لتحديث حقوق التصميم)
  window.addEventListener('resize', function() {
    updateFooterCopyright();
  });

  console.log('✅ main.js loaded successfully!');
});

// تصدير الدوال للاستخدام العالمي
window.getCurrentUser = getCurrentUser;
window.getUserRole = getUserRole;
window.protectPage = protectPage;
window.protectSuperAdminPage = protectSuperAdminPage;
window.logoutUser = logoutUser;
window.showToast = showToast;
window.loadNotifications = loadNotifications;
window.updateNotificationBadge = updateNotificationBadge;
window.showNotificationsDropdown = showNotificationsDropdown;
window.markNotificationRead = markNotificationRead;
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.isInWishlist = isInWishlist;
window.addToCart = addToCart;
window.getCartItems = getCartItems;
window.updateCartBadge = updateCartBadge;
window.removeFromCart = removeFromCart;
window.exportBackup = exportBackup;
window.generateBarcode = generateBarcode;
window.displayBarcode = displayBarcode;
window.calculateShipping = calculateShipping;
window.formatDate = formatDate;
