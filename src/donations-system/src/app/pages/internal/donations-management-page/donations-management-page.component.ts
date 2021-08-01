import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { faCog, faHandsHelping, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { finalize } from "rxjs/operators";

import { IDonation } from "src/app/interfaces/donation";
import { AlertsService } from "src/app/services/alerts/alerts.service";
import { DonationsManagementService } from "src/app/services/donations-management/donations-management.service";

@Component({
	selector: "app-donations-management-page",
	templateUrl: "./donations-management-page.component.html",
	styleUrls: ["./donations-management-page.component.scss"]
})
export class DonationsManagementPageComponent implements OnInit {
	@BlockUI()
	private blockUI!: NgBlockUI;

	public faCog = faCog;
	public faPlus = faPlus;
	public faTrashAlt = faTrashAlt;
	public faHandsHelping = faHandsHelping;
	public donations: IDonation[] = [];

	constructor (
		private router: Router,
		private alertsService: AlertsService,
		private donationsManagementService: DonationsManagementService
	) { }

	public ngOnInit (): void {
		this.listDonations();
	}

	public listDonations (): void {
		this.blockUI.start();
		this.donationsManagementService.list()
			.pipe(finalize(() => this.blockUI.stop()))
			.subscribe(
				(donations: IDonation[]) => this.donations = donations,
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Buscar Doações",
						"Não foi possível obter as suas doações, tente novamente.",
						error
					);
				}
			);
	}

	public create (): void {
		this.router.navigate(["donation"]);
	}

	public manage (donation: IDonation): void {
		this.router.navigate(["donation"], {
			queryParams: { idDonation: donation.idDonationItem }
		});
	}

	public async delete (donation: IDonation): Promise<void> {
		const confirm = await this.alertsService.confirm("Tem certeza de que deseja excluir esta doação?");
		if (!confirm) return;

		this.blockUI.start();
		this.donationsManagementService.delete(donation.idDonationItem)
			.pipe(finalize(() => this.blockUI.stop()))
			.subscribe(
				_ => {
					this.donations = this.donations.filter(d => d.idDonationItem !== donation.idDonationItem);
					this.alertsService.show(
						"Doação Removida",
						"A doação foi removida com sucesso!",
						"success"
					);
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Deletar Doação",
						"Não foi possível deletar a doação, tente novamente.",
						error
					);
				}
			);
	}
}
