const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController'); 
const authenticateToken = require('../middleware/authenticateToken');// Import controller untuk autentikasi
const adminModel = require('../models/admin');

// Route untuk registrasi pengguna baru
router.post('/register', adminController.register);

// Route untuk login pengguna
router.post('/login', adminController.login);

// Route untuk logout pengguna 
router.post('/logout', adminController.logout);

// route untuk profilejwt
router.get('/profile', authenticateToken, async (req, res) => {
    try {
      const admin = await adminModel.findUserById(req.user.userId);
      if (!admin) return res.status(404).json({ message: 'Admin not found' });
  
      res.json({
        id: admin.id,
        name: admin.name,
        email: admin.email
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router; 
