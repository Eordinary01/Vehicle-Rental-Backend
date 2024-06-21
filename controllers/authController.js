// controllers/authController.js



const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password, role = "user" } = req.body;
  try {
    let userRole = role;
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      userRole = 'admin';
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ name, email, password: hashedPassword, role: userRole });
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).send(err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ token, role: user.role, userId: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = { register, login };


module.exports = { register, login };
