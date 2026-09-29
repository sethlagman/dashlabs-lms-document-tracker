import { useState, useEffect, useRef } from "react";
import { getChecklist, uploadDocument } from "../api/api";

// ── Subtitles per document (from mockup) ─────────────────────────────────────
const DOC_SUBTITLES = {
  "School Endorsement Letter":          "Signature required from your school",
  "Memorandum of Agreement (MOA)":      "Signature required from both parties",
  "Parent/Guardian Consent Form":       "Required if under 18",
  "Resume / CV":                        "No signature required",
  "Medical Certificate":                "No signature required",
  "Insurance Certificate / Waiver":     "Signature required",
  "Daily Time Record (DTR)":            "Signature required from supervisor",
  "Midterm Evaluation Form":            "Signature required from supervisor",
  "Final Evaluation Form":              "Signature required from supervisor",
  "Narrative / Accomplishment Report":  "No signature required",
  "Certificate of Completion":          "Issued and signed by Dashlabs",
};

// ── Status display config ─────────────────────────────────────────────────────
const STATUS_META = {
  signed:           { label: "Signed",          badge: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200" },
  approved:         { label: "Approved",         badge: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200" },
  pending:          { label: "Pending Review",   badge: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200" },
  rejected:         { label: "Needs Revision",   badge: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200" },
  "not submitted":  { label: "Not Submitted",    badge: "bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-200" },
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconFile = () => (
  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/>
    <polyline points="14 3 14 8 19 8"/>
    <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/>
  </svg>
);
const IconUpload = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21V9"/><polyline points="7 14 12 9 17 14"/><path d="M5 4h14"/>
  </svg>
);
const IconDownload = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v12"/><polyline points="7 10 12 15 17 10"/><path d="M5 20h14"/>
  </svg>
);
const IconCheck = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/><polyline points="8 12.5 11 15.5 16 9"/>
  </svg>
);
const IconClock = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>
  </svg>
);
const IconAlert = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/>
    <line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconCircle = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
    <circle cx="12" cy="12" r="9"/>
  </svg>
);
const IconCloud = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 16l-4-4-4 4"/><path d="M12 12v9"/>
    <path d="M20.4 17.5A4.5 4.5 0 0 0 18 9h-1.3A7 7 0 1 0 4 15.9"/>
  </svg>
);

