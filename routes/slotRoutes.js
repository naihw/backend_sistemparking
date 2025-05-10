const express = require('express');
const router = express.Router();
const slotController = require('../controller/slotController');

// Get all slots
router.get('/', slotController.getAllSlots);

// Add new slot
router.post('/add', slotController.addSlot);

// Update slot status 
router.put('/update-status', slotController.updateSlotStatus);

module.exports = router;
