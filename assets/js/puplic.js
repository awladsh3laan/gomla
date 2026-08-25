// ============================================
// 🌐 وظائف الصفحات العامة - أولاد شعلان جملة
// ============================================

// ===== متغيرات عامة =====
let allProducts = [];
let allCategories = [];
let allBrands = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ============================================
// 📦 تحميل التصنيفات
// ============================================

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
      document.getElementById('total-categories').textContent = snapshot.size;
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

// ============================================
// 📦 تحميل البراندات
// ============================================

function loadBrands() {
  db.collection('brands')
    .orderBy('name')
    .get()
    .then((snapshot) => {
      document.getElementById('total-brands').textContent = snapshot.size;
    })
    .catch((error) => {
      console.error('Error loading brands:', error);
    });
}

// ============================================
// 📦 تحميل المنتجات (أحدث المنتجات)
// ============================================

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
      // تحديث عدد المنتجات
      document.getElementById('total-products').textContent = snapshot.size;

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
                 class="product-image"
                 onerror="this.src='assets/images/no-image.png'">
            <div class="product-info">
              <h4 class="product-name">${product.name}</h4>
              <p class="product-brand">${brandName}</p>
              <div class="product-price">${priceText}</div>
              <button class="btn btn-primary btn-sm w-full mt-2" onclick="event.stopPropagation();addToCart('${product.id}')">
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

// ============================================
// 🛒 السلة
// ============================================

