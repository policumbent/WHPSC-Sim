<script lang="ts">
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import {
        saveBikeSettings,
        getSettings,
        saveDebug,
        saveUserSettings,
        getUserSettings,
        getDebug,
    } from "../store";

    import { BikeSettings, UserSettings } from "../models/Settings";

    export let show: boolean = false;
    let bike_settings_value: BikeSettings;
    let users_settings_value: UserSettings;
    let debug_setting_value = false;
    let bikeWeight: number, riderWeight: number, wheelsInertia: number,
        wheelsCircumference: number, efficiency: number, area: number,
        debugMode: boolean, cx: number, riderHeight:number,
        temperature: number,  altitude: number,  humidity: number;

    onMount(() => {
        bike_settings_value = getSettings();
        users_settings_value = getUserSettings();
        debug_setting_value = getDebug();
        bikeWeight = bike_settings_value.bikeWeight;
        riderWeight = users_settings_value.riderWeight;
        riderHeight = users_settings_value.riderHeight;
        wheelsInertia = bike_settings_value.wheelsInertia;
        wheelsCircumference = bike_settings_value.wheelsCircumference;
        efficiency = bike_settings_value.efficiency;
        area = bike_settings_value.area;
        altitude = users_settings_value.altitude;
        humidity = users_settings_value.humidity;
        temperature = users_settings_value.temperature;
        cx = bike_settings_value.cx;
        debugMode = debug_setting_value;
    });

    function save() {
        saveBikeSettings(new BikeSettings(bikeWeight, wheelsInertia, wheelsCircumference, efficiency, area, cx, 'coefficients4.json'));
        saveDebug(debugMode);
        saveUserSettings(new UserSettings(riderWeight, riderHeight, temperature, altitude, humidity));

        show = false;
        if (debugMode !== debug_setting_value) {
            // it isn't a beautiful, but it works and is only for debug
            window.location.reload();
        }
    }
</script>


<style>
    nav {
        z-index: 9999;
        position: fixed;
        top: 0;
        right: 0;
        height: 100%;
        padding: 2rem 1rem 0.6rem;
        border-left: 1px solid #aaa;
        background: #fff;
        overflow-y: auto;
        width: 10rem;
    }
    input {
        margin-top: 5px;
        margin-bottom: 1.5em;
    }
    .checkbox{
        display: inline;
        margin-right: 3px;
    }

    .btn {
        margin-top: 1em;
        margin-bottom: 2.5em;
        padding: 0.7em 1.7em;
        background-color: #0084f6;
        border: white;
        color: white;
        text-transform: uppercase;
        font-weight: 300;
    }
    .sliders_div {
        margin-top: 2em;
    }
    .group_label {
        font-weight: bold;
        margin-bottom: 1em;
    }

    hr.solid {
        border-top: 1px solid #0084f6;
    }
    .value_input {
        display: inline-block;
    }
    .input-group{
        position: relative;
        height: 60px;
        display: block;
        /*top:40px;*/
        width: auto;
    }
    .input-group input{
        /*border-right:0!important;*/
        text-align: left;
        padding-left: 10px;
        width: 8rem;
    }
    .input-group span{
        position: absolute;
        right: 40px;
        color: #333;
        top: 13px;
        /*font-weight:bold;*/
    }
</style>


{#if show}
    <nav transition:fly={{x: 250, opacity: 1}}>
        <form on:submit={save}>
            <div class="sliders_div">
                <label class="group_label">Your settings:</label>
                <label for="rider_weight">Rider weight:</label>
                <div class="input-group">
                    <input class="slider" id="rider_weight" type="number" step="0.5" min="40" max="100" bind:value={riderWeight}>
                    <span>kg</span>
                </div>
                <label for="rider_height">Rider height:</label>
                <div class="input-group">
                    <input class="slider" id="rider_height" type="number" step="1" min="100" max="250" bind:value={riderHeight}>
                    <span>cm</span>
                </div>
                <label for="altitude">Altitude:</label>
                <div class="input-group">
                    <input class="slider" id="altitude" type="number" step="100" min="0" max="3000" bind:value={altitude}>
                    <span>m</span>
                </div>
                <label for="temperature">Temperature:</label>
                <div class="input-group">
                    <input class="slider" id="temperature" type="number" step="1" min="0" max="40" bind:value={temperature}>
                    <span>°C</span>
                </div>
                <label for="humidity">Humidity: </label>
                <div class="input-group">
                    <input class="slider" id="humidity" type="number" step="1" min="0" max="100" bind:value={humidity}>
                    <span>%</span>
                </div>
            </div>
            <hr class="solid">
            <div class="sliders_div">
                <label class="group_label">Your custom streamliner settings:</label>
                <label for="bike_weight">Bike weight: </label>
                <div class="input-group">
                    <input class="slider" id="bike_weight" type="number" min="1" max="200" bind:value={bikeWeight}>
                    <span>kg</span>
                </div>
                <label for="wheels_inertia">Wheels Inertia: </label>
                <div class="input-group">
                    <input class="slider" id="wheels_inertia" type="number" step="0.001" min="0.01" max="0.15" bind:value={wheelsInertia}>
                    <span>kg*m²</span>
                </div>
                <label for="efficiency">Efficiency: </label>
                <div class="input-group">
                    <input class="slider" id="efficiency" type="number" step="0.01" min="0.8" max="1" bind:value={efficiency}>
                    <span>[-]</span>
                </div>
                <label for="wheels_circumference">Wheels Circumference: </label>
                <div class="input-group">
                    <input class="slider" id="wheels_circumference" type="number" step="0.001" min="1" max="2.5" bind:value={wheelsCircumference}>
                    <span>m</span>
                </div>
                <label for="area">Frontal Area:</label>
                <div class="input-group">
                    <input class="slider" id="area" type="number" step="0.00001" min="0" max="2" bind:value={area}>
                    <span>m²</span>
                </div>
                <label for="cx">Cd @120km/h: </label>
                <div class="input-group">
                    <input class="slider" id="cx" type="number" step="0.0001" min="0.02" max="1.2" bind:value={cx}>
                    <span>[-]</span>
                </div>
            </div>
            <hr class="solid">
            <!--        <div class="sliders_div">-->
            <!--            <label class="group_label">Software settings:</label>-->
            <!--            <label class="checkbox" for="debug">Debug:  </label>-->
            <!--            <input class="checkbox" id="debug" type="checkbox" bind:checked={debugMode}>-->
            <!--        </div>-->
            <input class="btn" type="submit" value="Save"/>
        </form>
    </nav>
{/if}
