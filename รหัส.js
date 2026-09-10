const APP = {
  sheets: {
    settings: 'Setting',
    inventory: 'BloodInventory',
    patients: 'Patients',
    requests: 'Requests',
    crossmatches: 'Crossmatches',
    audit: 'AuditTrail',
    attachments: 'Attachments',
    users: 'Users',
  },
  settingKeys: {
    folderId: 'DRIVE_FOLDER_ID',
    folderName: 'DRIVE_FOLDER_NAME',
  },
};

const HEADERS = {
  Setting: ['Key', 'Value', 'Description', 'UpdatedAt'],
  BloodInventory: [
    'DonationID',
    'Component',
    'Volume',
    'ABO',
    'Rh',
    'CollectedAt',
    'ExpiresAt',
    'Markers',
    'Status',
    'Source',
    'Note',
    'AttachmentUrl',
    'AttachmentFileId',
    'ImageLh3Url',
    'ReceivedAt',
    'UpdatedAt',
  ],
  Patients: [
    'HN',
    'FullName',
    'Age',
    'Ward',
    'Bed',
    'HistoricalABO',
    'HistoricalRh',
    'PhotoUrl',
    'PhotoFileId',
    'ImageLh3Url',
    'CreatedAt',
    'UpdatedAt',
  ],
  Requests: [
    'RequestID',
    'HN',
    'Component',
    'Units',
    'Priority',
    'Indication',
    'Status',
    'CellType',
    'SerumType',
    'PatientABO',
    'PatientRh',
    'GroupingAlert',
    'GroupingVerifiedBy',
    'GroupingVerifiedAt',
    'NurseName',  // <--- เพิ่มคอลัมน์นี้
    'DoctorName', // <--- เพิ่มคอลัมน์นี้
    'CreatedAt',
    'UpdatedAt',
  ],
  Crossmatches: [
    'CrossmatchID',
    'RequestID',
    'HN',
    'DonationID',
    'Major',
    'Minor',
    'AutoControl',
    'Result',
    'TagCode',
    'VerifiedBy',
    'VerifiedAt',
    'DispenseStatus',
    'Receiver',
    'DispensedAt',
    'ColdChainDueAt',
    'UpdatedAt',
  ],
  AuditTrail: ['AuditID', 'At', 'User', 'Action', 'Detail'],
  Attachments: [
    'AttachmentID',
    'OwnerType',
    'OwnerID',
    'FileName',
    'MimeType',
    'FileId',
    'DriveUrl',
    'Lh3Url',
    'UploadedAt',
  ],
  Users: [
    'Username',
    'Password',
    'FullName',
    'Role',
    'Active',
    'CreatedAt',
    'UpdatedAt',
    'LastLoginAt',
  ],
};

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Blood Bank Inventory')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function setupBloodBankDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(HEADERS).forEach(function (sheetName) {
    const sheet = getOrCreateSheet_(ss, sheetName);
    if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getDisplayValue() !== HEADERS[sheetName][0]) {
      buildSheet_(sheet, HEADERS[sheetName]);
    } else {
      applyTextFormat_(sheet, HEADERS[sheetName].length);
    }
  });

  const folderId = ensureDriveFolder_();
  upsertSetting_(APP.settingKeys.folderId, folderId, 'Google Drive folder ID for uploaded images and documents');
  upsertSetting_(APP.settingKeys.folderName, 'BloodBankUploads', 'Default upload folder name');
  seedSampleData();
  seedDefaultUsers_();
  writeAudit_('admin', 'Setup database', 'Created sheet structure, text formats, settings, and sample data');

  return ok_('สร้างโครงสร้าง Google Sheet และข้อมูลตัวอย่างเรียบร้อย');
}

function seedSampleData() {
  ensureStructure_();
  const now = nowText_();
  const today = new Date();
  const rows = {
    BloodInventory: [
      ['W24000000001', 'PRC', '280', 'O', 'Positive', dateOffset_(today, -3), dateOffset_(today, 4), 'negative', 'available', 'Thai Red Cross', 'ใกล้หมดอายุ', '', '', '', now, now],
      ['W24000000002', 'PRC', '270', 'O', 'Negative', dateOffset_(today, -4), dateOffset_(today, 14), 'negative', 'available', 'Hospital donation', '', '', '', '', now, now],
      ['W24000000003', 'FFP', '220', 'A', 'Positive', dateOffset_(today, -12), dateOffset_(today, 160), 'pending', 'quarantine', 'Thai Red Cross', 'รอผล infectious marker', '', '', '', now, now],
      ['W24000000004', 'Platelet', '60', 'B', 'Positive', dateOffset_(today, -2), dateOffset_(today, -1), 'negative', 'discard', 'Hospital donation', 'หมดอายุ', '', '', '', now, now],
    ],
    Patients: [
      ['66000123', 'สมชาย ทดสอบ', '58', 'ICU', '3A', 'O', 'Positive', '', '', '', now, now],
      ['66000456', 'มาลี ตัวอย่าง', '41', 'OR', '2', 'A', 'Positive', '', '', '', now, now],
    ],
    Requests: [
      ['REQ-000001', '66000123', 'PRC', '1', 'Urgent', 'Hb ต่ำ', 'ready_crossmatch', 'O', 'O', 'O', 'Positive', '', 'MT01', now, now, now],
      ['REQ-000002', '66000456', 'FFP', '2', 'Routine', 'เตรียมผ่าตัด', 'pending_grouping', '', '', '', '', '', '', '', now, now],
    ],
  };

  Object.keys(rows).forEach(function (sheetName) {
    const sheet = getSheet_(sheetName);
    if (sheet.getLastRow() > 1) return;
    appendRows_(sheet, rows[sheetName]);
  });

  writeAudit_('admin', 'Seed sample data', 'Added sample blood units, patients, and requests');
  return ok_('เติมข้อมูลตัวอย่างเรียบร้อย');
}

