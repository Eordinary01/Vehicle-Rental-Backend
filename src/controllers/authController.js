const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (user) => {
  const verificationCode = crypto.randomBytes(3).toString("hex");
  user.verificationCode = verificationCode;
  await user.save();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Email Verification",
    text: `Your verification code is: ${verificationCode}`,
  };

  await transporter.sendMail(mailOptions);
};

const register = async (req, res) => {
  const { name, email, password, role = "user" } = req.body;
  try {
    let userRole = role;
    const existingAdmin = await User.findOne({ role: "admin" });
    if (!existingAdmin) {
      userRole = "admin";
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });
    await user.save();
    await sendVerificationEmail(user);
    res
      .status(201)
      .send({
        message:
          "User registered successfully. Please check your email for verification code.",
        userId: user._id,
      });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({ message: "Email already in use" });
    }
    console.error("Error registering user:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    if (!user.emailVerified) {
      await sendVerificationEmail(user);
      return res
        .status(400)
        .send({
          message:
            "Email not verified. Please check your email for verification code.",
        });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.send({ token, role: user.role, userId: user._id });
  } catch (err) {
    console.error("Error logging in user:", err);
    res.status(500).send({ message: "Internal server error" });
  }
};

const verifyEmail = async (req, res) => {
  const { userId, verificationCode } = req.body;
  console.log('Received verification data:', { userId, verificationCode }); // Debug log

  if (!userId || !verificationCode) {
    return res.status(400).send({ message: 'UserId and verificationCode are required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    if (user.verificationCode !== verificationCode) {
      return res.status(400).send({ message: 'Invalid verification code' });
    }

    user.emailVerified = true;
    user.verificationCode = null;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ token, role: user.role, userId: user._id });
  } catch (err) {
    console.error('Error verifying email:', err);
    res.status(500).send({ message: 'Internal server error' });
  }
};

module.exports = { register, login, verifyEmail };
