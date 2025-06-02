const db = require('./db');

// Ambil semua slot parkir
exports.getAllSlots = async () => {
  const [rows] = await db.query('SELECT * FROM slots');
  return rows;
};

// Menambah slot parkir baru
exports.addSlot = async (slot_number) => {
  const [result] = await db.query('INSERT INTO slots (slot_number) VALUES (?)', [slot_number]);
  return result.insertId;
};

// Update status slot (terisi/kosong)
exports.updateSlotStatus = async (slot_id, status) => {
  const [result] = await db.query('UPDATE slots SET is_occupied = ? WHERE id = ?', [status, slot_id]);
  return result.affectedRows > 0;
};

// Misal di models/slot.js
exports.iotUpdateSlot = async (slot_number, is_occupied) => {
  const [result] = await db.query(
    'UPDATE slots SET is_occupied = ? WHERE slot_number = ?',
    [is_occupied, slot_number]
  );
  return result.affectedRows > 0;
};



exports.deleteSlot = async (id) => {
  const [result] = await db.query('DELETE FROM slots WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
