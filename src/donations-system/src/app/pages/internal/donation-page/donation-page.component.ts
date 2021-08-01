import { Location } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { finalize } from "rxjs/operators";

import { IDonation } from "src/app/interfaces/donation";
import { IItemType } from "src/app/interfaces/item-type";
import { AlertsService } from "src/app/services/alerts/alerts.service";
import { DonationsManagementService } from "src/app/services/donations-management/donations-management.service";
import { ItemTypesService } from "src/app/services/item-types/item-types.service";

interface IState {
	id: string;
	name: string;
}

@Component({
	selector: "app-donation-page",
	templateUrl: "./donation-page.component.html",
	styleUrls: ["./donation-page.component.scss"]
})
export class DonationPageComponent implements OnInit {
	@BlockUI()
	private blockUI!: NgBlockUI;

	public form: FormGroup;

	public faSave = faSave;
	public faPlus = faPlus;
	public idDonation: number = 0;
	public itemTypes: IItemType[] = [];

	public states: IState[] = [
		{ id: "AC" , name: "Acre" },
		{ id: "AL" , name: "Alagoas" },
		{ id: "AP" , name: "Amapá" },
		{ id: "AM" , name: "Amazonas" },
		{ id: "BA" , name: "Bahia" },
		{ id: "CE" , name: "Ceará" },
		{ id: "ES" , name: "Espírito Santo" },
		{ id: "GO" , name: "Goiás" },
		{ id: "MA" , name: "Maranhão" },
		{ id: "MT" , name: "Mato Grosso" },
		{ id: "MS" , name: "Mato Grosso do Sul" },
		{ id: "MG" , name: "Minas Gerais" },
		{ id: "PA" , name: "Pará" },
		{ id: "PB" , name: "Paraíba" },
		{ id: "PR" , name: "Paraná" },
		{ id: "PE" , name: "Pernambuco" },
		{ id: "PI" , name: "Piauí" },
		{ id: "RJ" , name: "Rio de Janeiro" },
		{ id: "RN" , name: "Rio Grande do Norte" },
		{ id: "RS" , name: "Rio Grande do Sul" },
		{ id: "RO" , name: "Rondônia" },
		{ id: "RR" , name: "Roraima" },
		{ id: "SC" , name: "Santa Catarina" },
		{ id: "SP" , name: "São Paulo" },
		{ id: "SE" , name: "Sergipe" },
		{ id: "TO" , name: "Tocantins" },
		{ id: "DF" , name: "Distrito Federal" }
	];

	constructor (
		private activatedRoute: ActivatedRoute,
		private formBuilder: FormBuilder,
		private location: Location,
		private router: Router,
		private alertsService: AlertsService,
		private itemTypesService: ItemTypesService,
		private donationsManagementService: DonationsManagementService
	) {
		// Força a rota a recarregar sempre que os parâmetros mudam
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
		this.router.onSameUrlNavigation = "reload";

		this.activatedRoute.queryParams.subscribe(
			(params: Params) => this.idDonation = parseInt(params.idDonation) || 0
		);

		this.form = this.formBuilder.group({
			description: ["", Validators.required],
			idItemType: [null, Validators.required],
			quantity: [0, Validators.required],
			state: [null, Validators.required],
			city: ["", Validators.required]
		});
	}

	public ngOnInit (): void {
		this.loadItemTypes();
		if (this.idDonation > 0)
			this.getDonation();
	}

	public loadItemTypes (): void {
		this.blockUI.start();
		this.itemTypesService.list()
			.pipe(finalize(() => this.blockUI.stop()))
			.subscribe(
				(itemTypes: IItemType[]) => this.itemTypes = itemTypes,
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Buscar Tipos de Itens",
						"Não foi possível obter os tipos de itens cadastrados, tente novamente.",
						error
					);
				}
			);
	}

	public getDonation (): void {
		this.blockUI.start();
		this.donationsManagementService.getDonation(this.idDonation)
			.pipe(finalize(() => this.blockUI.stop()))
			.subscribe(
				(donation: IDonation) => this.updateForm(donation),
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Obter Doação",
						"Não foi possível obter os dados da doação, tente novamente.",
						error
					);
				}
			);
	}

	public save (): void {
		if (this.form.invalid) return;

		const donationValues: Partial<IDonation> = {
			description: this.form.controls.description.value,
			idItemType: this.form.controls.idItemType.value,
			quantity: this.form.controls.quantity.value,
			city: this.form.controls.city.value,
			state: this.form.controls.state.value
		};

		const observable = this.idDonation > 0 ?
			this.donationsManagementService.update(donationValues, this.idDonation) :
			this.donationsManagementService.create(donationValues);

		this.blockUI.start();
		observable.pipe(finalize(() => this.blockUI.stop()))
			.subscribe(
				(donation: IDonation) => {
					this.alertsService.show(
						`Doação ${this.idDonation > 0 ? "Atualizada" : "Criada"}`,
						`A doação foi ${this.idDonation > 0 ? "atualizada" : "criada"} com sucesso.`,
						"success"
					);
					this.updateForm(donation);
					this.idDonation = donation.idDonationItem;
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						`Erro ao ${this.idDonation > 0 ? "Atualizar" : "Criar"} Doação`,
						`Não foi possível ${this.idDonation > 0 ? "atualizar" : "criar"} a doação, tente novamente.`,
						error
					);
				}
			);
	}

	public cancel (): void {
		this.location.back();
	}

	public confirmDonation (): void { }

	private updateForm (donation: IDonation): void {
		this.form.controls.description.setValue(donation.description);
		this.form.controls.idItemType.setValue(donation.idItemType);
		this.form.controls.quantity.setValue(donation.quantity);
		this.form.controls.state.setValue(donation.state);
		this.form.controls.city.setValue(donation.city);
	}
}
