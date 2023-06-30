<script>
    export let data;
    import { hotel } from "../routes/stores";
    import jwt_decode from "jwt-decode";
    import { goto } from "$app/navigation";
    let hotelData;
    let cover_img = [],
        img_1,
        img_2,
        img_3,
        img_4;

    hotel.subscribe((value) => {
        hotelData = value;
    });

    async function checkToken() {
        let decodedToken = jwt_decode(localStorage.getItem("access_token"));
        return new Promise((resolve, reject) => {
            if (Date.now() >= decodedToken.exp * 1000) {
                if (!localStorage.getItem("refresh_token")) {
                    console.log("No refresh Token");
                    user.update((value) => null);
                    hotel.update((value) => null);
                    transition("/login");
                    return;
                }
                let myToken = localStorage.getItem("refresh_token");
                fetch("https://stay-withme-api.cyclic.app/autoLogin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: myToken }),
                })
                    .then(async (res) => {
                        const jsonData = await res.json();
                        if (jsonData.status == 200) {
                            localStorage.setItem(
                                "access_token",
                                jsonData.accessToken
                            );
                            console.log("Successful refresh access token");
                            let decoded = jwt_decode(jsonData.accessToken);
                            hotel.update((value) => decoded);
                            resolve(true);
                        } else reject({ status: 401 });
                        console.log(jsonData);
                    })
                    .catch((error) => console.error("Error:", error));
            } else {
                resolve(true);
            }
        });
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

    async function updateImages() {
        const tokenCheck = await checkToken().catch((err) => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            transition("/login");
        });
        if (tokenCheck) {
            let images = [];
            if (img_1) {
                let imgUrl = await uploadImage(img_1[0]);
                images.push(imgUrl);
            } else images.push(hotelData.images[0]);
            if (img_2) {
                let imgUrl = await uploadImage(img_2[0]);
                images.push(imgUrl);
            } else images.push(hotelData.images[1]);
            if (img_3) {
                let imgUrl = await uploadImage(img_3[0]);
                images.push(imgUrl);
            } else images.push(hotelData.images[2]);
            if (img_4) {
                let imgUrl = await uploadImage(img_4[0]);
                images.push(imgUrl);
            } else images.push(hotelData.images[3]);
            if (cover_img) {
                let imgUrl = await uploadImage(cover_img[0]);
                images.push(imgUrl);
            } else images.push(hotelData.images[4]);

            fetch("https://stay-withme-api.cyclic.app/hotels/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: hotelData.id,
                    token: localStorage.getItem("access_token"),
                    images: images,
                }),
            })
                .then((res) => res.json())
                .then((jsonData) => {
                    console.log(jsonData);
                    if (jsonData.status == 200) {
                        hotelData.images = images;
                        hotel.update((value) => hotelData);
                    }
                });
        }
    }
    function transition(path) {
        transitionState.update((state) => 1);
        setTimeout(() => {
            goto(path);
        }, 800);
    }
</script>

{#if hotelData}
    <section>
        <h1>Images</h1>
        <h2>Cover Photo</h2>
        <div class="change">
            <img class="cover" src={hotelData.images[4]} alt="" />
            <div>
                <h3>Change Photo</h3>
                <input type="file" bind:files={cover_img} />
            </div>
        </div>
        <h2>Photo 1</h2>
        <div class="change">
            <img src={hotelData.images[0]} alt="" />
            <div>
                <h3>Change Photo</h3>
                <input type="file" bind:files={img_1} />
            </div>
        </div>
        <h2>Photo 2</h2>
        <div class="change">
            <img src={hotelData.images[1]} alt="" />
            <div>
                <h3>Change Photo</h3>
                <input type="file" bind:files={img_2} />
            </div>
        </div>
        <h2>Photo 3</h2>
        <div class="change">
            <img src={hotelData.images[2]} alt="" />
            <div>
                <h3>Change Photo</h3>
                <input type="file" bind:files={img_3} />
            </div>
        </div>
        <h2>Photo 4</h2>
        <div class="change">
            <img src={hotelData.images[3]} alt="" />
            <div>
                <h3>Change Photo</h3>
                <input type="file" bind:files={img_4} />
            </div>
        </div>
        <button on:click={updateImages}>Update Images</button>
    </section>
{/if}

<style lang="scss">
    .change {
        display: flex;
        column-gap: 1rem;
        img {
            width: 300px;
            aspect-ratio: 3/1.5;
            object-fit: cover;
        }
        .cover {
            aspect-ratio: 1/1;
        }
    }
    button {
        padding: 0.75rem 1rem;
        background-color: rgb(25, 151, 255);
        border: none;
        color: white;
        font-size: 1rem;
        margin-top: 1rem;
        transition: 0.15s ease-in-out;
        cursor: pointer;
        &:hover {
            transform: scale(1.1);
        }
    }
</style>
