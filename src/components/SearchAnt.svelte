<script lang="ts">
    import {createEventDispatcher, getContext, onDestroy, onMount} from "svelte";
    import {startSearch, stopSearch, attachSensor, sensorConnected} from "../Ant"
    import { getSensorsList } from "../store"
    import { SyncLoader } from 'svelte-loading-spinners'
    import Sensor from "./Sensor.svelte";
    const { close } = getContext('simple-modal');
    let sensors = [];
    let interval;
    function getData(){
        sensors = getSensorsList();
    }
    onMount(() => {
        startSearch();
        interval = setInterval(getData, 1000);
    });
    onDestroy(() => {
        stopSearch();
        clearInterval(interval);
    });
    function sensorChosen(sensorId: number) {
        attachSensor(sensorId);
        close();
    }
</script>

<style>

    .scroller {
        scroll-behavior: smooth;
        overflow-x: hidden;
        overflow-y: auto;
        height: 50vh;
        /*margin: 0 10% 3em;*/
    }
    h1 {
        font-size: 3em;
        margin-bottom: 0.5em;
    }

    .content {
        width: 100%; /* Could be more or less, depending on screen size */
    }
    .loading {
        display: inline-block;
        margin: 2em;
    }
    .cursor_pointer {
        cursor: pointer;
    }
</style>

<div>
    <h1>Search ANT sensors</h1>

    <div class="content">
        {#if sensorConnected()}
            <Sensor on:click={() => sensorChosen(0)} sensorId={-1}/>
        {/if}
        {#each sensors as sensor}
            <Sensor class="cursor_pointer" on:click={() => sensorChosen(sensor)} sensorId={sensor}/>
        {/each}
        {#if sensors.length === 0}
            <div class="loading">
                <SyncLoader size="60" color="#FF3E00" unit="px"/>
            </div>
        {/if}
    </div>
    <!--    <label class="">Pick your bike</label>-->
</div>
