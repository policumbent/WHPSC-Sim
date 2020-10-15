let Ant = require('ant-plus-ste');
import {addSensorsToList, clearSensorsList, powerValue} from "./store"
// const dgram = require('dgram');
let stick = new Ant.GarminStick2;
let stickStarted = false;
let searchStarted = false;
let sensorAttached = false;
let startSearchV = false;
// let powerSensor = new Ant.BicyclePowerSensor(stick);
// let powerScanner = new Ant.BicyclePowerScanner(stick);

let powerSensor = new Ant.BicyclePowerSensor(stick)
let powerScanner = new Ant.BicyclePowerScanner(stick);

// device id => store it
let powerSensorId = 0;
let count = 0;
powerSensor.on('attached', () => {
    console.log(powerSensorId, 'power sensor attached');
    sensorAttached = true;
});
powerSensor.on('detached', () => {
    console.log(powerSensorId, 'power sensor detached');
    sensorAttached = false;
    if (startSearchV) {
        startSearchV = false;
        powerScanner.scan();
    }
});
powerScanner.on('attached', () => {
    console.log(powerSensorId, 'power scanner attached');
    searchStarted = true;
});
powerScanner.on('detached', () => {
    console.log(powerSensorId, 'power scanner detached');
    searchStarted = false;
    if(powerSensorId !== 0)
        powerSensor.attach(0, powerSensorId);
});
// powerSensor.on('hbdata', function(data) {
//     console.log(powerSensorId, 'hr sensor : ', data.DeviceID, data.ComputedHeartRate, data);
//     if (data.DeviceID !== 0 && powerSensorId === 0) {
//         powerSensorId = data.DeviceID;
//         console.log(powerSensorId, 'detaching...');
//         powerSensor.detach();
//         powerSensor.once('detached', function() {
//             powerSensor.attach(0, powerSensorId);
//         });
//     }
// });

powerSensor.on('powerData',
    (data) => {
        // console.log(data);
        const power = data.Power === undefined ? data.CalculatedPower : data.Power;
        // console.log("Calculated Power", data.CalculatedPower);
        // console.log("Power", data.Power);
        // console.log("Power istant", data.InstantaneousPower);

        powerValue.set(Math.round(power));
    });
if (!stick.open())
    console.log('Stick not found!');
else
    console.log('Stick connected!');
// let interval = setInterval(test, 3000);

// powerSensor.on('hbData',
//     (data) => {
//         console.log(data.DeviceID, data.ComputedHeartRate);
//         powerValue.set(data.ComputedHeartRate);
//     });

powerScanner.on('powerData', data => {
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
        powerSensor.detach();
        startSearchV = true;
        return;
    }
    console.log('start_search');
    powerScanner.scan();
}

export function stopSearch() {
    console.log('stop search');
    console.log(stickStarted);
    if(!stickStarted)
        return;
    if(searchStarted)
        powerScanner.detach();
}

export function attachSensor(id = 0) {
    if(!stickStarted)
        return;
    if(searchStarted)
        powerScanner.detach();
    powerSensorId = id;
    // if (sensorAttached)
    //     powerSensor.detach();
}

export function sensorConnected() {
    console.log('sensorConnected: ', sensorAttached);
    return sensorAttached;
}
