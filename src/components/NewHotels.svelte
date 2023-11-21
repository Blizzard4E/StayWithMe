<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { darkMode, transitionState } from "../store";
    import jwt_decode from "jwt-decode";
    import { user } from "../routes/stores";
    import { PUBLIC_API_URL } from "$env/static/public";
    let userData;
    let isDark;

    user.subscribe((value) => (userData = value));

    darkMode.subscribe((value) => (isDark = value));

    let hotels = [];

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
                fetch(PUBLIC_API_URL + "/autoLogin", {
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

    onMount(async () => {
        const tokenCheck = await checkToken().catch((err) => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            transition("/login");
        });
        if (tokenCheck) {
            const response = await fetch(PUBLIC_API_URL + "/users/getHotels", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: localStorage.getItem("access_token"),
                }),
            });
            const jsonData = await response.json();

            if (jsonData.status == 200) {
                hotels = jsonData.data;
            }
            console.log(jsonData);
        }
    });

    let currentPos = 0;
    function nextSlide() {
        currentPos -= 20;
    }
    function prevSlide() {
        currentPos += 20;
    }
    function transition(path) {
        transitionState.update((state) => 1);
        setTimeout(() => {
            goto(path);
        }, 800);
    }
</script>

<h1 class:dark={isDark == 1}>
    <span>New</span>
    Hotels
</h1>
<section class:dark={isDark == 1}>
    <button
        class="arrow left-arrow {currentPos === 0 ? 'hide' : ''}"
        on:click={prevSlide}
    >
        <img src="/svg/left_arrow.svg" alt="" />
    </button>
    <button
        class="arrow right-arrow {currentPos === -(20 * (hotels.length - 5)) ||
        hotels.length < 5
            ? 'hide'
            : ''}"
        on:click={nextSlide}
    >
        <img src="/svg/right_arrow.svg" alt="" />
    </button>
    <div class="slide-container">
        <ul style="transform: translateX({currentPos}%)">
            {#each hotels as hotel}
                <li on:click={() => transition("/hotel/" + hotel.id)}>
                    <div class="cover">
                        <img src={hotel.images[4]} alt="" />
                    </div>
                    <div class="info">
                        <h2>{hotel.name}</h2>
                        <div class="rating">
                            <h3>{hotel.ratings}</h3>
                            <img src="/images/star.png" alt="Star Rating" />
                        </div>
                    </div>
                    <p>{hotel.country}</p>
                </li>
            {/each}
        </ul>
    </div>
</section>

<style lang="scss">
    .dark {
        color: white;
        span {
            color: $dark-red;
        }
        .arrow {
            img {
                filter: invert(24%) sepia(71%) saturate(4689%)
                    hue-rotate(332deg) brightness(88%) contrast(100%);
            }
        }
        ul {
            li {
                &:hover {
                    background-color: $dark-red;
                }
            }
        }
    }
    .hide {
        display: none;
    }
    section {
        position: relative;
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
            filter: invert(70%) sepia(89%) saturate(4718%) hue-rotate(301deg)
                brightness(100%) contrast(106%);
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
            width: calc((100%) / 5);
            transition: 0.15s ease-out;
            padding: 1rem;
            cursor: pointer;
            .cover {
                overflow: hidden;
            }
            &:hover {
                background-color: $pink2;
                .cover img {
                    transform: scale(0.9);
                    transition: 0.2s ease-out;
                }
                h2,
                h3,
                p {
                    color: white;
                    transition: 0.15s ease-in-out;
                }
            }

            .info {
                margin-top: 0.25rem;
                display: grid;
                grid-template-columns: 5fr 1fr;
                h2 {
                    font-size: 1.1rem;
                    line-height: 1.2rem;
                }
                img {
                    margin-top: 0.1rem;
                    width: 1.1rem;
                    height: 1.1rem;
                    transform: translateY(-2px);
                }
                h3 {
                    margin-right: 0.25rem;
                    font-size: 1rem;
                }
                .rating {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                }
            }
            p {
                font-size: 0.9rem;
            }

            img {
                width: 100%;
                aspect-ratio: 1/1;
                object-fit: cover;
            }
        }
    }
</style>
