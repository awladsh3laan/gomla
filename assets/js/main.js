QQ// ============================================
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
  const colors = { success: '#22c55e', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
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

// ===== تنسيق التاريخ =====
function formatDate(date, format = 'short') {
  if (!date) return '---';
  const d = date.toDate ? date.toDate() : new Date(date);
  if (format === 'short') return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
  return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ===== توليد كود عشوائي =====
function generateCode(prefix = '', length = 4) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix;
  for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
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

// ===== تحميل الجمل التحفيزية الإدارية =====
function loadAdminQuotes() {
  const container = document.getElementById('adminMotivationalText');
  if (!container) return;
  db.collection('quotes')
    .where('type', '==', 'admin')
    .where('active', '==', true)
    .orderBy('order')
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        container.innerHTML = '<i class="fas fa-quote-right"></i> كن قدوة في الإخلاص والتميز';
        return;
      }
      const quotes = [];
      snapshot.forEach(doc => quotes.push(doc.data().text));
      let index = 0;
      container.innerHTML = `<i class="fas fa-quote-right"></i> "${quotes[0]}"`;
      setInterval(() => {
        index = (index + 1) % quotes.length;
        container.style.opacity = '0';
        setTimeout(() => {
          container.innerHTML = `<i class="fas fa-quote-right"></i> "${quotes[index]}"`;
          container.style.opacity = '1';
        }, 300);
      }, 5000);
    })
    .catch(() => {
      container.innerHTML = '<i class="fas fa-quote-right"></i> كن قدوة في الإخلاص والتميز';
    });
}

// ===== تحميل الأخبار الإدارية =====
function loadAdminNews() {
  const container = document.getElementById('adminNewsList');
  if (!container) return;
  db.collection('news')
    .where('type', '==', 'admin')
    .where('active', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(5)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        container.innerHTML = '<div class="news-item"><span class="news-dot"></span><span class="news-text">لا توجد أخبار داخلية</span></div>';
        return;
      }
      let html = '';
      snapshot.forEach(doc => {
        html += `<div class="news-item"><span class="news-dot"></span><span class="news-text">${doc.data().title}</span></div>`;
      });
      container.innerHTML = html;
    })
    .catch(() => {
      container.innerHTML = '<div class="news-item"><span class="news-dot"></span><span class="news-text">جاري التحميل...</span></div>';
    });
}

// ===== السايدبار =====
function updateSidebarContent() {
  const adminData = localStorage.getItem('admin');
  const customerData = localStorage.getItem('customer');
  const isAdmin = adminData !== null;
  const isCustomer = customerData !== null;
  const isSuperAdmin = isAdmin && JSON.parse(adminData).role === 'super';

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
    html += `<a href="${link.url}" class="sidebar-link ${isActive ? 'active' : ''}"><i class="fas ${link.icon}"></i><span>${link.text}</span></a>`;
  });
  nav.innerHTML = html;
}

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
    // ===== تحميل بيانات المستخدم =====
    function loadAdminProfile() {
      const adminData = JSON.parse(localStorage.getItem('admin'));
      if (!adminData) {
        window.location.href = '/gomla/admin/login.html';
        return;
      }

      const isSuperAdmin = adminData.role === 'super';

      // عرض الاسم
      document.getElementById('adminName').textContent = adminData.name || 'مدير';
      document.getElementById('profileName').textContent = adminData.name || 'مدير النظام';

      // عرض الرتبة
      const roleText = isSuperAdmin ? 'سوبر أدمن' : 'مشرف';
      const roleIcon = isSuperAdmin ? '👑' : '🛡️';
      document.getElementById('profileRole').textContent = roleText;
      document.getElementById('profileBadge').textContent = `${roleIcon} ${roleText}`;

      // عرض الصورة
      if (adminData.avatar) {
        document.getElementById('profileAvatar').src = adminData.avatar;
      }

      // تحميل الكروت حسب الصلاحية
      loadHomeCards(isSuperAdmin);
    }

    // ===== تحميل كروت الصفحة الرئيسية =====
    function loadHomeCards(isSuperAdmin) {
      const container = document.getElementById('cardsGrid');
      if (!container) return;

      // تعريف الكروت
      let cards = [];

      // كروت مشتركة للجميع
      const commonCards = [
        { icon: 'fa-store', title: 'متجر الجملة', url: '/gomla/store-gomla.html', desc: 'زيارة المتجر', badge: 'زيارة' },
        { icon: 'fa-tachometer-alt', title: 'لوحة التحكم', url: '/gomla/admin/dashboard.html', desc: 'إدارة النظام', badge: 'دخول' },
        { icon: 'fa-newspaper', title: 'آخر الأخبار', url: '/gomla/admin/news-management.html', desc: 'إدارة الأخبار', badge: isSuperAdmin ? 'تحكم' : 'عرض' },
        { icon: 'fa-chart-line', title: 'عرض الأسعار', url: '/gomla/admin/reports.html', desc: 'مراقبة الأسعار', badge: isSuperAdmin ? 'تحكم' : 'عرض' },
        { icon: 'fa-tags', title: 'العروض', url: '/gomla/admin/products.html', desc: 'إدارة العروض', badge: 'إدارة' },
        { icon: 'fa-lightbulb', title: 'النصائح والمعلومات', url: '/gomla/admin/tips-management.html', desc: 'إدارة النصائح', badge: isSuperAdmin ? 'تحكم' : 'عرض' },
      ];

      // كروت إضافية للسوبر أدمن
      const superCards = [
        { icon: 'fa-users-cog', title: 'إدارة الصلاحيات', url: '/gomla/admin/roles-management.html', desc: 'تعديل صلاحيات المشرفين', badge: 'تحكم' },
        { icon: 'fa-key', title: 'توليد الأكواد', url: '/gomla/admin/generate-codes.html', desc: 'توليد أكواد العملاء', badge: 'سوبر أدمن' },
        { icon: 'fa-paint-brush', title: 'إدارة السايدبار', url: '/gomla/admin/sidebar-content.html', desc: 'تعديل محتوى السايدبار', badge: 'سوبر أدمن' },
        { icon: 'fa-ad', title: 'إدارة الإعلانات', url: '/gomla/admin/ads-management.html', desc: 'إضافة بانرات إعلانية', badge: 'سوبر أدمن' },
        { icon: 'fa-quote-right', title: 'إدارة المقولات', url: '/gomla/admin/quotes-management.html', desc: 'إضافة مقولات وحكم', badge: 'سوبر أدمن' },
      ];

      // تجميع الكروت
      if (isSuperAdmin) {
        cards = [...commonCards, ...superCards];
      } else {
        cards = [...commonCards];
      }

      // عرض الكروت
      let html = '';
      cards.forEach((card) => {
        html += `
          <a href="${card.url}" class="card-item">
            <span class="card-icon"><i class="fas ${card.icon}"></i></span>
            <span class="card-title">${card.title}</span>
            <span class="card-sub">${card.desc}</span>
            <span class="card-badge">${card.badge}</span>
          </a>
        `;
      });

      container.innerHTML = html;
    }

    // ============================================
    // 🚀 تشغيل الصفحة
    // ============================================

    document.addEventListener('DOMContentLoaded', function() {
      // التحقق من الصلاحية
      const adminData = localStorage.getItem('admin');
      if (!adminData) {
        window.location.href = '/gomla/admin/login.html';
        return;
      }

      loadAdminProfile();
    });

// ===== تشغيل =====
document.addEventListener('DOMContentLoaded', function() {
  initSidebar();
  loadAdminQuotes();
  loadAdminNews();
});