import { writable } from "svelte/store";

export const transitionState = writable(1);

export const darkMode = writable(true);
