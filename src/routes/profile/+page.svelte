<script>
    import { onMount } from "svelte";
    import { darkMode, transitionState } from "../../store";
    import { goto } from "$app/navigation";
    import { user } from "../stores";
    import jwt_decode from "jwt-decode";
    import { PUBLIC_API_URL } from "$env/static/public";
    export let data;

    let userData;
    let reviewsData = [],
        bookingsData = [];
    let editMode = false;
    let isDark;

    let editName;
    let editBio;
    let editProfilePic;

    let isLoading = false,
        loadingText = "";

    user.subscribe((value) => {
        userData = value;
        getInfo();
    });

    darkMode.subscribe((value) => {
        isDark = value;
    });

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

    function logOut() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        user.update((value) => null);
        transition("/login");
    }
    async function getInfo() {
        if (userData) {
            const tokenCheck = await checkToken().catch((err) => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                transition("/login");
            });
            if (tokenCheck) {
                fetch(PUBLIC_API_URL + "/users/getInfo", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: localStorage.getItem("access_token"),
                        user_id: userData.id,
                    }),
                })
                    .then((res) => res.json())
                    .then((jsonData) => {
                        if (jsonData.status == 200) {
                            reviewsData = jsonData.reviewsData;
                            bookingsData = jsonData.bookingsData;
                        }
                        console.log(jsonData);
                    });
            }
        }
    }

    async function uploadImage() {
        return new Promise(async (resolve, reject) => {
            if (editProfilePic) {
                if (editProfilePic[0]) {
                    let formData = new FormData();
                    formData.append("file", editProfilePic[0]);
                    formData.append("upload_preset", data.preset_name);
                    formData.append("api_key", data.cloud_api_key);
                    loadingText = "Uploading Image";
                    fetch(
                        "https://api.cloudinary.com/v1_1/" +
                            data.cloud_name +
                            "/upload",
                        {
                            method: "POST",
                            body: formData,
                        }
                    )
                        .then((res) => res.json())
                        .then((image) => {
                            console.log("Uploaded New Profile Image");
                            resolve(image.url);
                        })
                        .catch((err) => reject(err));
                } else {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    }

    async function updateUser() {
        if (userData) {
            const tokenCheck = await checkToken().catch((err) => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                transition("/login");
            });
            if (tokenCheck) {
                isLoading = true;
                const profileImgLink = await uploadImage().catch((err) => {
                    isLoading = false;
                    return console.log(err);
                });
                let newData = {
                    token: localStorage.getItem("access_token"),
                    user_id: userData.id,
                };
                if (profileImgLink) {
                    newData.profile_pic = profileImgLink;
                }
                if (editBio.length > 0) {
                    newData.bio = editBio;
                }
                if (editName.length > 0) {
                    newData.username = editName;
                }
                loadingText = "Updating Profile";
                fetch(PUBLIC_API_URL + "/users/update", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newData),
                })
                    .then((res) => res.json())
                    .then((jsonData) => {
                        if (jsonData.status == 200) {
                            if (profileImgLink) {
                                userData.profile_pic = profileImgLink;
                            }
                            if (editBio.length > 0) {
                                userData.bio = editBio;
                            }
                            if (editName.length > 0) {
                                userData.username = editName;
                            }
                            user.update((value) => userData);
                            loadingText = "";
                            isLoading = false;
                            toggleEdit();
                        }
                        console.log(jsonData);
                    });
            }
        }
    }

    onMount(() => {
        transitionState.update((state) => 0);
        getInfo();
    });

    function toggleEdit() {
        editMode = !editMode;
        editName = "";
        editBio = "";
        editProfilePic = null;
    }

    function transition(path) {
        transitionState.update((state) => 1);
        setTimeout(() => {
            goto(path);
        }, 800);
    }
</script>

<div class="main-bg" class:dark={isDark == 1}>
    {#if userData}
        <div class="container">
            <div class="profile-grid">
                <div class="profile">
                    {#if editMode}
                        <div class="edit">
                            <h2>Profile</h2>
                            <input type="file" bind:files={editProfilePic} />
                        </div>
                    {/if}
                    <img src={userData.profile_pic} class:editMode alt="" />
                </div>
                <div class="info">
                    {#if editMode}
                        <h1>Name</h1>
                        <input type="text" bind:value={editName} />
                        <h2>Bio</h2>
                        <input type="text" bind:value={editBio} />
                    {:else}
                        <h1>{userData.username}</h1>
                        <h2>{userData.email}</h2>
                        <p>{userData.bio}</p>
                    {/if}

                    <div class="btn">
                        {#if isLoading}
                            <div class="loading">
                                <div class="lds-ring">
                                    <div />
                                    <div />
                                    <div />
                                    <div />
                                </div>
                                <p>{loadingText}</p>
                            </div>
                        {/if}
                        {#if editMode}
                            <button
                                class="confirm"
                                on:click={updateUser}
                                disabled={isLoading}
                            >
                                Confirm
                            </button>
                        {/if}
                        <button class="edit" on:click={toggleEdit}>
                            {#if editMode}
                                Cancel
                            {:else}
                                Edit
                            {/if}
                        </button>
                        <button class="logout" on:click={logOut}>
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
            <div class="grid">
                <div class="booking">
                    <h1>Bookings</h1>
                    <ul>
                        {#each bookingsData as booking}
                            <li
                                class:current={booking.on_going}
                                on:click={() =>
                                    transition("/hotel/" + booking.hotel_id.id)}
                            >
                                <img src={booking.hotel_id.images[4]} alt="" />
                                <div class="hotel">
                                    <h1>{booking.hotel_id.name}</h1>
                                    <h3>{booking.hotel_id.country}</h3>
                                    <h2>
                                        {#if booking.on_going}
                                            Staying In
                                        {:else}
                                            Checked Out
                                        {/if}
                                    </h2>
                                </div>
                                <div class="booking-info">
                                    <h1>Room {booking.room_id.number}</h1>
                                    <h2>
                                        {booking.days}
                                        {#if booking.days > 1}
                                            Days
                                        {:else}
                                            Day
                                        {/if}
                                    </h2>
                                    <h2>${booking.total_cost}</h2>
                                </div>
                            </li>
                        {/each}
                    </ul>
                </div>
                <div class="review">
                    <h1>Reviews</h1>
                    <ul>
                        {#each reviewsData as review}
                            <li>
                                <div class="message">
                                    <div class="profile">
                                        <img
                                            src={userData.profile_pic}
                                            alt=""
                                        />
                                    </div>
                                    <div
                                        class="comment"
                                        on:click={() =>
                                            transition(
                                                "/hotel/" + review.hotel_id.id
                                            )}
                                    >
                                        <div class="review-stars">
                                            <h1>{review.hotel_id.name}</h1>
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
                                </div>
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    .main-bg {
        position: relative;
        z-index: 2;
        background-color: rgba(255, 255, 255, 0.4);
        width: 100%;
        min-height: 100vh;
    }
    .dark {
        background: rgba(0, 0, 0, 0.5);
        color: white;
        .profile {
            border: 4px solid $dark-red;
        }
        .grid {
            .booking {
                li {
                    border: 1px solid white;
                    &:hover {
                        border: 1px solid $dark-red;
                        background-color: $dark-red;
                    }
                }
                .current {
                    border: 1px solid $dark-red;
                    background-color: $dark-red;
                }
            }
        }
        .review {
            ul {
                .message {
                    .profile {
                        border: 2px solid $dark-red;
                    }
                    .comment {
                        background-color: $dark-red;
                    }
                }
            }
        }
    }
    input {
        width: 400px;
        padding: 0.5rem 1rem;
        &:focus {
            outline: none;
            box-shadow: none;
        }
    }
    .review {
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
        ul {
            margin-top: 1rem;
            display: flex;
            flex-direction: column;
            row-gap: 0.5rem;
            li {
                display: flex;
            }
            .message {
                display: grid;
                grid-template-columns: 60px 1fr;
                column-gap: 0.5rem;
                transition: 0.15s ease-in-out;
                cursor: pointer;

                .profile {
                    border: 2px solid $pink2;
                    width: 52px;
                    aspect-ratio: 1/1;
                    align-self: flex-end;

                    img {
                        width: 100%;
                        display: block;
                        aspect-ratio: 1/1;
                        object-fit: cover;
                        border-radius: 50%;
                    }
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
                    width: 100%;
                    background-color: $pink2;
                    padding: 0.5rem;
                    border-radius: 14px;
                    border-bottom-left-radius: 0;
                    margin-bottom: 0.5rem;
                }
                p {
                    color: white;
                    font-size: 0.9rem;
                }
                &:hover {
                    transform: scale(1.05);
                }
            }
        }
    }
    .grid {
        margin-top: 2rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 2rem;
        .booking {
            .hotel {
                h1 {
                    font-size: 1.1rem;
                }
                h3 {
                    font-size: 1rem;
                    font-weight: normal;
                }
            }
            .booking-info {
                display: flex;
                flex-direction: column;
                align-items: end;
            }
            li {
                cursor: pointer;
                border: 1px solid black;
                padding: 0.5rem;
                display: grid;
                grid-template-columns: 1fr 2fr 2fr;
                margin-bottom: 1rem;
                column-gap: 1rem;
                transition: 0.15s ease-in-out;
                h1 {
                    font-size: 1.3rem;
                }
                h2 {
                    font-size: 1.2rem;
                }
                img {
                    width: 100%;
                    aspect-ratio: 1/1;
                    object-fit: cover;
                }
                &:hover {
                    border: 1px solid $pink2;
                    background-color: $pink2;
                    transform: scale(1.05);
                    color: white;
                }
            }
            .current {
                background-color: $pink2;
                color: white;
                border: 1px solid $pink2;
            }
        }
        h1 {
            font-size: 1.4rem;
        }
    }
    * {
        font-family: "Poppins", sans-serif;
    }
    h2 {
        font-weight: normal;
    }
    p {
        font-size: 1.1rem;
    }
    .btn {
        bottom: 0;
        right: 0;
        position: absolute;
        display: flex;
        column-gap: 0.5rem;
        button {
            padding: 0.25rem 0.5rem;
            border: none;
            color: white;
            font-size: 1.1rem;
            transition: 0.15s ease-in-out;
            cursor: pointer;
            &:hover {
                transform: scale(1.1);
            }
            &:disabled {
                cursor: wait;
            }
        }
        .confirm {
            background-color: rgb(127, 202, 13);
        }
        .edit {
            background-color: rgb(25, 151, 255);
        }
        .logout {
            background-color: rgb(235, 55, 55);
        }
    }
    .container {
        position: relative;
        z-index: 2;
        padding-top: 1rem;
        padding-bottom: 1rem;
    }
    .profile-grid {
        display: grid;
        grid-template-columns: 1fr 5fr;
        width: 100%;

        .info {
            position: relative;
            margin-left: 2rem;
        }
    }
    .profile {
        position: relative;
        border: 4px solid $pink2;
        border-radius: 50%;
        overflow: hidden;
        transition: 0.15s ease-in-out;
        cursor: pointer;
        &:hover {
            transform: scale(1.05);
        }
        .edit {
            color: white;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-17%, -50%);
            z-index: 3;
            h2 {
                margin-left: 2rem;
            }
        }
        img {
            width: 100%;
            aspect-ratio: 1/1;
            object-fit: cover;
        }
        img.editMode {
            filter: brightness(0.5);
        }
    }
</style>
