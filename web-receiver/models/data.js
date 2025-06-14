const mongoose = require("mongoose");

// Data schema for MSP circuit sensor data
const dataSchema = new mongoose.Schema(
  {
    time: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Data", dataSchema);
