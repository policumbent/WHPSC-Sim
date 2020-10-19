<script lang="ts">
    import showdown from 'showdown';
    import {onMount} from "svelte";
    let instructionsHTML = '';
    onMount(async () => {
        let instructionsMD = 'Work in progress!';
        try {
            const res = await fetch(`data/instructions.md`);
            instructionsMD = await res.text();
        } catch (e) {
            console.log(e);
        }
        const converter = new showdown.Converter();
        instructionsHTML = converter.makeHtml(instructionsMD);
        instructionsHTML = instructionsHTML.replaceAll('<a ', '<a target="_blank" ')
        console.log('a', instructionsHTML);
    });
</script>
<style>
    section {
        text-align: left;
    }
    h1 {
        text-align: center;
        font-size: 2em;
    }
</style>
<section>
    <h1>Instructions</h1>
    <div>{@html instructionsHTML}</div>
</section>
