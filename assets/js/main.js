// ============================================
// 🧠 الوظائف الموحدة - أولاد شعلان جملة
// ============================================

// ===== استخدام آمن لـ db =====
const db = window.db || firebase.firestore();

// ============================================
// 🍞 Toast Notifications
// ============================================

function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const colors = {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================
// 👤 إدارة المستخدمين والصلاحيات
// ============================================

function getCurrentUser() {
  const adminData = localStorage.getItem('admin');
  const customerData = localStorage.getItem('customer');
  if (adminData) return { type: 'admin', data: JSON.parse(adminData) };
  if (customerData) return { type: 'customer', data: JSON.parse(customerData) };
  return null;
}

function getUserRole() {
  const user = getCurrentUser();
  if (!user) return 'guest';
  if (user.type === 'admin') return user.data.role || 'admin';
  return 'customer';
}

function protectPage() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/gomla/customer-login.html';
    return false;
  }
  return true;
}

function protectSuperAdminPage() {
  const user = getCurrentUser();
  if (!user || user.type !== 'admin' || user.data.role !== 'super') {
    window.location.href = '/gomla/admin/login.html';
    return false;
  }
  return true;
}

function logoutUser() {
  localStorage.removeItem('admin');
  localStorage.removeItem('customer');
  window.location.href = '/gomla/';
}

// ============================================
// 🧠 تحميل الهيدر والفوتر والسايدبار
// ============================================

function loadHeader() {
  fetch('/gomla/assets/components/header.html')
    .then(res => res.text())
    .then(html => {
      const placeholder = document.getElementById('header-placeholder');
      if (placeholder) placeholder.innerHTML = html;
      updateHeader();
    })
    .catch(() => {
      const placeholder = document.getElementById('header-placeholder');
      if (placeholder) {
        placeholder.innerHTML = `
          <header class="smart-header">
            <div class="container">
              <a href="/gomla/" class="logo">
                <span>أولاد شعلان <small>جملة</small></span>
              </a>
            </div>
          </header>
        `;
      }
    });
}

function loadFooter() {
  fetch('/gomla/assets/components/footer.html')
    .then(res => res.text())
    .then(html => {
      const placeholder = document.getElementById('footer-placeholder');
      if (placeholder) placeholder.innerHTML = html;
    })
    .catch(() => {
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

function loadSidebar() {
  fetch('/gomla/assets/components/sidebar.html')
    .then(res => res.text())
    .then(html => {
      const placeholder = document.getElementById('sidebar-placeholder');
      if (placeholder) placeholder.innerHTML = html;
      updateSidebar();
    })
    .catch(() => {
      const placeholder = document.getElementById('sidebar-placeholder');
      if (placeholder) {
        placeholder.innerHTML = `
          <div class="smart-sidebar" id="smartSidebar">
            <div class="sidebar-header">
              <div class="sidebar-user">
                <span>مرحباً بك</span>
              </div>
            </div>
            <nav class="sidebar-nav">
              <a href="/gomla/">الرئيسية</a>
            </nav>
          </div>
        `;
      }
    });
}

// ============================================
// 🔄 تحديث الهيدر حسب المستخدم
// ============================================

function updateHeader() {
  const user = getCurrentUser();
  const guestMode = document.getElementById('guest-mode');
  const customerMode = document.getElementById('customer-mode');
  const adminMode = document.getElementById('admin-mode');
  const adminName = document.getElementById('adminName');
  const customerName = document.getElementById('customerName');

  if (!guestMode || !customerMode || !adminMode) return;

  if (user && user.type === 'admin') {
    guestMode.style.display = 'none';
    customerMode.style.display = 'none';
    adminMode.style.display = 'flex';
    if (adminName) adminName.textContent = user.data.name || 'مدير';
  } else if (user && user.type === 'customer') {
    guestMode.style.display = 'none';
    customerMode.style.display = 'flex';
    adminMode.style.display = 'none';
    if (customerName) customerName.textContent = user.data.name || 'عميل';
  } else {
    guestMode.style.display = 'flex';
    customerMode.style.display = 'none';
    adminMode.style.display = 'none';
  }
}

// ============================================
// 🧠 تحديث السايدبار حسب المستخدم
// ============================================

function updateSidebar() {
  const user = getCurrentUser();
  const nav = document.getElementById('sidebarNav');
  if (!nav) return;

  let links = [];

  if (user && user.type === 'admin') {
    const isSuper = user.data.role === 'super';
    links = [
      { icon: 'fa-home', text: 'الرئيسية', url: '/gomla/admin/home.html' },
      { icon: 'fa-tachometer-alt', text: 'لوحة التحكم', url: '/gomla/admin/dashboard.html' },
      { icon: 'fa-boxes', text: 'المنتجات', url: '/gomla/admin/products.html' },
      { icon: 'fa-users', text: 'العملاء', url: '/gomla/admin/customers.html' },
      { icon: 'fa-file-invoice', text: 'الفواتير', url: '/gomla/admin/invoices.html' },
    ];
    if (isSuper) {
      links.push(
        { icon: 'fa-key', text: 'توليد الأكواد', url: '/gomla/admin/generate-codes.html' },
        { icon: 'fa-cog', text: 'الإعدادات', url: '/gomla/admin/settings.html' }
      );
    }
  } else if (user && user.type === 'customer') {
    links = [
      { icon: 'fa-home', text: 'الرئيسية', url: '/gomla/customer-home.html' },
      { icon: 'fa-user', text: 'بياناتي', url: '/gomla/customer-profile.html' },
      { icon: 'fa-box', text: 'تتبع الطلبات', url: '/gomla/tracking.html' },
      { icon: 'fa-file-invoice', text: 'فواتيري', url: '/gomla/customer-invoices.html' },
      { icon: 'fa-sign-out-alt', text: 'تسجيل خروج', url: '#', onclick: 'logoutUser()' }
    ];
  } else {
    links = [
      { icon: 'fa-home', text: 'الرئيسية', url: '/gomla/' },
      { icon: 'fa-store', text: 'المتجر القطاعي', url: '/gomla/' },
      { icon: 'fa-key', text: 'دخول العملاء', url: '/gomla/customer-login.html' },
      { icon: 'fa-user-shield', text: 'دخول المديرين', url: '/gomla/admin/login.html' }
    ];
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

// ============================================
// 🚀 تشغيل عند تحميل الصفحة
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  loadHeader();
  loadFooter();
  loadSidebar();

  // زر المنيو
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

  // Toast
  window.showToast = showToast;
  window.logoutUser = logoutUser;
  window.protectPage = protectPage;
  window.protectSuperAdminPage = protectSuperAdminPage;
});