<script lang="ts">
    import {ResultModel} from "./models/Result";

    export let result: ResultModel;
</script>

<div>
    <div class="container">
        <span class="left"><em class="big">{Math.round(result.speed)}</em>.{Math.round((result.speed-Math.round(result.speed))*100)} km/h</span>
        <span class="top right">{result.firstName} {result.lastName}</span>
        <span class="right bottom">{result.time} {result.date}</span>
    </div>
</div>

<style>
    .left {
        position: absolute;
        top: 50%;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        left: 0.5em;
        font-weight: bold;
        /*padding: 1em 1em;*/
        /*margin-left: 1em;*/
        color: gold;
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
        width: 45%;
    }
    .top {
        top: 0.5em;
        font-size: 1.1em;
    }
    .bottom {
        position: absolute;
        bottom: 0.5em;
        font-size: 0.9em;
        font-weight: 300;
    }
    .container {
        position: relative;
        border: 1px solid black;
        background: #1d3040;
        margin: 10px 2%;
        height: 4em;
        padding: 1em;
        border-radius: 15px;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.3);
        transition: 0.3s;
    }

</style>
