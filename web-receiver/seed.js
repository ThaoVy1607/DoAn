const mongoose = require("mongoose");

// MongoDB connection (same as server.js)
mongoose
  .connect(
    "mongodb+srv://admin1:N4MxSuscV1NRVrRY@vy.aqrv2us.mongodb.net/?retryWrites=true&w=majority&appName=vy"
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Data schema (same as server.js)
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

// Function to generate random sensor value (simulating MSP circuit data)
function generateRandomValue() {
  // Generate values between 0-1023 (typical ADC range for MSP430)
  return Math.floor(Math.random() * 1024);
}

// Function to generate realistic sensor data with some patterns
function generateRealisticValue(hour, minute) {
  // Base random value
  let baseValue = Math.floor(Math.random() * 1024);

  // Add daily pattern (higher values during day, lower at night)
  const dailyFactor = 0.3 * Math.sin((hour * Math.PI) / 12) + 0.7;

  // Add some noise
  const noise = (Math.random() - 0.5) * 100;

  // Calculate final value
  let finalValue = Math.floor(baseValue * dailyFactor + noise);

  // Ensure value is within valid range
  return Math.max(0, Math.min(1023, finalValue));
}

// Main seed function for 1 month data with 1-minute intervals
async function seedMonthlyData() {
  try {
    console.log("Starting monthly data seeding...");
    console.log("Generating data for 1 month with 1-minute intervals");

    // Clear all existing data
    console.log("Clearing existing data...");
    const deletedCount = await Data.deleteMany({});
    console.log(`Deleted ${deletedCount.deletedCount} existing records`);

    // Calculate time range (1 month = 30 days)
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Calculate total data points (30 days * 24 hours * 60 minutes)
    const totalMinutes = 30 * 24 * 60; // 43,200 data points
    console.log(`Will generate ${totalMinutes.toLocaleString()} data points`);

    const batchSize = 1000; // Insert in batches for better performance
    let totalInserted = 0;

    console.log("Generating data... This may take a few minutes");

    for (let batch = 0; batch < Math.ceil(totalMinutes / batchSize); batch++) {
      const dataToInsert = [];
      const startIndex = batch * batchSize;
      const endIndex = Math.min(startIndex + batchSize, totalMinutes);

      for (let i = startIndex; i < endIndex; i++) {
        // Calculate timestamp (starting from 1 month ago, adding minutes)
        const timestamp = new Date(oneMonthAgo.getTime() + i * 60 * 1000);

        const dataPoint = {
          time: timestamp.toISOString(),
          value: generateRealisticValue(
            timestamp.getHours(),
            timestamp.getMinutes()
          ),
        };

        dataToInsert.push(dataPoint);
      }

      // Insert batch
      await Data.insertMany(dataToInsert);
      totalInserted += dataToInsert.length;

      // Show progress
      const progress = (
        ((batch + 1) / Math.ceil(totalMinutes / batchSize)) *
        100
      ).toFixed(1);
      console.log(
        `Progress: ${progress}% (${totalInserted.toLocaleString()}/${totalMinutes.toLocaleString()} records)`
      );
    }

    console.log(
      `\nSuccessfully seeded ${totalInserted.toLocaleString()} data points`
    );

    // Show statistics
    const totalCount = await Data.countDocuments();
    const latestData = await Data.findOne().sort({ _id: -1 });
    const oldestData = await Data.findOne().sort({ _id: 1 });

    console.log(`\nDatabase Statistics:`);
    console.log(`Total records: ${totalCount.toLocaleString()}`);
    console.log(`Date range: ${oldestData.time} to ${latestData.time}`);
    console.log(`Latest value: ${latestData.value}`);
    console.log(`Oldest value: ${oldestData.value}`);

    // Show sample data
    console.log(`\nSample data (first 5 records):`);
    const sampleData = await Data.find().sort({ _id: 1 }).limit(5);
    sampleData.forEach((item, index) => {
      console.log(`${index + 1}. ${item.time} - Value: ${item.value}`);
    });
  } catch (error) {
    console.error("Error seeding monthly data:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
    process.exit(0);
  }
}

// Function to seed data for specific number of days
async function seedCustomDays(days = 7) {
  try {
    console.log(`Starting ${days}-day data seeding...`);
    console.log(`Generating data for ${days} days with 1-minute intervals`);

    // Clear all existing data
    console.log("Clearing existing data...");
    const deletedCount = await Data.deleteMany({});
    console.log(`Deleted ${deletedCount.deletedCount} existing records`);

    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const totalMinutes = days * 24 * 60;
    console.log(`Will generate ${totalMinutes.toLocaleString()} data points`);

    const batchSize = 1000;
    let totalInserted = 0;

    for (let batch = 0; batch < Math.ceil(totalMinutes / batchSize); batch++) {
      const dataToInsert = [];
      const startIndex = batch * batchSize;
      const endIndex = Math.min(startIndex + batchSize, totalMinutes);

      for (let i = startIndex; i < endIndex; i++) {
        const timestamp = new Date(startDate.getTime() + i * 60 * 1000);

        const dataPoint = {
          time: timestamp.toISOString(),
          value: generateRealisticValue(
            timestamp.getHours(),
            timestamp.getMinutes()
          ),
        };

        dataToInsert.push(dataPoint);
      }

      await Data.insertMany(dataToInsert);
      totalInserted += dataToInsert.length;

      const progress = (
        ((batch + 1) / Math.ceil(totalMinutes / batchSize)) *
        100
      ).toFixed(1);
      console.log(
        `Progress: ${progress}% (${totalInserted.toLocaleString()}/${totalMinutes.toLocaleString()} records)`
      );
    }

    console.log(
      `\nSuccessfully seeded ${totalInserted.toLocaleString()} data points for ${days} days`
    );
  } catch (error) {
    console.error(`Error seeding ${days}-day data:`, error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
    process.exit(0);
  }
}

// Function to add single data point (for testing)
async function addSingleDataPoint(value = null) {
  try {
    const dataPoint = new Data({
      time: new Date().toISOString(),
      value: value || generateRandomValue(),
    });

    await dataPoint.save();
    console.log(
      `Added single data point: ${dataPoint.value} at ${dataPoint.time}`
    );
  } catch (error) {
    console.error("Error adding data point:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

// Function to simulate real-time data (for testing WebSocket)
async function simulateRealTimeData(intervalSeconds = 60, duration = 300) {
  try {
    console.log(`Simulating real-time data for ${duration} seconds...`);
    console.log(`Data will be added every ${intervalSeconds} seconds`);

    const endTime = Date.now() + duration * 1000;

    const interval = setInterval(async () => {
      if (Date.now() >= endTime) {
        clearInterval(interval);
        console.log("Real-time simulation completed");
        await mongoose.connection.close();
        process.exit(0);
        return;
      }

      const now = new Date();
      const dataPoint = new Data({
        time: now.toISOString(),
        value: generateRealisticValue(now.getHours(), now.getMinutes()),
      });

      await dataPoint.save();
      console.log(`Added: ${dataPoint.value} at ${dataPoint.time}`);
    }, intervalSeconds * 1000);
  } catch (error) {
    console.error("Error in real-time simulation:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Command line interface
const command = process.argv[2];
const param = process.argv[3];

switch (command) {
  case "seed":
  case "month":
    seedMonthlyData();
    break;
  case "days":
    const days = param ? parseInt(param) : 7;
    seedCustomDays(days);
    break;
  case "add":
    addSingleDataPoint(param ? parseInt(param) : null);
    break;
  case "simulate":
    const interval = param ? parseInt(param) : 60;
    simulateRealTimeData(interval);
    break;
  default:
    console.log(`
📋 MSP Circuit Data Seeder

Usage:
  node seed.js seed               - Seed database with 1 month of data (1-minute intervals)
  node seed.js month              - Same as 'seed' command
  node seed.js days [number]      - Seed data for specific number of days (default: 7)
  node seed.js add [value]        - Add single data point (random value if not specified)
  node seed.js simulate [interval] - Simulate real-time data (default: 60 seconds interval)

Examples:
  node seed.js seed               # 1 month of data (43,200 records)
  node seed.js days 7             # 1 week of data (10,080 records)
  node seed.js days 1             # 1 day of data (1,440 records)
  node seed.js add 512
  node seed.js simulate 30        # Real-time simulation with 30-second intervals

Note: All commands will clear existing data before seeding new data.
    `);
    process.exit(0);
}
