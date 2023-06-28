import { json } from "@sveltejs/kit";

export async function POST({ request }) {
    let data = await request.json();
    console.log(data);
    const response = await fetch(
        "https://stay-withme-api.cyclic.app/hotels/signUp",
        {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    const jsonData = await response.json();
    return json(jsonData);
}
