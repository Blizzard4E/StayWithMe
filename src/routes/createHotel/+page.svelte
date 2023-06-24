<script>
    import { onMount } from "svelte";
    import { transitionState } from "../../store";
    export let data;
    let name = "",
        email = "",
        password = "",
        description = "",
        location = "",
        googleMap = "",
        cover_img,
        img_1,
        img_2,
        img_3,
        img_4;

    let images = [];

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
        console.log("Requesting");
        const uploadedImages = await uploadImages();

        const response = await fetch("../api/hotels/signUp", {
            method: "POST",
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                description: description,
                location: location,
                googleMap: googleMap,
                images: uploadedImages,
            }),
        });
        const data = await response.json();
        if (data.status == 200) {
            document.cookie = data.accessToken;
            document.cookie = data.refreshToken;
        }
        console.log(data.message);
    }

    onMount(() => {
        transitionState.update((state) => 0);
    });
</script>

<div class="container">
    <form action="">
        <h1><span>Create</span> A Hotel</h1>
        <h3>Name</h3>
        <div><input type="text" placeholder="Name" bind:value={name} /></div>
        <h3>Email</h3>
        <div><input type="text" placeholder="Email" bind:value={email} /></div>
        <h3>Password</h3>
        <div>
            <input type="text" placeholder="Password" bind:value={password} />
        </div>
        <h3>Description</h3>
        <div>
            <input
                type="text"
                placeholder="Description"
                bind:value={description}
            />
        </div>
        <h3>Location</h3>
        <div>
            <input type="text" placeholder="Location" bind:value={location} />
        </div>
        <h3>Google Map Name Optional</h3>
        <div>
            <input
                type="text"
                placeholder="Google Map Link"
                bind:value={googleMap}
            />
        </div>
        <h3>Cover Image</h3>
        <div><input type="file" bind:files={cover_img} /></div>
        <h3>Image 1</h3>
        <div><input type="file" bind:files={img_1} /></div>
        <h3>Image 2</h3>
        <div><input type="file" bind:files={img_2} /></div>
        <h3>Image 3</h3>
        <div><input type="file" bind:files={img_3} /></div>
        <h3>Image 4</h3>
        <div><input type="file" bind:files={img_4} /></div>
        <button on:click={signUp}>Create</button>
    </form>
</div>

<style lang="scss">
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
