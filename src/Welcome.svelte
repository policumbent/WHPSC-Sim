<script lang="ts">
    import Icon from 'svelte-awesome';
    import {gear} from 'svelte-awesome/icons';

    import {createEventDispatcher} from 'svelte';
    import SettingsComponent from "./SettingsComponent.svelte";
    import {Settings} from "./Settings";
    import {btSearch} from "./bt/BleData.ts"

    const dispatch = createEventDispatcher();
    let sidebar_show = false;

    function startMessage() {
        dispatch('message', {
            text: 'start'
        });
    }

</script>
<SettingsComponent bind:show={sidebar_show}/>

<section>
    <h1>WHPSC Simulator</h1>
    <span on:click={() => sidebar_show = !sidebar_show} class="top-right-fixed click_t"><Icon class="top-right-fixed" data={gear} scale="2"/></span>
    <button class="btn" on:click={startMessage}>Start</button>
    <button class="btn" on:click={btSearch}>Search powermeter</button>
</section>
<style>
    /*todo: same size buttons*/
    h1 {
        margin-top: 2em;
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }
    .fill_all {
        height: 100%;
        width: 100%;
        overflow: hidden;
    }
    .top-right-fixed {
        margin-top: 5px;
        margin-right: 5px;
        position:absolute;
        top:0;
        right:0;
    }

    .btn {
        /*display: block;*/
        text-align: center;
        background-color: #ff532e;
        color: #FFFFFF;
        border: #FFFFFF;
        text-transform: uppercase;
        font-weight: 100;
        font-size: 2em;
        padding: 0.5em 1em;
        margin: 1em auto;
    }

    section {
        text-align: center;
    }
</style>
