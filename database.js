const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'jobs.db'), (err) => {
    if (err) return console.error("❌ Failed to open DB:", err.message);
    console.log("📦 Connected to SQLite database: jobs.db");
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            mobile TEXT UNIQUE,
            dob TEXT,
            password TEXT NOT NULL
        )
    `);

    db.run(`CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_cd TEXT,
        contractor_name TEXT,
        contractor_address TEXT,
        job_start_dt TEXT,
        job_end_dt TEXT,
        job_desc TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS workers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_cd TEXT,
        adhar_id TEXT,
        gpass_no TEXT,
        worker_name TEXT,
        worker_skill TEXT,
        dob TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        w_date TEXT,
        adhar_id TEXT,
        in_time TEXT,
        out_time TEXT,
        device_name_in TEXT,
        device_name_out TEXT,
        job_cd TEXT,
        contractor_name TEXT,
        year TEXT,
        month TEXT
    )`);
});

module.exports = db;
