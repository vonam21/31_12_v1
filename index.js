const express = require("express");
const mqtt = require('mqtt');
const path = require('path');  // Thêm dòng này để import module path
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/'));

const server = app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

const io = require('socket.io')(server);

const client = mqtt.connect('mqtt://test.mosquitto.org');

let values = [1, 2, 3, 4];

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('vonam', (err) => {
        if (!err) {
            console.log('Subscribed to vonam');
        }
    });
});

client.on('message', (topic, message) => {
    const messageString = message.toString();
    values = messageString.split(' ');
    console.log(values);
    console.log(`Received message on topic ${topic}: ${messageString}`);

    // Gửi dữ liệu mới tới client qua Socket.IO
    io.emit('mqttMessage', {
        nhietdo: values[0],
        doam: values[1],
        adc: values[2],
        adc_doam: values[3]
    });
});

client.on('close', () => {
    console.log('Disconnected from MQTT broker');
});

client.on('error', (err) => {
    console.error('Error:', err);
});

app.use(express.static('public'));

app.get("/", (req, res) => {
    console.log('This is Nam');
    const nhietdo = values[0];
    const doam = values[1];
    const adc = values[2];
    const adc_doam = values[3];
    res.render("index4.ejs", { nhietdo, doam, adc, adc_doam });
});
