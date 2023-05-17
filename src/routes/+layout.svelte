<script>
    import "../app.scss";
    import Transition from "../components/Transition.svelte";
    
</script>
<div class="transition">
    <Transition/>
</div>

<slot />
<style>
    .transition {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 6;
    }
</style>