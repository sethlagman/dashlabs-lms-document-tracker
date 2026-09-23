const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Submission = require("../models/Submission");
const router = express.Router();

// ── Ensure uploads/ folder exists ───────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ── Multer storage configuration ─────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

// ── Hardcoded document list ───────────────────────────────────────────────────
const DOCUMENT_LIST = [
  "School Endorsement Letter",
  "Memorandum of Agreement (MOA)",
  "Parent/Guardian Consent Form",
  "Resume / CV",
  "Medical Certificate",
  "Insurance Certificate / Waiver",
  "Daily Time Record (DTR)",
  "Midterm Evaluation Form",
  "Final Evaluation Form",
  "Narrative / Accomplishment Report",
  "Certificate of Completion",
];

// ── Helper: build a public URL path from a filename ──────────────────────────
// Stored as "/uploads/filename.pdf" so the frontend can use it directly.
const toUrlPath = (filename) => (filename ? `/uploads/${filename}` : null);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/checklist?intern=NAME
// Returns the 11 documents merged with this intern's submission status.
// ─────────────────────────────────────────────────────────────────────────────
router.get("/checklist", async (req, res) => {
  const { intern } = req.query;

  if (!intern || !intern.trim()) {
    return res.status(400).json({ error: "Query parameter 'intern' is required." });
  }

  try {
    // Fetch all existing submissions for this intern
    const existing = await Submission.find({ internName: intern.trim() }).lean();

    // Index them by document name for O(1) lookup
    const byDoc = {};
    for (const sub of existing) byDoc[sub.documentName] = sub;

    // Merge: every document in the canonical list gets a row
    const checklist = DOCUMENT_LIST.map((name) => {
      const sub = byDoc[name];
      if (sub) {
        return {
          _id:              sub._id,
          documentName:     sub.documentName,
          status:           sub.status,
          fileName:         sub.fileName,
          filePath:         sub.filePath,
          signedFileName:   sub.signedFileName,
          signedFilePath:   sub.signedFilePath,
          updatedAt:        sub.updatedAt,
        };
      }
      return { documentName: name, status: "not submitted" };
    });

    res.json(checklist);
  } catch (err) {
    console.error("GET /checklist error:", err);
    res.status(500).json({ error: "Server error fetching checklist." });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/submissions
// Intern uploads a file for one document.
// Body (multipart/form-data): internName, documentName, file
// ─────────────────────────────────────────────────────────────────────────────
router.post("/submissions", upload.single("file"), async (req, res) => {
  const { internName, documentName } = req.body;

  if (!internName || !documentName) {
    return res.status(400).json({ error: "internName and documentName are required." });
  }
  if (!DOCUMENT_LIST.includes(documentName)) {
    return res.status(400).json({ error: `'${documentName}' is not a recognised document.` });
  }
  if (!req.file) {
    return res.status(400).json({ error: "A file must be attached (field name: 'file')." });
  }

  try {
    // Upsert: update existing submission for this intern+doc, or create a new one
    const submission = await Submission.findOneAndUpdate(
      { internName: internName.trim(), documentName },
      {
        internName:   internName.trim(),
        documentName,
        status:       "pending",
        fileName:     req.file.filename,
        filePath:     toUrlPath(req.file.filename),
        // Clear any previous signed copy when re-uploading
        signedFileName: null,
        signedFilePath: null,
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json(submission);
  } catch (err) {
    console.error("POST /submissions error:", err);
    res.status(500).json({ error: "Server error saving submission." });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/submissions
// List every submission (staff view). Optional filter: ?intern=NAME
// ─────────────────────────────────────────────────────────────────────────────
router.get("/submissions", async (req, res) => {
  try {
    const filter = {};
    if (req.query.intern) filter.internName = req.query.intern.trim();

    const submissions = await Submission.find(filter).sort({ updatedAt: -1 }).lean();
    res.json(submissions);
  } catch (err) {
    console.error("GET /submissions error:", err);
    res.status(500).json({ error: "Server error fetching submissions." });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/submissions/:id
// Staff sets status to "approved" or "rejected".
// Body (JSON): { status: "approved" | "rejected" }
// ─────────────────────────────────────────────────────────────────────────────
router.patch("/submissions/:id", async (req, res) => {
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "status must be 'approved' or 'rejected'." });
  }

  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!submission) {
      return res.status(404).json({ error: "Submission not found." });
    }

    res.json(submission);
  } catch (err) {
    console.error("PATCH /submissions/:id error:", err);
    res.status(500).json({ error: "Server error updating status." });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/submissions/:id/sign
// Staff uploads the signed/processed file; status becomes "signed".
// Body (multipart/form-data): signedFile
// ─────────────────────────────────────────────────────────────────────────────
router.post("/submissions/:id/sign", upload.single("signedFile"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "A file must be attached (field name: 'signedFile')." });
  }

  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      {
        signedFileName: req.file.filename,
        signedFilePath: toUrlPath(req.file.filename),
        status:         "signed",
      },
      { new: true, runValidators: true }
    );

    if (!submission) {
      return res.status(404).json({ error: "Submission not found." });
    }

    res.json(submission);
  } catch (err) {
    console.error("POST /submissions/:id/sign error:", err);
    res.status(500).json({ error: "Server error uploading signed file." });
  }
});

module.exports = router;