function getAppData() {
  ensureStructure_();
  seedDefaultUsers_();
  applyExpiryHardStop_();
  return {
    inventory: readSheetObjects_(APP.sheets.inventory),
    patients: readSheetObjects_(APP.sheets.patients),
    requests: readSheetObjects_(APP.sheets.requests),
    crossmatches: readSheetObjects_(APP.sheets.crossmatches),
    audit: readSheetObjects_(APP.sheets.audit),
    settings: readSheetObjects_(APP.sheets.settings),
    users: getPublicUsers_(),
    serverTime: nowText_(),
  };
}

function loginUser(payload) {
  ensureStructure_();
  seedDefaultUsers_();
  payload = payload || {};
  const username = cleanText_(payload.username || payload.Username || payload.user || payload.User);
  const password = cleanText_(payload.password || payload.Password || payload.pass || payload.Pass);
  if (!username || !password) throw new Error('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');

  const found = findRowByKey_(APP.sheets.users, 'Username', username);
  if (!found.rowIndex || found.row.Password !== password || found.row.Active !== 'TRUE') {
    writeAudit_('system', 'Login failed', username);
    throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง หรือบัญชีถูกปิดใช้งาน');
  }

  updateObjectRow_(APP.sheets.users, found.rowIndex, { LastLoginAt: nowText_(), UpdatedAt: nowText_() });
  writeAudit_(username, 'Login', found.row.Role);
  const token = createSession_(found.row);
  return ok_('เข้าสู่ระบบสำเร็จ', {
    user: {
      Username: found.row.Username,
      FullName: found.row.FullName,
      Role: found.row.Role,
      SessionToken: token,
    },
    app: getAppData(),
  });
}

function saveUser(payload) {
  ensureStructure_();
  payload = payload || {};
  assertRole_(payload.sessionToken, ['ADMIN']);
  const username = cleanText_(payload.username);
  if (!username) throw new Error('กรุณาระบุ Username');
  if (!cleanText_(payload.password)) throw new Error('กรุณาระบุ Password');
  const role = cleanText_(payload.role) || 'USER';
  const active = cleanText_(payload.active) || 'TRUE';
  const found = findRowByKey_(APP.sheets.users, 'Username', username);
  if (found.rowIndex) {
    updateObjectRow_(APP.sheets.users, found.rowIndex, {
      Password: payload.password,
      FullName: payload.fullName,
      Role: role,
      Active: active,
      UpdatedAt: nowText_(),
    });
    writeAudit_('admin', 'Update user', username + ' ' + role);
  } else {
    appendObject_(APP.sheets.users, {
      Username: username,
      Password: payload.password,
      FullName: payload.fullName,
      Role: role,
      Active: active,
      CreatedAt: nowText_(),
      UpdatedAt: nowText_(),
      LastLoginAt: '',
    });
    writeAudit_('admin', 'Create user', username + ' ' + role);
  }
  return ok_('บันทึกผู้ใช้เรียบร้อย', { users: getPublicUsers_() });
}

function setUserActive(payload) {
  ensureStructure_();
  payload = payload || {};
  assertRole_(payload.sessionToken, ['ADMIN']);
  const username = cleanText_(payload.username);
  const found = findRowByKey_(APP.sheets.users, 'Username', username);
  if (!found.rowIndex) throw new Error('ไม่พบผู้ใช้');
  updateObjectRow_(APP.sheets.users, found.rowIndex, {
    Active: cleanText_(payload.active) === 'TRUE' ? 'TRUE' : 'FALSE',
    UpdatedAt: nowText_(),
  });
  writeAudit_('admin', 'Set user status', username + ' ' + cleanText_(payload.active));
  return ok_('ปรับสถานะผู้ใช้เรียบร้อย', { users: getPublicUsers_() });
}

function getUsersForAdmin(payload) {
  ensureStructure_();
  assertRole_(payload && payload.sessionToken, ['ADMIN']);
  seedDefaultUsers_();
  return getPublicUsers_();
}

function createSession_(user) {
  const token = Utilities.getUuid();
  CacheService.getScriptCache().put('SESSION_' + token, JSON.stringify({
    Username: user.Username,
    FullName: user.FullName,
    Role: user.Role,
  }), 21600);
  return token;
}

