// Vehicle Controller (controllers/vehicleController.js)
const Vehicle = require('../models/Vehicle');

const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.send(vehicles);
  } catch (err) {
    res.status(500).send(err);
  }
};

const addVehicle = async (req, res) => {
  const { name, type, image, pricePerDay, available, wheelCount, description, features, fuelType, transmission, capacity, year } = req.body;
  try {
    const vehicle = new Vehicle({ name, type, image, pricePerDay, available, wheelCount, description, features, fuelType, transmission, capacity, year });
    await vehicle.save();
    res.status(201).send(vehicle);
  } catch (err) {
    res.status(400).send(err);
  }
};

const updateVehicle = async (req, res) => {
  const { id } = req.params;
  console.log('Vehicle ID from req.params:', id);
  let updates = req.body;

  if (updates.action === 'fetch') {
    try {
      const vehicle = await Vehicle.findById(id);
      console.log('Vehicle data found:', vehicle);
      if (!vehicle) {
        return res.status(404).send({ message: "Vehicle not found" });
      }
      return res.send(vehicle);
    } catch (err) {
      console.error('Error fetching vehicle data:', err);
      return res.status(400).send({ message: err.message });
    }
  }

  if (typeof updates.features === 'string') {
    updates.features = updates.features.split(',').map(item => item.trim());
  }

  try {
    const vehicle = await Vehicle.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!vehicle) {
      return res.status(404).send({ message: "Vehicle not found" });
    }
    res.send(vehicle);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

const getVehicleById = async (req, res) => {
  const { id } = req.params;
  try {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).send({ message: "Vehicle not found" });
    }
    res.send(vehicle);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

module.exports = { getVehicles, addVehicle, updateVehicle, getVehicleById };