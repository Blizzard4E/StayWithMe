<script>
    import { hotel } from "../routes/stores";
    import jwt_decode from "jwt-decode";
    import { goto } from "$app/navigation";
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
                fetch("http://localhost:3000/autoLogin", {
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
            fetch("http://localhost:3000/hotels/update", {
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
                    }
                });
        }
    }
    function transition(path) {
        transitionState.update((state) => 1);
        setTimeout(() => {
            goto(path);
        }, 1000);
    }
</script>

{#if hotelData}
    <section>
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
    </section>
{/if}

<style lang="scss">
    .map {
        margin-top: 1rem;
    }
    h1 {
        font-size: 1.4rem;
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
    select {
        width: auto;
    }
</style>
