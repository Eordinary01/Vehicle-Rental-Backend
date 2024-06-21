// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET user by ID
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// PUT update user by ID
router.put('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, { name, email }, { new: true });
    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.send(updatedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
