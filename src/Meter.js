// let powerMeters = [];
// let heartMeters = [];
//
// export function btSearch(){
//     startSearch()
//         .catch(error => console.log(error))
// }
//
// async function startSearch() {
//     let options = {
//         // todo: filter only powermeters
//         filters: [
//             // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.service.heart_rate.xml
//             {services: [0x180D]},
//             // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.service.cycling_power.xml
//             {services: [0x1818]},
//             // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.service.cycling_speed_and_cadence.xml
//             {services: [0x1816]}]
//     }
//
//     console.log('Requesting Bluetooth Device...');
//
//     let device = await navigator.bluetooth.requestDevice(options);
//     let server = await device.gatt.connect();
//
//     console.log(device);
//
//     let meter = undefined;
//     // org.bluetooth.service.cycling_power
//     if (!powerMeters.find(m => m[0] === device.id)) {
//         let service = undefined;
//         try {
//             service = await server.getPrimaryService(0x1818);
//         } catch (error) {
//         }
//
//         if (service) {
//             let characteristic = await service.getCharacteristic(0x2A63);
//             let parser = new CyclingPowerMeasurementParser();
//             let value = await readCharacteristicValue(characteristic);
//             let data = parser.getData(value);
//
//             // is Crank Revolution Data Present ?
//             if ('cumulative_crank_revolutions' in data) {
//                 meter = new BlePowerCadenceMeter(device, server, service, characteristic);
//                 powerMeters.push([meter.id, meter]);
//                 meter.listen();
//                 console.log(meter);
//
//             } else {
//                 meter = new BlePowerMeter(device, server, service, characteristic);
//                 powerMeters.push([meter.id, meter]);
//             }
//         }
//     }
//     // org.bluetooth.service.heart_rate
//     if(!heartMeters.find(m => m[0] === device.id)) {
//         let service = undefined;
//         try {
//             service = await server.getPrimaryService(0x180D);
//         } catch(error) {
//         }
//
//         if(service) {
//             let characteristic = await service.getCharacteristic(0x2A37);
//             meter = new BleHRMeter(device, server, service, characteristic);
//             heartMeters.push([meter.id, meter]);
//             console.log(meter);
//             meter.listen();
//         }
//     }
//
// }
//
// let ble_sint16 = ['getInt16', 2, true];
// let ble_uint8 = ['getUint8', 1];
// let ble_uint16 = ['getUint16', 2, true];
// let ble_uint32 = ['getUint32', 4, true];
// // TODO: paired 12bit uint handling
// let ble_uint24 = ['getUint8', 3];
//
// // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.characteristic.cycling_power_measurement.xml
// let cycling_power_measurement = [
//     [0, [ [ble_sint16, 'instantaneous_power'] ]],
//     [1, [ [ble_uint8, 'pedal_power_balance'] ]],
//     [2, [ /* Pedal Power Balance Reference */]],
//     [4, [ [ble_uint16, 'accumulated_torque'] ]],
//     [8, [ /* Accumulated Torque Source */]],
//     [16, [ [ble_uint32, 'cumulative_wheel_revolutions'], [ble_uint16, 'last_wheel_event_time'] ]],
//     [32, [ [ble_uint16, 'cumulative_crank_revolutions'], [ble_uint16, 'last_crank_event_time'] ]],
//     [64, [ [ble_sint16, 'maximum_force_magnitude'], [ble_sint16, 'minimum_force_magnitude'] ]],
//     [128, [ [ble_sint16, 'maximum_torque_magnitude'], [ble_sint16, 'minimum_torque_magnitude'] ]],
//     [256, [ [ble_uint24, 'maximum_minimum_angle'] ]],
//     [512, [ [ble_uint16, 'top_dead_spot_angle'] ]],
//     [1024, [ [ble_uint16, 'bottom_dead_spot_angle'] ]],
//     [2048, [ [ble_uint16, 'accumulated_energy'] ]],
//     [4096, [ /* Offset Compensation Indicator */]]
// ];
//
// // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.characteristic.csc_measurement.xml
// let csc_measurement = [
//     [1, [ [ble_uint32, 'cumulative_wheel_revolutions'], [ble_uint16, 'last_wheel_event_time'] ]],
//     [2, [ [ble_uint16, 'cumulative_crank_revolutions'], [ble_uint16, 'last_crank_event_time'] ]]
// ];
//
// class BleCharacteristicParser {
//     getData(dataview) {
//         let offset = 0;
//         let mask;
//         if(this.mask_size === 16) {
//             mask = dataview.getUint16(0, true);
//             offset += 2;
//         } else {
//             mask = dataview.getUint8(0);
//             offset += 1;
//         }
//
//         let fieldArrangement = [];
//
//         // Contains required fields
//         if(this.fields[0][0] === 0) {
//             for(let fdesc of this.fields[0][1]) {
//                 fieldArrangement.push(fdesc);
//             }
//         }
//
//         for(let [flag, fieldDescriptions] of this.fields) {
//             if(mask & flag) {
//                 for(let fdesc of fieldDescriptions) {
//                     fieldArrangement.push(fdesc);
//                 }
//             }
//         }
//
//         let data = {};
//         for(let field of fieldArrangement) {
//             var [[accessor, fieldSize, endianness], fieldName] = field;
//             let value;
//             if(endianness) {
//                 value = dataview[accessor](offset, endianness);
//             } else {
//                 value = dataview[accessor](offset);
//             }
//
//             data[fieldName] = value;
//             offset += fieldSize;
//         }
//
//         return data;
//     }
// }
//
// class CyclingSpeedCadenceMeasurementParser extends BleCharacteristicParser {
//     constructor () {
//         super();
//         this.fields = csc_measurement;
//         this.mask_size = 8;
//     }
// }
//
// class CyclingPowerMeasurementParser extends BleCharacteristicParser {
//     constructor () {
//         super();
//         this.fields = cycling_power_measurement;
//         this.mask_size = 16;
//     }
// }
//
// class Meter {
//     constructor () {
//         this.listeners = {};
//         this.timeoutID = undefined;
//         this.milliTimeout = 8000;
//     }
//
//     clearValueOnTimeout(value) {
//         if(this.timeoutID !== undefined) {
//             clearTimeout(this.timeoutID);
//         }
//         this.timeoutID = setTimeout(() => {
//             this.timeoutID = undefined;
//             if(value.constructor === Array) {
//                 for(let v of value) {
//                     this.dispatch(v, 0);
//                 }
//             } else {
//                 this.dispatch(value, 0);
//             }
//         }, this.milliTimeout);
//     }
//
//     dispatch(type, value) {
//         console.log(type + ' ' + value);
//         switch (type) {
//             case 'hr':
//
//         }
//     }
// }
//
// class BleMeter extends Meter {
//     constructor (device, server, service, characteristic) {
//         super();
//
//         this.device = device;
//         this.server = server;
//         this.service = service;
//         this.characteristic = characteristic;
//
//         this.name = this.device.name;
//         this.id = this.device.id;
//
//         this.listening = false;
//
//         this.device.addEventListener('gattserverdisconnected', e => {
//             this.gattserverdisconnected(e)
//                 .catch(error => {
//                     console.log("Error: ", error);
//                 });
//         });
//     }
//
//     async gattserverdisconnected(e) {
//         console.log('Reconnecting');
//         this.server = await this.device.gatt.connect();
//         this.service = await this.server.getPrimaryService(this.serviceId);
//         this.characteristic = await this.service.getCharacteristic(this.characteristicId);
//         if(this.listening) {
//             this.listening = false;
//             this.listen();
//         }
//     }
// }
//
// class BlePowerCadenceMeter extends BleMeter {
//     constructor (device, server, service, characteristic) {
//         super(device, server, service, characteristic);
//
//         this.serviceId = 0x1818;
//         this.characteristicId = 0x2A63;
//         this.parser = new CyclingPowerMeasurementParser();
//
//         this.lastCrankRevolutions = 0;
//         this.lastCrankTime = 0;
//         this.lastWheelRevolutions = 0;
//         this.lastWheelTime = 0;
//     }
//
//     listen() {
//         if(!this.listening) {
//             this.characteristic.addEventListener('characteristicvaluechanged', event => {
//                 let data = this.parser.getData(event.target.value);
//                 let power = data['instantaneous_power'];
//                 let crankRevolutions = data['cumulative_crank_revolutions'];
//                 let crankTime = data['last_crank_event_time'];
//                 let wheelRevolutions = data['cumulative_wheel_revolutions'];
//                 let wheelTime = data['last_wheel_event_time'];
//
//                 /* Crank Calc */
//                 if(this.lastCrankTime > crankTime) {
//                     this.lastCrankTime = this.lastCrankTime - 65536;
//                 }
//                 if(this.lastCrankRevolutions > crankRevolutions) {
//                     this.lastCrankRevolutions = this.lastCrankRevolutions - 65536;
//                 }
//
//                 let revs = crankRevolutions - this.lastCrankRevolutions;
//                 let duration = (crankTime - this.lastCrankTime) / 1024;
//                 let rpm = 0;
//                 if(duration > 0) {
//                     rpm = (revs / duration) * 60;
//                 }
//
//                 this.lastCrankRevolutions = crankRevolutions;
//                 this.lastCrankTime = crankTime;
//                 /* End Crank Calc */
//
//                 /* Wheel Calc */
//                 if(wheelRevolutions !== undefined && wheelTime !== undefined) {
//                     if(this.lastWheelTime > wheelTime) {
//                         this.lastWheelTime = this.lastWheelTime - 65536;
//                     }
//                     if(this.lastWheelRevolutions > wheelRevolutions) {
//                         this.lastWheelRevolutions = this.lastWheelRevolutions - 65536;
//                     }
//
//                     let wheelRevs = wheelRevolutions - this.lastWheelRevolutions;
//                     let wheelDuration = (wheelTime - this.lastWheelTime) / 1024;
//                     let wheelRpm = 0;
//                     if(wheelDuration > 0) {
//                         wheelRpm = (wheelRevs / wheelDuration) * 60;
//                     }
//
//                     this.lastWheelRevolutions = wheelRevolutions;
//                     this.lastWheelTime = wheelTime;
//
//                     this.dispatch('wheelrpm', wheelRpm);
//                 }
//                 /* End Wheel Calc */
//                 console.log(power);
//
//                 this.dispatch('power', power);
//                 this.dispatch('cadence', rpm);
//                 this.clearValueOnTimeout(['power', 'cadence', 'wheelrpm']);
//             });
//             this.characteristic.startNotifications();
//             this.listening = true;
//         }
//     }
//
// }
//
// class BlePowerMeter extends BleMeter {
//     constructor (device, server, service, characteristic) {
//         super(device, server, service, characteristic);
//
//         this.serviceId = 0x1818;
//         this.characteristicId = 0x2A63;
//         this.parser = new CyclingPowerMeasurementParser();
//     }
//
//     listen() {
//         if(!this.listening) {
//             this.characteristic.addEventListener('characteristicvaluechanged', event => {
//                 let data = this.parser.getData(event.target.value);
//                 let power = data['instantaneous_power'];
//                 console.log(power);
//                 this.dispatch('power', power);
//                 this.clearValueOnTimeout('power');
//             });
//             this.characteristic.startNotifications();
//             this.listening = true;
//         }
//     }
//
// }
//
// class BleCadenceMeter extends BleMeter  {
//     constructor (device, server, service, characteristic) {
//         super(device, server, service, characteristic);
//
//         this.serviceId = 0x1816;
//         this.characteristicId = 0x2A5B;
//         this.parser = new CyclingSpeedCadenceMeasurementParser();
//
//         this.lastCrankRevolutions = 0;
//         this.lastCrankTime = 0;
//         this.lastWheelRevolutions = 0;
//         this.lastWheelTime = 0;
//     }
//
//     listen() {
//         if(!this.listening) {
//             this.characteristic.addEventListener('characteristicvaluechanged', event => {
//                 let data = this.parser.getData(event.target.value);
//                 let crankRevolutions = data['cumulative_crank_revolutions'];
//                 let crankTime = data['last_crank_event_time'];
//                 let wheelRevolutions = data['cumulative_wheel_revolutions'];
//                 let wheelTime = data['last_wheel_event_time'];
//
//                 if(crankRevolutions !== undefined && crankTime !== undefined) {
//                     if(this.lastCrankTime > crankTime) {
//                         this.lastCrankTime = this.lastCrankTime - 65536;
//                     }
//                     if(this.lastCrankRevolutions > crankRevolutions) {
//                         this.lastCrankRevolutions = this.lastCrankRevolutions - 65536;
//                     }
//
//                     let revs = crankRevolutions - this.lastCrankRevolutions;
//                     let duration = (crankTime - this.lastCrankTime) / 1024;
//                     let rpm = 0;
//                     if(duration > 0) {
//                         rpm = (revs / duration) * 60;
//                     }
//
//                     this.lastCrankRevolutions = crankRevolutions;
//                     this.lastCrankTime = crankTime;
//
//                     this.dispatch('cadence', rpm);
//                 }
//
//                 if(wheelRevolutions !== undefined && wheelTime !== undefined) {
//                     if(this.lastWheelTime > wheelTime) {
//                         this.lastWheelTime = this.lastWheelTime - 65536;
//                     }
//                     if(this.lastWheelRevolutions > wheelRevolutions) {
//                         this.lastWheelRevolutions = this.lastWheelRevolutions - 65536;
//                     }
//
//                     let wheelRevs = wheelRevolutions - this.lastWheelRevolutions;
//                     let wheelDuration = (wheelTime - this.lastWheelTime) / 1024;
//                     let wheelRpm = 0;
//                     if(wheelDuration > 0) {
//                         wheelRpm = (wheelRevs / wheelDuration) * 60;
//                     }
//
//                     this.lastWheelRevolutions = wheelRevolutions;
//                     this.lastWheelTime = wheelTime;
//
//                     this.dispatch('wheelrpm', wheelRpm);
//                 }
//
//                 this.clearValueOnTimeout(['cadence', 'wheelrpm']);
//             });
//             this.characteristic.startNotifications();
//             this.listening = true;
//         }
//     }
//
// }
//
// class BleHRMeter extends BleMeter {
//     constructor (device, server, service, characteristic) {
//         super(device, server, service, characteristic);
//
//         this.serviceId = 0x180D;
//         this.characteristicId = 0x2A37;
//     }
//
//     listen() {
//         if(!this.listening) {
//             this.characteristic.addEventListener('characteristicvaluechanged', event => {
//                 let hr = event.target.value.getUint8(1);
//                 console.log(hr);
//                 this.dispatch('hr', hr);
//                 this.clearValueOnTimeout('hr');
//             });
//             this.characteristic.startNotifications();
//             this.listening = true;
//         }
//     }
//
// }
//
// function readCharacteristicValue(characteristic) {
//     return new Promise(function(resolve,reject) {
//         let executed = false;
//         let listener = event => {
//             characteristic.removeEventListener('characteristicvaluechanged', listener);
//             characteristic.stopNotifications();
//             if(!executed) {
//                 executed = true;
//                 resolve(event.target.value);
//             }
//         }
//
//         characteristic.addEventListener('characteristicvaluechanged', listener);
//         characteristic.startNotifications();
//     });
// }
