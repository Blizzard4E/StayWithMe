<script>
    import { onMount } from "svelte";
    import { transitionState } from "../../store";

    onMount(() => {
        transitionState.update(state => 0);
    })
</script>
<h>Home</h>