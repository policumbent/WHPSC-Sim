<script lang="ts">
    import { fly } from 'svelte/transition';
    import {Settings} from "./Settings";
    import {onMount} from "svelte";
    import {saveSettings, getSettings} from "./store"
    import { get } from "svelte/store"
    export let show = false;
    let settings_value: Settings;

    let bikeWeight, riderWeight, wheelsInertia, wheelsRadius, efficiency, area, rho, debugMode, cx;

    onMount( () => {
        settings_value = getSettings();
        bikeWeight = settings_value.bikeWeight;
        riderWeight = settings_value.riderWeight;
        wheelsInertia = settings_value.wheelsInertia;
        wheelsRadius = settings_value.wheelsRadius;
        efficiency = settings_value.efficiency;
        area = settings_value.area;
        rho = settings_value.rho;
        cx = settings_value.cx;
        debugMode = settings_value.debugMode;
    });

    function save() {
        saveSettings(new Settings(bikeWeight, riderWeight, wheelsInertia, wheelsRadius, efficiency, area, rho, cx, debugMode));
        show = false;
    }

</script>
{#if show}
    <nav transition:fly={{x: 250, opacity: 1}}>
        <div class="sliders_div">
            <label for="bike_weight">Bike weight: {bikeWeight}kg</label>
            <input class="slider" id="bike_weight" type="range" min="1" max="200" bind:value={bikeWeight}>
            <label for="rider_weight">Rider weight: {riderWeight}kg</label>
            <input class="slider" id="rider_weight" type="range" step="0.5" min="40" max="100" bind:value={riderWeight}>
            <label for="wheels_inertia">Wheels Inertia: {wheelsInertia}</label>
            <input class="slider" id="wheels_inertia" type="range" step="0.001" min="0.001" max="0.1" bind:value={wheelsInertia}>
            <label for="efficiency">Efficiency: {efficiency}</label>
            <input class="slider" id="efficiency" type="range" step="0.01" min="0.8" max="1" bind:value={efficiency}>
            <label for="wheels_radius">Wheels Radius: {wheelsRadius}m</label>
            <input class="slider" id="wheels_radius" type="range" step="0.00001" min="0.1" max="0.4" bind:value={wheelsRadius}>
            <label for="area">Area: {area}m²</label>
            <input class="slider" id="area" type="range" step="0.00001" min="0" max="2" bind:value={area}>
            <label for="air_density">Air Density: {rho}</label>
            <input class="slider" id="air_density" type="range" step="0.0001" min="0.8" max="1.2" bind:value={rho}>
            <label for="cx">Cx @120km/h: {cx}</label>
            <input class="slider" id="cx" type="range" step="0.0001" min="0.02" max="1.2" bind:value={cx}>
            <label class="checkbox" for="debug">Debug:  </label>
            <input class="checkbox" id="debug" type="checkbox" bind:checked={debugMode}>
        </div>
        <button on:click={save}>Save</button>
<!--        <div>-->
<!--            <button on:click={btSearch}>Search Bluetooth Power Meter</button>-->
<!--        </div>-->
    </nav>
{/if}


<style>
    nav {
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

    button {
        margin-top: 1em;
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
</style>
