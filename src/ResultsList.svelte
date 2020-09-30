<script lang="ts">
  import { onMount } from "svelte";
  import ResultModel from "./models/Result";
  import { BikeSettings, UserSettings } from "./models/Settings";
  import ResultComponent from "./components/Result.svelte";

  const url = "https://www.policumbent.it/whpsc_sim_backend/results.php";
  const expand = (result: ResultModel) => {
    const expanded = result.expanded;
    results.forEach((r) => (r.expanded = false));
    result.expanded = !expanded;
    results = [...results];
  };
  const s = new BikeSettings(50, 0.44, 1450, 0.99, 1, 1, undefined);
  const u = new UserSettings(undefined, undefined, 1.01);
    let results: ResultModel[] = [
        new ResultModel(100, s, u, 'Taurus', 'Stefano Luigi', 'Loscalzo', undefined, '2020-09-06 20:27:04', true),
        new ResultModel(100, s, u, 'Mtb', 'Test', 'Test', undefined, '2020-09-06 20:27:04'),
        new ResultModel(100, s, u,'ParolaLunga', 'Test', 'Test', undefined, '2020-09-06 20:27:04'),
        new ResultModel(100, s, u, 'Pulsar', 'Parola lunghissimissima', 'Test lungoooooooooooo', undefined, '2020-09-06 20:27:04'),
        new ResultModel(100, s, u, 'Varna', 'Test', 'Test', undefined, '2020-09-06 20:27:04')
    ];

  onMount(() => {
    const myHeaders = new Headers();
    fetch(url, { cache: "no-store" })
      .then((resp) => resp.json())
      .then((data) => {
        let v: ResultModel[] = [];
        data.forEach((e) => {
          // todo: fix server
          const s = new BikeSettings(
            e.bikeSettings.bikeWeight,
            e.bikeSettings.wheelsInertia,
            e.bikeSettings.wheelsRadius,
            e.bikeSettings.efficiency,
            e.bikeSettings.area,
            e.bikeSettings.cx
          );
          const u = new UserSettings(undefined, undefined, e.bikeSettings.rho);
          v.push(
            new ResultModel(e.speed, s, u, e.bikeName, e.firstName, e.lastName, "", e.timestamp)
          );
        });
        // console.log(v);
        results = v.sort((e1: ResultModel, e2: ResultModel) => e2.datetime.getTime() - e1.datetime.getTime());
        return v;
      })
      .then((data) => {
        data[0].expanded = true;
        return data;
      })
      .then((data) => console.log(data));
  });
</script>

<style>
  h1 {
    font-size: 3em;
    margin-bottom: 0.5em;
  }
  .scroller {
      scroll-behavior: smooth;
      overflow-x: hidden;
      overflow-y: auto;
      height: 50vh;
      /*margin: 0 10% 3em;*/
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
  }

  ::-webkit-scrollbar {
    width: 10px;
    background-color: #f5f5f5;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ff3e00;
    background-image: -webkit-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
  }
</style>

<div class="container">
  <h1>Results</h1>
  <div class="scroller">
    {#each results as result}
      <ResultComponent on:click={() => expand(result)} {result} />
    {/each}
  </div>
</div>
<!--<button on:click={add}>Add</button>-->
