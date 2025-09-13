const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const xlsx = require('xlsx');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const ExcelJS = require('exceljs');
const app = express();
const PORT = 3000;

// Database setup
const db = new sqlite3.Database('./jobs.db');

// Middleware setup
app.use(session({
  secret: 'vsp_super_secure_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// Redirect root URL to welcome.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/welcome.html'));
});


// Multer setup for Excel uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// --- Upload Routes ---

app.post('/upload-jobs', upload.single('excel'), (req, res) => {
  const filePath = req.file.path;
  const workbook = xlsx.readFile(filePath);
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

  const stmt = db.prepare(`
      INSERT INTO jobs (job_cd, contractor_name, contractor_address, job_start_dt, job_end_dt, job_desc)
      VALUES (?, ?, ?, ?, ?, ?)
  `);
  data.forEach(row => {
    stmt.run(
      row.job_cd,
      row.contractor_name,
      row.contractor_address,
      row.job_start_dt,
      row.job_end_dt,
      row.job_desc
    );
  });
  stmt.finalize();
  fs.unlinkSync(filePath);
  res.send('✅ Jobs uploaded successfully.');
});

app.post('/upload-workers', upload.single('excel'), (req, res) => {
  const filePath = req.file.path;
  const workbook = xlsx.readFile(filePath);
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

  const stmt = db.prepare(`
      INSERT INTO workers (job_cd, adhar_id, gpass_no, worker_name, worker_skill, dob)
      VALUES (?, ?, ?, ?, ?, ?)
  `);
  data.forEach(row => {
    stmt.run(
      row.job_cd,
      row.adhar_id,
      row.gpass_no,
      row.worker_name,
      row.worker_skill,
      row.dob
    );
  });
  stmt.finalize();
  fs.unlinkSync(filePath);
  res.send('✅ Workers uploaded successfully.');
});

app.post('/upload-attendance', upload.single('excel'), (req, res) => {
  const filePath = req.file.path;
  const workbook = xlsx.readFile(filePath);
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

  const stmt = db.prepare(`
    INSERT INTO attendance (
      w_date, adhar_id, in_time, out_time, device_name_in, device_name_out,
      job_cd, contractor_name, year, month
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  data.forEach(row => {
    const wDate = row.w_date;
    const year = wDate.split("-")[2]; // Assumes format: DD-MM-YYYY
    const month = wDate.split("-")[1];

    const adhar_id = row.adhar_id;

    db.get(`SELECT job_cd FROM workers WHERE adhar_id = ?`, [adhar_id], (err, workerRow) => {
      if (!workerRow) return;

      db.get(`SELECT contractor_name FROM jobs WHERE job_cd = ?`, [workerRow.job_cd], (err, jobRow) => {
        const job_cd = workerRow.job_cd;
        const contractor_name = jobRow ? jobRow.contractor_name : '';

        stmt.run(
          wDate,
          adhar_id,
          row.in_time,
          row.out_time,
          row.device_name_in,
          row.device_name_out,
          job_cd,
          contractor_name,
          year,
          month
        );
      });
    });
  });

  stmt.finalize();
  fs.unlinkSync(filePath);
  res.send('✅ Attendance uploaded and updated with job_cd/year/month!');
});
// Login route
app.post('/login', (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({ message: 'Mobile and password required' });
  }

  db.get(`SELECT * FROM users WHERE mobile = ?`, [mobile], (err, user) => {
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    return res.status(200).json({ message: 'Login successful' });
  });
});
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.status(200).send("Logged out");
  });
});



// Register route
app.post('/register', (req, res) => {
  const { name, email, mobile, dob, password, confirmPassword } = req.body;

  if (!name || !email || !mobile || !dob || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Check if user exists
  db.get(`SELECT * FROM users WHERE mobile = ? OR email = ?`, [mobile, email], (err, row) => {
    if (row) {
      return res.status(409).json({ message: 'Mobile or email already registered' });
    }

    const stmt = db.prepare(`
      INSERT INTO users (name, email, mobile, dob, password)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(name, email, mobile, dob, password, function (err) {
      if (err) {
        return res.status(500).json({ message: 'Registration failed' });
      }
      return res.status(201).json({ message: 'Registered successfully' });
    });
  });
});


// --- Dropdown Routes ---

app.get('/api/jobcodes', (req, res) => {
  db.all("SELECT DISTINCT job_cd FROM jobs", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const codes = rows.map(r => r.job_cd);
    res.json(codes);
  });
});


