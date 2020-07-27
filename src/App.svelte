<script lang="ts">
	import Simulator from "./Simulator.svelte";
	import {Settings} from "./Settings";
	import Welcome from "./Welcome.svelte";
	import Icon from 'svelte-awesome';
	import { close } from 'svelte-awesome/icons';
	import {getSettings} from './store'

	let power = 0;
	let simulator;
	let simulation_started = false;

	function startSimulation() {
		simulation_started = true;
		window.document.body.classList.toggle('dark-mode')
	}

	function exitSimulation() {
		simulation_started = false;
		window.document.body.classList.toggle('dark-mode')
	}

</script>

<main>
	{#if simulation_started}
		<Simulator class="center" bind:this={simulator} power={!isNaN(power) ? power : 0} settings={getSettings()} />
		{#if getSettings().debugMode}
			<div id="power_debug_div">
				<label id="power_debug_label" for="power_debug">Power Debug Slider: </label>
				<input class="slider" id="power_debug" type="range" min="0" max="1000" bind:value={power}>
			</div>
		{/if}
		<span class="top-right-fixed" on:click={exitSimulation}><Icon class="top-right-fixed" data={close} scale="2"/></span>
	{:else}
		<Welcome on:message={startSimulation}/>
	{/if}
</main>

<style>
	main {
		text-align: center;
		position: absolute;
		margin: 0;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		overflow: hidden;
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
		-webkit-appearance: none;  /* Override default CSS styles */
		appearance: none;
		width: 100%; /* Full-width */
		height: 15px; /* Specified height */
		background: #d3d3d3; /* Grey background */
		outline: none; /* Remove outline */
		opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
		-webkit-transition: .2s; /* 0.2 seconds transition on hover */
		transition: opacity .2s;
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

	.center {
		position: absolute;
		display: flex;
		justify-content: center;
		/*todo: non sono buono con i css, va centrato*/
	}

	.top-right-fixed {
		margin-top: 5px;
		margin-right: 5px;
		position:absolute;
		top:0;
		right:0;
	}
	:global(body) {
		background-color: #f2eee2;
		color: #0084f6;
		transition: background-color 0.3s
	}
	:global(body.dark-mode) {
		background-color: #1d3040;
		color: #bfc2c7;
	}
</style>
