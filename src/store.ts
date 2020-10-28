import { writable } from "svelte/store";
import { BikeSettings, UserSettings } from "./models/Settings";


export const hrValue = writable(0);
export const powerValue = writable(0);
const newSettings = new BikeSettings(30, 0.09, 1.450, 0.96, 0.29,  0.04, 'coefficients4.json');
const newUserSettings = new UserSettings(70, 180, 25, 1400, 30);
export const getDebug = () => {
    const storageValue = localStorage.getItem("debug");
    return storageValue==='true';
}
export let getSettings = (): BikeSettings =>{
    function toSettingsType(storageValue: any[]) {
        // todo: trovare un metodo più bello
        return new BikeSettings(
            storageValue['_bikeWeight'],
            storageValue['_wheelsInertia'],
            storageValue['_wheelsCircumference'],
            storageValue['_efficiency'],
            storageValue['_area'],
            storageValue['_cx'],
            'coefficients4.json'
        );
    }
    const storageValue = localStorage.getItem("bike_settings");
    return storageValue===null ? newSettings: toSettingsType(JSON.parse(storageValue));
};

export let getUserSettings = () => {
    function toSettingsType(storageValue) {
        // todo: trovare un metodo più bello
        return new UserSettings(
            storageValue["_riderWeight"],
            storageValue['_riderHeight'],
            storageValue['_temperature'],
            storageValue['_altitude'],
            storageValue['_humidity']
        );
    }
    const storageValue = localStorage.getItem("user_settings");
    // console.log(newUserSettings);
    return storageValue===null ? newUserSettings: toSettingsType(JSON.parse(storageValue));
};

export let saveBikeSettings = (value) =>
    localStorage.setItem("bike_settings", JSON.stringify(value));
export let saveUserSettings = (value) =>
    localStorage.setItem("user_settings", JSON.stringify(value));
export let saveDebug = (value) => localStorage.setItem("debug", value);
