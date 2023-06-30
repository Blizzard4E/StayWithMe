<script>
    import { onMount } from "svelte";
    import { darkMode } from "../store";

    let transitionOut = true;

    let isDark;
    let imageName = "ai.jpg";
    let canChange = true;

    darkMode.subscribe((value) => {
        isDark = value;
        if (isDark == 0) {
            imageName = "aidol.png";
        } else if (isDark == 1) {
            imageName = "ai.jpg";
        }
    });

    function toggleState() {
        transition();
    }
    onMount(() => {});
    function transition() {
        canChange = false;
        transitionOut = false;
        setTimeout(() => {
            if (isDark == 1) {
                darkMode.update((value) => 0);
            } else {
                darkMode.update((value) => 1);
            }
        }, 800);
        setTimeout(() => {
            transitionOut = true;
        }, 1800);
        setTimeout(() => {
            if (isDark) {
                imageName = "aidol.png";
            } else {
                imageName = "ai.jpg";
            }
            canChange = true;
        }, 2000);
    }
</script>

<button on:click={toggleState} class:dark={isDark == 1} disabled={!canChange}>
    <img src="/images/heart.png" alt="Mute/Unmute Button" />
    <div class="bg" class:out={transitionOut} class:in={!transitionOut} />
</button>
<div
    class="ai"
    class:hide={transitionOut}
    class:show={!transitionOut}
    style={"background: radial-gradient( circle at center, rgba(20, 24, 29, 0.3), rgba(20, 24, 29, 0.8) 50%, rgba(20, 24, 29, 0.9) 60%, rgba(20, 24, 29, 1) 70% ),  url('/images/" +
        imageName +
        "');background-repeat: no-repeat; background-size: cover; background-position: center;"}
>
    <img src="/images/heartStroke.png" alt="" />
</div>

<style lang="scss">
    .ai {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 21;
        height: 100vh;
        width: 80vw;
        color: rgb(20, 24, 29);
        pointer-events: none;

        img {
            opacity: 0.75;
            width: 25vw;
            position: fixed;
            top: 10%;
            left: 50%;
        }
    }
    @keyframes moveAround {
        0% {
            transform: translate(-2rem, 2rem);
        }
        25% {
            transform: translate(2rem, 2rem);
        }
        50% {
            transform: translate(2rem, -2rem);
        }
        75% {
            transform: translate(-2rem, -2rem);
        }
        100% {
            transform: translate(-2rem, 2rem);
        }
    }
    .show {
        transition: 0.6s ease-in-out;
        transition-delay: 0.6s;
        opacity: 1;
        animation: moveAround infinite ease-in-out;
    }
    .hide {
        transition: 0.15s ease-in-out;
        opacity: 0;
    }
    @property --size {
        syntax: "<length>";
        inherits: false;
        initial-value: 3000px;
    }
    .bg {
        pointer-events: none;
        position: absolute;
        top: -5vh;
        width: 300vw;
        height: 300vh;
        z-index: 20;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        transition: --size 0.7s ease-in-out;
        background: radial-gradient(
            circle at center,
            transparent var(--size),
            rgba(20, 24, 29, 1) 0%
        );
        background-repeat: no-repeat;
        background-position: 20% 75%;
    }
    .in {
        --size: 30px;
    }
    .out {
        --size: 3000px;
    }
    button {
        position: relative;
        margin-top: 1rem;
        user-select: none;
        cursor: pointer;
        transition: 0.25s ease-in-out;
        display: grid;
        place-items: center;
        border-radius: 50%;
        padding: 1rem;
        background-color: $pink2;
        border: none;
        border: 2px solid white;

        img {
            width: 30px;
        }
    }
    button.dark {
        transition: 0.25s ease-in-out;
        background-color: $dark-red;
    }
</style>
