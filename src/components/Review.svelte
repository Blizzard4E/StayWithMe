<div class="text">
    <h2>Reviews</h2>
</div>
<div class="review">
    <ul>
        <li>
            <img src="/images/profile.webp" alt="">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione culpa quod deserunt aliquam laudantium, temporibus maiores iure saepe est ad officia, libero fugiat excepturi debitis rerum quasi aperiam beatae. Dolorum?</p>
        </li>
        <li>
            <img src="/images/profile.webp" alt="">
            <p>Lorem, ipsum dolor sit amet consectetur </p>
        </li>
    </ul>
    <form action="">
        <h2>Write Your Review</h2>
        <input type="text" placeholder="Your Review...">
        <div class="rating">
            <h3>Rating</h3>
            <img src="/images/star.png" alt="">
            <img src="/images/star.png" alt="">
            <img src="/images/star.png" alt="">
            <img src="/images/star.png" alt="">
            <img src="/images/star.png" alt="">
        </div>
        <button>Send</button>
    </form>
</div>

<style lang="scss">
    .text {
        display: flex;
        justify-content: space-between;
    }
    .review {
        display: grid;
        grid-template-columns: 1fr 2fr;
        .rating {
            display: flex;
            align-items: center;
            column-gap: 0.1rem;
            
            img {
                width: 16px;
                height: 16px;
                transition: 0.15s ease-in-out;
                cursor: pointer;
                &:hover {
                    transform: scale(1.1);
                }
            }
        }
        form {
            display: flex;
            flex-direction: column;
            justify-content: end;
            align-items: end;
            
            button {
                margin-top: 0.5rem;
                cursor: pointer;
                font-size: .9rem;
                font-weight: bold;
                border: none;
                color: white;
                padding: 0.5rem 1rem;
                background-color: $pink2;
                
            }

            input {
                transition: 0.15s ease-in-out;
                &:focus {
                    transform: scale(1.1);
                    outline: none;
                    box-shadow: none;
                }
                &:hover {
                    transform: scale(1.1);
                    outline: none;
                    box-shadow: none;
                }
                width: 300px;
                padding: .5rem;
                border-radius: 14px;
                border-bottom-right-radius: 0;
                border: 1px solid black;
            }
        }
        ul {
            margin-top: 1rem;
            display: grid;
            row-gap: 0.5rem;
            li {
                display: flex;
                align-items: flex-end;
                column-gap: 0.5rem;
                img {
                    border: 2px solid $pink2;
                    width: 52px;
                    height: 52px;
                    object-fit: cover;
                    border-radius: 50%;
                }
                p {
                    margin-bottom: 0.5rem;
                    color: white;
                    font-size: 0.9rem;
                    background-color: $pink2;
                    padding: 0.5rem;
                    border-radius: 14px;
                    border-bottom-left-radius: 0;
                }
            }
        }
    }
</style>