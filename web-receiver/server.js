const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app); // Tạo HTTP server
const io = new Server(server, {
  cors: {
    origin: '*', // cho phép mọi frontend truy cập
  }
});

app.use(cors());
app.use(bodyParser.json());
// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/testdb')
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.error('❌ Kết nối MongoDB lỗi:', err));


// ✅ Tạo Schema để lưu dữ liệu
const pulseSchema = new mongoose.Schema({
  time: String,
  value: Number
});
const Data = mongoose.model('Pulse', pulseSchema);


// ✅ Khi nhận dữ liệu từ MSP430
app.post('/data', async (req, res) => {
  const value = req.body.value;
  const time = new Date().toISOString(); // thời gian thực theo ISO


  // 1. Phát tới tất cả WebSocket client
  io.emit('newData', { time, value });

  // 2. Lưu vào MongoDB
  try {
    const data = new Data({ time, value });
    await data.save();
    res.status(200).json({ message: 'Đã nhận và lưu' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lưu MongoDB', error: err });
  }
});
// Route trả về dữ liệu mới nhất cho client web-display
app.get('/data', async (req, res) => {
  const data = await Data.find().sort({ _id: -1 }).limit(20);
  res.json(data); // Trả về dạng mảng JSON
});


// Khởi động server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const Pulse = require('./db');

// // Kết nối MongoDB
// mongoose.connect('mongodb://localhost:27017/testdb', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('✅ Kết nối MongoDB thành công'))
//   .catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err));

// // Khởi tạo Express app
// const app = express();
// app.use(cors());

// // API GET - Lấy dữ liệu xung mới nhất
// app.get('/data', async (req, res) => {
//   try {
//     const latest = await Pulse.findOne().sort({ _id: -1 });
//     res.json(latest);
//   } catch (err) {
//     res.status(500).json({ message: 'Lỗi server' });
//   }
// });


// const pulse = new Pulse({ time: 'Nguyen Van A', value: 10 });
// pulse.save();

// // Khởi động server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
// });
