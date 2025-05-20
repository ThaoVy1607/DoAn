const express = require('express');
const mongoose = require('mongoose');
const Data = require('./model'); // Schema

const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://admin1:QvgtONbP5qSE3Xi8@cluster0.9ygymrh.mongodb.net/iot', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Gửi file HTML
app.use(express.static('public'));

// API cung cấp dữ liệu mới nhất
app.get('/data', async (req, res) => {
  try {
    const latest = await Data.findOne().sort({ time: -1 });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
