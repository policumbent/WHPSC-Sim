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
    wheelsCircumference: number, efficiency: number, area: number, rho: number,
    debugMode: boolean, cx: number, riderHeight:number;

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
        rho = users_settings_value.rho;
        cx = bike_settings_value.cx;
        debugMode = debug_setting_value;
  });

  function save() {
    saveBikeSettings(new BikeSettings(bikeWeight, wheelsInertia, wheelsCircumference, efficiency, area, cx, 'coefficients4.json'));
        saveDebug(debugMode);
        saveUserSettings(new UserSettings(riderWeight, riderHeight, rho));

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

  button {
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
</style>


{#if show}
<nav transition:fly={{x: 250, opacity: 1}}>
  <div class="sliders_div">
      <label class="group_label">Your settings:</label>
      <label for="rider_weight">Rider weight: {riderWeight}kg</label>
      <input class="slider" id="rider_weight" type="range" step="0.5" min="40" max="100" bind:value={riderWeight}>
      <label for="rider_height">Rider height: {riderHeight}cm</label>
      <input class="slider" id="rider_height" type="range" step="1" min="100" max="250" bind:value={riderHeight}>
      <label for="air_density">Air Density: {rho}</label>
      <input class="slider" id="air_density" type="range" step="0.0001" min="0.8" max="1.2" bind:value={rho}>
  </div>
  <hr class="solid">
  <div class="sliders_div">
      <label class="group_label">Your custom streamliner settings:</label>
      <label for="bike_weight">Bike weight: {bikeWeight}kg</label>
      <input class="slider" id="bike_weight" type="range" min="1" max="200" bind:value={bikeWeight}>
      <label for="wheels_inertia">Wheels Inertia: {wheelsInertia}</label>
      <input class="slider" id="wheels_inertia" type="range" step="0.001" min="0.001" max="0.1" bind:value={wheelsInertia}>
      <label for="efficiency">Efficiency: {efficiency}</label>
      <input class="slider" id="efficiency" type="range" step="0.01" min="0.8" max="1" bind:value={efficiency}>
      <label for="wheels_circumference">Wheels Circumference: {wheelsCircumference}m</label>
      <input class="slider" id="wheels_circumference" type="range" step="0.001" min="1" max="2.5" bind:value={wheelsCircumference}>
      <label for="area">Area: {area}m²</label>
      <input class="slider" id="area" type="range" step="0.00001" min="0" max="2" bind:value={area}>
      <label for="cx">Cd @120km/h: {cx}</label>
      <input class="slider" id="cx" type="range" step="0.0001" min="0.02" max="1.2" bind:value={cx}>
  </div>
  <hr class="solid">
  <div class="sliders_div">
      <label class="group_label">Software settings:</label>
      <label class="checkbox" for="debug">Debug:  </label>
      <input class="checkbox" id="debug" type="checkbox" bind:checked={debugMode}>
  </div>
  <button on:click={save}>Save</button>
</nav>
{/if}
