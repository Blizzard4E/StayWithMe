<script>
    import { onMount } from "svelte";
    import { darkMode, transitionState } from "../store";
    import HotelBenefits from "./HotelBenefits.svelte";
    import HotelImageUpdate from "./HotelImageUpdate.svelte";
    import { goto } from "$app/navigation";
    import { hotel, rooms } from "../routes/stores";
    import jwt_decode from "jwt-decode";
    import HotelInfo from "./HotelInfo.svelte";
    let hotelData;
    let onGoingBookings = [];
    let isDark;
    import { PUBLIC_API_URL } from "$env/static/public";
    darkMode.subscribe((value) => (isDark = value));

    let roomsData = [],
        roomNumber = 0,
        roomBeds = 1,
        roomPrice = 1;

    hotel.subscribe((value) => {
        hotelData = value;
    });

    export let data;

    $: falseRoomNumber = roomNumber < 0 || roomNumber == null;
    $: falseBeds = roomBeds <= 0 || roomBeds == null;
    $: falsePrice = roomPrice <= 0 || roomPrice == null;

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
                            hotel.update((value) => decoded);
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

    async function checkOut(room) {
        const tokenCheck = await checkToken().catch((err) => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            transition("/login");
        });
        if (tokenCheck) {
            fetch(PUBLIC_API_URL + "/hotels/checkOut", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: localStorage.getItem("access_token"),
                    room_id: room.id,
                    booking_id: room.booking_id,
                }),
            })
                .then((res) => res.json())
                .then((jsonData) => {
                    if (jsonData.status == 200) {
                        getRooms();
                    }
                    console.log(jsonData);
                });
        }
    }

    function fixRoomData() {
        onGoingBookings.forEach((booking) => {
            for (let i = 0; i < roomsData.length; i++) {
                if (roomsData[i].id == booking.room_id) {
                    roomsData[i].username = booking.user_id.username;
                    roomsData[i].profile_pic = booking.user_id.profile_pic;
                    roomsData[i].days = booking.days;
                    roomsData[i].booking_id = booking.id;
                }
            }
        });
        console.log("Fixed all room data");
        console.log(roomsData);
    }

    async function getOnGoing() {
        const tokenCheck = await checkToken().catch((err) => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            transition("/login");
        });
        if (tokenCheck) {
            fetch(PUBLIC_API_URL + "/hotels/onGoing", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: localStorage.getItem("access_token"),
                    hotel_id: hotelData.id,
                }),
            })
                .then((res) => res.json())
                .then((jsonData) => {
                    if (jsonData.status == 200) {
                        onGoingBookings = jsonData.bookingsData;
                        fixRoomData();
                    }
                    console.log(jsonData);
                });
        }
    }

    async function getRooms() {
        const tokenCheck = await checkToken().catch((err) => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            transition("/login");
        });
        if (tokenCheck) {
            fetch(PUBLIC_API_URL + "/hotels/getRooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: localStorage.getItem("access_token"),
                    hotel_id: hotelData.id,
                }),
            })
                .then((res) => res.json())
                .then((jsonData) => {
                    if (jsonData.status == 200) {
                        roomsData = jsonData.data;
                        getOnGoing();
                    }
                    console.log(jsonData);
                });
        }
    }

    async function addRoom() {
        const tokenCheck = await checkToken().catch((err) => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            transition("/login");
        });
        if (tokenCheck) {
            if (falseBeds || falseRoomNumber || falsePrice) return;
            let newRoom = {
                number: roomNumber,
                beds: roomBeds,
                price: roomPrice,
                hotel_id: hotelData.id,
                token: localStorage.getItem("access_token"),
            };
            fetch(PUBLIC_API_URL + "/hotels/createRoom", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newRoom),
            })
                .then((res) => res.json())
                .then((jsonData) => {
                    console.log(jsonData);
                    getRooms();
                });
        }
    }

    async function removeRoom(room_id) {
        const tokenCheck = await checkToken().catch((err) => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            transition("/login");
        });
        if (tokenCheck) {
            let token = localStorage.getItem("access_token");
            fetch(PUBLIC_API_URL + "/hotels/removeRoom", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: token, room_id: room_id }),
            })
                .then((res) => res.json())
                .then((jsonData) => {
                    console.log(jsonData);
                    getRooms();
                });
        }
    }

    onMount(() => {
        transitionState.update((state) => 0);
        getRooms();
    });

    function logOut() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        hotel.update((value) => null);
        transition("/login");
    }

    function transition(path) {
        transitionState.update((state) => 1);
        setTimeout(() => {
            goto(path);
        }, 800);
    }
</script>

