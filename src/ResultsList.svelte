<script lang="ts">
  import { onMount } from "svelte";
  import ResultModel from "./models/Result";
  import { BikeSettings } from "./models/Bike";
  import ResultComponent from "./components/Result.svelte";

  const s = new BikeSettings(50, 0.44, 1450, 0.99, 1, 1, 1);
  let results: ResultModel[] = [
    new ResultModel(
      100,
      s,
      "Bici1",
      "Test",
      "Test",
      undefined,
      "2020-09-06 20:27:04",
      true
    ),
    new ResultModel(
      100,
      s,
      "Mtb",
      "Test",
      "Test",
      undefined,
      "2020-09-06 20:27:04"
    ),
    new ResultModel(
      100,
      s,
      "ParolaLunga",
      "Test",
      "Test",
      undefined,
      "2020-09-06 20:27:04"
    ),
    new ResultModel(
      100,
      s,
      "Pulsar",
      "Parola lunghissimissima",
      "Test lungoooooooooooo",
      undefined,
      "2020-09-06 20:27:04"
    ),
    new ResultModel(
      100,
      s,
      "Varna",
      "Test",
      "Test",
      undefined,
      "2020-09-06 20:27:04"
    ),
  ];
  const url = "https://www.policumbent.it/whpsc_sim_backend/results.php";
  const expand = (result: ResultModel) => {
    const expanded = result.expanded;
    results.forEach((r) => (r.expanded = false));
    result.expanded = !expanded;
    results = [...results];
  };

  onMount(() => {
    const myHeaders = new Headers();
    fetch(url, { cache: "no-store" })
      .then((resp) => resp.json())
      .then((data) => {
        let v: ResultModel[] = [];
        data.forEach((e) => {
          const s = new BikeSettings(
            e.bikeSettings.bikeWeight,
            e.bikeSettings.wheelsInertia,
            e.bikeSettings.wheelsRadius,
            e.bikeSettings.efficiency,
            e.bikeSettings.area,
            e.bikeSettings.rho,
            e.bikeSettings.cx
          );
          v.push(
            new ResultModel(
              e.speed,
              s,
              e.bikeName,
              e.firstName,
              e.lastName,
              "",
              e.timestamp
            )
          );
        });
        // console.log(v);
        results = v.sort((e1: any, e2: any) => e2.datetime - e1.datetime);
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
    margin: 0 10% 3em;
    height: 50vh;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
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
