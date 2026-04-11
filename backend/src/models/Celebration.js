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
    eventTime: {
      type: String,
      default: "00:00"
    },
    images: {
      type: [String],
      default: []
    },
    audio: {
      type: String,
      default: ""
    },
    audioStartTime: {
      type: Number,
      default: 0
    },
    video: {
      type: String,
      default: ""
    },
    theme: {
      type: String,
      default: "seventeen"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Celebration", celebrationSchema);
