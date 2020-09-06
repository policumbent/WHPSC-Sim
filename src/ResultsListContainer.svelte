<script>
    import { getContext } from 'svelte';
    import ResultsList from './ResultsList.svelte';

    const { open } = getContext('simple-modal');

    export const openModal = () => {
        open(ResultsList, {},  { closeButton: true, closeOnEsc: true,
            closeOnOuterClick: false});
    };
</script>

