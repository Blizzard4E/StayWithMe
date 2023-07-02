import { writable } from "svelte/store";

export const user = writable(null);

export const hotel = writable(null);

export const rooms = writable([]);

export const country = writable("Cambodia");
