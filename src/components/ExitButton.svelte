<script lang="ts">
    import { getContext } from "svelte";
    import Icon from "svelte-awesome";
    import {close} from "svelte-awesome/icons";
    import ExitDialog from './ExitDialog.svelte'
    const { open } = getContext("simple-modal");

    function openModal() {
        open(
            ExitDialog,
            {},
            { closeButton: true, closeOnEsc: true, closeOnOuterClick: true }
        );
    }
</script>
<style>
    .top-right-fixed {
        color: gold;
        text-shadow: 2px 2px #333333;
        margin-top: 8px;
        margin-right: 8px;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 9999;
        cursor: pointer;
    }
</style>

<span class="top-right-fixed" on:click={openModal}>
      <Icon class="top-right-fixed" data={close} scale="3" />
</span>
