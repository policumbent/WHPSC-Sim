import {powerValue} from "../../store.js"
import type { MqttClient } from "mqtt";


export class MqttPowerMeter {

    constructor (client: MqttClient) {
        client.on("message", (topic, message) => {
            // message is Buffer
            console.log(message.toString());
            if (topic.toString()==='power' && !isNaN(Number(message.toString()))){
                if 
                this.dispatch(Number(message.toString()))
            }
          });
    }


    dispatch(value: number) {
        console.log('power ' + value);
        powerValue.set(value);
    }

}
