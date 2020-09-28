<script lang="ts">
  import { getContext } from "svelte";
  import ResultModal from "./ResultContent.svelte";

  const { open } = getContext("simple-modal");

  export const openModal = (speed, bikeName, config) => {
    console.log("CONFIG:", config);
    open(
      ResultModal,
      { speed, bikeName, config },
      { closeButton: true, closeOnEsc: true, closeOnOuterClick: false }
    );
  };
</script>
