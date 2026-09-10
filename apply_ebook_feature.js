const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Script tag in head
if (!html.includes('<script src="ebook_data.js"></script>')) {
  html = html.replace(
    '<script src="config.js"></script>',
    '<script src="config.js"></script>\n    <!-- E-Book Seed Data -->\n    <script src="ebook_data.js"></script>'
  );
  console.log('Step 1: Added ebook_data.js script tag');
}

// 2. Menu in menus array
if (!html.includes("id: 'ebook_records'")) {
  const targetMenu = "{ id: 'fmlab145', label: 'แบบร้องขอโลหิต (FM-LAB-145)', icon: 'file-spreadsheet', roles: ['ADMIN', 'MT'], mobile: true },";
  const replacementMenu = targetMenu + "\n        { id: 'ebook_records', label: 'E-Book แมตช์ & รับ-จ่าย', icon: 'book-open', roles: ['ADMIN', 'MT'], mobile: true },";
  html = html.replace(targetMenu, replacementMenu);
  console.log('Step 2: Added ebook_records to menus');
}

// 3. appData initialization
if (!html.includes('ebookRecords:')) {
  html = html.replace(
    'fmlab145: []\n      };',
    'fmlab145: [],\n        ebookRecords: (typeof window !== "undefined" && window.EBOOK_SEED_DATA) ? [...window.EBOOK_SEED_DATA] : []\n      };'
  );
  console.log('Step 3: Added ebookRecords to appData');
}

