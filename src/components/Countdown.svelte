<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from "svelte";
  export let endTime;
  let countdown: string;
  let interval;
  const dispatch = createEventDispatcher();

  function updateCountdown(){
    const time = endTime - Date.now();
    if(time<0)
      dispatch("message", { text: 'end' });
    const hours = Math.trunc(time/(1000*3600));
    const minutes = Math.trunc(time/(1000*60)) - hours*60;
    const seconds = Math.trunc(time/(1000)) - hours*3600 - minutes*60;
    countdown = `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
  }

  onMount( () => {
    updateCountdown();
    interval = setInterval(updateCountdown, 1000);
  });

  function ignore(){}

  onDestroy( () => clearInterval(interval));
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
    overflow-x: hidden;
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
  .countdown {
    color: black;
    display: block;
    margin: 2em 0;
    padding: 1em;
  }
</style>

<div class="back" on:click={() => dispatch("message", { text: 'end' })}>
  <div class="content">
    <h1>WHPSC Simulator</h1>
    <h2>The event will start soon!</h2>
    <span class="countdown">{countdown}</span>
  </div>
</div>
