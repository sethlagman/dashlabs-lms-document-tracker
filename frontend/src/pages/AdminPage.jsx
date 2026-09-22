// ============================================================
// Person 3 — Staff Admin Page  (/admin)
// ============================================================
// What to build here:
//  1. A table of every submission across all interns.
//     Columns: Intern Name | Document | Status | Submitted File | Actions
//  2. "Approve" and "Reject" buttons on each row that call the PATCH endpoint.
//  3. An "Upload Signed Copy" button per row that calls the sign endpoint.
//
// Getting started:
//  - Start with the FAKE_DATA array below — it's shaped exactly like the real
//    API response so you can build and style the table without touching the backend.
//  - When Person 1's routes are ready, delete FAKE_DATA and uncomment the
//    real API call (see the TODO comment inside the useEffect).
//
// API calls you'll use (see src/api/api.js):
//  - getAllSubmissions()                     → array of Submission objects
//  - updateStatus(id, status)               → updated Submission object
//  - uploadSignedFile(id, signedFile)        → updated Submission object
// ============================================================

import { useState, useEffect } from "react";
// import { getAllSubmissions, updateStatus, uploadSignedFile } from "../api/api"; // uncomment when ready

// ── Fake data shaped like the real API response ──────────────────────────────
// TODO (Person 3): replace with real API call once Person 1's routes are done.
const FAKE_DATA = [
  { _id: "1", internName: "Alice Santos",  documentName: "School Endorsement Letter",      status: "pending",   filePath: "/uploads/sample.pdf", signedFilePath: null },
  { _id: "2", internName: "Alice Santos",  documentName: "Memorandum of Agreement (MOA)",  status: "approved",  filePath: "/uploads/sample.pdf", signedFilePath: null },
  { _id: "3", internName: "Bob Reyes",     documentName: "Resume / CV",                    status: "rejected",  filePath: "/uploads/sample.pdf", signedFilePath: null },
  { _id: "4", internName: "Bob Reyes",     documentName: "Medical Certificate",             status: "signed",    filePath: "/uploads/sample.pdf", signedFilePath: "/uploads/signed.pdf" },
  { _id: "5", internName: "Carol Mendoza", documentName: "Parent/Guardian Consent Form",   status: "pending",   filePath: "/uploads/sample.pdf", signedFilePath: null },
];

// Helper — colour-code status badges
const STATUS_STYLES = {
  pending:  "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  signed:   "bg-blue-100 text-blue-800",
};

export default function AdminPage() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    // TODO (Person 3): replace fake data with real API call:
    //   getAllSubmissions().then(setSubmissions);
    setSubmissions(FAKE_DATA);
  }, []);

  // TODO (Person 3): implement approve / reject handler
  function handleStatusChange(id, newStatus) {
    // TODO: call updateStatus(id, newStatus) then refresh the list
    console.log("TODO: set status", id, newStatus);
  }

  // TODO (Person 3): implement signed-file upload handler
  function handleSignedUpload(id, file) {
    // TODO: call uploadSignedFile(id, file) then refresh the list
    console.log("TODO: upload signed file for", id, file);
  }

  // TODO (Person 3): build the real UI using the design mockup as reference
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Staff — All Submissions</h1>
      <p className="text-gray-500 mb-6">
        {/* TODO (Person 3): build this page */}
        Placeholder — see the TODO comments in this file to get started.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm bg-white border rounded shadow-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Intern</th>
              <th className="px-4 py-3 text-left">Document</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">File</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {submissions.map((sub) => (
              <tr key={sub._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{sub.internName}</td>
                <td className="px-4 py-3">{sub.documentName}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[sub.status] ?? ""}`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {sub.filePath ? (
                    <a href={sub.filePath} download className="text-blue-500 hover:underline">
                      View
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 flex gap-2 flex-wrap">
                  {/* TODO (Person 3): only show Approve/Reject when status is "pending" */}
                  <button
                    onClick={() => handleStatusChange(sub._id, "approved")}
                    className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(sub._id, "rejected")}
                    className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>

                  {/* Upload signed copy */}
                  <label className="cursor-pointer bg-indigo-500 text-white text-xs px-2 py-1 rounded hover:bg-indigo-600">
                    Upload Signed
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleSignedUpload(sub._id, e.target.files[0])}
                    />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
