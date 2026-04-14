                                    🧾 Contract Worker Wage Sheet – Visakhapatnam Steel Plant

⚡ Quick Info

📌 Domain: Enterprise Software – Wage Management

🏢 Use Case: IT & ERP, Engineering Department – Visakhapatnam Steel Plant

🛠 Tech Stack: Node.js, Express, SQLite, ExcelJS, HTML/CSS/JS

🗂 Data Source: Excel sheets (Worker details, Attendance, Contract master)

⬇️ Outputs: Downloadable Excel wage sheets & attendance reports

🔐 Access: Secure login, restricted to authorized users


📖 Gist

The Contract Worker Wage Sheet is a full-stack web application designed for the IT & ERP, Engineering Department of Visakhapatnam Steel Plant.
It streamlines the process of managing worker details, attendance records, and wage calculations with automated Excel integration.

Built with Node.js, Express, SQLite, and ExcelJS, the platform ensures secure access, accuracy in wage processing, and professional reporting for contract workers across multiple contracts.

🚀 Key Features

🔐 Secure Login System → Role-based access using mobile number + password

📑 Worker Data Management → Store & fetch worker details (job code, contract, DOB, skill type)

🗓️ Attendance & Contract Master Upload → Upload Excel sheets directly into the system

🧮 Automated Wage Calculation → Calculates wages by skill type, attendance, and government deductions

📊 Downloadable Excel Reports → Generate neat, professional wage sheets for contractors

📋 Grouped View → View workers grouped by contract, job type, or time period

🖥️ Modern UI → Clean, structured, and professional interface tailored for enterprise use
🏗️ Tech Stack

Frontend:

HTML, CSS, JavaScript

Backend:

Node.js + Express

Database:

SQLite (lightweight file-based DB)

Excel Processing:

ExcelJS for reading & generating .xlsx files

📂 Project Structure

📦 contract-worker-wage-sheet
├── backend/
│   ├── server.js              # Express server & routes
│   ├── database.js            # SQLite DB connection & schema
│   ├── routes/
│   │   ├── workerRoutes.js    # Worker & wage sheet APIs
│   │   └── authRoutes.js      # Login & registration APIs
├── frontend/
│   ├── login.html             # Secure login page
│   ├── register.html          # Registration page
│   ├── contract-wage.html     # Wage sheet dashboard
│   ├── style.css              # Frontend styling
│   └── script.js              # Frontend logic & API calls
├── data/
│   └── workers.db             # SQLite database file
├── package.json
└── README.md
⚙️ Installation & Setup

1️⃣ Clone the repository

git clone https://github.com/your-username/contract-worker-wage-sheet.git
cd contract-worker-wage-sheet


2️⃣ Install dependencies

npm install


3️⃣ Start the server

node backend/server.js


4️⃣ Access the app
👉 Open your browser at: http://localhost:3000

📊 Workflow

🔐 Login/Register with mobile number & password

📂 Upload Excel sheets → worker details, attendance, contract master

🧮 System calculates wages → Based on attendance, job type, and deductions

📊 View grouped data → By job code, contract name, skill type

⬇️ Download Excel wage sheet → Professional report ready for contractors

🔒 Security

Passwords securely stored with hashing

Validation checks: no future DOBs, valid email format, proper input formatting

Access restricted to authorized department staff only

🎯 Future Enhancements

📱 Responsive dashboard with analytics & charts

📧 Email/SMS notifications for contractors

☁️ Cloud deployment (Heroku / AWS / Vercel)

🔍 Advanced search & filters (by year, month, job type)

👨‍💻 Author

    JANASWAMI HARSHITH KUMAR 
📍 Computer Science Engineering Student
📧 [harshithkumar746@gmail.com]
🔗 [www.linkedin.com/in/harshith-kumar-18295a299]
