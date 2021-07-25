import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
	selector: "app-register-donation-page",
	templateUrl: "./register-donation-page.component.html",
	styleUrls: ["./register-donation-page.component.scss"]
})
export class RegisterDonationComponent {
	public form: FormGroup;

	constructor (private readonly formBuilder: FormBuilder) {
		this.form = this.formBuilder.group({
			itemName: [null, [Validators.required]],
			itemType: [null, [Validators.required]],
			itemDesc: [null, [Validators.required]],
			itemQnt: [null, [Validators.required]],
			itemPhoto: [null, [Validators.required]],
			itemLoc: [null, [Validators.required]]
		});
	}

	public create (): void { }

	public uploadPhotos (): void { }

	public cancel (): void { }
}
