const Slot = require('../models/slot');

// Endpoint untuk mendapatkan semua slot parkir
exports.getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.getAllSlots();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data slot parkir' });
  }
};

// Endpoint untuk menambah slot parkir
exports.addSlot = async (req, res) => {
  const { slot_number } = req.body;
  
  try {
    const newSlotId = await Slot.addSlot(slot_number);
    res.json({ message: 'Slot parkir berhasil ditambahkan', id: newSlotId });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambah slot parkir' });
  }
};

// Endpoint untuk mengubah status slot parkir
exports.updateSlotStatus = async (req, res) => {
  const { slot_id, status } = req.body;

  try {
    const updated = await Slot.updateSlotStatus(slot_id, status);
    if (updated) {
      res.json({ message: 'Status slot berhasil diperbarui' });
    } else {
      res.status(404).json({ message: 'Slot tidak ditemukan' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengubah status slot parkir' });
  }
};