<div class="container" class:dark={isDark == 1}>
    <div class="grid">
        <section class="create-room">
            <h1>Create Room</h1>
            <div>
                <h3>Room Number</h3>
                <input type="number" bind:value={roomNumber} min="0" step="1" />
                {#if falseRoomNumber}
                    <p>Room number must not be below 0</p>
                {/if}
            </div>
            <div>
                <h3>Beds</h3>
                <input type="number" bind:value={roomBeds} min="0" step="1" />
                {#if falseBeds}
                    <p>Room beds must be above 0</p>
                {/if}
            </div>
            <div>
                <h3>Price</h3>
                <input type="number" bind:value={roomPrice} />
                {#if falsePrice}
                    <p>Room price must be above 0</p>
                {/if}
            </div>
            <button
                on:click={addRoom}
                disabled={falseBeds || falseRoomNumber || falsePrice}
            >
                Create
            </button>
        </section>
        <section>
            <h1>
                Rooms <span>- {roomsData.length}</span>
            </h1>
            <ul>
                {#if roomsData.length > 0}
                    {#each roomsData as room}
                        <li>
                            <div class="bookInfo">
                                <div>
                                    <h2>Room {room.number}</h2>
                                    <h3>Beds {room.beds}</h3>
                                    <h3>By</h3>
                                </div>
                                {#if room.availability == 0}
                                    <div class="user">
                                        <h3>Booked by</h3>
                                        <img src={room.profile_pic} alt="" />
                                        <h2>{room.username}</h2>
                                        <h2>
                                            {room.days}
                                            {#if room.days > 1}
                                                Days
                                            {:else}
                                                Day
                                            {/if}
                                        </h2>
                                    </div>
                                {/if}
                            </div>
                            <div class="request">
                                {#if room.availability == 1}
                                    <button
                                        class="reject"
                                        on:click={removeRoom(room.id)}
                                    >
                                        Remove
                                    </button>
                                {/if}
                                {#if room.availability == 0}
                                    <button
                                        class="checkout"
                                        on:click={checkOut(room)}
                                    >
                                        Make Available
                                    </button>
                                {/if}
                            </div>
                        </li>
                    {/each}
                {:else}
                    None
                {/if}
            </ul>
        </section>
        <HotelBenefits />
        <HotelInfo />
        <HotelImageUpdate {data} />
        <div><button class="logout" on:click={logOut}>Logout</button></div>
    </div>
</div>

<style lang="scss">
    .dark {
        color: white;
        .create-room {
            p {
                color: white;
                background-color: red;
            }
            button {
                background-color: $dark-red;
            }
        }
        ul {
            li {
                border: 1px solid white;
                button {
                    background-color: $dark-red;
                }
                &:hover {
                    background-color: $dark-red;
                    .checkout {
                        color: $dark-red;
                    }
                }
            }
        }
    }
    .bookInfo {
        display: grid;
        grid-template-columns: 1fr 1fr;

        .user {
            display: flex;
            flex-direction: column;
            align-items: end;
            h2 {
                max-width: 100px;
                overflow: hidden;
            }
            img {
                width: 42px;
                height: 42px;
                aspect-ratio: 1/1;
                display: block;
                border-radius: 50%;
            }
        }
    }
    .logout {
        margin-top: 2rem;
        padding: 0.25rem 0.5rem;
        border: none;
        color: white;
        font-size: 1.1rem;
        transition: 0.15s ease-in-out;
        cursor: pointer;
        &:hover {
            transform: scale(1.1);
        }
        background-color: rgb(235, 55, 55);
    }
    .create-room {
        p {
            color: red;
            width: max-content;
        }
        input {
            width: 200px;
            padding: 0.25rem 0.5rem;
            &:focus {
                outline: none;
                box-shadow: none;
            }
        }
        button {
            padding: 0.25rem 0.5rem;
            background-color: $pink2;
            border: none;
            color: white;
            font-size: 1rem;
            margin-top: 1rem;
            transition: 0.15s ease-in-out;
            cursor: pointer;
            &:hover {
                transform: scale(1.1);
            }
            &:disabled {
                cursor: not-allowed;
            }
        }
    }
    section {
        margin-bottom: 2rem;
    }
    .request {
        position: absolute;
        display: flex;
        width: 95%;
        right: 2.5%;
        bottom: 5%;
        justify-content: space-between;
        button {
            position: relative;
            bottom: 0;
            right: 0;
        }
        .reject {
            background-color: rgb(243, 42, 42);
        }
        .accept {
            background-color: rgb(1, 165, 1);
        }
    }
    h1 {
        span {
            font-weight: normal;
            font-size: 1.2rem;
        }
    }
    ul {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        row-gap: 1rem;
        column-gap: 1rem;
        li {
            position: relative;
            min-height: 130px;
            border: 1px solid black;
            padding: 0.5rem;
            transition: 0.15s ease-in-out;
            &:hover {
                color: white;
                border: none;
                background-color: $pink2;
                transform: scale(1.1);
                z-index: 4;
                button {
                    background-color: white;
                }
                .reject {
                    color: rgb(243, 42, 42);
                }
                .accept {
                    color: rgb(1, 165, 1);
                }
                .checkout {
                    color: $pink2;
                }
                .reject,
                .accept,
                .checkout {
                    background-color: white;
                    font-weight: bold;
                }
            }
            button {
                position: absolute;
                bottom: 5%;
                right: 2%;
                padding: 0.5rem;
                background-color: $pink2;
                border: none;
                color: white;
                transition: 0.15s ease-in-out;
                cursor: pointer;
            }
            h2 {
                font-size: 1.1rem;
            }
            h3 {
                font-size: 0.8rem;
                font-weight: normal;
            }
        }
    }
    .grid {
        display: grid;
    }
    .container {
        position: relative;
        z-index: 2;
        padding-top: 1rem;
        padding-bottom: 1rem;
    }
    * {
        font-family: "Poppins", sans-serif;
    }
</style>
