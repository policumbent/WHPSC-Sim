<script lang="ts">
    import Icon from "svelte-awesome";
    import {gear, download, github} from "svelte-awesome/icons";
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
    import HelpButton from "./components/HelpButton.svelte";
    import { Email, Reddit, LinkedIn, Telegram, WhatsApp, Facebook, Twitter } from 'svelte-share-buttons-component';

    const dispatch = createEventDispatcher();
    let sidebar_show = false;
    let chooseBike = false;
    let showModal = false;
    let searchAnt = false;
  let searchBt = false;
  let btPowerMeterPaired = false;
  let antPowerMeterPaired = false;
    const title = 'WHPSC Simulator';
    const desc = 'Try a fast streamliner on Battle Mountain track.';
    const url = 'https://www.policumbent.it/whpsc-sim/'

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

    function showSidebar(){
        sidebar_show = !sidebar_show;
        sidebar_show ?
            document.getElementById("settings_icon").style.color = "#3399ff" :
            document.getElementById("settings_icon").style.color = "#ffff00";
    }

</script>

<style>

    .bg_image {
        position: fixed;
        overflow: auto;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-image: url("../img/background_light.jpg");
        background-position: center; /* Center the image */
        background-repeat: no-repeat; /* Do not repeat the image */
        background-size: cover; /* Resize the background image to cover the entire container */
    }
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
        color: yellow;
        cursor: pointer;
        z-index: 999999;
        margin: 1em;

        position: fixed;
        top: 0;
        right: 0;
    }
    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    .btn {
        /*display: block;*/
        cursor: pointer;
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
        margin: 1em;
        background-color: yellow;
        color: black;
        font-size: 1em;
        z-index: 99;
    }
    .left {
        left: 0;
    }
    .right {
        right: 0;
    }
    section {
        text-align: center;
    }

    .results {
        display: block;
    }
    .triangle-top-left {
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        border-top: 100px solid yellow;
        border-right: 100px solid transparent;
    }
    .beta {
        position: fixed;
        font-size: 2em;
        font-weight: 100;
        transform: rotate(-45deg);
        top: 14px;
        left: 0;
        color: black;
        z-index: 99;
    }
    .bottom {
        margin-top: 3em;
        margin-bottom: 5em;
    }
</style>

<Settings bind:show={sidebar_show} />

<section>
    <div class="bg_image">
        <div class="triangle-top-left"></div>
        <span class="beta">BETA</span>
        <h1>WHPSC Simulator</h1>

        <div>
            <button class="btn" disabled="{!(btPowerMeterPaired || antPowerMeterPaired) && !getDebug()}" on:click={pickBike}>Start</button>
            <button class="btn" on:click={showResults}>Results</button>
        </div>
        <div>
            <button class="btn" disabled="{antPowerMeterPaired}" on:click={btSearch}>BT powermeter</button>
            <button class="btn" disabled="{btPowerMeterPaired}" on:click={() => searchAnt = true}>ANT powermeter</button>
        </div>
        <Modal>
            <SearchAntContainer bind:connected={antPowerMeterPaired} bind:show={searchAnt}/>
        </Modal>
        <Modal>
            <SearchBtContainer bind:show={searchBt}/>
        </Modal>
        <Modal>
            <HelpButton/>
        </Modal>
        {#if chooseBike}
            <BikePicker on:message={bikeChosen} />
        {/if}
        <Modal>
            <ResultsListContainer bind:show={showModal} />
        </Modal>
        <div class="bottom">
            <Email subject="{title}" body="{desc} {url}" />
            <Reddit class="share-button" {title} {url} />
            <LinkedIn class="share-button" {url} />
            <Telegram class="share-button" text={title} {url} />
            <WhatsApp class="share-button" text="{title} {url}" />
            <Facebook class="share-button" {url} />
            <Twitter class="share-button" text="{title}" {url} />
        </div>
    </div>
    <span
            id="settings_icon"
            on:click={showSidebar}
            class="top-right-fixed click_t">
    <Icon  class="top-right-fixed" data={gear} scale="2.5" />
  </span>
<!--    <button class="left survey btn" on:click={() => window.open('https://github.com/policumbent/WHPSC-Sim/releases','_blank')}><Icon data={download}/> Download APP</button>-->
    <button class="right survey btn" on:click={() => window.open('https://github.com/policumbent/WHPSC-Sim/','_blank')}><Icon data={github}/> GitHub</button>

</section>
