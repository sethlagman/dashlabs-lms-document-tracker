// ============================================================
// Person 3 — Staff Admin Page  (/admin)
// ============================================================
// What this page does:
//  1. Shows a table of every submission across all interns.
//     Columns: Intern Name | Document | Status | Submitted File | Actions
//  2. "Approve" and "Reject" buttons on pending rows call the PATCH endpoint.
//  3. An "Upload Signed Copy" button per row calls the sign endpoint.
//
// Getting started:
//  - Uses the FAKE_DATA array below — it's shaped exactly like the real
//    API response so you can build and style the table without touching the backend.
//  - When Person 1's routes are ready, delete FAKE_DATA and uncomment the
//    real API call (see the TODO comment inside the useEffect).
//
// API calls you'll use (see src/api/api.js):
//  - getAllSubmissions()                     → array of Submission objects
//  - updateStatus(id, status)               → updated Submission object
//  - uploadSignedFile(id, signedFile)        → updated Submission object
// ============================================================
//
// Extras added beyond the base requirements:
//  - Search bar to filter by intern name or document name
//  - Sortable Intern / Document / Status columns (click header to toggle A-Z / Z-A)
//  - Stat cards (Total/Pending/Approved/Rejected/Signed) double as status filters —
//    click a card to show only that status, click Total to clear the filter
//  - "Submitted at [date/time]" shown under each document name
//  - Once a signed copy is uploaded, a small checkmark badge appears next to
//    "Upload Signed" that opens the signed file, without replacing the upload button
//  - "Upload Signed" is disabled (greyed out) for rejected submissions, since a
//    rejected document shouldn't be signed until it's resubmitted and approved
//  - Hover tooltips on View / Approve / Reject / Upload Signed explaining each action
// ============================================================

import { useState, useEffect } from "react";
import { getAllSubmissions, updateStatus, uploadSignedFile } from "../api/api"; // uncomment when ready

// ── Fake data shaped like the real API response ──────────────────────────────
// TODO (Person 3): replace with real API call once Person 1's routes are done.
const FAKE_DATA = [
  { _id: "1", internName: "Alice Santos",  documentName: "School Endorsement Letter",      status: "pending",   filePath: "/uploads/sample.pdf", signedFilePath: null },
  { _id: "2", internName: "Alice Santos",  documentName: "Memorandum of Agreement (MOA)",  status: "approved",  filePath: "/uploads/sample.pdf", signedFilePath: null },
  { _id: "3", internName: "Bob Reyes",     documentName: "Resume / CV",                    status: "rejected",  filePath: "/uploads/sample.pdf", signedFilePath: null },
  { _id: "4", internName: "Bob Reyes",     documentName: "Medical Certificate",             status: "signed",    filePath: "/uploads/sample.pdf", signedFilePath: "/uploads/signed.pdf" },
  { _id: "5", internName: "Carol Mendoza", documentName: "Parent/Guardian Consent Form",   status: "pending",   filePath: "/uploads/sample.pdf", signedFilePath: null },
];

// Colour-coded status badges — palette matches document-tracker-mockup.html
const STATUS_STYLES = {
  pending:  "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  approved: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200",
  rejected: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
  signed:   "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
};

const STATUS_LABELS = {
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Needs Revision",
  signed: "Signed",
};