// 4. E-Book View HTML
const ebookViewHtml = `
        <!-- 2.5 E-BOOK บันทึกการแมตช์ และ รับ จ่ายโลหิตงานธนาคารเลือด -->
        <section id="ebook_records" class="view">
          <div class="mb-4 border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="rounded-lg bg-crimson px-2.5 py-0.5 text-[0.7rem] font-bold text-white uppercase tracking-wider">E-BOOK MT</span>
                <h2 class="text-xl font-bold text-slate-900">สมุดบันทึกการแมตช์ และ รับ-จ่าย โลหิตงานธนาคารเลือด</h2>
              </div>
              <p class="text-xs text-slate-500 mt-1">แบบฟอร์มขอเลือด & แบบฟอร์มการแมตช์และรับ-จ่ายโลหิต (28 หน้าสแกน / 14 คู่หน้า / 239 รายการ)</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <!-- Mode Toggle Buttons -->
              <div class="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 shadow-inner">
                <button id="ebookSpreadTabBtn" onclick="setEbookViewMode('spread')" class="rounded-lg px-3 py-1.5 text-xs font-bold transition-all bg-white text-crimson shadow-sm flex items-center gap-1.5">
                  <i data-lucide="book-open" class="w-3.5 h-3.5"></i> <span>สมุดบันทึก (หน้าคู่)</span>
                </button>
                <button id="ebookGridTabBtn" onclick="setEbookViewMode('grid')" class="rounded-lg px-3 py-1.5 text-xs font-bold transition-all text-slate-600 hover:text-slate-900 flex items-center gap-1.5">
                  <i data-lucide="table" class="w-3.5 h-3.5"></i> <span>ตารางค้นหาข้อมูล</span>
                </button>
              </div>

              <button onclick="openEbookAddModal()" class="rounded-xl bg-crimson hover:bg-crimsonlight text-white px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all">
                <i data-lucide="plus-circle" class="w-4 h-4"></i> เพิ่มบันทึกใหม่
              </button>
              <button onclick="printEbookSpread()" class="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all">
                <i data-lucide="printer" class="w-4 h-4"></i> พิมพ์คู่หน้านี้
              </button>
            </div>
          </div>

          <!-- 1. DUAL-PAGE SPREAD VIEW -->
          <div id="ebookSpreadViewContainer" class="space-y-4">
            <!-- Pager Bar -->
            <div class="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <button onclick="prevEbookSpread()" class="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors">
                  <i data-lucide="chevron-left" class="w-4 h-4"></i> คู่หน้าก่อนหน้า
                </button>
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-bold text-slate-500">เลือกคู่หน้า:</span>
                  <select id="ebookSpreadSelect" onchange="setEbookSpread(parseInt(this.value))" class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-crimson outline-none cursor-pointer focus:border-crimson focus:ring-1 focus:ring-crimson">
                    <option value="1">คู่หน้า 1: หน้า 2 - 3 (มิ.ย. - ก.ค. 69)</option>
                    <option value="2">คู่หน้า 2: หน้า 4 - 5 (ก.ค. 69)</option>
                    <option value="3">คู่หน้า 3: หน้า 6 - 7 (ก.ค. 69)</option>
                    <option value="4">คู่หน้า 4: หน้า 8 - 9 (ก.ค. 69)</option>
                    <option value="5">คู่หน้า 5: หน้า 10 - 11 (ก.ค. - ส.ค. 69)</option>
                    <option value="6">คู่หน้า 6: หน้า 12 - 13 (ส.ค. 69)</option>
                    <option value="7">คู่หน้า 7: หน้า 14 - 15 (ส.ค. 69)</option>
                    <option value="8">คู่หน้า 8: หน้า 16 - 17 (ส.ค. - ก.ย. 69)</option>
                    <option value="9">คู่หน้า 9: หน้า 18 - 19 (ก.ย. 69)</option>
                    <option value="10">คู่หน้า 10: หน้า 20 - 21 (ก.ย. 69)</option>
                    <option value="11">คู่หน้า 11: หน้า 22 - 23 (ก.ย. 69)</option>
                    <option value="12">คู่หน้า 12: หน้า 28 - 29 (ต.ค. 69)</option>
                    <option value="13">คู่หน้า 13: หน้า 30 - 31 (ก.ค. - ส.ค. 69)</option>
                    <option value="14">คู่หน้า 14: หน้า 32 - 33 (ส.ค. - ก.ย. 69)</option>
                  </select>
                </div>
                <button onclick="nextEbookSpread()" class="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors">
                  คู่หน้าถัดไป <i data-lucide="chevron-right" class="w-4 h-4"></i>
                </button>
              </div>

              <div class="flex items-center gap-3">
                <span id="ebookSpreadBadge" class="rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-crimson">
                  แสดงคู่หน้า 1/14 • 17 รายการ
                </span>
                <span class="text-xs text-slate-400 hidden sm:inline">| รวมทั้งเล่ม 239 รายการ</span>
              </div>
            </div>

            <!-- Dual Page Spread Container (Side-by-side) -->
            <div id="ebookPrintableSpread" class="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
              
              <!-- LEFT PAGE: แบบฟอร์มขอเลือด -->
              <div class="rounded-2xl border-2 border-slate-300 bg-white p-4 shadow-md">
                <div class="mb-3 pb-2 border-b-2 border-rose-900 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span id="ebookLeftPageNumBadge" class="h-7 w-7 rounded-full bg-crimson text-white font-bold text-xs flex items-center justify-center shadow-sm">2</span>
                    <div>
                      <h3 class="font-bold text-slate-900 text-sm leading-tight">แบบฟอร์มขอเลือด</h3>
                      <p class="text-[0.65rem] text-slate-500 font-medium">บันทึกข้อมูลการร้องขอโลหิตจากหอผู้ป่วย</p>
                    </div>
                  </div>
                  <span class="text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider">LEFT PAGE</span>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr class="bg-rose-50 text-slate-700 font-bold border-b border-slate-200">
                        <th class="p-2 border border-slate-200 text-center w-10">ลำดับ</th>
                        <th class="p-2 border border-slate-200 text-center whitespace-nowrap">ว/ด/ป</th>
                        <th class="p-2 border border-slate-200 whitespace-nowrap">ชื่อ - สกุล</th>
                        <th class="p-2 border border-slate-200 text-center whitespace-nowrap">HN</th>
                        <th class="p-2 border border-slate-200 text-center whitespace-nowrap">ที่อยู่</th>
                        <th class="p-2 border border-slate-200 whitespace-nowrap">แพทย์</th>
                        <th class="p-2 border border-slate-200 whitespace-nowrap">ผู้รับของ</th>
                        <th class="p-2 border border-slate-200 text-center whitespace-nowrap">เวลา</th>
                        <th class="p-2 border border-slate-200 text-center whitespace-nowrap">ชนิด</th>
                        <th class="p-2 border border-slate-200 whitespace-nowrap">เลขที่หนังสือ</th>
                      </tr>
                    </thead>
                    <tbody id="ebookLeftPageTableBody" class="divide-y divide-slate-100"></tbody>
                  </table>
                </div>
              </div>

              <!-- RIGHT PAGE: แบบฟอร์มการแมตช์ และ รับ-จ่าย โลหิต -->
              <div class="rounded-2xl border-2 border-slate-300 bg-white p-4 shadow-md">
                <div class="mb-3 pb-2 border-b-2 border-rose-900 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span id="ebookRightPageNumBadge" class="h-7 w-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shadow-sm">3</span>
                    <div>
                      <h3 class="font-bold text-slate-900 text-sm leading-tight">แบบฟอร์มการแมตช์ และ รับ-จ่าย โลหิต</h3>
                      <p class="text-[0.65rem] text-slate-500 font-medium">บันทึกผลการแมตช์ โทรแจ้งหอผู้ป่วย และการจ่ายโลหิต</p>
                    </div>
                  </div>
                  <span class="text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider">RIGHT PAGE</span>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr class="bg-rose-50 text-slate-700 font-bold border-b border-slate-200">
                        <th class="p-2 border border-slate-200 text-center w-8">#</th>
                        <th class="p-2 border border-slate-200 whitespace-nowrap">Donor ID</th>
                        <th class="p-2 border border-slate-200 text-center whitespace-nowrap">หมู่</th>
                        <th class="p-2 border border-slate-200 text-center whitespace-nowrap">ปริมาณ</th>
                        <th class="p-2 border border-slate-200 text-center whitespace-nowrap">Exp.</th>
                        <th class="p-2 border border-slate-200 whitespace-nowrap">ผู้เตรียม</th>
                        <th class="p-2 border border-slate-200 whitespace-nowrap">โทรแจ้ง</th>
                        <th class="p-2 border border-slate-200 whitespace-nowrap">จนท.รับเลือด</th>
                        <th class="p-2 border border-slate-200 text-center whitespace-nowrap">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody id="ebookRightPageTableBody" class="divide-y divide-slate-100"></tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>

          <!-- 2. SEARCHABLE DATA GRID VIEW -->
          <div id="ebookGridViewContainer" class="space-y-4 hidden">
            <!-- Filter Bar -->
            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div class="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                <div class="relative flex-1 max-w-md">
                  <input id="ebookGridSearchInput" oninput="filterEbookGrid()" type="text" placeholder="ค้นหา HN, ชื่อผู้ป่วย, Donor ID, แพทย์, วันที่, จนท..." class="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-crimson focus:ring-1 focus:ring-crimson">
                  <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
                </div>
                <select id="ebookGridBloodFilter" onchange="filterEbookGrid()" class="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none">
                  <option value="ALL">ทุกหมู่เลือด</option>
                  <option value="O+">หมู่ O+</option>
                  <option value="A+">หมู่ A+</option>
                  <option value="B+">หมู่ B+</option>
                  <option value="AB+">หมู่ AB+</option>
                  <option value="O">หมู่ O</option>
                  <option value="B">หมู่ B</option>
                </select>
                <select id="ebookGridSpreadFilter" onchange="filterEbookGrid()" class="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none">
                  <option value="ALL">ทุกคู่หน้า (1-14)</option>
                  <option value="1">คู่หน้า 1 (pp. 2-3)</option>
                  <option value="2">คู่หน้า 2 (pp. 4-5)</option>
                  <option value="3">คู่หน้า 3 (pp. 6-7)</option>
                  <option value="4">คู่หน้า 4 (pp. 8-9)</option>
                  <option value="5">คู่หน้า 5 (pp. 10-11)</option>
                  <option value="6">คู่หน้า 6 (pp. 12-13)</option>
                  <option value="7">คู่หน้า 7 (pp. 14-15)</option>
                  <option value="8">คู่หน้า 8 (pp. 16-17)</option>
                  <option value="9">คู่หน้า 9 (pp. 18-19)</option>
                  <option value="10">คู่หน้า 10 (pp. 20-21)</option>
                  <option value="11">คู่หน้า 11 (pp. 22-23)</option>
                  <option value="12">คู่หน้า 12 (pp. 28-29)</option>
                  <option value="13">คู่หน้า 13 (pp. 30-31)</option>
                  <option value="14">คู่หน้า 14 (pp. 32-33)</option>
                </select>
              </div>

              <div class="flex items-center gap-2">
                <span id="ebookGridCountBadge" class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  พบ 239 รายการ
                </span>
              </div>
            </div>

            <!-- Full Data Table -->
            <div class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-rose-50/80 text-slate-700 font-bold border-b border-slate-200">
                      <th class="p-3 border-r border-slate-200 text-center w-12">คู่หน้า</th>
                      <th class="p-3 border-r border-slate-200 text-center whitespace-nowrap">วันที่ขอ</th>
                      <th class="p-3 border-r border-slate-200 text-center whitespace-nowrap">HN</th>
                      <th class="p-3 border-r border-slate-200 whitespace-nowrap">ชื่อ - สกุล ผู้ป่วย</th>
                      <th class="p-3 border-r border-slate-200 text-center whitespace-nowrap">ตึก/แผนก</th>
                      <th class="p-3 border-r border-slate-200 whitespace-nowrap">แพทย์ผู้สั่ง</th>
                      <th class="p-3 border-r border-slate-200 whitespace-nowrap">Donor ID</th>
                      <th class="p-3 border-r border-slate-200 text-center whitespace-nowrap">หมู่เลือด</th>
                      <th class="p-3 border-r border-slate-200 text-center whitespace-nowrap">ปริมาณ</th>
                      <th class="p-3 border-r border-slate-200 text-center whitespace-nowrap">วันหมดอายุ</th>
                      <th class="p-3 border-r border-slate-200 whitespace-nowrap">ผู้เตรียม</th>
                      <th class="p-3 border-r border-slate-200 whitespace-nowrap">โทรแจ้ง</th>
                      <th class="p-3 border-r border-slate-200 whitespace-nowrap">จ่ายเลือดให้</th>
                      <th class="p-3 border-r border-slate-200 text-center whitespace-nowrap">วัน-เวลา จ่าย</th>
                      <th class="p-3 text-center whitespace-nowrap">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody id="ebookGridTableBody" class="divide-y divide-slate-100"></tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
`;

