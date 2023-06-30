<script>
    import Navbar from "../../components/Navbar.svelte";
    import { darkMode } from "../../store";
    let isDark;

    darkMode.subscribe((value) => {
        isDark = value;
    });
</script>

<div class="bg" class:dark={isDark}>
    <Navbar />
    <slot />
</div>

<style lang="scss">
    .bg {
        background-color: #fcf7f7;
        width: 100%;
        min-height: 100vh;
    }
    .dark {
        background-color: $dark-bg;
    }
</style>
