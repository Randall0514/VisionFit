const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/admin');
const { generateCode, sendVerificationEmail } = require('../utils/email');

const router = express.Router();

router.post('/send-code', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    await VerificationCode.deleteMany({ email: email.toLowerCase() });

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = new VerificationCode({
      email: email.toLowerCase(),
      code,
      firstName,
      lastName,
      password: hashedPassword,
      expiresAt
    });
    await verificationCode.save();

    await sendVerificationEmail(email, code);

    res.json({ message: 'Verification code sent to your email' });
  } catch (error) {
    console.error('Send code error:', error);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    const verification = await VerificationCode.findOne({
      email: email.toLowerCase(),
      code
    });

    if (!verification) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (verification.expiresAt < new Date()) {
      await VerificationCode.deleteOne({ _id: verification._id });
      return res.status(400).json({ error: 'Code has expired. Please request a new one.' });
    }

    const user = new User({
      firstName: verification.firstName,
      lastName: verification.lastName,
      email: verification.email,
      password: verification.password
    });
    await user.save();

    await VerificationCode.deleteOne({ _id: verification._id });

    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/resend-code', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const existing = await VerificationCode.findOne({ email: email.toLowerCase() });
    if (!existing) {
      return res.status(400).json({ error: 'No pending verification. Please sign up again.' });
    }

    const code = generateCode();
    existing.code = code;
    existing.expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await existing.save();

    await sendVerificationEmail(email, code);

    res.json({ message: 'New verification code sent' });
  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({ error: 'Failed to resend code' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role,
      faceShape: req.user.faceShape,
      prescription: req.user.prescription
    }
  });
});

router.put('/me', auth, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['firstName', 'lastName', 'faceShape', 'prescription', 'avatar'];

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        req.user[key] = updates[key];
      }
    });

    await req.user.save();
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both passwords are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/create-admin', adminAuth, async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email: email.toLowerCase(), password: hashedPassword, role: 'admin' });
    await user.save();

    res.status(201).json({
      message: 'Admin account created',
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
