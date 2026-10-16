/* ============================================================
   🖨️ نظام الطباعة الموحد — أولاد شعلان للمنظفات والورقيات
   Version: 1.1  |  2026-10-16
   
   ⚠️ متطلبات التحميل (بهذا الترتيب):
     1. html2canvas
     2. jspdf
     3. invoice-storage.js   ← قبل هذا الملف
     4. invoice-print.js     ← هذا الملف
   
   الاستخدام:
     <script src="../assets/js/invoice-print.js"></script>
     InvoicePrint.preview(order);
     InvoicePrint.print(order);
     InvoicePrint.saveAsPdf(order).then(r => {
        // r.key → خزّنه في Firestore
        // r.blob → ملف محلي
     });
   ============================================================ */

(function (window) {
  'use strict';

  // ============ الثوابت ============
  const LOGO = 'https://i.ibb.co/qYSqbZsZ/Gemini-Generated-Image-ifaydrifaydrifay.jpg';
  const PER_PAGE = 25;

  // ============ أنواع المستخدم ============
  const USER_TYPES = {
    retail_cash:   { key: 'retail_cash',   label: 'عميل نقدي',  shortLabel: 'نقدي', icon: 'fa-user',       badgeClass: 'ut-retail' },
    trader_cash:   { key: 'trader_cash',   label: 'تاجر نقدي',  shortLabel: 'نقدي', icon: 'fa-store',      badgeClass: 'ut-trader-cash' },
    trader_credit: { key: 'trader_credit', label: 'تاجر أجل',   shortLabel: 'أجل',  icon: 'fa-handshake',  badgeClass: 'ut-trader-credit' },
    guest:         { key: 'guest',         label: 'زائر',       shortLabel: 'زائر', icon: 'fa-user-secret',badgeClass: 'ut-guest' },
    customer:      { key: 'customer',      label: 'عميل',       shortLabel: 'عميل', icon: 'fa-user',       badgeClass: 'ut-retail' }
  };

  // ============ أدوات مساعدة ============
  const fmt = n => (Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function formatDate(d) {
    if (!d) return '';
    try {
      if (typeof d === 'string') return d;
      if (d.toDate) return d.toDate().toLocaleDateString('ar-EG');
      if (d instanceof Date) return d.toLocaleDateString('ar-EG');
      if (typeof d === 'number') return new Date(d).toLocaleDateString('ar-EG');
    } catch (e) { /* ignore */ }
    return '';
  }

  // ============ كشف نوع المستخدم ============
  function detectUserType(order) {
    if (!order) return USER_TYPES.customer;
    if (order.isGuest === true) return USER_TYPES.guest;
    if (order.storeType === 'retail') return USER_TYPES.retail_cash;
    if (order.storeType === 'wholesale') {
      const type = order.businessType || order.paymentType || order.payType;
      if (type === 'credit') return USER_TYPES.trader_credit;
      return USER_TYPES.trader_cash;
    }
    return USER_TYPES.customer;
  }

  // ============ تطبيع بيانات الطلب/الفاتورة ============
  function normalizeItem(item) {
    if (!item) return { name: '', qty: 0, unit: '', pack: 1, price: 0 };
    return {
      name: item.productName || item.name || 'منتج',
      qty: Number(item.quantity ?? item.qty ?? 0),
      unit: item.unit || 'قطعة',
      pack: Number(item.pack || 1),
      price: Number(item.price || 0)
    };
  }

  function normalizeOrder(order) {
    const o = order || {};
    const items = (o.items || []).map(normalizeItem);
    const subtotal = Number(o.subtotal) || items.reduce((s, i) => s + i.qty * i.price, 0);
    const shippingCost = Number(o.shippingCost) || 0;
    const discount = Number(o.discount) || 0;
    const total = Number(o.total) || (subtotal + (o.isFreeShipping ? 0 : shippingCost) - discount);

    return {
      id: o.id || '',
      orderNo: o.orderNo || o.invoiceNo || (o.id ? String(o.id).slice(-8).toUpperCase() : '—'),
      customer: o.customerName || o.customer || o.name || 'بدون اسم',
      phone: o.customerPhone || o.phone || '',
      phone2: o.customerPhone2 || '',
      address: o.customerAddress || o.address || '',
      date: formatDate(o.createdAt || o.date),
      deliveryTime: o.deliveryTime || o.deliverySlot || 'خلال مواعيد العمل',
      storeType: o.storeType || 'retail',
      isGuest: o.isGuest === true,
      businessType: o.businessType || o.paymentType || o.payType || 'cash',
      items: items,
      subtotal: subtotal,
      shippingCost: shippingCost,
      isFreeShipping: o.isFreeShipping === true,
      discount: discount,
      total: total,
      paid: Number(o.paid) || 0,
      remaining: Number(o.remaining) || 0,
      notes: o.notes || '',
      deliveryAgentName: o.deliveryAgentName || o.deliveryAgent || '',
      deliveryAgentPhone: o.deliveryAgentPhone || '',
      deliveryVehicle: o.deliveryVehicle || o.vehicle || '',
      deliveryVehicleNumber: o.deliveryVehicleNumber || '',
      status: o.status || 'pending'
    };
  }

  // ============ بناء الهيدر (صفحة 1) ============
  function buildFullHeader(o, userType) {
    return `
      <div class="p-header">
        <div class="p-store">
          <img src="${LOGO}" alt="logo" crossorigin="anonymous">
          <div class="p-store-info">
            <h1>أولاد شعلان للمنظفات والورقيات</h1>
            <p>محمد شعلان / 01068385028</p>
          </div>
        </div>
        <div class="p-title">
          <h2>فاتورة مبيعات</h2>
          <p>رقم الفاتورة: ${esc(o.orderNo)}</p>
          <span class="p-user-badge ${userType.badgeClass}">
            <i class="fas ${userType.icon}"></i> ${userType.label}
          </span>
        </div>
      </div>
    `;
  }

  // ============ بيانات العميل + الطلب ============
  function buildMeta(o) {
    let phoneHtml = esc(o.phone || '—');
    if (o.phone2) phoneHtml += ' / ' + esc(o.phone2);

    return `
      <div class="p-meta">
        <div class="p-meta-card">
          <p><strong>العميل / المحل:</strong> ${esc(o.customer)}</p>
          <p><strong>رقم الهاتف:</strong> ${phoneHtml}</p>
          <p><strong>العنوان:</strong> ${esc(o.address || '—')}</p>
        </div>
        <div class="p-meta-card">
          <p><strong>تاريخ الطلب:</strong> ${esc(o.date || '—')}</p>
          <p><strong>وقت التوصيل:</strong> ${esc(o.deliveryTime)}</p>
          <p><strong>نوع المتجر:</strong> ${o.storeType === 'wholesale' ? 'جملة' : 'قطاعي'}</p>
        </div>
      </div>
    `;
  }

  // ============ صندوق المندوب (يظهر لو موجود) ============
  function buildAgentBox(o) {
    if (!o.deliveryAgentName) return '';

    let vehicleHtml = '';
    if (o.deliveryVehicle) {
      vehicleHtml = `<p><strong>المركبة:</strong> ${esc(o.deliveryVehicle)}`;
      if (o.deliveryVehicleNumber) vehicleHtml += ` — ${esc(o.deliveryVehicleNumber)}`;
      vehicleHtml += `</p>`;
    }

    return `
      <div class="p-agent">
        <div class="p-agent-title"><i class="fas fa-truck"></i> بيانات التسليم</div>
        <p><strong>المندوب:</strong> ${esc(o.deliveryAgentName)}</p>
        ${o.deliveryAgentPhone ? `<p><strong>هاتف المندوب:</strong> ${esc(o.deliveryAgentPhone)}</p>` : ''}
        ${vehicleHtml}
      </div>
    `;
  }

  // ============ صندوق طريقة الدفع ============
  function buildPayBox(o, userType) {
    const isCredit = userType.key === 'trader_credit';
    const payLabel = isCredit ? 'أجل (يُسدد لاحقاً)' : 'نقداً (الدفع عند الاستلام)';
    const grand = o.total;

    let extras = '';
    if (isCredit && (o.paid > 0 || o.remaining > 0)) {
      extras = ` — مدفوع: ${fmt(o.paid)} ج م — متبقي: ${fmt(o.remaining || grand)} ج م`;
    }

    return `
      <div class="p-pay">
        <span class="p-pay-label">طريقة الدفع:</span>
        <span class="p-pay-badge ${isCredit ? 'inst' : ''}">
          ${payLabel} (الصافي: ${fmt(grand)} ج م${extras})
        </span>
      </div>
    `;
  }

  // ============ هيدر الصفحات التالية ============
  function buildContHeader(o, pageNum, totalPages) {
    return `
      <div class="p-continue">
        <span>تكملة فاتورة: ${esc(o.customer)} — رقم ${esc(o.orderNo)}</span>
        <span class="pg">صفحة ${pageNum} من ${totalPages}</span>
      </div>
    `;
  }

  // ============ جدول المنتجات ============
  function buildTable(items, startIndex) {
    const rows = items.map((it, i) => `
      <tr>
        <td>${startIndex + i + 1}</td>
        <td class="name-cell">${esc(it.name)}</td>
        <td>${it.qty}</td>
        <td>${esc(it.unit)}</td>
        <td>${it.pack}</td>
        <td>${fmt(it.price)}</td>
        <td style="font-weight:700;">${fmt(it.qty * it.price)}</td>
      </tr>
    `).join('');

    return `
      <table class="p-table">
        <thead>
          <tr>
            <th style="width:5%;">م</th>
            <th style="width:39%;">اسم المنتج</th>
            <th style="width:10%;">الكمية</th>
            <th style="width:12%;">الوحدة</th>
            <th style="width:11%;">القطع/الوحدة</th>
            <th style="width:11%;">السعر (ج م)</th>
            <th style="width:12%;">الإجمالي</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  // ============ الإجماليات (آخر صفحة) ============
  function buildTotals(o) {
    const totalQty = o.items.reduce((s, i) => s + i.qty, 0);
    const shipDisplay = o.isFreeShipping ? 'مجاني' : fmt(o.shippingCost) + ' ج م';

    return `
      <div class="p-footer-block">
        <div class="p-totals-container">
          <table class="p-totals">
            <tr><td>إجمالي عدد القطع/الكمية:</td><td class="val">${totalQty}</td></tr>
            <tr><td>الإجمالي الأساسي:</td><td class="val">${fmt(o.subtotal)} ج م</td></tr>
            <tr><td>الشحن:</td><td class="val">${shipDisplay}</td></tr>
            ${o.discount > 0 ? `<tr><td>خصم:</td><td class="val">${fmt(o.discount)} ج م</td></tr>` : ''}
            <tr class="grand"><td>الصافي المطلوب تسديده:</td><td class="val">${fmt(o.total)} ج م</td></tr>
          </table>
        </div>
        <div class="p-footer">
          <p>شكراً لتعاملكم مع أولاد شعلان للمنظفات والورقيات</p>
          ${o.notes ? `<p style="margin-top:3px;font-size:10px;color:#555;">ملاحظات: ${esc(o.notes)}</p>` : ''}
        </div>
      </div>
    `;
  }

  // ============ بناء صفحة واحدة ============
  function buildPage(ctx) {
    const { order: o, items, userType, pageNum, totalPages, isFirst, isLast, startIndex } = ctx;

    const headerBlock = isFirst
      ? buildFullHeader(o, userType) + buildMeta(o) + buildAgentBox(o) + buildPayBox(o, userType)
      : buildContHeader(o, pageNum, totalPages);

    const tableBlock = buildTable(items, startIndex);
    const totalsBlock = isLast ? buildTotals(o) : '';

    return `
      <div class="print-page">
        ${headerBlock}
        <div class="p-body">${tableBlock}</div>
        ${totalsBlock}
      </div>
    `;
  }

  // ============ بناء كل الصفحات ============
  function buildPages(order, options) {
    const o = normalizeOrder(order);
    const userType = detectUserType(o);
    const items = o.items.length ? o.items : [{ name: '—', qty: 0, unit: '', pack: 1, price: 0 }];
    const pages = Math.max(1, Math.ceil(items.length / PER_PAGE));

    let html = '';
    for (let i = 0; i < pages; i++) {
      html += buildPage({
        order: o,
        items: items.slice(i * PER_PAGE, (i + 1) * PER_PAGE),
        userType,
        pageNum: i + 1,
        totalPages: pages,
        isFirst: i === 0,
        isLast: i === pages - 1,
        startIndex: i * PER_PAGE,
        options: options || {}
      });
    }
    return html;
  }

  // ============ معاينة ============
  function ensurePreviewOverlay() {
    let overlay = document.getElementById('inv-preview-overlay-global');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'inv-preview-overlay-global';
    overlay.className = 'inv-preview-overlay';
    overlay.innerHTML = `
      <div class="inv-preview-header">
        <button class="btn-close" onclick="InvoicePrint.closePreview()"><i class="fas fa-xmark"></i></button>
        <div class="title" id="inv-preview-title">معاينة الفاتورة</div>
        <button class="btn-share" onclick="InvoicePrint._shareWhatsApp()"><i class="fab fa-whatsapp"></i><span>واتساب</span></button>
        <button class="btn-pdf"   onclick="InvoicePrint._savePdf()"><i class="fas fa-file-pdf"></i><span>PDF</span></button>
        <button class="btn-print" onclick="InvoicePrint._printCurrent()"><i class="fas fa-print"></i><span>طباعة</span></button>
      </div>
      <div class="inv-preview-body" id="inv-preview-body"></div>
    `;
    document.body.appendChild(overlay);

    window.addEventListener('resize', () => _updatePreviewScale());
    return overlay;
  }

  let _currentPreviewOrder = null;
  let _currentPreviewHtml = '';

  function _updatePreviewScale() {
    const body = document.getElementById('inv-preview-body');
    if (!body) return;
    const scaler = body.querySelector('.inv-preview-scaler');
    if (!scaler) return;
    const firstPage = scaler.querySelector('.print-page');
    if (!firstPage) return;
    const pageWidth = firstPage.offsetWidth || 794;
    const available = body.clientWidth - 24;
    const scale = Math.min(1, available / pageWidth);
    scaler.style.zoom = scale;
  }

  function preview(order, options) {
    const o = normalizeOrder(order);
    _currentPreviewOrder = o;
    const html = buildPages(o, options);
    _currentPreviewHtml = html;

    const overlay = ensurePreviewOverlay();
    const body = document.getElementById('inv-preview-body');
    body.innerHTML = `
      <div class="inv-preview-hint">
        <i class="fas fa-circle-info"></i> معاينة مطابقة للطباعة — استخدم الأزرار بالأعلى
      </div>
      <div class="inv-preview-scaler">${html}</div>
    `;
    document.getElementById('inv-preview-title').textContent = `فاتورة ${o.orderNo} — ${o.customer}`;

    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';

    setTimeout(_updatePreviewScale, 150);
  }

  function closePreview() {
    const overlay = document.getElementById('inv-preview-overlay-global');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  // ============ طباعة ============
  function print(order, options) {
    const html = buildPages(order, options);
    let area = document.getElementById('print-area');
    if (!area) {
      area = document.createElement('div');
      area.id = 'print-area';
      document.body.appendChild(area);
    }
    area.innerHTML = html;
    setTimeout(() => window.print(), 150);
  }

  function printAll(orders, options) {
    const html = orders.map(o => buildPages(o, options)).join('');
    let area = document.getElementById('print-area');
    if (!area) {
      area = document.createElement('div');
      area.id = 'print-area';
      document.body.appendChild(area);
    }
    area.innerHTML = html;
    setTimeout(() => window.print(), 200);
  }

  function _printCurrent() {
    if (!_currentPreviewHtml) return;
    let area = document.getElementById('print-area');
    if (!area) {
      area = document.createElement('div');
      area.id = 'print-area';
      document.body.appendChild(area);
    }
    area.innerHTML = _currentPreviewHtml;
    setTimeout(() => window.print(), 120);
  }

  // ============ تحويل الصفحات إلى Canvas ============
  async function _renderPagesToCanvas(htmlString) {
    const temp = document.createElement('div');
    temp.style.cssText = 'position:fixed;left:-99999px;top:0;width:210mm;background:#fff;';
    temp.innerHTML = htmlString;
    document.body.appendChild(temp);

    await new Promise(r => setTimeout(r, 150));

    const pages = temp.querySelectorAll('.print-page');
    const canvases = [];

    for (const page of pages) {
      const canvas = await html2canvas(page, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        windowWidth: page.scrollWidth,
        windowHeight: page.scrollHeight
      });
      canvases.push(canvas);
    }

    document.body.removeChild(temp);
    return canvases;
  }

  // ============ إنشاء PDF Blob ============
  async function generatePdfBlob(order, options) {
    if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
      throw new Error('jsPDF library not loaded. أضف: <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>');
    }
    const html = buildPages(order, options);
    const canvases = await _renderPagesToCanvas(html);

    const { jsPDF } = window.jspdf || { jsPDF: window.jsPDF };
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    canvases.forEach((canvas, i) => {
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    });

    return pdf.output('blob');
  }

  // ============ 🔐 رفع PDF إلى Backblaze B2 عبر Cloudflare Worker ============
  /**
   * ⚠️ يعتمد على window.InvoiceStorage (invoice-storage.js)
   *    لازم يكون محمّل قبل هذا الملف.
   */
  async function uploadPdfToStorage(blob, order) {
    if (typeof window.InvoiceStorage === 'undefined') {
      throw new Error('invoice-storage.js غير محمّل — تأكد من ترتيب <script>');
    }
    return await window.InvoiceStorage.uploadPdf(
      blob,
      order.orderNo,
      order.customer
    );
  }

  // ============ إنشاء PDF + رفعه على B2 ============
  /**
   * @returns {Promise<{key: string, blob: Blob, filename: string, size: number, uploadedAt: number}>}
   */
  async function saveAsPdf(order, options) {
    const o = normalizeOrder(order);
    const safeName = `invoice_${o.orderNo}_${o.customer}`.replace(/[^\w\u0600-\u06FF.-]+/g, '_');

    try {
      showBusy(true, 'جاري إنشاء PDF...');
      const blob = await generatePdfBlob(o, options);

      showBusy(true, 'جاري رفع PDF على الخادم الآمن...');
      const result = await uploadPdfToStorage(blob, o);

      showBusy(false);
      return {
        key: result.key,           // ← خزّنه في Firestore
        blob: blob,                // ← للتنزيل المحلي
        filename: safeName + '.pdf',
        size: result.size,
        uploadedAt: result.uploadedAt
      };
    } catch (err) {
      showBusy(false);
      console.error('PDF save error:', err);
      throw err;
    }
  }

  // ============ شاشة الانتظار ============
  function showBusy(show, text) {
    let el = document.getElementById('inv-busy-overlay');
    if (!show) {
      if (el) el.remove();
      return;
    }
    if (!el) {
      el = document.createElement('div');
      el.id = 'inv-busy-overlay';
      el.style.cssText = `
        position:fixed;inset:0;background:rgba(13,17,23,.85);z-index:99999;
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        color:#fff;font-family:inherit;font-weight:700;gap:14px;font-size:14px;
      `;
      el.innerHTML = `
        <div style="width:50px;height:50px;border:4px solid rgba(255,255,255,.2);
             border-top-color:#c9a84c;border-radius:50%;animation:invspin .9s linear infinite;"></div>
        <div id="inv-busy-text">جاري المعالجة...</div>
        <style>@keyframes invspin{to{transform:rotate(360deg)}}</style>
      `;
      document.body.appendChild(el);
    }
    const t = document.getElementById('inv-busy-text');
    if (t && text) t.textContent = text;
  }

  // ============ حفظ PDF (من زر المعاينة) ============
  async function _savePdf() {
    if (!_currentPreviewOrder) return;
    try {
      const result = await saveAsPdf(_currentPreviewOrder);

      // 1) رسالة نجاح
      if (typeof showToast === 'function') {
        showToast('تم رفع الفاتورة على الخادم الآمن', 'success');
      }

      // 2) تنزيل محلي
      const a = document.createElement('a');
      a.href = URL.createObjectURL(result.blob);
      a.download = result.filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);

      // 3) إطلاق حدث — للصفحة المضيفة تحدّث Firestore
      window.dispatchEvent(new CustomEvent('invoice-uploaded', {
        detail: {
          key: result.key,
          order: _currentPreviewOrder,
          size: result.size,
          uploadedAt: result.uploadedAt
        }
      }));

      console.log('✅ تم رفع الفاتورة. key:', result.key);
    } catch (err) {
      const msg = err && err.message ? err.message : 'خطأ غير معروف';
      if (typeof showToast === 'function') showToast('فشل حفظ PDF: ' + msg, 'error');
      else alert('فشل: ' + msg);
    }
  }

  // ============ مشاركة واتساب ============
  async function _shareWhatsApp() {
    if (!_currentPreviewOrder) return;
    const o = _currentPreviewOrder;
    try {
      showBusy(true, 'جاري تجهيز الصورة...');
      const html = buildPages(o);
      const canvases = await _renderPagesToCanvas(html);
      const canvas = canvases[0]; // أول صفحة
      const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.92));
      showBusy(false);

      const file = new File([blob], `invoice_${o.orderNo}.jpg`, { type: 'image/jpeg' });
      const text = `فاتورة أولاد شعلان\nرقم: ${o.orderNo}\nالعميل: ${o.customer}\nالإجمالي: ${fmt(o.total)} ج.م`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'فاتورة أولاد شعلان', text });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${o.orderNo}.jpg`;
        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(url);
          window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
        }, 400);
      }
    } catch (err) {
      showBusy(false);
      if (err.name !== 'AbortError') {
        if (typeof showToast === 'function') showToast('فشل المشاركة', 'error');
      }
    }
  }

  // ============ API العام ============
  window.InvoicePrint = {
    LOGO,
    PER_PAGE,
    USER_TYPES,
    buildPages,
    preview,
    closePreview,
    print,
    printAll,
    generatePdfBlob,
    uploadPdfToStorage,   // ← جديد (بدل uploadToCloud)
    saveAsPdf,
    detectUserType,
    normalizeOrder,
    _printCurrent,
    _savePdf,
    _shareWhatsApp
  };
})(window);