function assertRole_(token, roles) {
  const raw = CacheService.getScriptCache().get('SESSION_' + cleanText_(token));
  if (!raw) throw new Error('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
  const session = JSON.parse(raw);
  if (roles.indexOf(session.Role) === -1) throw new Error('สิทธิ์ไม่เพียงพอสำหรับทำรายการนี้');
  return session;
}

function saveBloodUnit(payload) {
  ensureStructure_();
  payload = payload || {};
  const donationId = cleanText_(payload.donationId).toUpperCase();
  if (!donationId) throw new Error('กรุณาระบุ Donation ID');
  
  const found = findRowByKey_(APP.sheets.inventory, 'DonationID', donationId);
  const isEdit = payload.isEdit === true || payload.isEdit === 'true';
  
  if (!isEdit && found.rowIndex) {
    throw new Error('Donation ID นี้มีอยู่แล้ว');
  }
  if (daysUntil_(payload.expiresAt) < 0) {
    throw new Error('วันหมดอายุน้อยกว่าวันปัจจุบัน ระบบไม่อนุญาตให้บันทึก');
  }

  const marker = cleanText_(payload.markers) || 'negative';
  let status = marker === 'negative' ? 'available' : marker === 'reactive' ? 'discard' : 'quarantine';
  if (isEdit && found.rowIndex) {
    if (['reserved', 'dispensed', 'discard'].indexOf(found.row.Status) >= 0) {
      status = found.row.Status;
    }
  }
  const attachment = payload.attachment && payload.attachment.base64
    ? uploadBase64File_(payload.attachment, 'BloodInventory', donationId)
    : emptyAttachment_();

  let user = 'MT';
  if (payload.sessionToken) {
    try {
      const session = assertRole_(payload.sessionToken, ['ADMIN', 'MT']);
      user = session.Username;
    } catch(e) {}
  }

  const dataToSave = {
    DonationID: donationId,
    Component: payload.component,
    Volume: payload.volume,
    ABO: payload.abo,
    Rh: payload.rh,
    CollectedAt: payload.collectedAt,
    ExpiresAt: payload.expiresAt,
    Markers: marker,
    Status: status,
    Source: payload.source,
    Note: payload.note,
    UpdatedAt: nowText_(),
  };

  if (attachment.driveUrl) {
    dataToSave.AttachmentUrl = attachment.driveUrl;
    dataToSave.AttachmentFileId = attachment.fileId;
    dataToSave.ImageLh3Url = attachment.lh3Url;
  }

  if (isEdit && found.rowIndex) {
    updateObjectRow_(APP.sheets.inventory, found.rowIndex, dataToSave);
    writeAudit_(user, 'แก้ไขข้อมูลถุงเลือด', donationId + ' ' + payload.component + ' ' + payload.abo + ' ' + payload.rh + ' สถานะ ' + status);
  } else {
    dataToSave.ReceivedAt = nowText_();
    if (!dataToSave.AttachmentUrl) {
      dataToSave.AttachmentUrl = '';
      dataToSave.AttachmentFileId = '';
      dataToSave.ImageLh3Url = '';
    }
    appendObject_(APP.sheets.inventory, dataToSave);
    writeAudit_(user, 'รับเลือดเข้า', donationId + ' ' + payload.component + ' ' + payload.abo + ' ' + payload.rh + ' สถานะ ' + status);
  }
  
  const expDays = daysUntil_(payload.expiresAt);
  let msgResponse = isEdit ? 'อัปเดตข้อมูลถุงเลือดเรียบร้อย' : 'บันทึกรับเลือดเข้าเรียบร้อย';
  if (expDays >= 0 && expDays <= 10) {
    msgResponse = (isEdit ? 'อัปเดตข้อมูลถุงเลือดเรียบร้อย' : 'บันทึกรับเลือดเข้าเรียบร้อย') + ' ⚠️ แจ้งเตือน: เลือดถุงนี้ใกล้หมดอายุ (เหลือเวลา ' + expDays + ' วัน) กรุณาบริหารจัดการด่วน';
  }
  return ok_(msgResponse, getAppData());
}

function releaseQuarantineUnits() {
  ensureStructure_();
  const sheet = getSheet_(APP.sheets.inventory);
  const data = readSheetObjects_(APP.sheets.inventory);
  const headers = getHeaders_(sheet);
  let count = 0;
  data.forEach(function (row, index) {
    if (row.Status === 'quarantine' && row.Markers === 'negative' && daysUntil_(row.ExpiresAt) >= 0) {
      setCellByHeader_(sheet, headers, index + 2, 'Status', 'available');
      setCellByHeader_(sheet, headers, index + 2, 'UpdatedAt', nowText_());
      count += 1;
    }
  });
  writeAudit_('MT', 'ปลด Quarantine', 'ปลดล็อกถุงเลือด ' + count + ' unit');
  return ok_('ปลด Quarantine แล้ว ' + count + ' unit', getAppData());
}

function savePatientRequest(payload) {
  ensureStructure_();
  payload = payload || {};
  const hn = cleanText_(payload.hn);
  if (!hn) throw new Error('กรุณาระบุ HN');

  const attachment = payload.attachment && payload.attachment.base64
    ? uploadBase64File_(payload.attachment, 'Patients', hn)
    : emptyAttachment_();

  const found = findRowByKey_(APP.sheets.patients, 'HN', hn);
  if (found.rowIndex) {
    updateObjectRow_(APP.sheets.patients, found.rowIndex, {
      FullName: payload.name,
      Age: payload.age,
      Ward: payload.ward,
      Bed: payload.bed,
      PhotoUrl: attachment.driveUrl || found.row.PhotoUrl,
      PhotoFileId: attachment.fileId || found.row.PhotoFileId,
      ImageLh3Url: attachment.lh3Url || found.row.ImageLh3Url,
      UpdatedAt: nowText_(),
    });
  } else {
    appendObject_(APP.sheets.patients, {
      HN: hn,
      FullName: payload.name,
      Age: payload.age,
      Ward: payload.ward,
      Bed: payload.bed,
      HistoricalABO: '',
      HistoricalRh: '',
      PhotoUrl: attachment.driveUrl,
      PhotoFileId: attachment.fileId,
      ImageLh3Url: attachment.lh3Url,
      CreatedAt: nowText_(),
      UpdatedAt: nowText_(),
    });
  }

  const requestId = 'REQ-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyMMddHHmmss');
  appendObject_(APP.sheets.requests, {
    RequestID: requestId,
    HN: hn,
    Component: payload.component,
    Units: payload.units,
    Priority: payload.priority,
    Indication: payload.indication,
    Status: 'pending_grouping',
    CellType: '',
    SerumType: '',
    PatientABO: '',
    PatientRh: '',
    GroupingAlert: '',
    GroupingVerifiedBy: '',
    GroupingVerifiedAt: '',
    NurseName: payload.nurseName,    // <--- บันทึกข้อมูลพยาบาลผู้ตรวจสอบ
    DoctorName: payload.doctorName,  // <--- บันทึกข้อมูลแพทย์ผู้ขอ
    CreatedAt: nowText_(),
    UpdatedAt: nowText_(),
  });

  writeAudit_('doctor', 'สร้างคำขอเลือด', requestId + ' HN ' + hn);
  return ok_('สร้างคำขอเลือด ' + requestId + ' เรียบร้อย', getAppData());
}

