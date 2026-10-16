/* ============================================================
   📦 Invoice Storage — Backblaze B2 via Cloudflare Worker
   Version: 1.0  |  2026-10-16
   ============================================================ */

(function (window) {
  'use strict';

  const WORKER_URL = 'https://awlad-shalaan-invoice-worker.awladsh3laan.workers.dev';
  const FRONTEND_TOKEN = 'Famo_ElwaN_26_Awladsh3laanXwebsiteX7qLzvfghjkAlu'; //نفس قيمة وركر  

  // ============ أدوات مساعدة ============
  function safeKey(orderNo, customerName) {
    const safeCustomer = String(customerName || 'unknown')
      .replace(/[^\w\u0600-\u06FF]+/g, '_')
      .slice(0, 40);
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const safeOrderNo = String(orderNo || 'inv').replace(/[^\w-]+/g, '_');
    return `invoices/${year}/${month}/${safeOrderNo}_${safeCustomer}_${Date.now()}.pdf`;
  }

  async function workerFetch(path, body) {
    const res = await fetch(WORKER_URL + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frontend-Token': FRONTEND_TOKEN,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
  }

  // ============ رفع PDF إلى Backblaze B2 ============
  /**
   * @param {Blob} blob - ملف PDF
   * @param {string} orderNo - رقم الطلب
   * @param {string} customerName - اسم العميل
   * @returns {Promise<{ok, key, size, uploadedAt}>}
   */
  async function uploadPdf(blob, orderNo, customerName) {
    if (!(blob instanceof Blob)) throw new Error('blob required');

    const key = safeKey(orderNo, customerName);

    // 1) اطلب رابط الرفع المؤقت
    const { uploadUrl } = await workerFetch('/sign-upload', {
      key,
      expiresIn: 600, // 10 دقائق
    });

    // 2) ارفع الملف مباشرة على B2
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/pdf' },
      body: blob,
    });

    if (!uploadRes.ok) {
      const text = await uploadRes.text().catch(() => '');
      throw new Error(`Upload failed: HTTP ${uploadRes.status} ${text.slice(0, 200)}`);
    }

    return {
      ok: true,
      key,                          // ← خزّن هذا في Firestore
      size: blob.size,
      uploadedAt: Date.now(),
    };
  }

  // ============ الحصول على رابط عرض مؤقت ============
  /**
   * @param {string} key - مفتاح الملف في B2 (من Firestore)
   * @param {number} expiresIn - مدة الصلاحية بالثواني (افتراضي: ساعة)
   * @returns {Promise<{ok, viewUrl, expiresIn}>}
   */
  async function getViewUrl(key, expiresIn) {
    if (!key) throw new Error('key required');
    return await workerFetch('/sign-view', {
      key,
      expiresIn: expiresIn || 3600,
    });
  }

  // ============ فتح الفاتورة في تاب جديد ============
  async function openInvoice(key, expiresIn) {
    try {
      const { viewUrl } = await getViewUrl(key, expiresIn || 3600);
      window.open(viewUrl, '_blank', 'noopener,noreferrer');
      return true;
    } catch (err) {
      console.error('openInvoice error:', err);
      if (typeof showToast === 'function') showToast('فشل فتح الفاتورة: ' + err.message, 'error');
      return false;
    }
  }

  // ============ تنزيل الفاتورة محلياً ============
  async function downloadInvoice(key, filename) {
    try {
      const { viewUrl } = await getViewUrl(key, 300);
      const a = document.createElement('a');
      a.href = viewUrl;
      a.download = filename || 'invoice.pdf';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();
      return true;
    } catch (err) {
      console.error('downloadInvoice error:', err);
      return false;
    }
  }

  // ============ حذف الفاتورة (احتياطي) ============
  async function deleteInvoice(key) {
    if (!key) throw new Error('key required');
    return await workerFetch('/delete', { key });
  }

  // ============ API عام ============
  window.InvoiceStorage = {
    WORKER_URL,
    uploadPdf,
    getViewUrl,
    openInvoice,
    downloadInvoice,
    deleteInvoice,
    safeKey,
  };
})(window);