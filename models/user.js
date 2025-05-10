const db = require('./db'); // Koneksi database
const bcrypt = require('bcryptjs'); // Untuk mengenkripsi password
const jwt = require('jsonwebtoken'); // Untuk membuat JWT token

// Registrasi pengguna baru
exports.registerUser = async (name, email, password) => {
  // Enkripsi password
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  const values = [name, email, hashedPassword];

  try {
    const [result] = await db.execute(query, values);
    return result.insertId; // Mengembalikan ID pengguna yang baru dibuat
  } catch (err) {
    throw new Error('Error registering user');
  }
};

// Cek email pengguna yang sudah terdaftar
exports.findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  try {
    const [rows] = await db.execute(query, [email]);
    return rows[0]; // Mengembalikan user yang pertama ditemukan
  } catch (err) {
    throw new Error('Error finding user by email');
  }
};

// Cek apakah password yang dimasukkan sesuai dengan yang ada di database
exports.comparePassword = async (inputPassword, storedPassword) => {
  return await bcrypt.compare(inputPassword, storedPassword);
};

// Membuat JWT token
exports.generateJWT = (userId) => {
  const payload = { userId };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};
