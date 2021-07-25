import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { sha512 } from "js-sha512";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { finalize } from "rxjs/operators";
import { IUser, UserType } from "src/app/interfaces/user";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";

@Component({
	selector: "app-sign-up-page",
	templateUrl: "./sign-up-page.component.html",
	styleUrls: ["./sign-up-page.component.scss"]
})
export class SignUpPageComponent {
	@BlockUI()
	private blockUI!: NgBlockUI;

	public form: FormGroup;

	constructor (
		private readonly formBuilder: FormBuilder,
		private readonly authenticationService: AuthenticationService
	) {
		this.form = this.formBuilder.group({
			name: ["", Validators.required],
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required, Validators.minLength(6)]],
			pj: [false]
		});
	}

	public signUp (): void {
		const user: IUser = {
			name: this.form.controls.name.value,
			email: this.form.controls.email.value,
			password: sha512(this.form.controls.password.value),
			type: this.form.controls.pj.value ? UserType.PJ : UserType.PF
		};

		this.blockUI.start();
		this.authenticationService.signUp(user)
			.pipe(finalize(() => this.blockUI.stop()))
			.subscribe();
	}
}
