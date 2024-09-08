const express = require('express');
const router = express.Router();
const {createBooking,verifyPayment,getUserBookings,getAllBookings} = require('../controllers/bookingController');
const { auth, admin } = require("../middlewares/authMiddleware");


router.post('/create',createBooking)

router.post('/verify',verifyPayment)

router.get('/user/:userId',auth,getUserBookings);
router.get('/all',auth,admin,getAllBookings);

module.exports = router;