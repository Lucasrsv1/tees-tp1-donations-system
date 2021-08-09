import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import Swal, { SweetAlertIcon, SweetAlertResult } from "sweetalert2";

@Injectable({ providedIn: "root" })
export class AlertsService {
	constructor () { }

	public show (title: string, html: string, icon: SweetAlertIcon = "info"): void {
		Swal.fire({
			icon,
			buttonsStyling: false,
			customClass: { confirmButton: "btn btn-primary btn-lg" },
			title,
			html
		});
	}

	public confirm (text: string, danger: boolean = true): Promise<boolean> {
		return new Promise(resolve => {
			Swal.fire({
				icon: "question",
				title: "Confirmação",
				text,
				confirmButtonColor: danger ? "#DC3545" : "#198754",
				confirmButtonText: "SIM",
				showCancelButton: true,
				cancelButtonText: "Cancelar"
			}).then((result: SweetAlertResult) => {
				resolve(Boolean(result.value));
			});
		});
	}

	public prompt (title: string): Promise<string | undefined> {
		return new Promise(resolve => {
			Swal.fire({
				icon: "question",
				title,
				confirmButtonColor: "#0d6efd",
				input: "text",
				showCancelButton: true,
				cancelButtonText: "Cancelar"
			}).then((result: SweetAlertResult) => {
				resolve(result.value);
			});
		});
	}

	public httpErrorAlert (title: string, html: string, error: HttpErrorResponse): void {
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
