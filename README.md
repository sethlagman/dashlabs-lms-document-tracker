# Internship Document Tracker — Skeleton

A 3-person group prototype for tracking intern document submissions.

**Stack:** React (Vite) + Tailwind CSS + React Router · Node.js + Express · MongoDB Atlas + Mongoose

---

## Folder Structure

```
Internship Project/
├── frontend/                     ← Person 2 & 3 work here
│   ├── index.html
│   ├── vite.config.js            ← proxies /api → localhost:5000
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx              ← entry point, wraps app in BrowserRouter
│       ├── App.jsx               ← top-level router (/ → /documents redirect)
│       ├── index.css             ← Tailwind directives
│       ├── api/
│       │   └── api.js            ← ★ shared API layer — all fetch() calls go here
│       └── pages/
│           ├── DocumentsPage.jsx ← ★ Person 2 builds this (/documents)
│           └── AdminPage.jsx     ← ★ Person 3 builds this (/admin)
│
├── backend/                      ← Person 1 works here
│   ├── server.js                 ← Express entry point + MongoDB connection
│   ├── .env.example              ← copy to .env and fill in MONGO_URI
│   ├── uploads/                  ← multer saves files here (auto-created on first upload)
│   ├── models/
│   │   └── Submission.js         ← ★ Mongoose schema (fully defined — do not change)
│   └── routes/
│       └── submissions.js        ← ★ Person 1 fills in the 5 route handlers here
│
└── README.md
```

---

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env        # then edit .env with your MongoDB Atlas URI
node server.js              # or: npm run dev  (uses nodemon)
```

### Frontend
```bash
cd frontend
npm install
npm run dev                 # opens http://localhost:5173
```

Vite is configured to proxy `/api` and `/uploads` requests to `http://localhost:5000`,
so both servers need to be running at the same time during development.

---

## The 5 API Endpoints (the contract — don't change without telling everyone)

| Method | Route | Who uses it | What it does |
|--------|-------|-------------|--------------|
| GET | `/api/checklist?intern=NAME` | Person 2 | 11 docs + intern's status for each |
| POST | `/api/submissions` | Person 2 | Intern uploads a file |
| GET | `/api/submissions` | Person 3 | All submissions (staff view) |
| PATCH | `/api/submissions/:id` | Person 3 | Set status → approved / rejected |
| POST | `/api/submissions/:id/sign` | Person 3 | Staff uploads signed copy |

---

## Who Builds What

### Person 1 — Backend (`backend/routes/submissions.js`)
Fill in the 5 route handlers. Each currently returns a placeholder JSON response.
Tasks:
- Save intern-uploaded files with `multer`, create a `Submission` document
- Return the merged checklist (all 11 docs + status) for `GET /api/checklist`
- Approve / reject via `PATCH /api/submissions/:id`
- Save the staff-signed file and set status to `"signed"` via `POST /api/submissions/:id/sign`

### Person 2 — Intern Page (`frontend/src/pages/DocumentsPage.jsx`)
Build the intern-facing document list UI.
Tasks:
- Show all 11 documents and their status (start with `FAKE_DATA` at the top of the file)
- "Upload" button for anything not yet submitted
- "Download" button when a signed copy is available
- **One-line swap to real data:** replace `setDocuments(FAKE_DATA)` with `getChecklist(internName).then(setDocuments)` and uncomment the import at the top of `api.js`

### Person 3 — Staff Page (`frontend/src/pages/AdminPage.jsx`)
Build the staff admin table UI.
Tasks:
- Table of all submissions (start with `FAKE_DATA` at the top of the file)
- Approve / Reject buttons per row
- "Upload Signed Copy" button per row
- **One-line swap to real data:** replace `setSubmissions(FAKE_DATA)` with `getAllSubmissions().then(setSubmissions)` and uncomment the imports

---

## Shared `api.js` — How the One-Line Swap Works

Every function in `frontend/src/api/api.js` is a stub with the real `fetch()` code
commented out. When Person 1's routes are ready:

1. Open the relevant function in `api.js`
2. Uncomment the fetch code inside it
3. In the page file, uncomment the import at the top and replace the `FAKE_DATA` line
   with the real API call

No other code changes needed.

---

## Submission Model (Mongoose)

```js
{
  internName:      String,   // the intern's full name
  documentName:    String,   // one of the 11 hardcoded document names
  status:          String,   // "pending" | "approved" | "rejected" | "signed"
  fileName:        String,   // intern's uploaded filename
  filePath:        String,   // path on disk (served at /uploads/...)
  signedFileName:  String,   // staff-uploaded signed file name
  signedFilePath:  String,   // path on disk (served at /uploads/...)
}
```

## Not in scope for this prototype
- Authentication / login
- Email notifications
- Real e-signatures (staff just uploads a signed PDF)
