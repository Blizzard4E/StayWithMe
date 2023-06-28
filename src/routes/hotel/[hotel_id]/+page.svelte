<script>
    import { onMount } from "svelte";
    import { transitionState } from "../../../store";
    import Review from "../../../components/Review.svelte";
    import { goto } from "$app/navigation";
    import jwt_decode from "jwt-decode";
    import { user } from "../../stores";

    export let data;

    let userData;

    user.subscribe((value) => {
        userData = value;
    });

    let hotelData;
    let roomsData = [];
    let reviewsData = [];
    let days = 1;
    let selectedRoom;
    $: totalCost = days * selectedRoom?.price || 0;

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

    function selectRoom(room) {
        selectedRoom = room;
    }

    let currentPos = 0;
    /**
     * @param {number} index
     */
    function setSlide(index) {
        currentPos = -100 * index;
    }

    async function getHotelInfo() {
        const tokenCheck = await checkToken().catch((err) => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            transition("/login");
        });
        if (tokenCheck) {
            const response = await fetch(
                "https://stay-withme-api.cyclic.app/users/getHotelInfo",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: localStorage.getItem("access_token"),
                        hotel_id: data.hotel_id,
                    }),
                }
            );
            const jsonData = await response.json();

            if (jsonData.status == 200) {
                hotelData = jsonData.hotelData;
                roomsData = jsonData.roomsData;
                reviewsData = jsonData.reviewsData;
            }
            console.log(jsonData);
        }
    }
    async function bookRoom() {
        const tokenCheck = await checkToken().catch((err) => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            transition("/login");
        });
        if (tokenCheck) {
            fetch("https://stay-withme-api.cyclic.app/users/bookRoom", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    hotel_id: hotelData.id,
                    total_cost: totalCost,
                    user_id: userData.id,
                    days: days,
                    room_id: selectedRoom.id,
                    token: localStorage.getItem("access_token"),
                }),
            })
                .then((res) => res.json())
                .then((jsonData) => {
                    console.log(jsonData);
                    if (jsonData.status == 200) {
                        getHotelInfo();
                        selectedRoom = null;
                        days = 1;
                    }
                });
        }
    }

    onMount(async () => {
        transitionState.update((state) => 0);
        getHotelInfo();
    });

    function transition(path) {
        transitionState.update((state) => 1);
        setTimeout(() => {
            goto(path);
        }, 1000);
    }
</script>

{#if hotelData}
    <div class="container">
        <div class="grid">
            <div>
                <img class="hotel-cover" src={hotelData.images[4]} alt="" />
                <div class="info">
                    <h1>{hotelData.name}</h1>
                    <h3>Country: <b>{hotelData.country}</b></h3>
                    <h3>Google Map:</h3>
                    <iframe
                        src={"https://maps.google.com/maps?&q=" +
                            encodeURIComponent(hotelData.googleMap) +
                            "&output=embed"}
                        width="100%"
                        height="200"
                        style="border:0;"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>
            <div>
                <div class="slide">
                    <div
                        class="slide-images"
                        style="transform: translateX({currentPos}%)"
                    >
                        <img src={hotelData.images[0]} alt="" />
                        <img src={hotelData.images[1]} alt="" />
                        <img src={hotelData.images[2]} alt="" />
                        <img src={hotelData.images[3]} alt="" />
                    </div>
                </div>
                <div class="slide-controls">
                    <button on:click={() => setSlide(0)}>
                        <img src={hotelData.images[0]} alt="" />
                    </button>
                    <button on:click={() => setSlide(1)}>
                        <img src={hotelData.images[1]} alt="" />
                    </button>
                    <button on:click={() => setSlide(2)}>
                        <img src={hotelData.images[2]} alt="" />
                    </button>
                    <button on:click={() => setSlide(3)}>
                        <img src={hotelData.images[3]} alt="" />
                    </button>
                </div>
            </div>
        </div>
        <h3>
            Benefits:
            {#each hotelData.benefits as benefit}
                <span>{benefit}</span>
            {/each}
        </h3>
        <div class="description">
            <h2>Description</h2>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
                delectus non magni distinctio nostrum quasi. Nemo, quae.
                Consequatur, autem molestiae voluptatem facilis iste soluta
                labore corporis inventore veniam illum pariatur!
            </p>
        </div>
        <div class="rooms">
            <h2>Rooms</h2>
            <ul>
                {#each roomsData as room}
                    <li
                        on:click={selectRoom(room)}
                        class={room.availability == 1
                            ? "available"
                            : "occupied"}
                        class:active={selectedRoom?.id == room.id}
                    >
                        <h3>Room: {room.number}</h3>
                        <p>
                            Status:
                            {#if room.availability == 1}
                                Available
                            {:else}
                                Occupied
                            {/if}
                        </p>
                        <p>
                            Beds: {room.beds}
                        </p>
                        <p>
                            Price: {room.price}
                        </p>
                    </li>
                {/each}
            </ul>
        </div>
        <div class="booking">
            <div>
                <h3>Days</h3>
                <input type="number" bind:value={days} />
            </div>
            <div>
                <h3>Total Cost</h3>
                <p>${totalCost}</p>
            </div>
            <button class="book" on:click={bookRoom}>Book Room</button>
        </div>
        <Review {data} />
    </div>
{/if}

<style lang="scss">
    .booking {
        display: flex;
        column-gap: 1rem;
        justify-content: end;
        input {
            width: 50px;
            text-align: center;
        }
        p {
            text-align: center;
        }
    }
    h3 {
        font-size: 1.15rem;
        span {
            font-weight: normal;
            &:first-child {
                &::before {
                    content: "  ";
                }
            }
            &::before {
                content: ", ";
            }
        }
    }
    .book {
        border: none;
        background: $pink2;
        padding: 0.25rem 0.75rem;
        color: white;
        font-weight: bold;
        font-size: 0.9rem;
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
        font-family: "Poppins", sans-serif;
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
            width: 100%;
            .slide-images {
                width: 100%;
                transition: 0.15s ease-in-out;
                display: grid;
                grid-template-columns: repeat(4, 100%);
                img {
                    width: 100%;
                    aspect-ratio: 3/1.5;
                    object-fit: cover;
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
                padding: 0.75rem;
                transition: 0.15s ease-in-out;

                h3 {
                    font-size: 1.1rem;
                }
                p {
                    font-size: 0.85rem;
                }
            }
            .occupied {
                background-color: rgb(255, 187, 0);
                cursor: not-allowed;
            }
            .available {
                border: 1px solid grey;
                &:hover {
                    border: none;
                    background-color: $pink2;
                    transform: scale(1.1);
                    h3,
                    p {
                        transition: 0.15s ease-in-out;
                        color: white;
                    }
                }
            }
            .available.active {
                border: none;
            }
        }
    }
    .active {
        border: none;
        background-color: $pink2;
        transform: scale(1.05);
        h3,
        p {
            transition: 0.15s ease-in-out;
            color: white;
        }
    }
</style>
