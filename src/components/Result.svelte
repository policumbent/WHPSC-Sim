<script lang="ts">
    import ResultModel from "../models/Result";
    import {onMount} from "svelte";
    export let result: ResultModel;
    let background_text = '';
    let minSize = window.innerWidth < 550 ? '150px' : '100px';
    let maxSize = window.innerWidth < 550 ? '430px' : '420px';
    let width = window.innerWidth;
    window.onresize = setSize;
    let height = !result.expanded ? minSize : maxSize;
    function setSize() {
        minSize = window.innerWidth < 550 ? '150px' : '100px';
        maxSize = window.innerWidth < 550 ? '430px' : '420px';
        width = window.innerWidth;
        height = !result.expanded ? minSize : maxSize;
        // console.log(minSize);
    }
    function isEventRes() {
        const event_start = new Date(Date.UTC(2020, 9, 25, 13, 0, 0));
        const event_end = new Date(Date.UTC(2020, 10, 1, 19, 0, 0));
        console.log(result.datetime, (result.datetime > event_start && result.datetime < event_end))
        return (result.datetime > event_start && result.datetime < event_end);
    }
    function fillBackground()
    {
        let text = '';
        let v = ['Virtual', 'WHPSC', '2020']
        for (let k=0; k<100; k++){
            for(let i=0; i<20; i++)
                text += v[(i+k)%3] + ' ';
            text += '<br>'
        }
        background_text = text;
    }
    onMount( () => fillBackground())
    $: height = !result.expanded ? minSize : maxSize;
    // $: console.log('H:', height);

</script>

<style>

    @media only screen and (max-width: 550px) {
        /* styles for mobile browsers smaller than 480px; (iPhone) */
        .left30 {
            position: absolute;
            width: 100%;
            height: 100%;
            text-align: center;
            /*background-color: #3399ff;*/
        }
        .middle_top {
            position: absolute;
            font-size: 0.7em;
            font-weight: bold;
            top: 50px;
            color: gold;
            left: 0.5em;
            width: 100%;
        }
        .right {
            position: absolute;
            text-align: center;
            left: 0;
            /*right: 1.5em;*/
            color: white;
            text-transform: uppercase;
            /*font-weight: 300;*/
            letter-spacing: 2px;
            width: 100%;
        }
        .top {
            top: 1em;
            font-size: 1.1em;
        }

        .middle_bottom {
            /*position: absolute;*/
            position: absolute;
            width: 100%;
            /*height: 100%;*/
            transform: translateX(-50%);
            /*margin-left: -2.5em;*/
            bottom: 1.5em;
            text-transform: uppercase;
            color: white;
        }
    }
    @media only screen and (min-width: 550px) {
        /* styles for browsers larger than 960px; */
        .left30 {
            position: relative;
            width: 45%;
            height: 100%;
            text-align: center;
        }
        .right {
            position: absolute;
            text-align: right;
            right: 1.5em;
            color: white;
            text-transform: uppercase;
            /*font-weight: 300;*/
            letter-spacing: 2px;
            width: 55%;
        }
        .top {
            top: calc(15% + 10px);
            -webkit-transform: translateY(-15%);
            transform: translateY(-15%);
            font-size: 1.1em;
        }
        .middle_top {
            position: absolute;
            top: 5%;
            -webkit-transform: translateY(-5%);
            transform: translateY(-5%);
            font-weight: bold;
            color: gold;
            left: 0.5em;
        }

        .middle_bottom {
            position: absolute;
            /*margin-left: -2.5em;*/
            left: 30%;
            -webkit-transform: translateX(-30%);
            transform: translateX(-30%);
            bottom: 0.5em;
            text-transform: uppercase;
            color: white;
        }

    }
    .mph {
        display: block;
        font-weight: lighter;
        color: gold;
    }
    .big {
        font-size: 4em;
    }

    table {
        position: absolute;
        top: calc(60px + 15%);
        width: 90%;
        text-align: left;
        margin-left: 5%;
        margin-right: 5%;
        color: white;
        font-weight: lighter;
    }
    th {
        font-weight: normal;
    }



    .bottom {
        position: absolute;
        bottom: 0.5em;
        font-size: 0.9em;
        font-weight: 300;
    }
    .container {
        cursor: pointer;
        position: relative;
        border: 1px solid black;
        overflow: hidden;
        background: #1d3040;
        /*background-image: repeating-linear-gradient(transparent, transparent 50px, purple 50px, purple 53px, transparent 53px, transparent 63px, purple 63px, purple 66px, transparent 66px, transparent 116px, rgba(0,0,0,.5) 116px, rgba(0,0,0,.5) 166px, rgba(255,255,255,.2) 166px, rgba(255,255,255,.2) 169px, rgba(0,0,0,.5) 169px, rgba(0,0,0,.5) 179px, rgba(255,255,255,.2) 179px, rgba(255,255,255,.2) 182px, rgba(0,0,0,.5) 182px, rgba(0,0,0,.5) 232px, transparent 232px),*/
        /*repeating-linear-gradient(270deg, transparent, transparent 50px, purple 50px, purple 53px, transparent 53px, transparent 63px, purple 63px, purple 66px, transparent 66px, transparent 116px, rgba(0,0,0,.5) 116px, rgba(0,0,0,.5) 166px, rgba(255,255,255,.2) 166px, rgba(255,255,255,.2) 169px, rgba(0,0,0,.5) 169px, rgba(0,0,0,.5) 179px, rgba(255,255,255,.2) 179px, rgba(255,255,255,.2) 182px, rgba(0,0,0,.5) 182px, rgba(0,0,0,.5) 232px, transparent 232px);*/

        margin: 10px 2%;
        height: var(--div-height);
        /*padding: 0.5em;*/
        border-radius: 15px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.3);
        transition: 0.3s;
    }
    .v_whpsc {
        overflow: hidden;
        position: absolute;
        font-size: 0.8em;
        white-space: nowrap;
        text-transform: uppercase;
        font-family: Arial, sans-serif;
        color: rgba(45, 76, 104, 0.8);
        text-align: justify;
    }
