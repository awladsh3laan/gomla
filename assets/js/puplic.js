// ============================================
// 🌐 وظائف الصفحات العامة - أولاد شعلان جملة
// ============================================

// ===== استخدام آمن لـ db =====
const db = window.db || firebase.firestore();

// ============================================
// 📦 تحميل التصنيفات
// ============================================

function loadCategories() {
  const container = document.getElementById('categoriesContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> جاري تحميل التصنيفات...</div>
  `;

  db.collection('categories')
    .orderBy('name')
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        container.innerHTML = `
          <div class="empty-state" style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-400);">
            <i class="fas fa-folder-open" style="font-size:2rem;display:block;margin-bottom:8px;"></i>
            لا توجد تصنيفات حالياً
          </div>
        `;
        return;
      }

      let html = '';
      snapshot.forEach((doc) => {
        const cat = doc.data();
        const count = cat.productCount || 0;
        html += `
          <div class="category-card" onclick="filterByCategory('${doc.id}')">
            <i class="${cat.icon || 'fa-tag'}"></i>
            <h4>${cat.name}</h4>
            <span>${count} منتج</span>
          </div>
        `;
      });

      container.innerHTML = html;
    })
    .catch((error) => {
      console.error('Error loading categories:', error);
      container.innerHTML = `
        <div class="error-state" style="grid-column:1/-1;text-align:center;padding:40px;color:#ef4444;">
          <i class="fas fa-exclamation-triangle" style="font-size:2rem;display:block;margin-bottom:8px;"></i>
          حدث خطأ في تحميل التصنيفات
        </div>
      `;
    });
}

// ============================================
# 📦 تحميل المنتجات (حسب النوع)
// ============================================

function loadProducts(type = 'retail', limit = 12) {
  const container = document.getElementById('productsContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> جاري تحميل المنتجات...</div>
  `;

  const priceField = type === 'wholesale' ? 'wholesalePrice' : 'retailPrice';

  db.collection('products')
    .where('available', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        container.innerHTML = `
          <div class="empty-state" style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-400);">
            <i class="fas fa-box-open" style="font-size:2rem;display:block;margin-bottom:8px;"></i>
            لا توجد منتجات متاحة حالياً
          </div>
        `;
        return;
      }

      let html = '';
      snapshot.forEach((doc) => {
        const product = { id: doc.id, ...doc.data() };
        const price = product[priceField] || product.price || 0;
        const brandName = product.brandName || '';
        const imageUrl = product.imageUrl || 'assets/images/no-image.png';

        html += `
          <div class="product-card" onclick="openProductModal('${product.id}')">
            <img src="${imageUrl}" alt="${product.name}" class="product-image" onerror="this.src='assets/images/no-image.png'">
            <div class="product-body">
              <h4 class="product-name">${product.name}</h4>
              ${brandName ? `<p class="product-brand">${brandName}</p>` : ''}
              <div class="product-price">${price.toFixed(2)} ج.م</div>
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();addToCart('${product.id}')">
                <i class="fas fa-cart-plus"></i> أضف للسلة
              </button>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
    })
    .catch((error) => {
      console.error('Error loading products:', error);
      container.innerHTML = `
        <div class="error-state" style="grid-column:1/-1;text-align:center;padding:40px;color:#ef4444;">
          <i class="fas fa-exclamation-triangle" style="font-size:2rem;display:block;margin-bottom:8px;"></i>
          حدث خطأ في تحميل المنتجات
        </div>
      `;
    });
}

// ============================================
# 📦 تحميل العروض
// ============================================

function loadOffers(type = 'retail', limit = 8) {
  const container = document.getElementById('offersContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> جاري تحميل العروض...</div>
  `;

  const priceField = type === 'wholesale' ? 'wholesalePrice' : 'retailPrice';

  db.collection('offers')
    .where('active', '==', true)
    .where('type', '==', type)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        container.innerHTML = `
          <div class="empty-state" style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-400);">
            <i class="fas fa-percent" style="font-size:2rem;display:block;margin-bottom:8px;"></i>
            لا توجد عروض حالياً
          </div>
        `;
        return;
      }

      // جلب المنتجات المرتبطة بالعروض
      const productIds = [];
      snapshot.forEach((doc) => {
        productIds.push(doc.data().productId);
      });

      if (productIds.length === 0) {
        container.innerHTML = `
          <div class="empty-state" style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-400);">
            لا توجد عروض متاحة
          </div>
        `;
        return;
      }

      db.collection('products')
        .where('available', '==', true)
        .get()
        .then((productsSnapshot) => {
          const products = {};
          productsSnapshot.forEach((doc) => {
            products[doc.id] = { id: doc.id, ...doc.data() };
          });

          let html = '';
          snapshot.forEach((doc) => {
            const offer = doc.data();
            const product = products[offer.productId];
            if (!product) return;

            const originalPrice = product[priceField] || product.price || 0;
            const discount = offer.discount || 0;
            const priceAfterDiscount = originalPrice * (1 - discount / 100);

            html += `
              <div class="product-card offer-card" onclick="openProductModal('${product.id}')">
                <div class="offer-badge">خصم ${discount}%</div>
                <img src="${product.imageUrl || 'assets/images/no-image.png'}" alt="${product.name}" class="product-image" onerror="this.src='assets/images/no-image.png'">
                <div class="product-body">
                  <h4 class="product-name">${product.name}</h4>
                  <div class="product-price">
                    <span class="price-after">${priceAfterDiscount.toFixed(2)} ج.م</span>
                    <span class="price-before">${originalPrice.toFixed(2)} ج.م</span>
                  </div>
                  <button class="btn btn-gold btn-sm" onclick="event.stopPropagation();addToCart('${product.id}')">
                    <i class="fas fa-cart-plus"></i> أضف للسلة
                  </button>
                </div>
              </div>
            `;
          });

          container.innerHTML = html || `
            <div class="empty-state" style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-400);">
              لا توجد عروض متاحة حالياً
            </div>
          `;
        });
    })
    .catch((error) => {
      console.error('Error loading offers:', error);
      container.innerHTML = `
        <div class="error-state" style="grid-column:1/-1;text-align:center;padding:40px;color:#ef4444;">
          <i class="fas fa-exclamation-triangle" style="font-size:2rem;display:block;margin-bottom:8px;"></i>
          حدث خطأ في تحميل العروض
        </div>
      `;
    });
}

