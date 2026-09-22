require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const submissionsRouter = require("./routes/submissions");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve uploaded files as static assets so the frontend can download them
// e.g. GET /uploads/filename.pdf
app.use("/uploads", express.static("uploads"));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api", submissionsRouter);

// ── MongoDB Connection ───────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅  Connected to MongoDB Atlas");
    app.listen(PORT, () => console.log(`🚀  Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌  MongoDB connection error:", err.message);
    process.exit(1);
  });
