app.post('/data', async (req, res) => {
  const { value } = req.body;
  const data = new DataModel({
    value: value,
    createdAt: new Date() // Gắn thời gian hiện tại
  });
  await data.save();
  res.status(201).send({ message: 'Đã lưu thành công!' });
});
const dataSchema = new mongoose.Schema({
  value: Number
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

const DataModel = mongoose.model('Data', dataSchema);
