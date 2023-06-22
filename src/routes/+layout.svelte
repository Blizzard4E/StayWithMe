<script>
    import { onMount } from "svelte";
    import "../app.scss";
    import Transition from "../components/Transition.svelte";
    import MusicPlayer from "../components/MusicPlayer.svelte";

</script>

<MusicPlayer/>
<div class="transition">
    <Transition/>
</div>

<slot />
<style>
    .transition {
        position: relative;
        top: 0;
        left: 0;
        z-index: 6;
    }
</style>