function saveGroupingResult(payload) {
  ensureStructure_();
  payload = payload || {};
  const found = findRowByKey_(APP.sheets.requests, 'RequestID', payload.requestId);
  if (!found.rowIndex) throw new Error('ไม่พบคำขอเลือด');

  const patient = findRowByKey_(APP.sheets.patients, 'HN', found.row.HN);
  
  // ตรวจสอบ Safety Lock โดยอิงจาก "สรุปหมู่โลหิต (ABO)" แทน
  const historyConflict = patient.row && patient.row.HistoricalABO &&
    (patient.row.HistoricalABO !== payload.conclusionAbo || patient.row.HistoricalRh !== payload.rh);
    
  if (historyConflict) {
    throw new Error('🚨 Safety Lock: ประวัติกรุ๊ปเลือดเดิมของคนไข้คือ ' + patient.row.HistoricalABO + ' ' + patient.row.HistoricalRh + ' ไม่ตรงกับผลสรุปที่กำลังลง ระบบไม่อนุญาตให้บันทึกเด็ดขาด กรุณาตรวจสอบใหม่');
  }

  // จัดรูปแบบผล Reaction เพื่อเก็บลงในคอลัมน์เดิม (ประหยัดพื้นที่และไม่ต้องแก้โครงสร้างชีต)
  const cellTypeRecord = 'A:' + payload.antiA + ', B:' + payload.antiB + ', AB:' + payload.antiAB + ', D:' + payload.antiD;
  const serumTypeRecord = 'A:' + payload.cellA + ', B:' + payload.cellB + ', O:' + payload.cellO;

  updateObjectRow_(APP.sheets.requests, found.rowIndex, {
    Status: 'ready_crossmatch',
    CellType: cellTypeRecord,          // บันทึกผลเกรด Reaction ของ Cell
    SerumType: serumTypeRecord,        // บันทึกผลเกรด Reaction ของ Serum
    PatientABO: payload.conclusionAbo, // บันทึกผลสรุปกรุ๊ปเลือดที่แท้จริง
    PatientRh: payload.rh,
    GroupingAlert: '',
    GroupingVerifiedBy: payload.verifiedBy,
    GroupingVerifiedAt: nowText_(),
    UpdatedAt: nowText_(),
  });

  if (patient.rowIndex) {
    updateObjectRow_(APP.sheets.patients, patient.rowIndex, {
      HistoricalABO: payload.conclusionAbo,
      HistoricalRh: payload.rh,
      UpdatedAt: nowText_(),
    });
  }

  writeAudit_('MT', 'บันทึกผลหมู่เลือด', found.row.RequestID + ' สรุปผล: ' + payload.conclusionAbo + ' ' + payload.rh);
  return ok_('บันทึกผลและส่งต่อ Crossmatch แล้ว', getAppData());
}

