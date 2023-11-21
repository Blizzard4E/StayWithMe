<script>
    import jwt_decode from "jwt-decode";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { darkMode, transitionState } from "../store";
    import BackgroundStarsPink from "./BackgroundStarsPink.svelte";
    import ThreeDBackgroundVertical from "./ThreeDBackgroundVertical.svelte";
    import { user, hotel } from "../routes/stores";
    import { page } from "$app/stores";
    import ThreeDBackgroundVerticalDark from "./ThreeDBackgroundVerticalDark.svelte";
    import BackgroundStarsRed from "./BackgroundStarsRed.svelte";
    import BackgroundStarsRedBehind from "./BackgroundStarsRedBehind.svelte";
    import { PUBLIC_API_URL } from "$env/static/public";
    let userData;
    let hotelData;
    let isDark;

    darkMode.subscribe((value) => (isDark = value));

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
                    localStorage.setItem("access_token", jsonData.accessToken);
                    console.log("Successful auto login");
                    let decoded = jwt_decode(jsonData.accessToken);
                    if (decoded.hasOwnProperty("username")) {
                        user.update((value) => decoded);
                    } else {
                        hotel.update((value) => decoded);
                    }
                    if (decoded.banned) {
                        transition("/banned");
                    }
                }
                console.log(jsonData);
            })
            .catch((error) => console.error("Error:", error));
    }

    onMount(() => {
        if (
            $page.url.pathname == "/signUp" ||
            $page.url.pathname == "/createHotel" ||
            $page.url.pathname == "/banned"
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
        }, 800);
    }
</script>

<div class="objects">
    {#if isDark == 1}
        <ThreeDBackgroundVerticalDark />
    {:else}
        <ThreeDBackgroundVertical />
    {/if}
</div>
{#if isDark == 1}
    <BackgroundStarsRedBehind />
{:else}
    <BackgroundStarsPink />
{/if}
<div class="main-bg" class:bg-dark={isDark == 1}>
    <div class="container">
        <nav>
            <div
                class="logo"
                on:click={() => {
                    transition("/");
                }}
            >
                <h1>S<span>T</span>A<span>Y</span>
                </h1>
                <h2>
                    W
                    <span class="medium">I</span>
                    <span class="small">TH</span>
                    <span class="medium">M</span>
                    E
                </h2>
            </div>
            {#if !userData && !hotelData}
                <div class="signUp">
                    <a
                        on:click={() => {
                            if ($page.url.pathname != "/login")
                                transition("/login");
                            console.log($page.url.pathname);
                        }}
                    >
                        Login
                    </a>
                    <a
                        on:click={() => {
                            if ($page.url.pathname != "/signUp")
                                transition("/signUp");
                            console.log($page.url.pathname);
                        }}
                    >
                        Create User Account
                    </a>
                    <a
                        on:click={() => {
                            if ($page.url.pathname != "/createHotel")
                                transition("/createHotel");
                            console.log($page.url.pathname);
                        }}
                    >
                        Create Hotel Account
                    </a>
                </div>
            {/if}
            {#if userData}
                <div class="others">
                    <a
                        on:click={() => {
                            if ($page.url.pathname != "/search")
                                transition("/search");
                            console.log($page.url.pathname);
                        }}
                    >
                        Search
                    </a>
                    <a
                        on:click={() => {
                            if ($page.url.pathname != "/home")
                                transition("/home");
                            console.log($page.url.pathname);
                        }}
                    >
                        Home
                    </a>
                    <div
                        class="profile"
                        on:click={() => {
                            if ($page.url.pathname != "/profile")
                                transition("/profile");
                            console.log($page.url.pathname);
                        }}
                    >
                        <h3>
                            <span>{userData.username[0]}</span>
                            {userData.username.substring(1)}
                        </h3>
                        <img src={userData.profile_pic} alt="" />
                    </div>
                </div>
            {/if}
            {#if hotelData}
                <div class="others">
                    <div class="profile">
                        <h3>
                            <span>{hotelData.name[0]}</span>
                            {hotelData.name.substring(1)}
                        </h3>
                        <img src={hotelData.images[4]} alt="" />
                    </div>
                </div>
            {/if}
        </nav>
    </div>
</div>

<style lang="scss">
    .main-bg {
        position: relative;
        z-index: 1;
        background-color: rgba(255, 255, 255, 0.4);
    }
    .bg-dark {
        background: rgba(0, 0, 0, 0.5);

        a {
            color: white;
            &:hover {
                color: $dark-red;
            }
        }
        .logo {
            h1 {
                color: $dark-red;
                span {
                    color: white;
                }
            }
            h2 {
                color: white;
                span {
                    color: white;
                }
            }
        }
        .profile {
            h3 {
                color: white;
                span {
                    color: $dark-red;
                }
            }
            img {
                border: 3px solid $dark-red;
            }
        }
        .signUp {
            a {
                color: white;
                &:hover {
                    transform: scale(1.1);
                    color: $dark-red;
                }
            }
        }
    }
    .signUp {
        display: flex;
    }
    .signUp a {
        background: none;
        color: black;
        font-weight: bold;
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
        font-weight: bold;
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
        transition: 0.2s ease-in-out;
        &:hover {
            transform: scale(1.1);
        }
        h3 {
            font-family: "Poppins", sans-serif;
            font-size: 1.5rem;
            margin-right: 1rem;
            span {
                font-size: 1.6rem;
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
