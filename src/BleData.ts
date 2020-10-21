import {BleHRMeter} from "./models/bt/BleHRMeter";
import type {BleMeter} from "./models/bt/BleMeter";
import {BlePowerMeter} from "./models/bt/BlePowerMeter";
// import {BlePowerCadenceMeter} from "./models/bt/BlePowerCadenceMeter";
import {CyclingPowerMeasurementParser} from "./models/bt/CyclingPowerMeasurementParser";
import {setBtSensorName} from "./store";
// const Bluetooth	= require('node-web-bluetooth');
// declare function require(name:string);
// const Bluetooth = require('node-web-bluetooth');

let powerMeter;
let hrMeter: BleHRMeter;

export async function startSearch() {
    let options = {
        filters: [
            // // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.service.heart_rate.xml
            // {services: [0x180D]},
            // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.service.cycling_power.xml
            {services: [0x1818]}]
        // // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.service.cycling_speed_and_cadence.xml
        // {services: [0x1816]}]
    };

    console.log('Requesting Bluetooth Device...');

    // @ts-ignore
    let device = await navigator.bluetooth
        .requestDevice(options)
        // .then(device => {
        console.log('> Name:             ' + device.name);
        console.log('> Id:               ' + device.id);
        console.log('> Connected:        ' + device.gatt.connected);
        // })
        // .catch(error => {
        //     console.log('Argh! ' + error);
        // });
    let server = await device.gatt.connect();
    setBtSensorName(device.name);
    console.log(device);
    console.log(server);

    let meter: BleMeter = undefined;
    // org.bluetooth.service.cycling_power
    let service = undefined;
    try {
        // ottengo dal server il service di tipo powermeter
        service = await server.getPrimaryService(0x1818);
    } catch (error) {
        console.log(error);
    }

    if (service) {
        let characteristic = await service.getCharacteristic(0x2A63);
    //     let parser = new CyclingPowerMeasurementParser();
    //     // @ts-ignore
    //     let value = await readCharacteristicValue(characteristic);
    //     let data = parser.getData(value);
    //     // is Crank Revolution Data Present ?
    //     if ('cumulative_crank_revolutions' in data) {
    //         meter = new BlePowerCadenceMeter(device, server, service, characteristic);
    //         powerMeter = meter;
    //         meter.listen();
    //         console.log(meter);
    //
    //     } else {
            meter = new BlePowerMeter(device, server, service, characteristic);
            console.log(meter);
            powerMeter = meter;
            meter.listen();
    //
    //     }
    }

    // org.bluetooth.service.heart_rate
    service = undefined;
    try {
        service = await server.getPrimaryService(0x180D);
    } catch(error) {
        console.log(error);
    }

    if(service) {
        let characteristic = await service.getCharacteristic(0x2A37);
        meter = new BleHRMeter(device, server, service, characteristic);
        hrMeter = meter;
        console.log(meter);
        meter.listen();
    }
    return powerMeter !== undefined || hrMeter !== undefined;
}
