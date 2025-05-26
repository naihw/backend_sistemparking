const db = require('./db'); // koneksi database
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registeradmin = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)';
  const values = [name, email, hashedPassword];

  try {
    const [result] = await db.execute(query, values);
    return result.insertId;
  } catch (err) {
    throw new Error('Error registering admin');
  }
};

exports.findUserByEmail = async (email) => {
  const query = 'SELECT * FROM admins WHERE email = ?';
  try {
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  } catch (err) {
    throw new Error('Error finding admin by email');
  }
};

exports.comparePassword = async (inputPassword, storedPassword) => {
  return await bcrypt.compare(inputPassword, storedPassword);
};

exports.generateJWT = (userId) => {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const payload = { userId };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });
  };
  

exports.findUserById = async (id) => {
    const query = 'SELECT * FROM admins WHERE id = ?';
    try {
      const [rows] = await db.execute(query, [id]);
      return rows[0];
    } catch (err) {
      throw new Error('Error finding user by ID');
    }
  };
  