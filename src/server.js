const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
connectDB();

app.use(express.json());

// Apply CORS middleware
app.use(cors({
  origin: 'https://vehicle-rental-frontend-1hw5.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  optionsSuccessStatus: 204
}));

app.get('/', (req, res) => {
  res.json({ message: 'Server Started!!Dev ' });
});

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
