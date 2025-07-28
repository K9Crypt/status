import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function format(ms: number): string {
	if (ms < 0) {
		return "Invalid duration";
	}

	const seconds = Math.floor(ms / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	const parts: string[] = [];
	if (days > 0) {
		parts.push(`${days} days`);
	}
	if (hours % 24 > 0) {
		parts.push(`${hours % 24} hours`);
	}
	if (minutes % 60 > 0) {
		parts.push(`${minutes % 60} minutes`);
	}
	if (seconds % 60 > 0 || parts.length === 0) {
		parts.push(`${seconds % 60} seconds`);
	}

	return parts.join(' ');
}
