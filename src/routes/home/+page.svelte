<script>
    import { onMount } from "svelte";
    import { darkMode, transitionState } from "../../store";
    import Navbar from "../../components/Navbar.svelte";
    import ThreeDBackground from "../../components/ThreeDBackground.svelte";
    import BackgroundStarsPink from "../../components/BackgroundStarsPink.svelte";
    import NewHotels from "../../components/NewHotels.svelte";
    import { goto } from "$app/navigation";
    import Manager from "../../components/Manager.svelte";
    import { user, hotel, country } from "../stores";

    export let data;

    let userData;
    let hotelData;
    let isDark;

    user.subscribe((value) => {
        userData = value;
    });
    hotel.subscribe((value) => {
        hotelData = value;
    });
    darkMode.subscribe((value) => (isDark = value));

    function searchByCountry(countryName) {
        country.update((value) => countryName);
        transition("/search");
    }

    onMount(async () => {
        transitionState.update((state) => 0);
    });
    function transition(path) {
        transitionState.update((state) => 1);
        setTimeout(() => {
            goto(path);
        }, 800);
    }
</script>

<div class="main-bg" class:bg-dark={isDark}>
    {#if userData}
        <div class="container">
            <h1><span>Top</span> Places</h1>
            <div class="grid-1">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="main" on:click={() => searchByCountry("Cambodia")}>
                    <div
                        class="img"
                        style="background: linear-gradient(rgba(0,0,0,0), rgba(0, 0, 0, 0.3)), url('/placeholder_0.jpg');background-position:center;background-size:cover;"
                    />
                    <h2>Cambodia</h2>
                    <div class="detail">
                        <h2>Cambodia</h2>
                        <p>
                            Cambodia is a country that is known for its rich
                            history, stunning temples, and beautiful beaches.
                            The country is home to many ancient temples,
                            including the famous Angkor Wat temple complex.
                        </p>
                    </div>
                </div>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="side-1" on:click={() => searchByCountry("France")}>
                    <div
                        class="img"
                        style="background: linear-gradient(rgba(0,0,0,0), rgba(0, 0, 0, 0.2)), url('/placeholder_1.jpg');background-position:center;background-size:cover;"
                    />
                    <h2>France</h2>
                    <div class="detail">
                        <h2>France</h2>
                        <p>
                            France is a country located in Western Europe that
                            is known for its rich history, stunning
                            architecture, and world-class cuisine.
                        </p>
                    </div>
                </div>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                    class="side-2"
                    on:click={() => searchByCountry("United States")}
                >
                    <div
                        class="img"
                        style="background: linear-gradient(rgba(0,0,0,0), rgba(0, 0, 0, 0.3)), url('/placeholder_2.jpg');background-position:center;background-size:cover;"
                    />
                    <h2>United States</h2>
                    <div class="detail">
                        <h2>United States</h2>
                        <p>
                            The United States is a country located in North
                            America that is known for its diverse culture,
                            stunning natural beauty, and world-class cities.
                        </p>
                    </div>
                </div>
            </div>
            <NewHotels />
        </div>
    {/if}
    {#if hotelData}
        <div class="container">
            <Manager {data} />
        </div>
    {/if}
</div>

<style lang="scss">
    .main-bg {
        position: relative;
        z-index: 1;
        min-height: 100vh;
        background-color: rgba(255, 255, 255, 0.4);
    }
    .bg-dark {
        background: rgba(0, 0, 0, 0.5);

        h1,
        h2,
        h3,
        p {
            color: white;
            span {
                color: $dark-red;
            }
        }
        .grid-1 {
            .main,
            .side-1,
            .side-2 {
                .detail {
                    background-color: $dark-red;
                }
            }
        }
        .side-1 {
            width: 100%;
            grid-area: side-1;
            h2 {
                color: white;
                position: absolute;
                bottom: 0.5rem;
                left: 0.5rem;
            }
        }
        .side-2 {
            width: 100%;
            grid-area: side-2;
            h2 {
                color: white;
                position: absolute;
                bottom: 0.5rem;
                left: 0.5rem;
            }
        }
    }
    .container {
        position: relative;
        z-index: 1;
        padding-bottom: 2rem;
    }
    h1 {
        font-size: 1.7rem;
    }
    h1,
    h2,
    h3,
    p {
        font-family: "Poppins", sans-serif;
        span {
            color: $pink2;
        }
    }
    .grid-1 {
        position: relative;
        z-index: 1;
        width: 100%;
        aspect-ratio: 3/1.2;
        display: grid;
        margin-bottom: 1rem;
        grid-template-columns: repeat(3, 1fr);
        grid-template-areas:
            "main main side-1"
            "main main side-2";
        column-gap: 1rem;
        row-gap: 1rem;
        .side-2,
        .side-1 {
            &:hover {
                .detail {
                    transition: 0.15s ease-in-out;
                    transform: translateY(0%);
                }
            }
            .detail {
                transform: translateY(100%);
                background-color: $pink2;
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 50%;
                padding: 0.5rem;
                p {
                    color: white;
                    font-size: 0.9rem;
                }
                h2 {
                    left: 0;
                    top: 0;
                    position: relative;
                }
            }
        }
        .main,
        .side-1,
        .side-2 {
            position: relative;
            overflow: hidden;
            cursor: pointer;

            .img {
                height: 100%;
                width: 100%;
                transition: 0.2s ease-in-out;
                transform: translateZ(0);
                /* antialiasing */
                backface-visibility: hidden;
                will-change: transform;
                perspective: 1000;
                transition: 0.15s ease-out;
            }
            &:hover {
                .img {
                    transform: scale(1.1);
                }
            }
        }
        .main {
            grid-area: main;
            &:hover {
                .detail {
                    transition: 0.15s ease-in-out;
                    transform: translateY(0%);
                }
            }
            .detail {
                transform: translateY(100%);
                background-color: $pink2;
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 25%;
                padding: 1rem;
                p {
                    color: white;
                    font-size: 0.9rem;
                }
                h2 {
                    left: 0;
                    top: 0;
                    position: relative;
                }
            }
            h2 {
                color: white;
                position: absolute;
                bottom: 1rem;
                left: 1rem;
            }
        }
        .side-1 {
            width: 100%;
            grid-area: side-1;
            h2 {
                color: white;
                position: absolute;
                bottom: 0.5rem;
                left: 0.5rem;
            }
        }
        .side-2 {
            width: 100%;
            grid-area: side-2;
            h2 {
                color: white;
                position: absolute;
                bottom: 0.5rem;
                left: 0.5rem;
            }
        }
    }
</style>
