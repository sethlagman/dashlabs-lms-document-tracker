# API Reference

Complete reference for all backend endpoints.

**Base URL (development):** `http://localhost:5000`

During frontend development, Vite proxies `/api/...` requests to `http://localhost:5000` automatically, so frontend code can use `/api/...` directly without the full URL.

---

## The Submission Object

Every endpoint that returns a submission uses this shape:

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
| `"not submitted"` | The intern has not uploaded this document yet (checklist only — not stored in DB) |
| `"pending"` | File uploaded, awaiting staff review |
| `"approved"` | Staff approved the submission |
| `"rejected"` | Staff rejected it — intern must re-upload |
| `"signed"` | Staff uploaded a signed/processed copy — intern can download it |

---

## Endpoints

---

### GET `/api/checklist?intern=NAME`

Returns all 11 required documents merged with the intern's current submission status for each.

#### Query parameters

| Parameter | Required | Description |
|---|---|---|
| `intern` | ✅ | The intern's full name |

#### Request
```
GET /api/checklist?intern=Juan%20dela%20Cruz
```

#### Response — `200 OK`

An array of exactly 11 items. Submitted documents include the full Submission fields; unsubmitted ones return a minimal object.

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
| `400` | `intern` query parameter is missing |
| `500` | Database error |

---

### POST `/api/submissions`

Intern uploads a file for one document. If a submission already exists for the same intern and document, it is updated with the new file and its status is reset to `"pending"`.

#### Request — `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `internName` | text | ✅ | The intern's full name |
| `documentName` | text | ✅ | Must exactly match one of the 11 document names |
| `file` | file | ✅ | The document file (PDF, DOCX, JPG, PNG — max 10 MB) |

#### Response — `201 Created`

```json
{
  "_id":          "664f1a2b3c4d5e6f7a8b9c0d",
  "internName":   "Juan dela Cruz",
  "documentName": "Resume / CV",
  "status":       "pending",
  "fileName":     "1718000000000-123456789.pdf",
  "filePath":     "/uploads/1718000000000-123456789.pdf",
  "signedFileName": null,
  "signedFilePath": null
}
```

#### Error responses

| Status | When |
|---|---|
| `400` | `internName`, `documentName`, or `file` is missing |
| `400` | `documentName` does not match any of the 11 recognised names |
| `500` | Database error |

---

### GET `/api/submissions`

Returns all submission records across all interns, sorted newest first.

#### Query parameters

| Parameter | Required | Description |
|---|---|---|
| `intern` | ❌ | Filter results to a specific intern's submissions |

#### Request
```
GET /api/submissions
GET /api/submissions?intern=Juan%20dela%20Cruz
```

#### Response — `200 OK`

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
  { ... }
]
```

Returns an empty array `[]` if no submissions exist.

#### Error responses

| Status | When |
|---|---|
| `500` | Database error |

---

### PATCH `/api/submissions/:id`

Updates a submission's status to `"approved"` or `"rejected"`.

#### URL parameters

| Parameter | Description |
|---|---|
| `id` | The submission's `_id` |

#### Request — `Content-Type: application/json`

```json
{ "status": "approved" }
```

#### Response — `200 OK`

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
| `404` | No submission found with the given `_id` |
| `500` | Database error |

---

### POST `/api/submissions/:id/sign`

Staff uploads a signed or processed version of a document. The submission's status is automatically set to `"signed"`.

#### URL parameters

| Parameter | Description |
|---|---|
| `id` | The submission's `_id` |

#### Request — `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `signedFile` | file | ✅ | The signed document file (max 10 MB) |

#### Response — `200 OK`

```json
{
  "_id":            "664f1a2b3c4d5e6f7a8b9c0d",
  "status":         "signed",
  "signedFileName": "1718000000999-987654321.pdf",
  "signedFilePath": "/uploads/1718000000999-987654321.pdf",
  ...
}
```

#### Error responses

| Status | When |
|---|---|
| `400` | No `signedFile` attached to the request |
| `404` | No submission found with the given `_id` |
| `500` | Database error |

---

## Downloading Files

Uploaded files are served as static assets by the Express backend at `/uploads/<filename>`.

The `filePath` and `signedFilePath` fields in the Submission object are already formatted as URL paths (e.g. `/uploads/filename.pdf`), so they can be used directly as `href` values in the frontend:

```jsx
<a href={submission.filePath} target="_blank" rel="noreferrer">View file</a>
<a href={submission.signedFilePath} download>Download signed copy</a>
```

Vite's dev proxy forwards `/uploads/...` requests to `http://localhost:5000` automatically.
