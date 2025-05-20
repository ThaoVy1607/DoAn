const express = require('express');
const mqtt = require('mqtt');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/sensorData', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create data schema
const DataSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    data: mongoose.Schema.Types.Mixed
});

const Data = mongoose.model('Data', DataSchema);

// MQTT Client setup
const client = mqtt.connect('mqtt://localhost:1883');
const topic = 'sensor/data';

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(topic);
});

client.on('message', async (topic, message) => {
    try {
        const jsonData = JSON.parse(message.toString());
        const newData = new Data({ data: jsonData });
        await newData.save();
        console.log('Data saved to MongoDB');
    } catch (error) {
        console.error('Error saving data:', error);
    }
});

app.listen(port, () => {
    console.log(`Receiver web app listening at http://localhost:${port}`);
});