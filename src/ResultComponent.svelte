<script lang="ts">
    import ResultModel from "./models/Result";

    export let result: ResultModel;
</script>

<style>
    table {
        position: absolute;
        top: 45%;
        width: 90%;
        margin-left: 5%;
        margin-right: 5%;
        color: white;
        font-weight: lighter;
    }
    th {
        font-weight: normal;
    }
    .left30{
        position: relative;
        width: 45%;
        height: 100%;
        text-align: center;
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
        bottom: 0;
        text-transform: uppercase;
        color: white;
    }
    .big {
        font-size: 4em;
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
        top: 15%;
        -webkit-transform: translateY(-15%);
        transform: translateY(-15%);
        font-size: 1.1em;
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
        background: #1d3040;
        margin: 10px 2%;
        padding: 0.5em;
        border-radius: 15px;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.3);
        transition: 0.3s;
    }

</style>

<div>
    <div class="container" on:click style="height: {!result.expanded? '100px': '200px'}">
        <div class="left30">
            <span class="left middle_top"><em class="big">{Math.round(result.speed)}</em>
                .{Math.round((result.speed-Math.round(result.speed))*100)} km/h</span>
            <span class="left middle_bottom">{result.bikeName}</span>
        </div>
        <span class="top right">{result.firstName} {result.lastName}</span>
        {#if result.expanded}
            <table>
                <tr>
                    <th>Bike Weight</th>
                    <th>Wheels Inertia</th>
                    <th>Wheels Radius</th>
                    <th>Efficiency</th>
                    <th>Area</th>
                    <th>Rho</th>
                    <th>Cx</th>
                </tr>
                <tr>
                    <td>{result.bikeSettings.bikeWeight}kg</td>
                    <td>{result.bikeSettings.wheelsInertia}</td>
                    <td>{result.bikeSettings.wheelsCircumference}cm</td>
                    <td>{result.bikeSettings.efficiency}</td>
                    <td>{result.bikeSettings.area}m²</td>
                    <td>{result.userSettings.rho}</td>
                    <td>{result.bikeSettings.cx}</td>
                </tr>

            </table>
        {/if}
        <span class="right bottom">{result.time} {result.date}</span>
    </div>
</div>
