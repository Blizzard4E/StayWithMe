<script>
    import { PUBLIC_API_URL } from "$env/static/public";
    import { onMount } from "svelte";
    import BackgroundStarsPink from "../../components/BackgroundStarsPink.svelte";
    import { darkMode, transitionState } from "../../store";
    import { goto } from "$app/navigation";
    import { country, user } from "../stores";
    import jwt_decode from "jwt-decode";
    export let data;
    let countryData;
    let searchText = "";
    let searchResults = [];
    let searchTextResults = [];
    let userData;
    let alphabetical = true;
    let notAlphabetical = false;
    let ratingsHigh = false;
    let ratingsLow = false;
    let isDark;
    let isLoading = false;

    darkMode.subscribe((value) => (isDark = value));

    user.subscribe((value) => (userData = value));
    country.subscribe((value) => (countryData = value));

    const countries = [
        "Bangladesh",
        "Brazil",
        "Cambodia",
        "China",
        "Colombia",
        "Egypt",
        "France",
        "Germany",
        "India",
        "Indonesia",
        "Iran",
        "Italy",
        "Japan",
        "Laos",
        "Malaysia",
        "Mexico",
        "Myanmar",
        "Nigeria",
        "Pakistan",
        "Philippines",
        "Russia",
        "Singapore",
        "South Africa",
        "South Korea",
        "Thailand",
        "Turkey",
        "United Kingdom",
        "United States",
        "Vietnam",
    ];

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

    let timer;
    async function searchHotelsByCountry() {
        clearTimeout(timer);
        timer = setTimeout(async () => {
            if (userData) {
                const tokenCheck = await checkToken().catch((err) => {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    transition("/login");
                });
                if (tokenCheck) {
                    isLoading = true;
                    fetch(PUBLIC_API_URL + "/users/searchHotels", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            token: localStorage.getItem("access_token"),
                            country: countryData,
                        }),
                    })
                        .then((res) => res.json())
                        .then((jsonData) => {
                            if (jsonData.status == 200) {
                                searchResults = jsonData.data;
                                isLoading = false;
                                applySearchText();
                            }
                            console.log(jsonData);
                        });
                }
            }
        }, 800);
    }

    function turnOffFilters() {
        alphabetical = false;
        notAlphabetical = false;
        ratingsHigh = false;
        ratingsLow = false;
    }

    function applyFilter() {
        let newArray = searchTextResults.slice();
        if (alphabetical) {
            newArray.sort((a, b) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();

                if (nameA > nameB) {
                    return 1;
                } else if (nameA < nameB) {
                    return -1;
                } else {
                    return 0;
                }
            });
        } else if (notAlphabetical) {
            newArray.sort((a, b) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();

                if (nameA < nameB) {
                    return 1;
                } else if (nameA > nameB) {
                    return -1;
                } else {
                    return 0;
                }
            });
        } else if (ratingsHigh) {
            newArray = newArray.sort((a, b) => b.ratings - a.ratings);
        } else if (ratingsLow) {
            newArray = newArray.sort((a, b) => a.ratings - b.ratings);
        }
        searchTextResults = newArray.slice();
        console.log("Filtered");
        console.log(searchTextResults);
    }

    function applySearchText() {
        searchTextResults = [];
        searchResults.forEach((result) => {
            if (
                result.name.toUpperCase().search(searchText.toUpperCase()) >= 0
            ) {
                searchTextResults.push(result);
            }
        });
        console.log("By Search Text");
        applyFilter();
    }

    onMount(() => {
        transitionState.update((state) => 0);
        searchHotelsByCountry();
    });
    function hotel() {
        transitionState.update((state) => 1);
        setTimeout(() => {
            goto("/hotel");
        }, 800);
    }
    function transition(path) {
        transitionState.update((state) => 1);
        setTimeout(() => {
            goto(path);
        }, 800);
    }
</script>

<div class="main-bg" class:dark={isDark == 1}>
    <div class="container">
        <div class="grid">
            <div class="filter">
                <h2>Sort By</h2>
                <h3>Name</h3>
                <div>
                    <button
                        class:active={alphabetical}
                        on:click={() => {
                            turnOffFilters();
                            alphabetical = true;
                            applyFilter();
                        }}
                    >
                        A-Z
                    </button>
                    <button
                        class:active={notAlphabetical}
                        on:click={() => {
                            turnOffFilters();
                            notAlphabetical = true;
                            applyFilter();
                        }}
                    >
                        Z-A
                    </button>
                </div>
                <h3>Ratings</h3>
                <div>
                    <button
                        class:active={ratingsHigh}
                        on:click={() => {
                            turnOffFilters();
                            ratingsHigh = true;
                            applyFilter();
                        }}
                    >
                        High to Low
                    </button>
                    <button
                        class:active={ratingsLow}
                        on:click={() => {
                            turnOffFilters();
                            ratingsLow = true;
                            applyFilter();
                        }}
                    >
                        Low to High
                    </button>
                </div>
            </div>
            <div>
                <div>
                    <input
                        type="text"
                        placeholder="Search..."
                        bind:value={searchText}
                        on:input={applySearchText}
                    />
                    <label for="country">Country:</label>
                    <select
                        bind:value={countryData}
                        on:change={searchHotelsByCountry}
                    >
                        {#each countries as country_}
                            <option value={country_}>{country_}</option>
                        {/each}
                    </select>
                </div>
                <h2 style="margin-top: 2rem;">Hotels</h2>
                {#if isLoading}
                    <div class="loader">
                        <div class="loading">
                            <div class="lds-ring">
                                <div />
                                <div />
                                <div />
                                <div />
                            </div>
                        </div>
                    </div>
                {/if}
                <ul>
                    {#each searchTextResults as hotel, i}
                        <li on:click={() => transition("/hotel/" + hotel.id)}>
                            <img src={hotel.images[4]} alt="" />
                            <div class="info">
                                <div class="detail">
                                    <div>
                                        <h3>{hotel.name}</h3>
                                        <h4>Country: {hotel.country}</h4>
                                        <h4 class="benefits">
                                            Benefits:
                                            {#each hotel.benefits as benefit}
                                                <span>{benefit}</span>
                                            {/each}
                                        </h4>
                                    </div>
                                    <p>
                                        {hotel.description}
                                    </p>
                                </div>
                                <div>
                                    <div class="rating">
                                        <h3>{hotel.ratings}</h3>
                                        <img src="/images/star.png" alt="" />
                                    </div>
                                </div>
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .main-bg {
        position: relative;
        z-index: 2;
        background-color: rgba(255, 255, 255, 0.4);
        width: 100%;
        min-height: 100vh;
    }
    .loader {
        display: grid;
        place-items: center;
        width: 100%;
        height: 100%;
    }
    .dark {
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        .filter {
            .active {
                background-color: $dark-red;
            }
            button {
                &:hover {
                    background-color: $dark-red;
                }
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
    input,
    select {
        width: 400px;
        padding: 0.5rem;
        &:focus {
            outline: none;
            box-shadow: none;
        }
    }
    select {
        width: auto;
    }
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
    }
    * {
        font-family: "Poppins", sans-serif;
    }
    .grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        width: 100%;
    }
    .benefits {
        span {
            &:first-child {
                &::before {
                    content: " ";
                }
            }
            &::before {
                content: ", ";
            }
        }
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
            p {
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2; /* number of lines to show */
                -webkit-box-orient: vertical;
            }
            img {
                width: 100%;
                aspect-ratio: 1/1;
                object-fit: cover;
            }
        }
    }
</style>
