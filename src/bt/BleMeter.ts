import {Meter} from "./Meter";

export abstract class BleMeter extends Meter {
    device;
    server;
    service;
    characteristic;
    name: string;
    id: number;
    abstract serviceId: number;
    abstract characteristicId: number;
    listening: boolean;

    protected constructor (device, server, service, characteristic) {
        super();
        this.device = device;
        this.server = server;
        this.service = service;
        this.characteristic = characteristic;

        this.name = this.device.name;
        this.id = this.device.id;

        this.listening = false;

        this.device.addEventListener('gattserverdisconnected', e => {
            this.gattServerDisconnected(e)
                .catch(error => {
                    console.log("Error: ", error);
                });
        });
    }

    abstract listen();

    async gattServerDisconnected(e) {
        console.log('Reconnecting');
        this.server = await this.device.gatt.connect();
        this.service = await this.server.getPrimaryService(this.serviceId);
        this.characteristic = await this.service.getCharacteristic(this.characteristicId);
        if(this.listening) {
            this.listening = false;
            this.listen();
        }
    }
}
