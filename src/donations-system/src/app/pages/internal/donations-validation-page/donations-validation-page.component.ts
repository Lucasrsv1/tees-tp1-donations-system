import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
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

	public faCheck = faCheck;
	public faTimes = faTimes;
	public donations: IDonation[] | undefined;

	constructor (
		private readonly alertsService: AlertsService,
		private readonly donationsManagementService: DonationsManagementService
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

	public async validate (donation: IDonation, approved: boolean): Promise<void> {
		const confirm = await this.alertsService.confirm(`Tem certeza de que deseja ${approved ? "aprovar" : "reprovar"} esta doação?`, !approved);
		if (!confirm) return;

		const reason = approved ? null : await this.alertsService.prompt("Entre com a justificativa para a reprovação:");
		if (!approved && !reason) return;

		this.blockUI.start();
		this.donationsManagementService.setValidation(donation.idDonationItem, approved ? Validation.APPROVED : Validation.DENIED, reason as string)
			.pipe(finalize(() => this.blockUI.stop()))
			.subscribe(
				_ => this.donations = (this.donations || []).filter(d => d.idDonationItem !== donation.idDonationItem),
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
