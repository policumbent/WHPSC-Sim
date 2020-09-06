import type {Settings} from "./Settings";

export class Bike {
    bikeName: string;
    imgSrc: string;
    description: string;
    settings: Settings;

    constructor(bikeName: string, imgSrc: string, description: string, settings: Settings) {
        this.bikeName = bikeName;
        this.imgSrc = imgSrc;
        this.description = description;
        this.settings = settings;
    }
}
