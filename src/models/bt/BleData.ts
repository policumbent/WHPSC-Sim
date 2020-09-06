import {BleHRMeter} from "./BleHRMeter";
import type {BleMeter} from "./BleMeter";

export function btSearch(){
    startSearch()
        .catch(error => {
            alert('This functionality is available only in Google Chrome 83+. ' +
                'If you are already using it on Linux the "chrome://flags/#enable-experimental-web-platform-features" flag must be enabled.' +
                'For further information read this page https://github.com/WebBluetoothCG/web-bluetooth/blob/gh-pages/implementation-status.md')
            console.log(error);
        })
}

let powerMeter;
let hrMeter: BleHRMeter;

async function startSearch() {
    let options = {
        // todo: filter only powermeters
        filters: [
            // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.service.heart_rate.xml
            {services: [0x180D]},
            // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.service.cycling_power.xml
            {services: [0x1818]}]
            // // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.service.cycling_speed_and_cadence.xml
            // {services: [0x1816]}]
    }

    console.log('Requesting Bluetooth Device...');

    // @ts-ignore
    let device = await navigator.bluetooth.requestDevice(options);
    let server = await device.gatt.connect();

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

    // if (service) {
    //     let characteristic = await service.getCharacteristic(0x2A63);
    //     let parser = new CyclingPowerMeasurementParser();
    //     let value = await readCharacteristicValue(characteristic);
    //     let data = parser.getData(value);
    //
    //     // is Crank Revolution Data Present ?
    //     if ('cumulative_crank_revolutions' in data) {
    //         meter = new BlePowerCadenceMeter(device, server, service, characteristic);
    //         powerMeters.push([meter.id, meter]);
    //         meter.listen();
    //         console.log(meter);
    //
    //     } else {
    //         meter = new BlePowerMeter(device, server, service, characteristic);
    //         powerMeters.push([meter.id, meter]);
    //     }
    // }

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

}
