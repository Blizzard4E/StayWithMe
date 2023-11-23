import { hostname } from "os";

export async function load() {
    const host = hostname();
    return {
        hostName: host,
    };
}
