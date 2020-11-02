<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { getSettings, getUserSettings } from "./store";

  import BikeComponent from "./components/Bike.svelte";
  import { Bike, BikeSettings } from "./models/Settings";

  const dispatch = createEventDispatcher();
  const customBike: Bike = new Bike(
    "Custom",
    "img/gear.svg",
    "Your custom settings",
    getSettings()
  );
  let bikes: Bike[] = [
    new Bike("Taurus", "img/taurus.svg", "A very fast streamliner",
            new BikeSettings(30, 0.09, 1.450, 0.96, 0.29, 0.04, 'coefficients4.json')),
    new Bike("SecretCycle", "img/handbike_c.svg", "A faired handcycle",
            new BikeSettings(35, 0.09*3/2, 1.450, 0.96, 0.4626, 0.05641, 'coefficients4.json')),
    new Bike("Coral", "img/recumbent.svg", "A recumbent bike",
            new BikeSettings(14, 0.091, 1.450, 0.97, 0.32+getAreaCorrection(), 0.57, 'coefficients_normal_bike_4.json')),
    new Bike("Road Bike", "img/normal.svg", "A road bike",
            new BikeSettings(7.5, 0.0786, 2.105, 0.98, 0.43+getAreaCorrection()*0.7, 0.67, 'coefficients_normal_bike_4.json'))
  ];

  function getAreaCorrection() {
    const height = getUserSettings().riderHeight;
    if (height >= 185)
      return 0.05
    else if (height >= 175 && height < 185)
      return 0
    else if (height >= 165 && height < 175)
      return -0.05
    return -0.09;
  }

  function shuffle(array) {
    // https://bost.ocks.org/mike/shuffle/
    let copy = [],
      n = array.length,
      i;
    // While there remain elements to shuffle…
    while (n) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * array.length);
      // If not already shuffled, move it to the new array.
      if (i in array) {
        copy.push(array[i]);
        delete array[i];
        n--;
      }
    }
    return copy;
  }
  function bikeChosen(bike: Bike) {
    // console.log(bike);
    dispatch("message", { text: bike });
  }
  onMount(async () => {
    bikes = shuffle(bikes);
    bikes.push(customBike);
  });
</script>

<style>
/* 
  label {
    position: absolute;
    top: 10%;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    color: white;
    text-align: center;
    text-transform: uppercase;
    font-weight: 100;
    font-size: 3em;
  } */

  .content {
    position: absolute;
    background-color: #ffffff;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow-x: auto;
    white-space: nowrap;
    /*padding: 20px;*/
    height: 230px;
    border: 1px solid #888;
    width: 100%; /* Could be more or less, depending on screen size */
  }

  .back {
    /*display: none; !* Hidden by default *!*/
    position: absolute; /* Stay in place */
    z-index: 1; /* Sit on top */
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.7); /* Black w/ opacity */
  }

  /* The Close Button */
  /* .close {
    color: #aaa;
    float: right;
    /*margin-top: 10px;
    margin-right: 10px;
    font-size: 3em;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  } */

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
  }

  ::-webkit-scrollbar {
    width: 10px;
    background-color: #f5f5f5;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ff3e00;
    background-image: -webkit-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
  }
</style>

<div on:click={() => bikeChosen(null)} class="back">
  <div class="content">
    {#each bikes as bike}
      <BikeComponent on:click={() => bikeChosen(bike)} {bike} />
    {/each}
  </div>
  <!--    <label class="">Pick your bike</label>-->
</div>
