<script lang="ts">
  import Icon from "svelte-awesome";
  import { gear } from "svelte-awesome/icons";
  import Modal from "svelte-simple-modal";
  import { createEventDispatcher } from "svelte";

  import { BikeSettings } from "./models/Bike";
  import { btSearch } from "./BleData";
  import BikePicker from "./BikePicker.svelte";
  import Settings from "./components/Settings.svelte";
  import ResultsListContainer from "./ResultsListContainer.svelte";

  const dispatch = createEventDispatcher();
  let sidebar_show = false;
  let chooseBike = false;
  let showModal = false;

  function pickBike() {
    chooseBike = true;
  }

  function showResults() {
    // alert('Sorry. Not ready yet.');
    showModal = true;
  }

  function bikeChosen(event) {
    chooseBike = false;
    if (event.detail.text == null) return;
    console.log(event.detail.text);
    dispatch("message", {
      text: event.detail.text,
    });
  }
</script>

<style>
  /*todo: same size buttons*/
  h1 {
    margin-top: 2em;
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
  .fill_all {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .top-right-fixed {
    margin-top: 5px;
    margin-right: 5px;
    position: absolute;
    top: 0;
    right: 0;
  }

  .btn {
    /*display: block;*/
    text-align: center;
    background-color: #ff532e;
    color: #ffffff;
    border: #ffffff;
    text-transform: uppercase;
    font-weight: 100;
    font-size: 2em;
    padding: 0.5em 1em;
    margin: 1em auto;
  }

  section {
    text-align: center;
  }

  .results {
    display: block;
  }
</style>

<Settings bind:show={sidebar_show} />

<section>
  <h1>WHPSC Simulator</h1>
  <span
    on:click={() => (sidebar_show = !sidebar_show)}
    class="top-right-fixed click_t">
    <Icon class="top-right-fixed" data={gear} scale="2" />
  </span>
  <button class="btn" on:click={pickBike}>Start</button>
  <button class="btn" on:click={btSearch}>Search powermeter</button>
  {#if chooseBike}
    <BikePicker on:message={bikeChosen} />
  {/if}
  <button class="btn results" on:click={showResults}>Results</button>
  <Modal>
    <ResultsListContainer bind:show={showModal} />
  </Modal>
</section>
