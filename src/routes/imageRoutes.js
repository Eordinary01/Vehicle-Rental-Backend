const express = require('express');
const router = express.Router();
const axios = require('axios');

// Controller function for fetching images
const getImage = async (req, res) => {
  const { imageUrl } = req.params;
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    res.set('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching image');
  }
};

// Route for fetching images
router.get('/:imageUrl', getImage);

module.exports = router;