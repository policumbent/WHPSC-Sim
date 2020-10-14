<script lang="ts">
  import ResultModel from "../models/Result";

  export let result: ResultModel;
  let minSize = window.innerWidth < 550 ? '150px' : '100px';
  let maxSize = window.innerWidth < 550 ? '370px' : '350px';
  let width = window.innerWidth;
  window.onresize = setSize;
  let height = !result.expanded ? minSize : maxSize;
  function setSize() {
    minSize = window.innerWidth < 550 ? '150px' : '100px';
    maxSize = window.innerWidth < 550 ? '370px' : '350px';
    width = window.innerWidth;
    height = !result.expanded ? minSize : maxSize;
    // console.log(minSize);
  }
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
    background: #1d3040;
    margin: 10px 2%;
    height: var(--div-height);
    /*padding: 0.5em;*/
    border-radius: 15px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.3);
    transition: 0.3s;
  }
</style>

<div>
  <div class="container"
       on:click
       style="--div-height: {height}">
    <div class="left30">
      <span class="middle_top">
        <em class="big">{Math.trunc(result.speed)}</em>
        .{Math.round((result.speed - Math.trunc(result.speed)) * 100)} km/h
      </span>
      <span class="middle_bottom">{result.bikeName}</span>
    </div>
    <span class="top right">{result.firstName} {result.lastName}</span>
    {#if result.expanded}
      <table>
        <!--{#if width>550}-->
        <!--  <tr>-->
        <!--    <th>Bike Weight</th>-->
        <!--    <th>Wheels Inertia</th>-->
        <!--    <th>Wheels Circumference</th>-->
        <!--    <th>Efficiency</th>-->
        <!--    <th>Area</th>-->
        <!--    <th>Rho</th>-->
        <!--    <th>Cd@120km/h</th>-->
        <!--  </tr>-->
        <!--  <tr>-->
        <!--    <td>{result.bikeSettings.bikeWeight}kg</td>-->
        <!--    <td>{result.bikeSettings.wheelsInertia}J/s²</td>-->
        <!--    <td>{result.bikeSettings.wheelsCircumference}m</td>-->
        <!--    <td>{result.bikeSettings.efficiency}</td>-->
        <!--    <td>{result.bikeSettings.area}m²</td>-->
        <!--    <td>{result.userSettings.rho}kg/m³</td>-->
        <!--    <td>{result.bikeSettings.cx}</td>-->
        <!--  </tr>-->
        <!--{:else}-->
        <tr>
          <th>Bike Weight</th>
          <td>{result.bikeSettings.bikeWeight} kg</td>
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
          <th>Rho</th>
          <td>{result.userSettings.rho} kg/m³</td>
        </tr>
        <tr>
          <th>Cd@120km/h</th>
          <td>{result.bikeSettings.cx}</td>
        </tr>
        <tr>
          <th>Average Power</th>
          <td>{result.power} W</td>
        </tr>
        <!--{/if}-->
      </table>

    {/if}
    <span class="right bottom">{result.time} {result.date}</span>
  </div>
</div>