function approveCrossmatch(payload) {
  ensureStructure_();
  payload = payload || {};
  
  // ตรวจสอบ Safety Lock 1: ถ้าสรุปผลว่า Incompatible ไม่อนุญาตให้ Approve
  if (payload.conclusion === 'Incompatible') {
    throw new Error('🚨 Safety Lock: ผลสรุปการทดสอบเป็น Incompatible ระบบไม่อนุญาตให้ Approve และไม่สามารถสร้างใบคล้องเลือดได้');
  }

  const request = findRowByKey_(APP.sheets.requests, 'RequestID', payload.requestId);
  const unit = findRowByKey_(APP.sheets.inventory, 'DonationID', cleanText_(payload.donationId).toUpperCase());
  if (!request.rowIndex || !unit.rowIndex) throw new Error('ไม่พบคำขอหรือถุงเลือด');
  if (unit.row.Status !== 'available') throw new Error('ถุงเลือดไม่พร้อมจ่ายหรือถูกล็อคแล้ว');

  // ตรวจสอบ Safety Lock 2: ข้อมูลถุงเลือดที่ MT เลือกในฟอร์ม ต้องตรงกับข้อมูลจริงของถุงเลือดในคลัง
  if (payload.unitAbo !== unit.row.ABO || payload.unitRh !== unit.row.Rh || payload.unitComponent !== unit.row.Component) {
    throw new Error(`🚨 Safety Lock: ข้อมูลถุงเลือดที่คุณระบุ (${payload.unitAbo} ${payload.unitRh} ${payload.unitComponent}) ไม่ตรงกับข้อมูลจริงในระบบ (${unit.row.ABO} ${unit.row.Rh} ${unit.row.Component}) กรุณาตรวจสอบถุงเลือดอีกครั้ง`);
  }

  // ตรวจสอบความเข้ากันได้ตามหลักการแพทย์ (Red Cell Compatibility)
  if (!isCompatible_(request.row.PatientABO, request.row.PatientRh, unit.row.ABO, unit.row.Rh)) {
    throw new Error('🚨 Safety Lock: หมู่เลือดของคนไข้และถุงเลือดไม่ Compatible กันตามหลักวิชาการ');
  }

  const crossmatchId = 'XM-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyMMddHHmmss');
  const tagCode = request.row.HN + '|' + unit.row.DonationID;
  
  // บันทึกข้อมูลโดย Map เข้าคอลัมน์เดิม (RT -> Major, 37c -> Minor, IAT -> AutoControl)
  const combinedVerifiedBy = cleanText_(payload.tester) + ' / ' + cleanText_(payload.checker);

  appendObject_(APP.sheets.crossmatches, {
    CrossmatchID: crossmatchId,
    RequestID: request.row.RequestID,
    HN: request.row.HN,
    DonationID: unit.row.DonationID,
    Major: payload.rt,            // เก็บผล RT
    Minor: payload.inc37,         // เก็บผล 37°C
    AutoControl: payload.iat,     // เก็บผล IAT
    Result: payload.conclusion,   // สรุปผล Compatible
    TagCode: tagCode,
    VerifiedBy: combinedVerifiedBy, // เก็บชื่อผู้ทดสอบ / ผู้ตรวจสอบ
    VerifiedAt: nowText_(),
    DispenseStatus: 'ready',
    Receiver: '',
    DispensedAt: '',
    ColdChainDueAt: '',
    UpdatedAt: nowText_(),
  });
  updateObjectRow_(APP.sheets.requests, request.rowIndex, { Status: 'crossmatched', UpdatedAt: nowText_() });
  updateObjectRow_(APP.sheets.inventory, unit.rowIndex, { Status: 'reserved', UpdatedAt: nowText_() });

  writeAudit_('MT', 'Approve Crossmatch', request.row.RequestID + ' กับ ' + unit.row.DonationID);
  return ok_('Crossmatch ผ่านและสร้างใบคล้องเลือดแล้ว', getAppData());
}

