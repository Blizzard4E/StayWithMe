<script>
    import { onMount } from "svelte";
    import { darkMode, transitionState } from "../../store";
    import { goto } from "$app/navigation";
    export let data;
    let isDark;
    import { PUBLIC_API_URL } from "$env/static/public";
    darkMode.subscribe((value) => (isDark = value));
    const countries = [
        "Bangladesh",
        "Brazil",
        "Cambodia",
        "China",
        "Colombia",
        "Egypt",
        "France",
        "Germany",
        "India",
        "Indonesia",
        "Iran",
        "Italy",
        "Japan",
        "Laos",
        "Malaysia",
        "Mexico",
        "Myanmar",
        "Nigeria",
        "Pakistan",
        "Philippines",
        "Russia",
        "Singapore",
        "South Africa",
        "South Korea",
        "Thailand",
        "Turkey",
        "United Kingdom",
        "United States",
        "Vietnam",
    ];

    let name = "",
        email = "",
        password = "",
        description = "",
        country = "Cambodia",
        googleMap = "",
        cover_img,
        img_1,
        img_2,
        img_3,
        img_4;
    let emailError = false,
        emailInvalid = true,
        nameError = false,
        passwordError = false,
        descError = false,
        imagesError = false,
        googleMapError = false;
    let images = [];
    let isLoading = false;
    let loadingText = "";
    let createError = false;

    function emailValidation() {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            emailInvalid = false;
        } else {
            emailInvalid = true;
        }
    }

    function nameValidation() {
        if (name.length <= 0) nameError = true;
        else nameError = false;
    }

    function passwordValidation() {
        if (password.length <= 0) passwordError = true;
        else passwordError = false;
    }

    function descValidation() {
        if (description.length <= 0) descError = true;
        else descError = false;
    }

    function googleMapValidation() {
        if (googleMap.length <= 0) googleMapError = true;
        else googleMapError = false;
    }

    function imagesValidation() {
        if (cover_img && img_1 && img_2 && img_3 && img_4) {
            imagesError = false;
            return;
        }
        imagesError = true;
    }

    async function uploadImage(file) {
        let formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", data.preset_name);
        formData.append("api_key", data.cloud_api_key);

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/" + data.cloud_name + "/upload",
            {
                method: "POST",
                body: formData,
            }
        );
        const image = await response.json();
        return image.url;
    }

    async function uploadImages() {
        console.log("Uploading images...");
        let uploadedImages = [];
        images.push(img_1[0]);
        images.push(img_2[0]);
        images.push(img_3[0]);
        images.push(img_4[0]);
        images.push(cover_img[0]);

        // Use Promise.all() to wait for all the promises to resolve
        const uploadedImagesPromises = images.map((image) =>
            uploadImage(image)
        );
        uploadedImages = await Promise.all(uploadedImagesPromises);

        console.log("All images uploaded!");
        return uploadedImages;
    }

    async function signUp() {
        nameValidation();
        emailValidation();
        passwordValidation();
        descValidation();
        googleMapValidation();
        imagesValidation();
        if (emailInvalid) {
            emailError = true;
            return;
        }
        if (
            nameError ||
            passwordError ||
            descError ||
            googleMapError ||
            imagesError
        ) {
            return;
        }

        isLoading = true;
        loadingText = "Uploading Images";
        const uploadedImages = await uploadImages();
        loadingText = "Creating Hotel";
        fetch(PUBLIC_API_URL + "/hotels/signUp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                description: description,
                country: country,
                googleMap: googleMap,
                images: uploadedImages,
            }),
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
                    isLoading = false;
                    createError = true;
                    loadingText = jsonData.message;
                }
                console.log(jsonData);
            })
            .catch((error) => {
                isLoading = false;
                createError = true;
                loadingText = error;
                console.log(error);
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
                A Hotel
            </h1>
            <h3>Hotel Name</h3>
            <div>
                <input
                    type="text"
                    placeholder="Name"
                    bind:value={name}
                    on:input={nameValidation}
                />
                {#if nameError}
                    <p class="error">Hotel Name must not be empty</p>
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
                    <p class="error">Invalid email</p>
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
            <h3>Description</h3>
            <div>
                <input
                    type="text"
                    placeholder="Description"
                    bind:value={description}
                    on:input={descValidation}
                />
                {#if descError}
                    <p class="error">Description must not be empty</p>
                {/if}
            </div>
            <h3>Country</h3>
            <label for="country">Country:</label>
            <select bind:value={country}>
                {#each countries as country_}
                    <option value={country_}>{country_}</option>
                {/each}
            </select>
            <h3>Google Map Name Optional</h3>
            <div style="margin-bottom: 1rem;">
                <input
                    type="text"
                    placeholder="Google Map Link"
                    bind:value={googleMap}
                    on:input={googleMapValidation}
                />
                {#if googleMapError}
                    <p class="error">Google Map Name must not be empty</p>
                {/if}
            </div>
            <iframe
                src={"https://maps.google.com/maps?&q=" +
                    encodeURIComponent(googleMap) +
                    "&output=embed"}
                width="100%"
                height="200"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
            />
            <h3>Cover Image</h3>
            <div>
                <input
                    type="file"
                    bind:files={cover_img}
                    on:change={imagesValidation}
                />
            </div>
            <h3>Image 1</h3>
            <div>
                <input
                    type="file"
                    bind:files={img_1}
                    on:change={imagesValidation}
                />
            </div>
            <h3>Image 2</h3>
            <div>
                <input
                    type="file"
                    bind:files={img_2}
                    on:change={imagesValidation}
                />
            </div>
            <h3>Image 3</h3>
            <div>
                <input
                    type="file"
                    bind:files={img_3}
                    on:change={imagesValidation}
                />
            </div>
            <h3>Image 4</h3>
            <div>
                <input
                    type="file"
                    bind:files={img_4}
                    on:change={imagesValidation}
                />
            </div>
            {#if imagesError}
                <p class="error">All images must be provided</p>
            {/if}
            {#if createError}
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
    .container {
        display: grid;
        place-items: center;
        position: relative;
        z-index: 2;
        padding-top: 1rem;
        padding-bottom: 1rem;
    }
    h3 {
        margin-top: 1rem;
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
