// ============================================================
// 🌐 public.js - وظائف الصفحات العامة
// ============================================================

// ===== استخدام آمن لـ db =====
const db = window.db || firebase.firestore();

// ============================================================
// 🖼️ دوال السلايدر
// ============================================================

let slideIndex = 0;
let slideInterval;

function loadSlider() {
  const track = document.getElementById('sliderTrack');
  const dotsContainer = document.getElementById('sliderDots');
  if (!track || !dotsContainer) return;

  // إذا لم توجد صور، نعرض رسالة بديلة
  track.innerHTML = `
    <div class="slide-item">
      <div class="slide-placeholder">لا توجد صور في السلايدر</div>
    </div>
  `;
  dotsContainer.innerHTML = '';
}

function slidePrev() {
  const track = document.getElementById('sliderTrack');
  if (!track) return;
  // منطق التبديل للخلف
}

function slideNext() {
  const track = document.getElementById('sliderTrack');
  if (!track) return;
  // منطق التبديل للأمام
}

// ============================================================
// 📦 دوال المنتجات والتصنيفات (نسخ احتياطي)
// ============================================================

function loadCategories() {
  const container = document.getElementById('categoriesContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state">لا توجد تصنيفات حالياً</div>
  `;
}

function loadProducts() {
  const container = document.getElementById('productsContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state">لا توجد منتجات متاحة حالياً</div>
  `;
}

function loadOffers() {
  const container = document.getElementById('offersContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state">لا توجد عروض حالياً</div>
  `;
}

function loadAds() {
  const container = document.getElementById('adsGrid');
  if (!container) return;
  container.innerHTML = '';
}

function loadQuotes() {
  const container = document.getElementById('quoteText');
  if (!container) return;
  container.textContent = 'مرحباً بك في متجر أولاد شعلان جملة';
}

function loadNews() {
  const container = document.getElementById('newsText');
  if (!container) return;
  container.textContent = 'لا توجد أخبار حالياً';
}

// ============================================================
// 🚀 تحميل كل محتوى الصفحة الرئيسية
// ============================================================

function loadHomePage() {
  loadCategories();
  loadProducts('retail', 12);
  loadOffers('retail', 8);
  loadAds();
  loadQuotes();
  loadNews();
  loadSlider();
}

// ============================================================
// 🚀 تشغيل عند تحميل الصفحة
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('productsContainer')) {
    loadHomePage();
  }
});

// تصدير الدوال للاستخدام العالمي
window.slidePrev = slidePrev;
window.slideNext = slideNext;
window.loadCategories = loadCategories;
window.loadProducts = loadProducts;
window.loadOffers = loadOffers;
window.loadAds = loadAds;
window.loadQuotes = loadQuotes;
window.loadNews = loadNews;
window.loadSlider = loadSlider;
window.loadHomePage = loadHomePage;
