// ============================================
// 🧠 السايدبار الذكي - أولاد شعلان جملة
// ============================================

// ===== تحميل السايدبار =====
function loadSidebar() {
  fetch('/gomla/assets/components/sidebar.html')
    .then(res => res.text())
    .then(html => {
      // إضافة السايدبار للصفحة
      const sidebarContainer = document.createElement('div');
      sidebarContainer.id = 'sidebarContainer';
      sidebarContainer.innerHTML = html;
      document.body.appendChild(sidebarContainer);
      
      // تهيئة السايدبار
      initSidebar();
    })
    .catch(() => {
      console.warn('⚠️ فشل تحميل السايدبار');
    });
}

// ===== تهيئة السايدبار =====
function initSidebar() {
  const sidebar = document.getElementById('smartSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const toggleBtn = document.getElementById('sidebarToggle');
  const closeBtn = document.getElementById('sidebarClose');
  
  // ===== فتح السايدبار =====
  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  // ===== إغلاق السايدبار =====
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // ===== ربط الأزرار =====
  if (toggleBtn) {
    toggleBtn.addEventListener('click', openSidebar);
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSidebar);
  }
  
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }
  
  // ===== إغلاق بالضغط على Escape =====
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeSidebar();
  });
  
  // ===== تحميل محتوى السايدبار حسب المستخدم =====
  updateSidebarContent();
}

// ===== تحديث محتوى السايدبار =====
function updateSidebarContent() {
  // التحقق من نوع المستخدم
  const customerData = localStorage.getItem('customer');
  const adminData = localStorage.getItem('admin');
  const isAdmin = adminData !== null;
  const isSuperAdmin = isAdmin && JSON.parse(adminData).role === 'super';
  const isCustomer = customerData !== null;
  
  // تحديث الصورة والاسم
  updateUserInfo(isCustomer, isAdmin);
  
  // تحديث الجمل التحفيزية
  loadMotivationalPhrases();
  
  // تحديث الأخبار
  loadNews();
  
  // تحديث الروابط
  updateSidebarLinks(isCustomer, isAdmin, isSuperAdmin);
  
  // تحديث زر الدخول/الخروج
  updateActionButton(isCustomer, isAdmin);
}

// ===== تحديث معلومات المستخدم =====
function updateUserInfo(isCustomer, isAdmin) {
  const avatar = document.getElementById('sidebarAvatar');
  const username = document.getElementById('sidebarUsername');
  const userRole = document.getElementById('sidebarUserRole');
  
  if (isAdmin) {
    const admin = JSON.parse(localStorage.getItem('admin'));
    username.textContent = admin.name || 'مشرف';
    userRole.textContent = admin.role === 'super' ? '👑 سوبر أدمن' : '🛡️ مشرف';
    if (admin.avatar) {
      avatar.src = admin.avatar;
    }
  } else if (isCustomer) {
    const customer = JSON.parse(localStorage.getItem('customer'));
    username.textContent = customer.name || 'عميل';
    userRole.textContent = `🔑 ${customer.code || 'عميل'}`;
    if (customer.avatar) {
      avatar.src = customer.avatar;
    }
  } else {
    username.textContent = 'زائر عزيز';
    userRole.textContent = 'مرحباً بك';
    avatar.src = 'assets/images/default-avatar.png';
  }
}

// ===== تحميل الجمل التحفيزية =====
function loadMotivationalPhrases() {
  const container = document.getElementById('motivationalText');
  if (!container) return;
  
  // جلب الجمل من Firebase
  db.collection('motivationalPhrases')
    .where('active', '==', true)
    .orderBy('order')
    .get()
    .then((snapshot) => {
      const phrases = [];
      snapshot.forEach((doc) => {
        phrases.push(doc.data().text);
      });
      
      if (phrases.length === 0) {
        container.textContent = '"ابتسم فإن الله يراك"';
        return;
      }
      
      // عرض جملة عشوائية
      let index = 0;
      container.textContent = `"${phrases[0]}"`;
      
      // تغيير الجملة كل 5 ثواني
      setInterval(() => {
        index = (index + 1) % phrases.length;
        container.style.opacity = '0';
        setTimeout(() => {
          container.textContent = `"${phrases[index]}"`;
          container.style.opacity = '1';
        }, 300);
      }, 5000);
    })
    .catch(() => {
      container.textContent = '"ابتسم فإن الله يراك"';
    });
}

// ===== تحميل الأخبار =====
function loadNews() {
  const container = document.getElementById('newsList');
  if (!container) return;
  
  db.collection('news')
    .where('active', '==', true)
    .orderBy('order')
    .limit(5)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        container.innerHTML = `
          <div class="news-item">
            <span class="news-dot"></span>
            <span class="news-text">لا توجد أخبار حالياً</span>
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

// ===== تحديث الروابط =====
function updateSidebarLinks(isCustomer, isAdmin, isSuperAdmin) {
  const nav = document.getElementById('sidebarNav');
  if (!nav) return;
  
  let links = [];
  
  // روابط عامة
  links.push({ icon: 'fa-home', text: 'الرئيسية', url: '/gomla/' });
  
  if (isCustomer) {
    links.push({ icon: 'fa-user', text: 'صفحتي الشخصية', url: '/gomla/customer-dashboard.html' });
    links.push({ icon: 'fa-box', text: 'تتبع طلباتي', url: '/gomla/tracking.html' });
    links.push({ icon: 'fa-store', text: 'المتجر', url: '/gomla/' });
  }
  
  if (isAdmin) {
    links.push({ icon: 'fa-tachometer-alt', text: 'لوحة التحكم', url: '/gomla/admin/dashboard.html' });
    links.push({ icon: 'fa-boxes', text: 'المنتجات', url: '/gomla/admin/products.html' });
    links.push({ icon: 'fa-users', text: 'العملاء', url: '/gomla/admin/customers.html' });
    links.push({ icon: 'fa-file-invoice', text: 'الفواتير', url: '/gomla/admin/invoices.html' });
    links.push({ icon: 'fa-file-pdf', text: 'استخراج من PDF', url: '/gomla/admin/extract.html' });
    links.push({ icon: 'fa-chart-pie', text: 'التقارير', url: '/gomla/admin/reports.html' });
    links.push({ icon: 'fa-cog', text: 'الإعدادات', url: '/gomla/admin/settings.html' });
    
    if (isSuperAdmin) {
      links.push({ icon: 'fa-key', text: 'توليد الأكواد', url: '/gomla/admin/generate-codes.html' });
      links.push({ icon: 'fa-paint-brush', text: 'إدارة السايدبار', url: '/gomla/admin/sidebar-content.html' });
    }
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
      } else {
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

// ============================================
// 🚀 تشغيل السايدبار عند تحميل الصفحة
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  loadSidebar();
});

// تصدير الدوال للاستخدام العالمي
window.loadSidebar = loadSidebar;
window.updateSidebarContent = updateSidebarContent;
window.openSidebar = function() {
  document.getElementById('smartSidebar')?.classList.add('open');
  document.getElementById('sidebarOverlay')?.classList.add('active');
};
window.closeSidebar = function() {
  document.getElementById('smartSidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('active');
};