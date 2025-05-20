// seed.js
const Pulse = require('./db');

async function generateFakeData() {
  for (let i = 0; i < 50; i++) {
    const fake = new Pulse({
      time: new Date().toLocaleTimeString(),
      value: Math.floor(Math.random() * 100)
    });
    await fake.save();
  }

  console.log('Đã thêm dữ liệu giả vào MongoDB!');
  process.exit();
}

module.exports = generateFakeData;