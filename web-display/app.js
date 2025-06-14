const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// MongoDB connection
mongoose.connect(
  "mongodb+srv://admin1:N4MxSuscV1NRVrRY@vy.aqrv2us.mongodb.net/?retryWrites=true&w=majority&appName=vy",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Create data schema (flexible to match existing data)
const DataSchema = new mongoose.Schema({}, { strict: false });

const Data = mongoose.model("Data", DataSchema);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/data", async (req, res) => {
  try {
    const data = await Data.aggregate([
      {
        $addFields: {
          dateObj: {
            $dateFromString: {
              dateString: "$time",
            },
          },
        },
      },
      {
        $addFields: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$dateObj",
            },
          },
        },
      },
      {
        $group: {
          _id: "$date",
          totalValue: { $sum: "$value" },
          date: { $first: "$date" },
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $limit: 30,
      },
    ]);
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

// API for chart data - optimized
app.get("/api/chart-data", async (req, res) => {
  try {
    const data = await Data.find({}, "time value -_id")
      .sort({ time: -1 })
      .limit(30);
    res.json(data.reverse());
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
});

// API for latest data point
app.get("/api/latest", async (req, res) => {
  try {
    const latest = await Data.findOne({}, "time value -_id").sort({ time: -1 });
    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(8080, "0.0.0.0", () => {
  console.log("Server đang chạy tại http://0.0.0.0:8080");
});
