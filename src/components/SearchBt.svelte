<script lang="ts">
    import {createEventDispatcher, getContext, onDestroy, onMount} from "svelte";
    import { clearBtSensorName, getBtSensorName } from "../store"
    import { SyncLoader } from 'svelte-loading-spinners'
    import Sensor from "./Sensor.svelte";
    const { close } = getContext('simple-modal');
    let sensorName: string;
    let interval;
    function getData(){
        sensorName = getBtSensorName();
    }
    onMount(() => {
        clearBtSensorName();
        interval = setInterval(getData, 500);
    });
    onDestroy(() => {
        clearInterval(interval);
    });
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

    .content {
        width: 100%; /* Could be more or less, depending on screen size */
    }
    .loading {
        display: inline-block;
        margin: 2em;
    }
    .btn {
        /*display: block;*/
        pointer-events: auto;
        cursor: pointer;
        text-align: center;
        background-color: #ff532e;
        color: #ffffff;
        border: #ffffff;
        text-transform: uppercase;
        font-weight: 300;
        padding: 0.5em 1em;
        margin: 1em auto;
    }
    .no_click {
        cursor: default;
    }
</style>

<div>
    <h1>Search BT sensor</h1>

    <div class="content">
        {#if sensorName !== undefined}
            <Sensor class="no_click" bt={true} sensorId={sensorName}/>
            <button on:click={() => close()} class="btn">Close</button>
        {:else}
            <div class="loading">
                <SyncLoader size="60" color="#FF3E00" unit="px"/>
            </div>
        {/if}
    </div>
    <!--    <label class="">Pick your bike</label>-->
</div>
