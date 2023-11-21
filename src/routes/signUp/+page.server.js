import { CLOUD_NAME, PRESET_NAME, CLOUD_API_KEY } from "$env/static/private";

export async function load() {
    return {
        cloud_name: CLOUD_NAME,
        preset_name: PRESET_NAME,
        cloud_api_key: CLOUD_API_KEY,
    };
}