function dispenseBlood(payload) {
  ensureStructure_();
  payload = payload || {};
  const hn = cleanText_(payload.hn);
  const donationId = cleanText_(payload.donationId).toUpperCase();
  const tagCode = cleanText_(payload.tagCode);
  const receiver = cleanText_(payload.receiver);
  const dispenser = cleanText_(payload.dispenser); // รับค่าชื่อผู้จ่ายเลือดจากหน้าเว็บ

  const crossmatches = readSheetObjects_(APP.sheets.crossmatches);
  const match = crossmatches.find(function (row) {
    return row.HN === hn && row.DonationID === donationId && row.TagCode === tagCode && row.DispenseStatus === 'ready';
  });
  
  if (!match) {
    writeAudit_('bloodbank', 'Dispense rejected', 'HN ' + hn + ' Donation ' + donationId);
    throw new Error('ข้อมูล 3 จุดไม่ตรงกัน ระบบไม่จ่ายเลือด');
  }

  const xm = findRowByKey_(APP.sheets.crossmatches, 'CrossmatchID', match.CrossmatchID);
  const unit = findRowByKey_(APP.sheets.inventory, 'DonationID', donationId);
  const request = findRowByKey_(APP.sheets.requests, 'RequestID', match.RequestID);
  const dispensedAt = nowText_();
  const due = Utilities.formatDate(new Date(Date.now() + 30 * 60 * 1000), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

  // Map ข้อมูลผู้รับ และ ผู้จ่าย เข้าด้วยกันเพื่อเก็บบงคอลัมน์ Receiver เดิม
  const combinedReceiver = 'ผู้รับ: ' + receiver + ' / ผู้จ่าย: ' + dispenser;

  updateObjectRow_(APP.sheets.crossmatches, xm.rowIndex, {
    DispenseStatus: 'dispensed',
    Receiver: combinedReceiver,
    DispensedAt: dispensedAt,
    ColdChainDueAt: due,
    UpdatedAt: nowText_(),
  });
  
  if (unit.rowIndex) updateObjectRow_(APP.sheets.inventory, unit.rowIndex, { Status: 'dispensed', UpdatedAt: nowText_() });
  if (request.rowIndex) updateObjectRow_(APP.sheets.requests, request.rowIndex, { Status: 'dispensed', UpdatedAt: nowText_() });

  writeAudit_('bloodbank', 'จ่ายเลือด', donationId + ' ให้ HN ' + hn + ' ' + combinedReceiver);
  return ok_('Match: จ่ายเลือดสำเร็จ บันทึกเวลาออกจากตู้แช่แล้ว', getAppData());
}

function uploadStandaloneFile(payload) {
  ensureStructure_();
  payload = payload || {};
  const uploaded = uploadBase64File_(payload, cleanText_(payload.ownerType) || 'General', cleanText_(payload.ownerId) || 'GENERAL');
  writeAudit_('system', 'Upload file', uploaded.fileId + ' ' + uploaded.driveUrl);
  return ok_('อัปโหลดไฟล์เรียบร้อย', uploaded);
}

function getCompatibleUnits(requestId) {
  ensureStructure_();
  const request = findRowByKey_(APP.sheets.requests, 'RequestID', requestId);
  if (!request.rowIndex) return [];
  return readSheetObjects_(APP.sheets.inventory)
    .filter(function (unit) {
      return unit.Status === 'available' &&
        unit.Component === request.row.Component &&
        daysUntil_(unit.ExpiresAt) >= 0 &&
        isCompatible_(request.row.PatientABO, request.row.PatientRh, unit.ABO, unit.Rh);
    })
    .sort(function (a, b) {
      return new Date(a.ExpiresAt) - new Date(b.ExpiresAt);
    });
}

function ensureStructure_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(HEADERS).forEach(function (sheetName) {
    const sheet = getOrCreateSheet_(ss, sheetName);
    if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getDisplayValue() !== HEADERS[sheetName][0]) {
      buildSheet_(sheet, HEADERS[sheetName]);
    } else {
      applyTextFormat_(sheet, HEADERS[sheetName].length);
    }
  });
}

function seedDefaultUsers_() {
  const sheet = getSheet_(APP.sheets.users);
  if (!sheet || sheet.getLastRow() > 1) return;
  appendRows_(sheet, [
    ['admin', 'admin1234', 'ผู้ดูแลระบบ', 'ADMIN', 'TRUE', nowText_(), nowText_(), ''],
    ['mt01', 'mt1234', 'นักเทคนิคการแพทย์', 'MT', 'TRUE', nowText_(), nowText_(), ''],
    ['doctor01', 'doctor1234', 'แพทย์', 'DOCTOR', 'TRUE', nowText_(), nowText_(), ''],
  ]);
}

function getPublicUsers_() {
  return readSheetObjects_(APP.sheets.users).map(function (user) {
    return {
      Username: user.Username,
      FullName: user.FullName,
      Role: user.Role,
      Active: user.Active,
      CreatedAt: user.CreatedAt,
      UpdatedAt: user.UpdatedAt,
      LastLoginAt: user.LastLoginAt,
    };
  });
}

function buildSheet_(sheet, headers) {
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#e8f3f1');
  sheet.setFrozenRows(1);
  applyTextFormat_(sheet, headers.length);
  sheet.autoResizeColumns(1, headers.length);
}

function applyTextFormat_(sheet, width) {
  const columns = width || Math.max(sheet.getLastColumn(), 1);
  sheet.getRange(1, 1, Math.max(sheet.getMaxRows(), 1), columns).setNumberFormat('@');
}

function readSheetObjects_(sheetName) {
  const sheet = getSheet_(sheetName);
  if (!sheet) return [];
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return [];
  const values = sheet.getRange(1, 1, lastRow, lastCol).getDisplayValues();
  if (!values || !values.length) return [];
  const headers = values.shift().map(cleanText_);
  return values
    .filter(function (row) { return row.some(function (cell) { return cleanText_(cell) !== ''; }); })
    .map(function (row) {
      const obj = {};
      headers.forEach(function (header, index) {
        obj[header] = cleanText_(row[index]);
      });
      return obj;
    });
}

