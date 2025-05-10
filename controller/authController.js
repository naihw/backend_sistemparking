const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Registrasi pengguna baru
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validasi input
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    // Cek apakah email sudah digunakan
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    // Daftarkan pengguna baru
    const userId = await User.registerUser(name, email, password);

    res.status(201).json({ message: 'User registered successfully!', userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user.' });
  }
};

// Login pengguna
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Cek apakah email ada dalam database
    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Cek apakah password cocok
    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Buat JWT token
    const token = User.generateJWT(user.id);

    res.status(200).json({
      message: 'Login successful!',
      token: token, // Kirimkan token kepada pengguna
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in user.' });
  }
};

// Logout pengguna (opsional)
exports.logout = (req, res) => {
  // Logout tidak perlu melakukan apa-apa di backend karena JWT bersifat stateless.
  // Biasanya, di sisi client, token akan dihapus dari storage (localStorage/sessionStorage).
  res.status(200).json({ message: 'User logged out successfully.' });
};