if (!html.includes('id="ebook_records"')) {
  const receivingTarget = '<!-- 3. RECEIVING BLOOD (WITH BARCODE SCANNER) -->';
  html = html.replace(receivingTarget, ebookViewHtml + '\n\n        ' + receivingTarget);
  console.log('Step 4: Added ebook_records HTML view');
}

// 5. E-Book Modal HTML
const ebookModalHtml = `
    <!-- E-Book Add/Edit Modal -->
    <div id="ebookRecordModal" class="fixed inset-0 z-[105] hidden place-items-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div class="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in duration-150">
        <div class="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-2 text-crimson">
            <i data-lucide="book-open" class="w-6 h-6"></i>
            <div>
              <h3 id="ebookModalTitle" class="text-lg font-bold text-slate-900">บันทึกข้อมูลสมุดการแมตช์ & รับ-จ่าย</h3>
              <p class="text-xs text-slate-500">กรอกข้อมูลทั้งหน้าซ้าย (ขอเลือด) และหน้าขวา (แมตช์ & รับ-จ่าย)</p>
            </div>
          </div>
          <button onclick="closeEbookModal()" class="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm">✕</button>
        </div>

        <form id="ebookRecordForm" onsubmit="submitEbookRecord(event)" class="space-y-5">
          <input type="hidden" name="recordId">

          <!-- Section 1: หน้าซ้าย (แบบฟอร์มขอเลือด) -->
          <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <h4 class="font-bold text-xs text-crimson uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <i data-lucide="file-text" class="w-4 h-4"></i> 1. ข้อมูลการขอเลือด (หน้าซ้าย)
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <label class="field">
                <span>คู่หน้า (Spread 1-14) *</span>
                <select name="spreadNum" required onchange="updateEbookModalPages(this.value)">
                  <option value="1">คู่หน้า 1 (หน้า 2-3)</option>
                  <option value="2">คู่หน้า 2 (หน้า 4-5)</option>
                  <option value="3">คู่หน้า 3 (หน้า 6-7)</option>
                  <option value="4">คู่หน้า 4 (หน้า 8-9)</option>
                  <option value="5">คู่หน้า 5 (หน้า 10-11)</option>
                  <option value="6">คู่หน้า 6 (หน้า 12-13)</option>
                  <option value="7">คู่หน้า 7 (หน้า 14-15)</option>
                  <option value="8">คู่หน้า 8 (หน้า 16-17)</option>
                  <option value="9">คู่หน้า 9 (หน้า 18-19)</option>
                  <option value="10">คู่หน้า 10 (หน้า 20-21)</option>
                  <option value="11">คู่หน้า 11 (หน้า 22-23)</option>
                  <option value="12">คู่หน้า 12 (หน้า 28-29)</option>
                  <option value="13">คู่หน้า 13 (หน้า 30-31)</option>
                  <option value="14">คู่หน้า 14 (หน้า 32-33)</option>
                </select>
              </label>
              <label class="field">
                <span>วันที่ขอเลือด *</span>
                <input name="requestDate" type="text" placeholder="เช่น 20/06/2569" required>
              </label>
              <label class="field">
                <span>ลำดับที่ในหน้า *</span>
                <input name="seqNo" type="number" min="1" value="1" required>
              </label>
              <label class="field">
                <span>HN ผู้ป่วย *</span>
                <input name="hn" type="text" placeholder="เช่น 28350" required>
              </label>
              <label class="field sm:col-span-2">
                <span>ชื่อ - นามสกุล ผู้ป่วย *</span>
                <input name="patientName" type="text" placeholder="เช่น นายบุญมา วงศ์คำ" required>
              </label>
              <label class="field">
                <span>ตึก / แผนก *</span>
                <select name="ward" required>
                  <option value="IPD">IPD</option>
                  <option value="OPD">OPD</option>
                  <option value="ER">ER</option>
                  <option value="ICU">ICU</option>
                  <option value="OR">OR</option>
                </select>
              </label>
              <label class="field">
                <span>แพทย์ผู้สั่ง *</span>
                <input name="doctorName" type="text" placeholder="เช่น พ.นิติภัทร" required>
              </label>
              <label class="field">
                <span>ผู้รับของ (Staff) *</span>
                <input name="requestReceiver" type="text" placeholder="เช่น เกศราภรณ์, ดวงกมล DR" required>
              </label>
              <label class="field">
                <span>เวลาที่รับของ</span>
                <input name="requestTime" type="text" placeholder="เช่น 10.00">
              </label>
              <label class="field">
                <span>ชนิดเลือด</span>
                <input name="component" type="text" value="PRC">
              </label>
              <label class="field">
                <span>เลขที่หนังสือ</span>
                <input name="docNumber" type="text" placeholder="เช่น สก0033.307/439">
              </label>
            </div>
          </div>

          <!-- Section 2: หน้าขวา (แบบฟอร์มการแมตช์ และ รับ-จ่าย) -->
          <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <h4 class="font-bold text-xs text-crimson uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <i data-lucide="git-compare" class="w-4 h-4"></i> 2. ข้อมูลการแมตช์ & รับ-จ่าย โลหิต (หน้าขวา)
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <label class="field">
                <span>ลำดับยูนิต (#) *</span>
                <input name="unitNo" type="number" min="1" value="1" required>
              </label>
              <label class="field">
                <span>Donor ID *</span>
                <input name="donorId" type="text" placeholder="เช่น 427.69.4.03264" required>
              </label>
              <label class="field">
                <span>หมู่เลือด (Bl-Rh) *</span>
                <select name="bloodGroup" required>
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                  <option value="A-">A-</option>
                  <option value="B-">B-</option>
                  <option value="AB-">AB-</option>
                  <option value="O">O</option>
                  <option value="B">B</option>
                  <option value="A">A</option>
                  <option value="AB">AB</option>
                </select>
              </label>
              <label class="field">
                <span>ปริมาณ (ml)</span>
                <input name="volume" type="number" value="280">
              </label>
              <label class="field">
                <span>วันหมดอายุ (Exp.) *</span>
                <input name="expiresAt" type="text" placeholder="เช่น 27/06/2569" required>
              </label>
              <label class="field">
                <span>ผู้เตรียม (Crossmatch) *</span>
                <input name="preparedBy" type="text" placeholder="เช่น เกศราภรณ์" required>
              </label>
              <label class="field">
                <span>โทรแจ้ง: ผู้โทร</span>
                <input name="callCaller" type="text" placeholder="เช่น เกศราภรณ์">
              </label>
              <label class="field">
                <span>โทรแจ้ง: เวลา</span>
                <input name="callTime" type="text" placeholder="เช่น 11.20">
              </label>
              <label class="field">
                <span>โทรแจ้ง: ผู้รับสาย (ตึก)</span>
                <input name="callReceiver" type="text" placeholder="เช่น กุสุมา, ประสิทธิ์">
              </label>
              <label class="field">
                <span>จนท.จ่ายเลือด</span>
                <input name="dispenseBy" type="text" placeholder="เช่น เกศราภรณ์, ดวงกมล DR">
              </label>
              <label class="field">
                <span>จนท.ผู้รับเลือด</span>
                <input name="dispenseReceiver" type="text" placeholder="เช่น จนท.IPD">
              </label>
              <label class="field">
                <span>วันที่จ่าย</span>
                <input name="dispenseDate" type="text" placeholder="เช่น 20/06/2569">
              </label>
              <label class="field">
                <span>เวลาที่จ่าย</span>
                <input name="dispenseTime" type="text" placeholder="เช่น 11.45">
              </label>
              <label class="field sm:col-span-2 lg:col-span-3">
                <span>หมายเหตุ / สถานะพิเศษ</span>
                <input name="note" type="text" placeholder="เช่น off ถุงเลือดเนื่องจาก...">
              </label>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button type="button" onclick="closeEbookModal()" class="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
              ยกเลิก
            </button>
            <button type="submit" class="rounded-xl bg-crimson hover:bg-crimsonlight text-white px-6 py-2.5 text-xs font-bold shadow-md shadow-rose-900/20 transition-all flex items-center gap-2">
              <i data-lucide="check" class="w-4 h-4"></i> บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
`;