app.get('/api/contractors', (req, res) => {
  db.all("SELECT DISTINCT contractor_name FROM jobs", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const names = rows.map(r => r.contractor_name);
    res.json(names);
  });
});

// --- Wage Sheet Generation ---

app.post('/api/wages', (req, res) => {
  const { jobCode, contractorName, year, month } = req.body;

  const getWageRate = (skill) => {
    switch (skill.toLowerCase()) {
      case 'sk': return 600;
      case 'usk': return 400;
      case 'supervisor': return 750;
      default: return 500;
    }
  };

  const query = `
    SELECT 
      w.adhar_id,
      w.worker_name,
      w.worker_skill,
      w.job_cd,
      j.contractor_name,
      COUNT(a.w_date) AS present_days
    FROM attendance a
    JOIN workers w ON a.adhar_id = w.adhar_id
    JOIN jobs j ON w.job_cd = j.job_cd
    WHERE w.job_cd = ? AND j.contractor_name = ?
      AND a.year = ? AND a.month = ?
    GROUP BY w.adhar_id
  `;

  db.all(query, [jobCode, contractorName, year, month], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const result = rows.map(row => {
      const rate = getWageRate(row.worker_skill);
      const total = row.present_days * rate;

      return {
        adhar_id: row.adhar_id,
        worker_name: row.worker_name,
        job_cd: row.job_cd,
        contractor_name: row.contractor_name,
        present_days: row.present_days,
        wage_rate: rate,
        total_wage: total
      };
    });

    res.json(result);
  });
});

// API: Get contractor name and available attendance dates for a job code
app.get('/api/job-info', (req, res) => {
  const { jobCode } = req.query;

  const contractorQuery = `SELECT DISTINCT contractor_name FROM jobs WHERE job_cd = ?`;
  const dateQuery = `
    SELECT DISTINCT 
      strftime('%Y', w_date) AS year, 
      strftime('%m', w_date) AS month
    FROM attendance a
    JOIN workers w ON a.adhar_id = w.adhar_id
    WHERE w.job_cd = ?
    ORDER BY year DESC, month DESC
  `;

  db.get(contractorQuery, [jobCode], (err, contractorRow) => {
    if (err || !contractorRow) {
      return res.status(500).json({ error: 'Contractor not found' });
    }

    db.all(dateQuery, [jobCode], (err2, dateRows) => {
      if (err2) {
        return res.status(500).json({ error: 'Date fetch error' });
      }

      res.json({
        contractor: contractorRow.contractor_name,
        dates: dateRows
      });
    });
  });
});



// --- Excel Export Route ---

app.get('/api/wages/export', async (req, res) => {
  const { jobCode, contractorName, year, month } = req.query;

  const getWageRate = (skill) => {
    switch (skill.toLowerCase()) {
      case 'sk': return 600;
      case 'usk': return 400;
      case 'supervisor': return 750;
      default: return 500;
    }
  };

  const query = `
    SELECT 
      w.adhar_id,
      w.worker_name,
      w.worker_skill,
      w.job_cd,
      j.contractor_name,
      COUNT(a.w_date) AS present_days
    FROM attendance a
    JOIN workers w ON a.adhar_id = w.adhar_id
    JOIN jobs j ON w.job_cd = j.job_cd
    WHERE w.job_cd = ? AND j.contractor_name = ? AND a.year = ? AND a.month = ?
    GROUP BY w.adhar_id
  `;

  db.all(query, [jobCode, contractorName, year, month], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Wage Sheet');

    sheet.columns = [
      { header: 'Aadhar ID', key: 'adhar_id', width: 20 },
      { header: 'Name', key: 'worker_name', width: 25 },
      { header: 'Skill', key: 'worker_skill', width: 15 },
      { header: 'Job Code', key: 'job_cd', width: 15 },
      { header: 'Contractor', key: 'contractor_name', width: 25 },
      { header: 'Days Present', key: 'present_days', width: 15 },
      { header: 'Wage Rate', key: 'wage_rate', width: 15 },
      { header: 'Total Wage', key: 'total_wage', width: 15 },
    ];

    rows.forEach(row => {
      const rate = getWageRate(row.worker_skill);
      const total = row.present_days * rate;

      sheet.addRow({
        ...row,
        wage_rate: rate,
        total_wage: total
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=wage_sheet.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  });
});


// --- Server Start ---
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
