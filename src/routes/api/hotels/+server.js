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
    const response = await fetch(
        "https://stay-withme-api.cyclic.app/users/hotels",
        {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                cookie: splitCookies(request.headers.get("cookie"))
                    .refreshToken,
            },
        }
    );
    const jsonData = await response.json();
    return json(jsonData);
}