// ============================================
# 📢 تحميل الإعلانات
// ============================================

function loadAds() {
  const container = document.getElementById('adsGrid');
  if (!container) return;

  db.collection('ads')
    .where('active', '==', true)
    .orderBy('order')
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        container.innerHTML = '';
        return;
      }

      let html = '';
      snapshot.forEach((doc) => {
        const ad = doc.data();
        html += `
          <div class="ad-item">
            <a href="${ad.link || '#'}" target="${ad.target || '_blank'}">
              <img src="${ad.imageUrl}" alt="${ad.title || 'إعلان'}" loading="lazy" onerror="this.style.display='none'">
            </a>
          </div>
        `;
      });

      container.innerHTML = html;
    })
    .catch((error) => {
      console.error('Error loading ads:', error);
    });
}

// ============================================
# 💬 تحميل المقولات
// ============================================

function loadQuotes() {
  const container = document.getElementById('quoteText');
  if (!container) return;

  db.collection('quotes')
    .where('active', '==', true)
    .orderBy('order')
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        container.textContent = 'مرحباً بك في متجر أولاد شعلان جملة';
        return;
      }

      const quotes = [];
      snapshot.forEach((doc) => {
        quotes.push(doc.data().text);
      });

      let index = 0;
      container.textContent = quotes[0];

      setInterval(() => {
        index = (index + 1) % quotes.length;
        container.style.opacity = '0';
        setTimeout(() => {
          container.textContent = quotes[index];
          container.style.opacity = '1';
        }, 300);
      }, 5000);
    })
    .catch((error) => {
      console.error('Error loading quotes:', error);
      container.textContent = 'مرحباً بك في متجر أولاد شعلان جملة';
    });
}

// ============================================
# 📰 تحميل الأخبار
// ============================================

function loadNews() {
  const container = document.getElementById('newsText');
  if (!container) return;

  db.collection('news')
    .where('active', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(5)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        container.textContent = 'لا توجد أخبار حالياً';
        return;
      }

      const newsItems = [];
      snapshot.forEach((doc) => {
        newsItems.push(doc.data().title);
      });

      let index = 0;
      container.textContent = newsItems[0];

      setInterval(() => {
        index = (index + 1) % newsItems.length;
        container.style.opacity = '0';
        setTimeout(() => {
          container.textContent = newsItems[index];
          container.style.opacity = '1';
        }, 300);
      }, 6000);
    })
    .catch((error) => {
      console.error('Error loading news:', error);
      container.textContent = 'جاري تحميل الأخبار...';
    });
}

