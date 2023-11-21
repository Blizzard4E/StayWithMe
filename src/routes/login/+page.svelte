<script>
    import { onMount } from "svelte";
    import { darkMode, transitionState } from "../../store";
    import { goto } from "$app/navigation";
    let isDark;
    import { PUBLIC_API_URL } from "$env/static/public";
    darkMode.subscribe((value) => (isDark = value));
    let email = "",
        password = "",
        failed = false;
    let emailError = false;
    let emailInvalid = true;
    let isLoading = false;
    let passwordError = false;

    function emailValidation() {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            emailInvalid = false;
        } else {
            emailInvalid = true;
        }
    }

    function passwordValidation() {
        if (password.length <= 0) passwordError = true;
        else passwordError = false;
    }

    async function login() {
        passwordValidation();
        if (emailInvalid) {
            emailError = true;
            return;
        }
        if (passwordError) {
            return;
        }
        isLoading = true;
        fetch(PUBLIC_API_URL + "/login", {
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
                } else {
                    failed = true;
                    isLoading = false;
                }
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
        }, 800);
    }
</script>

<div class="main-bg" class:dark={isDark == 1}>
    <div class="container">
        <form on:submit|preventDefault={login}>
            <h1>
                <span>L</span>
                ogin
            </h1>
            <h3>Email</h3>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    bind:value={email}
                    on:input={emailValidation}
                />
                {#if emailError && emailInvalid}
                    <p class="error">Invalid Email</p>
                {/if}
            </div>
            <h3>Password</h3>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    bind:value={password}
                    on:input={passwordValidation}
                />
                {#if passwordError}
                    <p class="error">Password must not be empty</p>
                {/if}
            </div>
            {#if failed}
                <p class="error">Wrong Email or Password</p>
            {/if}
            <button disabled={isLoading}>Login</button>
            {#if isLoading}
                <div class="loading">
                    <div class="lds-ring">
                        <div />
                        <div />
                        <div />
                        <div />
                    </div>
                    <p>Logging In</p>
                </div>
            {/if}
        </form>
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
    .dark {
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        h1 {
            span {
                color: $dark-red;
            }
        }
        form {
            button {
                background-color: $dark-red;
            }
        }
        .error {
            color: white;
            background-color: red;
        }
    }
    .error {
        color: red;
        font-size: 0.9rem;
        width: max-content;
        margin-top: 0.25rem;
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
            margin: 1rem 0;
            padding: 0.5rem 0.75rem;
            background-color: $pink2;
            color: white;
            font-weight: bold;
            border: none;
            font-size: 1rem;
            transition: 0.15s ease-in-out;
            cursor: pointer;
            &:hover {
                transform: scale(1.1);
            }
            &:disabled {
                cursor: wait;
            }
        }
    }
    h1 {
        span {
            color: $pink2;
        }
    }
</style>
