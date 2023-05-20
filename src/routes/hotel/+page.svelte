<script>
    import { onMount } from "svelte";
    import BackgroundStarsPink from "../../components/BackgroundStarsPink.svelte";
    import { transitionState } from "../../store";
    import Review from "../../components/Review.svelte";

    let currentPos = 0;
    /**
     * @param {number} index
     */
    function setSlide(index) {
        currentPos = -100 * index;
    }
    onMount(() => {
        transitionState.update(state => 0);
    })
</script>

<div class="container">
    <div class="grid">
        <div>
            <img class="hotel-cover" src="/placeholder_3.jpg" alt="">
            <div class="info">
                <h1>Hotel Name</h1>
                <h3>Country: Cambodia</h3>
                <h3>Location: Phnom Penh</h3>
                <h3>Facilities: Swiming Pool, BBQ, Breakfast</h3>
                <h3>Google Map:</h3>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7817.165127761991!2d104.89563975626336!3d11.58175387562631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109517bf7757d23%3A0x965c34888684bf1!2sParagon%20International%20University!5e0!3m2!1sen!2skh!4v1684534324823!5m2!1sen!2skh" width="100%" height="200" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </div>
        <div>
            <div class="slide">
                <div class="slide-images" style="transform: translateX({currentPos}%)">
                    <img src="/placeholder_4.jpg" alt="">
                    <img src="/placeholder_5.jpg" alt="">
                    <img src="/placeholder_6.jpg" alt="">
                    <img src="/placeholder_7.jpg" alt="">
                </div>
            </div>
            <div class="slide-controls">
                <button on:click={() => setSlide(0)}>
                    <img src="/placeholder_4.jpg" alt="">
                </button>
                <button on:click={() => setSlide(1)}>
                    <img src="/placeholder_5.jpg" alt="">
                </button>
                <button on:click={() => setSlide(2)}>
                    <img src="/placeholder_6.jpg" alt="">
                </button>
                <button on:click={() => setSlide(3)}>
                    <img src="/placeholder_7.jpg" alt="">
                </button>
            </div>
        </div>
    </div>
    <div class="description">
        <h2>Description</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor delectus non magni distinctio nostrum quasi. Nemo, quae. Consequatur, autem molestiae voluptatem facilis iste soluta labore corporis inventore veniam illum pariatur!</p>
    </div>
    <div class="rooms">
        <h2>Rooms</h2>
        <ul>
            {#each Array(20) as _, i}
                <li class="{i % 2 == 0 ? 'available' : 'occupied'}">
                    <h3>Room: {100 + i}</h3>
                    <p>Status: 
                        {#if i % 2 == 0}
                            Available
                        {:else}
                            Occupied
                        {/if}
                    </p>
                    <p>Beds: 
                        {#if i % 2 == 0}
                            1
                        {:else}
                            2
                        {/if}
                    </p>
                </li>
            {/each}
        </ul>
    </div>
    <div class="book-btn"><button class="book">Book Rooms</button></div>
    <Review/>
</div>
<style lang="scss">
    .book-btn {
        display: flex;
        justify-content: end;
    }
    .book {
        margin-top: 1rem;
        border: none;
        background: $pink2;
        padding: 0.5rem 1rem;
        color: white;
        font-weight: bold;
        font-size: 1.05rem;
        cursor: pointer;
        &:hover {
            transition: 0.15s ease-in-out;
            transform: scale(1.1);
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
        grid-template-columns: 1fr 3fr;
        column-gap: 1rem;

        .hotel-cover {
            width: 100%;
            aspect-ratio: 1/1;
            object-fit: cover;
            border: 3px solid $pink2;
        }
        .info {
            h1 {
                font-size: 1.5rem;
            }
            h3 {
                font-size: 1rem;
                font-weight: normal;
            }
        }
        .slide {
            overflow: hidden;
            border: 3px solid $pink2;
           .slide-images {
                transition: 0.15s ease-in-out;
                display: flex;
                flex-wrap: nowrap;
                img {
                    width: 100%;
                    aspect-ratio: 3/1.5;
                }
           }
        }
        .slide-controls {
                width: 100%;
                display: grid;
                grid-template-columns: repeat(4, 1fr);

                button {
                    border: none;
                    background: none;
                    padding: 1rem;
                    transition: 0.15s ease-in-out;
                    cursor: pointer;
                    &:hover {
                        background-color: $pink2;
                        img {
                            transition: 0.15s ease-in-out;
                            transform: scale(0.9);
                        }
                    }
                    img {
                        width: 100%;
                        aspect-ratio: 2/1.2;
                        object-fit: cover;
                    }
                }
           }
    }
    .description {
        margin-top: 1rem;
        h2 {
            font-size: 1.1rem;
        }
    }
    .rooms {
        margin-top: 1rem;
        h2 {
            font-size: 1.3rem;
        }
        ul {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            column-gap: 1rem;
            row-gap: 1rem;
            li {
                cursor: pointer;
                padding: 1rem;
                transition: 0.15s ease-in-out;
                
                
                h3 {
                    font-size: 1.1rem;
                }
                p {
                    font-size: .9rem;
                }
            }
            .occupied {
                background-color: rgb(255, 187, 0);
                cursor:not-allowed;
            }
            .available {
                border: 1px solid grey;
                &:hover {
                    border: none;
                    background-color: $pink2;
                    transform: scale(1.1);
                    h3,p {
                        transition: 0.15s ease-in-out;
                        color: white;
                    }
                }
            }
        }
    }
</style>
