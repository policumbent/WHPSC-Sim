<script>
    import {getContext} from "svelte";

    const { close } = getContext("simple-modal");

    function exitFullscreen() {
        document.exitFullscreen();
    }

</script>
<style>
    .btn {
        cursor: pointer;
        /*display: block;*/
        text-align: center;
        background-color: #ff532e;
        color: #ffffff;
        border: #ffffff;
        text-transform: uppercase;
        font-weight: 100;
        font-size: 1.5em;
        padding: 0.5em 1em;
        margin: 1em auto;
    }

    .blue {
        background-color: #3399ff;
    }
    p {
        color: white;
    }
    .container {
        display: block;
        position: relative;
        width: 100%;
        height: 100px;
    }

    .left50 {
        position: absolute;
        left: 0;
        top: 0;
        width: 50%;
       }
    .right50 {
        position: absolute;
        left: 50%;
        top: 0;
        width: 50%;
       }
</style>

<h1>Do you want exit simulation?</h1>
<div class="container">
    <div class="left50">
        <button on:click={close} class="blue btn">Cancel</button>
    </div>
    <div class="right50">
        <button on:click={exitFullscreen} class="btn">Exit</button>
    </div>
</div>
