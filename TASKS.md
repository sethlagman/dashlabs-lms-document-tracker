# Team Task Assignments

Three people, three clear sections. Work on your part independently — the skeleton is already built and running. Use the fake data in your page file to develop and style everything first, then do the one-line swap to the real API when Person 1's routes are done.

---

## Person 1 — Backend Routes

**File to work in:** `backend/routes/submissions.js`

Everything is already wired up (Express, MongoDB, multer, the model). You just need to replace each `// TODO` placeholder with real logic.

---

### Task 1 — Intern uploads a document
**Route:** `POST /api/submissions`

- Read `internName` and `documentName` from `req.body`
- Read the uploaded file from `req.file` (multer already handles saving it to `uploads/`)
- Check if a submission already exists for this intern + document combo
  - If yes → update it (new file, reset status back to `"pending"`)
  - If no → create a new `Submission` document
- Return the saved submission as JSON with status `201`

---

### Task 2 — Serve the intern's checklist
**Route:** `GET /api/checklist?intern=NAME`

- Read the intern's name from `req.query.intern`
- Query `Submission.find({ internName })` to get their existing submissions
- Build the response by mapping over the hardcoded `DOCUMENT_LIST` (already defined in the file)
  - For each document name, find the matching submission if it exists
  - If found → include its `_id`, `status`, `filePath`, `signedFilePath`
  - If not found → return `{ documentName, status: "not submitted" }`
- Return the array of 11 items

---

### Task 3 — List all submissions for staff
**Route:** `GET /api/submissions`

- Query `Submission.find({})` to get every submission
- Optionally support `?intern=NAME` as a filter if you want
- Return the array as JSON

---

### Task 4 — Approve or reject a submission
**Route:** `PATCH /api/submissions/:id`

- Read the submission ID from `req.params.id`
- Read `status` from `req.body` — validate it is either `"approved"` or `"rejected"`, return `400` otherwise
- Find the submission by ID and update its status
- Return the updated submission as JSON

---

### Task 5 — Upload a signed/processed file
**Route:** `POST /api/submissions/:id/sign`

- Read the submission ID from `req.params.id`
- Read the uploaded signed file from `req.file` (multer handles saving it)
- Find the submission by ID and update:
  - `signedFileName` → `req.file.filename`
  - `signedFilePath` → `req.file.path` (or a URL path like `/uploads/filename`)
  - `status` → `"signed"`
- Return the updated submission as JSON

---

### Done checklist
- [ ] Task 1 — POST /api/submissions
- [ ] Task 2 — GET /api/checklist
- [ ] Task 3 — GET /api/submissions
- [ ] Task 4 — PATCH /api/submissions/:id
- [ ] Task 5 — POST /api/submissions/:id/sign
- [ ] Tested all 5 routes with Postman or Thunder Client

---
---

## Person 2 — Intern Documents Page

**File to work in:** `frontend/src/pages/DocumentsPage.jsx`

Build the page an intern uses to submit their required documents and download signed copies. Use the `FAKE_DATA` array already in the file to develop everything — no backend needed yet.

---

### Task 1 — Intern name input
- There is already a basic text input in the skeleton
- Style it properly to match the mockup
- The intern types their full name here; it gets passed to the API later

---

### Task 2 — Document list
- Display all 11 documents as a list or card grid
- Each row/card should show:
  - Document name
  - A **status badge** (colour-coded):
    - `not submitted` → gray
    - `pending` → yellow
    - `approved` → green
    - `rejected` → red
    - `signed` → blue

---

### Task 3 — Upload button
- Show an **Upload** button next to documents with status `"not submitted"` or `"rejected"`
- Clicking it opens a native file picker
- For now just `console.log` the file — the real handler is wired in Task 5

---

### Task 4 — Download button
- Show a **Download** button next to documents with status `"signed"`
- The download link should point to `doc.signedFilePath`
- Hide this button for all other statuses