function appendObject_(sheetName, obj) {
  const sheet = getSheet_(sheetName);
  const headers = getHeaders_(sheet);
  appendRows_(sheet, [headers.map(function (header) { return forceText_(obj[header]); })]);
}

function appendRows_(sheet, rows) {
  if (!rows || !rows.length) return;
  const safeRows = rows.map(function (row) {
    return row.map(forceText_);
  });
  const startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, safeRows.length, safeRows[0].length).setNumberFormat('@').setValues(safeRows);
}

function updateObjectRow_(sheetName, rowIndex, obj) {
  const sheet = getSheet_(sheetName);
  const headers = getHeaders_(sheet);
  Object.keys(obj).forEach(function (key) {
    setCellByHeader_(sheet, headers, rowIndex, key, obj[key]);
  });
}

function setCellByHeader_(sheet, headers, rowIndex, key, value) {
  const col = headers.indexOf(key) + 1;
  if (col <= 0) return;
  sheet.getRange(rowIndex, col).setNumberFormat('@').setValue(forceText_(value));
}

function findRowByKey_(sheetName, key, value) {
  const data = readSheetObjects_(sheetName);
  const cleanValue = cleanText_(value);
  for (let i = 0; i < data.length; i += 1) {
    if (cleanText_(data[i][key]) === cleanValue) {
      return { rowIndex: i + 2, row: data[i] };
    }
  }
  return { rowIndex: 0, row: null };
}

function uploadBase64File_(payload, ownerType, ownerId) {
  const folderId = getSetting_(APP.settingKeys.folderId) || ensureDriveFolder_();
  const folder = DriveApp.getFolderById(folderId);
  const bytes = Utilities.base64Decode(String(payload.base64 || '').split(',').pop());
  const mimeType = cleanText_(payload.mimeType) || 'application/octet-stream';
  const fileName = cleanText_(payload.fileName) || ('upload-' + new Date().getTime());
  const blob = Utilities.newBlob(bytes, mimeType, fileName);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  const fileId = file.getId();
  const driveUrl = file.getUrl();
  const isImage = mimeType.indexOf('image/') === 0;
  const lh3Url = isImage ? 'https://lh3.googleusercontent.com/d/' + fileId : '';
  appendObject_(APP.sheets.attachments, {
    AttachmentID: 'ATT-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyMMddHHmmssSSS'),
    OwnerType: ownerType,
    OwnerID: ownerId,
    FileName: fileName,
    MimeType: mimeType,
    FileId: fileId,
    DriveUrl: driveUrl,
    Lh3Url: lh3Url,
    UploadedAt: nowText_(),
  });
  return { fileId: fileId, driveUrl: isImage ? lh3Url : driveUrl, originalDriveUrl: driveUrl, lh3Url: lh3Url };
}

function ensureDriveFolder_() {
  const existing = getSetting_(APP.settingKeys.folderId);
  if (existing) {
    try {
      DriveApp.getFolderById(existing);
      return existing;
    } catch (err) {
      // Create a new folder below if the saved ID is invalid.
    }
  }
  const folder = DriveApp.createFolder('BloodBankUploads');
  upsertSetting_(APP.settingKeys.folderId, folder.getId(), 'Google Drive folder ID for uploaded images and documents');
  return folder.getId();
}

function getSetting_(key) {
  const found = findRowByKey_(APP.sheets.settings, 'Key', key);
  return found.row ? found.row.Value : '';
}

function upsertSetting_(key, value, description) {
  const found = findRowByKey_(APP.sheets.settings, 'Key', key);
  if (found.rowIndex) {
    updateObjectRow_(APP.sheets.settings, found.rowIndex, { Value: value, Description: description, UpdatedAt: nowText_() });
  } else {
    appendObject_(APP.sheets.settings, { Key: key, Value: value, Description: description, UpdatedAt: nowText_() });
  }
}

function applyExpiryHardStop_() {
  const sheet = getSheet_(APP.sheets.inventory);
  const rows = readSheetObjects_(APP.sheets.inventory);
  const headers = getHeaders_(sheet);
  rows.forEach(function (unit, index) {
    if (daysUntil_(unit.ExpiresAt) < 0 && ['discard', 'dispensed'].indexOf(unit.Status) === -1) {
      setCellByHeader_(sheet, headers, index + 2, 'Status', 'discard');
      setCellByHeader_(sheet, headers, index + 2, 'UpdatedAt', nowText_());
      writeAudit_('system', 'Hard Stop expired', unit.DonationID + ' หมดอายุและถูกล็อคเป็น Discard');
    }
  });
}

