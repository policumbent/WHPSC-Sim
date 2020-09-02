import {BleMeter} from "./BleMeter";
import {hrValue} from "../store.js"

export class BleHRMeter extends BleMeter {
    characteristicId: number;
    serviceId: number;

    constructor (device, server, service, characteristic) {
        super(device, server, service, characteristic);

        this.serviceId = 0x180D;
        this.characteristicId = 0x2A37;
    }

    listen() {
        if(!this.listening) {
            this.characteristic.addEventListener('characteristicvaluechanged', event => {
                let hr = event.target.value.getUint8(1);
                console.log(hr);
                this.dispatch(hr);
                this.clearValueOnTimeout('hr');
            });
            this.characteristic.startNotifications();
            this.listening = true;
        }
    }

    dispatch(value)  {
        console.log('hr ' + value);
        hrValue.set(value);
    }
}
