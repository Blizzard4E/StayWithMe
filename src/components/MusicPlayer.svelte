<script>
    import { onMount } from "svelte";

    /**
     * @type {HTMLAudioElement}
     */
    let music;
    let muteSign = false;
    let volume = 0.07;

    onMount(() => {
        music.volume = volume;
        music.loop = true;
        if(music.paused) {
            muteSign = true;
        }
    })
    
    function toggleMusic() {
        music.volume = volume;
        if(music.paused) {
            music.play();
            muteSign = false;
        }
        else {
            music.pause();
            muteSign = true;
        }
    }
</script>

<audio src="/sounds/idol.mp3" bind:this={music} autoplay loop></audio>
<button on:click={toggleMusic}>
    <img src="/images/musical-note.png" alt="Mute/Unmute Button">
    <div id="mute" class="{muteSign ? 'muted' : 'unmuted'}"></div>
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
        position: fixed;
        top: 1rem;
        right: 1.5rem;
        display: grid;
        place-items: center;
        border-radius: 50%;
        padding: 1rem;
        background-color: $pink2;
        border: 2px solid white;
        z-index: 11;

        img {
            width: 30px;
        }
    }
    @keyframes musicAnimation {
    0% { transform: scale(1); }
    10% { transform: scale(1.08); }
    20% { transform: scale(1.0);}
    30% { transform: scale(1.045); }
    40% { transform: scale(1.08);}
    50% { transform: scale(1);}
    60% { transform: scale(1.08); }
    70% { transform: scale(1.045); }
    80% { transform: scale(1.0);}
    90% { transform: scale(1.045); }
    100% { transform: scale(1);}
}
</style>