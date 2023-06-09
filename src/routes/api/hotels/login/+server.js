import { json } from "@sveltejs/kit";

function splitCookies(cookieString) {
    let cookies = {};
    const index = cookieString.indexOf(", refreshToken");
    const accessToken = cookieString.slice(0, index);
    const refreshToken = cookieString.slice(index + 1);
    cookies.accessToken = accessToken;
    cookies.refreshToken = refreshToken;
    return cookies;
}

export async function POST({ request }) {
    let data = await request.json();
    console.log(data);
    const response = await fetch(
        "https://stay-withme-api.cyclic.app/hotels/login",
        {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    const jsonData = await response.json();
    if (jsonData.status == 200) {
        const returnCookies = splitCookies(response.headers.get("set-cookie"));
        jsonData.accessToken = returnCookies.accessToken;
        jsonData.refreshToken = returnCookies.refreshToken;
    }
    return json(jsonData);
}
