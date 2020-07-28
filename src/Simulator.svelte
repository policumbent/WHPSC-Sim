<script lang="ts">
    import {onDestroy, onMount} from 'svelte';
    import {Settings} from "./Settings";
    let dgram = require('dgram');
    let s = dgram.createSocket('udp4');
    s.on('message', function(msg, rinfo) {
        console.log('I got this message: ' + msg.toString());
        power = parseInt(msg.toString());
    });
    s.bind(1336);

    export let settings: Settings;
    export let height: number = 480;
    export let power: number = 0;

    let speed: number = 0;
    let distance: number = 0;
    let time: number = 0;
    let playbackRate: number = 0;
    const g: number = 9.81;

    const trap_start: number = 8184;
    const trap_end: number = 8384;
    let trap_info;
    // t_video: elapsed time in the video (at original speed)
    let t_video = 0;
    let coefficients, slope, fitFile;
    let video;
    let started = false;
    let interval;

    let sum = 0;
    let count_speed = 0;


    async function start() {
        if(started)
            return;
        playbackRate = 0;
        await video.play()
        started = true;
        interval = setInterval(intervalFunction, 1000);
    }

    export async function reset() {
        if(!started)
            return;
        clearInterval(interval);
        playbackRate = 0;
        await video.pause();
        video.currentTime = 0;
        t_video = 0;
        time = 0;
        distance = 0;
        speed = 0;
        started = false;
    }

    onMount(async () =>{
        let res = await fetch('data/coefficients.json');
        coefficients = await res.json();
        res = await fetch('data/slope.txt');
        const slopeFile = await res.text();
        slope = await slopeFile.split("\r\n");
        res = await fetch('data/19-09-19-am-gallo_t2.json');
        fitFile = await res.json();
        await start();
    })

    onDestroy(() => {
        clearInterval(interval);
    });

    function intervalFunction() {
        if(power>5000 || power<0) {
            alert("Not valid number!!")
            speed=0;
            clearInterval(interval)
        }
        changeVideoSpeed(distance, 1, speed)
        speed=3.6*nextValue(speed/3.6, power , 1, slopeCalculator(speed/3.6, 1, distance));
        time++;
        distance+=speed/3.6
    }

    function changeVideoSpeed(d0, t, vs) {
        let s=0
        while (fitFile[s]['sec']<t_video && s<581) s++;
        if(s===581){
            playbackRate = 0;
            clearInterval(interval);
            return;
        }
        let vr = fitFile[s]['kph'];
        playbackRate = vs/vr;
        if(playbackRate!==0 && (playbackRate<0.0625 || playbackRate>16.0)){
            alert("Sorry but the speed is too low or too high, the activity will be restarted.")
            reset()
        }
        t_video += playbackRate*t;
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
        let e_kr0 = 0.5 * settings.wheelsInertia * Math.pow(v0, 2)/Math.pow(settings.wheelsRadius, 2);
        let e_w = settings.efficiency * t * power;
        let ascent = -slope/100 * v0 * t;
        let e_u = settings.wheelsInertia * g * ascent;
        let a_r = cr * settings.totalWeight * g * t * v0;
        let a_a = 0.5 * settings.rho * cx * settings.area * Math.pow(v0, 3) * t;
        return Math.pow(2*(e_k0+e_kr0+e_w+e_u-a_a-a_r)
                /(settings.totalWeight+settings.wheelsInertia/Math.pow(settings.wheelsRadius, 2)), 1/2);
    }
    $: {
        if(distance>(trap_start-1609) && distance<trap_start)
            trap_info = `Distance to GO ${Math.round(trap_start-distance)}m`;
        else if (distance>=trap_start && distance<=trap_end){
            trap_info = `Distance to END ${Math.round(trap_end-distance)}m`;
            sum += speed;
            count_speed++;
        }
        else if (distance>trap_end)
            trap_info = `⚡ ${Math.round(sum/count_speed)} km/h ⚡`;
        else {
            trap_info = "";
            count_speed = 0;
            sum = 0;
        }
    }

</script>
<section>
    <div class="relative">
        <video  bind:this={video}
                bind:playbackRate={playbackRate}
                width={1.666666666*height}
                height={height} muted>
            <source src="data/bm-13-09-19_no_scritte.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <div class="overlay bottom_left">Speed: {Math.round(speed*10)/10 } km/h</div>
        <div class="overlay bottom_right">Power: {power} W</div>
        <div class="overlay center">{trap_info}</div>
        <div class="overlay top_left">Time: {Math.trunc(time/60)>0 ? Math.trunc(time/60)+'\'': ''} {Math.round(time%60) + '"'}</div>
        <div class="overlay top_right">Distance: {Math.round(distance/10)/100} km</div>
    </div>
</section>
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
    div.center {
        top: 75px;
        margin: 0 auto;
        font-size: 25px;
        width: 800px;
        color: #000;
        text-align: center;
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
        margin-top: 4em;
        margin-left: auto;
        margin-right: auto;
        width: 800px;
        height: 480px;
        border: 3px solid #0084f6;
    }
    video {
        z-index: 1;
    }

</style>
