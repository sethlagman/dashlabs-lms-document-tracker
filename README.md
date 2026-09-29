# Internship Document Tracker

A web application for managing internship document submissions. Interns upload required documents, and staff review each one — approving, rejecting, or uploading a signed copy back.

**Stack:** React (Vite) + Tailwind CSS + React Router · Node.js + Express · MongoDB Atlas + Mongoose

---

## Folder Structure

```
Internship Project/
├── frontend/
│   ├── index.html
│   ├── vite.config.js          ← proxies /api and /uploads → localhost:5000
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx            ← app entry point, wraps in BrowserRouter
│       ├── App.jsx             ← sidebar layout + route declarations
│       ├── index.css           ← Tailwind directives
│       ├── api/
│       │   └── api.js          ← all fetch() calls to the backend
│       └── pages/
│           ├── DocumentsPage.jsx   ← intern-facing document submission page (/documents)
│           └── AdminPage.jsx       ← staff review and management page (/admin)
│
├── backend/
│   ├── server.js               ← Express entry point + MongoDB connection
│   ├── .env.example            ← copy to .env and fill in MONGO_URI
│   ├── uploads/                ← uploaded files saved here by multer
│   ├── models/
│   │   └── Submission.js       ← Mongoose schema
│   └── routes/
│       └── submissions.js      ← all 5 API route handlers
│
├── README.md
├── API_REFERENCE.md            ← full API endpoint documentation
├── API_TESTING.md              ← how to test the API with Postman
└── MONGODB_SETUP.md            ← how to connect to MongoDB Atlas
```

---

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or higher)
- A [MongoDB Atlas](https://cloud.mongodb.com) account and cluster
- [Git](https://git-scm.com)

### Backend

```powershell
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in your MongoDB Atlas connection string:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/internship-tracker?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
```

Then start the server:

```powershell
npm run dev
```

You should see:
```
✅  Connected to MongoDB Atlas
🚀  Server running on port 5000
```

### Frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> Both servers must be running at the same time. Vite proxies all `/api` and `/uploads` requests to `http://localhost:5000` automatically.

---

## Pages

| Route | Description |
|---|---|
| `/documents` | Intern page — view document statuses, upload files, download signed copies |
| `/admin` | Staff page — review all submissions, approve/reject, upload signed copies |

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/checklist?intern=NAME` | Returns all 11 documents with the intern's status for each |
| POST | `/api/submissions` | Intern uploads a file for one document |
| GET | `/api/submissions` | Returns all submissions (staff view) |
| PATCH | `/api/submissions/:id` | Updates a submission's status to approved or rejected |
| POST | `/api/submissions/:id/sign` | Staff uploads a signed copy; status becomes "signed" |

See `API_REFERENCE.md` for full request/response details.

---

## Required Documents

The following 11 documents are hardcoded in the application:

1. School Endorsement Letter
2. Memorandum of Agreement (MOA)
3. Parent/Guardian Consent Form
4. Resume / CV
5. Medical Certificate
6. Insurance Certificate / Waiver
7. Daily Time Record (DTR)
8. Midterm Evaluation Form
9. Final Evaluation Form
10. Narrative / Accomplishment Report
11. Certificate of Completion

---

## Data Model

```js
// Submission document stored in MongoDB
{
  internName:      String,   // the intern's full name
  documentName:    String,   // one of the 11 document names above
  status:          String,   // "pending" | "approved" | "rejected" | "signed"
  fileName:        String,   // intern's uploaded file name
  filePath:        String,   // URL path, e.g. /uploads/filename.pdf
  signedFileName:  String,   // staff-uploaded signed file name
  signedFilePath:  String,   // URL path to the signed file
}
```

---

## Out of Scope (Prototype)

- User authentication and login
- Email or push notifications
- Digital e-signatures
- Role-based access control