if (!html.includes('id="ebookRecordModal"')) {
  const logoutModalTarget = '<!-- Logout Modal -->';
  html = html.replace(logoutModalTarget, ebookModalHtml + '\n    ' + logoutModalTarget);
  console.log('Step 5: Added ebookRecordModal HTML');
}

// 6. JavaScript functions for E-Book
const ebookJsLogic = `
      // ==========================================================
      // 📖 E-BOOK MODULE JAVASCRIPT LOGIC
      // ==========================================================
      var currentEbookSpread = 1;
      var currentEbookViewMode = 'spread';

      function setEbookViewMode(mode) {
        currentEbookViewMode = mode;
        if (mode === 'spread') {
          byId('ebookSpreadViewContainer').classList.remove('hidden');
          byId('ebookGridViewContainer').classList.add('hidden');
          byId('ebookSpreadTabBtn').className = 'rounded-lg px-3 py-1.5 text-xs font-bold transition-all bg-white text-crimson shadow-sm flex items-center gap-1.5';
          byId('ebookGridTabBtn').className = 'rounded-lg px-3 py-1.5 text-xs font-bold transition-all text-slate-600 hover:text-slate-900 flex items-center gap-1.5';
        } else {
          byId('ebookSpreadViewContainer').classList.add('hidden');
          byId('ebookGridViewContainer').classList.remove('hidden');
          byId('ebookSpreadTabBtn').className = 'rounded-lg px-3 py-1.5 text-xs font-bold transition-all text-slate-600 hover:text-slate-900 flex items-center gap-1.5';
          byId('ebookGridTabBtn').className = 'rounded-lg px-3 py-1.5 text-xs font-bold transition-all bg-white text-crimson shadow-sm flex items-center gap-1.5';
          filterEbookGrid();
        }
        if (window.lucide) lucide.createIcons();
      }

      function setEbookSpread(spreadNum) {
        if (spreadNum < 1) spreadNum = 1;
        if (spreadNum > 14) spreadNum = 14;
        currentEbookSpread = spreadNum;
        byId('ebookSpreadSelect').value = spreadNum;
        renderEbookSpread();
      }

      function nextEbookSpread() {
        if (currentEbookSpread < 14) setEbookSpread(currentEbookSpread + 1);
      }

      function prevEbookSpread() {
        if (currentEbookSpread > 1) setEbookSpread(currentEbookSpread - 1);
      }

      function renderEbook() {
        if (!byId('ebook_records')) return;
        renderEbookSpread();
        if (currentEbookViewMode === 'grid') filterEbookGrid();
      }

      function renderEbookSpread() {
        var records = (appData.ebookRecords || []).filter(function (r) {
          return parseInt(r.spread_num) === currentEbookSpread;
        });

        var leftPageNum = (records[0] && records[0].page_left) ? records[0].page_left : (currentEbookSpread * 2);
        var rightPageNum = (records[0] && records[0].page_right) ? records[0].page_right : (leftPageNum + 1);

        byId('ebookLeftPageNumBadge').textContent = leftPageNum;
        byId('ebookRightPageNumBadge').textContent = rightPageNum;
        byId('ebookSpreadBadge').textContent = 'แสดงคู่หน้า ' + currentEbookSpread + '/14 (หน้า ' + leftPageNum + ' - ' + rightPageNum + ') • ' + records.length + ' รายการ';

        // 1. Left Page Table (แบบฟอร์มขอเลือด)
        byId('ebookLeftPageTableBody').innerHTML = records.map(function (r) {
          return '<tr class="hover:bg-rose-50/40 transition-colors">' +
            '<td class="p-2 border border-slate-200 text-center font-bold text-slate-600">' + esc(r.seq_no) + '</td>' +
            '<td class="p-2 border border-slate-200 text-center whitespace-nowrap text-slate-700 font-semibold">' + esc(r.request_date) + '</td>' +
            '<td class="p-2 border border-slate-200 font-bold text-slate-900 whitespace-nowrap">' + esc(r.patient_name) + '</td>' +
            '<td class="p-2 border border-slate-200 text-center font-mono font-bold text-crimson">' + esc(r.hn || '-') + '</td>' +
            '<td class="p-2 border border-slate-200 text-center text-slate-700 font-semibold">' + esc(r.ward || 'IPD') + '</td>' +
            '<td class="p-2 border border-slate-200 text-slate-700 whitespace-nowrap">' + esc(r.doctor_name || '-') + '</td>' +
            '<td class="p-2 border border-slate-200 text-slate-700 whitespace-nowrap">' + esc(r.request_receiver || '-') + '</td>' +
            '<td class="p-2 border border-slate-200 text-center text-slate-500">' + esc(r.request_time || '-') + '</td>' +
            '<td class="p-2 border border-slate-200 text-center font-bold text-slate-800">' + esc(r.component || 'PRC') + '</td>' +
            '<td class="p-2 border border-slate-200 text-slate-600 font-mono text-[0.7rem]">' + esc(r.doc_number || '-') + '</td>' +
            '</tr>';
        }).join('') || '<tr><td colspan="10" class="p-4 text-center text-slate-400">ไม่มีข้อมูลในหน้านี้</td></tr>';

        // 2. Right Page Table (แบบฟอร์มการแมตช์ และ รับ-จ่าย)
        byId('ebookRightPageTableBody').innerHTML = records.map(function (r) {
          var noteHtml = r.note ? '<span class="block text-[0.65rem] text-red-600 font-medium italic mt-0.5">' + esc(r.note) + '</span>' : '';
          return '<tr class="hover:bg-rose-50/40 transition-colors">' +
            '<td class="p-2 border border-slate-200 text-center font-bold text-slate-600">' + esc(r.unit_no) + '</td>' +
            '<td class="p-2 border border-slate-200 font-mono font-bold text-slate-900 whitespace-nowrap">' + esc(r.donor_id) + '</td>' +
            '<td class="p-2 border border-slate-200 text-center font-bold text-crimson">' + esc(r.blood_group) + '</td>' +
            '<td class="p-2 border border-slate-200 text-center text-slate-700">' + esc(r.volume || '-') + '</td>' +
            '<td class="p-2 border border-slate-200 text-center whitespace-nowrap text-slate-600">' + esc(r.expires_at || '-') + '</td>' +
            '<td class="p-2 border border-slate-200 text-slate-700 whitespace-nowrap">' + esc(r.prepared_by || '-') + '</td>' +
            '<td class="p-2 border border-slate-200 text-slate-700 text-[0.7rem] whitespace-nowrap">' +
              (r.call_caller || r.call_time || r.call_receiver ? esc(r.call_caller) + ' / ' + esc(r.call_time) + ' / ' + esc(r.call_receiver) : '-') +
            '</td>' +
            '<td class="p-2 border border-slate-200 text-slate-700 text-[0.7rem] whitespace-nowrap">' +
              (r.dispense_by || r.dispense_receiver || r.dispense_date ? esc(r.dispense_by) + ' -> ' + esc(r.dispense_receiver) + ' (' + esc(r.dispense_date) + ' ' + esc(r.dispense_time) + ')' : '-') +
              noteHtml +
            '</td>' +
            '<td class="p-2 border border-slate-200 text-center whitespace-nowrap">' +
              '<div class="flex items-center justify-center gap-1">' +
                '<button onclick="editEbookRecord(\\'' + esc(r.record_id) + '\\')" class="h-6 w-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-[0.7rem]" title="แก้ไข"><i data-lucide="edit-3" class="w-3.5 h-3.5"></i></button>' +
                '<button onclick="deleteEbookRecord(\\'' + esc(r.record_id) + '\\')" class="h-6 w-6 rounded-md bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center text-[0.7rem]" title="ลบ"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>' +
              '</div>' +
            '</td>' +
            '</tr>';
        }).join('') || '<tr><td colspan="9" class="p-4 text-center text-slate-400">ไม่มีข้อมูลในหน้านี้</td></tr>';

        if (window.lucide) lucide.createIcons();
      }

      function filterEbookGrid() {
        var query = (byId('ebookGridSearchInput') ? byId('ebookGridSearchInput').value.toLowerCase().trim() : '');
        var bloodFilter = byId('ebookGridBloodFilter') ? byId('ebookGridBloodFilter').value : 'ALL';
        var spreadFilter = byId('ebookGridSpreadFilter') ? byId('ebookGridSpreadFilter').value : 'ALL';

        var list = (appData.ebookRecords || []).filter(function (r) {
          if (bloodFilter !== 'ALL' && r.blood_group !== bloodFilter) return false;
          if (spreadFilter !== 'ALL' && String(r.spread_num) !== spreadFilter) return false;
          if (!query) return true;

          return (
            (r.hn && r.hn.toLowerCase().includes(query)) ||
            (r.patient_name && r.patient_name.toLowerCase().includes(query)) ||
            (r.donor_id && r.donor_id.toLowerCase().includes(query)) ||
            (r.doctor_name && r.doctor_name.toLowerCase().includes(query)) ||
            (r.request_date && r.request_date.includes(query)) ||
            (r.prepared_by && r.prepared_by.toLowerCase().includes(query)) ||
            (r.request_receiver && r.request_receiver.toLowerCase().includes(query)) ||
            (r.ward && r.ward.toLowerCase().includes(query))
          );
        });

        byId('ebookGridCountBadge').textContent = 'พบ ' + list.length + ' รายการ';

        byId('ebookGridTableBody').innerHTML = list.map(function (r) {
          return '<tr class="hover:bg-rose-50/50 transition-colors">' +
            '<td class="p-3 border-r border-slate-100 text-center font-bold text-slate-500">' + esc(r.spread_num) + '</td>' +
            '<td class="p-3 border-r border-slate-100 text-center whitespace-nowrap text-slate-700 font-semibold">' + esc(r.request_date) + '</td>' +
            '<td class="p-3 border-r border-slate-100 text-center font-mono font-bold text-crimson">' + esc(r.hn || '-') + '</td>' +
            '<td class="p-3 border-r border-slate-100 font-bold text-slate-900 whitespace-nowrap">' + esc(r.patient_name) + '</td>' +
            '<td class="p-3 border-r border-slate-100 text-center font-semibold text-slate-700">' + esc(r.ward || 'IPD') + '</td>' +
            '<td class="p-3 border-r border-slate-100 text-slate-700 whitespace-nowrap">' + esc(r.doctor_name || '-') + '</td>' +
            '<td class="p-3 border-r border-slate-100 font-mono font-bold text-slate-800 whitespace-nowrap">' + esc(r.donor_id) + '</td>' +
            '<td class="p-3 border-r border-slate-100 text-center font-bold text-crimson">' + esc(r.blood_group) + '</td>' +
            '<td class="p-3 border-r border-slate-100 text-center text-slate-700">' + esc(r.volume || '-') + '</td>' +
            '<td class="p-3 border-r border-slate-100 text-center whitespace-nowrap text-slate-600">' + esc(r.expires_at || '-') + '</td>' +
            '<td class="p-3 border-r border-slate-100 text-slate-700 whitespace-nowrap">' + esc(r.prepared_by || '-') + '</td>' +
            '<td class="p-3 border-r border-slate-100 text-slate-600 text-[0.7rem] whitespace-nowrap">' + (r.call_caller ? esc(r.call_caller) + ' (' + esc(r.call_receiver) + ')' : '-') + '</td>' +
            '<td class="p-3 border-r border-slate-100 text-slate-600 text-[0.7rem] whitespace-nowrap">' + (r.dispense_by ? esc(r.dispense_by) + ' -> ' + esc(r.dispense_receiver) : '-') + '</td>' +
            '<td class="p-3 border-r border-slate-100 text-center text-[0.7rem] text-slate-600 whitespace-nowrap">' + (r.dispense_date ? esc(r.dispense_date) + ' ' + esc(r.dispense_time) : '-') + '</td>' +
            '<td class="p-3 text-center whitespace-nowrap">' +
              '<div class="flex items-center justify-center gap-1.5">' +
                '<button onclick="editEbookRecord(\\'' + esc(r.record_id) + '\\')" class="rounded-md border border-slate-200 bg-white px-2 py-1 text-[0.65rem] font-bold text-slate-600 hover:bg-slate-100 shadow-sm flex items-center gap-1"><i data-lucide="edit-3" class="w-3 h-3"></i> แก้ไข</button>' +
                '<button onclick="deleteEbookRecord(\\'' + esc(r.record_id) + '\\')" class="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[0.65rem] font-bold text-red-600 hover:bg-red-100 shadow-sm flex items-center gap-1"><i data-lucide="trash-2" class="w-3 h-3"></i> ลบ</button>' +
              '</div>' +
            '</td>' +
            '</tr>';
        }).join('') || '<tr><td colspan="15" class="p-6 text-center text-slate-400">ไม่พบรายการที่ค้นหา</td></tr>';

        if (window.lucide) lucide.createIcons();
      }

      function openEbookAddModal() {
        var form = byId('ebookRecordForm');
        form.reset();
        form.elements.recordId.value = '';
        form.elements.spreadNum.value = currentEbookSpread;
        form.elements.requestDate.value = formatDate(new Date());
        form.elements.seqNo.value = '1';
        form.elements.unitNo.value = '1';
        form.elements.ward.value = 'IPD';
        form.elements.component.value = 'PRC';
        form.elements.volume.value = '280';
        byId('ebookModalTitle').textContent = 'เพิ่มบันทึกใหม่ (สมุดการแมตช์ & รับ-จ่าย)';
        byId('ebookRecordModal').classList.remove('hidden');
        byId('ebookRecordModal').classList.add('grid');
        if (window.lucide) lucide.createIcons();
      }

      function closeEbookModal() {
        byId('ebookRecordModal').classList.add('hidden');
        byId('ebookRecordModal').classList.remove('grid');
      }

      function editEbookRecord(recordId) {
        var r = (appData.ebookRecords || []).find(function (item) { return item.record_id === recordId; });
        if (!r) return;

        var form = byId('ebookRecordForm');
        form.elements.recordId.value = r.record_id;
        form.elements.spreadNum.value = r.spread_num || currentEbookSpread;
        form.elements.requestDate.value = r.request_date || '';
        form.elements.seqNo.value = r.seq_no || 1;
        form.elements.hn.value = r.hn || '';
        form.elements.patientName.value = r.patient_name || '';
        form.elements.ward.value = r.ward || 'IPD';
        form.elements.doctorName.value = r.doctor_name || '';
        form.elements.requestReceiver.value = r.request_receiver || '';
        form.elements.requestTime.value = r.request_time || '';
        form.elements.component.value = r.component || 'PRC';
        form.elements.docNumber.value = r.doc_number || '';

        form.elements.unitNo.value = r.unit_no || 1;
        form.elements.donorId.value = r.donor_id || '';
        form.elements.bloodGroup.value = r.blood_group || 'O+';
        form.elements.volume.value = r.volume || 280;
        form.elements.expiresAt.value = r.expires_at || '';
        form.elements.preparedBy.value = r.prepared_by || '';
        form.elements.callCaller.value = r.call_caller || '';
        form.elements.callTime.value = r.call_time || '';
        form.elements.callReceiver.value = r.call_receiver || '';
        form.elements.dispenseBy.value = r.dispense_by || '';
        form.elements.dispenseReceiver.value = r.dispense_receiver || '';
        form.elements.dispenseDate.value = r.dispense_date || '';
        form.elements.dispenseTime.value = r.dispense_time || '';
        form.elements.note.value = r.note || '';

        byId('ebookModalTitle').textContent = 'แก้ไขบันทึก: ' + r.patient_name + ' (' + r.donor_id + ')';
        byId('ebookRecordModal').classList.remove('hidden');
        byId('ebookRecordModal').classList.add('grid');
        if (window.lucide) lucide.createIcons();
      }

      async function submitEbookRecord(e) {
        e.preventDefault();
        var form = byId('ebookRecordForm');
        var isEdit = !!form.elements.recordId.value;
        var recordId = form.elements.recordId.value || ('EB-' + Date.now());
        var spreadNum = parseInt(form.elements.spreadNum.value) || 1;

        // Calculate book page numbers for spread
        var pageMap = {
          1: [2, 3], 2: [4, 5], 3: [6, 7], 4: [8, 9], 5: [10, 11],
          6: [12, 13], 7: [14, 15], 8: [16, 17], 9: [18, 19], 10: [20, 21],
          11: [22, 23], 12: [28, 29], 13: [30, 31], 14: [32, 33]
        };
        var pages = pageMap[spreadNum] || [spreadNum * 2, spreadNum * 2 + 1];

        var record = {
          record_id: recordId,
          spread_num: spreadNum,
          page_left: pages[0],
          page_right: pages[1],
          request_date: form.elements.requestDate.value.trim(),
          seq_no: parseInt(form.elements.seqNo.value) || 1,
          hn: form.elements.hn.value.trim(),
          patient_name: form.elements.patientName.value.trim(),
          ward: form.elements.ward.value.trim(),
          doctor_name: form.elements.doctorName.value.trim(),
          request_receiver: form.elements.requestReceiver.value.trim(),
          request_time: form.elements.requestTime.value.trim(),
          component: form.elements.component.value.trim(),
          doc_number: form.elements.docNumber.value.trim(),
          unit_no: parseInt(form.elements.unitNo.value) || 1,
          donor_id: form.elements.donorId.value.trim(),
          blood_group: form.elements.bloodGroup.value.trim(),
          volume: parseFloat(form.elements.volume.value) || 0,
          expires_at: form.elements.expiresAt.value.trim(),
          prepared_by: form.elements.preparedBy.value.trim(),
          call_caller: form.elements.callCaller.value.trim(),
          call_time: form.elements.callTime.value.trim(),
          call_receiver: form.elements.callReceiver.value.trim(),
          dispense_by: form.elements.dispenseBy.value.trim(),
          dispense_receiver: form.elements.dispenseReceiver.value.trim(),
          dispense_date: form.elements.dispenseDate.value.trim(),
          dispense_time: form.elements.dispenseTime.value.trim(),
          note: form.elements.note.value.trim()
        };

        startLoading(isEdit ? 'กำลังอัปเดตข้อมูล...' : 'กำลังบันทึกข้อมูล...');
        try {
          if (sbClient) {
            var dbPayload = {
              record_id: record.record_id,
              spread_num: record.spread_num,
              page_left: record.page_left,
              page_right: record.page_right,
              request_date: record.request_date,
              seq_no: record.seq_no,
              patient_name: record.patient_name,
              hn: record.hn,
              ward: record.ward,
              doctor_name: record.doctor_name,
              request_receiver: record.request_receiver,
              request_time: record.request_time,
              component: record.component,
              doc_number: record.doc_number,
              unit_no: record.unit_no,
              donor_id: record.donor_id,
              blood_group: record.blood_group,
              volume: record.volume,
              expires_at: record.expires_at,
              prepared_by: record.prepared_by,
              call_caller: record.call_caller,
              call_time: record.call_time,
              call_receiver: record.call_receiver,
              dispense_by: record.dispense_by,
              dispense_receiver: record.dispense_receiver,
              dispense_date: record.dispense_date,
              dispense_time: record.dispense_time,
              note: record.note,
              updated_at: new Date().toISOString()
            };

            var res = isEdit
              ? await sbClient.from('blood_bank_ebook_records').update(dbPayload).eq('record_id', record.record_id)
              : await sbClient.from('blood_bank_ebook_records').insert([dbPayload]);

            if (res.error) console.warn('Supabase sync warning:', res.error);
          }

          // Update local state
          if (isEdit) {
            var idx = appData.ebookRecords.findIndex(function (item) { return item.record_id === record.record_id; });
            if (idx >= 0) appData.ebookRecords[idx] = record;
          } else {
            appData.ebookRecords.unshift(record);
          }

          closeEbookModal();
          setEbookSpread(record.spread_num);
          renderEbook();
          alert(isEdit ? 'อัปเดตข้อมูลสำเร็จ' : 'เพิ่มข้อมูลใหม่สำเร็จ');
        } catch (err) {
          console.error(err);
          alert('เกิดข้อผิดพลาด: ' + (err.message || err));
        } finally {
          stopLoading();
        }
      }

      async function deleteEbookRecord(recordId) {
        var r = (appData.ebookRecords || []).find(function (item) { return item.record_id === recordId; });
        var name = r ? r.patient_name + ' (Donor: ' + r.donor_id + ')' : recordId;
        if (!confirm('ยืนยันการลบรายการ: ' + name + ' ใช่หรือไม่?')) return;

        startLoading('กำลังลบข้อมูล...');
        try {
          if (sbClient) {
            var res = await sbClient.from('blood_bank_ebook_records').delete().eq('record_id', recordId);
            if (res.error) console.warn('Supabase delete warning:', res.error);
          }
          appData.ebookRecords = (appData.ebookRecords || []).filter(function (item) { return item.record_id !== recordId; });
          renderEbook();
          alert('ลบข้อมูลเรียบร้อย');
        } catch (err) {
          console.error(err);
          alert('เกิดข้อผิดพลาด: ' + (err.message || err));
        } finally {
          stopLoading();
        }
      }

      function printEbookSpread() {
        window.print();
      }

      function updateEbookModalPages(spreadVal) {
        // Automatically handled on submit
      }
`;

