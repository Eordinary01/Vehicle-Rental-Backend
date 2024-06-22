const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  wheelCount: {
    type: Number,
    enum: [2, 4],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model("Vehicle", VehicleSchema);
