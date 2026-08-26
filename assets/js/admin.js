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

  // عرض اسم المدير الحقيقي
  document.getElementById('adminName').textContent = adminData.name || 'مدير';

  // عرض الرتبة الحقيقية
  document.getElementById('adminRoleBadge').textContent = isSuperAdmin ? '👑 سوبر أدمن' : '🛡️ مشرف';

  // تحميل العبارات التحفيزية من Firebase
  loadAdminQuotes();

  // تحميل آخر الأخبار من Firebase
  loadAdminNews();

  // تحميل الكروت حسب الصلاحية
  loadDashboardCards(isSuperAdmin);
}

// ===== تحميل العبارات التحفيزية (نوع admin) =====
function loadAdminQuotes() {
  const container = document.getElementById('adminMotivationalText');
  if (!container) return;

  db.collection('quotes')
    .where('type', '==', 'admin')
    .where('active', '==', true)
    .orderBy('order')
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        container.innerHTML = `
          <i class="fas fa-quote-right"></i>
          "كن قدوة في الإخلاص والتميز، فالقائد الحقيقي هو من يخدم"
        `;
        return;
      }

      const quotes = [];
      snapshot.forEach((doc) => {
        quotes.push(doc.data().text);
      });

      let index = 0;
      container.innerHTML = `
        <i class="fas fa-quote-right"></i>
        "${quotes[0]}"
      `;

      setInterval(() => {
        index = (index + 1) % quotes.length;
        const textEl = container;
        textEl.style.opacity = '0';
        setTimeout(() => {
          textEl.innerHTML = `
            <i class="fas fa-quote-right"></i>
            "${quotes[index]}"
          `;
          textEl.style.opacity = '1';
        }, 300);
      }, 5000);
    })
    .catch(() => {
      container.innerHTML = `
        <i class="fas fa-quote-right"></i>
        "كن قدوة في الإخلاص والتميز، فالقائد الحقيقي هو من يخدم"
      `;
    });
}

// ===== تحميل آخر الأخبار (نوع admin) =====
function loadAdminNews() {
  const container = document.getElementById('adminNewsList');
  if (!container) return;

  db.collection('news')
    .where('type', '==', 'admin')
    .where('active', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(5)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        container.innerHTML = `
          <div class="news-item">
            <span class="news-dot"></span>
            <span class="news-text">لا توجد أخبار داخلية حالياً</span>
          </div>
        `;
        return;
      }

      let html = '';
      snapshot.forEach((doc) => {
        const news = doc.data();
        html += `
          <div class="news-item">
            <span class="news-dot"></span>
            <span class="news-text">${news.title}</span>
          </div>
        `;
      });

      container.innerHTML = html;
    })
    .catch(() => {
      container.innerHTML = `
        <div class="news-item">
          <span class="news-dot"></span>
          <span class="news-text">جاري تحميل الأخبار...</span>
        </div>
      `;
    });
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

  // كروت إضافية للجميع
  const extraCards = [
    { icon: 'fa-history', title: 'سجل النشاط', url: '/gomla/admin/activity.html', desc: 'عرض الكل' },
  ];

  // تجميع الكروت حسب الصلاحية
  if (isSuperAdmin) {
    cards = [...commonCards, ...superCards, ...extraCards];
  } else {
    cards = [...commonCards, ...moderatorCards, ...extraCards];
  }

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