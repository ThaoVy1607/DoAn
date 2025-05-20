const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  time: String,   // Hoặc: Date nếu bạn muốn dùng kiểu chuẩn
  value: Number
});

module.exports = mongoose.model('Data', dataSchema);
