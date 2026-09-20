// ============================================================
// 🌐 public.js - دوال الصفحات العامة (الصفحة الرئيسية)
// الإصدار: 6.0
// آخر تحديث: 2026-09-19
// 📌 يحتوي على: السلايدر، المنتجات، العروض، السيكشنات المخصصة، نبذة
// ============================================================

// ============================================================
// 1️⃣ السلايدر
// ============================================================

let slideIndex = 0;
let slideInterval = null;
let slidesCount = 0;

async function loadSlider() {
  const track = document.getElementById('sliderTrack');
  const dots = document.getElementById('sliderDots');
  if (!track) return;
  
  try {
    const snapshot = await db.collection(COLLECTIONS.SLIDER)
      .where('active', '==', true)
      .orderBy('order', 'asc')
      .get();
    
    if (snapshot.empty) {
      track.innerHTML = `
        <div class="slider-item">
          <div class="slide-placeholder">
            <i class="fas fa-image"></i>
            لا توجد صور في السلايدر
          </div>
        </div>
      `;
      return;
    }
    
    let slidesHtml = '';
    let dotsHtml = '';
    let index = 0;
    
    snapshot.forEach(doc => {
      const slide = doc.data();
      const imageUrl = slide.imageUrl || '';
      const title = slide.title || '';
      const link = slide.link || '';
      
      const captionHtml = title ? `<div class="slider-caption">${title}</div>` : '';
      const wrappedContent = link ? 
        `<a href="${link}"><img src="${imageUrl}" alt="${title || 'صورة'}" onerror="this.src='/gomla/assets/images/no-image.png'">${captionHtml}</a>` :
        `<img src="${imageUrl}" alt="${title || 'صورة'}" onerror="this.src='/gomla/assets/images/no-image.png'">${captionHtml}`;
      
      slidesHtml += `
        <div class="slider-item">
          ${wrappedContent}
        </div>
      `;
      
      dotsHtml += `<span class="dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></span>`;
      index++;
    });
    
    slidesCount = index;
    track.innerHTML = slidesHtml;
    
    if (dots) {
      dots.innerHTML = dotsHtml;
    }
    
    // بدء التشغيل التلقائي
    startAutoSlide();
    
  } catch (error) {
    console.error('Error loading slider:', error);
    track.innerHTML = `
      <div class="slider-item">
        <div class="slide-placeholder" style="color:var(--danger);">
          <i class="fas fa-exclamation-triangle"></i>
          حدث خطأ في تحميل السلايدر
        </div>
      </div>
    `;
  }
}

function startAutoSlide() {
  if (slideInterval) clearInterval(slideInterval);
  if (slidesCount <= 1) return;
  
  slideInterval = setInterval(() => {
    slideNext();
  }, 5000);
}

function slideNext() {
  if (slidesCount <= 1) return;
  slideIndex = (slideIndex + 1) % slidesCount;
  updateSlider();
}

function slidePrev() {
  if (slidesCount <= 1) return;
  slideIndex = (slideIndex - 1 + slidesCount) % slidesCount;
  updateSlider();
}

function goToSlide(index) {
  slideIndex = index;
  updateSlider();
  startAutoSlide();
}

function updateSlider() {
  const track = document.getElementById('sliderTrack');
  const dots = document.querySelectorAll('.slider-dots .dot');
  if (!track) return;
  
  // RTL: نقلب الاتجاه
  track.style.transform = `translateX(${slideIndex * 100}%)`;
  
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === slideIndex);
  });
}

// ============================================================
// 2️⃣ أحدث المنتجات
// ============================================================

