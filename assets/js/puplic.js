// ============================================
// 🌐 وظائف الصفحات العامة - أولاد شعلان جملة
// ============================================

// ===== تحميل الجمل التحفيزية (نوع محدد) =====
function loadQuotesByType(type, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const quoteType = type || 'general';

  db.collection('quotes')
    .where('type', '==', quoteType)
    .where('active', '==', true)
    .orderBy('order')
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        container.innerHTML = `
          <div class="quote-text">
            لا توجد جمل تحفيزية حالياً
          </div>
        `;
        return;
      }

      const quotes = [];
      snapshot.forEach((doc) => {
        quotes.push(doc.data().text);
      });

      let index = 0;
      container.innerHTML = `<div class="quote-text">"${quotes[0]}"</div>`;

      setInterval(() => {
        index = (index + 1) % quotes.length;
        const textEl = container.querySelector('.quote-text');
        if (textEl) {
          textEl.style.opacity = '0';
          setTimeout(() => {
            textEl.textContent = `"${quotes[index]}"`;
            textEl.style.opacity = '1';
          }, 300);
        }
      }, 5000);
    })
    .catch(() => {
      container.innerHTML = `
        <div class="quote-text">
          جاري تحميل الجمل التحفيزية...
        </div>
      `;
    });
}

// ===== تحميل آخر الأخبار (نوع محدد) =====
function loadNewsByType(type, containerId, limit = 4) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const newsType = type || 'general';

  db.collection('news')
    .where('type', '==', newsType)
    .where('active', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(limit)
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

// ===== تحميل التصنيفات =====
function loadCategories() {
  const container = document.getElementById('categories-container');
  if (!container) return;

  db.collection('categories')
    .orderBy('name')
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        container.innerHTML = `
          <div class="text-center py-8 text-gray-400 col-span-full">
            <i class="fas fa-folder-open text-4xl"></i>
            <p class="mt-2">لا توجد تصنيفات حالياً</p>
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
      
      const totalElement = document.getElementById('total-categories');
      if (totalElement) totalElement.textContent = snapshot.size;
    })
    .catch((error) => {
      console.error('Error loading categories:', error);
      container.innerHTML = `
        <div class="text-center py-8 text-red-500 col-span-full">
          <i class="fas fa-exclamation-triangle text-2xl"></i>
          <p class="mt-2">حدث خطأ في تحميل التصنيفات</p>
        </div>
      `;
    });
}

// ===== تحميل المنتجات (أحدث المنتجات) =====
function loadProducts() {
  const container = document.getElementById('products-container');
  if (!container) return;

  container.innerHTML = `
    <div class="text-center py-8 text-gray-400 col-span-full">
      <i class="fas fa-spinner fa-spin text-2xl"></i>
      <p class="mt-2">جاري تحميل المنتجات...</p>
    </div>
  `;

  db.collection('products')
    .where('available', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(12)
    .get()
    .then((snapshot) => {
      const totalElement = document.getElementById('total-products');
      if (totalElement) totalElement.textContent = snapshot.size;

      if (snapshot.empty) {
        container.innerHTML = `
          <div class="text-center py-12 text-gray-400 col-span-full">
            <i class="fas fa-box-open text-5xl"></i>
            <p class="mt-3 text-lg">لا توجد منتجات متاحة حالياً</p>
            <p class="text-sm">سيتم إضافة منتجات جديدة قريباً، تابعنا!</p>
          </div>
        `;
        return;
      }

      let html = '';
      snapshot.forEach((doc) => {
        const product = { id: doc.id, ...doc.data() };
        const priceText = product.price ? `${product.price} ج.م` : 'سعر غير محدد';
        const brandName = product.brandName || 'بدون براند';

        html += `
          <div class="product-card" onclick="openProductModal('${product.id}')">
            <img src="${product.imageUrl || 'assets/images/no-image.png'}" 
                 alt="${product.name}" 
                 class="product-img"
                 onerror="this.src='assets/images/no-image.png'">
            <div class="product-body">
              <h4 class="product-name">${product.name}</h4>
              <p class="product-brand">${brandName}</p>
              <div class="product-price">${priceText}</div>
              <button class="btn-add" onclick="event.stopPropagation();addToCart('${product.id}')">
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
        <div class="text-center py-12 text-red-500 col-span-full">
          <i class="fas fa-exclamation-triangle text-3xl"></i>
          <p class="mt-3 text-lg">حدث خطأ في تحميل المنتجات</p>
          <p class="text-sm">يرجى المحاولة مرة أخرى</p>
          <button class="btn btn-primary mt-3" onclick="loadProducts()">
            <i class="fas fa-sync"></i> إعادة المحاولة
          </button>
        </div>
      `;
    });
}

// ===== تحميل البراندات =====
function loadBrands() {
  const container = document.getElementById('brands-container');
  if (!container) return;

  db.collection('brands')
    .orderBy('name')
    .get()
    .then((snapshot) => {
      const totalElement = document.getElementById('total-brands');
      if (totalElement) totalElement.textContent = snapshot.size;
    })
    .catch((error) => {
      console.error('Error loading brands:', error);
    });
}

// ===== تحميل محتوى الصفحة الرئيسية =====
function loadHomePageContent() {
  loadQuotesByType('general', 'quotes-container');
  loadNewsByType('general', 'news-container', 4);
  loadCategories();
  loadProducts();
  loadBrands();
}

// ===== تشغيل الصفحة الرئيسية =====
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('quotes-container') && document.getElementById('news-container')) {
    loadHomePageContent();
  }
});