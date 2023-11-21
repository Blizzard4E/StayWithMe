<script>
    import { onMount } from "svelte";
    import { darkMode, transitionState } from "../../store";
    import { goto } from "$app/navigation";
    import { json } from "@sveltejs/kit";
    import { PUBLIC_API_URL } from "$env/static/public";
    export let data;
    let isDark;

    darkMode.subscribe((value) => (isDark = value));
    let email = "",
        password = "",
        username = "",
        bio = "",
        profile_pic = null;

    let emailError = false,
        emailInvalid = true,
        usernameError = false,
        passwordError = false,
        bioError = false,
        profilePicError = false;
    let isLoading = false,
        loadingText = "";
    let signUpFailed = false;

    function emailValidation() {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            emailInvalid = false;
        } else {
            emailInvalid = true;
        }
    }

    function usernameValidation() {
        if (username.length <= 0) usernameError = true;
        else usernameError = false;
    }

    function passwordValidation() {
        if (password.length <= 0) passwordError = true;
        else passwordError = false;
    }

    function bioValidation() {
        if (bio.length <= 0) bioError = true;
        else bioError = false;
    }

    function profilePicValidation() {
        console.log(profile_pic);
        if (profile_pic) profilePicError = false;
        else profilePicError = true;
    }

    async function signUp() {
        emailValidation();
        usernameValidation();
        passwordValidation();
        bioValidation();
        profilePicValidation();
        if (emailInvalid) {
            emailError = true;
            return;
        }
        if (usernameError || passwordError || profilePicError) {
            return;
        }

        let formData = new FormData();
        formData.append("file", profile_pic[0]);
        formData.append("upload_preset", data.preset_name);
        formData.append("api_key", data.cloud_api_key);
        isLoading = true;
        loadingText = "Uploading Images";
        fetch(
            "https://api.cloudinary.com/v1_1/" + data.cloud_name + "/upload",
            {
                method: "POST",
                body: formData,
            }
        )
            .then((res) => res.json())
            .then(async (image) => {
                loadingText = "Signing up";
                fetch(PUBLIC_API_URL + "/users/signUp", {
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
                        } else {
                            loadingText = json.message;
                            signUpFailed = true;
                            isLoading = false;
                        }
                        console.log(jsonData);
                    })
                    .catch((error) => {
                        console.error(error);
                        signUpFailed = true;
                        loadingText = error;
                        isLoading = false;
                    });
            })
            .catch((err) => {
                console.error(err);
                signUpFailed = true;
                loadingText = error;
                isLoading = false;
            });
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
        <form on:submit|preventDefault={signUp}>
            <h1>
                <span>Create</span>
                An Account
            </h1>
            <h3>Username</h3>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    bind:value={username}
                    on:input={usernameValidation}
                />
                {#if usernameError}
                    <p class="error">Username must not be empty</p>
                {/if}
            </div>
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
            <h3>Bio</h3>
            <div>
                <input
                    type="text"
                    placeholder="Bio"
                    bind:value={bio}
                    on:input={bioValidation}
                />
                {#if bioError}
                    <p class="error">Bio must not be empty</p>
                {/if}
            </div>
            <h2>Profile Picture</h2>
            <div>
                <input
                    type="file"
                    bind:files={profile_pic}
                    on:change={profilePicValidation}
                />
                {#if profilePicError}
                    <p class="error">Must have profile picture</p>
                {/if}
            </div>
            {#if signUpFailed}
                <p class="error">An account with this email already exist</p>
            {/if}
            <button disabled={isLoading}>Create</button>
            {#if isLoading}
                <div class="loading">
                    <div class="lds-ring">
                        <div />
                        <div />
                        <div />
                        <div />
                    </div>
                    <p>{loadingText}</p>
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
