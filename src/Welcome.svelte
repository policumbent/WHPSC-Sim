<script lang="ts">
    import Icon from 'svelte-awesome';
    import { gear } from 'svelte-awesome/icons';

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function startMessage() {
        dispatch('message', {
            text: 'start'
        });
    }
</script>
<section>
    <h1>Taurus Simulator</h1>
    <span class="top-right-fixed"><Icon class="top-right-fixed" data={gear} scale="2"/></span>
    <div id="buttons_div">
        <button class="btn" on:click={startMessage}>Start</button>
<!--        <button class="btn" on:click={simulator.reset()}>Reset</button>-->
    </div>
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
    #buttons_div {
        position: absolute;
        margin: 0 auto;
        width: 90%;
    }

    .btn {
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
