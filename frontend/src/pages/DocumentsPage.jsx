// ============================================================
// Person 2 — Intern Documents Page  (/documents)
// ============================================================
// What to build here:
//  1. A text input (or dropdown) so the intern can enter their name.
//  2. A list of all 11 required documents, each showing its current status.
//  3. An "Upload" button next to any document that hasn't been submitted yet.
//  4. A "Download" button next to any document whose status is "signed"
//     (the staff-uploaded processed copy is available).
//
// Getting started:
//  - Start with the FAKE_DATA array below — it's shaped exactly like the real
//    API response so you can build and style the UI without touching the backend.
//  - When Person 1's routes are ready, delete FAKE_DATA and uncomment the
//    real API call (see the TODO comment inside the useEffect).
//
// API calls you'll use (see src/api/api.js):
//  - getChecklist(internName)  → array of { documentName, status, _id?, filePath?, signedFilePath? }
//  - uploadDocument(internName, documentName, file)  → created Submission object
// ============================================================

import { useState, useEffect } from "react";
// import { getChecklist, uploadDocument } from "../api/api"; // uncomment when ready

// ── Fake data shaped like the real API response ──────────────────────────────
// TODO (Person 2): replace with real API call once Person 1's routes are done.
const FAKE_DATA = [
  { documentName: "School Endorsement Letter",       status: "not submitted" },
  { documentName: "Memorandum of Agreement (MOA)",   status: "pending"       },
  { documentName: "Parent/Guardian Consent Form",    status: "approved"      },
  { documentName: "Resume / CV",                     status: "rejected"      },
  { documentName: "Medical Certificate",             status: "signed",        signedFilePath: "/uploads/sample-signed.pdf" },
  { documentName: "Insurance Certificate / Waiver",  status: "not submitted" },
  { documentName: "Daily Time Record (DTR)",         status: "not submitted" },
  { documentName: "Midterm Evaluation Form",         status: "not submitted" },
  { documentName: "Final Evaluation Form",           status: "not submitted" },
  { documentName: "Narrative / Accomplishment Report", status: "not submitted" },
  { documentName: "Certificate of Completion",       status: "not submitted" },
];

export default function DocumentsPage() {
  const [internName, setInternName] = useState("");
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // TODO (Person 2): replace fake data with real API call:
    //   if (internName) getChecklist(internName).then(setDocuments);
    setDocuments(FAKE_DATA);
  }, [internName]);

  // TODO (Person 2): implement file upload handler
  function handleUpload(documentName, file) {
    // TODO: call uploadDocument(internName, documentName, file)
    console.log("TODO: upload", documentName, file);
  }

  // TODO (Person 2): build the real UI using the design mockup as reference
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Documents</h1>
      <p className="text-gray-500 mb-6">
        {/* TODO (Person 2): build this page */}
        Placeholder — see the TODO comments in this file to get started.
      </p>

      {/* Intern name input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </label>
        <input
          type="text"
          value={internName}
          onChange={(e) => setInternName(e.target.value)}
          placeholder="Enter your full name"
          className="border border-gray-300 rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Document list (minimal skeleton — style this properly) */}
      <ul className="space-y-2">
        {documents.map((doc) => (
          <li
            key={doc.documentName}
            className="flex items-center justify-between bg-white border rounded p-3 shadow-sm"
          >
            <span className="font-medium">{doc.documentName}</span>
            <span className="text-sm text-gray-500 mx-4">{doc.status}</span>

            {/* TODO (Person 2): show Upload button when status is "not submitted" */}
            {doc.status === "not submitted" && (
              <label className="cursor-pointer bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600">
                Upload
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleUpload(doc.documentName, e.target.files[0])}
                />
              </label>
            )}

            {/* TODO (Person 2): show Download button when status is "signed" */}
            {doc.status === "signed" && doc.signedFilePath && (
              <a
                href={doc.signedFilePath}
                download
                className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600"
              >
                Download
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
