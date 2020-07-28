let Ant = require('ant-plus');
const dgram = require('dgram');

let stick = new Ant.GarminStick2;
let sensor = new Ant.HeartRateSensor(stick);
let s = dgram.createSocket('udp4');

sensor.on('hbData', function (data) {
    console.log(data.DeviceID, data.ComputedHeartRate);
    s.send(''+data.ComputedHeartRate, 1336, 'localhost');
});

stick.on('startup', function () {
    sensor.attach(0, 0);
});

if (!stick.open()) {
    console.log('Stick not found!');
}
