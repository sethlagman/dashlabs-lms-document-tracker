# API Testing Guide

How to verify all 5 backend endpoints using Postman.

### Before you start

Make sure the backend is running:

```powershell
cd backend
npm run dev
```

You should see:
```
✅  Connected to MongoDB Atlas
🚀  Server running on port 5000
```

---

## Test 1 — GET Checklist

Verifies the server is running and returns all 11 documents for a given intern.

| Setting | Value |
|---|---|
| Method | `GET` |
| URL | `http://localhost:5000/api/checklist?intern=TestIntern` |
| Body | none |

**Steps:**
1. Open Postman → click **New Request**
2. Set the method to **GET**
3. Paste the URL
4. Click **Send**

**Expected response — `200 OK`**
```json
[
  { "documentName": "School Endorsement Letter",          "status": "not submitted" },
  { "documentName": "Memorandum of Agreement (MOA)",      "status": "not submitted" },
  { "documentName": "Parent/Guardian Consent Form",       "status": "not submitted" },
  { "documentName": "Resume / CV",                        "status": "not submitted" },
  { "documentName": "Medical Certificate",                "status": "not submitted" },
  { "documentName": "Insurance Certificate / Waiver",     "status": "not submitted" },
  { "documentName": "Daily Time Record (DTR)",            "status": "not submitted" },
  { "documentName": "Midterm Evaluation Form",            "status": "not submitted" },
  { "documentName": "Final Evaluation Form",              "status": "not submitted" },
  { "documentName": "Narrative / Accomplishment Report",  "status": "not submitted" },
  { "documentName": "Certificate of Completion",          "status": "not submitted" }
]
```

Exactly 11 items, all with `"status": "not submitted"`. ✅

---

## Test 2 — POST Upload a Document

Creates a new submission with an uploaded file.

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
| `file` | File | any PDF or image from your computer |

**Steps:**
1. Set method to **POST** and paste the URL
2. Click the **Body** tab → select **form-data**
3. Add the three rows from the table above
4. For the `file` row — click the type dropdown on the right and change it from **Text** to **File**, then click **Select Files**
5. Click **Send**

**Expected response — `201 Created`**
```json
{
  "_id":            "664f1a2b3c4d5e6f7a8b9c0d",
  "internName":     "TestIntern",
  "documentName":   "Resume / CV",
  "status":         "pending",
  "fileName":       "1718000000000-123456789.pdf",
  "filePath":       "/uploads/1718000000000-123456789.pdf",
  "signedFileName": null,
  "signedFilePath": null,
  "createdAt":      "2024-06-10T08:00:00.000Z",
  "updatedAt":      "2024-06-10T08:00:00.000Z"
}
```

> ⚠️ **Copy the `_id` value from this response.** It is required for Tests 4 and 5.

---

## Test 3 — GET All Submissions

Verifies the upload from Test 2 was saved to the database.

| Setting | Value |
|---|---|
| Method | `GET` |
| URL | `http://localhost:5000/api/submissions` |
| Body | none |

**Steps:**
1. Set method to **GET** and paste the URL
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

The submission created in Test 2 should appear in the list. ✅

**Bonus:** Run Test 1 again to confirm the checklist now shows `"Resume / CV"` with `"status": "pending"` instead of `"not submitted"`.

---

## Test 4 — PATCH Approve a Submission

Updates the submission's status to `"approved"`.

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
2. Paste the URL, replacing `PASTE_ID_HERE` with the `_id` from Test 2
3. Click the **Body** tab → select **raw**
4. Change the format dropdown (top-right of the body area) from **Text** to **JSON**
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

The `status` field should read `"approved"`. ✅

**Also test rejection** — send the same request with `{ "status": "rejected" }`.

**Test validation** — send `{ "status": "anything-else" }` and confirm you receive a `400` error.

---

## Test 5 — POST Upload a Signed Copy

Attaches a signed file to the submission. Status becomes `"signed"` automatically.

| Setting | Value |
|---|---|
| Method | `POST` |
| URL | `http://localhost:5000/api/submissions/PASTE_ID_HERE/sign` |
| Body type | **form-data** |

**Body fields:**

| Key | Type | Value |
|---|---|---|
| `signedFile` | File | any PDF or image from your computer |

**Steps:**
1. Set method to **POST**
2. Paste the URL, replacing `PASTE_ID_HERE` with the `_id` from Test 2
3. Click the **Body** tab → select **form-data**
4. Add one row: key = `signedFile`, change type to **File**, then select a file
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

`status` is `"signed"` and `signedFilePath` has a value. ✅

---

## Test 6 — Verify File is Accessible

Paste the `signedFilePath` value from Test 5 directly into your browser:

```
http://localhost:5000/uploads/1718000000999-987654321.pdf
```

The file should open or prompt a download. ✅

---

## Summary

| # | Endpoint | What it verifies |
|---|---|---|
| 1 | GET /api/checklist | Server is up, returns all 11 documents |
| 2 | POST /api/submissions | File upload and database write work correctly |
| 3 | GET /api/submissions | Database read works correctly |
| 4 | PATCH /api/submissions/:id | Status update and validation work correctly |
| 5 | POST /api/submissions/:id/sign | Signed file upload and status flip work correctly |
| 6 | Browser URL | Static file serving works correctly |

---

## Common Errors

| Error | Cause | Fix |
|---|---|---|
| `ECONNREFUSED` | Backend is not running | Run `npm run dev` in the `backend` folder |
| `MongooseServerSelectionError` | Wrong Atlas URI or IP not whitelisted | Check `.env` and Atlas Network Access settings |
| `400 internName and documentName are required` | Missing form-data field | Ensure all 3 fields are present in Test 2 |
| `400 'X' is not a recognised document` | Typo in `documentName` | Must match exactly — copy the name from `routes/submissions.js` |
| `404 Submission not found` | Wrong `_id` in the URL | Re-copy the full `_id` from Test 2's response |
| `Cast to ObjectId failed` | Malformed `_id` | The ID must be exactly 24 characters |
