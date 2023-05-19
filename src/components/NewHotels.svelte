<script>
    import { goto } from "$app/navigation";
    import { transitionState } from "../store";

    let currentPos = 0;
    function nextSlide() {
        currentPos -= 20;
    }
    function prevSlide() {
        currentPos += 20;
    }
    function hotel() {
        transitionState.update(state => 1);
        setTimeout(() => {
            goto('/hotel');
        }, 1000);
    }
</script>

<h1><span>New</span> Hotels</h1>
<section>
    <button class="arrow left-arrow {currentPos ===  0? 'hide' : ''}" on:click={prevSlide}>
        <img src="/svg/left_arrow.svg" alt="">
    </button>
    <button class="arrow right-arrow {currentPos ===  -100? 'hide' : ''}" on:click={nextSlide}>
        <img src="/svg/right_arrow.svg" alt="">
    </button>
    <div class="slide-container">
        <ul style="transform: translateX({currentPos}%)">
            {#each Array(10) as _, i}
            <li on:click={() => hotel()}>
                <div class="cover">
                    <img src="/placeholder_3.jpg" alt="">
                </div>
                <div class="info">
                    <h2>Hotel 1</h2>
                    <div class="rating">
                        <h3>4.2</h3>
                        <img src="/images/star.png" alt="Star Rating">
                    </div>
                </div>
                <p>Cambodia</p>
            </li>
            {/each}
        </ul>
    </div>
</section>
    
<style lang="scss">
    .hide {
        display: none;
    }
    section {
        position: relative;
    }
    h1,h2,h3,p {
        font-family: 'Poppins', sans-serif;
        span {
            color: $pink2;
        }
    }
    .slide-container {
        width: 100%;
        overflow: hidden;
    }
    .arrow {
        user-select: none;
        position: absolute;
        border: none;
        padding: 0;
        background: none;
        cursor: pointer;
        
        img {
            filter: invert(70%) sepia(89%) saturate(4718%) hue-rotate(301deg) brightness(100%) contrast(106%);
            width: 30px;
            transition: 0.15s ease-in-out;
        }
        &:hover {
            img {
                transform: scale(1.2);
            }
        }
    }
    .right-arrow {
        top: 50%;
        right: -5%;
        transform: translateY(-50%);
    }
    .left-arrow {
        top: 50%;
        left: -5%;
        transform: translateY(-50%);
    }
    ul {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        transition: 0.15s ease-in-out;
        li {
            flex-shrink: 0;
            width: calc((100%)/5);
            transition: 0.15s ease-out;
            padding: 1rem;
            cursor: pointer;
            .cover {
                overflow: hidden;
            }
            &:hover {
                background-color: $pink2;
                .cover img{
                    transform: scale(.9);
                    transition: 0.2s ease-out;
                }
                h2,h3,p {
                    color: white;
                    transition: 0.15s ease-in-out;
                }
            }

            .info {
                margin-top: 0.25rem;
                display: grid;
                grid-template-columns: 1fr 1fr;
                align-items: center;
                h2 {
                    font-size: 1.2rem;
                    line-height: 1rem;
                }
                img {
                    margin-top: 0.1rem;
                    width: 1.2rem;
                    height: 1.2rem;
                }
                h3 {
                    margin-right: 0.25rem;
                    font-size: 1rem;
                }
                .rating {
                    display: flex;
                    align-self: center;
                    justify-content: flex-end;
                }
            }
            p {
                font-size: 0.9rem;
            }
            
            img {
                width: 100%;
            }
        }
    }
</style>