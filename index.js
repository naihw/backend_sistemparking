require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const slotRoutes = require('./routes/slotRoutes'); 
const adminRoutes = require('./routes/adminRoutes');
//require('./serial');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Smart Parking Backend is Running');
});


app.use('/api/slot', slotRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/iot/update-slot', slotRoutes);  
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
