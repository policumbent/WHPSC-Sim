<script lang="ts">
    import { getContext } from "svelte";
    // import ResultsList from "../ResultsList.svelte";
    import Instructions from './Instructions.svelte'
    const { open } = getContext("simple-modal");

    function openModal() {
        open(
            Instructions,
            {},
            { closeButton: true, closeOnEsc: true, closeOnOuterClick: false }
        );
    }
</script>
<style>
    .btn {
        cursor: pointer;
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

    .blue {
        background-color: #3399ff;
        font-size: 1.5em;
    }
</style>
<button on:click={openModal} class="blue btn">Instruction</button>
