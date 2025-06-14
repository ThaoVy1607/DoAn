const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://admin1:N4MxSuscV1NRVrRY@vy.aqrv2us.mongodb.net/?retryWrites=true&w=majority&appName=vy"
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Data schema for MSP circuit data
const dataSchema = new mongoose.Schema(
  {
    time: String,
    value: Number,
  },
  {
    timestamps: true,
  }
);

const Data = mongoose.model("Data", dataSchema);

// Receive data from MSP circuit
app.post("/data", async (req, res) => {
  const { value } = req.body;
  const time = new Date().toISOString();

  try {
    // Broadcast to all WebSocket clients
    io.emit("newData", { time, value });

    // Save to MongoDB
    const data = new Data({ time, value });
    await data.save();

    res.status(200).json({ message: "Data received and saved successfully" });
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({ message: "Error saving data", error: err.message });
  }
});

// Get latest data for web display
app.get("/data", async (req, res) => {
  try {
    const data = await Data.find().sort({ _id: -1 }).limit(20);
    res.json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res
      .status(500)
      .json({ message: "Error fetching data", error: err.message });
  }
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
