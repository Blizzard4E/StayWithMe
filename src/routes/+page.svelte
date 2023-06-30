<script>
    import { darkMode, transitionState } from "../store";
    import { goto } from "$app/navigation";
    import BackgroundStars from "../components/BackgroundStars.svelte";
    import Navbar from "../components/Navbar.svelte";
    import ThreeDBackground from "../components/ThreeDBackground.svelte";
    import { onMount } from "svelte";
    import ThreeDBackgroundDark from "../components/ThreeDBackgroundDark.svelte";
    import BackgroundStarsRed from "../components/BackgroundStarsRed.svelte";

    let isDark;

    darkMode.subscribe((value) => (isDark = value));

    function home() {
        transitionState.update((state) => 1);
        setTimeout(() => {
            goto("/home");
        }, 1000);
    }

    onMount(() => {
        transitionState.update((state) => 0);
    });
</script>

<div>
    <div class="clickable" on:click={home} />
    <div class="content">
        {#if isDark}
            <BackgroundStarsRed />
        {:else}
            <BackgroundStars />
        {/if}
        {#if isDark}
            <div class="logo logoDark">
                <h1>S<span>T</span>A<span>Y</span></h1>
                <h2>
                    W<span class="medium">I</span><span class="small">TH</span
                    ><span class="medium">M</span>E
                </h2>
            </div>
        {:else}
            <div class="logo">
                <h1>S<span>T</span>A<span>Y</span></h1>
                <h2>
                    W<span class="medium">I</span><span class="small">TH</span
                    ><span class="medium">M</span>E
                </h2>
            </div>
        {/if}
        <div class="click">
            <p>Click to Continue</p>
        </div>
        <div class="background" class:light={!isDark} class:dark={isDark}>
            {#if isDark}
                <ThreeDBackgroundDark />
            {:else}
                <ThreeDBackground />
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    .light {
        background: $pink;
    }
    .dark {
        background: $dark-bg;
    }
    .clickable {
        cursor: pointer;
        position: fixed;
        z-index: 8;
        width: 100%;
        height: 100vh;
        overflow: hidden;
    }
    .background {
        position: relative;
        z-index: 0;
        width: 100%;
        height: 100vh;
    }
    .logo {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        display: grid;
        place-items: center;
    }
    .click {
        position: fixed;
        bottom: 0%;
        left: 50%;
        transform: translateX(-50%);
        z-index: 4;
        p {
            margin-left: 0.7rem;
            text-align: center;
            opacity: 1;
            letter-spacing: 0.35rem;
            font-family: "Righteous", cursive;
            margin-bottom: 2rem;
            font-size: 1.3rem;
            color: white;
            animation: fadeInOut 2s ease-in infinite;
        }
    }
    .logoDark {
        h1,
        h2 {
            font-family: "Yeseva One", cursive;
            font-weight: normal;
            font-size: 25rem;
            color: white;
            opacity: 0.9;
            -webkit-text-stroke-width: 2px;
            -webkit-text-stroke-color: #040507;
            user-select: none;
            span {
                color: #e21a50;
            }
        }
        h2 {
            margin-left: 2rem;
            display: flex;
            align-items: center;
            letter-spacing: 1rem;
            margin-top: -5rem;
            font-family: "Righteous", cursive;
            font-size: 4rem;
            color: white;
            -webkit-text-stroke-width: 1px;
            span {
                color: white;
            }
            .medium {
                font-size: 3.5rem;
            }
            .small {
                font-size: 3rem;
            }
        }
    }
    h1,
    h2 {
        font-family: "Yeseva One", cursive;
        font-weight: normal;
        font-size: 25rem;
        color: white;
        opacity: 0.9;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: #fc4573;
        user-select: none;
        span {
            color: black;
        }
    }
    h2 {
        margin-left: 2rem;
        display: flex;
        align-items: center;
        letter-spacing: 1rem;
        margin-top: -5rem;
        font-family: "Righteous", cursive;
        font-size: 4rem;
        color: black;
        -webkit-text-stroke-width: 1px;
        .medium {
            font-size: 3.5rem;
        }
        .small {
            font-size: 3rem;
        }
    }
    .content {
        opacity: 0;
        animation: hide 1.2s;
        animation-fill-mode: forwards;
    }
    @keyframes hide {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 0;
        }
        100% {
            opacity: 0.9;
        }
    }
    @keyframes fadeInOut {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
</style>
