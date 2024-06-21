// models/RentalHistory.js

const mongoose = require("mongoose");

const rentalHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vehicleName: String,
  startDate: Date,
  endDate: Date,
});

const RentalHistory = mongoose.model("RentalHistory", rentalHistorySchema);

module.exports = RentalHistory;