export default function AdminPage() {
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null); // "internName" | "documentName" | "status" | null
  const [sortDir, setSortDir] = useState("asc"); // "asc" | "desc"
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "pending" | "approved" | "rejected" | "signed"

  useEffect(() => {
    // TODO (Person 3): replace fake data with real API call:
    getAllSubmissions().then(setSubmissions);
    //  setSubmissions(FAKE_DATA);
  }, []);

  async function handleStatusChange(id, newStatus) {
    await updateStatus(id, newStatus);
    getAllSubmissions().then(setSubmissions);
  }

  async function handleSignedUpload(id, file) {
    await uploadSignedFile(id, file);
    getAllSubmissions().then(setSubmissions);
  }

  // Toggle sort: clicking the same column flips direction, a new column starts at A-Z
  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const counts = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
    signed: submissions.filter((s) => s.status === "signed").length,
  };

  // Filter by intern name or document name (case-insensitive)
  const query = search.trim().toLowerCase();
  const searchedSubmissions = query
    ? submissions.filter(
        (s) =>
          s.internName.toLowerCase().includes(query) ||
          s.documentName.toLowerCase().includes(query)
      )
    : submissions;

  // Filter by status (on top of the search filter)
  const filteredSubmissions =
    statusFilter === "all"
      ? searchedSubmissions
      : searchedSubmissions.filter((s) => s.status === statusFilter);

  // Apply sorting on top of the filtered list
  const visibleSubmissions = sortKey
    ? [...filteredSubmissions].sort((a, b) => {
        const cmp = a[sortKey].localeCompare(b[sortKey]);
        return sortDir === "asc" ? cmp : -cmp;
      })
    : filteredSubmissions;

  return (
    <div className="p-7 pb-16 max-w-6xl mx-auto">
      {/* Header banner */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 px-7 py-6 mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 m-0">Document Tracker - Admin Side 📁</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review, approve, and sign intern submitted documents.
          </p>
        </div>
      </div>

      {/* Stat cards — click one to filter the table by that status */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <StatCard
          label="Total"
          value={counts.total}
          active={statusFilter === "all"}
          onClick={() => setStatusFilter("all")}
        />
        <StatCard
          label="Pending"
          value={counts.pending}
          accent="amber"
          active={statusFilter === "pending"}
          onClick={() => setStatusFilter("pending")}
        />
        <StatCard
          label="Approved"
          value={counts.approved}
          accent="green"
          active={statusFilter === "approved"}
          onClick={() => setStatusFilter("approved")}
        />
        <StatCard
          label="Rejected"
          value={counts.rejected}
          accent="red"
          active={statusFilter === "rejected"}
          onClick={() => setStatusFilter("rejected")}
        />
        <StatCard
          label="Signed"
          value={counts.signed}
          accent="blue"
          active={statusFilter === "signed"}
          onClick={() => setStatusFilter("signed")}
        />
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <div className="relative max-w-sm w-full sm:w-auto">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by intern or document..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
              <tr>
                <SortableHeader label="Intern" sortKey="internName" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Document" sortKey="documentName" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Status" sortKey="status" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
                <th className="px-5 py-3 text-left font-semibold">File</th>
                <th className="px-5 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleSubmissions.map((sub) => (
                <tr key={sub._id} className="hover:bg-slate-50 transition-colors">
                  {/*Inters name*/}
                  <td className="px-5 py-3.5 font-medium text-slate-900">{sub.internName}</td>
                  
                  {/*Documents*/}
                  {/*<td className="px-5 py-3.5 text-slate-700">{sub.documentName}</td> */}

                  <td className="px-5 py-3.5 text-slate-700">
                    <div>{sub.documentName}</div>
                    {sub.createdAt && (
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Submitted at{" "}
                        {new Date(sub.createdAt).toLocaleString("en-PH", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </div>
                    )}
                  </td>

                  {/*Status of document*/}
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[sub.status] ?? ""}`}
                    >
                      {STATUS_LABELS[sub.status] ?? sub.status}
                    </span>
                  </td>

                  {/*View documents*/}
                  <td className="px-5 py-3.5">
                    {sub.filePath ? (
                      <a
                        href={sub.filePath}
                        title="View submitted document"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/*Actions - Approve, Reject, Upload Signed*/}
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2 flex-wrap items-center">
                      {sub.status === "pending" && (
                        <>

                         {/*Actions - Approve*/}
                          <button
                            onClick={() => handleStatusChange(sub._id, "approved")}
                            title="Approve the document?"
                            className="border border-green-200 bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            Approve
                          </button>

                         {/*Actions - Reject*/}
                          <button
                            onClick={() => handleStatusChange(sub._id, "rejected")}
                            title="Reject the document?"
                            className="border border-red-200 bg-red-50 text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      
                      {/* Actions - Upload Signed
                          Added a checkmark to indicate there's an uploaded signed document, and to view it.
                          Additionally, if the document is rejected, 'Upload Signed' is disabled. 
                      */}

                      {/* Upload Signed */}
                      <label
                        title="Upload the signed version of the document"
                        className={
                          sub.status === "rejected"
                            ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 text-xs font-bold px-3 py-1.5 rounded-lg"
                            : "cursor-pointer border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                        }
                      >
                        Upload Signed
                        <input
                          type="file"
                          className="hidden"
                          disabled={sub.status === "rejected"}
                          onChange={(e) => handleSignedUpload(sub._id, e.target.files[0])}
                        />
                      </label>

                      {sub.signedFilePath && (
                        <a
                          href={sub.signedFilePath}
                          target="_blank"
                          rel="noreferrer"
                          title="View signed copy"
                          className="flex items-center justify-center w-7 h-7 rounded-full border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3.5 h-3.5"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <polyline points="8 12 11 15 16 9" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {visibleSubmissions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                    {query || statusFilter !== "all"
                      ? "No submissions match your search/filter."
                      : "No submissions yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SortableHeader({ label, sortKey, activeKey, dir, onSort }) {
  const isActive = activeKey === sortKey;
  return (
    <th className="px-5 py-3 text-left font-semibold">
      <button
        onClick={() => onSort(sortKey)}
        className={`flex items-center gap-1.5 hover:text-slate-700 transition-colors ${
          isActive ? "text-slate-900" : ""
        }`}
      >
        {label}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-3.5 h-3.5 transition-transform ${
            isActive ? "text-slate-700" : "text-slate-300"
          } ${isActive && dir === "desc" ? "rotate-180" : ""}`}
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </th>
  );
}

function StatCard({ label, value, accent, active, onClick }) {
  const borderColor =
    {
      amber: "border-t-amber-500",
      green: "border-t-green-500",
      red: "border-t-red-500",
      blue: "border-t-blue-500",
    }[accent] || "border-t-slate-300";

  const valueColor =
    {
      amber: "text-amber-600",
      green: "text-green-600",
      red: "text-red-600",
      blue: "text-blue-600",
    }[accent] || "text-slate-900";

  const ringColor =
    {
      amber: "ring-amber-300",
      green: "ring-green-300",
      red: "ring-red-300",
      blue: "ring-blue-300",
    }[accent] || "ring-slate-300";

  return (
    <button
      onClick={onClick}
      className={`text-left bg-white rounded-xl shadow-sm border-t-4 ${borderColor} px-4 py-3.5 transition-all hover:shadow-md ${
        active ? `ring-2 ${ringColor} shadow-md` : ""
      }`}
    >
      <div className="text-[10.5px] font-bold uppercase tracking-wide text-slate-400 mb-1.5">
        {label}
      </div>
      <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
    </button>
  );
}