async function loadLatestProducts() {
  const container = document.getElementById('latestProducts');
  if (!container) return;
  
  try {
    const snapshot = await db.collection(COLLECTIONS.PRODUCTS)
      .where('available', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();
    
    renderHomeProducts(container, snapshot, 'لا توجد منتجات حالياً');
    
  } catch (error) {
    console.error('Error loading latest products:', error);
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>حدث خطأ في تحميل المنتجات</p>
      </div>
    `;
  }
}

// ============================================================
// 3️⃣ أحدث العروض
// ============================================================

async function loadLatestOffers() {
  const container = document.getElementById('latestOffers');
  if (!container) return;
  
  try {
    const snapshot = await db.collection(COLLECTIONS.PRODUCTS)
      .where('available', '==', true)
      .where('hasOffer', '==', true)
      .orderBy('updatedAt', 'desc')
      .limit(10)
      .get();
    
    if (snapshot.empty) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-gift"></i>
          <p>لا توجد عروض حالياً</p>
          <p style="font-size:0.85rem;">ترقب عروضنا القادمة!</p>
        </div>
      `;
      return;
    }
    
    renderHomeOfferProducts(container, snapshot);
    
  } catch (error) {
    console.error('Error loading latest offers:', error);
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>حدث خطأ في تحميل العروض</p>
      </div>
    `;
  }
}

// ============================================================
// 4️⃣ المنتجات الأكثر طلباً
// ============================================================

async function loadPopularProducts() {
  const container = document.getElementById('popularProducts');
  if (!container) return;
  
  try {
    const snapshot = await db.collection(COLLECTIONS.PRODUCTS)
      .where('available', '==', true)
      .orderBy('salesCount', 'desc')
      .limit(10)
      .get();
    
    renderHomeProducts(container, snapshot, 'لا توجد منتجات حالياً');
    
  } catch (error) {
    console.error('Error loading popular products:', error);
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>حدث خطأ في تحميل المنتجات</p>
      </div>
    `;
  }
}

// ============================================================
// 5️⃣ عرض المنتجات (موحد)
// ============================================================

