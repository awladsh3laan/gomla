// ============================================
// 🧠 الدوال المشتركة - أولاد شعلان جملة
// ============================================

// ===== رسائل التنبيه (Toast) =====
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) {
    const div = document.createElement('div');
    div.id = 'toast-container';
    div.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;max-width:90%;';
    document.body.appendChild(div);
  }
  
  const toast = document.createElement('div');
  const colors = {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  
  toast.style.cssText = `
    padding: 12px 24px;
    border-radius: 12px;
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
    window.location.href = '/gomla/';
    return false;
  }
  return true;
}

// ===== تسجيل النشاط =====
function logActivity(action, details) {
  const adminData = localStorage.getItem('admin');
  const admin = adminData ? JSON.parse(adminData) : { name: 'غير معروف' };
  
  db.collection('activityLog').add({
    adminId: localStorage.getItem('adminId') || 'unknown',
    adminName: admin.name || 'غير معروف',
    action: action,
    details: details || '',
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(() => {});
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
          <header style="background:#1a3a5c;color:white;padding:12px;text-align:center;">
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
          <footer style="background:#0f2a44;color:white;padding:12px;text-align:center;">
            <p>© 2026 أولاد شعلان جملة</p>
          </footer>
        `;
      }
    });
}

// ===== تشغيل عند تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
  loadHeader();
  loadFooter();
});

// تصدير الدوال
window.showToast = showToast;
window.formatDate = formatDate;
window.generateCode = generateCode;
window.copyToClipboard = copyToClipboard;
window.checkAdminAuth = checkAdminAuth;
window.checkCustomerAuth = checkCustomerAuth;
window.logActivity = logActivity;
window.loadHeader = loadHeader;
window.loadFooter = loadFooter;