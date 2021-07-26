import { Component, Input } from "@angular/core";

import { IDonation } from "src/app/interfaces/donation";
import { environment } from "src/environments/environment";

@Component({
	selector: "app-donation",
	templateUrl: "./donation.component.html",
	styleUrls: ["./donation.component.scss"]
})
export class DonationComponent {
	@Input()
	public donation!: IDonation;

	constructor () { }

	public getPhotoURL (link: string): string {
		return `${environment.serverURL}/uploads/${link}`;
	}
}
