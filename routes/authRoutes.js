const express = require('express');
const router = express.Router();
const authController = require('../controller/authController'); // Import controller untuk autentikasi

// Route untuk registrasi pengguna baru
router.post('/register', authController.register);

// Route untuk login pengguna
router.post('/login', authController.login);

// Route untuk logout pengguna 
router.post('/logout', authController.logout);

module.exports = router; // Export router untuk digunakan di file server.js atau app.js
