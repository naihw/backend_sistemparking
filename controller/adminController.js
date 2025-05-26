const admin = require('../models/admin');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    const existingAdmin = await admin.findUserByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    const adminId = await admin.registeradmin(name, email, password);

    res.status(201).json({ message: 'Admin registered successfully!', adminId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering admin.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const adminUser = await admin.findUserByEmail(email);
    if (!adminUser) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await admin.comparePassword(password, adminUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = admin.generateJWT(adminUser.id);

    res.status(200).json({
      message: 'Login successful!',
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in admin.' });
  }
};

exports.logout = (req, res) => {
  // JWT stateless logout: token dihapus di client
  res.status(200).json({ message: 'User logged out successfully.' });
};

// Mendapatkan profil admin dari token
exports.getProfile = async (req, res) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const adminUser = await admin.findUserById(decoded.userId); // Pastikan fungsi ini ada di models
  
      if (!adminUser) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      res.status(200).json({ name: adminUser.name, email: adminUser.email });
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
  