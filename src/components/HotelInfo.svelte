<script>
    import { hotel } from "../routes/stores";
    import jwt_decode from "jwt-decode";
    import { goto } from "$app/navigation";
    import { darkMode } from "../store";
    import { PUBLIC_API_URL } from "$env/static/public";
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

    let hotelData;
    let name, description, country, googleMap;

    let isDark;
    let isLoading = false;

    darkMode.subscribe((value) => (isDark = value));

    hotel.subscribe((value) => {
        hotelData = value;
        if (hotelData) {
            name = hotelData.name;
            description = hotelData.description;
            country = hotelData.country;
            googleMap = hotelData.googleMap;
        }
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

    async function updateInfo() {
        const tokenCheck = await checkToken().catch((err) => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            transition("/login");
        });
        if (tokenCheck) {
            isLoading = true;
            fetch(PUBLIC_API_URL + "/hotels/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: hotelData.id,
                    token: localStorage.getItem("access_token"),
                    name: name,
                    description: description,
                    country: country,
                    googleMap: googleMap,
                }),
            })
                .then((res) => res.json())
                .then((jsonData) => {
                    console.log(jsonData);
                    if (jsonData.status == 200) {
                        hotelData.name = name;
                        hotelData.description = description;
                        hotelData.country = country;
                        hotelData.googleMap = googleMap;
                        hotel.update((value) => hotelData);
                        isLoading = false;
                    }
                });
        }
    }
    function transition(path) {
        transitionState.update((state) => 1);
        setTimeout(() => {
            goto(path);
        }, 800);
    }
</script>

{#if hotelData}
    <section class:dark={isDark == 1}>
        <h1>Hotel Name</h1>
        <input type="text" bind:value={name} />
        <h1>Description</h1>
        <input type="text" bind:value={description} />
        <h1>Country</h1>
        <label for="country">Country:</label>
        <select bind:value={country}>
            {#each countries as country_}
                <option value={country_}>{country_}</option>
            {/each}
        </select>
        <h1>Google Map Name</h1>
        <input type="text" bind:value={googleMap} />
        <div class="map">
            <iframe
                width="425"
                height="350"
                frameborder="0"
                scrolling="no"
                marginheight="0"
                marginwidth="0"
                src={"https://maps.google.com/maps?&q=" +
                    encodeURIComponent(googleMap) +
                    "&output=embed"}
            />
        </div>
        <div><button on:click={updateInfo}>Update Info</button></div>
        {#if isLoading}
            <div class="loading" style="margin-top: .5rem;">
                <div class="lds-ring">
                    <div />
                    <div />
                    <div />
                    <div />
                </div>
                <p>Updating Hotel Info</p>
            </div>
        {/if}
    </section>
{/if}

<style lang="scss">
    .map {
        margin-top: 1rem;
    }
    h1 {
        font-size: 1.4rem;
        margin-bottom: 0.5rem;
    }
    button {
        padding: 0.75rem 1rem;
        background-color: rgb(25, 151, 255);
        border: none;
        color: white;
        font-size: 1rem;
        margin-top: 1rem;
        transition: 0.15s ease-in-out;
        cursor: pointer;
        &:hover {
            transform: scale(1.1);
        }
    }
    input,
    select {
        width: 400px;
        padding: 0.5rem 1rem;
        &:focus {
            outline: none;
            box-shadow: none;
        }
    }
    section {
        margin-top: 1rem;
    }
    select {
        width: auto;
    }
</style>
