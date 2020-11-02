<script lang="ts">
  import Modal from "svelte-simple-modal";
  import {getContext, onMount} from "svelte";
  import {getDebug, getUserSettings} from "./store";
  import type {BikeSettings, UserSettings, Bike} from "./models/Settings";

  import Simulator from "./Simulator.svelte";
  import ResultModal from "./ResultContent.svelte";
  import {hrValue, powerValue} from "./store";
  import Welcome from "./Welcome.svelte";
  import ResultContainer from "./ResultContainer.svelte";
  import BikePicker from "./BikePicker.svelte";
  import YourResultComponent from "./components/YourResultComponent.svelte";
  import ExitButton from "./components/ExitButton.svelte";

  let power = 0;
  let simulator;
  let simulation_started = false;
  let openModal;
  let bike: Bike;
  let res = null;

  // todo: do unsubscribe onDestroy
  // uso la fc al posto della potenza per il primo test
  // const hrUnsubscribe = hrValue.subscribe(value => power = value);
  const powerUnsubscribe = powerValue.subscribe((value) => (power = value));

  // right click disabled
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  document.addEventListener("fullscreenchange", (event) =>
          document.fullscreenElement === null ? exitSimulation() : event
  );

  function exitFullscreen() {
    document.exitFullscreen();
  }

  function startSimulation(event) {
    bike = event.detail.text;
    console.log("START", bike);
    document.documentElement
            .requestFullscreen()
            .then(() => {
              simulation_started = true;
              window.document.body.classList.toggle("dark-mode");
              // console.log(getWidth());
            })
            .catch((err) => console.log(err));
  }

  onMount(() => {
    console.log('v1.4.1');
    const params = new URLSearchParams(window.location.search);
    // console.log(params.get('res'));
    res = params.get('res');
  })

  function exitSimulation() {
    simulation_started = false;
    window.document.body.classList.toggle("dark-mode");
  }


  function handleResult(event) {
    console.log("HANDLE", bike.settings);
    console.log("bike", bike);
    console.log(event.detail.text);
    if (event.detail.text !== undefined) exitFullscreen();
    const speed = event.detail.text !== undefined ? event.detail.text.speed : 141.0;
    const power = event.detail.text !== undefined ? event.detail.text.power : 0;
    openModal(speed, power, bike.bikeName, bike.settings, getUserSettings());
  }

</script>

<style>
  main {
    text-align: center;
    position: absolute;
    margin: 0;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    overflow: auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  #power_debug_div {
    margin: 2em 4em;
  }

  .slider {
    margin-top: 0.5em;
    -webkit-appearance: none; /* Override default CSS styles */
    appearance: none;
    width: 100%; /* Full-width */
    height: 15px; /* Specified height */
    background: #d3d3d3; /* Grey background */
    outline: none; /* Remove outline */
    opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
    -webkit-transition: 0.2s; /* 0.2 seconds transition on hover */
    transition: opacity 0.2s;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    width: 25px; /* Set a specific slider handle width */
    height: 25px; /* Slider handle height */
    background: #ff0000; /* Green background */
    border-radius: 50%;
    cursor: pointer; /* Cursor on hover */
  }
  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #ff0000;
    cursor: pointer;
  }

  .top-right-fixed {
    color: gold;
    text-shadow: 2px 2px #333333;
    margin-top: 8px;
    margin-right: 8px;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 9999;
    cursor: pointer;
  }
  :global(body) {
    background-color: #f2eee2;
    color: #0084f6;
    transition: background-color 0.3s;
  }
  :global(body.dark-mode) {
    background-color: #1d3040;
    color: #bfc2c7;
  }

</style>

<main>
  {#if res===null}
    {#if simulation_started}
      <Modal>
        <ExitButton/>
      </Modal>
      <Simulator
              bind:this={simulator}
              power={!isNaN(power) ? power : 0}
              on:message={handleResult}
              bikeSettings={bike.settings}
              userSettings={getUserSettings()} />
      {#if getDebug()}
        <div id="power_debug_div">
          <label id="power_debug_label" for="power_debug">
            Power Debug Slider: {power}W
          </label>
          <input
                  class="slider"
                  id="power_debug"
                  type="range"
                  min="0"
                  max="1000"
                  bind:value={power} />
        </div>
      {/if}
    {:else}
      <Welcome on:message={startSimulation} />

      <!--              <button on:click={handleResult}>Test save result dialog</button>-->

    {/if}
    <Modal>
      <ResultContainer bind:openModal />
    </Modal>
  {:else}
    <YourResultComponent resultId="{res}" />
  {/if}
</main>
