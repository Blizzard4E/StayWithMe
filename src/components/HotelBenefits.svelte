<script>
    import { hotel } from "../routes/stores";
    import jwt_decode from "jwt-decode";
    import { goto } from "$app/navigation";
    const benefits = [
        "Bedroom",
        "Bathroom",
        "Living room",
        "Kitchen",
        "Balcony",
        "Swimming pool",
        "Gym",
        "Spa",
        "Sauna",
        "Free Wi-Fi",
        "Free parking",
        "Room Service",
        "Air conditioning",
        "Breakfast",
        "Laundry Service",
    ];

    let hotelData;
    let selectedBenefits = [];

    hotel.subscribe((value) => {
        hotelData = value;
        if (hotelData) {
            selectedBenefits = hotelData.benefits;
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

    async function updateBenefits() {
        const tokenCheck = await checkToken().catch((err) => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            transition("/login");
        });
        if (tokenCheck) {
            fetch("https://stay-withme-api.cyclic.app/hotels/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: hotelData.id,
                    token: localStorage.getItem("access_token"),
                    benefits: selectedBenefits,
                }),
            })
                .then((res) => res.json())
                .then((jsonData) => {
                    console.log(jsonData);
                    if (jsonData.status == 200) {
                        hotelData.benefits = selectedBenefits;
                        hotel.update((value) => hotelData);
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
    <section>
        <h1>Benefits</h1>
        <ul>
            {#each benefits as benefit}
                <li class:active={selectedBenefits.includes(benefit)}>
                    <label>
                        <input
                            type="checkbox"
                            bind:group={selectedBenefits}
                            value={benefit}
                            checked={selectedBenefits.includes(benefit)}
                        />
                        {benefit}
                    </label>
                </li>
            {/each}
        </ul>
        <button on:click={updateBenefits}>Update Benefits</button>
    </section>
{/if}

<style lang="scss">
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
    ul {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        column-gap: 1rem;
        row-gap: 1rem;
        li {
            display: grid;
            place-items: center;
            border: 1px solid black;
            transition: 0.15s ease-in-out;
            &:hover {
                transform: scale(1.2);
                border: 1px solid $pink2;
                color: $pink2;
            }
        }
        .active {
            background-color: $pink2;
            border: 1px solid $pink2;
            color: white;

            &:hover {
                background-color: $pink2;
                color: white;
            }
        }
        label {
            padding: 0.25rem 0.5rem;

            input {
                width: 0;
                opacity: 0;
            }
        }
    }
</style>
