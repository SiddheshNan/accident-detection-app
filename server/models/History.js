const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  responderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "responder",
  },

  accidentLocation: {
    type: String,
    required: true,
  },

  addedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("history", historySchema);
