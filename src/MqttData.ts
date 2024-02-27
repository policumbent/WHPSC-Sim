
import {MqttPowerMeter} from "./models/mqtt/MqttPowerMeter";
import mqtt, { MqttClient } from "mqtt"

let powerMeter: MqttPowerMeter;
let client: MqttClient;

export async function connectMqtt(serverHost: string) {
    if (client != null)
        return;
    // const PORT = 9001

    // const options = {
    //     host: '192.168.3.17',
    //     port: PORT,
    // }

    client = mqtt.connect(serverHost);
    client.on("connect", () => {
        console.log('connected');
        client.subscribe("power", (err) => {
          if (!err) {
            client.publish("raspy", "WHPSC-Sim on");
          }

        });
      });
    powerMeter = new MqttPowerMeter(client); 
}
