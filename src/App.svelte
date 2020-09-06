<script lang="ts">
	import Simulator from "./Simulator.svelte";
	import ResultModal from './ResultContent.svelte';
	import {BikeSettings} from "./models/BikeSettings";
	import {hrValue, powerValue} from "./store.js"
	import Welcome from "./Welcome.svelte";
	import Icon from 'svelte-awesome';
	import {close} from 'svelte-awesome/icons';
	import Modal from 'svelte-simple-modal';
	import ResultContainer from "./ResultContainer.svelte";
	import {getContext} from 'svelte';
	import BikePicker from "./BikePicker.svelte";
	import {Bike} from "./models/Bike";
	import {getDebug, getUserSettings} from "./store";

	let power = 0;
	let simulator;
	let simulation_started = false;
	let openModal;
	let bike: Bike;

	// todo: fare la unsubscribe quando onDestroy
	// todo: uso la fc al posto della potenza per il primo test
	// const hrUnsubscribe = hrValue.subscribe(value => power = value);
	const powerUnsubscribe = powerValue.subscribe(value => power = value);

	// right click disabled
	document.addEventListener('contextmenu', event => event.preventDefault());
	document.addEventListener('fullscreenchange', event => document.fullscreenElement === null ? exitSimulation() : event);

	function startSimulation(event) {
		bike = event.detail.text;
		document.documentElement.requestFullscreen()
				.then(() => {
					simulation_started = true;
					window.document.body.classList.toggle('dark-mode');
					console.log(getWidth());
				})
				.catch(err => console.log(err));
	}

	function exitSimulation() {
		simulation_started = false;
		window.document.body.classList.toggle('dark-mode');
	}

	function exitFullscreen() {
		document.exitFullscreen();
	}

	function getWidth() {
		if (window.screen.width / 1.666666 > window.screen.height)
			return window.screen.height * 1.666666;
		return window.screen.width;
	}

	function handleResult(event) {
		console.log(event.detail.text);
		if (event.detail.text !== undefined)
			exitFullscreen();
		console.log(event.detail.text);
		const speed = event.detail.text !== undefined ? event.detail.text : 141.0;
		console.log(speed);
		openModal(speed);
	}

</script>

<main>
	{#if simulation_started}
		<span class="top-right-fixed" on:click={exitFullscreen}><Icon class="top-right-fixed" data={close} scale="3"/></span>
		<Simulator
				bind:this={simulator}
				width={getWidth()}
				power={!isNaN(power) ? power : 0}
				on:message={handleResult}
				bikeSettings={bike.settings}
				userSettings={getUserSettings()}
		/>
	{:else}
		<Welcome on:message={startSimulation}/>
		{#if getDebug()}
			<div id="power_debug_div">
				<label id="power_debug_label" for="power_debug">Power Debug Slider: {power}W</label>
				<input class="slider" id="power_debug" type="range" min="0" max="1000" bind:value={power}>
			</div>
			<button on:click={handleResult}>Test save result dialog</button>
		{/if}
	{/if}
	<Modal>
		<ResultContainer bind:openModal={openModal}/>
	</Modal>
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

	/*.center {*/
	/*	position: absolute;*/
	/*	display: flex;*/
	/*	justify-content: center;*/
	/*	!*todo: non sono buono con i css, va centrato*!*/
	/*}*/

	.top-right-fixed {
		margin-top: 8px;
		margin-right: 8px;
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
