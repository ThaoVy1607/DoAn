const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create data schema (same as receiver)
const DataSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    data: mongoose.Schema.Types.Mixed
});

const Data = mongoose.model('Data', DataSchema);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/data', async (req, res) => {
    try {
        const data = await Data.find().sort('-timestamp').limit(100);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});
const PORT = process.env.PORT || 3001;
app.listen(3001, '0.0.0.0', () => {
  console.log('Server đang chạy tại http://0.0.0.0:3001');
});