const Slot = require('../models/slot');

exports.getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.getAllSlots(); // method dari models/slot.js
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data slot parkir' });
  }
};

exports.getSlotById = async (req, res) => {
  const { id } = req.params;
  try {
    const slot = await Slot.getSlotById(id);
    if (slot) {
      res.json(slot);
    } else {
      res.status(404).json({ message: 'Slot tidak ditemukan' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil slot parkir' });
  }
};

exports.createSlot = async (req, res) => {
  const { slot_number } = req.body;
  try {
    const newSlotId = await Slot.addSlot(slot_number);
    res.json({ message: 'Slot parkir berhasil ditambahkan', id: newSlotId });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambah slot parkir' });
  }
};

exports.updateSlot = async (req, res) => {
  const { id } = req.params;
  const { is_occupied } = req.body;

  try {
    const updated = await Slot.updateSlotStatus(id, is_occupied);
    if (updated) {
      res.json({ message: 'Slot berhasil diperbarui' });
    } else {
      res.status(404).json({ message: 'Slot tidak ditemukan' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui slot parkir' });
  }
};



exports.deleteSlot = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Slot.deleteSlot(id);
    if (deleted) {
      res.json({ message: 'Slot berhasil dihapus' });
    } else {
      res.status(404).json({ message: 'Slot tidak ditemukan' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus slot parkir' });
  }
};

exports.iotUpdateSlot = async (req, res) => {
  const { slot_number, is_occupied } = req.body;
  try {
    const updated = await Slot.iotUpdateSlot(slot_number, is_occupied);
    if (updated) {
      res.json({ message: 'Status slot diperbarui oleh IoT' });
    } else {
      res.status(404).json({ message: 'Slot tidak ditemukan' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui slot (IoT)' });
  }
};


