<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  import type { BikeSettings, UserSettings } from "./models/Settings";

  export let bikeSettings: BikeSettings;
  export let userSettings: UserSettings;
  let width: number = 480;
  export let power: number = 0;

  const dispatch = createEventDispatcher();
  let buffering = false;
  let powerCount = 0;
  let powerSum = 0;
  let speed: number = 0;
  let distance: number = 0;
  let time: number = 0;
  let playbackRate: number = 0;
  const g: number = 9.81;

  const trap_start: number = 8184;
  const trap_end: number = 8384;
  let trap_info: string;
  // t_video: elapsed time in the video (at original speed)
  let t_video = 0;
  let coefficients, slope, fitFile;
  let video;
  let started = false;
  let interval;
  let ended = false;
  let sum = 0;
  let count_speed = 0;
  let intro_count = 10;
  let intro_message = 'Loading...';

  async function start() {
    if (started) return;
    playbackRate = 0;
    await video.play();
    started = true;
  }

  export async function reset() {
    if (!started) return;
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

  function getWidth() {
    console.log('Window size');
    if (window.screen.width / 1.666666 > window.screen.height){
      console.log('1: ', window.screen.height * 1.666666);
      width = window.screen.height * 1.666666;
    }else {
      console.log('2: ', window.screen.width);
      width = window.screen.width;
    }
    document.getElementsByClassName("relative")
            .item(0)
            .setAttribute("style", "width:" + width + "px");
  }

  onMount(async () => {
    getWidth();
    window.onresize = getWidth;
    let res = await fetch("data/" + bikeSettings.coefficientsFile);
    coefficients = await res.json();
    res = await fetch("data/slope.txt");
    const slopeFile = await res.text();
    slope = await slopeFile.split("\n");
    res = await fetch("data/19-09-19-am-gallo_t2.json");
    fitFile = await res.json();
    video.onwaiting = () => {
      console.log("WAITING");
      buffering = true;
      clearInterval(interval);
    }
    video.onplaying = () => {
      console.log("PLAYING");
      buffering = false;
      interval = setInterval(intervalFunction, 1000);
    }
    video.preload = true;
    ended = false;
    await intervalCountdown()
    intro_count = 10;
    interval = setInterval(intervalCountdown, 1000);
    // console.log(document.getElementsByClassName("relative").length);
  });

  onDestroy(() => {
    clearInterval(interval);
    window.onresize = null;
  });

  async function intervalCountdown() {
    switch (intro_count) {
      case 11:
      case 10:
      case 9:
        intro_message = 'The length of the track is 5mi (about 8 km)!'
        break;
      case 8:
      case 7:
      case 6:
        intro_message = 'Into the last 200m we will measure your average speed!'
        break;
      case 5:
      case 4:
      case 3:
      case 2:
        intro_message = 'You can evaluate the distance to the end reading road signs on the right.'
        break;
      case 1:
      case 0:
        intro_message = 'Good luck!'
        break;
    }
    if(--intro_count === 0){
      clearInterval(interval);
      await start();
    }
  }

  function intervalFunction() {
    if (power > 5000 || power < 0) {
      alert("Not valid number!!");
      speed = 0;
      clearInterval(interval);
    }
    changeVideoSpeed(distance, 1, speed);
    const slope = slopeCalculator(speed, 1, distance);
    const powerOrBrake = brakeCalculator(distance, speed, power)
    speed = nextValue(speed, powerOrBrake, 1, slope);
    console.log(speed);
    time++;
    distance += speed / 3.6;
  }

  function brakeCalculator(distance: number, speed: number, power: number) {
    if(distance > trap_end + 200){
      if(distance < trap_end + 1000 && speed > 60)
        return -speed*20;
      else if(distance >= trap_end + 1000 && speed > 35)
        return -speed*50;
    }
    return power;
  }

  function changeVideoSpeed(d0: number, t: number, vs: number) {
    let s = 0;
    while (fitFile[s]["sec"] < t_video && s < 581) s++;
    if (s === 581) {
      playbackRate = 0;
      // send message with result to outer component
      dispatch("message", {
        text: {
          speed: Math.round((sum * 100) / count_speed) / 100,
          power: powerSum/powerCount
        },
      });
      ended = true;
      clearInterval(interval);
      return;
    }
    let vr = fitFile[s]["kph"];
    playbackRate = vs / vr;
    if (playbackRate !== 0 && (playbackRate < 0.0625 || playbackRate > 16.0)) {
      alert(
              "Sorry but the speed is too low or too high, the activity will be restarted."
      );
      reset();
    }
    t_video += playbackRate * t;
  }

  function slopeCalculator(v0: number, t: number, d0: number) {
    return 0;
    v0 = v0 / 3.6;
    // calcolo la pendenza media nella discorsa percorsa nel tempo t
    let d1 = Math.round(v0 * t + d0);
    d0 = Math.round(d0);
    let s = 0;
    for (let i = d0; i < d1; i++)
      s += i < slope.length - 1 ? parseFloat(slope[i]) : 0;
    return d1 !== d0 ? -s / (d1 - d0) : 0;
  }

  function nextValue(v0: number, power: number, t: number, slope: number) {
    v0 = v0/3.6;
    const i = v0>40 ? 400 : Math.round(v0*10);
    const cr = coefficients[i]['cr'];
    const cx = coefficients[i]['cx']*bikeSettings.cx;
    const e_k0 = 0.5 * (bikeSettings.bikeWeight+userSettings.riderWeight) * Math.pow(v0, 2);
    const e_kr0 = 0.5 * bikeSettings.wheelsInertia * Math.pow(v0, 2)/Math.pow(bikeSettings.wheelsRadius, 2);
    const e_w = bikeSettings.efficiency * t * power;
    const ascent = -slope * v0 * t;
    const e_u = (bikeSettings.bikeWeight+userSettings.riderWeight) * g * ascent;
    const a_r = cr * (bikeSettings.bikeWeight+userSettings.riderWeight) * g * t * v0;
    const a_a = 0.5 * userSettings.rho * cx * bikeSettings.area * Math.pow(v0, 3) * t;
    const v = 3.6*Math.pow(2*(e_k0+e_kr0+e_w+e_u-a_a-a_r)
            /((bikeSettings.bikeWeight+userSettings.riderWeight)
                    +bikeSettings.wheelsInertia/Math.pow(bikeSettings.wheelsRadius, 2)), 1/2);
    return v > 0 ? v: 0
  }

  // azioni che compio quando gli stati vengono aggiornati
  $: {
    if (distance < 1)
      time = 0;
    if (distance > 1 && distance<trap_end){
      powerCount++;
      powerSum += power;
      // console.log('Average power: ', powerCount !== 0 ? powerSum/powerCount : 0)
    }
    if (distance > trap_start - 1609 && distance < trap_start)
      trap_info = `Distance to GO ${Math.round(trap_start - distance)}m`;
    else if (distance >= trap_start && distance <= trap_end) {
      trap_info = `Distance to END ${Math.round(trap_end - distance)}m`;
      sum += speed;
      count_speed++;
      console.log(sum, '', count_speed);
    }
    else if (distance>trap_end) {
      // without it we can increase suspense, evaluate if write it or not
      // trap_info = `⚡ ${Math.round(sum * 100 / count_speed) / 100} km/h ⚡`;
      trap_info = `Slow down before catching! 😁🎳`;
    }
    else {
      trap_info = "";
      count_speed = 0;
      sum = 0;
    }
  }
</script>

<style>
  div.overlay {
    position: absolute;
    font-size: 4vw;
    background-color: rgba(221, 221, 221, 0);
    width: 40vw;
    padding: 10px 0;
    z-index: 99;
  }
  div.top_left {
    top: 10px;
    left: 20px;
    color: #000;
    text-align: left;
  }
  div.center {
    top: 11vw;
    margin: 0 auto;
    font-size: 3vw;
    width: 100%;
    color: #000;
    text-align: center;
  }
  div.center2 {
    top: 15vh;
    margin: 0 auto;
    font-size: 3vw;
    width: 100%;
    color: #000;
    text-align: center;
  }
  div.bottom_left {
    bottom: 10px;
    left: 20px;
    color: #fff;
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
    color: #fff;
    text-align: right;
  }

  div.relative {
    position: relative;
    /*margin-top: 4em;*/
    margin-left: auto;
    margin-right: auto;
    /*width: 800px;*/
    /*height: 480px;*/
  }

  /* div.border {
    border: 3px solid #0084f6;
  } */
  h2 {
    padding-top: 190px;
    vertical-align: middle;
    font-size: 4vw;
  }
  video {
    z-index: 1;
  }
  section{
    max-height: 100vh;
    max-width: 100vw;
    overflow: hidden;
  }

  #start_message {
    color: white;
    font-size: 5vw;
  }
  #countdown {
    top: 30vw;
    color: white;
    font-size: 8vw;
  }

  /* #video_div {
    position: relative;
  } */
