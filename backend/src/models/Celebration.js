const mongoose = require("mongoose");

const celebrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    eventDate: {
      type: Date,
      required: true
    },
    images: {
      type: [String],
      default: []
    },
    theme: {
      type: String,
      default: "default"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Celebration", celebrationSchema);