// Insert E-Book JS Logic right after renderFmlabTable block
if (!html.includes('function renderEbookSpread()')) {
  const targetJs = 'function renderFmlabTable() {';
  html = html.replace(targetJs, ebookJsLogic + '\n      ' + targetJs);
  console.log('Step 6: Added E-Book JS Logic functions');
}

// 7. Call renderEbook in renderAll()
if (!html.includes('renderEbook();')) {
  html = html.replace(
    'renderFmlabTable();',
    'renderFmlabTable();\n        renderEbook();'
  );
  console.log('Step 7: Hooked renderEbook() into renderAll()');
}

// 8. Update loadAllData query to fetch blood_bank_ebook_records
const oldPromiseAll = `const [invRes, patRes, reqRes, xmRes, audRes, setRes, usrRes, fmRes] = await Promise.all([
              sbClient.from('blood_inventory').select('*').order('expires_at', { ascending: true }),
              sbClient.from('patients').select('*').order('created_at', { ascending: false }),
              sbClient.from('requests').select('*').order('created_at', { ascending: false }),
              sbClient.from('crossmatches').select('*').order('verified_at', { ascending: false }),
              sbClient.from('audit_trail').select('*').order('at', { ascending: false }).limit(100),
              sbClient.from('settings').select('*'),
              sbClient.from('users').select('*').order('created_at', { ascending: false }),
              sbClient.from('blood_requests_fmlab145').select('*').order('request_date', { ascending: false })
            ]);`;

