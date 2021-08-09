import { Component } from "@angular/core";

import { AuthenticationService } from "./services/authentication/authentication.service";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"]
})
export class AppComponent {
	constructor (private readonly authenticationService: AuthenticationService) { }

	public get isLoggedIn (): boolean {
		return this.authenticationService.isLoggedIn();
	}
}
