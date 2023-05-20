<script>
    import { onMount } from "svelte";
    import BackgroundStarsPink from "../../components/BackgroundStarsPink.svelte";
    import { transitionState } from "../../store";
    import { goto } from "$app/navigation";
    onMount(() => {
        transitionState.update(state => 0);
    })
    function hotel() {
        transitionState.update(state => 1);
        setTimeout(() => {
            goto('/hotel');
        }, 1000);
    }
</script>
<div class="container">
    <h1>Cambodia</h1>
    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus sed esse eum molestiae iusto quis ab, iste consectetur obcaecati. Corporis temporibus amet cum ipsum quod voluptatibus natus architecto soluta error!</p>
    <div class="grid">
        <div class="filter">
            <h2>Sort By</h2>
            <h3>Name</h3>
            <div>
                <button class="active">A-Z</button>
                <button>Z-A</button>
            </div>
            <h3>Ratings</h3>
            <div>
                <button class="active">Low to High</button>
                <button>High to Low</button>
            </div>
            <h3>Price</h3>
            <div>
                <button class="active">Low to High</button>
                <button>High to Low</button>
            </div>
        </div>
        <div>
            <h2>Hotels</h2>
            <ul>
                {#each Array(10) as _, i}
                <li on:click={hotel}>
                    <img src="/placeholder_3.jpg" alt="">
                    <div class="info">
                        <div class="detail">
                            <div>
                                <h3>Hotel Name</h3>
                                <h4>Country: Cambodia</h4>
                                <h4>Location: Phnom Penh</h4>
                                <h4>Facilities: Swiming Pool, BBQ, Breakfast</h4>
                            </div>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga, soluta maxime ea repellendus, asperiores dicta.</p>
                        </div>
                        <div>
                            <div class="rating">
                                <h3>3.5</h3>
                                <img src="/images/star.png" alt="">
                            </div>
                        </div>
                    </div>
                </li>
                {/each}
            </ul>
        </div>
    </div>
</div>

<style lang="scss">
    .filter {
        h3 {
            font-size: 1rem;
            margin-top: 0.5rem;
        }
        .active {
            background-color: $pink2;
            color: white;
        }
        button {
            border: none;
            padding: 0.5rem 1rem;
            transition: 0.15s ease-in-out;
            cursor: pointer;
            &:hover {
                transform: scale(1.1);
                color: white;
                background-color: $pink2;
            }
        }
    }
    .container {
        position: relative;
        z-index: 2;
        padding-top: 1rem;
        padding-bottom: 1rem;
        background-color: rgba(252, 247, 247, 0.7);
    }
    * {
        font-family: 'Poppins',sans-serif;
    }
    .grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        
    }
    ul {
        li {
            cursor: pointer;
            &:hover {
                background-color: $pink2;
                color: white;
            }
            transition: 0.15s ease-in-out;
            padding: 1rem;
            display: grid;
            grid-template-columns: 1fr 3fr;
            column-gap: 1rem;
            .info {
                display: grid;
                grid-template-columns: 5fr 1fr;
                .detail {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .rating {
                    display: flex;
                    align-items: center;
                    h3 {
                        font-size: 1.15rem;
                        margin-top: 0.2rem;
                        margin-right: 0.2rem;
                    }
                    img {
                        width: 20px;
                        height: 20px;
                    }
                }
                
            }
            h3 {
                font-size: 1.3rem;
            }
            h4 {
                font-size: 1rem;
                font-weight: normal;
            }

            img {
                width: 100%;
                aspect-ratio: 1/1;
                object-fit: cover;
            }
        }
    }
</style>