<script lang="ts">
    import ResultComponent from "./ResultComponent.svelte";
    import {onMount} from "svelte";
    import {ResultModel} from "./models/Result"
    let results: ResultModel[] = [
        // new ResultModel(100.11, 'ciao', 'pippo', '', '2020-09-04 15:03:46'),
        // new ResultModel(200.33, 'Stefano', 'Loscalzo', '', '2020-09-04 15:03:46'),
        // new ResultModel(200, 'Nomelunghissimo', 'ecognomepure', '', '2020-09-04 15:03:46'),
        // new ResultModel(200, 'ciao', 'pippo', '', '2020-09-04 15:03:46'),
        // new ResultModel(200, 'ciao', 'pippo', '', '2020-09-04 15:03:46'),
        // new ResultModel(200, 'ciao', 'pippo', '', '2020-09-04 15:03:46'),
        // new ResultModel(200, 'ciao', 'pippo', '', '2020-09-04 15:03:46'),
        // new ResultModel(200, 'ciao', 'pippo', '', '2020-09-04 15:03:46'),
        // new ResultModel(200, 'ciao', 'pippo', '', '2020-09-04 15:03:46'),
        // new ResultModel(200, 'ciao', 'pippo', '', '2020-09-04 15:03:46'),
        // new ResultModel(200, 'ciao', 'pippo', '', '2020-09-04 15:03:46'),
        // new ResultModel(200, 'ciao', 'pippo', '', '2020-09-04 15:03:46'),
        // new ResultModel(200, 'ciao', 'pippo', '', '2020-09-04 15:03:46'),
    ];
    const url = "https://www.policumbent.it/whpsc_sim_backend/results.php";

    onMount( () => {
        const myHeaders = new Headers();
        fetch(url,  {cache: "no-store"})
                .then(resp => resp.json())
                .then(
                        data => {
                            let v: ResultModel[] = [];
                            data.forEach(e => v.push(
                                    new ResultModel(e.speed, e.firstName, e.lastName, '', e.timestamp)
                            ));
                            console.log(v);
                            results = v.sort((e1, e2) => e2.datetime-e1.datetime);
                            return v
                        }
                )
                // .then(data => console.log(data));
    })
    function add() {
        results = [
            new ResultModel(100.11, 'ciao', 'pippo', '', '2020-09-04 15:03:46')
        ];
        console.log(results);
    }
</script>

<div class="container">
    <h1>Results</h1>
    <div class="scroller">
        {#each results as result}
            <ResultComponent result={result}/>
        {/each}
    </div>
</div>
<!--<button on:click={add}>Add</button>-->
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

    ::-webkit-scrollbar-track
    {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        background-color: #F5F5F5;
    }

    ::-webkit-scrollbar
    {
        width: 10px;
        background-color: #F5F5F5;
    }

    ::-webkit-scrollbar-thumb
    {
        background-color: #ff3e00;
        background-image: -webkit-linear-gradient(45deg,
        rgba(255, 255, 255, .2) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, .2) 50%,
        rgba(255, 255, 255, .2) 75%,
        transparent 75%,
        transparent)
    }

</style>
