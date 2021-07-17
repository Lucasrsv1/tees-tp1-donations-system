import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import Swal, { SweetAlertIcon } from "sweetalert2";

@Injectable({ providedIn: "root" })
export class AlertsService {
	constructor () { }

	show (title: string, html: string, icon: SweetAlertIcon = "info") {
		Swal.fire({
			icon,
			buttonsStyling: false,
			customClass: { confirmButton: "btn btn-primary btn-lg" },
			title,
			html
		});
	}

	httpErrorAlert (title: string, html: string, error: HttpErrorResponse) {
		let errorMessage = error.message;
		if (error.error && error.error.message)
			errorMessage = error.error.message;
		else if (typeof error.error === "string")
			errorMessage = error.error;

		Swal.fire({
			icon: "error",
			buttonsStyling: false,
			customClass: { confirmButton: "btn btn-primary btn-lg" },
			title,
			html: `${html}<br/>${errorMessage}`
		});
	}
}
