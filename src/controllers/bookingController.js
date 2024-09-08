const Razorpay = require("razorpay");
const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");

const razorpayInstance = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

const createBooking = async (req, res) => {
  try {
    const {
      userId,
      vehicleId,
      phone,
      startDate,
      endDate,
      startTime,
      endTime,
      pricePerDay,
    } = req.body;

    // Calculate total price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    let totalPrice = dayDiff * pricePerDay;

    // If start and end time are provided, calculate hourly price
    if (startTime && endTime) {
      const startHour = parseInt(startTime.split(":")[0]);
      const endHour = parseInt(endTime.split(":")[0]);
      const hourDiff = endHour - startHour;
      totalPrice = hourDiff * (pricePerDay / 24);
    }

    // Create a new booking record
    const newBooking = new Booking({
      userId,
      vehicleId,
      phone,
      startDate,
      endDate,
      startTime,
      endTime,
      totalPrice,
    });

    const booking = await newBooking.save();

    // Create Razorpay order
    const options = {
      amount: totalPrice * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: booking._id.toString(),
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({ booking, order });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const verifyPayment = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;

  const crypto = require("crypto");
  const hmac = crypto.createHmac("sha256", process.env.key_secret);
  hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
  const generatedSignature = hmac.digest("hex");

  console.log(`Generated Signature: ${generatedSignature}`);
  console.log(`Received Signature: ${razorpaySignature}`);

  if (generatedSignature === razorpaySignature) {
    await Booking.findByIdAndUpdate(bookingId, {
      paymentId: razorpayPaymentId,
      status: "confirmed",
    });
    res.status(200).json({ message: "Payment verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid signature" });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await Booking.find({ userId })
      .populate('vehicleId', 'name image') // Populate vehicle details
      .sort({ startDate: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user bookings", error: error.message });
  }
};

// New function to get all bookings (for admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('userId', 'name email') // Populate user details
      .populate('vehicleId', 'name image') // Populate vehicle details
      .sort({ startDate: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all bookings", error: error.message });
  }
};

module.exports = { createBooking, verifyPayment, getUserBookings, getAllBookings };