function statusIcon(status) {
  switch (status) {
    case "signed":
    case "approved":   return <IconCheck />;
    case "pending":    return <IconClock />;
    case "rejected":   return <IconAlert />;
    default:           return <IconCircle />;
  }
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, accent = "default" }) {
  const styles = {
    default: { border: "border-t-slate-300",  value: "text-slate-900" },
    blue:    { border: "border-t-blue-600",   value: "text-blue-600" },
    amber:   { border: "border-t-amber-500",  value: "text-amber-600" },
    red:     { border: "border-t-red-500",    value: "text-red-600" },
    green:   { border: "border-t-green-600",  value: "text-green-700" },
  };
  const s = styles[accent] ?? styles.default;
  return (
    <div className={`bg-white border-t-[3px] ${s.border} rounded-[10px] shadow-sm px-[18px] py-4`}>
      <div className="text-[10.5px] font-bold uppercase tracking-[.06em] text-slate-400 mb-2">{label}</div>
      <div className={`text-[25px] font-bold ${s.value}`}>{value}</div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DocumentsPage() {
  const [internName, setInternName]       = useState("");
  const [documents, setDocuments]         = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [selectedDocName, setSelectedDocName] = useState("");
  const [pendingFile, setPendingFile]     = useState(null);
  const [uploading, setUploading]         = useState(false);
  const [toast, setToast]                 = useState("");
  const [toastVisible, setToastVisible]   = useState(false);
  const [activity, setActivity]           = useState([]);
  const [time, setTime]                   = useState(new Date());
  const [isDragging, setIsDragging]       = useState(false);
  const [binPulse, setBinPulse]           = useState(false);

  const fileInputRef   = useRef(null);
  const binRef         = useRef(null);
  const toastTimer     = useRef(null);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Fetch checklist when intern name changes
  useEffect(() => {
    if (!internName.trim()) { setDocuments([]); return; }
    setLoading(true);
    setError("");
    getChecklist(internName.trim())
      .then((data) => {
        setDocuments(data);
        // pre-select first actionable doc in the bin
        const first = data.find((d) => d.status === "not submitted" || d.status === "rejected");
        setSelectedDocName(first?.documentName ?? data[0]?.documentName ?? "");
      })
      .catch(() => setError("Failed to load documents. Please try again."))
      .finally(() => setLoading(false));
  }, [internName]);

  // ── Toast helper ──────────────────────────────────────────────────────────
  function showToast(msg) {
    setToast(msg);
    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 3000);
  }

  // ── Open bin for a specific doc (called from Upload buttons) ──────────────
  function openBinFor(docName) {
    setSelectedDocName(docName);
    binRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    // pulse animation
    setBinPulse(false);
    requestAnimationFrame(() => setBinPulse(true));
    setTimeout(() => setBinPulse(false), 1000);
  }

  // ── File handling ─────────────────────────────────────────────────────────
  function handleFile(file) { if (file) setPendingFile(file); }

  function removeFile() {
    setPendingFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!internName.trim()) { setError("Please enter your name first."); return; }
    if (!pendingFile || !selectedDocName) return;

    setUploading(true);
    try {
      await uploadDocument(internName.trim(), selectedDocName, pendingFile);
      const updated = await getChecklist(internName.trim());
      setDocuments(updated);
      setActivity((prev) => [
        { color: "amber", text: `${selectedDocName} submitted for review`, time: "Just now" },
        ...prev.slice(0, 4),
      ]);
      showToast(`"${pendingFile.name}" submitted for review.`);
      removeFile();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  // ── Computed values ───────────────────────────────────────────────────────
  const counts = {
    required:  documents.length || 11,
    submitted: documents.filter((d) => d.status !== "not submitted").length,
    pending:   documents.filter((d) => d.status === "pending").length,
    revision:  documents.filter((d) => d.status === "rejected").length,
    approved:  documents.filter((d) => d.status === "approved").length,
    signed:    documents.filter((d) => d.status === "signed").length,
  };
  const progressPct = documents.length
    ? Math.round((counts.submitted / documents.length) * 100)
    : 0;

  const filterCounts = {
    all:       documents.length,
    action:    documents.filter((d) => d.status === "not submitted" || d.status === "rejected").length,
    review:    documents.filter((d) => d.status === "pending").length,
    completed: documents.filter((d) => d.status === "approved" || d.status === "signed").length,
  };

  const filteredDocs = documents.filter((d) => {
    if (currentFilter === "action")    return d.status === "not submitted" || d.status === "rejected";
    if (currentFilter === "review")    return d.status === "pending";
    if (currentFilter === "completed") return d.status === "approved" || d.status === "signed";
    return true;
  });

  const today    = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const clockStr = time.toLocaleTimeString("en-US", { hour12: false });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-7 pb-16 max-w-[1500px]">

      {/* ── Header Banner ───────────────────────────────────────────────── */}
      <header className="rounded-2xl bg-gradient-to-br from-[#EEF2FF] to-[#E4E9FC] px-8 py-[22px] flex items-center justify-between mb-[22px] gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 m-0">Document Tracker 📁</h1>
          <p className="text-[13.5px] text-slate-500 mt-1">{today} · Submit and track your internship documents</p>
          <div className="mt-3">
            <input
              type="text"
              value={internName}
              onChange={(e) => { setInternName(e.target.value); setError(""); }}
              placeholder="Enter your full name to load your documents…"
              className="text-sm border border-slate-200 bg-white rounded-lg px-3.5 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 placeholder:text-slate-400 shadow-sm"
            />
          </div>
        </div>
        <div className="text-right">
          <div className="text-[22px] font-bold tabular-nums text-slate-900">{clockStr}</div>
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold mt-1 justify-end">
            <span className="w-[7px] h-[7px] rounded-full bg-green-500 inline-block" />
            Live
          </div>
        </div>
      </header>

      {/* ── Error ───────────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
          {error}
        </div>
      )}

      {/* ── Stats Grid ──────────────────────────────────────────────────── */}
      {documents.length > 0 && (
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-[22px]">
          <StatCard label="Documents Required" value={counts.required} accent="default" />
          <StatCard label="Submitted"          value={counts.submitted} accent="blue" />
          <StatCard label="Pending Review"     value={counts.pending}   accent="amber" />
          <StatCard label="Needs Revision"     value={counts.revision}  accent="red" />
          <StatCard label="Approved"           value={counts.approved}  accent="green" />
          <StatCard label="Signed"             value={counts.signed}    accent="blue" />
        </section>
      )}

      {/* ── Progress Card ───────────────────────────────────────────────── */}
      {documents.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm px-6 py-5 mb-[22px] flex items-center justify-between gap-6 flex-wrap">
          <div className="flex-1 min-w-[220px]">
            <p className="text-[11.5px] font-bold uppercase tracking-[.06em] text-slate-500 mb-1.5">
              Document Submission Progress
            </p>
            <div className="flex items-baseline gap-2.5">
              <span className="text-xl font-bold text-slate-900">{progressPct}%</span>
              <span className="text-[13px] text-slate-500">Submitted</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2.5">
              <div
                className="h-full bg-blue-600 rounded-full transition-[width] duration-500 ease-in-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-[10.5px] font-bold uppercase tracking-[.06em] text-slate-400 mb-1">Documents Remaining</div>
            <div className="text-2xl font-bold text-slate-900">{documents.length - counts.submitted}</div>
          </div>
        </div>
      )}

      {/* ── Two-column layout ────────────────────────────────────────────── */}
      <div className="flex gap-5 items-start">

        {/* ── Left: Document List ──────────────────────────────────────── */}
        <div className="flex-[1.7] min-w-0">
          <div className="bg-white rounded-2xl shadow-sm px-[22px] py-5">
            <p className="text-[11.5px] font-bold uppercase tracking-[.06em] text-slate-500 mb-3">
              Required Documents
            </p>

            {/* Filter buttons */}
            {documents.length > 0 && (
              <div className="flex gap-2 mb-3.5 flex-wrap">
                {[
                  { key: "all",       label: "All" },
                  { key: "action",    label: "Action Needed" },
                  { key: "review",    label: "In Review" },
                  { key: "completed", label: "Completed" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setCurrentFilter(key)}
                    className={`text-[12.5px] font-semibold px-[13px] py-[6px] rounded-full border transition-all ${
                      currentFilter === key
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-[#F8FAFC] border-slate-100 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {label} ({filterCounts[key]})
                  </button>
                ))}
              </div>
            )}

            {/* States */}
            {loading ? (
              <p className="text-sm text-slate-400 py-10 text-center">Loading documents…</p>
            ) : !internName.trim() ? (
              <p className="text-sm text-slate-400 py-10 text-center">
                Enter your name above to view your documents.
              </p>
            ) : filteredDocs.length === 0 ? (
              <p className="text-sm text-slate-400 py-10 text-center">
                No documents in this view.
              </p>
            ) : (
              <div>
                {filteredDocs.map((doc, i) => {
                  const meta     = STATUS_META[doc.status] ?? STATUS_META["not submitted"];
                  const subtitle = DOC_SUBTITLES[doc.documentName] ?? "";
                  const isLast   = i === filteredDocs.length - 1;

                  return (
                    <div
                      key={doc.documentName}
                      className={`flex items-center gap-3.5 py-3.5 flex-wrap ${!isLast ? "border-b border-slate-50" : ""}`}
                    >
                      {/* File icon */}
                      <div className="w-[38px] h-[38px] rounded-[10px] bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                        <IconFile />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-[180px]">
                        <div className="text-[14.5px] font-semibold text-slate-900">{doc.documentName}</div>
                        <div className="text-[12.5px] text-slate-400 mt-0.5">{subtitle}</div>
                        {doc.status === "rejected" && (
                          <div className="text-xs text-red-500 mt-0.5 font-medium">
                            Please re-upload — document was rejected.
                          </div>
                        )}
                      </div>

                      {/* Status badge */}
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-[11px] py-[5px] rounded-full flex-shrink-0 ${meta.badge}`}>
                        {statusIcon(doc.status)}
                        {meta.label}
                      </span>

                      {/* Action */}
                      {(doc.status === "not submitted" || doc.status === "rejected") && (
                        <button
                          onClick={() => openBinFor(doc.documentName)}
                          className="flex-shrink-0 flex items-center gap-1.5 border border-slate-100 bg-white text-blue-600 text-[12.5px] font-bold px-3.5 py-[7px] rounded-lg hover:bg-blue-50 hover:border-blue-100 transition-all"
                        >
                          <IconUpload /> Upload
                        </button>
                      )}
                      {(doc.status === "approved" || doc.status === "signed") && (doc.signedFilePath || doc.filePath) && (
                        <a
                          href={doc.signedFilePath || doc.filePath}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="flex-shrink-0 flex items-center gap-1.5 border border-slate-100 bg-white text-blue-600 text-[12.5px] font-bold px-3.5 py-[7px] rounded-lg hover:bg-blue-50 hover:border-blue-100 transition-all"
                        >
                          <IconDownload /> Download
                        </a>
                      )}
                      {doc.status === "pending" && (
                        <span className="text-xs text-slate-400 italic flex-shrink-0">Awaiting review</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Submission Bin + Activity ─────────────────────────── */}
        <div className="flex-1 min-w-[300px] flex flex-col gap-5 sticky top-6">

          {/* Submission Bin */}
          <div
            ref={binRef}
            style={{
              boxShadow: binPulse
                ? "0 0 0 0 rgba(37,99,235,0), 0 1px 3px rgba(15,23,42,.06)"
                : undefined,
              animation: binPulse ? "pulseBorder 1s ease" : undefined,
            }}
            className="bg-white rounded-2xl shadow-sm px-[22px] py-5"
          >
            <style>{`@keyframes pulseBorder { 0%{box-shadow:0 0 0 0 rgba(37,99,235,.35),0 1px 3px rgba(15,23,42,.06)} 100%{box-shadow:0 0 0 10px rgba(37,99,235,0),0 1px 3px rgba(15,23,42,.06)} }`}</style>

            <p className="text-[11.5px] font-bold uppercase tracking-[.06em] text-slate-500 mb-1">
              Submission Bin
            </p>
            <p className="text-[12.5px] text-slate-500 mb-3.5">
              Choose the document you're submitting, then drop your file below.
            </p>

            {/* Document selector */}
            <select
              value={selectedDocName}
              onChange={(e) => setSelectedDocName(e.target.value)}
              disabled={!internName.trim() || documents.length === 0}
              className="w-full px-3 py-2.5 rounded-[9px] border border-slate-100 text-[13.5px] text-slate-900 bg-[#F8FAFC] mb-3 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 font-[inherit]"
            >
              {documents.length === 0
                ? <option>Enter your name first</option>
                : documents.map((d) => (
                  <option key={d.documentName} value={d.documentName}>
                    {d.documentName}
                  </option>
                ))
              }
            </select>

            {/* Dropzone */}
            {!pendingFile && (
              <div
                onClick={() => internName.trim() && fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
                }}
                className={`border-2 border-dashed rounded-xl py-[26px] px-4 text-center transition-all
                  ${internName.trim() ? "cursor-pointer" : "cursor-not-allowed opacity-60"}
                  ${isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-300 bg-[#F8FAFC] hover:border-blue-500 hover:bg-blue-50"
                  }`}
              >
                <div className={`flex justify-center mb-2 ${isDragging ? "text-blue-500" : "text-slate-400"}`}>
                  <IconCloud />
                </div>
                <p className="text-[13px] text-slate-700">
                  Drag & drop your file here, or{" "}
                  <span className="text-blue-600 font-bold">click to browse</span>
                </p>
                <p className="text-[11.5px] text-slate-400 mt-1.5">PDF, DOCX, JPG or PNG · Max 10MB</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); }}
            />

            {/* File panel */}
            {pendingFile && (
              <div className="flex items-center gap-2.5 mt-3 bg-[#F8FAFC] border border-slate-100 rounded-[10px] px-3 py-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/>
                    <polyline points="14 3 14 8 19 8"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-semibold text-slate-900 truncate">{pendingFile.name}</div>
                  <div className="text-[11.5px] text-slate-400">{(pendingFile.size / 1024).toFixed(0)} KB</div>
                </div>
                <button
                  onClick={removeFile}
                  className="text-slate-400 text-lg leading-none px-1.5 hover:text-slate-700 transition-colors"
                >
                  ×
                </button>
              </div>
            )}

            {/* Submit button */}
            {pendingFile && (
              <button
                onClick={handleSubmit}
                disabled={uploading || !internName.trim()}
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-[13.5px] font-bold py-[11px] rounded-[9px] flex items-center justify-center gap-2 transition-colors"
              >
                {uploading ? "Submitting…" : "Submit Document"}
              </button>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm px-[22px] py-5">
            <p className="text-[11.5px] font-bold uppercase tracking-[.06em] text-slate-500 mb-3">
              Recent Activity
            </p>
            {activity.length === 0 ? (
              <p className="text-[12.5px] text-slate-400 italic">No activity yet.</p>
            ) : (
              <div>
                {activity.map((a, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 py-2.5 ${i < activity.length - 1 ? "border-b border-slate-50" : ""}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                      ${a.color === "green" ? "bg-green-50 text-green-700"
                        : a.color === "red" ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-600"}`}
                    >
                      {a.color === "green" ? <IconCheck className="w-3.5 h-3.5" /> 
                        : a.color === "red" ? <IconAlert className="w-3.5 h-3.5" />
                        : <IconClock className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="text-[12.5px] text-slate-700 leading-snug">{a.text}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Toast ────────────────────────────────────────────────────────── */}
      <div
        className={`fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-[13px] rounded-[10px] flex items-center gap-2.5 text-[13.5px] font-semibold shadow-2xl transition-all duration-[250ms] z-50
          ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}`}
      >
        <svg className="w-[18px] h-[18px] text-green-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/><polyline points="8 12.5 11 15.5 16 9"/>
        </svg>
        {toast}
      </div>
    </div>
  );
}