</style>

<div>
    <div class="container"
         on:click
         style="--div-height: {height}">
        {#if isEventRes()}
            <div class="v_whpsc">{@html background_text}</div>
        {/if}
        <div class="left30">
            <div class="middle_top">
                <span>
                <em class="big">{Math.trunc(result.speed)}</em>
                .{Math.round((result.speed - Math.trunc(result.speed)) * 100)} km/h
                </span>
                {#if result.expanded}
                    <span class="mph">({Math.round(result.speed*0.62137119223733*100)/100}mph)</span>
                {/if}
            </div>

            <span class="middle_bottom">{result.bikeName}</span>
        </div>
        <span class="top right">{result.firstName} {result.lastName}</span>
        {#if result.expanded}
            <table>

                <tr>
                    <th>Bike Weight</th>
                    <td>{result.bikeSettings.bikeWeight} kg</td>
                </tr>
                <tr>
                    <th>Wheels Inertia</th>
                    <td>{result.bikeSettings.wheelsInertia} Kg*m²</td>
                </tr>
                <tr>
                    <th>Wheels Circumference</th>
                    <td>{result.bikeSettings.wheelsCircumference} m</td>
                </tr>
                <tr>
                    <th>Efficiency</th>
                    <td>{result.bikeSettings.efficiency}</td>
                </tr>
                <tr>
                    <th>Front Area</th>
                    <td>{result.bikeSettings.area} m²</td>
                </tr>
                <tr>
                    <th>Altitude</th>
                    <td>{result.userSettings.altitude} m</td>
                </tr>
                <tr>
                    <th>Temperature</th>
                    <td>{result.userSettings.temperature} °C</td>
                </tr>
                <tr>
                    <th>Humidity</th>
                    <td>{result.userSettings.humidity} %</td>
                </tr>
                <tr>
                    <th>Cd@120km/h</th>
                    <td>{result.bikeSettings.cx}</td>
                </tr>
                <tr>
                    <th>Average Power</th>
                    <td>{Math.round(result.power)} W</td>
                </tr>
            </table>

        {/if}
        <span class="right bottom">{result.time} {result.date}</span>
    </div>
</div>
