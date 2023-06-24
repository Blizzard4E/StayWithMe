<script>
    import { onMount } from "svelte";
    import { transitionState } from "../../store";
    import { goto } from "$app/navigation";

    let email = "",
        password = "",
        isUser = true,
        failed = false;

    async function login() {
        console.log("Requesting");
        let data;
        if (email.length == 0 || password.length == 0) {
            failed = true;
            return;
        }
        if (isUser) {
            const response = await fetch("../api/users/login", {
                method: "POST",
                body: JSON.stringify({ email: email, password: password }),
            });
            data = await response.json();
        } else {
            const response = await fetch("../api/hotels/login", {
                method: "POST",
                body: JSON.stringify({ email: email, password: password }),
            });
            data = await response.json();
        }
        if (data.status == 200) {
            document.cookie = data.accessToken;
            document.cookie = data.refreshToken;
            goto("/home");
        } else failed = true;
    }

    function changeRole() {
        isUser = !isUser;
    }

    onMount(() => {
        transitionState.update((state) => 0);
    });
</script>

<div class="container">
    <form>
        <h1><span>L</span>ogin</h1>
        <div class="role">
            <button on:click={changeRole} disabled={isUser}>User</button>
            <button on:click={changeRole} disabled={!isUser}>Hotel</button>
        </div>
        <h3>Email</h3>
        <div><input type="text" placeholder="Email" bind:value={email} /></div>
        <h3>Password</h3>
        <div>
            <input type="text" placeholder="Password" bind:value={password} />
        </div>
        <div class="signUp">
            {#if isUser}
                <a href="../signUp">Don't have an account?</a>
            {:else}
                <a href="../createHotel">Don't have a hotel?</a>
            {/if}
        </div>
        {#if failed}
            <p class="fail">Wrong Email or Password</p>
        {/if}
        <button on:click={login}>Login</button>
    </form>
</div>

<style lang="scss">
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
    .signUp {
        padding-top: 1rem;
    }
    .signUp a {
        background: none;
        color: black;
        font-weight: normal;
        padding: 0;
        cursor: pointer;
        font-size: 1rem;
    }
    .container {
        display: grid;
        place-items: center;
        position: relative;
        z-index: 2;
        padding-top: 1rem;
        padding-bottom: 1rem;
        background-color: rgba(252, 247, 247, 0.7);
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
