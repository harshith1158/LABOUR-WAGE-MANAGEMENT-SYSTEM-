🧾 Contract Worker Wage Sheet – Visakhapatnam Steel Plant

A web-based system designed for the IT & ERP, Engineering Department of Visakhapatnam Steel Plant to manage contract workers’ wage sheets.
The platform provides secure login access, automated wage calculations from uploaded Excel sheets, and supports downloading structured wage reports.

🚀 Features

✅ Secure Login System – Role-based access using mobile number + password
✅ Contract Worker Management – Store and view worker details, job codes, skills, DOB, and contracts
✅ Attendance & Wage Calculation – Auto-process Excel uploads (attendance + contract master + worker details)
✅ Excel Download – Export wage sheets in professional .xlsx format
✅ Group by Contract – View workers grouped by contract for easy analysis
✅ Modern UI – Clean, professional, and mobile-friendly user interface

🏗️ Tech Stack

Frontend: HTML, CSS, JavaScript

Backend: Node.js + Express

Database: SQLite (lightweight & file-based)

Excel Handling: excelJS

📂 Project Structure

📦 contract-worker-wage-sheet
├── backend/
│   ├── server.js            # Express server
│   ├── database.js          # SQLite setup
│   ├── routes/
│   │   ├── workerRoutes.js  # Worker & wage sheet routes
│   │   └── authRoutes.js    # Login/registration
├── frontend/
│   ├── login.html           # Login page
│   ├── register.html        # Registration page
│   ├── contract-wage-sheet.html # Wage sheet dashboard
│   ├── style.css            # UI styling
│   └── script.js            # Frontend logic
├── data/
│   └── workers.db           # SQLite database
├── package.json
└── README.md

⚙️ Installation
1️⃣ Clone the repo
git clone https://github.com/your-username/contract-worker-wage-sheet.git
cd contract-worker-wage-sheet

2️⃣ Install dependencies
npm install

3️⃣ Start the server
node backend/server.js

4️⃣ Open in browser
http://localhost:3000

📊 Usage Workflow

🔐 Login/Register using mobile number & password

📑 Upload Worker/Attendance Excel files

🧮 System calculates wages based on contract & attendance

📂 View grouped worker details by contract

⬇️ Download wage sheet in Excel format

🔒 Security

Passwords are securely stored (hashed).

Restricted access only for authorized department staff.

Session/JWT-based login can be enabled for production.

🎯 Future Enhancements

📱 Responsive dashboard with charts/analytics

📧 Email/SMS alerts for workers or contractors

📊 Advanced reporting with filters (date, contract, skill)

☁️ Cloud deployment (Heroku / AWS / Vercel)

👨‍💻 Author
 J.HARSHITH KUMAR
📍 Computer Science Engineering Student
📧 [harshithkumar746@gmail.com]
🔗 [www.linkedin.com/in/
harshith-kumar-18295a299]

✨ This project streamlines wage sheet management for contract workers, improving efficiency, transparency, and accuracy at scale.
