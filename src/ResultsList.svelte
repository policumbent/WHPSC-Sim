<script lang="ts">
    import {onMount} from "svelte";
    import ResultModel from "./models/Result";
    import {BikeSettings, UserSettings} from "./models/Settings";
    import ResultComponent from "./components/Result.svelte";
    const url = 'SERVER_RESULTS_URL';
    const expand = (result: ResultModel) => {
        const expanded = result.expanded;
        results.forEach((r) => (r.expanded = false));
        result.expanded = !expanded;
        results = [...results];
    };
    let error = false;
    // const s = new BikeSettings(50, 0.44, 1450, 0.99, 1, 1, undefined);
    // const u = new UserSettings(undefined, undefined, 1.01, 100, 200);
    let results: ResultModel[] = [
        // new ResultModel(100, 100, s, u, 'Taurus', 'Stefano Luigi', 'Loscalzo', undefined, '2020-11-1 12:36:21', false),
        // new ResultModel(100, 200, s, u, 'Mtb', 'Test', 'Test', undefined, '2020-09-06 20:27:04'),
        // new ResultModel(100, 399.2, s, u,'ParolaLunga', 'Test', 'Test', undefined, '2020-09-06 20:27:04'),
        // new ResultModel(100, 33.32222222, s, u, 'Pulsar', 'Parola lunghissimissima', 'Test lungoooooooooooo', undefined, '2020-09-06 20:27:04'),
        // new ResultModel(100, 33.5534235,s, u, 'Varna', 'Test', 'Test', undefined, '2020-09-06 20:27:04')
    ];

    onMount(() => {
        fetch(url, { cache: "no-store" })
            .then((resp) => {
                if(resp.status !== 200)
                    throw new Error('Something went wrong');
                return resp.json();
            })
            .then((data) => {
                let v: ResultModel[] = [];
                data.forEach((e) => {
                    const s = new BikeSettings(
                        e.bikeSettings.bikeWeight,
                        e.bikeSettings.wheelsInertia,
                        e.bikeSettings.wheelsCircumference,
                        e.bikeSettings.efficiency,
                        e.bikeSettings.area,
                        e.bikeSettings.cx,
                        e.bikeSettings.coefficientsFile
                    );
                    const u = new UserSettings(
                        e.userSettings.riderWeight,
                        e.userSettings.riderWeight,
                        e.userSettings.temperature,
                        e.userSettings.altitude,
                        e.userSettings.humidity);
                    v.push(
                        new ResultModel(e.speed, e.power, s, u, e.bikeName, e.firstName, e.lastName, "", e.timestamp)
                    );
                });
                // console.log(v);
                results = v.sort((e1: ResultModel, e2: ResultModel) => e2.datetime.getTime() - e1.datetime.getTime());
                // v[0].expanded = true;
                return v;
            })
            .catch((e) => {
                console.log(e);
                error = true;
            });
        // .then((data) => console.log(data));
    });
</script>

<style>

    .scroller {
        scroll-behavior: smooth;
        overflow-x: hidden;
        overflow-y: auto;
        height: 50vh;
        /*margin: 0 10% 3em;*/
    }
    h1 {
        font-size: 3em;
        margin-bottom: 0.5em;
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

    .error {
        color: #ff3e00;
    }
</style>

<div class="container">
    <h1>Results</h1>
    {#if error}
        <h2 class="error">An error has occurred. Retry later.</h2>
    {:else}
        <h2>Click on a result for more info.</h2>
    {/if}
    <div class="scroller">
        {#each results as result}
            <ResultComponent on:click={() => expand(result)} {result} />
        {/each}
    </div>
</div>
<!--<button on:click={add}>Add</button>-->
