import { browser } from "$app/environment";
import { writable } from "svelte/store";

export const transitionState = writable(1);

export const darkMode = writable(
    (browser && localStorage.getItem("theme")) || "0"
);
darkMode.subscribe((val) => {
    if (browser) return (localStorage.theme = val);
});
