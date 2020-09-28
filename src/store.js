import { writable } from "svelte/store";

import { BikeSettings } from "./models/Bike";
import UserSettings from "./models/UserSettings";

export const hrValue = writable(0);
export const powerValue = writable(-1);
const newSettings = new BikeSettings(30, 0.06, 0.254, 0.95, 0.50,  0.45);
const newUserSettings = new UserSettings(70, 180, 1.01);
export const getDebug = () => {
    const storageValue = localStorage.getItem("debug");
    return storageValue==='true';
}
export let getSettings = () =>{
    function toSettingsType(storageValue) {
        // todo: trovare un metodo più bello
        return new BikeSettings(
            storageValue['_bikeWeight'],
            storageValue['_wheelsInertia'],
            storageValue['_wheelsRadius'],
            storageValue['_efficiency'],
            storageValue['_area'],
            storageValue['_cx']
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
            storageValue['_rho']
        );
    }
    const storageValue = localStorage.getItem("user_settings");
    return storageValue===null ? newUserSettings: toSettingsType(JSON.parse(storageValue));
};

export let saveBikeSettings = (value) =>
  localStorage.setItem("bike_settings", JSON.stringify(value));
export let saveUserSettings = (value) =>
  localStorage.setItem("user_settings", JSON.stringify(value));
export let saveDebug = (value) => localStorage.setItem("debug", value);
