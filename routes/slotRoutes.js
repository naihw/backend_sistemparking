const express = require('express');
const router = express.Router();
const slotController = require('../controller/slotController');

// GET semua slot
router.get('/', slotController.getAllSlots);

// POST slot baru
router.post('/', slotController.createSlot);

// Endpoint khusus IoT
router.post('/iot/update-slot', slotController.iotUpdateSlot);

// PUT update slot
router.put('/:id', slotController.updateSlot);

// DELETE slot
router.delete('/:id', slotController.deleteSlot);

// GET slot by ID (taruh paling bawah agar tidak "menyabotase" route lainnya)
router.get('/:id', slotController.getSlotById);

module.exports = router;
