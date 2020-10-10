let Ant = require('ant-plus');
import {addSensorsToList, clearSensorsList, powerValue} from "./store"
// const dgram = require('dgram');
let stick = new Ant.GarminStick2;
let stickStarted = false;
let searchStarted = false;
let sensorAttached = false;
let startSearchV = false;
let powerSensor = new Ant.BicyclePowerSensor(stick);
let powerScanner = new Ant.BicyclePowerScanner(stick);

let hrSensor = new Ant.HeartRateSensor(stick)
let hrScanner = new Ant.HeartRateScanner(stick);

// device id => store it
let sensorId = 0;
let count = 0;
hrSensor.on('attached', () => {
    console.log(sensorId, 'hr sensor attached');
    sensorAttached = true;
});
hrSensor.on('detached', () => {
    console.log(sensorId, 'hr sensor detached');
    sensorAttached = false;
    if (startSearchV) {
        startSearchV = false;
        hrScanner.scan();
    }

});
hrScanner.on('attached', () => {
    console.log(sensorId, 'hr scanner attached');
    searchStarted = true;
});
hrScanner.on('detached', () => {
    console.log(sensorId, 'hr scanner detached');
    searchStarted = false;
    if(sensorId !== 0)
        hrSensor.attach(0, sensorId);
});
// hrSensor.on('hbdata', function(data) {
//     console.log(hrSensorId, 'hr sensor : ', data.DeviceID, data.ComputedHeartRate, data);
//     if (data.DeviceID !== 0 && hrSensorId === 0) {
//         hrSensorId = data.DeviceID;
//         console.log(hrSensorId, 'detaching...');
//         hrSensor.detach();
//         hrSensor.once('detached', function() {
//             hrSensor.attach(0, hrSensorId);
//         });
//     }
// });

// sensor.on('powerData', function (data) {
//     // console.log("Calculated Power", data.CalculatedPower);
//     // console.log("Power", data.Power);
//     // console.log("Powe  r istant", data.InstantaneousPower);
//     s.send(''+data.Power, 1336, 'localhost');
// });
if (!stick.open())
    console.log('Stick not found!')
else
    console.log('Stick connected!')
// let interval = setInterval(test, 3000);

hrSensor.on('hbData',
    (data) => {
        console.log(data.DeviceID, data.ComputedHeartRate);
        powerValue.set(data.ComputedHeartRate);
    });

hrScanner.on('hbData', data => {
    addSensorsToList(data.DeviceID);
    // console.log(`id: ${data.DeviceID}`);
    // console.dir(data);
});

stick.on('startup', function () {
    // sensor.attach(0, 0);
    // sensor.scan();
    stickStarted = true;
    // sensorHR.attach(0, 0);
});

export async function startSearch() {
    clearSensorsList();
    console.log('sensor connected: ', sensorAttached);
    if(!stickStarted && !searchStarted)
        return;
    if(sensorAttached) {
        hrSensor.detach();
        startSearchV = true;
        return;
    }
    console.log('start_search');
    hrScanner.scan();
}

export function stopSearch() {
    console.log('stop search')
    console.log(stickStarted)
    if(!stickStarted)
        return;
    if(searchStarted)
        hrScanner.detach();
}

export function attachSensor(id = 0) {
    if(!stickStarted)
        return;
    if(searchStarted)
        hrScanner.detach();
    sensorId = id;
    // if (sensorAttached)
    //     hrSensor.detach();
}

export function sensorConnected() {
    console.log('sensorConnected: ', sensorAttached);
    return sensorAttached;
}
