<script lang="ts">
  import Icon from "svelte-awesome";
  import {gear} from "svelte-awesome/icons";
  import Modal from "svelte-simple-modal";
  import {createEventDispatcher} from "svelte";
  import {getDebug, setBtSensorName} from "./store"
  import {startSearch} from "./BleData";
  import BikePicker from "./BikePicker.svelte";
  import Settings from "./components/Settings.svelte";
  import ResultsListContainer from "./ResultsListContainer.svelte";
  import SearchAnt from "./components/SearchAnt.svelte";
  import SearchAntContainer from "./components/SearchAntContainer.svelte";
  import SearchBtContainer from "./components/SearchBtContainer.svelte";

  const dispatch = createEventDispatcher();
  let sidebar_show = false;
  let chooseBike = false;
  let searchAnt = false;
  let searchBt = false;
  let showModal = false;
  let btPowerMeterPaired = false;
  let antPowerMeterPaired = false;

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
  // todo: metodo per disassociare misuratore bt
  function btSearch() {
    searchBt = true;
    startSearch()
            .then(data => btPowerMeterPaired = data)
            .catch(error => {
              if(searchBt)
                alert('Bluetooth off or this functionality isn\'t available on this PC.')
              // alert('This functionality is available only in Google Chrome 83+. ' +
              //         'If you are already using it on Linux the "chrome://flags/#enable-experimental-web-platform-features" flag must be enabled.' +
              //         'For further information read this page https://github.com/WebBluetoothCG/web-bluetooth/blob/gh-pages/implementation-status.md')
              searchBt = false;
              console.log(error);
              btPowerMeterPaired = false;
            })
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
  /* .fill_all {
    height: 100%;
    width: 100%;
    overflow: hidden;
  } */
  .top-right-fixed {
    z-index: 999999;
    margin-top: 5px;
    margin-right: 5px;
    position: absolute;
    top: 0;
    right: 0;
  }
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

  .survey {
    position: fixed;
    bottom: 0;
    left: 0;
    margin: 1em;
    background-color: yellow;
    color: black;
    font-size: 1em;
    z-index: 99;
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
  <button class="btn" disabled="{!(btPowerMeterPaired || antPowerMeterPaired) && !getDebug()}" on:click={pickBike}>Start</button>
  <button class="btn" on:click={showResults}>Results</button>
  <div>
    <button class="btn" disabled="{antPowerMeterPaired}" on:click={btSearch}>BT powermeter</button>
    <button class="btn" disabled="{btPowerMeterPaired}" on:click={() => searchAnt = true}>ANT powermeter</button>
  </div>
  {#if chooseBike}
    <BikePicker on:message={bikeChosen} />
  {/if}
  <Modal>
    <ResultsListContainer bind:show={showModal} />
  </Modal>
  <Modal>
    <SearchAntContainer bind:connected={antPowerMeterPaired} bind:show={searchAnt}/>
  </Modal>
  <Modal>
    <SearchBtContainer bind:show={searchBt}/>
  </Modal>
  <button class="survey btn" on:click={() => window.open('https://forms.gle/hK2XADnP4FkvjtmD7','_blank')}>Survey</button>
</section>
