# Backend API Reference
### For Person 2 (Intern Page) and Person 3 (Staff Page)

The backend is **done and working**. This document tells you exactly what each endpoint expects and what it gives back, so you can finish your pages with confidence.

**Base URL during development:** `http://localhost:5000`
Vite's proxy is already configured, so in your frontend code you can just write `/api/...` — you don't need the full URL.

---

## Data shape — the Submission object

Every endpoint that returns a submission (or a list of them) uses this shape:

```json
{
  "_id":            "664f1a2b3c4d5e6f7a8b9c0d",
  "internName":     "Juan dela Cruz",
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

### Status values

| Value | Meaning |
|---|---|
| `"not submitted"` | The intern has never uploaded this document (checklist only — not stored in DB) |
| `"pending"` | Intern uploaded a file, waiting for staff review |
| `"approved"` | Staff approved it |
| `"rejected"` | Staff rejected it — intern should re-upload |
| `"signed"` | Staff uploaded a processed/signed copy — intern can download it |

---

## Endpoints

---

### 1. `GET /api/checklist?intern=NAME`
**Used by: Person 2 (DocumentsPage)**

Returns all 11 required documents with this intern's submission status for each one.

#### Request
```
GET /api/checklist?intern=Juan%20dela%20Cruz
```

#### Response — `200 OK` — array of 11 items
Documents that have been submitted include the full Submission fields.
Documents not yet submitted return a minimal object:

```json
[
  {
    "_id":            "664f1a2b3c4d5e6f7a8b9c0d",
    "documentName":   "School Endorsement Letter",
    "status":         "pending",
    "fileName":       "1718000000000-111111111.pdf",
    "filePath":       "/uploads/1718000000000-111111111.pdf",
    "signedFileName": null,
    "signedFilePath": null
  },
  {
    "documentName":   "Memorandum of Agreement (MOA)",
    "status":         "not submitted"
  },
  ...9 more items
]
```

#### Error responses
| Status | When |
|---|---|
| `400` | `intern` query param is missing |
| `500` | Database error |

#### How to call it (api.js)
```js
// Uncomment this inside getChecklist() in src/api/api.js:
const res = await fetch(`/api/checklist?intern=${encodeURIComponent(internName)}`);
if (!res.ok) throw new Error("Failed to fetch checklist");
return res.json(); // → array of 11 items
```

---

### 2. `POST /api/submissions`
**Used by: Person 2 (DocumentsPage)**

Intern uploads a file for one document. Uses `multipart/form-data` because a file is attached.

> If the intern re-uploads the same document, the existing record is updated (new file, status resets to `"pending"`).

#### Request — `multipart/form-data`
| Field | Type | Required | Description |
|---|---|---|---|
| `internName` | text | ✅ | The intern's full name |
| `documentName` | text | ✅ | Must exactly match one of the 11 document names |
| `file` | file | ✅ | The document file (PDF, image, etc. — max 10 MB) |

#### Response — `201 Created` — the saved Submission object
```json
{
  "_id":          "664f1a2b3c4d5e6f7a8b9c0d",
  "internName":   "Juan dela Cruz",
  "documentName": "Resume / CV",
  "status":       "pending",
  "fileName":     "1718000000000-123456789.pdf",
  "filePath":     "/uploads/1718000000000-123456789.pdf",
  ...
}
```

#### Error responses
| Status | When |
|---|---|
| `400` | Missing `internName`, `documentName`, or `file` |
| `400` | `documentName` is not one of the 11 recognised names |
| `500` | Database error |

#### How to call it (api.js)
```js
// Uncomment this inside uploadDocument() in src/api/api.js:
const formData = new FormData();
formData.append("internName", internName);
formData.append("documentName", documentName);
formData.append("file", file);
const res = await fetch("/api/submissions", { method: "POST", body: formData });
if (!res.ok) throw new Error("Upload failed");
return res.json(); // → saved Submission object
```

---

### 3. `GET /api/submissions`
**Used by: Person 3 (AdminPage)**

Returns every submission across all interns, sorted newest first.
Optionally filter by intern name with `?intern=NAME`.

#### Request
```
GET /api/submissions
GET /api/submissions?intern=Juan%20dela%20Cruz
```

#### Response — `200 OK` — array of Submission objects
```json
[
  {
    "_id":          "664f1a2b3c4d5e6f7a8b9c0d",
    "internName":   "Juan dela Cruz",
    "documentName": "Resume / CV",
    "status":       "pending",
    "filePath":     "/uploads/1718000000000-123456789.pdf",
    ...
  },
  { ... },
  { ... }
]
```

Returns an empty array `[]` if no submissions exist yet.

#### Error responses
| Status | When |
|---|---|
| `500` | Database error |

#### How to call it (api.js)
```js
// Uncomment this inside getAllSubmissions() in src/api/api.js:
const res = await fetch("/api/submissions");
if (!res.ok) throw new Error("Failed to fetch submissions");
return res.json(); // → array of Submission objects
```

---

### 4. `PATCH /api/submissions/:id`
**Used by: Person 3 (AdminPage)**

Staff sets a submission's status to `"approved"` or `"rejected"`.

#### Request — `Content-Type: application/json`
| Param | Where | Description |
|---|---|---|
| `id` | URL | The submission's `_id` |
| `status` | JSON body | Must be `"approved"` or `"rejected"` |

```json
{ "status": "approved" }
```

#### Response — `200 OK` — the updated Submission object
```json
{
  "_id":    "664f1a2b3c4d5e6f7a8b9c0d",
  "status": "approved",
  ...
}
```

#### Error responses
| Status | When |
|---|---|
| `400` | `status` is not `"approved"` or `"rejected"` |
| `404` | No submission with that `_id` |
| `500` | Database error |

#### How to call it (api.js)
```js
// Uncomment this inside updateStatus() in src/api/api.js:
const res = await fetch(`/api/submissions/${id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ status }),
});
if (!res.ok) throw new Error("Status update failed");
return res.json(); // → updated Submission object
```

---

### 5. `POST /api/submissions/:id/sign`
**Used by: Person 3 (AdminPage)**

Staff uploads the signed/processed copy of a document. Sets status to `"signed"` automatically.

#### Request — `multipart/form-data`
| Param | Where | Description |
|---|---|---|
| `id` | URL | The submission's `_id` |
| `signedFile` | form field (file) | The signed document file (max 10 MB) |

#### Response — `200 OK` — the updated Submission object
```json
{
  "_id":            "664f1a2b3c4d5e6f7a8b9c0d",
  "status":         "signed",
  "signedFileName": "1718000000000-987654321.pdf",
  "signedFilePath": "/uploads/1718000000000-987654321.pdf",
  ...
}
```

#### Error responses
| Status | When |
|---|---|
| `400` | No `signedFile` attached |
| `404` | No submission with that `_id` |
| `500` | Database error |

#### How to call it (api.js)
```js
// Uncomment this inside uploadSignedFile() in src/api/api.js:
const formData = new FormData();
formData.append("signedFile", signedFile);
const res = await fetch(`/api/submissions/${id}/sign`, {
  method: "POST",
  body: formData,
});
if (!res.ok) throw new Error("Signed file upload failed");
return res.json(); // → updated Submission object
```

---

## Downloading files

Uploaded files are served as static assets by the Express backend.

If a submission has `filePath: "/uploads/abc.pdf"`, you can use that string directly as an `href` or `src` in your JSX:

```jsx
<a href={submission.filePath} target="_blank" rel="noreferrer">View file</a>
<a href={submission.signedFilePath} download>Download signed copy</a>
```

Vite's dev proxy forwards `/uploads/...` requests to `http://localhost:5000` automatically, so this works without any extra configuration.

---

## Switching from fake data to the real API

Both page files (`DocumentsPage.jsx` and `AdminPage.jsx`) have `FAKE_DATA` at the top that's shaped exactly like the real responses above. When you're ready to connect:

1. Open `src/api/api.js` and **uncomment** the `fetch(...)` code inside the relevant function(s)
2. In your page file, **uncomment** the import line at the top
3. In the `useEffect`, replace `setXxx(FAKE_DATA)` with the real API call

That's it — one uncomment per function, one line swap per page.
