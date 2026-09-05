// ============================================
// 🧠 السايدبار الذكي - أولاد شعلان جملة (نسخة متطورة)
// ============================================

// ===== تحميل السايدبار =====
function loadSidebar() {
  fetch('/gomla/assets/components/sidebar.html')
    .then(res => res.text())
    .then(html => {
      const sidebarContainer = document.createElement('div');
      sidebarContainer.id = 'sidebarContainer';
      sidebarContainer.innerHTML = html;
      document.body.appendChild(sidebarContainer);
      initSidebar();
    })
    .catch(() => console.warn('⚠️ فشل تحميل السايدبار'));
}

// ===== تهيئة السايدبار =====
function initSidebar() {
  const sidebar = document.getElementById('smartSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const toggleBtn = document.getElementById('sidebarToggle');
  const closeBtn = document.getElementById('sidebarClose');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeSidebar();
  });

  // تحديث المحتوى حسب المستخدم
  updateSidebarContent();
}

// ===== تحديث محتوى السايدبار بالكامل =====
function updateSidebarContent() {
  const customerData = localStorage.getItem('customer');
  const adminData = localStorage.getItem('admin');
  const isAdmin = adminData !== null;
  const isSuperAdmin = isAdmin && JSON.parse(adminData).role === 'super';
  const isCustomer = customerData !== null;

  // تحديث معلومات المستخدم
  updateUserInfo(isCustomer, isAdmin, isSuperAdmin);

  // تحديث الجمل التحفيزية حسب النوع
  loadMotivationalPhrases(isCustomer, isAdmin);

  // تحديث الأخبار حسب النوع
  loadNews(isCustomer, isAdmin);

  // تحديث الروابط حسب الصلاحية
  updateSidebarLinks(isCustomer, isAdmin, isSuperAdmin);

  // تحديث زر الدخول/الخروج
  updateActionButton(isCustomer, isAdmin);
}

// ===== تحديث معلومات المستخدم =====
function updateUserInfo(isCustomer, isAdmin, isSuperAdmin) {
  const avatar = document.getElementById('sidebarAvatar');
  const username = document.getElementById('sidebarUsername');
  const userRole = document.getElementById('sidebarUserRole');

  if (isAdmin) {
    const admin = JSON.parse(localStorage.getItem('admin'));
    username.textContent = admin.name || 'مشرف';
    userRole.textContent = isSuperAdmin ? '👑 سوبر أدمن' : '🛡️ مشرف';
    if (admin.avatar) avatar.src = admin.avatar;
  } else if (isCustomer) {
    const customer = JSON.parse(localStorage.getItem('customer'));
    username.textContent = customer.name || 'عميل';
    userRole.textContent = `🔑 ${customer.code || 'عميل'}`;
    if (customer.avatar) avatar.src = customer.avatar;
  } else {
    username.textContent = 'مرحبا بك في أولاد شعلان ';
    userRole.textContent = 'زائر';
    avatar.src = 'https://i.ibb.co/GfK22yd4/Gemini-Generated-Image-76zms776zms776zm.png';
  }
}

// ===== تحميل الجمل التحفيزية حسب النوع =====
function loadMotivationalPhrases(isCustomer, isAdmin) {
  const container = document.getElementById('motivationalText');
  if (!container) return;

  // تحديد نوع المستخدم
  let userType = 'general';
  if (isAdmin) userType = 'admin';
  else if (isCustomer) userType = 'customer';

  db.collection('quotes')
    .where('active', '==', true)
    .get()
    .then((snapshot) => {
      let allQuotes = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // عرض الجمل المناسبة للنوع
        if (data.type === 'general' || data.type === userType) {
          allQuotes.push(data.text);
        }
      });

      if (allQuotes.length === 0) {
        container.textContent = isAdmin 
          ? '"كن قدوة في الإخلاص والتميز"'
          : isCustomer 
          ? '"شكراً لثقتك بنا، نحن نقدرك"'
          : '"أهلاً بك في متجر أولاد شعلان جملة"';
        return;
      }

      let index = 0;
      container.textContent = `"${allQuotes[0]}"`;

      setInterval(() => {
        index = (index + 1) % allQuotes.length;
        container.style.opacity = '0';
        setTimeout(() => {
          container.textContent = `"${allQuotes[index]}"`;
          container.style.opacity = '1';
        }, 300);
      }, 5000);
    })
    .catch(() => {
      container.textContent = isAdmin 
        ? '"كن قدوة في الإخلاص والتميز"'
        : isCustomer 
        ? '"شكراً لثقتك بنا، نحن نقدرك"'
        : '"أهلاً بك في متجر أولاد شعلان جملة"';
    });
}

