<script>
    import { onMount } from "svelte";
    import { transitionState } from "../../store";
    import Navbar from "../../components/Navbar.svelte";
    import ThreeDBackground from "../../components/ThreeDBackground.svelte";
    import BackgroundStarsPink from "../../components/BackgroundStarsPink.svelte";

    onMount(() => {
        transitionState.update(state => 0);
    })
</script>
<BackgroundStarsPink/>
<div class="container">
    <h1><span>Top</span> Places</h1>
    <div class="grid-1">
        <div class="main">
            <div class="img" style="background: linear-gradient(rgba(0,0,0,0), rgba(0, 0, 0, 0.3)), url('/placeholder_0.jpg');background-position:center;background-size:cover;"></div>
            <h2>Cambodia</h2>
        </div>
        <div class="side-1">
            <div class="img" style="background: linear-gradient(rgba(0,0,0,0), rgba(0, 0, 0, 0.3)), url('/placeholder_1.jpg');background-position:center;background-size:cover;"></div>
            <h2>France</h2>
        </div>
        <div class="side-2">
            <div class="img" style="background: linear-gradient(rgba(0,0,0,0), rgba(0, 0, 0, 0.3)), url('/placeholder_2.jpg');background-position:center;background-size:cover;"></div>
            <h2>United States</h2>
        </div>
    </div>
    <h1><span>New</span> Hotels</h1>
    <ul>
        <li>
            <img src="/placeholder_3.jpg" alt="">
            <h2>Hotel 1</h2>
        </li>
        <li>
            <img src="/placeholder_3.jpg" alt="">
            <h2>Hotel 1</h2>
        </li>
        <li>
            <img src="/placeholder_3.jpg" alt="">
            <h2>Hotel 1</h2>
        </li>
        <li>
            <img src="/placeholder_3.jpg" alt="">
            <h2>Hotel 1</h2>
        </li>
        <li>
            <img src="/placeholder_3.jpg" alt="">
            <h2>Hotel 1</h2>
        </li>
        <li>
            <img src="/placeholder_3.jpg" alt="">
            <h2>Hotel 1</h2>
        </li>
        <li>
            <img src="/placeholder_3.jpg" alt="">
            <h2>Hotel 1</h2>
        </li>
        <li>
            <img src="/placeholder_3.jpg" alt="">
            <h2>Hotel 1</h2>
        </li>
        <li>
            <img src="/placeholder_3.jpg" alt="">
            <h2>Hotel 1</h2>
        </li>
    </ul>
</div>
<style lang="scss">
    .container {
        position: relative;
        z-index: 1;
    }
    h1 {
        font-size: 1.7rem;
    }
    h1,h2 {
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
        .main,.side-1,.side-2 {
            position: relative;
            border: 2px solid $pink;
            overflow: hidden;

            .img {
                height: 100%;
                width: 100%;
                transition: 0.18s ease-in-out;
            }
            &:hover {
                .img {
                    transform: scale(1.2);
                }
            }
        }
        .main {
            grid-area: main;
            
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
    ul {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        overflow: hidden;
        li {
            flex-shrink: 0;
            margin-right: 1rem;
            width: calc((100% - 5rem)/6);
            
            img {
                width: 100%;
            }
        }
    }

</style>