const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add ebook_data.js script in <head>
if (!html.includes('<script src="ebook_data.js"></script>')) {
  html = html.replace(
    '<script src="config.js"></script>',
    '<script src="config.js"></script>\n    <!-- E-Book Seed Data -->\n    <script src="ebook_data.js"></script>'
  );
  console.log('Added ebook_data.js script tag');
}

// 2. Add menu item in menus array
if (!html.includes("id: 'ebook_records'")) {
  const target = "{ id: 'fmlab145', label: 'แบบร้องขอโลหิต (FM-LAB-145)', icon: 'file-spreadsheet', roles: ['ADMIN', 'MT'], mobile: true },";
  const replacement = target + "\n        { id: 'ebook_records', label: 'E-Book แมตช์ & รับ-จ่าย', icon: 'book-open', roles: ['ADMIN', 'MT'], mobile: true },";
  html = html.replace(target, replacement);
  console.log('Added ebook_records to menus');
}

// 3. Update appData initialization
if (!html.includes('ebookRecords:')) {
  html = html.replace(
    'fmlab145: []\n      };',
    'fmlab145: [],\n        ebookRecords: (typeof window !== "undefined" && window.EBOOK_SEED_DATA) ? [...window.EBOOK_SEED_DATA] : []\n      };'
  );
  console.log('Added ebookRecords to appData');
}

// 4. Update loadAllData to fetch from blood_bank_ebook_records
if (!html.includes("sbClient.from('blood_bank_ebook_records')")) {
  const promiseTarget = "sbClient.from('blood_requests_fmlab145').select('*').order('request_date', { ascending: false })\n            ]);";
  const promiseReplacement = "sbClient.from('blood_requests_fmlab145').select('*').order('request_date', { ascending: false }),\n              sbClient.from('blood_bank_ebook_records').select('*').order('spread_num', { ascending: true })\n            ]);";
  html = html.replace(promiseTarget, promiseReplacement);

  const assignTarget = "appData.fmlab145 = (fmRes.data || []).map(mapFmlabRow);\n          }";
  const assignReplacement = `appData.fmlab145 = (fmRes.data || []).map(mapFmlabRow);
            if (arguments.length > 0 || (typeof arguments !== 'undefined')) {
              var ebRes = arguments[0];
            }
            var ebData = (typeof invRes !== 'undefined' && Array.isArray(arguments)) ? null : null;
            // Map ebook records from Supabase if available
            try {
              if (typeof fmRes !== 'undefined') {
                // The 9th query in Promise.all is ebook
                var lastRes = (typeof arguments !== 'undefined' && arguments[8]) ? arguments[8] : null;
              }
            } catch(e) {}
          }`;
  // Let's do a cleaner Promise.all destructuring replacement
}

fs.writeFileSync('index.html_test', html, 'utf8');
console.log('Initial test written');
