<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  import ResultModel from "./models/Result";
  import type { BikeSettings, UserSettings } from "./models/Settings";

  const dispatch = createEventDispatcher();
  const uploadUrl =
    "https://www.policumbent.it/whpsc_sim_backend/upload_result.php";
  export let speed: number;
  export let power: number;
  export let bikeName: string;
  export let config: BikeSettings;
  export let userConfig: UserSettings;
  let count = 0;
  let errorMex = "";
  const next = () => {
    count++;
  };
  let result: ResultModel;
  function handleSubmit() {
    console.log(result);
    fetch(uploadUrl, { method: "POST", body: JSON.stringify(result) })
      .then((resp) => {
        if (resp.status === 200) next();
        console.log(resp);
      })
      .catch((error) => (errorMex = error));
  }
  onMount(
    () => (result = new ResultModel(speed, power, config, userConfig, bikeName))
  );
</script>

<style>
  h1 {
    font-size: 3em;
  }
  .speed {
    font-size: 4em;
    font-weight: bold;
    padding: 1em 0.5em;
    color: gold;
  }
  .mph {
    font-size: 1em;
  }
  form {
    display: inline-block;
    margin: 1em 0;
  }
  .right {
    text-align: right;
    float: right;
  }
  .btn {
    margin-top: 1em;
    padding: 0.7em 1.7em;
    background-color: gold;
    border: black;
    color: black;
    text-transform: uppercase;
    font-weight: 300;
  }
  .formData {
    position: relative;
    /*width: 200px;*/
  }
  label {
    display: block;
    margin-bottom: 0.5em;
    /*float: left;*/
    text-align: left;
  }
</style>

<section>
  {#if count === 0}
    <h1>🎉 Congratulations 🍾</h1>
    <p>Your speed is</p>
    <p>
      <span class="speed">{speed} km/h</span>
    </p>
    <p />
    <p>
      <span class="mph">({Math.round(speed * 0.621371 * 100) / 100}mph)</span>
    </p>
    <button class="btn" on:click={next}>Save your result</button>
  {:else if count === 1}
    <h1>Save your result</h1>
    <p>We need some information to add your attempt to our results list.</p>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="formData">
        <label for="firstName">First name</label>
        <input
          required
          id="firstName"
          bind:value={result.firstName}
          type="text" />
      </div>
      <div class="formData">
        <label for="lastName">Last name</label>
        <input
          required
          id="lastName"
          bind:value={result.lastName}
          type="text" />
      </div>
      <div class="formData">
        <label for="email">Email</label>
        <input required id="email" bind:value={result.email} type="email" />
      </div>
      <p value={errorMex}></p>
      <input class="btn right" type="submit" value="Send" />
    </form>
  {:else}
    <h1>One more step</h1>
    <p>
      Check your mail and confirm your attempt. You will become visible on
      result as soon you confirm it.
    </p>
  {/if}
</section>