const newPromiseAll = `const [invRes, patRes, reqRes, xmRes, audRes, setRes, usrRes, fmRes, ebRes] = await Promise.all([
              sbClient.from('blood_inventory').select('*').order('expires_at', { ascending: true }),
              sbClient.from('patients').select('*').order('created_at', { ascending: false }),
              sbClient.from('requests').select('*').order('created_at', { ascending: false }),
              sbClient.from('crossmatches').select('*').order('verified_at', { ascending: false }),
              sbClient.from('audit_trail').select('*').order('at', { ascending: false }).limit(100),
              sbClient.from('settings').select('*'),
              sbClient.from('users').select('*').order('created_at', { ascending: false }),
              sbClient.from('blood_requests_fmlab145').select('*').order('request_date', { ascending: false }),
              sbClient.from('blood_bank_ebook_records').select('*').order('spread_num', { ascending: true })
            ]);`;

if (html.includes(oldPromiseAll)) {
  html = html.replace(oldPromiseAll, newPromiseAll);
  
  const oldMapBlock = `appData.fmlab145 = (fmRes.data || []).map(mapFmlabRow);`;
  const newMapBlock = `appData.fmlab145 = (fmRes.data || []).map(mapFmlabRow);
            if (ebRes && ebRes.data && ebRes.data.length > 0) {
              appData.ebookRecords = ebRes.data.map(mapEbookRow);
            } else if (!appData.ebookRecords || appData.ebookRecords.length === 0) {
              appData.ebookRecords = (typeof window !== 'undefined' && window.EBOOK_SEED_DATA) ? [...window.EBOOK_SEED_DATA] : [];
            }`;
  html = html.replace(oldMapBlock, newMapBlock);
  console.log('Step 8: Updated loadAllData for Supabase ebook sync');
}

