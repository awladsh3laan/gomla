// ============================================
// 🧠 الوظائف الموحدة - أولاد شعلان جملة
// ============================================

// ===== Toast Notifications =====
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
  toast.style.cssText = `
    padding: 12px 24px;
    border-radius: 10px;
    color: white;
    font-weight: 600;
    font-size: 0.95rem;
    background: ${colors[type] || colors.info};
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease;
    direction: rtl;
    font-family: 'Tajawal', sans-serif;
  `;
  toast.textContent = message;
  document.getElementById('toast-container').appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ===== تنسيق التاريخ =====
function formatDate(date, format = 'short') {
  if (!date) return '---';
  const d = date.toDate ? date.toDate() : new Date(date);
  if (format === 'short') {
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ===== توليد كود عشوائي =====
function generateCode(prefix = '', length = 4) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ===== نسخ النص =====
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => showToast('✅ تم النسخ بنجاح', 'success'))
      .catch(() => showToast('❌ فشل النسخ', 'error'));
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    showToast('✅ تم النسخ بنجاح', 'success');
  }
}

// ===== تسجيل الخروج =====
function logoutAdmin() {
  auth.signOut()
    .then(() => {
      localStorage.removeItem('admin');
      localStorage.removeItem('adminId');
      window.location.href = '/gomla/';
    })
    .catch(() => {
      localStorage.removeItem('admin');
      localStorage.removeItem('adminId');
      window.location.href = '/gomla/';
    });
}

function logoutCustomer() {
  localStorage.removeItem('customer');
  localStorage.removeItem('customerCode');
  window.location.href = '/gomla/';
}

// ===== التحقق من صلاحية المدير =====
function checkAdminAuth() {
  const adminData = localStorage.getItem('admin');
  if (!adminData) {
    window.location.href = '/gomla/admin/login.html';
    return false;
  }
  return true;
}

// ===== التحقق من صلاحية العميل =====
function checkCustomerAuth() {
  const customerData = localStorage.getItem('customer');
  if (!customerData) {
    window.location.href = '/gomla/customer-login.html';
    return false;
  }
  return true;
}

// ===== تحميل الهيدر =====
function loadHeader() {
  fetch('/gomla/assets/components/header.html')
    .then(res => res.text())
    .then(html => {
      const placeholder = document.getElementById('header-placeholder');
      if (placeholder) placeholder.innerHTML = html;
    })
    .catch(() => {
      const placeholder = document.getElementById('header-placeholder');
      if (placeholder) {
        placeholder.innerHTML = `
          <header style="background:#1a2a4a;color:white;padding:12px;text-align:center;">
            <h3>أولاد شعلان جملة</h3>
          </header>
        `;
      }
    });
}

// ===== تحميل الفوتر =====
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
          <footer style="background:#0f1a2e;color:white;padding:12px;text-align:center;">
            <p>© 2026 أولاد شعلان جملة</p>
          </footer>
        `;
      }
    });
}

// ===== السايدبار الذكي =====
function updateSidebarContent() {
  const adminData = localStorage.getItem('admin');
  const customerData = localStorage.getItem('customer');
  const isAdmin = adminData !== null;
  const isCustomer = customerData !== null;
  const isSuperAdmin = isAdmin && JSON.parse(adminData).role === 'super';

  // تحديث الصورة والاسم
  const avatar = document.getElementById('sidebarAvatar');
  const username = document.getElementById('sidebarUsername');
  const userRole = document.getElementById('sidebarUserRole');

  if (isAdmin) {
    const admin = JSON.parse(adminData);
    username.textContent = admin.name || 'مشرف';
    userRole.textContent = isSuperAdmin ? '👑 سوبر أدمن' : '🛡️ مشرف';
    if (admin.avatar) avatar.src = admin.avatar;
  } else if (isCustomer) {
    const customer = JSON.parse(customerData);
    username.textContent = customer.name || 'عميل';
    userRole.textContent = `🔑 ${customer.code || 'عميل'}`;
    if (customer.avatar) avatar.src = customer.avatar;
  } else {
    username.textContent = 'زائر عزيز';
    userRole.textContent = 'مرحباً بك';
    avatar.src = '/gomla/assets/images/default-avatar.png';
  }

  // تحديث الروابط
  const nav = document.getElementById('sidebarNav');
  if (!nav) return;

  let links = [];

  if (isAdmin) {
    links.push({ icon: 'fa-home', text: 'الرئيسية', url: '/gomla/admin/home.html' });
    links.push({ icon: 'fa-tachometer-alt', text: 'لوحة التحكم', url: '/gomla/admin/dashboard.html' });
    links.push({ icon: 'fa-boxes', text: 'المنتجات', url: '/gomla/admin/products.html' });
    links.push({ icon: 'fa-users', text: 'العملاء', url: '/gomla/admin/customers.html' });
    links.push({ icon: 'fa-file-invoice', text: 'الفواتير', url: '/gomla/admin/invoices.html' });
    links.push({ icon: 'fa-chart-pie', text: 'التقارير', url: '/gomla/admin/reports.html' });
    links.push({ icon: 'fa-cog', text: 'الإعدادات', url: '/gomla/admin/settings.html' });
    links.push({ icon: 'fa-history', text: 'سجل النشاط', url: '/gomla/admin/activity.html' });
    if (isSuperAdmin) {
      links.push({ icon: 'fa-key', text: 'توليد الأكواد', url: '/gomla/admin/generate-codes.html' });
      links.push({ icon: 'fa-user-cog', text: 'إدارة الصلاحيات', url: '/gomla/admin/roles-management.html' });
      links.push({ icon: 'fa-paint-brush', text: 'إدارة السايدبار', url: '/gomla/admin/sidebar-content.html' });
    }
  } else if (isCustomer) {
    links.push({ icon: 'fa-home', text: 'الرئيسية', url: '/gomla/customer-home.html' });
    links.push({ icon: 'fa-user', text: 'صفحتي الشخصية', url: '/gomla/customer-dashboard.html' });
    links.push({ icon: 'fa-file-invoice', text: 'فواتيري', url: '/gomla/customer-invoices.html' });
    links.push({ icon: 'fa-box', text: 'تتبع طلباتي', url: '/gomla/tracking.html' });
  } else {
    links.push({ icon: 'fa-home', text: 'الرئيسية', url: '/gomla/' });
    links.push({ icon: 'fa-key', text: 'دخول العملاء', url: '/gomla/customer-login.html' });
    links.push({ icon: 'fa-user-shield', text: 'دخول المديرين', url: '/gomla/admin/login.html' });
  }

  let html = '';
  links.forEach(link => {
    const isActive = window.location.pathname === link.url;
    html += `
      <a href="${link.url}" class="sidebar-link ${isActive ? 'active' : ''}">
        <i class="fas ${link.icon}"></i>
        <span>${link.text}</span>
      </a>
    `;
  });

  nav.innerHTML = html;
}

// ===== تشغيل السايدبار =====
function initSidebar() {
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

  updateSidebarContent();
}

// ===== تشغيل عند تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
  loadHeader();
  loadFooter();
  initSidebar();
});

// تصدير الدوال
window.showToast = showToast;
window.formatDate = formatDate;
window.generateCode = generateCode;
window.copyToClipboard = copyToClipboard;
window.logoutAdmin = logoutAdmin;
window.logoutCustomer = logoutCustomer;
window.checkAdminAuth = checkAdminAuth;
window.checkCustomerAuth = checkCustomerAuth;
window.loadHeader = loadHeader;
window.loadFooter = loadFooter;
window.updateSidebarContent = updateSidebarContent;
window.initSidebar = initSidebar;