// ===== تحميل الأخبار حسب النوع =====
function loadNews(isCustomer, isAdmin) {
  const container = document.getElementById('newsList');
  if (!container) return;

  let userType = 'general';
  if (isAdmin) userType = 'admin';

  db.collection('news')
    .where('active', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(5)
    .get()
    .then((snapshot) => {
      let newsItems = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.type === 'general' || data.type === userType) {
          newsItems.push(data.title);
        }
      });

      if (newsItems.length === 0) {
        container.innerHTML = `
          <div class="news-item">
            <span class="news-dot"></span>
            <span class="news-text">لا توجد أخبار حالياً</span>
          </div>
        `;
        return;
      }

      let html = '';
      newsItems.forEach((title) => {
        html += `
          <div class="news-item">
            <span class="news-dot"></span>
            <span class="news-text">${title}</span>
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

// ===== تحديث الروابط حسب الصلاحية =====
function updateSidebarLinks(isCustomer, isAdmin, isSuperAdmin) {
  const nav = document.getElementById('sidebarNav');
  if (!nav) return;

  let links = [];

  // روابط عامة للجميع
  links.push({ icon: 'fa-home', text: 'الرئيسية', url: '/gomla/' });

  if (isCustomer) {
    links.push({ icon: 'fa-user', text: 'صفحتي الشخصية', url: '/gomla/customer-dashboard.html' });
    links.push({ icon: 'fa-file-invoice', text: 'فواتيري', url: '/gomla/customer-invoices.html' });
    links.push({ icon: 'fa-box', text: 'تتبع طلباتي', url: '/gomla/tracking.html' });
    links.push({ icon: 'fa-tags', text: 'العروض', url: '/gomla/customer-offers.html' });
    links.push({ icon: 'fa-lightbulb', text: 'نصائح ومعلومات', url: '/gomla/customer-tips.html' });
    links.push({ icon: 'fa-newspaper', text: 'آخر الأخبار', url: '/gomla/customer-news.html' });
  }

  if (isAdmin) {
    // روابط المديرين (كلها)
    links.push({ icon: 'fa-tachometer-alt', text: 'لوحة التحكم', url: '/gomla/admin/dashboard.html' });
    links.push({ icon: 'fa-boxes', text: 'المنتجات', url: '/gomla/admin/products.html' });
    
    // العملاء: تحكم للسوبر أدمن، عرض للمشرفين
    links.push({ 
      icon: 'fa-users', 
      text: isSuperAdmin ? 'العملاء (تحكم)' : 'العملاء (عرض)', 
      url: '/gomla/admin/customers.html' 
    });
    
    links.push({ icon: 'fa-file-invoice', text: 'الفواتير والطلبات', url: '/gomla/admin/invoices.html' });
    
    // استخراج PDF: سوبر أدمن فقط
    if (isSuperAdmin) {
      links.push({ icon: 'fa-file-pdf', text: 'استخراج من PDF', url: '/gomla/admin/extract.html' });
    }
    
    // التقارير: تحكم للسوبر أدمن، عرض للمشرفين
    links.push({ 
      icon: 'fa-chart-pie', 
      text: isSuperAdmin ? 'التقارير (تحكم)' : 'التقارير (عرض)', 
      url: '/gomla/admin/reports.html' 
    });
    
    // إعدادات وتوليد أكواد وإدارة صلاحيات وإدارة سايدبار: سوبر أدمن فقط
    if (isSuperAdmin) {
      links.push({ icon: 'fa-cog', text: 'الإعدادات', url: '/gomla/admin/settings.html' });
      links.push({ icon: 'fa-key', text: 'توليد الأكواد', url: '/gomla/admin/generate-codes.html' });
      links.push({ icon: 'fa-user-cog', text: 'إدارة الصلاحيات', url: '/gomla/admin/roles-management.html' });
      links.push({ icon: 'fa-paint-brush', text: 'إدارة السايدبار', url: '/gomla/admin/sidebar-content.html' });
    }
    
    // صفحة المشرفين: تحكم للسوبر أدمن، عرض للمشرفين
    links.push({ 
      icon: 'fa-user-shield', 
      text: isSuperAdmin ? 'المشرفين (تحكم)' : 'المشرفين (عرض)', 
      url: '/gomla/admin/roles-management.html' 
    });
  }

  // بناء الـ HTML
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

// ===== تحديث زر الدخول/الخروج =====
function updateActionButton(isCustomer, isAdmin) {
  const btn = document.getElementById('sidebarActionBtn');
  if (!btn) return;

  if (isCustomer || isAdmin) {
    btn.innerHTML = `<i class="fas fa-sign-out-alt"></i> <span>تسجيل الخروج</span>`;
    btn.onclick = function() {
      if (isAdmin) {
        logoutAdmin();
      } if (isCustomer) {
        logoutCustomer();
      }
    };
  } else {
    btn.innerHTML = `<i class="fas fa-sign-in-alt"></i> <span>تسجيل الدخول</span>`;
    btn.onclick = function() {
      window.location.href = '/gomla/customer-login.html';
    };
  }
}

// ===== دوال تسجيل الخروج =====
function logoutCustomer() {
  localStorage.removeItem('customer');
  localStorage.removeItem('customerCode');
  window.location.href = '/gomla/';
}

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

// ============================================
// 🚀 تشغيل السايدبار عند تحميل الصفحة
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  loadSidebar();
});

// تصدير الدوال
window.loadSidebar = loadSidebar;
window.updateSidebarContent = updateSidebarContent;
window.logoutCustomer = logoutCustomer;
window.logoutAdmin = logoutAdmin;
