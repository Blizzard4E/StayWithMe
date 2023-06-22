<script>
    import { onMount } from "svelte";
    import { transitionState } from "../../store";

    let email,
        password,
        username,
        bio,
        profile_pic = "cat";

    async function signUp() {
        console.log("Requesting");
        const response = await fetch("../api/signUp", {
            method: "POST",
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                bio: bio,
                profile_pic: profile_pic,
            }),
        });
        const data = await response.json();
        if (data.status == 200) {
            document.cookie = data.accessToken;
            document.cookie = data.refreshToken;
            console.log("Successful Sign Up");
        }
    }

    onMount(() => {
        transitionState.update((state) => 0);
    });
</script>

<div class="container">
    <form action="">
        <h1><span>Create</span> An Account</h1>
        <h3>Username</h3>
        <div>
            <input type="text" placeholder="Username" bind:value={username} />
        </div>
        <h3>Email</h3>
        <div><input type="text" placeholder="Email" bind:value={email} /></div>
        <h3>Password</h3>
        <div>
            <input type="text" placeholder="Password" bind:value={password} />
        </div>
        <h3>Bio</h3>
        <div><input type="text" placeholder="Bio" bind:value={bio} /></div>
        <h2>Profile Picture</h2>
        <div><input type="file" /></div>
        <button on:click={signUp}>Create</button>
    </form>
</div>

<style lang="scss">
    .container {
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
            margin-top: 1rem;
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
