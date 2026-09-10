// ==========================================================
// ⚙️ SUPABASE CONFIGURATION
// กำหนด SUPABASE_URL และ SUPABASE_ANON_KEY ที่นี่
// ==========================================================

const SUPABASE_URL = 'https://zyayxpxbttcoosbsxtob.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_unmuJ-VphBMQRFd85FCtvw_iuKOdQxY';

// สร้าง Supabase Client โดยใช้ชื่อตัวแปร sbClient เพื่อไม่ให้ทับกับ Library หลัก (window.supabase)
let sbClient = null;
try {
  if (typeof supabase !== 'undefined' && SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('YOUR_SUPABASE_PROJECT_ID')) {
    sbClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.warn('Supabase client initialization warning:', e);
}