function renderHomeProducts(container, snapshot, emptyMessage = 'لا توجد منتجات') {
  if (snapshot.empty) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-box-open"></i>
        <p>${emptyMessage}</p>
      </div>
    `;
    return;
  }
  
  const user = getCurrentUser();
  const role = user ? user.data.role : ROLES.GUEST;
  const isWholesale = role === ROLES.WHOLESALE || role === ROLES.ADMIN || role === ROLES.SUPER;
  
  let html = '';
  
  snapshot.forEach(doc => {
    const product = { id: doc.id, ...doc.data() };
    const price = isWholesale ? 
      (product.wholesalePrice || 0) : 
      (product.retailPrice || 0);
    const unit = isWholesale ? 
      (product.unit || 'كرتونة') : 
      'قطعة';
    const brandName = product.brandName || '';
    const isAvailable = product.available !== false && (product.stockQuantity || 0) > 0;
    
    html += `
      <div class="product-card" onclick="openProductDetails('${product.id}')">
        <img src="${product.imageUrl || '/gomla/assets/images/no-image.png'}" 
             alt="${product.name}" 
             class="product-image"
             loading="lazy"
             onerror="this.src='/gomla/assets/images/no-image.png'">
        <div class="product-body">
          <h4 class="product-name">${product.name}</h4>
          ${brandName ? `<p class="product-brand"><i class="fas fa-tag"></i> ${brandName}</p>` : ''}
          <div class="product-price">
            ${price.toFixed(2)} ج.م 
            <small>/ ${unit}</small>
          </div>
          ${isAvailable ? `
            <button class="btn btn-primary btn-sm" 
                    onclick="event.stopPropagation();handleHomeAddToCart('${product.id}')">
              <i class="fas fa-cart-plus"></i> أضف للسلة
            </button>
          ` : `
            <div class="out-of-stock">
              <i class="fas fa-times-circle"></i> غير متوفر
            </div>
          `}
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function renderHomeOfferProducts(container, snapshot) {
  const user = getCurrentUser();
  const role = user ? user.data.role : ROLES.GUEST;
  const isWholesale = role === ROLES.WHOLESALE || role === ROLES.ADMIN || role === ROLES.SUPER;
  
  let html = '';
  
  snapshot.forEach(doc => {
    const product = { id: doc.id, ...doc.data() };
    const originalPrice = isWholesale ? 
      (product.wholesalePrice || 0) : 
      (product.retailPrice || 0);
    const offerPrice = product.offerPrice || originalPrice * 0.8;
    const discountPercent = originalPrice > 0 ? 
      Math.round(((originalPrice - offerPrice) / originalPrice) * 100) : 0;
    const unit = isWholesale ? (product.unit || 'كرتونة') : 'قطعة';
    const isAvailable = product.available !== false && (product.stockQuantity || 0) > 0;
    
    html += `
      <div class="product-card offer-card" onclick="openProductDetails('${product.id}')">
        <div class="discount-badge">
          <i class="fas fa-percent"></i> ${discountPercent}%
        </div>
        <img src="${product.imageUrl || '/gomla/assets/images/no-image.png'}" 
             alt="${product.name}" 
             class="product-image"
             loading="lazy"
             onerror="this.src='/gomla/assets/images/no-image.png'">
        <div class="product-body">
          <h4 class="product-name">${product.name}</h4>
          <div class="product-price">
            <span class="price-after">${offerPrice.toFixed(2)} ج.م</span>
            <span class="price-before">${originalPrice.toFixed(2)} ج.م</span>
            <small>/ ${unit}</small>
          </div>
          ${isAvailable ? `
            <button class="btn btn-primary btn-sm" 
                    onclick="event.stopPropagation();handleHomeAddToCart('${product.id}')">
              <i class="fas fa-cart-plus"></i> أضف للسلة
            </button>
          ` : `
            <div class="out-of-stock">
              <i class="fas fa-times-circle"></i> غير متوفر
            </div>
          `}
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

async function handleHomeAddToCart(productId) {
  try {
    await addToCart(productId, 1);
  } catch (error) {
    console.error('Error adding to cart:', error);
    showToast('❌ حدث خطأ', 'error');
  }
}

function openProductDetails(productId) {
  window.location.href = `/gomla/product-details.html?id=${productId}`;
}

// ============================================================
// 6️⃣ السيكشنات المخصصة (من لوحة التحكم)
// ============================================================

async function loadCustomSections() {
  const container = document.getElementById('custom-sections-container');
  if (!container) return;
  
  try {
    const snapshot = await db.collection('custom_sections')
      .where('active', '==', true)
      .orderBy('order', 'asc')
      .get();
    
    if (snapshot.empty) return;
    
    let html = '';
    
    for (const doc of snapshot.docs) {
      const section = { id: doc.id, ...doc.data() };
      html += await renderCustomSection(section);
    }
    
    container.innerHTML = html;
    
  } catch (error) {
    console.error('Error loading custom sections:', error);
    // لا نعرض خطأ للمستخدم - السيكشنات المخصصة اختيارية
  }
}

async function renderCustomSection(section) {
  const type = section.type;
  const title = section.title || '';
  
  let contentHtml = '';
  
  try {
    switch (type) {
      case 'banner':
        contentHtml = renderBannerSection(section);
        break;
      case 'products':
        contentHtml = await renderProductsSection(section);
        break;
      case 'cards':
        contentHtml = renderCardsSection(section);
        break;
      case 'videos':
        contentHtml = renderVideosSection(section);
        break;
      case 'images':
        contentHtml = renderImagesSection(section);
        break;
      default:
        return '';
    }
  } catch (error) {
    console.error('Error rendering section:', error);
    return '';
  }
  
  return `
    <section class="home-section custom-section" data-section-id="${section.id}">
      ${title ? `
        <div class="section-header">
          <h2 class="section-title">
            <i class="fas ${section.icon || 'fa-star'}"></i>
            ${title}
          </h2>
        </div>
      ` : ''}
      ${contentHtml}
    </section>
  `;
}

function renderBannerSection(section) {
  const items = section.items || [];
  if (items.length === 0) return '';
  
  let html = '<div class="banners-grid">';
  items.forEach(item => {
    const link = item.link || '#';
    html += `
      <a href="${link}" class="banner-item">
        <img src="${item.imageUrl}" 
             alt="${item.title || 'إعلان'}"
             loading="lazy"
             onerror="this.src='/gomla/assets/images/no-image.png'">
        ${item.title ? `<div class="banner-title">${item.title}</div>` : ''}
      </a>
    `;
  });
  html += '</div>';
  
  return html;
}

async function renderProductsSection(section) {
  const productIds = section.productIds || [];
  if (productIds.length === 0) return '';
  
  try {
    const products = [];
    for (const id of productIds) {
      const doc = await db.collection(COLLECTIONS.PRODUCTS).doc(id).get();
      if (doc.exists) {
        products.push({ id: doc.id, ...doc.data() });
      }
    }
    
    if (products.length === 0) return '';
    
    const user = getCurrentUser();
    const role = user ? user.data.role : ROLES.GUEST;
    const isWholesale = role === ROLES.WHOLESALE || role === ROLES.ADMIN || role === ROLES.SUPER;
    
    let html = '<div class="horizontal-scroll">';
    
    products.forEach(product => {
      if (!product.available) return;
      
      const price = isWholesale ? 
        (product.wholesalePrice || 0) : 
        (product.retailPrice || 0);
      const unit = isWholesale ? (product.unit || 'كرتونة') : 'قطعة';
      
      html += `
        <div class="product-card" onclick="openProductDetails('${product.id}')">
          <img src="${product.imageUrl || '/gomla/assets/images/no-image.png'}" 
               alt="${product.name}" 
               class="product-image"
               loading="lazy"
               onerror="this.src='/gomla/assets/images/no-image.png'">
          <div class="product-body">
            <h4 class="product-name">${product.name}</h4>
            <div class="product-price">
              ${price.toFixed(2)} ج.م 
              <small>/ ${unit}</small>
            </div>
            <button class="btn btn-primary btn-sm" 
                    onclick="event.stopPropagation();handleHomeAddToCart('${product.id}')">
              <i class="fas fa-cart-plus"></i> أضف للسلة
            </button>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    return html;
    
  } catch (error) {
    console.error('Error rendering products section:', error);
    return '';
  }
}

function renderCardsSection(section) {
  const items = section.items || [];
  if (items.length === 0) return '';
  
  let html = '<div class="custom-cards-grid">';
  items.forEach(item => {
    html += `
      <a href="${item.link || '#'}" class="custom-card">
        ${item.imageUrl ? `
          <div class="custom-card-image">
            <img src="${item.imageUrl}" 
                 alt="${item.title || ''}"
                 loading="lazy"
                 onerror="this.src='/gomla/assets/images/no-image.png'">
          </div>
        ` : `
          <div class="custom-card-icon">
            <i class="fas ${item.icon || 'fa-star'}"></i>
          </div>
        `}
        <div class="custom-card-body">
          <div class="custom-card-title">${item.title || ''}</div>
          ${item.description ? `<div class="custom-card-desc">${item.description}</div>` : ''}
        </div>
      </a>
    `;
  });
  html += '</div>';
  
  return html;
}

function renderVideosSection(section) {
  const items = section.items || [];
  if (items.length === 0) return '';
  
  let html = '<div class="videos-grid">';
  items.forEach(item => {
    const videoUrl = item.videoUrl || '';
    let embedUrl = videoUrl;
    
    // تحويل روابط يوتيوب العادية لـ embed
    if (videoUrl.includes('youtube.com/watch')) {
      const videoId = new URL(videoUrl).searchParams.get('v');
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    
    html += `
      <div class="video-item">
        <div class="video-wrapper">
          <iframe src="${embedUrl}" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen
                  loading="lazy">
          </iframe>
        </div>
        ${item.title ? `<div class="video-title">${item.title}</div>` : ''}
      </div>
    `;
  });
  html += '</div>';
  
  return html;
}

function renderImagesSection(section) {
  const items = section.items || [];
  if (items.length === 0) return '';
  
  let html = '<div class="images-gallery">';
  items.forEach(item => {
    html += `
      <div class="image-item" onclick="openImageModal('${item.imageUrl}')">
        <img src="${item.imageUrl}" 
             alt="${item.title || ''}"
             loading="lazy"
             onerror="this.src='/gomla/assets/images/no-image.png'">
        ${item.title ? `<div class="image-caption">${item.title}</div>` : ''}
      </div>
    `;
  });
  html += '</div>';
  
  return html;
}

function openImageModal(imageUrl) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.style.cssText = 'display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
  modal.innerHTML = `
    <img src="${imageUrl}" style="max-width:90%;max-height:90%;border-radius:12px;box-shadow:0 8px 40px rgba(0,0,0,0.5);">
  `;
  modal.onclick = () => modal.remove();
  document.body.appendChild(modal);
}

// ============================================================
// 7️⃣ نبذة عن الشركة
// ============================================================

async function loadAboutSection() {
  const titleEl = document.getElementById('aboutTitle');
  const contentEl = document.getElementById('aboutContent');
  if (!contentEl) return;
  
  try {
    const doc = await db.collection('site_content').doc('about').get();
    
    if (!doc.exists) {
      // محتوى افتراضي
      if (titleEl) titleEl.textContent = 'نبذة عن أولاد شعلان';
      contentEl.innerHTML = `
        <p>
          مؤسسة <strong>أولاد شعلان للمنظفات والورقيات</strong> من أعرق المؤسسات في مجال تجارة المنظفات والورقيات 
          بالجملة والقطاعي في محافظة الغربية. نتميز بتقديم منتجات أصلية عالية الجودة، وأسعار تنافسية، 
          وخدمة عملاء استثنائية منذ أكثر من 10 سنوات.
        </p>
        <p style="margin-top:12px;">
          نعمل على تطوير خدماتنا باستمرار لنلبي احتياجات عملائنا الكرام من التجار والعملاء، 
          ونسعى لبناء شراكات دائمة تقوم على الثقة والمصداقية.
        </p>
      `;
      return;
    }
    
    const data = doc.data();
    if (titleEl && data.title) {
      titleEl.textContent = data.title;
    }
    
    contentEl.innerHTML = data.content || '<p>لا توجد معلومات حالياً</p>';
    
  } catch (error) {
    console.error('Error loading about:', error);
    contentEl.innerHTML = `<p>حدث خطأ في تحميل المعلومات</p>`;
  }
}

// ============================================================
// 8️⃣ دوال مساعدة
// ============================================================

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const offset = 80;
    const top = section.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function scrollToLatest() {
  scrollToSection('latest-products-section');
}

function scrollToCategories() {
  // البحث عن أول سيكشن تصنيفات في الصفحة
  const catSection = document.querySelector('.categories-section') || 
                     document.getElementById('custom-sections-container');
  if (catSection) {
    catSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    showToast('⚠️ لا توجد أقسام حالياً', 'info');
  }
}

// ============================================================
// 🚀 تشغيل الصفحة
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  // تحميل كل الأجزاء
  loadSlider();
  loadLatestProducts();
  loadLatestOffers();
  loadPopularProducts();
  loadCustomSections();
  loadAboutSection();
  
  console.log('✅ public.js v6.0 loaded successfully');
});

// ============================================================
// 🌐 تصدير الدوال عالمياً
// ============================================================

window.loadSlider = loadSlider;
window.slideNext = slideNext;
window.slidePrev = slidePrev;
window.goToSlide = goToSlide;
window.loadLatestProducts = loadLatestProducts;
window.loadLatestOffers = loadLatestOffers;
window.loadPopularProducts = loadPopularProducts;
window.loadCustomSections = loadCustomSections;
window.loadAboutSection = loadAboutSection;
window.openProductDetails = openProductDetails;
window.handleHomeAddToCart = handleHomeAddToCart;
window.openImageModal = openImageModal;
window.scrollToSection = scrollToSection;
window.scrollToLatest = scrollToLatest;
window.scrollToCategories = scrollToCategories;