</style>

<section>
  {#if !ended}
    <div class="relative">
      <video
              bind:this={video}
              bind:playbackRate
              {width}
              height={width / 1.666666666}
              muted>
        <source src="data/bm-13-09-19_no_scritte.mp4" type="video/mp4" />
        Your browser does not support video.
      </video>
      <audio src=""></audio>
      <div class="overlay bottom_left">
        Speed: {Math.round(speed * 10) / 10} km/h
      </div>
      <div class="overlay bottom_right">Power: {power} W</div>
      <div class="overlay center">{trap_info}</div>
      {#if distance<1}
        <div id="start_message" class="overlay center">{intro_message}</div>
        <div id="countdown" class="overlay center">{intro_count > 0 ? intro_count : 'Start pedaling!!'}</div>
      {/if}
      {#if buffering}
        <div class="overlay center2">Slow internet connection!</div>
      {/if}
      <div class="overlay top_left">
        Time: {Math.trunc(time / 60) > 0 ? Math.trunc(time / 60) + "'" : ''} {Math.round(time % 60) + '"'}
      </div>
      <div class="overlay top_right">
        Distance: {Math.round(distance / 10) / 100} km
      </div>
    </div>
  {:else}
    <div class="relative">
      <h2>{trap_info}</h2>
    </div>
  {/if}
</section>
