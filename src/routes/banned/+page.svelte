<script>
    import { onMount } from "svelte";
    import { darkMode } from "../../store";
    import { goto } from "$app/navigation";
    import { transitionState } from "../../store";
    import { hotel, user } from "../stores";

    let isDark;

    darkMode.subscribe((value) => (isDark = value));

    onMount(async () => {
        transitionState.update((state) => 0);
    });

    function logOut() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        user.update((value) => null);
        hotel.update((value) => null);
        transition("/login");
    }

    function transition(path) {
        transitionState.update((state) => 1);
        setTimeout(() => {
            goto(path);
        }, 800);
    }
</script>

<div class="main-bg" class:dark={isDark == 1}>
    <div class="center container">
        <div>
            <h1>Account is <span>BANNED</span></h1>
            <div class="center"><button on:click={logOut}>Log Out</button></div>
        </div>
    </div>
</div>

<style lang="scss">
    .main-bg {
        background-color: rgba(255, 255, 255, 0.4);
        position: relative;
        z-index: 2;
        width: 100%;
    }
    .dark {
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        button {
            background-color: $dark-red;
        }
        h1 {
            span {
                color: $dark-red;
            }
        }
    }
    .center {
        display: grid;
        place-items: center;
        font-family: "Poppins", sans-serif;
    }
    h1 {
        span {
            color: $pink2;
        }
    }
    button {
        margin-top: 2rem;
        background-color: $pink2;
        padding: 0.5rem;
        border: none;
        font-size: 1.1rem;
        color: white;
        transition: 0.15s ease-in-out;
        cursor: pointer;
        &:hover {
            transform: scale(1.1);
        }
    }
    .container {
        position: relative;
        z-index: 1;
        height: 90vh;
    }
</style>
