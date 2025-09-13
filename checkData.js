const db = require('./database');

// Check Worker Details
db.all('SELECT * FROM worker_details', (err, rows) => {
  console.log('\n📌 Worker Details:\n', rows);
});

// Check Attendance
db.all('SELECT * FROM attendance', (err, rows) => {
  console.log('\n📌 Attendance:\n', rows);
});

// Check Contract Master
db.all('SELECT * FROM contract_master', (err, rows) => {
  console.log('\n📌 Contract Master:\n', rows);
});
