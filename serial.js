require('dotenv').config();
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const slotModel = require('./models/slot');

// Inisialisasi serial port
const port = new SerialPort({
  path: process.env.SERIAL_PORT,         // Contoh: 'COM3' atau '/dev/ttyUSB0'
  baudRate: parseInt(process.env.SERIAL_BAUDRATE) || 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', async (data) => {
  const trimmedData = data.trim();
  console.log('Data dari Arduino:', trimmedData);

  if (trimmedData.startsWith('slots:')) {
    const availableSlots = parseInt(trimmedData.split(':')[1]);
    if (!isNaN(availableSlots)) {
      try {
        const success = await Slot.updateAvailableSlots(availableSlots);
        if (success) {
          console.log(`Database berhasil update slot tersedia: ${availableSlots}`);
        } else {
          console.log('Gagal update database slot');
        }
      } catch (error) {
        console.error('Error update database:', error);
      }
    }
  }
});

port.on('open', () => {
  console.log('Serial port terbuka:', process.env.SERIAL_PORT);
});

port.on('error', (err) => {
  console.error('Error serial port:', err.message);
});
