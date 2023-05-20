<script>

    import Navbar from "../../components/Navbar.svelte";

</script>
<div class="bg">
    <Navbar/>
    <slot/>
</div>

<style lang="scss">
    .bg {
        background-color: #FCF7F7;
        width: 100%;
        min-height: 100vh;
    }
</style>

