<script>
    import { onMount } from "svelte";
    import { darkMode, transitionState } from "../store";

    let transitionStateValue;
    let isDark;

    darkMode.subscribe((value) => (isDark = value));

    transitionState.subscribe((value) => {
        transitionStateValue = value;
    });

    onMount(() => {
        setTimeout(() => {
            transitionState.update((value) => 0);
        }, 400);
    });
</script>

<div class:dark={isDark}>
    <img
        class="heart"
        class:out={transitionStateValue}
        class:in={!transitionStateValue}
        src="/svg/heart.svg"
        alt=""
    />
    <img
        class="outline"
        class:out={transitionStateValue}
        class:in={!transitionStateValue}
        src="/svg/heart.svg"
        alt=""
    />
</div>

<style lang="scss">
    div {
        pointer-events: none;
        position: fixed;
        display: grid;
        place-items: center;
        height: 100vh;
        width: 100vw;
        top: 0;
        left: 0;
        z-index: 10;

        img {
            position: fixed;
            transition: 0.5s ease-in-out;
        }
    }
    .dark .heart {
        filter: invert(21%) sepia(93%) saturate(5418%) hue-rotate(335deg)
            brightness(92%) contrast(91%);
    }
    .heart {
        filter: invert(70%) sepia(89%) saturate(4718%) hue-rotate(301deg)
            brightness(100%) contrast(106%);
        width: 600px;
        position: relative;
        z-index: 11;
    }
    .outline {
        width: 610px;
        filter: invert(100%) sepia(100%) saturate(2%) hue-rotate(100deg)
            brightness(104%) contrast(101%);
    }
    .in {
        transform: scale(0);
    }
    .out {
        transform: scale(4.8);
    }
</style>
