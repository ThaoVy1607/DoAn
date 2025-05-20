const mongoose = require('mongoose');

const pulseSchema = new mongoose.Schema({
  time: String,
  value: Number
});

const Pulse = mongoose.model('Pulse', pulseSchema);

module.exports = Pulse;
