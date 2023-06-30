<script>
    import { onMount } from "svelte";
    import { darkMode, transitionState } from "../../store";
    import { goto } from "$app/navigation";
    export let data;
    let isDark;

    darkMode.subscribe((value) => (isDark = value));
    let email, password, username, bio, profile_pic;

    async function generateImageLink() {}

    async function signUp() {
        let formData = new FormData();
        formData.append("file", profile_pic[0]);
        formData.append("upload_preset", data.preset_name);
        formData.append("api_key", data.cloud_api_key);
        fetch(
            "https://api.cloudinary.com/v1_1/" + data.cloud_name + "/upload",
            {
                method: "POST",
                body: formData,
            }
        )
            .then((res) => res.json())
            .then(async (image) => {
                console.log("Uploaded Profile");
                fetch("https://stay-withme-api.cyclic.app/users/signUp", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password,
                        bio: bio,
                        profile_pic: image.url,
                    }),
                })
                    .then(async (res) => {
                        const jsonData = await res.json();
                        if (jsonData.status == 200) {
                            localStorage.setItem(
                                "access_token",
                                jsonData.accessToken
                            );
                            localStorage.setItem(
                                "refresh_token",
                                jsonData.refreshToken
                            );
                            transition("/home");
                        } else failed = true;
                        console.log(jsonData);
                    })
                    .catch((error) => console.error("Error:", error));
            })
            .catch((err) => console.log(err));
    }

    onMount(() => {
        transitionState.update((state) => 0);
    });
</script>

<div class="main-bg" class:dark={isDark}>
    <div class="container">
        <form action="">
            <h1><span>Create</span> An Account</h1>
            <h3>Username</h3>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    bind:value={username}
                />
            </div>
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
            <h3>Bio</h3>
            <div><input type="text" placeholder="Bio" bind:value={bio} /></div>
            <h2>Profile Picture</h2>
            <div><input type="file" bind:files={profile_pic} /></div>
            <button on:click={signUp}>Create</button>
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
