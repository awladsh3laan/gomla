// ============================================
// 📊 وظائف لوحة التحكم - أولاد شعلان جملة
// ============================================

// ===== التحقق من الصلاحية =====
function checkAdminAuth() {
  const adminData = localStorage.getItem('admin');
  if (!adminData) {
    window.location.href = '/gomla/admin/login.html';
    return false;
  }
  return true;
}

// ===== تحميل لوحة التحكم =====
function loadDashboard() {
  const adminData = JSON.parse(localStorage.getItem('admin'));
  const isSuperAdmin = adminData.role === 'super';

  // عرض اسم المدير
  document.getElementById('adminNameDisplay').innerHTML = `
    <i class="fas fa-user-cog"></i> مرحباً ${adminData.name || 'مدير'}
  `;

  // عرض الصلاحية
  document.getElementById('adminRoleBadge').textContent = isSuperAdmin ? '👑 سوبر أدمن' : '🛡️ مشرف';

  // تحميل الكروت
  loadDashboardCards(isSuperAdmin);
}

// ===== تحميل كروت لوحة التحكم =====
function loadDashboardCards(isSuperAdmin) {
  const container = document.getElementById('dashboardCardsContainer');
  if (!container) return;

  // تعريف الكروت حسب الصلاحية
  let cards = [];

  // كروت مشتركة للجميع
  const commonCards = [
    { icon: 'fa-boxes', title: 'المنتجات', url: '/gomla/admin/products.html', desc: 'إدارة المنتجات' },
    { icon: 'fa-users', title: 'العملاء', url: '/gomla/admin/customers.html', desc: isSuperAdmin ? 'تحكم كامل' : 'عرض فقط' },
    { icon: 'fa-file-invoice', title: 'الفواتير', url: '/gomla/admin/invoices.html', desc: 'إدارة الفواتير والطلبات' },
  ];

  // كروت السوبر أدمن فقط
  const superCards = [
    { icon: 'fa-file-pdf', title: 'استخراج من PDF', url: '/gomla/admin/extract.html', desc: 'سوبر أدمن فقط' },
    { icon: 'fa-chart-pie', title: 'التقارير', url: '/gomla/admin/reports.html', desc: 'تحكم كامل' },
    { icon: 'fa-cog', title: 'الإعدادات', url: '/gomla/admin/settings.html', desc: 'سوبر أدمن فقط' },
    { icon: 'fa-key', title: 'توليد الأكواد', url: '/gomla/admin/generate-codes.html', desc: 'سوبر أدمن فقط' },
    { icon: 'fa-user-cog', title: 'إدارة الصلاحيات', url: '/gomla/admin/roles-management.html', desc: 'سوبر أدمن فقط' },
    { icon: 'fa-paint-brush', title: 'إدارة السايدبار', url: '/gomla/admin/sidebar-content.html', desc: 'سوبر أدمن فقط' },
  ];

  // كروت المشرفين فقط
  const moderatorCards = [
    { icon: 'fa-chart-pie', title: 'التقارير', url: '/gomla/admin/reports.html', desc: 'عرض فقط' },
    { icon: 'fa-user-shield', title: 'المشرفين', url: '/gomla/admin/roles-management.html', desc: 'عرض فقط' },
  ];

  // تجميع الكروت
  if (isSuperAdmin) {
    cards = [...commonCards, ...superCards];
  } else {
    cards = [...commonCards, ...moderatorCards];
  }

  // كروت إضافية للجميع
  cards.push({ icon: 'fa-history', title: 'سجل النشاط', url: '/gomla/admin/activity.html', desc: 'عرض الكل' });

  // عرض الكروت
  let html = '';
  cards.forEach((card) => {
    html += `
      <a href="${card.url}" class="dashboard-card">
        <span class="card-icon"><i class="fas ${card.icon}"></i></span>
        <span class="card-title">${card.title}</span>
        <span class="card-sub">${card.desc}</span>
        <span class="card-badge"><i class="fas fa-arrow-left"></i></span>
      </a>
    `;
  });

  container.innerHTML = html;
}

// ============================================
// 🚀 تشغيل الصفحة
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  if (!checkAdminAuth()) return;
  loadDashboard();
});

// تصدير الدوال
window.logoutAdmin = logoutAdmin;
window.loadDashboard = loadDashboard;