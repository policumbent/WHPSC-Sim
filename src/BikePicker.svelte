<script lang="ts">
    import BikeComponent from "./BikeComponent.svelte";
    import {Bike} from "./Bike";
    import {createEventDispatcher, onMount} from "svelte";
    import {Settings} from "./Settings";
    const dispatch = createEventDispatcher();
    const s = new Settings(30,50,0.06,0.254,0.95,0.50,1.01, 0.45,true);

    let bikes: Bike[] = [
        new Bike('Taurus', 'img/taurus.svg', 'A very fast bike', s),
        new Bike('Pulsar', 'img/pulsar.svg', 'A fast bike', s),
        new Bike('Taurus', 'img/pulse.svg', 'A very slow bike', s),
        new Bike('Strike', 'img/strike.svg', 'A very trike', s),
        new Bike('Coral', 'img/bici.svg', 'A recumbent bike', s),
        new Bike('Bike', 'img/normal.svg', 'A normal bike', s),
        new Bike('Mtb', 'img/mtb.svg', 'A slow bike', s)
    ]

    function shuffle(array) {
        // https://bost.ocks.org/mike/shuffle/
        let copy = [], n = array.length, i;
        // While there remain elements to shuffle…
        while (n) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * array.length);
            // If not already shuffled, move it to the new array.
            if (i in array) {
                copy.push(array[i]);
                delete array[i];
                n--;
            }
        }
        return copy;
    }
    function bikeChosen(bike: Bike){
        console.log(bike);
        dispatch('message', {text: bike})
    }
    onMount(async () => bikes = shuffle(bikes))
</script>

<div class="back">
    <div class="content">
        {#each bikes as bike}
            <BikeComponent on:click={() => bikeChosen(bike)} bike={bike}/>
        {/each}
    </div>
</div>

<style>
    .content {
        position: absolute;
        background-color: #FFFFFF;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        overflow-x: auto;
        white-space: nowrap;
        /*padding: 20px;*/
        height: 230px;
        border: 1px solid #888;
        width: 100%; /* Could be more or less, depending on screen size */
    }

    .back {
        /*display: none; !* Hidden by default *!*/
        position: absolute; /* Stay in place */
        z-index: 1; /* Sit on top */
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%; /* Full width */
        height: 100%; /* Full height */
        background-color: rgb(0,0,0); /* Fallback color */
        background-color: rgba(0,0,0,0.7); /* Black w/ opacity */
    }

    /* The Close Button */
    .close {
        color: #aaa;
        float: right;
        /*margin-top: 10px;*/
        margin-right: 10px;
        font-size: 3em;
        font-weight: bold;
    }

    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }


    ::-webkit-scrollbar-track
    {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        background-color: #F5F5F5;
    }

    ::-webkit-scrollbar
    {
        width: 10px;
        background-color: #F5F5F5;
    }

    ::-webkit-scrollbar-thumb
    {
        background-color: #ff3e00;
        background-image: -webkit-linear-gradient(45deg,
        rgba(255, 255, 255, .2) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, .2) 50%,
        rgba(255, 255, 255, .2) 75%,
        transparent 75%,
        transparent)
    }




</style>
