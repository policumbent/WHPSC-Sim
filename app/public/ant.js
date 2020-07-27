let Ant = require('ant-plus');
let stick = new Ant.GarminStick2;
let sensor = new Ant.HeartRateSensor(stick);

sensor.on('hbData', function (data) {
    console.log(data.DeviceID, data.ComputedHeartRate);
});

stick.on('startup', function () {
    sensor.attach(0, 0);
});

if (!stick.open()) {
    console.log('Stick not found!');
}
