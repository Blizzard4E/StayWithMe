<script>
    import { onMount } from "svelte";
    import { transitionState } from "../../store";
    import Navbar from "../../components/Navbar.svelte";
    import ThreeDBackground from "../../components/ThreeDBackground.svelte";
    import BackgroundStarsPink from "../../components/BackgroundStarsPink.svelte";
    import NewHotels from "../../components/NewHotels.svelte";
    import { goto } from "$app/navigation";

    onMount(() => {
        transitionState.update(state => 0);
    })
    function country() {
        transitionState.update(state => 1);
        setTimeout(() => {
            goto('/country');
        }, 1000);
    }
</script>
<div class="container">
    <h1><span>Top</span> Places</h1>
    <div class="grid-1">
        <div class="main" on:click={country}>
            <div class="img" style="background: linear-gradient(rgba(0,0,0,0), rgba(0, 0, 0, 0.3)), url('/placeholder_0.jpg');background-position:center;background-size:cover;"></div>
            <h2>Cambodia</h2>
            <div class="detail">
                <h2>Cambodia</h2>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo, molestiae ab iure praesentium vitae veniam eum saepe ex quia vel. Dolorum incidunt quidem molestias vitae aliquam et ipsam facere officiis.</p>
            </div>
        </div>
        <div class="side-1" on:click={country}>
            <div class="img" style="background: linear-gradient(rgba(0,0,0,0), rgba(0, 0, 0, 0.2)), url('/placeholder_1.jpg');background-position:center;background-size:cover;"></div>
            <h2>France</h2>
            <div class="detail">
                <h2>France</h2>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo, molestiae ab iure praesentium vitae veniam eum saepe ex quia vel.</p>
            </div>
        </div>
        <div class="side-2" on:click={country}>
            <div class="img" style="background: linear-gradient(rgba(0,0,0,0), rgba(0, 0, 0, 0.3)), url('/placeholder_2.jpg');background-position:center;background-size:cover;"></div>
            <h2>United States</h2>
            <div class="detail">
                <h2>United States</h2>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo, molestiae ab iure praesentium vitae veniam eum saepe ex quia vel. </p>
            </div>
        </div>
    </div>
    <NewHotels/>
</div>
<style lang="scss">
    .container {
        position: relative;
        z-index: 1;
        padding-bottom: 2rem;
        background-color: rgba(252, 247, 247, 0.7);
    }
    h1 {
        font-size: 1.7rem;
    }
    h1,h2,h3,p {
        font-family: 'Poppins', sans-serif;
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
        .side-2,.side-1 {
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
                padding: .5rem;
                p {
                    color: white;
                    font-size: .9rem;
                }
                h2 {
                    left: 0;
                    top: 0;
                    position: relative;
                }
            }
        }
        .main,.side-1,.side-2 {
            position: relative;
            overflow: hidden;
            cursor: pointer;

            .img {
                height: 100%;
                width: 100%;
                transition: 0.2s ease-in-out;
                transform: translateZ(0);
                /* antialiasing */
                -webkit-backface-visibility: hidden;
                will-change: transform;
                -webkit-perspective: 1000;
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
                    font-size: .9rem;
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
                bottom: .5rem;
                left: .5rem;
            }
        }
        .side-2 {
            width: 100%;
            grid-area: side-2;
            h2 {
                color: white;
                position: absolute;
                bottom: .5rem;
                left: .5rem;
            }
        }
    }
    

</style>