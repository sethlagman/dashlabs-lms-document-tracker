# API Testing Guide
### Using Postman to test all 5 backend routes

Make sure the backend is running before you start:
```powershell
cd backend
npm run dev
# You should see: ✅ Connected to MongoDB Atlas  🚀 Server running on port 5000
```

---

## Test 1 — GET Checklist

Confirms the backend is alive and the 11-document list is returned correctly.

| Setting | Value |
|---|---|
| Method | `GET` |
| URL | `http://localhost:5000/api/checklist?intern=TestIntern` |
| Body | none |

**Steps:**
1. Open Postman → click **New Request**
2. Set method to **GET**
3. Paste the URL above
4. Click **Send**

**Expected response — `200 OK`**
```json
[
  { "documentName": "School Endorsement Letter",     "status": "not submitted" },
  { "documentName": "Memorandum of Agreement (MOA)", "status": "not submitted" },
  { "documentName": "Parent/Guardian Consent Form",  "status": "not submitted" },
  { "documentName": "Resume / CV",                   "status": "not submitted" },
  { "documentName": "Medical Certificate",           "status": "not submitted" },
  { "documentName": "Insurance Certificate / Waiver","status": "not submitted" },
  { "documentName": "Daily Time Record (DTR)",       "status": "not submitted" },
  { "documentName": "Midterm Evaluation Form",       "status": "not submitted" },
  { "documentName": "Final Evaluation Form",         "status": "not submitted" },
  { "documentName": "Narrative / Accomplishment Report", "status": "not submitted" },
  { "documentName": "Certificate of Completion",    "status": "not submitted" }
]
```
Exactly 11 items, all with `"status": "not submitted"`. ✅

---

## Test 2 — POST Upload a Document

Simulates an intern uploading a file for one document.

| Setting | Value |
|---|---|
| Method | `POST` |
| URL | `http://localhost:5000/api/submissions` |
| Body type | **form-data** |

**Body fields:**

| Key | Type | Value |
|---|---|---|
| `internName` | Text | `TestIntern` |
| `documentName` | Text | `Resume / CV` |
| `file` | File | pick any PDF or image from your computer |

**Steps:**
1. Set method to **POST**, paste the URL
2. Click the **Body** tab → select **form-data**
3. Add the three rows from the table above
4. For the `file` row — click the dropdown on the far right of that row and change **Text** to **File**, then click **Select Files**
5. Click **Send**

**Expected response — `201 Created`**
```json
{
  "_id":          "664f1a2b3c4d5e6f7a8b9c0d",
  "internName":   "TestIntern",
  "documentName": "Resume / CV",
  "status":       "pending",
  "fileName":     "1718000000000-123456789.pdf",
  "filePath":     "/uploads/1718000000000-123456789.pdf",
  "signedFileName": null,
  "signedFilePath": null,
  "createdAt":    "2024-06-10T08:00:00.000Z",
  "updatedAt":    "2024-06-10T08:00:00.000Z"
}
```

> ⚠️ **Copy the `_id` value from this response.** You need it for Tests 4 and 5.

---

## Test 3 — GET All Submissions

Confirms the upload from Test 2 was saved to the database.

| Setting | Value |
|---|---|
| Method | `GET` |
| URL | `http://localhost:5000/api/submissions` |
| Body | none |

**Steps:**
1. Set method to **GET**, paste the URL
2. Click **Send**

**Expected response — `200 OK`**
```json
[
  {
    "_id":          "664f1a2b3c4d5e6f7a8b9c0d",
    "internName":   "TestIntern",
    "documentName": "Resume / CV",
    "status":       "pending",
    "filePath":     "/uploads/1718000000000-123456789.pdf",
    ...
  }
]
```

You should see the one submission you created in Test 2. ✅

**Bonus — run Test 1 again** with the same URL to confirm the checklist now shows `"Resume / CV"` as `"pending"` instead of `"not submitted"`.

---

## Test 4 — PATCH Approve a Submission

Simulates a staff member approving the submission.

| Setting | Value |
|---|---|
| Method | `PATCH` |
| URL | `http://localhost:5000/api/submissions/PASTE_ID_HERE` |
| Body type | **raw → JSON** |

**Body:**
```json
{ "status": "approved" }
```

**Steps:**
1. Set method to **PATCH**
2. Paste the URL — replace `PASTE_ID_HERE` with the `_id` you copied from Test 2
3. Click the **Body** tab → select **raw**
4. Change the format dropdown (top right of the body area) from **Text** to **JSON**
5. Paste `{ "status": "approved" }` into the text area
6. Click **Send**

**Expected response — `200 OK`**
```json
{
  "_id":    "664f1a2b3c4d5e6f7a8b9c0d",
  "status": "approved",
  ...
}
```

The `status` field should now read `"approved"`. ✅

**Also test rejection** — send the same request again but with `{ "status": "rejected" }`.

**Test the validation** — send `{ "status": "anything-else" }` and confirm you get a `400` error back.

---

## Test 5 — POST Upload a Signed Copy

Simulates a staff member uploading the signed/processed version of the document.

| Setting | Value |
|---|---|
| Method | `POST` |
| URL | `http://localhost:5000/api/submissions/PASTE_ID_HERE/sign` |
| Body type | **form-data** |

**Body fields:**

| Key | Type | Value |
|---|---|---|
| `signedFile` | File | pick any PDF or image from your computer |

**Steps:**
1. Set method to **POST**
2. Paste the URL — replace `PASTE_ID_HERE` with the same `_id` from Test 2
3. Click the **Body** tab → select **form-data**
4. Add one row: key = `signedFile`, change type to **File**, click **Select Files**
5. Click **Send**

**Expected response — `200 OK`**
```json
{
  "_id":            "664f1a2b3c4d5e6f7a8b9c0d",
  "status":         "signed",
  "signedFileName": "1718000000999-987654321.pdf",
  "signedFilePath": "/uploads/1718000000999-987654321.pdf",
  ...
}
```

The `status` should now be `"signed"` and `signedFilePath` should have a value. ✅

---

## Test 6 — Confirm the signed file is downloadable

Paste the `signedFilePath` value from Test 5 into your browser:

```
http://localhost:5000/uploads/1718000000999-987654321.pdf
```

The file should open or download directly in the browser. ✅

---

## All tests passing? ✅

| # | Route | What it confirms |
|---|---|---|
| 1 | GET /api/checklist | Server is up, 11 docs returned |
| 2 | POST /api/submissions | File upload + DB write works |
| 3 | GET /api/submissions | DB read works |
| 4 | PATCH /api/submissions/:id | Status update works, validation works |
| 5 | POST /api/submissions/:id/sign | Signed file upload + status flip works |
| 6 | Browser URL | Static file serving works |

If all 6 pass, tell Person 2 and Person 3 the backend is ready — they can now uncomment the API calls in their pages by following the steps in `API_REFERENCE.md`.

---

## Common errors and fixes

| Error | Cause | Fix |
|---|---|---|
| `ECONNREFUSED` | Backend not running | Run `npm run dev` in the `backend` folder |
| `MongooseServerSelectionError` | Wrong Atlas URI or IP not whitelisted | Check `.env` and Atlas Network Access settings |
| `400 internName and documentName are required` | Forgot a form-data field | Make sure all 3 fields are present in Test 2 |
| `400 'X' is not a recognised document` | Typo in `documentName` | Must match exactly — copy from the list in `routes/submissions.js` |
| `404 Submission not found` | Wrong `_id` in the URL | Re-copy the `_id` from Test 2's response |
| `Cast to ObjectId failed` | Malformed `_id` | Make sure you copied the full ID (24 characters) |
