<script lang="ts">
    import Icon from 'svelte-awesome';
    import {gear} from 'svelte-awesome/icons';

    import {createEventDispatcher} from 'svelte';
    import SettingsComponent from "./SettingsComponent.svelte";
    import {Settings} from "./Settings";

    const dispatch = createEventDispatcher();
    let sidebar_show = false;

    function startMessage() {
        dispatch('message', {
            text: 'start'
        });
    }

    function openSettings() {
        alert("Sono una persona pigra, le impostazioni al momento sono hard coded.")
    }

</script>
<SettingsComponent bind:show={sidebar_show}/>

<section>
    <h1>Taurus Simulator</h1>
    <span on:click={() => sidebar_show = !sidebar_show} class="top-right-fixed click_t"><Icon class="top-right-fixed" data={gear} scale="2"/></span>
    <button class="btn" on:click={startMessage}>Start</button>
</section>
<style>
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
        text-align: center;
        background-color: #ff532e;
        color: #FFFFFF;
        border: #FFFFFF;
        text-transform: uppercase;
        font-weight: 100;
        font-size: 2em;
        padding: 0.5em 1em;
        margin: 1em;
    }


    section {
        text-align: center;
    }
</style>
