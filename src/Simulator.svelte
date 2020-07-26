<script lang="ts">
    import { onMount } from 'svelte';
    import {Settings} from "./Settings";

    export let settings: Settings;
    export let height: number;
    let speed: number = 0;
    let power: number = 0;
    let distance: number = 0;
    let time: number = 0;
    const g: number = 9.81;
    // t_s: elapsed time in the video (at original speed)
    // let t_s = 0;
    let t_video = 0;
    let coefficients, slope, fitFile;

    onMount(async () =>{
        let res = await fetch('data/coefficients.json');
        coefficients = await res.json();
        res = await fetch('data/slope.txt');
        const slopeFile = await res.text();
        slope = await slopeFile.split("\r\n");
        res = await fetch('data/19-09-19-am-gallo_t2.json');
        fitFile = await res.json();
    })

    function startSimulation() {
        // todo: pensare a come gestire il tag video
        // video.playbackRate = 0;
        // video.play().then(r => setInterval(intervalFunction, 1000));
        // todo: pensare a come gestire il bottone
        // document.getElementById("start_button").innerText = "Aggiorna";
    }

    function intervalFunction() {
        if(power>5000 || power<0) {
            alert("Not valid number!!")
            speed=0;
            clearInterval(interval)
            // todo: pensare a come gestire il bottone
            // document.getElementById("start_button").hidden = false
        }
        changeVideoSpeed(distance, 1, speed)
        speed=3.6*nextValue(speed/3.6, power , 1, slopeCalculator(speed/3.6, 1, distance));
        time++;
        distance+=speed/3.6
    }

    function changeVideoSpeed(d0, t, vs) {
        let s=0
        while (fitFile[s]['sec']<t_video) s++;
        let vr = fitFile[s]['kph'];
        let y = vs/vr;
        t_video += y*t;
        // todo: aggiungere il cambio velocità al video
        // video.playbackRate = y
    }

    function slopeCalculator(v0, t, d0) {
        let d1 = Math.round(v0*t + d0)
        d0 = Math.round(d0);
        let d = 0;
        for(let i=d0; i<d1; i++)
            d += i < slope.length ? parseFloat(slope[i]) : 0
        return d1!==d0 ? -d/(d1-d0) : 0
    }

    function nextValue(v0, power, t, slope) {
        let i = v0>40 ? 400 : Math.round(v0*10);
        let cr = coefficients[i]['cr']
        let cx = coefficients[i]['cx']
        let e_k0 = 0.5 * settings.totalWeight * Math.pow(v0, 2);
        let e_kr0 = 0.5 * settings.wheelsInertia * Math.pow(v0, 2)/Math.pow(wheelsRadius, 2);
        let e_w = settings.efficiency * t * power;
        let ascent = -slope/100 * v0 * t;
        let e_u = settings.wheelsInertia * g * ascent;
        let a_r = cr * settings.totalWeight * g * t * v0;
        let a_a = 0.5 * settings.rho * cx * settings.area * Math.pow(v0, 3) * t;
        return Math.pow(2*(e_k0+e_kr0+e_w+e_u-a_a-a_r)
                /(settings.totalWeight+settings.wheelsInertia/Math.pow(settings.wheelsRadius, 2)), 1/2);
    }
</script>

<div class="relative">
    <video width={1.666666666*height} height={height} muted>
        <source src="data/bm-13-09-19_2.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
    <div class="overlay bottom_left">Speed: {Math.round(speed*100)/100 } km/h</div>
    <div class="overlay bottom_right">Power: {power} W</div>
    <div class="overlay top_left">Time: {time} s</div>
    <div class="overlay top_right">Distance: {Math.round(distance)} km</div>
</div>

<style>
    div.overlay {
        position: absolute;
        font-size: 35px;
        background-color: rgba(221, 221, 221, 0.0);
        width: 300px;
        padding: 10px 0;
        z-index: 2147483647;
    }
    div.top_left {
        top: 10px;
        left: 20px;
        color: #000;
        text-align: left;
    }
    div.bottom_left {
        bottom: 10px;
        left: 20px;
        color: #FFF;
        text-align: left;
    }
    div.top_right {
        top: 10px;
        right: 20px;
        color: #000;
        text-align: right;
    }

    div.bottom_right {
        bottom: 10px;
        right: 20px;
        color: #FFF;
        text-align: right;
    }

    div.relative {
        position: relative;
        width: 800px;
        height: 480px;
        border: 3px solid #73AD21;
    }
    video {
        z-index: 1;
    }
</style>
