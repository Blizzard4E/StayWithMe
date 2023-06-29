<script>
    import { onMount } from "svelte";
    import { transitionState } from "../../store";
    import { goto } from "$app/navigation";

    let email = "",
        password = "",
        failed = false;

    async function login() {
        fetch("https://stay-withme-api.cyclic.app/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email, password: password }),
        })
            .then(async (res) => {
                const jsonData = await res.json();
                if (jsonData.status == 200) {
                    localStorage.setItem("access_token", jsonData.accessToken);
                    localStorage.setItem(
                        "refresh_token",
                        jsonData.refreshToken
                    );
                    transition("/home");
                } else failed = true;
                console.log(jsonData);
            })
            .catch((error) => console.error("Error:", error));
    }

    onMount(() => {
        transitionState.update((state) => 0);
    });
    function transition(path) {
        transitionState.update((state) => 1);
        setTimeout(() => {
            goto(path);
        }, 1000);
    }
</script>

<div class="main-bg">
    <div class="container">
        <form>
            <h1><span>L</span>ogin</h1>
            <h3>Email</h3>
            <div>
                <input type="text" placeholder="Email" bind:value={email} />
            </div>
            <h3>Password</h3>
            <div>
                <input
                    type="text"
                    placeholder="Password"
                    bind:value={password}
                />
            </div>
            {#if failed}
                <p class="fail">Wrong Email or Password</p>
            {/if}
            <button on:click={login}>Login</button>
        </form>
    </div>
</div>

<style lang="scss">
    .main-bg {
        position: relative;
        z-index: 2;
        background-color: rgba(255, 255, 255, 0.4);
        width: 100%;
        height: 100vh;
    }
    .fail {
        color: red;
    }
    .role {
        margin-bottom: 1rem;
        button {
            cursor: pointer;
            margin-right: 0.5rem;
            border: 1px solid $pink2;

            &:enabled {
                color: black;
                font-weight: normal;
                border: 1px solid black;
                background: none;
            }
        }
    }
    .container {
        display: grid;
        place-items: center;
        position: relative;
        z-index: 2;
        padding-top: 1rem;
        padding-bottom: 1rem;
    }
    * {
        font-family: "Poppins", sans-serif;
    }
    form {
        input {
            width: 400px;
            padding: 0.5rem 1rem;
            &:focus {
                outline: none;
                box-shadow: none;
            }
        }
        button {
            margin-top: 0.5rem;
            padding: 0.5rem 0.75rem;
            background-color: $pink2;
            color: white;
            font-weight: bold;
            border: none;
            font-size: 1rem;
            transition: 0.15s ease-in-out;
            &:hover {
                transform: scale(1.1);
            }
        }
    }
    h1 {
        span {
            color: $pink2;
        }
    }
</style>
