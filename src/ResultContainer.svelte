<script lang="ts">
  import { getContext } from "svelte";
  import ResultModal from "./ResultContent.svelte";

  const { open } = getContext("simple-modal");

  export const openModal = (speed, power, bikeName, config, userConfig) => {
    console.log("CONFIG:", config);
    open(
      ResultModal,
      { speed, power, bikeName, config, userConfig },
      { closeButton: true, closeOnEsc: true, closeOnOuterClick: false }
    );
  };
</script>
