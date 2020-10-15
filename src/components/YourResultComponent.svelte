<script lang="ts">
    import ResultModel from "../models/Result";
    import {BikeSettings, UserSettings} from "../models/Settings";
    import { Email, Reddit, LinkedIn, Telegram, WhatsApp, Facebook, Twitter } from 'svelte-share-buttons-component';
    import {onMount} from "svelte";
    export let resultId;
    const server_url = "https://www.policumbent.it/whpsc_sim_backend/results.php";
    let result: ResultModel = new ResultModel(
        0,
        0,
        new BikeSettings(0, 0, 0, 0, 0, 0, undefined),
        new UserSettings(0, 0, 0, 0, 0),
        '',
        '',
        ''
    );
    const title = 'WHPSC Simulator Result';
    const desc = 'Watch my result on WHPSC Simulator';
    const url = window.location.href;
    function clearParams() {
        const params = new URLSearchParams();
        params.delete('res');
        window.history.replaceState({}, '', `${location.pathname}?${params}`);
        window.location.reload();
    }
    onMount(() => {
        fetch(server_url, { cache: "no-store" })
            .then((resp) => resp.json())
            .then((data) => {
                const d = data.find(e => e.id === resultId);
                if(d === undefined)
                    clearParams();
                const s = new BikeSettings(
                    d.bikeSettings.bikeWeight,
                    d.bikeSettings.wheelsInertia,
                    d.bikeSettings.wheelsCircumference,
                    d.bikeSettings.efficiency,
                    d.bikeSettings.area,
                    d.bikeSettings.cx,
                    undefined
                );
                const u = new UserSettings(undefined, undefined, d.bikeSettings.rho);
                result = new ResultModel(d.speed, d.power, s, u, d.bikeName, d.firstName, d.lastName, "", d.timestamp)
            });
        // .then((data) => console.log(data));
    });
</script>

<style>
    table {
        width: 300px;
        text-align: left;
        font-weight: lighter;
        margin: 2em auto; /* or margin: 0 auto 0 auto */
    }
    th {
        font-weight: normal;
    }
    td {
        text-align: right;
    }
    .middle_top {
        font-weight: bold;
        color: gold;
    }
    .bike_name {
        margin-top: 1em;
        display: block;
        text-transform: uppercase;
    }
    .big {
        font-size: 4em;
    }
    .top {
        top: 15%;
        -webkit-transform: translateY(-15%);
        transform: translateY(-15%);
        font-size: 1.1em;
    }
    .timestamp {
        font-size: 0.9em;
        font-weight: 300;
        text-transform: uppercase;
        letter-spacing: 2px;
    }
    .content {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%,-50%);
        width: 460px;
        max-width: 90%;
        height: 500px;
        border: 1px solid black;
        /*margin: 10px 2%;*/
        background-color: #1d3040;
        padding: 0.5em;
        border-radius: 15px;
        /*box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.3);*/
        box-shadow: 0 4px 8px 0 rgb(191, 194, 199);
        transition: 0.3s;
        z-index: 2;
    }
    .container {
        position: relative;
        background-color: #1d3040;
        color: #bfc2c7;
        width: 100vw;
        height: 100vh;
        vertical-align: middle;
        text-align: center;
    }
    h1, h2 {
        text-transform: uppercase;
        /*font-weight: 300;*/
        letter-spacing: 2px;
    }
    .title {
        z-index: 0;
        font-size: 2.2em;
        position: absolute;
        top: 7%;
        left: 50%;
        transform: translate(-50%, -10%);
    }

    .btn {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        margin-bottom: 2em;
        text-align: center;
        background-color: yellow;
        border: #ffffff;
        color: black;
        font-size: 1.2em;
        z-index: 99;
        text-transform: uppercase;
        font-weight: 200;
        padding: 0.5em 1em;
    }

</style>

<div>
    <div class="container">
        <h1 class="title">WHPSC Simulator</h1>
        <div class="content">
            <h1>{result.firstName} {result.lastName}</h1>
            <span class="middle_top"><em class="big">{Math.trunc(result.speed)}</em>
                .{Math.round((result.speed-Math.trunc(result.speed))*100)} km/h</span>
            <!--            <span class="top right">{result.firstName} {result.lastName}</span>-->
            <table>
                <tr>
                    <th>Bike Weight</th>
                    <td>{result.bikeSettings.bikeWeight}kg</td>
                </tr>
                <tr>
                    <th>Wheels Inertia</th>
                    <td>{result.bikeSettings.wheelsInertia} J/s²</td>
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
                    <th>Area</th>
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
            <span class="bike_name">{result.bikeName}</span>
            <span class="right timestamp">{result.time} {result.date}</span>
        </div>
        <button on:click="{clearParams}" class="btn">Go to WHPSC simulator</button>
        <div>
            <Email subject="{title}" body="{desc} {url}" />
            <Reddit class="share-button" {title} {url} />
            <LinkedIn class="share-button" {url} />
            <Telegram class="share-button" text={title} {url} />
            <WhatsApp class="share-button" text="{title} {url}" />
            <Facebook class="share-button" {url} />
            <Twitter class="share-button" text="{title}" {url} />
        </div>
    </div>
</div>
