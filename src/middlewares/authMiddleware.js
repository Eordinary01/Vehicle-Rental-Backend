const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Auth Header:', authHeader); // Add this line to log the Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ error: 'Authorization token required' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Invalid token' });
  }
};

const admin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({ error: 'User not authenticated' });
    }

    console.log('Decoded token:', req.user);
    
    if (req.user.role !== 'admin') {
      console.log('User role:', req.user.role);
      return res.status(403).send({ error: 'Unauthorized' });
    }
    
    next();
  } catch (err) {
    res.status(500).send({ error: 'Internal server error' });
  }
};

module.exports = { auth, admin };
