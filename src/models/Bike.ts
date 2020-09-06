import type {BikeSettings} from "./BikeSettings";

export class Bike {
    bikeName: string;
    imgSrc: string;
    description: string;
    settings: BikeSettings;

    constructor(bikeName: string, imgSrc: string, description: string, settings: BikeSettings) {
        this.bikeName = bikeName;
        this.imgSrc = imgSrc;
        this.description = description;
        this.settings = settings;
    }
}
