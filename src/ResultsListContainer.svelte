<script lang="ts">
  import { getContext } from "svelte";
  import ResultsList from "./ResultsList.svelte";

  const { open } = getContext("simple-modal");

  export let show: boolean;

  function openModal() {
    open(
      ResultsList,
      {},
      { closeButton: true, closeOnEsc: true, closeOnOuterClick: true }
    );
    show = false;
  }
</script>

{#if show}{openModal()}{/if}
