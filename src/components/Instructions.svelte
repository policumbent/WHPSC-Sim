<script lang="ts">
    import showdown from 'showdown';
    import {onMount} from "svelte";
    import Icon from "svelte-awesome";
    import {github} from "svelte-awesome/icons";
    import { Us, It } from "svelte-flagicon";

    let instructionsHTML = '';

    function get_language_id() {
        const userLang = navigator.language || navigator.userLanguage;
        if (userLang.includes("it"))
            return "it";
        return "en";
    }
    async function getLanguageData(language: string){
        let instructionsMD = 'Work in progress!';
        try {
            const res = await fetch(`data/${language}_instructions.md`);
            instructionsMD = await res.text();
        } catch (e) {
            console.log(e);
        }
        const converter = new showdown.Converter();
        instructionsHTML = converter.makeHtml(instructionsMD);
        instructionsHTML = instructionsHTML.replaceAll('<a ', '<a target="_blank" ')

    }
    onMount(async () => {
        const languageID = get_language_id();
        await getLanguageData(languageID);
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
    .github {
        padding: -10px;
        color: black;
    }
    .center {
        position: absolute;
        left: 50%;
        transform: translate(-50%, -5px);
        text-align: center;
        display: inline-block;
    }
    .left {
        position: absolute;
        left: 2em;
        text-align: left;
        display: inline-block;
        cursor: pointer;
    }
    .right {
        position: absolute;
        right: 2em;
        text-align: left;
        display: inline-block;
        cursor: pointer;
    }
    .relative {
        position: relative;
        height: 40px;
        margin: 1em 0;
    }
</style>
<section>
    <h1>{get_language_id() === 'it' ? 'Istruzioni' : 'Instruction'}</h1>
    <h3>To learn more about technical aspects (code, aerodynamic and rolling resistances) visit
        <a target="_blank" href="https://github.com/policumbent/WHPSC-Sim/#readme">GitHub page.
            </a></h3>
    <div class="relative">
        <div class="left" on:click={() => getLanguageData('en')}>
            <Us round square size="40" />
        </div>
        <div class="center">
            <a class="github" href="https://github.com/policumbent/WHPSC-Sim/#readme" target="_blank"><Icon data={github} scale="3" /></a>
        </div>
        <div class="right" on:click={() => getLanguageData('it')}>
            <It round square size="40" />
        </div>
    </div>

    <div>{@html instructionsHTML}</div>
</section>
