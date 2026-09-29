// ============================================================
// Person 2 — Intern Documents Page (/documents)
// ============================================================

import { useState, useEffect } from "react";
// Uncomment this when Person 1's backend is ready:
// import { getChecklist, uploadDocument } from "../api/api";

// ── Fake data for testing the UI ──────────────────────────────
const FAKE_DATA = [
  { documentName: "School Endorsement Letter", status: "not submitted" },
  { documentName: "Memorandum of Agreement (MOA)", status: "pending" },
  { documentName: "Parent/Guardian Consent Form", status: "approved" },
  { documentName: "Resume / CV", status: "rejected" },
  {
    documentName: "Medical Certificate",
    status: "signed",
    signedFilePath: "/uploads/sample-signed.pdf",
  },
  { documentName: "Insurance Certificate / Waiver", status: "not submitted" },
  { documentName: "Daily Time Record (DTR)", status: "not submitted" },
  { documentName: "Midterm Evaluation Form", status: "not submitted" },
  { documentName: "Final Evaluation Form", status: "not submitted" },
  {
    documentName: "Narrative / Accomplishment Report",
    status: "not submitted",
  },
  { documentName: "Certificate of Completion", status: "not submitted" },
];

export default function DocumentsPage() {
  const [internName, setInternName] = useState("");
  const [documents, setDocuments] = useState(FAKE_DATA);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ============================================================
  // Get checklist from backend
  // ============================================================
  useEffect(() => {
   
    // Keep fake data while backend is not connected
    setDocuments(FAKE_DATA);
  }, [internName]);

  // ============================================================
  // Upload document
  // ============================================================
  async function handleUpload(documentName, file) {
    if (!file) return;

    if (!internName.trim()) {
      setError("Please enter your name before uploading a document.");
      return;
    }

    setError("");
    setMessage("");
    setUploading(documentName);

    try {
      /*
      // Uncomment when Person 1's backend is ready:

      await uploadDocument(internName, documentName, file);

      setMessage(`${documentName} uploaded successfully.`);

      const updatedDocuments = await getChecklist(internName);
      setDocuments(updatedDocuments);
      */

      // Temporary fake behavior
      setTimeout(() => {
        setDocuments((currentDocuments) =>
          currentDocuments.map((doc) =>
            doc.documentName === documentName
              ? { ...doc, status: "pending" }
              : doc
          )
        );

        setMessage(`${documentName} uploaded successfully.`);
        setUploading("");
      }, 500);

      return;
    } catch (err) {
      setError("Failed to upload the document. Please try again.");
      setUploading("");
    }
  }

  // ============================================================
  // Status badge
  // ============================================================
  function getStatusStyle(status) {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "signed":
        return "bg-blue-100 text-blue-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  function formatStatus(status) {
    if (status === "not submitted") {
      return "Not Submitted";
    }

    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            My Internship Documents
          </h1>

          <p className="text-gray-500 mt-2">
            Upload and track the required documents for your internship.
          </p>
        </div>

        {/* Intern Information */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Intern Information
          </h2>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>

          <input
            type="text"
            value={internName}
            onChange={(e) => {
              setInternName(e.target.value);
              setMessage("");
              setError("");
            }}
            placeholder="Enter your full name"
            className="w-full md:w-96 border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />

          <p className="text-xs text-gray-500 mt-2">
            Enter your name to view and manage your internship documents.
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-md px-4 py-3 mb-6">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* Documents */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Required Documents
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Complete all required documents before your internship.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-10 text-gray-500">
              Loading documents...
            </div>
          )}

          {/* Document List */}
          {!loading && (
            <div className="divide-y divide-gray-200">
              {documents.map((doc, index) => (
                <div
                  key={doc.documentName}
                  className="p-5 hover:bg-gray-50 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    {/* Document Name */}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-800">
                          {doc.documentName}
                        </h3>

                        <span
                          className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                            doc.status
                          )}`}
                        >
                          {formatStatus(doc.status)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">

                      {/* Upload */}
                      {doc.status === "not submitted" && (
                        <label
                          className={`cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition ${
                            uploading === doc.documentName
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {uploading === doc.documentName
                            ? "Uploading..."
                            : "Upload"}

                          <input
                            type="file"
                            className="hidden"
                            disabled={uploading === doc.documentName}
                            onChange={(e) => {
                              handleUpload(
                                doc.documentName,
                                e.target.files[0]
                              );

                              e.target.value = "";
                            }}
                          />
                        </label>
                      )}

                      {/* Pending */}
                      {doc.status === "pending" && (
                        <span className="text-sm text-yellow-600">
                          Waiting for review
                        </span>
                      )}

                      {/* Approved */}
                      {doc.status === "approved" && (
                        <span className="text-sm text-green-600">
                          Approved
                        </span>
                      )}

                      {/* Rejected */}
                      {doc.status === "rejected" && (
                        <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition">
                          Re-upload

                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              handleUpload(
                                doc.documentName,
                                e.target.files[0]
                              );

                              e.target.value = "";
                            }}
                          />
                        </label>
                      )}

                      {/* Download Signed Copy */}
                      {doc.status === "signed" &&
                        doc.signedFilePath && (
                          <a
                            href={doc.signedFilePath}
                            download
                            className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition"
                          >
                            Download
                          </a>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-5 text-sm text-gray-500">
          <p>
            Please make sure that all uploaded files are clear and readable.
          </p>
        </div>

      </div>
    </div>
  );
}
```