// ============================================
# 🖼️ سلايدر الصور
// ============================================

let slideIndex = 0;
let slideInterval;

function loadSlider() {
  const track = document.getElementById('sliderTrack');
  const dotsContainer = document.getElementById('sliderDots');
  if (!track || !dotsContainer) return;

  db.collection('slider')
    .where('active', '==', true)
    .orderBy('order')
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        track.innerHTML = `
          <div class="slide-item">
            <div class="slide-placeholder">لا توجد صور في السلايدر</div>
          </div>
        `;
        return;
      }

      let slidesHtml = '';
      let dotsHtml = '';
      let index = 0;

      snapshot.forEach((doc) => {
        const slide = doc.data();
        slidesHtml += `
          <div class="slide-item">
            <img src="${slide.imageUrl}" alt="${slide.title || 'صورة'}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\'slide-placeholder\'>صورة غير متاحة</div>'">
            ${slide.title ? `<div class="slide-caption">${slide.title}</div>` : ''}
          </div>
        `;
        dotsHtml += `<span class="dot" data-index="${index}"></span>`;
        index++;
      });

      track.innerHTML = slidesHtml;
      dotsContainer.innerHTML = dotsHtml;

      // تفعيل النقاط
      document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.addEventListener('click', () => goToSlide(i));
      });

      // بدء التشغيل التلقائي
      startSlider();
    })
    .catch((error) => {
      console.error('Error loading slider:', error);
      track.innerHTML = `
        <div class="slide-item">
          <div class="slide-placeholder">حدث خطأ في تحميل السلايدر</div>
        </div>
      `;
    });
}

function startSlider() {
  if (slideInterval) clearInterval(slideInterval);
  slideInterval = setInterval(() => {
    const total = document.querySelectorAll('.slide-item').length;
    if (total > 0) {
      slideIndex = (slideIndex + 1) % total;
      updateSlider();
    }
  }, 5000);
}

function goToSlide(index) {
  slideIndex = index;
  updateSlider();
  startSlider();
}

function updateSlider() {
  const track = document.getElementById('sliderTrack');
  const dots = document.querySelectorAll('.dot');
  if (!track) return;

  const total = document.querySelectorAll('.slide-item').length;
  if (total === 0) return;

  track.style.transform = `translateX(${slideIndex * 100}%)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === slideIndex);
  });
}

function slidePrev() {
  const total = document.querySelectorAll('.slide-item').length;
  if (total === 0) return;
  slideIndex = (slideIndex - 1 + total) % total;
  updateSlider();
  startSlider();
}

function slideNext() {
  const total = document.querySelectorAll('.slide-item').length;
  if (total === 0) return;
  slideIndex = (slideIndex + 1) % total;
  updateSlider();
  startSlider();
}

// ============================================
# 🚀 تحميل كل محتوى الصفحة
// ============================================

function loadHomePage() {
  loadCategories();
  loadProducts('retail', 12);
  loadOffers('retail', 8);
  loadAds();
  loadQuotes();
  loadNews();
  loadSlider();
}

// ============================================
# 🚀 تشغيل عند تحميل الصفحة
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // التحقق من وجود عناصر الصفحة الرئيسية
  if (document.getElementById('productsContainer')) {
    loadHomePage();
  }
});

// تصدير الدوال للاستخدام العالمي
window.loadCategories = loadCategories;
window.loadProducts = loadProducts;
window.loadOffers = loadOffers;
window.loadAds = loadAds;
window.loadQuotes = loadQuotes;
window.loadNews = loadNews;
window.loadSlider = loadSlider;
window.slidePrev = slidePrev;
window.slideNext = slideNext;
window.goToSlide = goToSlide;
window.filterByCategory = function(categoryId) {
  showToast('سيتم تصفية المنتجات حسب التصنيف', 'info');
  // يمكن إضافة منطق التصفية لاحقاً
};
window.openProductModal = function(productId) {
  showToast('سيتم فتح نافذة تفاصيل المنتج', 'info');
  // يمكن إضافة نافذة تفاصيل المنتج لاحقاً
};
window.addToCart = function(productId) {
  const user = getCurrentUser();
  if (!user) {
    showToast('⚠️ يرجى تسجيل الدخول أولاً', 'warning');
    return;
  }
  showToast('✅ تم إضافة المنتج للسلة', 'success');
  // يمكن إضافة منطق السلة لاحقاً
};