const mongoose = require("mongoose");

const responderSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  vehicleNo: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  licenseImg: {
    type: String,
    required: true,
  },
  aadharImg: {
    type: String,
    required: true,
  },
  photoidImg: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("responder", responderSchema);
