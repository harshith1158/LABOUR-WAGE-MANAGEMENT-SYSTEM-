const sqlite3 = require('sqlite3').verbose();
const xlsx = require('xlsx');

const db = new sqlite3.Database('./jobs.db', (err) => {
  if (err) return console.error("❌ Failed to open DB:", err.message);
  console.log("📦 Connected to SQLite database: jobs.db");
});

// ----------- Date Helpers ------------
function formatDate(excelDate) {
  if (typeof excelDate === 'number') {
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0];
  } else if (typeof excelDate === 'string') {
    const parts = excelDate.split('-');
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : excelDate;
  }
  return '';
}

function extractYear(dateStr) {
  return dateStr?.split('-')[0] || '';
}

function extractMonth(dateStr) {
  return dateStr?.split('-')[1] || '';
}

// ----------- Main Import Logic ------------
function importExcel() {
  db.serialize(() => {
    db.run("DELETE FROM jobs");
    db.run("DELETE FROM workers");
    db.run("DELETE FROM attendance");
    console.log("🧹 Old data cleared");

    // ---------------- JOBS ----------------
    const jobBook = xlsx.readFile('./contract master (2).xlsx');
    const jobs = xlsx.utils.sheet_to_json(jobBook.Sheets[jobBook.SheetNames[0]]);
    const insertJobs = db.prepare(`
      INSERT INTO jobs (job_cd, contractor_name, contractor_address, job_start_dt, job_end_dt, job_desc)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    jobs.forEach(row => {
      insertJobs.run(
        row["JOB_CD"],
        row["CONTRACTOR_NAME"],
        row["CONTRACTOR_ADDRESS"],
        row["JOB_START_DT"],
        row["JOB_END_DT"],
        row["JOB_DESC"]
      );
    });
    insertJobs.finalize();
    console.log("✅ Contract Master imported");

    // ---------------- WORKERS ----------------
    const workerBook = xlsx.readFile('./workers details.xlsx');
    const workers = xlsx.utils.sheet_to_json(workerBook.Sheets[workerBook.SheetNames[0]]);
    const insertWorkers = db.prepare(`
      INSERT INTO workers (job_cd, adhar_id, gpass_no, worker_name, worker_skill, dob)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    workers.forEach(row => {
      insertWorkers.run(
        row["JOB_CD"],
        row["ADHAR_ID"],
        row["GPASS_NO"],
        row["WORKER_NAME"],
        row["WORKER_SKILL"],
        row["DOB"]
      );
    });
    insertWorkers.finalize();
    console.log("✅ Workers imported");

    // ---------------- ATTENDANCE ----------------
    const attendanceBook = xlsx.readFile('./attendance (1).xlsx');
    const attendance = xlsx.utils.sheet_to_json(attendanceBook.Sheets[attendanceBook.SheetNames[0]]);
    const insertAttendance = db.prepare(`
      INSERT INTO attendance (w_date, adhar_id, in_time, out_time, device_name_in, device_name_out, year, month)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    attendance.forEach(row => {
      const formattedDate = formatDate(row["W_DATE"]);
      const year = extractYear(formattedDate);
      const month = extractMonth(formattedDate);
      insertAttendance.run(
        formattedDate,
        row["ADHAR_ID"],
        row["IN_TIME"],
        row["OUT_TIME"],
        row["DEVICE_NAME_IN"] || '',
        row["DEVICE_NAME_OUT"] || '',
        year,
        month
      );
    });
    insertAttendance.finalize();
    console.log("✅ Attendance imported with year/month");
  });
}

importExcel();
