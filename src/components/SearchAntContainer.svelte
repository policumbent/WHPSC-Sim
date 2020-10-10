<script lang="ts">
    import { getContext } from "svelte";
    import SearchAnt from "./SearchAnt.svelte";
    import {sensorConnected} from "../Ant"

    const { open, close } = getContext("simple-modal");

    export let show: boolean;
    export let connected: boolean;

    function openModal() {
        open(
            SearchAnt,
            {},
            {
                closeButton: true,
                closeOnEsc: true,
                closeOnOuterClick: true,
            },
            {
                onClosed: () => connected = sensorConnected()
            }
        );
        show = false;
    }
    $: if(show) openModal();
</script>

<!--{#if show}{openModal()}{/if}-->
