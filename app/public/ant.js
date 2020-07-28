let Ant = require('ant-plus');
const dgram = require('dgram');

let stick = new Ant.GarminStick2;
let sensor = new Ant.BicyclePowerSensor(stick);
// let sensor2 = new Ant.HeartRateSensor(stick);
let s = dgram.createSocket('udp4');

sensor.on('powerData', function (data) {
    console.log("Calculated Power", data.CalculatedPower);
    console.log("Power", data.Power);
    console.log("Powe  r istant", data.InstantaneousPower);
    s.send(''+data.Power, 1336, 'localhost');
});

// sensor2.on('hbData', function (data) {
//     console.log(data.DeviceID, data.ComputedHeartRate);
//     s.send(''+data.ComputedHeartRate, 1336, 'localhost');
// });


stick.on('startup', function () {
    sensor.attach(0, 0);
    // sensor2.attach(0, 0);
});

if (!stick.open()) {
    console.log('Stick not found!');
}
