const fs = require('fs');

const spreads1to5 = require('./seed_part1.js');
const spreads6to10 = require('./seed_part2.js');
const spreads11to14 = require('./seed_part3.js');

const allSpreads = [...spreads1to5, ...spreads6to10, ...spreads11to14];

let recordIndex = 1;
const flatRecords = [];

allSpreads.forEach(spread => {
  spread.records.forEach(rec => {
    const id = 'EB-' + String(recordIndex++).padStart(4, '0');
    flatRecords.push({
      record_id: id,
      spread_num: spread.spread_num,
      page_left: spread.page_left,
      page_right: spread.page_right,
      request_date: rec.request_date,
      seq_no: rec.seq_no,
      patient_name: rec.patient_name,
      hn: rec.hn,
      ward: rec.ward,
      doctor_name: rec.doctor_name,
      request_receiver: rec.request_receiver,
      request_time: rec.request_time,
      component: rec.component,
      doc_number: rec.doc_number,
      unit_no: rec.unit_no,
      donor_id: rec.donor_id,
      blood_group: rec.blood_group,
      volume: rec.volume,
      expires_at: rec.expires_at,
      prepared_by: rec.prepared_by,
      call_caller: rec.call_caller,
      call_time: rec.call_time,
      call_receiver: rec.call_receiver,
      dispense_by: rec.dispense_by,
      dispense_receiver: rec.dispense_receiver,
      dispense_date: rec.dispense_date,
      dispense_time: rec.dispense_time,
      note: rec.note || ''
    });
  });
});

console.log(`Total Spreads: ${allSpreads.length}`);
console.log(`Total Records: ${flatRecords.length}`);

// 1. Write JSON file
fs.writeFileSync('ebook_records_seed.json', JSON.stringify(flatRecords, null, 2), 'utf8');
console.log('Saved ebook_records_seed.json successfully');

// 2. Generate SQL Statements
let sql = `
-- ==========================================================
-- 📖 10. ตาราง E-Book บันทึกการแมตช์ และ รับ จ่ายโลหิตงานธนาคารเลือด
-- รวมข้อมูลจากสมุดบันทึกสแกนทั้ง 28 หน้า (14 คู่หน้า)
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.blood_bank_ebook_records (
    record_id TEXT PRIMARY KEY,
    spread_num INTEGER NOT NULL,
    page_left INTEGER NOT NULL,
    page_right INTEGER NOT NULL,
    request_date TEXT NOT NULL,
    seq_no INTEGER DEFAULT 1,
    patient_name TEXT NOT NULL,
    hn TEXT,
    ward TEXT DEFAULT 'IPD',
    doctor_name TEXT,
    request_receiver TEXT,
    request_time TEXT,
    component TEXT DEFAULT 'PRC',
    doc_number TEXT,
    unit_no INTEGER DEFAULT 1,
    donor_id TEXT NOT NULL,
    blood_group TEXT,
    volume NUMERIC DEFAULT 0,
    expires_at TEXT,
    prepared_by TEXT,
    call_caller TEXT,
    call_time TEXT,
    call_receiver TEXT,
    dispense_by TEXT,
    dispense_receiver TEXT,
    dispense_date TEXT,
    dispense_time TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.blood_bank_ebook_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS policy_ebook_select ON public.blood_bank_ebook_records;
DROP POLICY IF EXISTS policy_ebook_insert ON public.blood_bank_ebook_records;
DROP POLICY IF EXISTS policy_ebook_update ON public.blood_bank_ebook_records;
DROP POLICY IF EXISTS policy_ebook_delete ON public.blood_bank_ebook_records;

CREATE POLICY policy_ebook_select ON public.blood_bank_ebook_records FOR SELECT USING (true);
CREATE POLICY policy_ebook_insert ON public.blood_bank_ebook_records FOR INSERT WITH CHECK (true);
CREATE POLICY policy_ebook_update ON public.blood_bank_ebook_records FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY policy_ebook_delete ON public.blood_bank_ebook_records FOR DELETE USING (true);

-- SEED DATA (${flatRecords.length} records)
INSERT INTO public.blood_bank_ebook_records (
    record_id, spread_num, page_left, page_right, request_date, seq_no, patient_name, hn, ward, doctor_name,
    request_receiver, request_time, component, doc_number, unit_no, donor_id, blood_group, volume, expires_at,
    prepared_by, call_caller, call_time, call_receiver, dispense_by, dispense_receiver, dispense_date, dispense_time, note
) VALUES\n`;

const valueRows = flatRecords.map(r => {
  function q(val) {
    if (val === null || val === undefined) return "''";
    return "'" + String(val).replace(/'/g, "''") + "'";
  }
  return `(${q(r.record_id)}, ${r.spread_num}, ${r.page_left}, ${r.page_right}, ${q(r.request_date)}, ${r.seq_no}, ${q(r.patient_name)}, ${q(r.hn)}, ${q(r.ward)}, ${q(r.doctor_name)}, ${q(r.request_receiver)}, ${q(r.request_time)}, ${q(r.component)}, ${q(r.doc_number)}, ${r.unit_no}, ${q(r.donor_id)}, ${q(r.blood_group)}, ${r.volume}, ${q(r.expires_at)}, ${q(r.prepared_by)}, ${q(r.call_caller)}, ${q(r.call_time)}, ${q(r.call_receiver)}, ${q(r.dispense_by)}, ${q(r.dispense_receiver)}, ${q(r.dispense_date)}, ${q(r.dispense_time)}, ${q(r.note)})`;
}).join(',\n');

sql += valueRows + '\nON CONFLICT (record_id) DO NOTHING;\n';

fs.writeFileSync('schema_ebook.sql', sql, 'utf8');
console.log('Saved schema_ebook.sql successfully');
