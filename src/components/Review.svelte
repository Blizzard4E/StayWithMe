<script>
    import { goto } from "$app/navigation";
    import jwt_decode from "jwt-decode";
    import { user } from "../routes/stores";
    import { onMount } from "svelte";
    import Report from "./Report.svelte";
    import { darkMode } from "../store";

    let userData;
    let hotelReviews = [];
    let isDark;
    let emptyStar = "empty_star.png";
    let isLoading = false;

    darkMode.subscribe((value) => {
        isDark = value;
        if (isDark) {
            emptyStar = "empty_star_dark.png";
        } else {
            emptyStar = "empty_star.png";
        }
    });

    export let data;

    user.subscribe((value) => (userData = value));

    let ratings = 5,
        feedback = "";

    async function checkToken() {
        let decodedToken = jwt_decode(localStorage.getItem("access_token"));
        return new Promise((resolve, reject) => {
            if (Date.now() >= decodedToken.exp * 1000) {
                if (!localStorage.getItem("refresh_token")) {
                    console.log("No refresh Token");
                    user.update((value) => null);
                    hotel.update((value) => null);
                    transition("/login");
                    return;
                }
                let myToken = localStorage.getItem("refresh_token");
                fetch("https://stay-withme-api.cyclic.app/autoLogin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: myToken }),
                })
                    .then(async (res) => {
                        const jsonData = await res.json();
                        if (jsonData.status == 200) {
                            localStorage.setItem(
                                "access_token",
                                jsonData.accessToken
                            );
                            console.log("Successful refresh access token");
                            let decoded = jwt_decode(jsonData.accessToken);
                            user.update((value) => decoded);
                            resolve(true);
                        } else reject({ status: 401 });
                        console.log(jsonData);
                    })
                    .catch((error) => console.error("Error:", error));
            } else {
                resolve(true);
            }
        });
    }

    async function sendReview() {
        const tokenCheck = await checkToken().catch((err) => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            transition("/login");
        });
        if (tokenCheck) {
            isLoading = true;
            fetch("https://stay-withme-api.cyclic.app/users/review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: localStorage.getItem("access_token"),
                    user_id: userData.id,
                    hotel_id: data.hotel_id,
                    feedback: feedback,
                    ratings: ratings,
                }),
            })
                .then((res) => res.json())
                .then((jsonData) => {
                    if (jsonData.status == 200) {
                        ratings = 5;
                        feedback = "";
                        isLoading = false;
                        getAllReviews();
                    }
                    console.log(jsonData);
                });
        }
    }

    async function getAllReviews() {
        const tokenCheck = await checkToken().catch((err) => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            transition("/login");
        });
        if (tokenCheck) {
            fetch("https://stay-withme-api.cyclic.app/users/getHotelReviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: localStorage.getItem("access_token"),
                    hotel_id: data.hotel_id,
                }),
            })
                .then((res) => res.json())
                .then((jsonData) => {
                    if (jsonData.status == 200) {
                        hotelReviews = jsonData.data;
                    }
                    console.log(jsonData);
                });
        }
    }

    onMount(() => {
        getAllReviews();
    });

    function changeRating(num) {
        ratings = num;
    }
    function transition(path) {
        transitionState.update((state) => 1);
        setTimeout(() => {
            goto(path);
        }, 800);
    }
</script>

<div class:dark={isDark == 1}>
    <div class="text">
        <h2>Reviews</h2>
    </div>
    <div class="review">
        <ul>
            {#each hotelReviews as review, i (review)}
                <li>
                    <div class="review-wrap">
                        <img
                            class="profile"
                            src={review.user_id.profile_pic}
                            alt=""
                        />
                        <div class="comment">
                            <div class="review-stars">
                                <h1>{review.user_id.username}</h1>
                                {#each Array(review.ratings) as _, i}
                                    <img
                                        class="star"
                                        src="/images/star.png"
                                        alt=""
                                    />
                                {/each}
                            </div>
                            <p>
                                {review.feedback}
                            </p>
                        </div>
                        <Report
                            reviewData={{
                                user_id: review.user_id.id,
                                review_id: review.id,
                            }}
                        />
                    </div>
                </li>
            {/each}
        </ul>
        <form action="">
            <h2>Write Your Review</h2>
            <input
                type="text"
                placeholder="Your Review..."
                bind:value={feedback}
            />
            <div class="rating">
                <h3>Rating</h3>
                <img
                    src={ratings >= 1
                        ? "/images/star.png"
                        : "/images/" + emptyStar}
                    alt=""
                    on:click={() => changeRating(1)}
                />
                <img
                    src={ratings >= 2
                        ? "/images/star.png"
                        : "/images/" + emptyStar}
                    alt=""
                    on:click={() => changeRating(2)}
                />
                <img
                    src={ratings >= 3
                        ? "/images/star.png"
                        : "/images/" + emptyStar}
                    alt=""
                    on:click={() => changeRating(3)}
                />
                <img
                    src={ratings >= 4
                        ? "/images/star.png"
                        : "/images/" + emptyStar}
                    alt=""
                    on:click={() => changeRating(4)}
                />
                <img
                    src={ratings >= 5
                        ? "/images/star.png"
                        : "/images/" + emptyStar}
                    alt=""
                    on:click={() => changeRating(5)}
                />
            </div>
            <button
                on:click|preventDefault={sendReview}
                disabled={feedback == ""}>Send</button
            >
            {#if isLoading}
                <div class="loading">
                    <div class="lds-ring">
                        <div />
                        <div />
                        <div />
                        <div />
                    </div>
                    <p>Submitting Review</p>
                </div>
            {/if}
        </form>
    </div>
</div>

<style lang="scss">
    .dark {
        .review {
            form {
                button {
                    background-color: $dark-red;
                }
            }
            ul {
                .review-wrap {
                    .comment {
                        background-color: $dark-red;
                    }
                    .profile {
                        border: 2px solid $dark-red;
                    }
                }
            }
        }
    }
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
                font-size: 0.9rem;
                font-weight: bold;
                border: none;
                color: white;
                padding: 0.5rem 1rem;
                background-color: $pink2;
                transition: 0.25s ease-in-out;
                &:hover {
                    transform: scale(1.1);
                }
                &:disabled {
                    cursor: not-allowed;
                    transform: scale(1);
                }
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
                padding: 0.5rem;
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
            }
            .review-wrap {
                display: flex;
                align-items: flex-end;
                column-gap: 0.5rem;
                position: relative;
                .profile {
                    border: 2px solid $pink2;
                    width: 52px;
                    height: 52px;
                    object-fit: cover;
                    border-radius: 50%;
                }
                .review-stars {
                    display: flex;
                    align-items: center;
                }
                .star {
                    width: 12px;
                    height: 12px;
                    transition: 0.15s ease-in-out;
                    cursor: pointer;
                }
                h1 {
                    margin-right: 0.25rem;
                    color: white;
                    font-size: 1rem;
                }
                .comment {
                    background-color: $pink2;
                    padding: 0.5rem;
                    border-radius: 14px;
                    border-bottom-left-radius: 0;
                    margin-bottom: 0.5rem;
                }
                p {
                    line-break: auto;
                    color: white;
                    font-size: 0.9rem;
                }
            }
        }
    }
</style>
