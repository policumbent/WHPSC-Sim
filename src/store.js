import {Settings} from "./Settings";

const newSettings = new Settings(30,50,0.06,0.254,0.95,0.50,1.01, true);

export let getSettings = () =>{

    function toSettingsType(storageValue) {
        // todo: trovare un metodo più belllo
        return new Settings(
            storageValue['_bikeWeight'],
            storageValue['_riderWeight'],
            storageValue['_wheelsInertia'],
            storageValue['_wheelsRadius'],
            storageValue['_efficiency'],
            storageValue['_area'],
            storageValue['_rho'],
            storageValue['_debugMode']
            );
    }

    const storageValue = localStorage.getItem("settings");
    return storageValue===null ? newSettings: toSettingsType(JSON.parse(storageValue));
};
export let saveSettings = value => localStorage.setItem("settings", JSON.stringify(value));