// 9. Add mapEbookRow function
const mapEbookRowFunc = `
      function mapEbookRow(r) {
        return {
          record_id: r.record_id,
          spread_num: r.spread_num,
          page_left: r.page_left,
          page_right: r.page_right,
          request_date: r.request_date,
          seq_no: r.seq_no,
          patient_name: r.patient_name,
          hn: r.hn,
          ward: r.ward,
          doctor_name: r.doctor_name,
          request_receiver: r.request_receiver,
          request_time: r.request_time,
          component: r.component,
          doc_number: r.doc_number,
          unit_no: r.unit_no,
          donor_id: r.donor_id,
          blood_group: r.blood_group,
          volume: r.volume,
          expires_at: r.expires_at,
          prepared_by: r.prepared_by,
          call_caller: r.call_caller,
          call_time: r.call_time,
          call_receiver: r.call_receiver,
          dispense_by: r.dispense_by,
          dispense_receiver: r.dispense_receiver,
          dispense_date: r.dispense_date,
          dispense_time: r.dispense_time,
          note: r.note || ''
        };
      }
`;

if (!html.includes('function mapEbookRow(')) {
  const mapInventoryTarget = 'function mapInventoryRow(r) {';
  html = html.replace(mapInventoryTarget, mapEbookRowFunc + '\n      ' + mapInventoryTarget);
  console.log('Step 9: Added mapEbookRow function');
}

// Save modified index.html
fs.writeFileSync('index.html', html, 'utf8');
console.log('Finished updating index.html successfully!');
