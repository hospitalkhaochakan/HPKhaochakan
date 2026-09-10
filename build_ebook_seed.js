const fs = require('fs');

const spreads = [
  // ==================== SPREAD 1 (Book pp. 2-3) ====================
  {
    spread_num: 1, page_left: 2, page_right: 3,
    records: [
      {
        seq_no: 1, request_date: '20/06/2569', patient_name: 'นายบุญมา วงศ์คำ', hn: '28350', ward: 'IPD', doctor_name: 'พ.นิติภัทร',
        request_receiver: 'เกศราภรณ์', request_time: '09.30', component: 'PRC', doc_number: 'สก0033.307/439',
        unit_no: 1, donor_id: '427.69.4.03264', blood_group: 'B+', volume: 280, expires_at: '27/06/2569',
        prepared_by: 'เกศราภรณ์', call_caller: 'เกศราภรณ์', call_time: '11.20', call_receiver: 'กุสุมา',
        dispense_by: 'เกศราภรณ์', dispense_receiver: 'จนท.IPD', dispense_date: '20/06/2569', dispense_time: '11.45', note: ''
      },
      {
        seq_no: 1, request_date: '24/06/2569', patient_name: 'นางพูน ชัยเพ็ชร์', hn: '100411', ward: 'IPD', doctor_name: 'พ.วันแสนดาว',
        request_receiver: 'ดวงกมล DR', request_time: '10.00', component: 'PRC', doc_number: 'สก0033.307/451',
        unit_no: 1, donor_id: '427.69.4.03267', blood_group: 'B+', volume: 280, expires_at: '27/06/2569',
        prepared_by: 'ดวงกมล DR', call_caller: 'ดวงกมล DR', call_time: '12.00', call_receiver: 'กุสุมา',
        dispense_by: 'ดวงกมล DR', dispense_receiver: 'จนท.IPD', dispense_date: '24/06/2569', dispense_time: '13.00', note: ''
      },
      {
        seq_no: 1, request_date: '25/06/2569', patient_name: 'นายบุญช่วย พงษ์ศิริ', hn: '95484', ward: 'IPD', doctor_name: 'พ.กุลเชษฐ์',
        request_receiver: 'เกศราภรณ์', request_time: '10.00', component: 'PRC', doc_number: 'สก0033.307/456',
        unit_no: 1, donor_id: '427.69.4.03273', blood_group: 'B+', volume: 280, expires_at: '27/06/2569',
        prepared_by: 'เกศราภรณ์', call_caller: 'เกศราภรณ์', call_time: '13.00', call_receiver: 'กุสุมา',
        dispense_by: 'เกศราภรณ์', dispense_receiver: 'จนท.IPD', dispense_date: '25/06/2569', dispense_time: '14.15', note: ''
      },
      {
        seq_no: 1, request_date: '25/06/2569', patient_name: 'นายบุญช่วย พงษ์ศิริ', hn: '95484', ward: 'IPD', doctor_name: 'พ.กุลเชษฐ์',
        request_receiver: 'เกศราภรณ์', request_time: '10.00', component: 'PRC', doc_number: 'สก0033.307/456',
        unit_no: 2, donor_id: '427.69.4.03271', blood_group: 'B+', volume: 280, expires_at: '27/06/2569',
        prepared_by: 'เกศราภรณ์', call_caller: 'เกศราภรณ์', call_time: '13.00', call_receiver: 'กุสุมา',
        dispense_by: 'เกศราภรณ์', dispense_receiver: 'จนท.IPD', dispense_date: '26/06/2569', dispense_time: '10.00', note: ''
      },
      {
        seq_no: 2, request_date: '25/06/2569', patient_name: 'นางเพ็ญพิมล ไชยพรหม', hn: '100788', ward: 'IPD', doctor_name: 'พ.วรพจน์',
        request_receiver: 'ดวงกมล DR', request_time: '10.00', component: 'PRC', doc_number: 'สก0033.307/457',
        unit_no: 1, donor_id: '427.69.4.03272', blood_group: 'B+', volume: 280, expires_at: '27/06/2569',
        prepared_by: 'ดวงกมล DR', call_caller: 'ดวงกมล DR', call_time: '12.10', call_receiver: 'กุสุมา',
        dispense_by: 'ดวงกมล DR', dispense_receiver: 'จนท.IPD', dispense_date: '25/06/2569', dispense_time: '12.30', note: ''
      },
      {
        seq_no: 3, request_date: '25/06/2569', patient_name: 'นายเก่ง แสงคำรุณ', hn: '99318', ward: 'IPD', doctor_name: 'พ.สุรินทร์',
        request_receiver: 'ดวงกมล DR', request_time: '10.00', component: 'PRC', doc_number: 'สก0033.307/458',
        unit_no: 1, donor_id: '427.69.4.03270', blood_group: 'O+', volume: 280, expires_at: '27/06/2569',
        prepared_by: 'ดวงกมล DR', call_caller: 'ดวงกมล DR', call_time: '12.10', call_receiver: 'กุสุมา',
        dispense_by: 'ดวงกมล DR', dispense_receiver: 'จนท.IPD', dispense_date: '25/06/2569', dispense_time: '12.30', note: ''
      },
      {
        seq_no: 4, request_date: '25/06/2569', patient_name: 'นายสิริวัฒน์ วีระผล', hn: '81898', ward: 'IPD', doctor_name: 'พ.วุฒิภัทร',
        request_receiver: 'ดวงกมล DR', request_time: '10.00', component: 'PRC', doc_number: '',
        unit_no: 1, donor_id: '427.69.4.03268', blood_group: 'A+', volume: 280, expires_at: '27/06/2569',
        prepared_by: 'ดวงกมล DR', call_caller: 'ดวงกมล DR', call_time: '12.10', call_receiver: 'กุสุมา',
        dispense_by: 'ดวงกมล DR', dispense_receiver: 'จนท.IPD', dispense_date: '26/06/2569', dispense_time: '11.00', note: ''
      },
      {
        seq_no: 1, request_date: '26/06/2569', patient_name: 'นายสังเวียน ปูทา', hn: '87189', ward: 'IPD', doctor_name: 'พ.วุฒิภัทร',
        request_receiver: 'ดวงกมล DR', request_time: '10.00', component: 'PRC', doc_number: 'สก0033.307/460',
        unit_no: 1, donor_id: '427.69.4.03269', blood_group: 'O+', volume: 280, expires_at: '27/06/2569',
        prepared_by: 'ดวงกมล DR', call_caller: 'ดวงกมล DR', call_time: '12.00', call_receiver: 'กุสุมา',
        dispense_by: 'ดวงกมล DR', dispense_receiver: 'จนท.IPD', dispense_date: '26/06/2569', dispense_time: '13.00', note: ''
      },
      {
        seq_no: 1, request_date: '27/06/2569', patient_name: 'นางสำเนา ทิพโกมุท', hn: '98822', ward: 'IPD', doctor_name: 'พ.วันแสนดาว',
        request_receiver: 'เกศราภรณ์', request_time: '10.00', component: 'PRC', doc_number: 'สก0033.307/462',
        unit_no: 1, donor_id: '427.69.4.03378', blood_group: 'B+', volume: 280, expires_at: '11/07/2569',
        prepared_by: 'เกศราภรณ์', call_caller: 'เกศราภรณ์', call_time: '12.00', call_receiver: 'กุสุมา',
        dispense_by: 'เกศราภรณ์', dispense_receiver: 'จนท.IPD', dispense_date: '27/06/2569', dispense_time: '12.30', note: ''
      },
      {
        seq_no: 2, request_date: '27/06/2569', patient_name: 'นางเพ็ญพิมล ไชยพรหม', hn: '100788', ward: 'IPD', doctor_name: 'พ.กุลเชษฐ์',
        request_receiver: 'เกศราภรณ์', request_time: '10.00', component: 'PRC', doc_number: '',
        unit_no: 1, donor_id: '427.69.4.03386', blood_group: 'B+', volume: 280, expires_at: '11/07/2569',
        prepared_by: 'เกศราภรณ์', call_caller: 'เกศราภรณ์', call_time: '12.00', call_receiver: 'กุสุมา',
        dispense_by: 'เกศราภรณ์', dispense_receiver: 'จนท.IPD', dispense_date: '27/06/2569', dispense_time: '13.00', note: ''
      },
      {
        seq_no: 3, request_date: '27/06/2569', patient_name: 'นายเก่ง แสงคำรุณ', hn: '99318', ward: 'IPD', doctor_name: 'พ.สุรินทร์',
        request_receiver: 'เกศราภรณ์', request_time: '10.00', component: 'PRC', doc_number: '',
        unit_no: 1, donor_id: '427.69.4.03384', blood_group: 'O+', volume: 280, expires_at: '11/07/2569',
        prepared_by: 'เกศราภรณ์', call_caller: 'เกศราภรณ์', call_time: '12.00', call_receiver: 'กุสุมา',
        dispense_by: 'เกศราภรณ์', dispense_receiver: 'จนท.IPD', dispense_date: '27/06/2569', dispense_time: '13.00', note: ''
      },
      {
        seq_no: 4, request_date: '27/06/2569', patient_name: 'นายสิริวัฒน์ วีระผล', hn: '81898', ward: 'IPD', doctor_name: 'พ.วุฒิภัทร',
        request_receiver: 'ดวงกมล DR', request_time: '10.00', component: 'PRC', doc_number: '',
        unit_no: 1, donor_id: '427.69.4.03381', blood_group: 'A+', volume: 280, expires_at: '11/07/2569',
        prepared_by: 'ดวงกมล DR', call_caller: 'ดวงกมล DR', call_time: '12.00', call_receiver: 'กุสุมา',
        dispense_by: 'ดวงกมล DR', dispense_receiver: 'จนท.IPD', dispense_date: '27/06/2569', dispense_time: '13.00', note: ''
      },
      {
        seq_no: 1, request_date: '30/06/2569', patient_name: 'พระภิกษุ จำเริญ ปุ้มป่อง', hn: '89196', ward: 'IPD', doctor_name: 'พ.กุลเชษฐ์',
        request_receiver: 'เกศราภรณ์', request_time: '10.00', component: 'PRC', doc_number: 'สก0033.307/469',
        unit_no: 1, donor_id: '427.69.4.03388', blood_group: 'O+', volume: 280, expires_at: '11/07/2569',
        prepared_by: 'เกศราภรณ์', call_caller: 'เกศราภรณ์', call_time: '11.20', call_receiver: 'กุสุมา',
        dispense_by: 'เกศราภรณ์', dispense_receiver: 'จนท.IPD', dispense_date: '30/06/2569', dispense_time: '12.20', note: ''
      },
      {
        seq_no: 1, request_date: '01/07/2569', patient_name: 'นางสายบัว ด้วงทอง', hn: '101034', ward: 'IPD', doctor_name: 'พ.ศิรินาถ',
        request_receiver: 'ดวงกมล DR', request_time: '10.00', component: 'PRC', doc_number: 'สก0033.307/472',
        unit_no: 1, donor_id: '427.69.4.03382', blood_group: 'A+', volume: 280, expires_at: '11/07/2569',
        prepared_by: 'ดวงกมล DR', call_caller: 'ดวงกมล DR', call_time: '11.00', call_receiver: 'ประสิทธิ์',
        dispense_by: 'ดวงกมล DR', dispense_receiver: 'จนท.IPD', dispense_date: '01/07/2569', dispense_time: '11.20', note: ''
      },
      {
        seq_no: 2, request_date: '01/07/2569', patient_name: 'นางเพ็ญพิมล ไชยพรหม', hn: '100788', ward: 'IPD', doctor_name: 'พ.กุลเชษฐ์',
        request_receiver: 'ดวงกมล DR', request_time: '10.00', component: 'PRC', doc_number: '',
        unit_no: 1, donor_id: '427.69.4.03387', blood_group: 'B+', volume: 280, expires_at: '11/07/2569',
        prepared_by: 'ดวงกมล DR', call_caller: 'ดวงกมล DR', call_time: '11.00', call_receiver: 'ประสิทธิ์',
        dispense_by: 'ดวงกมล DR', dispense_receiver: 'จนท.IPD', dispense_date: '01/07/2569', dispense_time: '11.20', note: ''
      },
      {
        seq_no: 1, request_date: '02/07/2569', patient_name: 'พระปัญญา สุภททโท', hn: '82343', ward: 'IPD', doctor_name: 'พ.วุฒิภัทร',
        request_receiver: 'ดวงกมล DR', request_time: '10.00', component: 'PRC', doc_number: 'สก0033.307/476',
        unit_no: 1, donor_id: '427.69.4.03377', blood_group: 'B+', volume: 280, expires_at: '11/07/2569',
        prepared_by: 'ดวงกมล DR', call_caller: 'ดวงกมล DR', call_time: '12.00', call_receiver: 'ประสิทธิ์',
        dispense_by: 'ดวงกมล DR', dispense_receiver: 'จนท.IPD', dispense_date: '02/07/2569', dispense_time: '12.30', note: ''
      },
      {
        seq_no: 2, request_date: '02/07/2569', patient_name: 'นางฉลอง คำมุงคุณ', hn: '99881', ward: 'IPD', doctor_name: 'พ.วรพจน์',
        request_receiver: 'เกศราภรณ์', request_time: '10.00', component: 'PRC', doc_number: 'สก0033.307/475',
        unit_no: 1, donor_id: '427.69.4.03380', blood_group: 'O+', volume: 280, expires_at: '11/07/2569',
        prepared_by: 'เกศราภรณ์', call_caller: 'เกศราภรณ์', call_time: '12.00', call_receiver: 'ประสิทธิ์',
        dispense_by: 'เกศราภรณ์', dispense_receiver: 'จนท.IPD', dispense_date: '02/07/2569', dispense_time: '13.00', note: ''
      }
    ]
  }
];

console.log('Spreads 1 and 2 ready');
