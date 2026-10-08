// ==========================================================================
// หมอชุมชน BLOOD BANK - COMMUNITY & BLOOD STOCK MODULES
// โรงพยาบาลเขาฉกรรจ์ (Khao Chakan Hospital)
// 1. คลังเลือด & สต็อกเลือด (Blood Inventory & Alert)
// 2. ทะเบียนผู้บริจาคโลหิต (Blood Donors Registry)
// 3. ร้องขอผู้บริจาคโลหิต (Donor Request & Campaign)
// 4. เครือข่ายชุมชน (Community Network)
// ==========================================================================

// Blood groups in this small hospital (Only A+, B+, AB+, O+)
window.HOSPITAL_BLOOD_GROUPS = ['A+', 'B+', 'AB+', 'O+'];

// Minimum Stock default: Only O+ = 2 units, others = 0 (small hospital policy)
window.DEFAULT_MIN_STOCK = { 'O+': 2, 'A+': 0, 'B+': 0, 'AB+': 0 };

function getMinStockConfig() {
  try {
    var saved = localStorage.getItem('HPKC_MIN_STOCK_CONFIG');
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return Object.assign({}, window.DEFAULT_MIN_STOCK);
}

function saveMinStockConfig(cfg) {
  try {
    localStorage.setItem('HPKC_MIN_STOCK_CONFIG', JSON.stringify(cfg));
  } catch(e) {}
}

// Initial Donors Dataset (Amphoe Khao Chakan)
window.INITIAL_DONORS = [
  {
    donor_id: 'DN-000125',
    name: 'นายสมชาย ใจดี',
    blood_group: 'O',
    rh: 'Positive',
    blood_display: 'O+',
    birth_date: '1988-06-15',
    age: 38,
    gender: 'ชาย',
    phone: '081-345-6789',
    email: 'somchai.j@gmail.com',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'เขาฉกรรจ์',
    address: '45 หมู่ 1 ต.เขาฉกรรจ์ อ.เขาฉกรรจ์ จ.สระแก้ว',
    last_donation: '15/06/2569',
    donation_count: 12,
    status: 'ready', // ready (พร้อมติดต่อ), due (ครบกำหนด), unavailable (ติดต่อไม่ได้)
    consent_contact: true,
    consent_news: true,
    channels: ['โทรศัพท์', 'LINE'],
    consent_date: '10/01/2567',
    history: [
      { date: '15/06/2569', place: 'รพ.เขาฉกรรจ์', amount: '450 ml', status: 'สำเร็จ' },
      { date: '12/03/2569', place: 'รพ.สต.เขาฉกรรจ์ (หน่วยเคลื่อนที่)', amount: '450 ml', status: 'สำเร็จ' },
      { date: '05/12/2568', place: 'รพ.เขาฉกรรจ์', amount: '450 ml', status: 'สำเร็จ' }
    ]
  },
  {
    donor_id: 'DN-000126',
    name: 'นางสาวกมลวรรณ สุขใจ',
    blood_group: 'A',
    rh: 'Positive',
    blood_display: 'A+',
    birth_date: '1995-05-12',
    age: 31,
    gender: 'หญิง',
    phone: '089-456-7890',
    email: 'kamonwan@gmail.com',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'เขาฉกรรจ์',
    address: '123 หมู่ 5 ต.เขาฉกรรจ์ อ.เขาฉกรรจ์ จ.สระแก้ว',
    last_donation: '22/03/2569',
    donation_count: 8,
    status: 'due',
    consent_contact: true,
    consent_news: true,
    channels: ['โทรศัพท์', 'LINE'],
    consent_date: '15/01/2567',
    history: [
      { date: '22/03/2569', place: 'รพ.เขาฉกรรจ์', amount: '350 ml', status: 'สำเร็จ' },
      { date: '18/11/2568', place: 'รพ.เขาฉกรรจ์', amount: '350 ml', status: 'สำเร็จ' }
    ]
  },
  {
    donor_id: 'DN-000127',
    name: 'นายวิทยา ศรีสุข',
    blood_group: 'B',
    rh: 'Positive',
    blood_display: 'B+',
    birth_date: '1992-09-20',
    age: 34,
    gender: 'ชาย',
    phone: '082-567-8901',
    email: 'wittaya.s@gmail.com',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'หนองหว้า',
    address: '78 หมู่ 3 ต.หนองหว้า อ.เขาฉกรรจ์ จ.สระแก้ว',
    last_donation: '01/08/2569',
    donation_count: 5,
    status: 'ready',
    consent_contact: true,
    consent_news: true,
    channels: ['โทรศัพท์', 'SMS'],
    consent_date: '02/02/2567',
    history: [
      { date: '01/08/2569', place: 'รพ.เขาฉกรรจ์', amount: '450 ml', status: 'สำเร็จ' }
    ]
  },
  {
    donor_id: 'DN-000128',
    name: 'นางสาวอรทัย พันธ์ดี',
    blood_group: 'AB',
    rh: 'Positive',
    blood_display: 'AB+',
    birth_date: '1998-11-04',
    age: 28,
    gender: 'หญิง',
    phone: '083-678-9012',
    email: 'orathai.p@gmail.com',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'พระเพลิง',
    address: '90 หมู่ 2 ต.พระเพลิง อ.เขาฉกรรจ์ จ.สระแก้ว',
    last_donation: '10/01/2569',
    donation_count: 6,
    status: 'due',
    consent_contact: true,
    consent_news: true,
    channels: ['LINE'],
    consent_date: '20/03/2567',
    history: [
      { date: '10/01/2569', place: 'รพ.เขาฉกรรจ์', amount: '350 ml', status: 'สำเร็จ' }
    ]
  },
  {
    donor_id: 'DN-000129',
    name: 'นายศราวุธ แสงทอง',
    blood_group: 'O',
    rh: 'Positive',
    blood_display: 'O+',
    birth_date: '1985-03-30',
    age: 41,
    gender: 'ชาย',
    phone: '084-789-0123',
    email: 'sarawut.s@gmail.com',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'ไทรเดี่ยว',
    address: '15 หมู่ 4 ต.ไทรเดี่ยว อ.เขาฉกรรจ์ จ.สระแก้ว',
    last_donation: '05/07/2569',
    donation_count: 4,
    status: 'ready',
    consent_contact: true,
    consent_news: false,
    channels: ['โทรศัพท์'],
    consent_date: '05/01/2567',
    history: [
      { date: '05/07/2569', place: 'รพ.สต.บ้านไทรทอง', amount: '450 ml', status: 'สำเร็จ' }
    ]
  },
  {
    donor_id: 'DN-000130',
    name: 'นางสาวปัญญดา จันทร์ใส',
    blood_group: 'A',
    rh: 'Positive',
    blood_display: 'A+',
    birth_date: '2001-08-19',
    age: 25,
    gender: 'หญิง',
    phone: '085-890-1234',
    email: 'panyada.c@gmail.com',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'เขาฉกรรจ์',
    address: '66 หมู่ 7 ต.เขาฉกรรจ์ อ.เขาฉกรรจ์ จ.สระแก้ว',
    last_donation: '14/02/2569',
    donation_count: 3,
    status: 'due',
    consent_contact: true,
    consent_news: true,
    channels: ['โทรศัพท์', 'LINE'],
    consent_date: '14/02/2567',
    history: [
      { date: '14/02/2569', place: 'รพ.เขาฉกรรจ์', amount: '350 ml', status: 'สำเร็จ' }
    ]
  },
  {
    donor_id: 'DN-000131',
    name: 'นายปิยวัฒน์ มั่นคง',
    blood_group: 'B',
    rh: 'Positive',
    blood_display: 'B+',
    birth_date: '1979-12-01',
    age: 47,
    gender: 'ชาย',
    phone: '086-901-2345',
    email: 'piyawat.m@gmail.com',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'หนองหว้า',
    address: '11 หมู่ 6 ต.หนองหว้า อ.เขาฉกรรจ์ จ.สระแก้ว',
    last_donation: '20/08/2568',
    donation_count: 7,
    status: 'unavailable',
    consent_contact: false,
    consent_news: false,
    channels: ['โทรศัพท์'],
    consent_date: '10/05/2566',
    history: [
      { date: '20/08/2568', place: 'รพ.เขาฉกรรจ์', amount: '450 ml', status: 'สำเร็จ' }
    ]
  },
  {
    donor_id: 'DN-000132',
    name: 'นางสาวสุภารัตน์ เมฆวัน',
    blood_group: 'O',
    rh: 'Positive',
    blood_display: 'O+',
    birth_date: '1990-07-22',
    age: 36,
    gender: 'หญิง',
    phone: '087-012-3456',
    email: 'suparat.m@gmail.com',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'พระเพลิง',
    address: '88 หมู่ 5 ต.พระเพลิง อ.เขาฉกรรจ์ จ.สระแก้ว',
    last_donation: '28/05/2569',
    donation_count: 9,
    status: 'ready',
    consent_contact: true,
    consent_news: true,
    channels: ['LINE', 'โทรศัพท์'],
    consent_date: '12/01/2567',
    history: [
      { date: '28/05/2569', place: 'รพ.เขาฉกรรจ์', amount: '450 ml', status: 'สำเร็จ' }
    ]
  },
  {
    donor_id: 'DN-000133',
    name: 'นายจตุภัทร นิลวงศ์',
    blood_group: 'AB',
    rh: 'Positive',
    blood_display: 'AB+',
    birth_date: '1994-04-18',
    age: 32,
    gender: 'ชาย',
    phone: '088-123-4567',
    email: 'jatuphat.n@gmail.com',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'ไทรเดี่ยว',
    address: '32 หมู่ 1 ต.ไทรเดี่ยว อ.เขาฉกรรจ์ จ.สระแก้ว',
    last_donation: '17/09/2568',
    donation_count: 2,
    status: 'due',
    consent_contact: true,
    consent_news: true,
    channels: ['LINE'],
    consent_date: '15/02/2567',
    history: [
      { date: '17/09/2568', place: 'รพ.เขาฉกรรจ์', amount: '450 ml', status: 'สำเร็จ' }
    ]
  },
  {
    donor_id: 'DN-000134',
    name: 'นางสาววิมลสิณี ทองคำ',
    blood_group: 'A',
    rh: 'Positive',
    blood_display: 'A+',
    birth_date: '1996-10-10',
    age: 30,
    gender: 'หญิง',
    phone: '089-234-5678',
    email: 'wimolsinee.t@gmail.com',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'เขาฉกรรจ์',
    address: '55 หมู่ 3 ต.เขาฉกรรจ์ อ.เขาฉกรรจ์ จ.สระแก้ว',
    last_donation: '08/07/2569',
    donation_count: 4,
    status: 'ready',
    consent_contact: true,
    consent_news: true,
    channels: ['โทรศัพท์', 'LINE'],
    consent_date: '08/01/2567',
    history: [
      { date: '08/07/2569', place: 'รพ.เขาฉกรรจ์', amount: '350 ml', status: 'สำเร็จ' }
    ]
  }
];

// Initial Community Networks Dataset (Amphoe Khao Chakan)
window.INITIAL_NETWORKS = [
  {
    net_id: 'NET-001',
    name: 'โรงพยาบาลส่งเสริมสุขภาพตำบลเขาฉกรรจ์',
    type: 'รพ.สต.',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'เขาฉกรรจ์',
    address: '123 หมู่ 3 ต.เขาฉกรรจ์ อ.เขาฉกรรจ์ จ.สระแก้ว 27000',
    coordinator: 'น.ส.กมลชนก ใจดี',
    phone: '081-234-5678',
    email: 'kamonchanok@hpc.go.th',
    status: 'active', // active (เข้าร่วม), pending (รอประสาน), inactive (ยังไม่เข้าร่วม)
    capabilities: ['ประชาสัมพันธ์ในพื้นที่', 'จัดหน่วยรับบริจาคเคลื่อนที่', 'สนับสนุนบุคลากร'],
    history_count: 5,
    note: 'พร้อมเป็นจุดรับบริจาคโลหิตเคลื่อนที่ประจำตำบล'
  },
  {
    net_id: 'NET-002',
    name: 'ชมรม อสม. ต.เขาฉกรรจ์',
    type: 'อสม.',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'เขาฉกรรจ์',
    address: 'ที่ทำการชมรม อสม. ต.เขาฉกรรจ์ อ.เขาฉกรรจ์ จ.สระแก้ว',
    coordinator: 'นายสมชาย พันธ์ดี',
    phone: '089-123-4567',
    email: 'somchai.asm@gmail.com',
    status: 'active',
    capabilities: ['ประชาสัมพันธ์ในพื้นที่', 'จัดหน่วยรับบริจาคเคลื่อนที่'],
    history_count: 8,
    note: 'เครือข่ายแกนนำ อสม. ครอบคลุม 14 หมู่บ้าน'
  },
  {
    net_id: 'NET-003',
    name: 'องค์การบริหารส่วนตำบลเขาฉกรรจ์',
    type: 'อบต.',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'เขาฉกรรจ์',
    address: 'อบต.เขาฉกรรจ์ อ.เขาฉกรรจ์ จ.สระแก้ว',
    coordinator: 'น.ส.จีราพร แก้วดี',
    phone: '091-765-4321',
    email: 'jiraporn@khaochakan.local',
    status: 'active',
    capabilities: ['ประชาสัมพันธ์ในพื้นที่', 'สนับสนุนสถานที่', 'สนับสนุนบุคลากร'],
    history_count: 4,
    note: 'ห้องประชุมขนาดใหญ่ รองรับเตียงรับบริจาคได้ 10 เตียง'
  },
  {
    net_id: 'NET-004',
    name: 'เทศบาลตำบลหนองหว้า',
    type: 'เทศบาล',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'หนองหว้า',
    address: 'ทต.หนองหว้า อ.เขาฉกรรจ์ จ.สระแก้ว',
    coordinator: 'นายวิทูร ทองดี',
    phone: '086-998-2211',
    email: 'witoon@nongwa.go.th',
    status: 'active',
    capabilities: ['ประชาสัมพันธ์ในพื้นที่', 'สนับสนุนสถานที่'],
    history_count: 3,
    note: 'ประสานงานกับกลุ่มผู้นำชุมชนในตำบลหนองหว้า'
  },
  {
    net_id: 'NET-005',
    name: 'โรงเรียนเขาฉกรรจ์วิทยาคม',
    type: 'สถานศึกษา',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'เขาฉกรรจ์',
    address: 'รร.เขาฉกรรจ์วิทยาคม อ.เขาฉกรรจ์ จ.สระแก้ว',
    coordinator: 'น.ส.ศิริวดี นามวงศ์',
    phone: '082-334-5566',
    email: 'siriwadee@kkv.ac.th',
    status: 'active',
    capabilities: ['ประชาสัมพันธ์ในพื้นที่'],
    history_count: 2,
    note: 'กลุ่มเป้าหมายนักเรียนอายุ 17 ปีขึ้นไปและคณะครู'
  },
  {
    net_id: 'NET-006',
    name: 'บริษัท เขาฉกรรจ์ฟู้ดส์ จำกัด',
    type: 'สถานประกอบการ',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'เขาฉกรรจ์',
    address: 'นิคมอุตสาหกรรมแปรรูป อ.เขาฉกรรจ์ จ.สระแก้ว',
    coordinator: 'นายธนพงษ์ ศรีสกุล',
    phone: '098-765-4321',
    email: 'hr@khaochakanfoods.com',
    status: 'active',
    capabilities: ['ประชาสัมพันธ์ในพื้นที่', 'สนับสนุนสถานที่'],
    history_count: 2,
    note: 'พนักงานกว่า 120 คน ยินดีให้ความร่วมมือปีละ 2 ครั้ง'
  },
  {
    net_id: 'NET-007',
    name: 'วัดเขาฉกรรจ์',
    type: 'ศาสนสถาน',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'เขาฉกรรจ์',
    address: 'ต.เขาฉกรรจ์ อ.เขาฉกรรจ์ จ.สระแก้ว',
    coordinator: 'พระครูวิมลกิจจาทร',
    phone: '080-223-4455',
    email: '-',
    status: 'pending',
    capabilities: ['ประชาสัมพันธ์ในพื้นที่', 'สนับสนุนสถานที่'],
    history_count: 1,
    note: 'ศาลาการเปรียญเปิดให้ใช้ในวันพระใหญ่หรือวันสำคัญ'
  },
  {
    net_id: 'NET-008',
    name: 'ชมรมกำนันผู้ใหญ่บ้าน ต.หนองหว้า',
    type: 'ชุมชน',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'หนองหว้า',
    address: 'ต.หนองหว้า อ.เขาฉกรรจ์ จ.สระแก้ว',
    coordinator: 'นายประยุทธ์ ใจกล้า',
    phone: '085-667-7889',
    email: '-',
    status: 'active',
    capabilities: ['ประชาสัมพันธ์ในพื้นที่'],
    history_count: 6,
    note: 'ช่วยประกาศเสียงตามสายทุกหมู่บ้าน 06.00 น.'
  },
  {
    net_id: 'NET-009',
    name: 'วิทยาลัยการอาชีพเขาฉกรรจ์',
    type: 'สถานศึกษา',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'หนองหว้า',
    address: 'ต.หนองหว้า อ.เขาฉกรรจ์ จ.สระแก้ว',
    coordinator: 'น.ส.รัตนา มีสุข',
    phone: '081-556-7788',
    email: 'rattana@kvc.ac.th',
    status: 'active',
    capabilities: ['ประชาสัมพันธ์ในพื้นที่', 'สนับสนุนสถานที่'],
    history_count: 3,
    note: 'จัดโครงการจิตอาสาบริจาคโลหิตเป็นประจำ'
  },
  {
    net_id: 'NET-010',
    name: 'หอการค้าอำเภอเขาฉกรรจ์',
    type: 'หน่วยงานอื่นๆ',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: 'เขาฉกรรจ์',
    address: 'อ.เขาฉกรรจ์ จ.สระแก้ว',
    coordinator: 'นายกิตติพงษ์ วงศ์ดี',
    phone: '089-990-1122',
    email: 'chamber@khaochakan.com',
    status: 'inactive',
    capabilities: ['สนับสนุนของที่ระลึกสำหรับผู้บริจาค'],
    history_count: 0,
    note: 'อยู่ระหว่างนำเสนอแผนสนับสนุนน้ำดื่มและอาหารว่าง'
  }
];

// Local storage helper
function getStoredArray(key, fallback) {
  try {
    var raw = localStorage.getItem('HPKC_' + key);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return fallback.slice();
}

function setStoredArray(key, arr) {
  try {
    localStorage.setItem('HPKC_' + key, JSON.stringify(arr));
  } catch(e) {}
}

// Module State
window.currentStockTab = 'all';
window.currentDonorTab = 'all';
window.currentDonorFilterGroup = 'ALL';
window.activeDonorDetail = null;
window.activeNetworkDetail = null;

// ==========================================================================
// 1. MODULE: คลังเลือด & สต็อกเลือด (INVENTORY STOCK & ALERTS)
// ==========================================================================
function getBloodGroupStockSummary() {
  var minStockConfig = getMinStockConfig();
  var summary = {};

  window.HOSPITAL_BLOOD_GROUPS.forEach(function (bg) {
    summary[bg] = {
      blood_group: bg,
      available_units: 0,
      reserved_units: 0,
      min_stock: minStockConfig[bg] != null ? minStockConfig[bg] : 0,
      expiring_units: 0,
      status: 'normal', // normal, warning, critical
      deficit: 0
    };
  });

  // Calculate from appData.inventory
  var inventoryList = (typeof appData !== 'undefined' && appData && appData.inventory) ? appData.inventory : [];
  inventoryList.forEach(function (unit) {
    var bg = unit.ABO + (unit.Rh === 'Positive' ? '+' : unit.Rh === 'Negative' ? '-' : '+');
    // If unit matches our 4 hospital blood groups
    if (summary[bg]) {
      var dLeft = daysUntil(unit.ExpiresAt);
      if (unit.Status === 'available') {
        if (dLeft >= 0) {
          summary[bg].available_units++;
          if (dLeft <= 7) {
            summary[bg].expiring_units++;
          }
        }
      } else if (unit.Status === 'reserved') {
        summary[bg].reserved_units++;
      }
    }
  });

  // Determine status
  window.HOSPITAL_BLOOD_GROUPS.forEach(function (bg) {
    var item = summary[bg];
    var min = item.min_stock;
    if (min > 0) {
      if (item.available_units < min) {
        item.status = 'critical';
        item.deficit = min - item.available_units;
      } else if (item.available_units === min) {
        item.status = 'warning';
        item.deficit = 0;
      } else {
        item.status = 'normal';
        item.deficit = 0;
      }
    } else {
      // Small hospital: ไม่สต็อก (minStock = 0)
      item.status = 'normal';
      item.deficit = 0;
    }
  });

  return summary;
}

function renderInventoryStock() {
  var summary = getBloodGroupStockSummary();
  var normalCount = 0;
  var warningCount = 0;
  var criticalCount = 0;
  var totalExpiring = 0;

  window.HOSPITAL_BLOOD_GROUPS.forEach(function (bg) {
    var item = summary[bg];
    if (item.status === 'normal') normalCount++;
    else if (item.status === 'warning') warningCount++;
    else if (item.status === 'critical') criticalCount++;
    totalExpiring += item.expiring_units;
  });

  // Update KPI Cards
  var elNormal = byId('kpiStockNormal');
  var elWarning = byId('kpiStockWarning');
  var elCritical = byId('kpiStockCritical');
  var elExpiring = byId('kpiStockExpiring');

  if (elNormal) elNormal.textContent = normalCount + ' กลุ่มเลือด';
  if (elWarning) elWarning.textContent = warningCount + ' กลุ่มเลือด';
  if (elCritical) elCritical.textContent = criticalCount + ' กลุ่มเลือด';
  if (elExpiring) elExpiring.textContent = totalExpiring + ' Units';

  // Update Action Cards Banner
  renderStockActionCards(summary);

  // Update Table
  renderInventoryStockTable();

  // Timestamp
  var elTime = byId('stockLastUpdatedText');
  if (elTime) {
    var now = new Date();
    elTime.textContent = 'อัปเดตล่าสุด ' + formatDate(now) + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0') + ' น.';
  }
}

function renderStockActionCards(summary) {
  var container = byId('stockActionCards');
  if (!container) return;

  var cardsHtml = '';
  var actionCount = 0;

  // 1. Critical Cards (e.g. O+ วิกฤต)
  window.HOSPITAL_BLOOD_GROUPS.forEach(function (bg) {
    var item = summary[bg];
    if (item.status === 'critical') {
      actionCount++;
      cardsHtml += '<div class="rounded-2xl border-2 border-red-200 bg-white p-4 shadow-sm relative overflow-hidden">' +
        '<div class="flex items-start justify-between mb-2">' +
          '<div class="flex items-center gap-2">' +
            '<span class="h-8 w-8 rounded-xl bg-red-100 text-red-700 font-extrabold text-sm flex items-center justify-center">' + esc(bg) + '</span>' +
            '<span class="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-bold text-[0.65rem] tracking-wide">วิกฤต</span>' +
          '</div>' +
          '<span class="text-[0.65rem] text-slate-400">อัปเดตล่าสุด วันนี้</span>' +
        '</div>' +
        '<p class="text-xs font-bold text-red-700 mb-2">สต็อกต่ำกว่าระดับที่กำหนด (ขาด ' + item.deficit + ' Units)</p>' +
        '<div class="grid grid-cols-3 gap-1 bg-red-50/60 rounded-xl p-2.5 text-center text-[0.7rem] mb-3">' +
          '<div><span class="text-slate-500 block text-[0.65rem]">คงเหลือ</span><span class="font-extrabold text-slate-800">' + item.available_units + ' U</span></div>' +
          '<div><span class="text-slate-500 block text-[0.65rem]">ขั้นต่ำ</span><span class="font-extrabold text-slate-800">' + item.min_stock + ' U</span></div>' +
          '<div><span class="text-slate-500 block text-[0.65rem]">ขาด</span><span class="font-extrabold text-red-600">' + item.deficit + ' U</span></div>' +
        '</div>' +
        '<div class="flex items-center gap-2">' +
          '<button onclick="filterStockTableByGroup(\'' + esc(bg) + '\')" class="flex-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-1.5 text-xs font-bold text-slate-700 text-center transition-colors">ดูรายละเอียด</button>' +
          '<button onclick="quickCreateDonorRequest(\'' + esc(bg) + '\', ' + Math.max(10, item.deficit * 2) + ')" class="flex-1 rounded-xl bg-crimson hover:bg-crimsonlight py-1.5 text-xs font-bold text-white text-center shadow-sm transition-colors flex items-center justify-center gap-1"><i data-lucide=\"send\" class=\"w-3 h-3\"></i> สร้างคำร้องขอ</button>' +
        '</div>' +
      '</div>';
    }
  });

  // 2. Warning Cards
  window.HOSPITAL_BLOOD_GROUPS.forEach(function (bg) {
    var item = summary[bg];
    if (item.status === 'warning') {
      actionCount++;
      cardsHtml += '<div class="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm relative overflow-hidden">' +
        '<div class="flex items-start justify-between mb-2">' +
          '<div class="flex items-center gap-2">' +
            '<span class="h-8 w-8 rounded-xl bg-amber-100 text-amber-800 font-extrabold text-sm flex items-center justify-center">' + esc(bg) + '</span>' +
            '<span class="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[0.65rem]">เฝ้าระวัง</span>' +
          '</div>' +
          '<span class="text-[0.65rem] text-slate-400">อัปเดตล่าสุด วันนี้</span>' +
        '</div>' +
        '<p class="text-xs font-bold text-amber-800 mb-2">สต็อกใกล้ระดับขั้นต่ำ</p>' +
        '<div class="grid grid-cols-3 gap-1 bg-amber-50/60 rounded-xl p-2.5 text-center text-[0.7rem] mb-3">' +
          '<div><span class="text-slate-500 block text-[0.65rem]">คงเหลือ</span><span class="font-extrabold text-slate-800">' + item.available_units + ' U</span></div>' +
          '<div><span class="text-slate-500 block text-[0.65rem]">ขั้นต่ำ</span><span class="font-extrabold text-slate-800">' + item.min_stock + ' U</span></div>' +
          '<div><span class="text-slate-500 block text-[0.65rem]">ขาด</span><span class="font-extrabold text-slate-500">-</span></div>' +
        '</div>' +
        '<div class="flex items-center gap-2">' +
          '<button onclick="filterStockTableByGroup(\'' + esc(bg) + '\')" class="flex-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-1.5 text-xs font-bold text-slate-700 text-center">ดูรายละเอียด</button>' +
          '<button onclick="quickCreateDonorRequest(\'' + esc(bg) + '\', 10)" class="flex-1 rounded-xl bg-crimson hover:bg-crimsonlight py-1.5 text-xs font-bold text-white text-center shadow-sm">สร้างคำร้องขอ</button>' +
        '</div>' +
      '</div>';
    }
  });

  // 3. Expiring Units Alert
  window.HOSPITAL_BLOOD_GROUPS.forEach(function (bg) {
    var item = summary[bg];
    if (item.expiring_units > 0) {
      actionCount++;
      cardsHtml += '<div class="rounded-2xl border border-rose-200 bg-white p-4 shadow-sm relative overflow-hidden">' +
        '<div class="flex items-start justify-between mb-2">' +
          '<div class="flex items-center gap-2">' +
            '<span class="h-8 w-8 rounded-xl bg-rose-100 text-crimson font-extrabold text-sm flex items-center justify-center">' + esc(bg) + '</span>' +
            '<span class="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[0.65rem]">ใกล้หมดอายุ</span>' +
          '</div>' +
          '<span class="text-[0.65rem] text-slate-400">ภายใน 7 วัน</span>' +
        '</div>' +
        '<p class="text-xs font-bold text-rose-800 mb-2">มีเลือด ' + item.expiring_units + ' Units ใกล้หมดอายุ</p>' +
        '<p class="text-[0.7rem] text-slate-500 mb-3">กรุณาจัดลำดับการจ่ายเลือดตามหลัก First Expire, First Out (FEFO)</p>' +
        '<button onclick="setInventoryTab(\'expiring\')" class="w-full rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-1.5 text-xs font-bold text-slate-700 text-center">ดูรายการใกล้หมดอายุ</button>' +
      '</div>';
    }
  });

  if (!cardsHtml) {
    cardsHtml = '<div class="col-span-full py-6 text-center text-xs text-slate-400 font-medium bg-white rounded-xl border border-dashed border-slate-200">✅ ระดับสต็อกเลือดอยู่ในเกณฑ์ปกติ ไม่มีรายการด่วนที่ต้องดำเนินการ</div>';
  }

  container.innerHTML = cardsHtml;
  var titleEl = byId('stockActionTitle');
  if (titleEl) titleEl.textContent = 'รายการที่ต้องดำเนินการ (' + actionCount + ' รายการ)';

  var badge = byId('topNotificationBadge');
  if (badge) {
    badge.textContent = actionCount;
    badge.style.display = actionCount > 0 ? 'flex' : 'none';
  }

  if (window.lucide) lucide.createIcons();
}

function setInventoryTab(tab) {
  window.currentStockTab = tab;
  ['all', 'critical', 'warning', 'expiring'].forEach(function (t) {
    var btn = byId('tabStock' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn) {
      if (t === tab) {
        btn.className = 'rounded-lg px-2.5 py-1 text-xs font-bold transition-all bg-white text-crimson shadow-sm';
      } else {
        btn.className = 'rounded-lg px-2.5 py-1 text-xs font-bold transition-all text-slate-600 hover:text-slate-900';
      }
    }
  });
  renderInventoryStockTable();
}

function renderInventoryStockTable() {
  var tbody = byId('inventoryStockTableBody');
  if (!tbody) return;

  var summary = getBloodGroupStockSummary();
  var groupFilter = byId('stockFilterGroup') ? byId('stockFilterGroup').value : 'ALL';
  var compFilter = byId('stockFilterComponent') ? byId('stockFilterComponent').value : 'ALL';
  var searchQ = byId('stockSearchInput') ? byId('stockSearchInput').value.trim().toLowerCase() : '';

  var rowsHtml = '';
  window.HOSPITAL_BLOOD_GROUPS.forEach(function (bg) {
    var item = summary[bg];

    // Filter by Tab
    if (window.currentStockTab === 'critical' && item.status !== 'critical') return;
    if (window.currentStockTab === 'warning' && item.status !== 'warning') return;
    if (window.currentStockTab === 'expiring' && item.expiring_units <= 0) return;

    // Filter by Dropdown
    if (groupFilter !== 'ALL' && bg !== groupFilter) return;

    // Filter by search
    if (searchQ && bg.toLowerCase().indexOf(searchQ) < 0) return;

    var statusBadge = '';
    if (item.status === 'normal') {
      statusBadge = '<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[0.7rem] border border-emerald-200"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> ปกติ</span>';
    } else if (item.status === 'warning') {
      statusBadge = '<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[0.7rem] border border-amber-200"><span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span> เฝ้าระวัง</span>';
    } else {
      statusBadge = '<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 font-bold text-[0.7rem] border border-red-200"><span class="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse"></span> วิกฤต</span>';
    }

    var actionButtons = '<div class="flex items-center justify-center gap-1.5">' +
      '<button onclick="viewGroupStockDetails(\'' + esc(bg) + '\')" class="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[0.7rem] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">ดูรายละเอียด</button>';

    if (item.status === 'critical' || item.status === 'warning') {
      actionButtons += '<button onclick="quickCreateDonorRequest(\'' + esc(bg) + '\', ' + Math.max(10, (item.deficit || 1) * 2) + ')" class="rounded-lg bg-crimson hover:bg-crimsonlight px-2.5 py-1 text-[0.7rem] font-bold text-white transition-colors shadow-sm flex items-center gap-1"><i data-lucide="send" class="w-3 h-3"></i> สร้างคำร้องขอบริจาค</button>';
    }
    actionButtons += '</div>';

    rowsHtml += '<tr class="hover:bg-rose-50/40 transition-colors">' +
      '<td class="p-3 border-b border-slate-100 font-extrabold text-slate-900 text-sm flex items-center gap-2">' +
        '<span class="h-7 w-7 rounded-lg bg-rose-100 text-crimson flex items-center justify-center font-black text-xs">' + esc(bg) + '</span>' +
        '<span>' + esc(bg) + '</span>' +
      '</td>' +
      '<td class="p-3 border-b border-slate-100 text-center font-bold text-slate-800 text-sm">' + item.available_units + '</td>' +
      '<td class="p-3 border-b border-slate-100 text-center text-slate-600 font-medium">' + item.reserved_units + '</td>' +
      '<td class="p-3 border-b border-slate-100 text-center font-bold text-slate-700">' + (item.min_stock > 0 ? (item.min_stock + ' Units') : '<span class="text-slate-400 font-normal">0 (ไม่สต็อก)</span>') + '</td>' +
      '<td class="p-3 border-b border-slate-100 text-center font-bold ' + (item.expiring_units > 0 ? 'text-red-600' : 'text-slate-400') + '">' + item.expiring_units + '</td>' +
      '<td class="p-3 border-b border-slate-100 text-center">' + statusBadge + '</td>' +
      '<td class="p-3 border-b border-slate-100 text-center">' + actionButtons + '</td>' +
    '</tr>';
  });

  if (!rowsHtml) {
    rowsHtml = '<tr><td colspan="7" class="p-6 text-center text-slate-400">ไม่พบข้อมูลตามเงื่อนไขที่เลือก</td></tr>';
  }

  tbody.innerHTML = rowsHtml;
  if (window.lucide) lucide.createIcons();
}

function filterStockTableByGroup(bg) {
  var select = byId('stockFilterGroup');
  if (select) {
    select.value = bg;
    renderInventoryStockTable();
  }
}

function viewGroupStockDetails(bg) {
  var units = (appData.inventory || []).filter(function (u) {
    var ubg = u.ABO + (u.Rh === 'Positive' ? '+' : u.Rh === 'Negative' ? '-' : '+');
    return ubg === bg && u.Status === 'available';
  });

  var listMsg = 'รายการถุงเลือดพร้อมใช้กรุ๊ป ' + bg + ' (' + units.length + ' ยูนิต):\n\n';
  if (units.length === 0) {
    listMsg += '- ไม่มีถุงเลือดพร้อมใช้ในคลังขณะนี้';
  } else {
    units.forEach(function (u, i) {
      listMsg += (i + 1) + '. Donation ID: ' + u.DonationID + ' | ' + u.Component + ' | หมดอายุ: ' + u.ExpiresAt + ' (อีก ' + daysUntil(u.ExpiresAt) + ' วัน)\n';
    });
  }
  alert(listMsg);
}

// Modal Settings for Minimum Stock
function openStockSettingsModal() {
  var cfg = getMinStockConfig();
  var modal = byId('stockSettingsModal');
  if (!modal) return;

  var inputO = byId('minStockInputO');
  var inputA = byId('minStockInputA');
  var inputB = byId('minStockInputB');
  var inputAB = byId('minStockInputAB');

  if (inputO) inputO.value = cfg['O+'] != null ? cfg['O+'] : 2;
  if (inputA) inputA.value = cfg['A+'] != null ? cfg['A+'] : 0;
  if (inputB) inputB.value = cfg['B+'] != null ? cfg['B+'] : 0;
  if (inputAB) inputAB.value = cfg['AB+'] != null ? cfg['AB+'] : 0;

  modal.classList.remove('hidden');
  modal.classList.add('grid');
}

function closeStockSettingsModal() {
  var modal = byId('stockSettingsModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('grid');
  }
}

function submitStockSettings(e) {
  if (e) e.preventDefault();
  var cfg = {
    'O+': parseInt(byId('minStockInputO').value) || 0,
    'A+': parseInt(byId('minStockInputA').value) || 0,
    'B+': parseInt(byId('minStockInputB').value) || 0,
    'AB+': parseInt(byId('minStockInputAB').value) || 0
  };
  saveMinStockConfig(cfg);
  closeStockSettingsModal();
  renderInventoryStock();
  alert('บันทึกเกณฑ์สต็อกเรียบร้อยแล้ว');
}

function printStockReport() {
  window.print();
}

function showStockAlertNotification() {
  showView('inventory_stock');
  setInventoryTab('critical');
}

// ==========================================================================
// 2. MODULE: ทะเบียนผู้บริจาคโลหิต (DONORS REGISTRY)
// ==========================================================================
function getDonorsList() {
  return getStoredArray('DONORS_LIST', window.INITIAL_DONORS);
}

function saveDonorsList(list) {
  setStoredArray('DONORS_LIST', list);
}

function renderDonorsRegistry() {
  var donors = getDonorsList();

  // Summary counts
  var total = donors.length;
  var readyCount = donors.filter(function (d) { return d.status === 'ready'; }).length;
  var dueCount = donors.filter(function (d) { return d.status === 'due'; }).length;
  var regularCount = donors.filter(function (d) { return d.donation_count >= 5; }).length;

  // Pills counts
  var countO = donors.filter(function (d) { return d.blood_display === 'O+'; }).length;
  var countA = donors.filter(function (d) { return d.blood_display === 'A+'; }).length;
  var countB = donors.filter(function (d) { return d.blood_display === 'B+'; }).length;
  var countAB = donors.filter(function (d) { return d.blood_display === 'AB+'; }).length;

  var elTotal = byId('kpiDonorsTotal');
  var elReady = byId('kpiDonorsReady');
  var elDue = byId('kpiDonorsDue');
  var elReg = byId('kpiDonorsRegular');

  if (elTotal) elTotal.textContent = (2458 + total - window.INITIAL_DONORS.length) + ' คน';
  if (elReady) elReady.textContent = (1892 + readyCount - 6) + ' คน';
  if (elDue) elDue.textContent = (486 + dueCount - 4) + ' คน';
  if (elReg) elReg.textContent = (1124 + regularCount - 5) + ' คน';

  var pAll = byId('pillDonorCountAll');
  var pO = byId('pillDonorCountO');
  var pA = byId('pillDonorCountA');
  var pB = byId('pillDonorCountB');
  var pAB = byId('pillDonorCountAB');

  if (pAll) pAll.textContent = '(' + (2458 + total - window.INITIAL_DONORS.length) + ')';
  if (pO) pO.textContent = '(' + (812 + countO - 3) + ')';
  if (pA) pA.textContent = '(' + (563 + countA - 3) + ')';
  if (pB) pB.textContent = '(' + (432 + countB - 2) + ')';
  if (pAB) pAB.textContent = '(' + (215 + countAB - 2) + ')';

  renderDonorsTable();
}

function setDonorsFilterBlood(grp) {
  window.currentDonorFilterGroup = grp;
  ['ALL', 'O+', 'A+', 'B+', 'AB+'].forEach(function (g) {
    var btn = byId('btnDonorPill_' + g.replace('+', 'Plus'));
    if (btn) {
      if (g === grp) {
        btn.className = 'rounded-xl px-3 py-1.5 text-xs font-bold transition-all bg-crimson text-white shadow-sm';
      } else {
        btn.className = 'rounded-xl px-3 py-1.5 text-xs font-bold transition-all bg-slate-100 text-slate-700 hover:bg-slate-200';
      }
    }
  });
  renderDonorsTable();
}

function renderDonorsTable() {
  var tbody = byId('donorsTableBody');
  if (!tbody) return;

  var donors = getDonorsList();
  var searchQ = byId('donorSearchInput') ? byId('donorSearchInput').value.trim().toLowerCase() : '';
  var subdistrictFilter = byId('donorFilterSubdistrict') ? byId('donorFilterSubdistrict').value : 'ALL';

  var filtered = donors.filter(function (d) {
    if (window.currentDonorFilterGroup !== 'ALL' && d.blood_display !== window.currentDonorFilterGroup) return false;
    if (subdistrictFilter !== 'ALL' && d.subdistrict !== subdistrictFilter) return false;
    if (!searchQ) return true;

    return (
      (d.name && d.name.toLowerCase().includes(searchQ)) ||
      (d.donor_id && d.donor_id.toLowerCase().includes(searchQ)) ||
      (d.phone && d.phone.includes(searchQ))
    );
  });

  var rowsHtml = filtered.map(function (d, idx) {
    var statusBadge = '';
    if (d.status === 'ready') {
      statusBadge = '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[0.65rem] font-bold border border-emerald-200"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> พร้อมติดต่อ</span>';
    } else if (d.status === 'due') {
      statusBadge = '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[0.65rem] font-bold border border-amber-200"><span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span> ครบกำหนด</span>';
    } else {
      statusBadge = '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[0.65rem] font-bold border border-red-200"><span class="h-1.5 w-1.5 rounded-full bg-red-500"></span> ติดต่อไม่ได้</span>';
    }

    return '<tr class="hover:bg-rose-50/40 cursor-pointer transition-colors" onclick="openDonorDetailDrawer(\'' + esc(d.donor_id) + '\')">' +
      '<td class="p-3 border-b border-slate-100 text-center" onclick="event.stopPropagation()"><input type="checkbox" class="donor-checkbox rounded" value="' + esc(d.donor_id) + '"></td>' +
      '<td class="p-3 border-b border-slate-100 text-center text-slate-500 font-medium">' + (idx + 1) + '</td>' +
      '<td class="p-3 border-b border-slate-100 font-mono font-bold text-slate-700">' + esc(d.donor_id) + '</td>' +
      '<td class="p-3 border-b border-slate-100 font-bold text-slate-900 whitespace-nowrap">' + esc(d.name) + '</td>' +
      '<td class="p-3 border-b border-slate-100 text-center font-extrabold text-crimson">' + esc(d.blood_display) + '</td>' +
      '<td class="p-3 border-b border-slate-100 text-center text-slate-500 text-[0.7rem]">' + esc(d.rh || 'Rh+') + '</td>' +
      '<td class="p-3 border-b border-slate-100 text-slate-600 text-[0.75rem] whitespace-nowrap">ต.' + esc(d.subdistrict) + '</td>' +
      '<td class="p-3 border-b border-slate-100 text-center text-slate-600 text-[0.75rem] whitespace-nowrap">' + esc(d.last_donation) + '</td>' +
      '<td class="p-3 border-b border-slate-100 text-center font-bold text-slate-800">' + d.donation_count + '</td>' +
      '<td class="p-3 border-b border-slate-100 text-center whitespace-nowrap">' + statusBadge + '</td>' +
      '<td class="p-3 border-b border-slate-100 text-center" onclick="event.stopPropagation()">' +
        '<button onclick="openDonorDetailDrawer(\'' + esc(d.donor_id) + '\')" class="h-7 w-7 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs" title="ดูข้อมูล">⋯</button>' +
      '</td>' +
    '</tr>';
  }).join('');

  if (!rowsHtml) {
    rowsHtml = '<tr><td colspan="11" class="p-6 text-center text-slate-400">ไม่พบรายชื่อผู้บริจาคตามเงื่อนไขที่ค้นหา</td></tr>';
  }

  tbody.innerHTML = rowsHtml;
}

function openDonorDetailDrawer(donorId) {
  var donors = getDonorsList();
  var d = donors.find(function (item) { return item.donor_id === donorId; });
  if (!d) return;

  window.activeDonorDetail = d;
  var drawer = byId('donorDetailsDrawer');
  if (!drawer) return;

  byId('drawerDonorName').textContent = d.name;
  byId('drawerDonorId').textContent = 'Donor ID : ' + d.donor_id;
  
  var statusBadge = byId('drawerDonorStatusBadge');
  if (statusBadge) {
    if (d.status === 'ready') statusBadge.innerHTML = '<span class="h-2 w-2 rounded-full bg-emerald-500"></span> พร้อมติดต่อ';
    else if (d.status === 'due') statusBadge.innerHTML = '<span class="h-2 w-2 rounded-full bg-amber-500"></span> ครบกำหนด';
    else statusBadge.innerHTML = '<span class="h-2 w-2 rounded-full bg-red-500"></span> ติดต่อไม่ได้';
  }

  byId('drawerDonorFullName').textContent = d.name;
  byId('drawerDonorBloodGroup').textContent = d.blood_group + ' Rh ' + d.rh;
  byId('drawerDonorBirthDate').textContent = d.birth_date + ' (อายุ ' + d.age + ' ปี)';
  byId('drawerDonorGender').textContent = d.gender;
  byId('drawerDonorPhone').textContent = d.phone;
  byId('drawerDonorEmail').textContent = d.email;
  byId('drawerDonorAddress').textContent = d.address;
  byId('drawerDonorConsentDate').textContent = d.consent_date || '15/01/2567';

  drawer.classList.remove('translate-x-full');
  drawer.classList.add('translate-x-0');
}

function closeDonorDetailDrawer() {
  var drawer = byId('donorDetailsDrawer');
  if (drawer) {
    drawer.classList.add('translate-x-full');
    drawer.classList.remove('translate-x-0');
  }
}

function openDonorAddModal() {
  var modal = byId('donorFormModal');
  if (!modal) return;
  var form = byId('donorAddEditForm');
  form.reset();
  form.elements.donorId.value = 'DN-' + String(Date.now()).slice(-6);
  byId('donorModalTitle').textContent = 'เพิ่มผู้บริจาคโลหิตรายใหม่';
  modal.classList.remove('hidden');
  modal.classList.add('grid');
}

function closeDonorAddModal() {
  var modal = byId('donorFormModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('grid');
  }
}

function submitDonorForm(e) {
  if (e) e.preventDefault();
  var form = byId('donorAddEditForm');
  var donors = getDonorsList();
  var id = form.elements.donorId.value.trim();
  var bg = form.elements.bloodGroup.value;

  var newDonor = {
    donor_id: id,
    name: form.elements.donorName.value.trim(),
    blood_group: bg.replace('+', ''),
    rh: 'Positive (' + bg + ')',
    blood_display: bg,
    birth_date: form.elements.birthDate.value,
    age: parseInt(form.elements.age.value) || 30,
    gender: form.elements.gender.value,
    phone: form.elements.phone.value.trim(),
    email: form.elements.email.value.trim() || '-',
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: form.elements.subdistrict.value,
    address: form.elements.address.value.trim(),
    last_donation: formatDate(new Date()),
    donation_count: parseInt(form.elements.count.value) || 1,
    status: 'ready',
    consent_contact: true,
    consent_news: true,
    channels: ['โทรศัพท์', 'LINE'],
    consent_date: formatDate(new Date())
  };

  var idx = donors.findIndex(function (d) { return d.donor_id === id; });
  if (idx >= 0) {
    donors[idx] = newDonor;
  } else {
    donors.unshift(newDonor);
  }

  saveDonorsList(donors);
  closeDonorAddModal();
  renderDonorsRegistry();
  alert('บันทึกข้อมูลผู้บริจาคเรียบร้อยแล้ว');
}

function openDonorImportModal() {
  alert('ฟังก์ชันนำเข้าข้อมูลผู้บริจาค (Import CSV/Excel): รองรับการนำเข้าไฟล์จากระบบสภากาชาดหรือ Excel');
}

function printDonorProfile() {
  if (!window.activeDonorDetail) return;
  alert('กำลังเตรียมพิมพ์เอกสารประวัติผู้บริจาค: ' + window.activeDonorDetail.name + ' (' + window.activeDonorDetail.donor_id + ')');
  window.print();
}

function sendInviteMessage(type) {
  if (!window.activeDonorDetail) return;
  alert('ส่งข้อความเชิญชวนไปยัง: ' + window.activeDonorDetail.name + ' ผ่านช่องทาง ' + window.activeDonorDetail.channels.join(', ') + ' สำเร็จแล้ว');
}

// ==========================================================================
// 3. MODULE: ร้องขอผู้บริจาคโลหิต (DONOR REQUESTS & CAMPAIGN)
// ==========================================================================
function quickCreateDonorRequest(bloodGroup, unitsNeeded) {
  showView('donor_requests_new');
  var form = byId('donorRequestForm');
  if (form) {
    form.elements.targetBloodGroup.value = bloodGroup || 'O+';
    form.elements.targetUnits.value = unitsNeeded || 20;
    form.elements.urgency.value = 'urgent';
    updateDonorRequestMessagePreview();
  }
}

function renderDonorRequests() {
  updateDonorRequestMessagePreview();
  updateLiveStockCard();
}

function pullDataFromStock() {
  var summary = getBloodGroupStockSummary();
  var critical = window.HOSPITAL_BLOOD_GROUPS.find(function (bg) { return summary[bg].status === 'critical'; });
  var targetGroup = critical || 'O+';
  var targetItem = summary[targetGroup];

  var form = byId('donorRequestForm');
  if (form) {
    form.elements.targetBloodGroup.value = targetGroup;
    form.elements.targetUnits.value = Math.max(10, (targetItem.deficit || 2) * 4);
    form.elements.urgency.value = targetItem.status === 'critical' ? 'urgent' : 'normal';
    updateDonorRequestMessagePreview();
    alert('ดึงข้อมูลสต็อกสำเร็จ: กำหนดเป้าหมายกรุ๊ป ' + targetGroup + ' จำนวน ' + form.elements.targetUnits.value + ' Units');
  }
}

function updateDonorRequestMessagePreview() {
  var form = byId('donorRequestForm');
  if (!form) return;

  var bg = form.elements.targetBloodGroup ? form.elements.targetBloodGroup.value : 'O+';
  var units = form.elements.targetUnits ? form.elements.targetUnits.value : '20';
  var hospital = form.elements.place ? form.elements.place.value : 'โรงพยาบาลเขาฉกรรจ์';
  var dateStr = form.elements.requestDate ? form.elements.requestDate.value : '21 กันยายน 2569';
  var timeStr = form.elements.requestTime ? form.elements.requestTime.value : '08:30 - 16:30 น.';
  var coordinator = form.elements.coordinator ? form.elements.coordinator.value : 'นายสุรศักดิ์ ดาเนตรปราชญ์';
  var phone = form.elements.phone ? form.elements.phone.value : '089-123-4567';

  var template = 'โรงพยาบาลเขาฉกรรจ์ มีความต้องการโลหิตกรุ๊ป ' + bg + ' (เป้าหมาย ' + units + ' ยูนิต) เพื่อใช้ในการรักษาผู้ป่วย ขอเชิญชวนผู้ที่มีสุขภาพแข็งแรง ร่วมบริจาคโลหิตได้ในวันที่ ' + dateStr + ' เวลา ' + timeStr + ' ณ ' + hospital + ' บริจาคโลหิต = ให้ชีวิต ต่อชีวิต สอบถามเพิ่มเติม โทร. ' + phone;

  var textarea = byId('requestMessageTextarea');
  if (textarea && !textarea.dataset.userEdited) {
    textarea.value = template;
  }

  var currentMsg = textarea ? textarea.value : template;
  var charCountEl = byId('requestMsgCharCount');
  if (charCountEl) charCountEl.textContent = currentMsg.length + '/500';

  // Preview chat bubble
  var bubbleText = byId('previewLineBubbleText');
  if (bubbleText) bubbleText.textContent = currentMsg;

  updateLiveStockCard();
}

function applyRequestTemplate(type) {
  var form = byId('donorRequestForm');
  var bg = form ? form.elements.targetBloodGroup.value : 'O+';
  var textarea = byId('requestMessageTextarea');
  if (!textarea) return;

  if (type === 'general') {
    textarea.value = 'โรงพยาบาลเขาฉกรรจ์ ขอเชิญชวนร่วมบริจาคโลหิตกรุ๊ป ' + bg + ' เพื่อสำรองคลังโลหิตสำหรับผู้ป่วยฉุกเฉิน มาร่วมสร้างกุศลต่อชีวิตเพื่อนมนุษย์ด้วยกันนะครับ';
  } else if (type === 'urgent') {
    textarea.value = '🚨 ด่วนมาก! โรงพยาบาลเขาฉกรรจ์ ขาดแคลนโลหิตกรุ๊ป ' + bg + ' อย่างวิกฤต ขอรับบริจาคโลหิตด่วนสำหรับผู้ป่วยหนัก สอบถาม โทร. 089-123-4567';
  } else if (type === 'mobile') {
    textarea.value = '🚌 แจ้งจุดรับบริจาคโลหิตเคลื่อนที่ รพ.เขาฉกรรจ์ ร่วมกับ อบต./รพ.สต. ในพื้นที่ ขอเชิญพี่น้องประชาชนร่วมบริจาคโลหิตกรุ๊ป ' + bg + ' ได้ที่เต็นท์บริการ';
  }
  textarea.dataset.userEdited = 'true';
  updateDonorRequestMessagePreview();
}

function updateLiveStockCard() {
  var form = byId('donorRequestForm');
  var bg = form && form.elements.targetBloodGroup ? form.elements.targetBloodGroup.value : 'O+';
  var summary = getBloodGroupStockSummary();
  var item = summary[bg] || { available_units: 0, min_stock: 0, deficit: 0, status: 'normal' };

  var badge = byId('liveStockBadge');
  if (badge) {
    if (item.status === 'critical') {
      badge.className = 'px-2 py-0.5 rounded-full bg-red-600 text-white font-bold text-[0.65rem]';
      badge.textContent = 'ต่ำกว่าระดับวิกฤต';
    } else if (item.status === 'warning') {
      badge.className = 'px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[0.65rem]';
      badge.textContent = 'เฝ้าระวัง';
    } else {
      badge.className = 'px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[0.65rem]';
      badge.textContent = 'ปกติ';
    }
  }

  var elAvail = byId('liveStockAvail');
  var elMin = byId('liveStockMin');
  var elDef = byId('liveStockDeficit');

  if (elAvail) elAvail.textContent = item.available_units + ' Units';
  if (elMin) elMin.textContent = item.min_stock + ' Units';
  if (elDef) elDef.textContent = (item.deficit || 0) + ' Units';
}

function goToTargetAudienceStep() {
  var modal = byId('targetAudienceModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('grid');
    renderTargetAudienceList();
  }
}

function closeTargetAudienceModal() {
  var modal = byId('targetAudienceModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('grid');
  }
}

function renderTargetAudienceList() {
  var listContainer = byId('targetAudienceContainer');
  if (!listContainer) return;
  var form = byId('donorRequestForm');
  var bg = form ? form.elements.targetBloodGroup.value : 'O+';
  var donors = getDonorsList().filter(function (d) { return d.blood_display === bg && d.consent_contact; });

  var html = donors.map(function (d) {
    return '<label class="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50/50 cursor-pointer text-xs">' +
      '<div class="flex items-center gap-2.5">' +
        '<input type="checkbox" checked class="target-donor-cb rounded text-crimson">' +
        '<div>' +
          '<span class="font-bold text-slate-800">' + esc(d.name) + '</span>' +
          '<span class="text-[0.65rem] text-slate-500 block">ต.' + esc(d.subdistrict) + ' • โทร ' + esc(d.phone) + '</span>' +
        '</div>' +
      '</div>' +
      '<span class="font-bold text-crimson text-xs">' + esc(d.blood_display) + '</span>' +
    '</label>';
  }).join('');

  if (!html) {
    html = '<p class="text-xs text-slate-400 p-4 text-center">ไม่พบผู้บริจาคกรุ๊ป ' + esc(bg) + ' ที่ยินยอมให้ติดต่อ</p>';
  }

  listContainer.innerHTML = html;
}

function confirmSendDonorCampaign() {
  closeTargetAudienceModal();
  alert('สร้างคำร้องขอและกระจายข้อความเชิญชวนไปยังผู้บริจาคและเครือข่ายเรียบร้อยแล้ว!');
}

// ==========================================================================
// 4. MODULE: เครือข่ายชุมชน (COMMUNITY NETWORKS)
// ==========================================================================
function getNetworksList() {
  return getStoredArray('NETWORKS_LIST', window.INITIAL_NETWORKS);
}

function saveNetworksList(list) {
  setStoredArray('NETWORKS_LIST', list);
}

function renderCommunityNetwork() {
  var networks = getNetworksList();

  // Summary counts
  var total = networks.length;
  var countRps = networks.filter(function (n) { return n.type === 'รพ.สต.'; }).length;
  var countAsm = networks.filter(function (n) { return n.type === 'อสม.'; }).length;
  var countAbt = networks.filter(function (n) { return n.type === 'อบต.' || n.type === 'เทศบาล'; }).length;
  var countBiz = networks.filter(function (n) { return n.type === 'สถานประกอบการ'; }).length;
  var countOth = networks.filter(function (n) { return n.type === 'สถานศึกษา' || n.type === 'ศาสนสถาน' || n.type === 'ชุมชน' || n.type === 'หน่วยงานอื่นๆ'; }).length;

  var elTot = byId('kpiNetTotal');
  var elRps = byId('kpiNetRps');
  var elAsm = byId('kpiNetAsm');
  var elAbt = byId('kpiNetAbt');
  var elBiz = byId('kpiNetBiz');
  var elOth = byId('kpiNetOth');

  if (elTot) elTot.textContent = (62 + total - window.INITIAL_NETWORKS.length) + ' แห่ง';
  if (elRps) elRps.textContent = (18 + countRps - 1) + ' แห่ง';
  if (elAsm) elAsm.textContent = (12 + countAsm - 1) + ' แห่ง';
  if (elAbt) elAbt.textContent = (8 + countAbt - 2) + ' แห่ง';
  if (elBiz) elBiz.textContent = (15 + countBiz - 1) + ' แห่ง';
  if (elOth) elOth.textContent = (9 + countOth - 5) + ' แห่ง';

  renderCommunityNetworkTable();
}

function renderCommunityNetworkTable() {
  var tbody = byId('networkTableBody');
  if (!tbody) return;

  var networks = getNetworksList();
  var typeFilter = byId('netFilterType') ? byId('netFilterType').value : 'ALL';
  var statusFilter = byId('netFilterStatus') ? byId('netFilterStatus').value : 'ALL';
  var subdistrictFilter = byId('netFilterSubdistrict') ? byId('netFilterSubdistrict').value : 'ALL';
  var searchQ = byId('netSearchInput') ? byId('netSearchInput').value.trim().toLowerCase() : '';

  var filtered = networks.filter(function (n) {
    if (typeFilter !== 'ALL' && n.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && n.status !== statusFilter) return false;
    if (subdistrictFilter !== 'ALL' && n.subdistrict !== subdistrictFilter) return false;
    if (!searchQ) return true;

    return (
      (n.name && n.name.toLowerCase().includes(searchQ)) ||
      (n.coordinator && n.coordinator.toLowerCase().includes(searchQ)) ||
      (n.phone && n.phone.includes(searchQ))
    );
  });

  var countBadge = byId('netFoundCountBadge');
  if (countBadge) countBadge.textContent = 'พบ ' + filtered.length + ' รายการ';

  var rowsHtml = filtered.map(function (n, idx) {
    var statusBadge = '';
    if (n.status === 'active') {
      statusBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[0.7rem] font-bold border border-emerald-200"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> เข้าร่วม</span>';
    } else if (n.status === 'pending') {
      statusBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[0.7rem] font-bold border border-amber-200"><span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span> รอประสาน</span>';
    } else {
      statusBadge = '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[0.7rem] font-bold border border-red-200"><span class="h-1.5 w-1.5 rounded-full bg-red-500"></span> ยังไม่เข้าร่วม</span>';
    }

    var typeIcon = 'building-2';
    if (n.type === 'รพ.สต.') typeIcon = 'cross';
    else if (n.type === 'อสม.') typeIcon = 'users';
    else if (n.type === 'สถานศึกษา') typeIcon = 'graduation-cap';

    return '<tr class="hover:bg-rose-50/40 cursor-pointer transition-colors" onclick="openNetworkDetailDrawer(\'' + esc(n.net_id) + '\')">' +
      '<td class="p-3 border-b border-slate-100 text-center text-slate-500 font-medium">' + (idx + 1) + '</td>' +
      '<td class="p-3 border-b border-slate-100 font-bold text-slate-900 whitespace-nowrap flex items-center gap-2">' +
        '<span class="h-7 w-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 text-xs font-bold"><i data-lucide="' + typeIcon + '" class="w-3.5 h-3.5"></i></span>' +
        '<span>' + esc(n.name) + '</span>' +
      '</td>' +
      '<td class="p-3 border-b border-slate-100 text-slate-700 text-xs whitespace-nowrap">' + esc(n.type) + '</td>' +
      '<td class="p-3 border-b border-slate-100 text-slate-600 text-xs whitespace-nowrap">ต.' + esc(n.subdistrict) + '</td>' +
      '<td class="p-3 border-b border-slate-100 text-slate-800 text-xs whitespace-nowrap">' + esc(n.coordinator) + '</td>' +
      '<td class="p-3 border-b border-slate-100 text-slate-700 text-xs font-mono whitespace-nowrap">' + esc(n.phone) + '</td>' +
      '<td class="p-3 border-b border-slate-100 text-center whitespace-nowrap">' + statusBadge + '</td>' +
      '<td class="p-3 border-b border-slate-100 text-center" onclick="event.stopPropagation()">' +
        '<button onclick="openNetworkDetailDrawer(\'' + esc(n.net_id) + '\')" class="h-7 w-7 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs" title="จัดการ">⋯</button>' +
      '</td>' +
    '</tr>';
  }).join('');

  if (!rowsHtml) {
    rowsHtml = '<tr><td colspan="8" class="p-6 text-center text-slate-400">ไม่พบข้อมูลเครือข่ายตามเงื่อนไขที่เลือก</td></tr>';
  }

  tbody.innerHTML = rowsHtml;
  if (window.lucide) lucide.createIcons();
}

function openNetworkDetailDrawer(netId) {
  var networks = getNetworksList();
  var n = networks.find(function (item) { return item.net_id === netId; });
  if (!n) return;

  window.activeNetworkDetail = n;
  var drawer = byId('networkDetailsDrawer');
  if (!drawer) return;

  byId('drawerNetTitle').textContent = n.name;
  byId('drawerNetTypeBadge').textContent = n.type;
  
  var statusBadge = byId('drawerNetStatusBadge');
  if (statusBadge) {
    if (n.status === 'active') statusBadge.innerHTML = '<span class="h-2 w-2 rounded-full bg-emerald-500"></span> เข้าร่วมโครงการ';
    else if (n.status === 'pending') statusBadge.innerHTML = '<span class="h-2 w-2 rounded-full bg-amber-500"></span> รอประสาน';
    else statusBadge.innerHTML = '<span class="h-2 w-2 rounded-full bg-red-500"></span> ยังไม่เข้าร่วม';
  }

  byId('drawerNetCoordinator').textContent = n.coordinator;
  byId('drawerNetPhone').textContent = n.phone;
  byId('drawerNetEmail').textContent = n.email;
  byId('drawerNetAddress').textContent = n.address;

  drawer.classList.remove('translate-x-full');
  drawer.classList.add('translate-x-0');
}

function closeNetworkDetailDrawer() {
  var drawer = byId('networkDetailsDrawer');
  if (drawer) {
    drawer.classList.add('translate-x-full');
    drawer.classList.remove('translate-x-0');
  }
}

function openAddNetworkModal() {
  var modal = byId('networkFormModal');
  if (!modal) return;
  var form = byId('networkAddEditForm');
  form.reset();
  form.elements.netId.value = 'NET-' + String(Date.now()).slice(-6);
  byId('networkModalTitle').textContent = 'เพิ่มเครือข่ายชุมชนใหม่';
  modal.classList.remove('hidden');
  modal.classList.add('grid');
}

function closeAddNetworkModal() {
  var modal = byId('networkFormModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('grid');
  }
}

function submitNetworkForm(e) {
  if (e) e.preventDefault();
  var form = byId('networkAddEditForm');
  var networks = getNetworksList();
  var id = form.elements.netId.value.trim();

  var newNet = {
    net_id: id,
    name: form.elements.netName.value.trim(),
    type: form.elements.netType.value,
    province: 'สระแก้ว',
    district: 'เขาฉกรรจ์',
    subdistrict: form.elements.subdistrict.value,
    address: form.elements.address.value.trim(),
    coordinator: form.elements.coordinator.value.trim(),
    phone: form.elements.phone.value.trim(),
    email: form.elements.email.value.trim() || '-',
    status: form.elements.status.value,
    capabilities: ['ประชาสัมพันธ์ในพื้นที่'],
    history_count: 1,
    note: form.elements.note.value.trim()
  };

  var idx = networks.findIndex(function (n) { return n.net_id === id; });
  if (idx >= 0) {
    networks[idx] = newNet;
  } else {
    networks.unshift(newNet);
  }

  saveNetworksList(networks);
  closeAddNetworkModal();
  renderCommunityNetwork();
  alert('บันทึกข้อมูลเครือข่ายเรียบร้อยแล้ว');
}

function contactNetwork() {
  if (!window.activeNetworkDetail) return;
  alert('โทรติดต่อผู้ประสานงาน: ' + window.activeNetworkDetail.coordinator + ' โทร. ' + window.activeNetworkDetail.phone);
}

// ==========================================================================
// 5. EXECUTIVE MULTI-MODULE OVERVIEW UPDATER (สำหรับหน้าภาพรวม & สถิติ)
// ==========================================================================
function updateDashboardExecutiveOverview() {
  try {
    // 1. สต็อกเลือด & แจ้งเตือน
    var stockSummary = getBloodGroupStockSummary();
    var normalCount = 0;
    var warningCount = 0;
    var criticalCount = 0;
    var totalExpiring = 0;
    var totalAvail = 0;
    var deficitO = (stockSummary['O+'] && stockSummary['O+'].deficit) ? stockSummary['O+'].deficit : 0;

    window.HOSPITAL_BLOOL_GROUPS_LIST = window.HOSPITAL_BLOOD_GROUPS || ['A+', 'B+', 'AB+', 'O+'];
    window.HOSPITAL_BLOOL_GROUPS_LIST.forEach(function (bg) {
      var item = stockSummary[bg] || {};
      if (item.status === 'normal') normalCount++;
      else if (item.status === 'warning') warningCount++;
      else if (item.status === 'critical') criticalCount++;
      totalExpiring += item.expiring_units || 0;
      totalAvail += item.available_units || 0;
    });

    var elStockNormal = byId('execStockNormal');
    var elStockWarning = byId('execStockWarning');
    var elStockCritical = byId('execStockCritical');
    var elStockAvailable = byId('execStockAvailable');
    var elStockDeficitO = byId('execStockDeficitO');
    var elStockExpiring = byId('execStockExpiring');

    if (elStockNormal) elStockNormal.textContent = normalCount + ' กลุ่ม';
    if (elStockWarning) elStockWarning.textContent = warningCount + ' กลุ่ม';
    if (elStockCritical) elStockCritical.textContent = criticalCount + ' กลุ่ม (O+)';
    if (elStockAvailable) elStockAvailable.textContent = totalAvail;
    if (elStockDeficitO) elStockDeficitO.textContent = deficitO;
    if (elStockExpiring) elStockExpiring.textContent = totalExpiring;

    // 2. ทะเบียนผู้บริจาคโลหิต
    var donors = getDonorsList();
    var totalDonors = 2458 + donors.length - (window.INITIAL_DONORS ? window.INITIAL_DONORS.length : 0);
    var readyDonors = 1891 + donors.filter(function (d) { return d.status === 'ready'; }).length - 6;
    var dueDonors = 486 + donors.filter(function (d) { return d.status === 'due'; }).length - 4;
    var regularDonors = 1124 + donors.filter(function (d) { return d.donation_count >= 5; }).length - 5;

    var elDonorsTotal = byId('execDonorsTotal');
    var elDonorsReady = byId('execDonorsReady');
    var elDonorsDue = byId('execDonorsDue');
    var elDonorsRegular = byId('execDonorsRegular');

    if (elDonorsTotal) elDonorsTotal.textContent = totalDonors.toLocaleString();
    if (elDonorsReady) elDonorsReady.textContent = readyDonors.toLocaleString();
    if (elDonorsDue) elDonorsDue.textContent = dueDonors.toLocaleString();
    if (elDonorsRegular) elDonorsRegular.textContent = regularDonors.toLocaleString();

    // 3. เครือข่ายชุมชน
    var networks = getNetworksList();
    var totalNets = networks.length;
    var activeNets = networks.filter(function (n) { return n.status === 'active'; }).length;
    var pendingNets = networks.filter(function (n) { return n.status === 'pending'; }).length;

    var elNetTotal = byId('execNetTotal');
    var elNetActive = byId('execNetActive');
    var elNetPending = byId('execNetPending');

    if (elNetTotal) elNetTotal.textContent = totalNets;
    if (elNetActive) elNetActive.textContent = activeNets;
    if (elNetPending) elNetPending.textContent = pendingNets;

    // 4. งานบริการคลินิก & แบบบันทึก
    if (typeof appData !== 'undefined') {
      var selectedMonth = (byId('statsMonthPicker') && byId('statsMonthPicker').value) || (new Date().toISOString().slice(0, 7));
      var monthlyReceived = (appData.inventory || []).filter(function (u) {
        var rDate = u.ReceivedAt || u.CollectedAt || '';
        return rDate.startsWith(selectedMonth);
      }).length;

      var monthlyDispensed = (appData.crossmatches || []).filter(function (x) {
        var dDate = x.DispensedAt || '';
        return x.DispenseStatus === 'dispensed' && dDate.startsWith(selectedMonth);
      }).length;

      var pendingReqs = (appData.requests || []).filter(function (r) { return r.Status !== 'dispensed'; }).length;
      var fmlabCount = (appData.fmlab145 || []).length;
      var fmlabDonated = (appData.fmlab145 || []).filter(function (f) { return f.RelativeDonated === 'TRUE' || f.RelativeDonated === true; }).length;
      var ebookCount = (appData.ebookRecords || []).length;

      var elMR = byId('execMonthlyReceived');
      var elMD = byId('execMonthlyDispensed');
      var elPR = byId('execPendingRequests');
      var elFC = byId('execFmlabRequests');
      var elFD = byId('execFmlabDonated');
      var elEC = byId('execEbookRecords');

      if (elMR) elMR.textContent = monthlyReceived;
      if (elMD) elMD.textContent = monthlyDispensed;
      if (elPR) elPR.textContent = pendingReqs;
      if (elFC) elFC.textContent = fmlabCount;
      if (elFD) elFD.textContent = fmlabDonated;
      if (elEC) elEC.textContent = ebookCount;
    }
  } catch(e) {
    console.warn('updateDashboardExecutiveOverview error:', e);
  }
}
window.updateDashboardExecutiveOverview = updateDashboardExecutiveOverview;