function writeAudit_(user, action, detail) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss, APP.sheets.audit);
  if (sheet.getLastRow() === 0) buildSheet_(sheet, HEADERS.AuditTrail);
  appendObject_(APP.sheets.audit, {
    AuditID: 'AUD-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyMMddHHmmssSSS'),
    At: nowText_(),
    User: user,
    Action: action,
    Detail: detail,
  });
}

function isCompatible_(patientAbo, patientRh, unitAbo, unitRh) {
  const redCell = {
    O: ['O'],
    A: ['A', 'O'],
    B: ['B', 'O'],
    AB: ['AB', 'A', 'B', 'O'],
  };
  return redCell[patientAbo] &&
    redCell[patientAbo].indexOf(unitAbo) >= 0 &&
    (patientRh === 'Positive' || unitRh === 'Negative');
}

function getOrCreateSheet_(ss, sheetName) {
  return ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
}

function getSheet_(sheetName) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
}

function getHeaders_(sheet) {
  const lastCol = sheet.getLastColumn();
  if (lastCol < 1) return [];
  return sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0].map(cleanText_);
}

function cleanText_(value) {
  return value === null || value === undefined ? '' : String(value).replace(/^'/, '').trim();
}

function forceText_(value) {
  const text = cleanText_(value);
  return text === '' ? '' : "'" + text;
}

function emptyAttachment_() {
  return { fileId: '', driveUrl: '', originalDriveUrl: '', lh3Url: '' };
}

function ok_(message, data) {
  return { ok: true, message: message, data: data || null };
}

function nowText_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}

function dateOffset_(base, offset) {
  const d = new Date(base.getTime());
  d.setDate(d.getDate() + offset);
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function daysUntil_(dateText) {
  const clean = cleanText_(dateText);
  if (!clean) return 9999;
  const parts = clean.split('-').map(Number);
  const target = new Date(parts[0], parts[1] - 1, parts[2]);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

function deleteBloodUnit(payload) {
  ensureStructure_();
  payload = payload || {};
  const session = assertRole_(payload.sessionToken, ['ADMIN', 'MT']);
  const donationId = cleanText_(payload.donationId).toUpperCase();
  if (!donationId) throw new Error('กรุณาระบุ Donation ID');
  const found = findRowByKey_(APP.sheets.inventory, 'DonationID', donationId);
  if (!found.rowIndex) throw new Error('ไม่พบข้อมูลถุงเลือดนี้ในระบบ');

  const sheet = getSheet_(APP.sheets.inventory);
  sheet.deleteRow(found.rowIndex);

  writeAudit_(session.Username, 'ลบถุงเลือด', donationId);
  return ok_('ลบข้อมูลถุงเลือดเรียบร้อย', getAppData());
}

function cancelReservation(payload) {
  ensureStructure_();
  payload = payload || {};
  const session = assertRole_(payload.sessionToken, ['ADMIN', 'MT']);
  const donationId = cleanText_(payload.donationId).toUpperCase();
  if (!donationId) throw new Error('กรุณาระบุ Donation ID');
  
  const foundUnit = findRowByKey_(APP.sheets.inventory, 'DonationID', donationId);
  if (!foundUnit.rowIndex) throw new Error('ไม่พบข้อมูลถุงเลือดนี้ในระบบ');
  if (foundUnit.row.Status !== 'reserved') throw new Error('ถุงเลือดนี้ไม่ได้อยู่ในสถานะถูกจอง');

  // 1. Update unit status in BloodInventory to available
  updateObjectRow_(APP.sheets.inventory, foundUnit.rowIndex, {
    Status: 'available',
    UpdatedAt: nowText_()
  });

  // 2. Find the crossmatch record for this donation unit that is 'ready' (not dispensed yet)
  const crossmatches = readSheetObjects_(APP.sheets.crossmatches);
  let crossmatchRecord = null;
  let crossmatchRowIndex = 0;
  for (let i = 0; i < crossmatches.length; i++) {
    if (cleanText_(crossmatches[i].DonationID).toUpperCase() === donationId && crossmatches[i].DispenseStatus === 'ready') {
      crossmatchRecord = crossmatches[i];
      crossmatchRowIndex = i + 2;
      break;
    }
  }

  if (crossmatchRecord) {
    // Find the request associated with this crossmatch
    const foundRequest = findRowByKey_(APP.sheets.requests, 'RequestID', crossmatchRecord.RequestID);
    if (foundRequest.rowIndex && foundRequest.row.Status === 'crossmatched') {
      // Update request status back to ready_crossmatch
      updateObjectRow_(APP.sheets.requests, foundRequest.rowIndex, {
        Status: 'ready_crossmatch',
        UpdatedAt: nowText_()
      });
    }
    
    // Delete the crossmatch record
    const xmSheet = getSheet_(APP.sheets.crossmatches);
    xmSheet.deleteRow(crossmatchRowIndex);
  }

  writeAudit_(session.Username, 'ยกเลิกการจอง (คืนคลัง)', donationId + (crossmatchRecord ? ' (คำขอ ' + crossmatchRecord.RequestID + ')' : ''));
  return ok_('ยกเลิกการจองและคืนคลังเลือดเรียบร้อย', getAppData());
}