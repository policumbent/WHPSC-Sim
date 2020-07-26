<script lang="ts">
	import Simulator from "./Simulator.svelte";
	import {Settings} from "./Settings"
	export let name: string;
	let setting = new Settings(30, 50, 0.06, 1.450, 0.95, 0.50, 1.01)

</script>

<main>
	<h1>Hello {name}!</h1>
	<Simulator settings={setting} height="480"/>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