---

### Task 5 — Connect to the real API
Do this after Person 1 finishes their routes.

1. Open `frontend/src/api/api.js`
2. In `getChecklist()` — uncomment the fetch code inside the function
3. In `uploadDocument()` — uncomment the fetch code inside the function
4. Back in `DocumentsPage.jsx`:
   - Add `import { getChecklist, uploadDocument } from "../api/api";` at the top
   - In the `useEffect`, replace `setDocuments(FAKE_DATA)` with:
     ```js
     if (internName) getChecklist(internName).then(setDocuments);
     ```
   - In `handleUpload`, call `uploadDocument(internName, documentName, file)` then refresh the list

---

### Done checklist
- [ ] Task 1 — Intern name input styled
- [ ] Task 2 — Document list with status badges
- [ ] Task 3 — Upload button + file picker
- [ ] Task 4 — Download button for signed docs
- [ ] Task 5 — Swapped fake data for real API calls

---
---

## Person 3 — Staff Admin Page

**File to work in:** `frontend/src/pages/AdminPage.jsx`

Build the page staff use to review every intern's submissions — approve, reject, and upload signed copies. Use the `FAKE_DATA` array already in the file to develop everything — no backend needed yet.

---

### Task 1 — Submissions table
- Display all submissions in a table
- Columns: **Intern Name · Document · Status · Submitted File · Actions**
- Style the status column with colour-coded badges (same colours as Person 2's list):
  - `pending` → yellow · `approved` → green · `rejected` → red · `signed` → blue

---

### Task 2 — View submitted file
- In the **Submitted File** column, show a **View** link that opens `sub.filePath` in a new tab
- If no file has been submitted yet, show a dash `—`

---

### Task 3 — Approve / Reject buttons
- Show **Approve** and **Reject** buttons in the Actions column
- Only show them when the status is `"pending"` (hide for approved/rejected/signed)
- For now just `console.log` the action — the real handler is wired in Task 5

---

### Task 4 — Upload Signed Copy button
- Show an **Upload Signed Copy** button per row
- Clicking it opens a native file picker
- For now just `console.log` the file — the real handler is wired in Task 5

---

### Task 5 — Connect to the real API
Do this after Person 1 finishes their routes.

1. Open `frontend/src/api/api.js`
2. In `getAllSubmissions()` — uncomment the fetch code inside the function
3. In `updateStatus()` — uncomment the fetch code inside the function
4. In `uploadSignedFile()` — uncomment the fetch code inside the function
5. Back in `AdminPage.jsx`:
   - Add `import { getAllSubmissions, updateStatus, uploadSignedFile } from "../api/api";` at the top
   - In the `useEffect`, replace `setSubmissions(FAKE_DATA)` with:
     ```js
     getAllSubmissions().then(setSubmissions);
     ```
   - In `handleStatusChange`, call `updateStatus(id, newStatus)` then refresh the list
   - In `handleSignedUpload`, call `uploadSignedFile(id, file)` then refresh the list

---

### Done checklist
- [ ] Task 1 — Submissions table with status badges
- [ ] Task 2 — View link for submitted file
- [ ] Task 3 — Approve / Reject buttons (pending only)
- [ ] Task 4 — Upload Signed Copy button + file picker
- [ ] Task 5 — Swapped fake data for real API calls

---
---

## Connecting Everything (all three, together)

Once Person 1's routes are tested and working:

1. Person 1 tells Person 2 and 3 that the API is ready
2. Person 2 completes Task 5 in `DocumentsPage.jsx`
3. Person 3 completes Task 5 in `AdminPage.jsx`
4. Run both servers (`backend` + `frontend`) and do a full end-to-end test:
   - Intern uploads a file on `/documents`
   - Staff sees it on `/admin`, approves or rejects it
   - Staff uploads a signed copy
   - Intern sees the "signed" status and can download the file on `/documents`
