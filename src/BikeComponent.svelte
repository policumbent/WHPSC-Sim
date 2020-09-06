<script lang="ts">
    import {Bike} from "./models/Bike";
    export let bike: Bike;
</script>
<div on:click class="container">
    <label>{bike.bikeName}</label>
    <img class="image" src="{bike.imgSrc}" alt="{bike.bikeName} image">
    <p>{bike.description}</p>
</div>

<style>
    label {
        font-weight: bold;
    }
    p {
        margin-top: 25px;
        font-style: italic;
    }
    .container {
        color: black;
        display: inline-block;
        position: relative;
        width: 150px;
        height: 160px;
        top: 50%;
        transform: translate(0,-50%);
        padding: 1em;
        border: #333333 solid 3px;
        border-radius: 20%;
        margin-left: 2px;
        margin-right: 2px;
    }
    .container:hover {
        color: #0084f6;
        border: #ff3e00 solid 3px;
    }
    .container:hover .image{
        /*https://codepen.io/sosuke/pen/Pjoqqp*/
        filter: invert(34%) sepia(79%) saturate(4271%) hue-rotate(1deg) brightness(101%) contrast(109%);
    }
    .image {
        position: relative;
        top: 10px;
        width: 150px;
        height: 80px;
        /*object-fit: cover; !* Do not scale the image *!*/
        object-position: center; /* Center the image within the element */
        /*position: relative;*/
        /*overflow: hidden;*/
        /*border-radius: 100%;*/
    }
</style>
