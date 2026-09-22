const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// ── Multer storage configuration ────────────────────────────────────────────
// TODO (Person 1): customise destination/filename as needed.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists or create it
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ── Hardcoded document list ──────────────────────────────────────────────────
// Shared by the checklist endpoint and used as the canonical list everywhere.
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

// ── GET /api/checklist?intern=NAME ───────────────────────────────────────────
// Returns the 11 documents merged with this intern's submission status.
router.get("/checklist", async (req, res) => {
  // TODO (Person 1): implement this
  // 1. Read req.query.intern for the intern name
  // 2. Query Submission.find({ internName }) to get existing submissions
  // 3. Merge with DOCUMENT_LIST so every document appears (status = "not submitted" if missing)
  // 4. Return the merged array
  res.json({
    message: "TODO: implement GET /api/checklist",
    intern: req.query.intern,
    documents: DOCUMENT_LIST.map((name) => ({
      documentName: name,
      status: "not submitted",
    })),
  });
});

// ── POST /api/submissions ────────────────────────────────────────────────────
// Intern uploads a file for one document.
router.post("/submissions", upload.single("file"), async (req, res) => {
  // TODO (Person 1): implement this
  // 1. Read req.body.internName and req.body.documentName
  // 2. Read req.file for the uploaded file details
  // 3. Create or update a Submission document (upsert by internName + documentName)
  // 4. Return the saved submission
  res.status(201).json({
    message: "TODO: implement POST /api/submissions",
    body: req.body,
    file: req.file,
  });
});

// ── GET /api/submissions ─────────────────────────────────────────────────────
// List every submission (for staff admin view).
router.get("/submissions", async (req, res) => {
  // TODO (Person 1): implement this
  // 1. Query Submission.find({}) (optionally allow ?intern= filter)
  // 2. Return the array of submissions
  res.json({
    message: "TODO: implement GET /api/submissions",
    submissions: [],
  });
});

// ── PATCH /api/submissions/:id ───────────────────────────────────────────────
// Staff sets status to "approved" or "rejected".
router.patch("/submissions/:id", async (req, res) => {
  // TODO (Person 1): implement this
  // 1. Read req.params.id
  // 2. Read req.body.status — validate it is "approved" or "rejected"
  // 3. Find the submission and update its status
  // 4. Return the updated submission
  res.json({
    message: "TODO: implement PATCH /api/submissions/:id",
    id: req.params.id,
    body: req.body,
  });
});

// ── POST /api/submissions/:id/sign ───────────────────────────────────────────
// Staff uploads the signed/processed file; status becomes "signed".
router.post(
  "/submissions/:id/sign",
  upload.single("signedFile"),
  async (req, res) => {
    // TODO (Person 1): implement this
    // 1. Read req.params.id
    // 2. Read req.file for the signed file details
    // 3. Find the submission, set signedFileName, signedFilePath, status = "signed"
    // 4. Return the updated submission
    res.json({
      message: "TODO: implement POST /api/submissions/:id/sign",
      id: req.params.id,
      file: req.file,
    });
  }
);

module.exports = router;
