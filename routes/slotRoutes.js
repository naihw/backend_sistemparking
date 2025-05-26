const express = require('express');
const router = express.Router();
const slotController = require('../controller/slotController');

// GET semua slot
router.get('/', slotController.getAllSlots);

// GET slot by ID
router.get('/:id', slotController.getSlotById);

// POST slot baru
router.post('/', slotController.createSlot);

// PUT update slot
router.put('/:id', slotController.updateSlot);

// DELETE slot
router.delete('/:id', slotController.deleteSlot);

//update slot terbaru
router.put('/update', slotController.updateAvailableSlots);

module.exports = router;