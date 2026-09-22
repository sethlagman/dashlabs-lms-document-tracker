const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    internName: {
      type: String,
      required: true,
      trim: true,
    },
    documentName: {
      type: String,
      required: true,
      trim: true,
    },
    // "pending" | "approved" | "rejected" | "signed"
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "signed"],
      default: "pending",
    },
    // The intern's uploaded file
    fileName: {
      type: String,
      default: null,
    },
    filePath: {
      type: String,
      default: null,
    },
    // The staff-uploaded processed / signed copy
    signedFileName: {
      type: String,
      default: null,
    },
    signedFilePath: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
