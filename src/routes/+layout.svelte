<script>
    import { onMount } from "svelte";
    import "../app.scss";
    import Transition from "../components/Transition.svelte";
    import MusicPlayer from "../components/MusicPlayer.svelte";
    import ThemeChange from "../components/ThemeChange.svelte";
</script>

<div class="util">
    <MusicPlayer />
    <ThemeChange />
</div>
<div class="transition">
    <Transition />
</div>

<slot />

<style>
    .util {
        position: fixed;
        top: 1rem;
        right: 1.5rem;
        z-index: 11;
    }
    .transition {
        position: relative;
        top: 0;
        left: 0;
        z-index: 6;
    }
</style>
