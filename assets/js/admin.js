// ============================================
// 📊 وظائف لوحة التحكم - أولاد شعلان جملة
// ============================================

// ===== التحقق من الصلاحية =====
function checkAdminAuth() {
  // ✅ نمنع تشغيل الدالة في صفحة login
  if (window.location.pathname.includes('login.html')) {
    return true; // نسمح بالمرور عشان الصفحة تفتح عادي
  }

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

  const nameElement = document.getElementById('adminName');
  if (nameElement) {
    nameElement.textContent = adminData.name || 'مدير';
  }

  const badgeElement = document.getElementById('adminRoleBadge');
  if (badgeElement) {
    badgeElement.textContent = isSuperAdmin ? '👑 سوبر أدمن' : '🛡️ مشرف';
  }

  loadAdminQuotes();
  loadAdminNews();
  loadDashboardCards(isSuperAdmin);
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
    .then((snapshot) => {
      if (snapshot.empty) {
        container.innerHTML = `
          <i class="fas fa-quote-right"></i>
          لا توجد جمل تحفيزية للمسئولين حالياً
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
        جاري تحميل الجمل التحفيزية...
      `;
    });
}

// ===== تحميل آخر الأخبار الإدارية =====
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

  let cards = [];

  const commonCards = [
    { icon: 'fa-boxes', title: 'المنتجات', url: '/gomla/admin/products.html', desc: 'إدارة المنتجات' },
    { icon: 'fa-users', title: 'العملاء', url: '/gomla/admin/customers.html', desc: isSuperAdmin ? 'تحكم كامل' : 'عرض فقط' },
    { icon: 'fa-file-invoice', title: 'الفواتير والطلبات', url: '/gomla/admin/invoices.html', desc: 'إدارة الفواتير والطلبات' },
  ];

  const superCards = [
    { icon: 'fa-file-pdf', title: 'استخراج من PDF', url: '/gomla/admin/extract.html', desc: 'سوبر أدمن فقط' },
    { icon: 'fa-chart-pie', title: 'التقارير والصندوق', url: '/gomla/admin/reports.html', desc: 'تحكم كامل' },
    { icon: 'fa-cog', title: 'الإعدادات', url: '/gomla/admin/settings.html', desc: 'سوبر أدمن فقط' },
    { icon: 'fa-key', title: 'توليد الأكواد', url: '/gomla/admin/generate-codes.html', desc: 'سوبر أدمن فقط' },
    { icon: 'fa-user-cog', title: 'إدارة الصلاحيات', url: '/gomla/admin/roles-management.html', desc: 'سوبر أدمن فقط' },
    { icon: 'fa-paint-brush', title: 'إدارة السايدبار', url: '/gomla/admin/sidebar-content.html', desc: 'سوبر أدمن فقط' },
    { icon: 'fa-newspaper', title: 'إدارة الأخبار', url: '/gomla/admin/news-management.html', desc: 'سوبر أدمن فقط' },
    { icon: 'fa-lightbulb', title: 'إدارة النصائح', url: '/gomla/admin/tips-management.html', desc: 'سوبر أدمن فقط' },
    { icon: 'fa-ad', title: 'إدارة الإعلانات', url: '/gomla/admin/ads-management.html', desc: 'سوبر أدمن فقط' },
    { icon: 'fa-quote-right', title: 'إدارة المقولات', url: '/gomla/admin/quotes-management.html', desc: 'سوبر أدمن فقط' },
  ];

  const moderatorCards = [
    { icon: 'fa-chart-pie', title: 'التقارير', url: '/gomla/admin/reports.html', desc: 'عرض فقط' },
    { icon: 'fa-user-shield', title: 'المشرفين', url: '/gomla/admin/roles-management.html', desc: 'عرض فقط' },
  ];

  const extraCards = [
    { icon: 'fa-history', title: 'سجل النشاط', url: '/gomla/admin/activity.html', desc: 'عرض الكل' },
    { icon: 'fa-user-edit', title: 'البيانات الشخصية', url: '/gomla/admin/profile.html', desc: 'تعديل البيانات' },
  ];

  if (isSuperAdmin) {
    cards = [...commonCards, ...superCards, ...extraCards];
  } else {
    cards = [...commonCards, ...moderatorCards, ...extraCards];
  }

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

// ===== تشغيل لوحة التحكم (فقط في صفحات الإدارة) =====
document.addEventListener('DOMContentLoaded', function() {
  // ✅ منع تشغيل الـ dashboard في صفحة login
  if (window.location.pathname.includes('login.html')) {
    return;
  }

  if (!checkAdminAuth()) return;
  loadDashboard();
});

// تصدير الدوال للاستخدام العالمي
window.checkAdminAuth = checkAdminAuth;
window.loadDashboard = loadDashboard;
window.loadAdminQuotes = loadAdminQuotes;
window.loadAdminNews = loadAdminNews;
window.loadDashboardCards = loadDashboardCards;