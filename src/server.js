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

// Define CORS options
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://vercel.com/extraordinarys-projects/vehicle-rental-backend/kde1Eu427uoCckRD4cm9q6xFxZhj',
    'https://vehicle-rental-frontend-1hw5.vercel.app',
    'https://vehicle-rental-frontend-1hw5-ef843jaeu-extraordinarys-projects.vercel.app',
    'https://vehicle-rental-backend-git-master-extraordinarys-projects.vercel.app'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Enable pre-flight requests for all routes
app.options('*', cors(corsOptions));

app.get('/', (req, res) => {
  res.json({ message: 'Server Started!!Dev ' });
});

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
