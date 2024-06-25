const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      'Sedan',
      'Hatchback',
      'Coupe',
      'Convertible',
      'SUV',
      'Crossover SUV',
      'Minivan',
      'Pickup Truck',
      'Van',
      'Wagon',
      'Sports Car',
      'Luxury Car',
      'Electric Vehicle',
      'Hybrid',
      'Motorcycle',
      'Scooter',
      'Bicycle',
    ],
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
    enum: [2, 3, 4, 6, 8],
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
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'hybrid', 'plug-in hybrid'],
    required: true,
  },
  transmission: {
    type: String,
    enum: ['manual', 'automatic', 'CVT', 'semi-automatic'],
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Vehicle", VehicleSchema);