// ============================================================
// Shared API layer — all HTTP calls live here.
// Person 1 defines the backend routes; Person 2 & 3 call these functions.
//
// Base URL: requests go to /api (proxied to http://localhost:5000 by Vite).
// ============================================================

const BASE = "/api";

// ── GET /api/checklist?intern=NAME ───────────────────────────────────────────
// Returns the 11 documents merged with this intern's status for each.
// Response shape: Array<{ documentName, status, _id?, filePath?, signedFilePath? }>
//
// Used by: Person 2 (DocumentsPage)
export async function getChecklist(internName) {
  // TODO (Person 2): uncomment and use this once Person 1's route is ready.
  // const res = await fetch(`${BASE}/checklist?intern=${encodeURIComponent(internName)}`);
  // if (!res.ok) throw new Error("Failed to fetch checklist");
  // return res.json();
}

// ── POST /api/submissions ────────────────────────────────────────────────────
// Intern uploads a file for one document.
// Response shape: the created/updated Submission object.
//
// Used by: Person 2 (DocumentsPage)
export async function uploadDocument(internName, documentName, file) {
  // TODO (Person 2): uncomment and use this once Person 1's route is ready.
  // const formData = new FormData();
  // formData.append("internName", internName);
  // formData.append("documentName", documentName);
  // formData.append("file", file);
  // const res = await fetch(`${BASE}/submissions`, { method: "POST", body: formData });
  // if (!res.ok) throw new Error("Upload failed");
  // return res.json();
}

// ── GET /api/submissions ─────────────────────────────────────────────────────
// Returns every submission across all interns.
// Response shape: Array<Submission>
//
// Used by: Person 3 (AdminPage)
export async function getAllSubmissions() {
  // TODO (Person 3): uncomment and use this once Person 1's route is ready.
  // const res = await fetch(`${BASE}/submissions`);
  // if (!res.ok) throw new Error("Failed to fetch submissions");
  // return res.json();
}

// ── PATCH /api/submissions/:id ───────────────────────────────────────────────
// Staff sets status to "approved" or "rejected".
// Response shape: the updated Submission object.
//
// Used by: Person 3 (AdminPage)
export async function updateStatus(id, status) {
  // TODO (Person 3): uncomment and use this once Person 1's route is ready.
  // const res = await fetch(`${BASE}/submissions/${id}`, {
  //   method: "PATCH",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ status }),
  // });
  // if (!res.ok) throw new Error("Status update failed");
  // return res.json();
}

// ── POST /api/submissions/:id/sign ───────────────────────────────────────────
// Staff uploads the signed/processed file; status becomes "signed".
// Response shape: the updated Submission object.
//
// Used by: Person 3 (AdminPage)
export async function uploadSignedFile(id, signedFile) {
  // TODO (Person 3): uncomment and use this once Person 1's route is ready.
  // const formData = new FormData();
  // formData.append("signedFile", signedFile);
  // const res = await fetch(`${BASE}/submissions/${id}/sign`, {
  //   method: "POST",
  //   body: formData,
  // });
  // if (!res.ok) throw new Error("Signed file upload failed");
  // return res.json();
}
