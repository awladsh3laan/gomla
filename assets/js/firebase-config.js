// ============================================
// 🔥 إعدادات Firebase
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyCdU3HadKWtzKtTAO9x7mcVPq6eodTqPzA",
  authDomain: "awlad-shalaan-wholesale.firebaseapp.com",
  projectId: "awlad-shalaan-wholesale",
  storageBucket: "awlad-shalaan-wholesale.firebasestorage.app",
  messagingSenderId: "390602001768",
  appId: "1:390602001768:web:05ec185f34ff0b5f7c1add"
};

// ===== المفاتيح =====
const IMGBB_API_KEY = "99506f7c2987acaf6709c7fb0e978298";
const GEMINI_API_KEY = "AQ.Ab8RN6J_44fbv2fdP2YWWxwq0aNnG7DXJnSv3O8whicffxAj_g";
const WHATSAPP_NUMBER = "01120282953";

// ===== تهيئة Firebase =====
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

// تفعيل وضع العمل دون اتصال
db.enablePersistence({ synchronizeTabs: true })
  .catch(err => console.warn('⚠️ Offline persistence error:', err.code));

// تصدير المتغيرات
window.db = db;
window.auth = auth;
window.IMGBB_API_KEY = IMGBB_API_KEY;
window.GEMINI_API_KEY = GEMINI_API_KEY;
window.WHATSAPP_NUMBER = WHATSAPP_NUMBER;

console.log('✅ Firebase initialized successfully!');