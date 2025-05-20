const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  time: String, // hoặc Date nếu bạn dùng định dạng ISO
  value: Number
});

module.exports = mongoose.model('Data', dataSchema);
