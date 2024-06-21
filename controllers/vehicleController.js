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
  const { name, type, image, pricePerDay, available } = req.body;
  try {
    const vehicle = new Vehicle({ name, type, image, pricePerDay, available });
    await vehicle.save();
    res.status(201).send(vehicle);
  } catch (err) {
    res.status(400).send(err);
  }
};

const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(id, updates, { new: true });
    if (!vehicle) {
      return res.status(404).send();
    }
    res.send(vehicle);
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = { getVehicles, addVehicle, updateVehicle };
