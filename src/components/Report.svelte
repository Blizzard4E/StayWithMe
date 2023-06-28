<script>
    import { goto } from "$app/navigation";
    import jwt_decode from "jwt-decode";
    import { user } from "../routes/stores";

    export let reviewData;

    let userData;

    user.subscribe((value) => {
        userData = value;
    });

    let reported = false;

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

    async function reportUser() {
        const tokenCheck = await checkToken().catch((err) => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            transition("/login");
        });
        if (tokenCheck) {
            fetch("https://stay-withme-api.cyclic.app/users/report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: reviewData.user_id,
                    review_id: reviewData.review_id,
                    token: localStorage.getItem("access_token"),
                }),
            })
                .then((res) => res.json())
                .then((jsonData) => {
                    console.log(jsonData);
                    if (jsonData.status == 200) {
                        reported = true;
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

<div class="review">
    <div class="wrap">
        {#if reported}
            <p>Reported</p>
        {:else}
            <button on:click={reportUser}>
                <img src="/images/report.png" alt="" />
            </button>
        {/if}
    </div>
</div>

<style lang="scss">
    .review {
        position: absolute;
        left: 2rem;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: end;

        &:hover {
            button {
                pointer-events: auto;
                opacity: 1;
            }
        }

        .wrap {
            display: flex;
            align-items: end;
            margin-bottom: 0.5rem;
        }
        button {
            cursor: pointer;
            border: none;
            background: none;
            width: 26px;
            opacity: 0;
            pointer-events: none;
            transition: 0.15s ease-in-out;
        }
        img {
            display: block;
            width: 100%;
        }
        p {
            transform: translateX(2.5rem);
            font-size: 0.9rem;
            text-align: end;
            color: red;
        }
    }
</style>
