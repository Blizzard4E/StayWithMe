import { json } from "@sveltejs/kit";
import { is_user } from "../../stores.js";

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
    let response;
    if (data.is_user) {
        console.log("logging in as user");
        response = await fetch(
            "https://stay-withme-api.cyclic.app/users/autoLogin",
            {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    cookie: splitCookies(request.headers.get("cookie"))
                        .refreshToken,
                },
            }
        );
    } else {
        console.log("logging in as hotel");
        response = await fetch(
            "https://stay-withme-api.cyclic.app/hotels/autoLogin",
            {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    cookie: splitCookies(request.headers.get("cookie"))
                        .refreshToken,
                },
            }
        );
    }

    const jsonData = await response.json();
    if (jsonData.status == 200) {
        const returnCookies = splitCookies(response.headers.get("set-cookie"));
        jsonData.accessToken = returnCookies.accessToken;
        jsonData.refreshToken = returnCookies.refreshToken;
    }
    return json(jsonData);
}
