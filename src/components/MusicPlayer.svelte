<script>
    import { onMount } from "svelte";
    import { darkMode } from "../store";

    /**
     * @type {HTMLAudioElement}
     */
    let music;
    let muteSign = false;
    let volume = 0.07;

    let isDark;

    darkMode.subscribe((value) => (isDark = value));

    onMount(() => {
        music.volume = volume;
        music.loop = true;
        if (music.paused) {
            muteSign = true;
        }
    });

    function toggleMusic() {
        music.volume = volume;
        if (music.paused) {
            music.play();
            muteSign = false;
        } else {
            music.pause();
            muteSign = true;
        }
    }
</script>

<audio src="/sounds/idol.mp3" bind:this={music} autoplay loop />
<button
    on:click={toggleMusic}
    class:dark={isDark == 1}
    class:light={isDark == 0}
>
    <img src="/images/musical-note.png" alt="Mute/Unmute Button" />
    <div id="mute" class={muteSign ? "muted" : "unmuted"} />
</button>

<style lang="scss">
    #mute {
        border-radius: 3px;
        position: absolute;
        background-color: white;
        width: 48px;
        height: 6px;
        transform: rotate(-45deg) translateZ(0);
        /* antialiasing */
        -webkit-backface-visibility: hidden;
        will-change: transform;
        -webkit-perspective: 1000;
        transition: 0.15s ease-in;
    }
    .muted {
        opacity: 1;
    }
    .unmuted {
        opacity: 0;
    }
    button {
        user-select: none;
        cursor: pointer;
        animation: musicAnimation;
        animation-iteration-count: infinite;
        animation-duration: 1.5s;
        display: grid;
        place-items: center;
        border-radius: 50%;
        padding: 1rem;
        border: 2px solid white;

        img {
            width: 30px;
        }
    }
    .light {
        background-color: $pink2;
    }
    .dark {
        background-color: $dark-red;
    }
    @keyframes musicAnimation {
        0% {
            transform: scale(1);
        }
        10% {
            transform: scale(1.08);
        }
        20% {
            transform: scale(1);
        }
        30% {
            transform: scale(1.045);
        }
        40% {
            transform: scale(1.08);
        }
        50% {
            transform: scale(1);
        }
        60% {
            transform: scale(1.08);
        }
        70% {
            transform: scale(1.045);
        }
        80% {
            transform: scale(1);
        }
        90% {
            transform: scale(1.045);
        }
        100% {
            transform: scale(1);
        }
    }
</style>
