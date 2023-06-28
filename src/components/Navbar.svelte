<script>
    import jwt_decode from "jwt-decode";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { transitionState } from "../store";
    import BackgroundStarsPink from "./BackgroundStarsPink.svelte";
    import ThreeDBackgroundVertical from "./ThreeDBackgroundVertical.svelte";
    import { user, hotel } from "../routes/stores";
    import { page } from "$app/stores";

    let userData;
    let hotelData;

    user.subscribe((value) => {
        userData = value;
    });
    hotel.subscribe((value) => {
        hotelData = value;
    });

    async function autoLogin() {
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
                    localStorage.setItem("access_token", jsonData.accessToken);
                    console.log("Successful auto login");
                    let decoded = jwt_decode(jsonData.accessToken);
                    if (decoded.hasOwnProperty("username")) {
                        user.update((value) => decoded);
                    } else {
                        hotel.update((value) => decoded);
                    }
                }
                console.log(jsonData);
            })
            .catch((error) => console.error("Error:", error));
    }

    onMount(() => {
        if (document.cookie.indexOf("refreshToken") >= 0) {
            const token = ("; " + document.cookie)
                .split(`; refreshToken=`)
                .pop()
                .split(";")[0];
            const decodedToken = jwt_decode(token);
            if (decodedToken.is_user) {
                is_user.update((value) => true);
            } else is_user.update((value) => false);
        }
        if (
            $page.url.pathname == "/signUp" ||
            $page.url.pathname == "/createHotel"
        )
            return;
        autoLogin();
    });

    /**
     * @param {string | URL} path
     */
    function transition(path) {
        transitionState.update((state) => 1);
        setTimeout(() => {
            goto(path);
        }, 1000);
    }
</script>

<div class="objects"><ThreeDBackgroundVertical /></div>
<BackgroundStarsPink />
<div class="container">
    <nav>
        <div
            class="logo"
            on:click={() => {
                transition("/");
            }}
        >
            <h1>S<span>T</span>A<span>Y</span></h1>
            <h2>
                W<span class="medium">I</span><span class="small">TH</span><span
                    class="medium">M</span
                >E
            </h2>
        </div>
        {#if !userData && !hotelData}
            <div class="signUp">
                <a
                    on:click={() => {
                        if ($page.url.pathname != "/signUp")
                            transition("/signUp");
                        console.log($page.url.pathname);
                    }}>Create User Account</a
                >
                <a
                    on:click={() => {
                        if ($page.url.pathname != "/createHotel")
                            transition("/createHotel");
                        console.log($page.url.pathname);
                    }}>Create Hotel Account</a
                >
            </div>
        {/if}
        {#if userData}
            <div class="others">
                <a
                    on:click={() => {
                        if ($page.url.pathname != "/search")
                            transition("/search");
                        console.log($page.url.pathname);
                    }}>Search</a
                >
                <a
                    on:click={() => {
                        if ($page.url.pathname != "/home") transition("/home");
                        console.log($page.url.pathname);
                    }}>Home</a
                >
                <div
                    class="profile"
                    on:click={() => {
                        if ($page.url.pathname != "/profile")
                            transition("/profile");
                        console.log($page.url.pathname);
                    }}
                >
                    <h3>
                        <span>{userData.username[0]}</span
                        >{userData.username.substring(1)}
                    </h3>
                    <img src={userData.profile_pic} alt="" />
                </div>
            </div>
        {/if}
        {#if hotelData}
            <div class="others">
                <div class="profile">
                    <h3>
                        <span>{hotelData.name[0]}</span
                        >{hotelData.name.substring(1)}
                    </h3>
                    <img src={hotelData.images[4]} alt="" />
                </div>
            </div>
        {/if}
    </nav>
</div>

<style lang="scss">
    .signUp {
        display: flex;
    }
    .signUp a {
        background: none;
        color: black;
        font-weight: normal;
        padding: 0;
        cursor: pointer;
        font-size: 1rem;
    }
    .objects {
        position: relative;
        z-index: 0;
    }
    .others {
        display: flex;
        align-items: center;
    }
    .bell {
        cursor: pointer;
        margin-right: 2rem;
        transition: 0.15s ease-in-out;
        img {
            filter: invert(70%) sepia(89%) saturate(4718%) hue-rotate(301deg)
                brightness(100%) contrast(106%);
            width: 30px;
            height: auto;
        }
        &:hover {
            transform: scale(1.1);
        }
    }
    .hide {
        display: none;
    }
    .links {
        display: flex;
        align-items: center;
    }
    a {
        color: black;
        margin: 1rem;
        text-decoration: none;
        font-family: "Poppins", sans-serif;
        cursor: pointer;
        transition: 0.1s ease-in-out;
        &:hover {
            transform: scale(1.1);
            color: $pink2;
        }
    }
    .profile {
        cursor: pointer;
        display: flex;
        align-items: center;
        &:hover {
            transition: 0.2s ease-in-out;
            transform: scale(1.1);
        }
        h3 {
            font-family: "Poppins", sans-serif;
            font-size: 1.5rem;
            margin-right: 1rem;
            span {
                color: $pink2;
            }
        }
        img {
            border: 3px solid $pink2;
            width: 84px;
            height: 84px;
            object-fit: cover;
            border-radius: 50%;
        }
    }
    nav {
        background-color: rgba(252, 247, 247, 0.7);
        justify-content: space-between;
        position: relative;
        padding-top: 1rem;
        z-index: 2;
        display: flex;
    }
    .logo {
        cursor: pointer;
        display: grid;
        place-items: center;

        &:hover {
            transition: 0.15s ease-in-out;
            transform: scale(1.1);
        }

        h1,
        h2 {
            font-family: "Yeseva One", cursive;
            font-weight: normal;
            font-size: 4rem;
            color: $pink2;
            user-select: none;
            span {
                color: black;
            }
        }
        h2 {
            display: flex;
            align-items: center;
            letter-spacing: 0.2rem;
            font-family: "Righteous", cursive;
            font-size: 1.5rem;
            color: black;
            margin-top: -0.8rem;
            -webkit-text-stroke-width: 1px;
            .medium {
                font-size: 1.3rem;
            }
            .small {
                font-size: 1rem;
            }
        }
    }
</style>
