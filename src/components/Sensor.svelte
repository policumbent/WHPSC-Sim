<script lang="ts">
    export let sensorId: number;
</script>

<style>
    .container {
        display: inline-block;
        position: relative;
        width: 250px;
        height: 100px;
        /*background: #1d3040;*/
        margin: 5px;
        cursor: pointer;

        /*padding: 0.5em;*/
        border-radius: 15px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.3);
        transition: 0.3s;
    }

    .image {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 40px;
        width: 40px;
        height: 40px;
        filter: invert(36%) sepia(95%) saturate(1770%) hue-rotate(188deg) brightness(94%) contrast(108%);
        /*object-fit: cover; !* Do not scale the image *!*/
        object-position: center; /* Center the image within the element */
        /*position: relative;*/
        /*overflow: hidden;*/
        /*border-radius: 100%;*/
    }
    .trash {
        filter: invert(29%) sepia(59%) saturate(2930%) hue-rotate(359deg) brightness(103%) contrast(111%);
    }
    span {
        width: 50%;
        position: absolute;
        text-align: left;
        left: 40px;
        top: 50%;
        transform: translateY(-50%);
    }
    .detach {
        left: 50%;
        transform: translateX(-50%);
        color: #ff3e00;
        font-weight: bold;
        letter-spacing: 2px;
    }
    em {
        font-weight: bold;
        letter-spacing: 2px;
        font-size: 1.1em;
    }
    .space {
        margin-right: 15px;
    }
</style>

<div>
    <div class="container" on:click>
        {#if sensorId !== -1}
            <span>Sensor id:<em class="space"></em><em>{sensorId}</em></span>
            <img class="image" src="img/power.svg" alt="" />
        {:else}
            <span class="detach">Detach</span>
            <img class="trash image" src="img/trash.svg" alt="" />
        {/if}
    </div>

</div>