function addToCart(productId) {
  const customerData = localStorage.getItem('customer');
  if (!customerData) {
    showToast('⚠️ يرجى تسجيل الدخول أولاً باستخدام الكود الخاص بك', 'warning');
    return;
  }

  db.collection('products').doc(productId).get()
    .then((doc) => {
      if (!doc.exists) {
        showToast('❌ المنتج غير موجود', 'error');
        return;
      }

      const product = { id: doc.id, ...doc.data() };
      const existingItem = cart.find(item => item.id === productId);

      if (existingItem) {
        if (product.maxOrder && existingItem.quantity >= product.maxOrder) {
          showToast(`⚠️ الحد الأقصى لهذا المنتج هو ${product.maxOrder}`, 'warning');
          return;
        }
        existingItem.quantity++;
      } else {
        if (product.minOrder && 1 < product.minOrder) {
          showToast(`⚠️ الحد الأدنى لهذا المنتج هو ${product.minOrder}`, 'warning');
          return;
        }
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price || 0,
          imageUrl: product.imageUrl || '',
          quantity: 1,
          maxOrder: product.maxOrder || 999,
          minOrder: product.minOrder || 1
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartBadge();
      openCart();
      showToast(`✅ تم إضافة ${product.name} للسلة`, 'success');
    })
    .catch((error) => {
      console.error('Error adding to cart:', error);
      showToast('❌ حدث خطأ', 'error');
    });
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (badge) {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = total;
  }
}

function openCart() {
  document.getElementById('cart-sidebar').classList.add('open');
  renderCartItems();
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('open');
}

function renderCartItems() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-10 text-gray-400">
        <i class="fas fa-cart-plus text-4xl"></i>
        <p class="mt-2">سلتك فارغة</p>
      </div>
    `;
    document.getElementById('cart-total-price').textContent = '0 ج.م';
    return;
  }

  let html = '';
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    html += `
      <div class="cart-item">
        <img src="${item.imageUrl || 'assets/images/no-image.png'}" alt="${item.name}" onerror="this.src='assets/images/no-image.png'">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${item.price} ج.م</div>
          <div class="flex items-center gap-2 mt-1">
            <button class="w-8 h-8 rounded-full border border-gray-200 hover:bg-yellow-500 hover:text-white transition" onclick="updateCartQuantity(${index}, -1)">
              <i class="fas fa-minus text-sm"></i>
            </button>
            <span class="font-bold">${item.quantity}</span>
            <button class="w-8 h-8 rounded-full border border-gray-200 hover:bg-yellow-500 hover:text-white transition" onclick="updateCartQuantity(${index}, 1)">
              <i class="fas fa-plus text-sm"></i>
            </button>
            <button class="w-8 h-8 rounded-full border border-red-200 hover:bg-red-500 hover:text-white transition" onclick="removeFromCart(${index})">
              <i class="fas fa-trash text-sm text-red-500 hover:text-white"></i>
            </button>
          </div>
        </div>
        <div class="font-bold text-yellow-500">${itemTotal} ج.م</div>
      </div>
    `;
  });

  container.innerHTML = html;
  document.getElementById('cart-total-price').textContent = `${total} ج.م`;
}

function updateCartQuantity(index, delta) {
  const item = cart[index];
  if (!item) return;

  const newQty = item.quantity + delta;
  if (newQty < item.minOrder) {
    showToast(`⚠️ الحد الأدنى ${item.minOrder}`, 'warning');
    return;
  }
  if (newQty > item.maxOrder) {
    showToast(`⚠️ الحد الأقصى ${item.maxOrder}`, 'warning');
    return;
  }
  if (newQty <= 0) {
    removeFromCart(index);
    return;
  }

  item.quantity = newQty;
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCartItems();
  updateCartBadge();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCartItems();
  updateCartBadge();
}

// ============================================
# ✅ إتمام الطلب
# ============================================

function checkout() {
  if (cart.length === 0) {
    showToast('⚠️ سلتك فارغة', 'warning');
    return;
  }

  const customerData = localStorage.getItem('customer');
  if (!customerData) {
    showToast('⚠️ يرجى تسجيل الدخول أولاً', 'warning');
    return;
  }

  const customer = JSON.parse(customerData);
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const orderData = {
    customerId: customer.id,
    customerName: customer.name,
    customerCode: customer.code,
    items: cart.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity
    })),
    total: total,
    status: 'pending',
    trackingCode: `ORD-${Date.now().toString().slice(-6)}`,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  db.collection('orders').add(orderData)
    .then(() => {
      cart = [];
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartBadge();
      closeCart();
      showToast('✅ تم إنشاء طلبك بنجاح!', 'success');
    })
    .catch((error) => {
      console.error('Error creating order:', error);
      showToast('❌ حدث خطأ', 'error');
    });
}

// ============================================
# 🚀 تشغيل الصفحة
# ============================================

document.addEventListener('DOMContentLoaded', function() {
  loadCategories();
  loadBrands();
  loadProducts();
  updateCartBadge();

  // ربط حدث Enter في حقل الكود
  const codeInput = document.getElementById('customer-code-input');
  if (codeInput) {
    codeInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        loginWithCode();
      }
    });
  }
});

// ============================================
# 📤 تصدير الدوال
# ============================================

window.loadCategories = loadCategories;
window.loadBrands = loadBrands;
window.loadProducts = loadProducts;
window.addToCart = addToCart;
window.updateCartBadge = updateCartBadge;
window.openCart = openCart;
window.closeCart = closeCart;
window.renderCartItems = renderCartItems;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.loginWithCode = loginWithCode;

// ============================================
// 🌐 وظائف الصفحات العامة - أولاد شعلان جملة
// ============================================

// ===== تحميل المقولات العامة للصفحة الرئيسية =====
function loadQuotes() {
  const container = document.getElementById('quotes-container');
  if (!container) return;

  db.collection('quotes')
    .where('type', '==', 'general')
    .where('active', '==', true)
    .orderBy('order')
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        container.innerHTML = `
          <div class="quote-text">
            "مرحباً بك في متجر أولاد شعلان جملة، حيث الجودة والثقة"
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

      // تغيير المقولة كل 5 ثواني
      setInterval(() => {
        index = (index + 1) % quotes.length;
        const textEl = container.querySelector('.quote-text');
        textEl.style.opacity = '0';
        setTimeout(() => {
          textEl.textContent = `"${quotes[index]}"`;
          textEl.style.opacity = '1';
        }, 300);
      }, 5000);
    })
    .catch(() => {
      container.innerHTML = `
        <div class="quote-text">
          "مرحباً بك في متجر أولاد شعلان جملة، حيث الجودة والثقة"
        </div>
      `;
    });
}

// ===== تحميل آخر الأخبار العامة للصفحة الرئيسية =====
function loadLatestNews() {
  const container = document.getElementById('news-container');
  if (!container) return;

  db.collection('news')
    .where('type', '==', 'general')
    .where('active', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(4)
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

// ===== تشغيل الدوال عند تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
  loadQuotes();
  loadLatestNews();
  // باقي الدوال زي loadCategories, loadProducts, إلخ...
});