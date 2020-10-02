import {BleMeter} from "./BleMeter";
import {powerValue} from "../../store.js"
import {hrValue} from "../../store";
import {CyclingPowerMeasurementParser} from "./CyclingPowerMeasurementParser"


export class BlePowerMeter extends BleMeter {
    characteristicId: number;
    serviceId: number;
    parser: CyclingPowerMeasurementParser;

    constructor (device, server, service, characteristic) {
        super(device, server, service, characteristic);

        this.serviceId = 0x1818;
        this.characteristicId = 0x2A63;
        this.parser = new CyclingPowerMeasurementParser();
    }

    listen() {
        if(!this.listening) {
            this.characteristic.addEventListener('characteristicvaluechanged', event => {
                let data = this.parser.getData(event.target.value);
                let power = data['instantaneous_power'];
                this.dispatch(power);
                this.clearValueOnTimeout('power');
            });
            this.characteristic.startNotifications();
            this.listening = true;
        }
    }

    dispatch(value) {
        console.log('power ' + value);
        powerValue.set(value);
    }

}
