import { json } from "@sveltejs/kit";

export async function POST({ request }) {
    let data = await request.json();
    console.log(data);
    const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const jsonData = await response.json();
    const cookieString = response.headers.get("set-cookie");
    const index = cookieString.indexOf(", refreshToken");
    const accessToken = cookieString.slice(0, index);
    const refreshToken = cookieString.slice(index + 1);

    jsonData.accessToken = accessToken;
    jsonData.refreshToken = refreshToken;
    return json(jsonData);
}
