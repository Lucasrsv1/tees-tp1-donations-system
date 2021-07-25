import { Component, EventEmitter, Input, Output } from "@angular/core";

import { IDonation } from "src/app/interfaces/donation";

@Component({
	selector: "app-donation",
	templateUrl: "./donation.component.html",
	styleUrls: ["./donation.component.scss"]
})
export class DonationComponent {
	@Input()
	public donation!: IDonation;

	@Output()
	public solicit = new EventEmitter<number>();

	constructor () { }

	public solicitDonation (): void {
		this.solicit.emit(this.donation.idDonation);
	}
}
