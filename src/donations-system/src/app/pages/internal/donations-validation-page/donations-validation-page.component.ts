import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { finalize } from "rxjs/operators";

import { IDonation } from "src/app/interfaces/donation";
import { Validation } from "src/app/interfaces/solicitation";
import { AlertsService } from "src/app/services/alerts/alerts.service";
import { DonationsManagementService } from "src/app/services/donations-management/donations-management.service";

@Component({
	selector: "app-donations-validation-page",
	templateUrl: "./donations-validation-page.component.html",
	styleUrls: ["./donations-validation-page.component.scss"]
})
export class DonationsValidationPageComponent implements OnInit {
	@BlockUI()
	private blockUI!: NgBlockUI;

	public donations: IDonation[] = [];

	constructor (
		private alertsService: AlertsService,
		private donationsManagementService: DonationsManagementService
	) { }

	public ngOnInit (): void {
		this.listPendingValidation();
	}

	public listPendingValidation (): void {
		this.blockUI.start();
		this.donationsManagementService.listPendingValidation()
			.pipe(finalize(() => this.blockUI.stop()))
			.subscribe(
				(donations: IDonation[]) => this.donations = donations,
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Buscar Doações",
						"Não foi possível obter as doações ainda não validadas, tente novamente.",
						error
					);
				}
			);
	}

	public async validate (idDonation: number, result: Validation): Promise<void> {
		const confirm = await this.alertsService.confirm(`Tem certeza de que deseja ${result === Validation.APPROVED ? "aprovar" : "reprovar"} esta doação?`);
		if (!confirm) return;

		this.blockUI.start();
		this.donationsManagementService.setValidation(idDonation, result)
			.pipe(finalize(() => this.blockUI.stop()))
			.subscribe(
				_ => this.donations = this.donations.filter(d => d.idDonation !== idDonation),
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Validar Doação",
						"Não foi possível validar a doação, tente novamente.",
						error
					);
				}
			);
	}
}
