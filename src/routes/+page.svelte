<script>
    import BackgroundStars from "../components/BackgroundStars.svelte";
    import Navbar from "../components/Navbar.svelte";
    import ThreeDBackground from "../components/ThreeDBackground.svelte";

</script>

<ThreeDBackground/>
<div class="background">
    
</div>

<style lang="scss">
    .background {
        position: relative;
        z-index: 0;
        width: 100%;
        height: 100vh;
        background: $pink;
    }
</style>
