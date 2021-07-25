import { Injectable } from "@angular/core";

const APP_KEY_PREFIX = "DONATION_SYSTEM_";

export enum LocalStorageKey {
	USER = "USER"
}

@Injectable({ providedIn: "root" })
export class LocalStorageService {
	constructor () { }

	public hasKey (key: LocalStorageKey): boolean {
		return Boolean(this.get(key));
	}

	public get (key: LocalStorageKey, defaultValue: any = null): string {
		return window.localStorage.getItem(APP_KEY_PREFIX + key) || defaultValue;
	}

	public set (key: LocalStorageKey, value: string): void {
		window.localStorage.setItem(APP_KEY_PREFIX + key, value);
	}

	public delete (key: LocalStorageKey): void {
		window.localStorage.removeItem(APP_KEY_PREFIX + key);
	}
}
