import {BleMeter} from "./BleMeter";
import {powerValue} from "../../store";
import {CyclingPowerMeasurementParser} from "./CyclingPowerMeasurementParser"

export class BlePowerCadenceMeter extends BleMeter {
    lastCrankRevolutions = 0;
    lastCrankTime = 0;
    lastWheelRevolutions = 0;
    lastWheelTime = 0;
    characteristicId: number;
    serviceId: number;
    parser: CyclingPowerMeasurementParser;

    constructor (device, server, service, characteristic) {
        super(device, server, service, characteristic);

        this.serviceId = 0x1818;
        this.characteristicId = 0x2A63;
        this.parser = new CyclingPowerMeasurementParser();

        this.lastCrankRevolutions = 0;
        this.lastCrankTime = 0;
        this.lastWheelRevolutions = 0;
        this.lastWheelTime = 0;
    }

    listen() {
        if(!this.listening) {
            this.characteristic.addEventListener('characteristicvaluechanged', event => {
                let data = this.parser.getData(event.target.value);
                let power = data['instantaneous_power'];
                let crankRevolutions = data['cumulative_crank_revolutions'];
                let crankTime = data['last_crank_event_time'];
                let wheelRevolutions = data['cumulative_wheel_revolutions'];
                let wheelTime = data['last_wheel_event_time'];

                /* Crank Calc */
                if(this.lastCrankTime > crankTime) {
                    this.lastCrankTime = this.lastCrankTime - 65536;
                }
                if(this.lastCrankRevolutions > crankRevolutions) {
                    this.lastCrankRevolutions = this.lastCrankRevolutions - 65536;
                }

                let revs = crankRevolutions - this.lastCrankRevolutions;
                let duration = (crankTime - this.lastCrankTime) / 1024;
                let rpm = 0;
                if(duration > 0) {
                    rpm = (revs / duration) * 60;
                }

                this.lastCrankRevolutions = crankRevolutions;
                this.lastCrankTime = crankTime;
                /* End Crank Calc */

                /* Wheel Calc */
                if(wheelRevolutions !== undefined && wheelTime !== undefined) {
                    if(this.lastWheelTime > wheelTime) {
                        this.lastWheelTime = this.lastWheelTime - 65536;
                    }
                    if(this.lastWheelRevolutions > wheelRevolutions) {
                        this.lastWheelRevolutions = this.lastWheelRevolutions - 65536;
                    }

                    let wheelRevs = wheelRevolutions - this.lastWheelRevolutions;
                    let wheelDuration = (wheelTime - this.lastWheelTime) / 1024;
                    let wheelRpm = 0;
                    if(wheelDuration > 0) {
                        wheelRpm = (wheelRevs / wheelDuration) * 60;
                    }

                    this.lastWheelRevolutions = wheelRevolutions;
                    this.lastWheelTime = wheelTime;

                    // this.dispatch('wheelrpm', wheelRpm);
                }
                /* End Wheel Calc */
                console.log(power);

                this.dispatch(power);
                // this.dispatch('cadence', rpm);
                this.clearValueOnTimeout(['power']);
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
