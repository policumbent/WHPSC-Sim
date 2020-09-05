<script>
    import { getContext } from 'svelte';
    import ResultModal from './ResultContent.svelte';

    const { open } = getContext('simple-modal');

    export const openModal = (speed) => {
        open(ResultModal, { message: speed },{ closeButton: true, closeOnEsc: true,
            closeOnOuterClick: false });
    };
</script>

