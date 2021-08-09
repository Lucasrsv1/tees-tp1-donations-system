import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { faHands, faHandshakeAltSlash, faHandsHelping, faSearch } from "@fortawesome/free-solid-svg-icons";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { finalize } from "rxjs/operators";

import { IDonation } from "src/app/interfaces/donation";
import { IFilters } from "src/app/interfaces/filters";
import { IItemType } from "src/app/interfaces/item-type";

import { AlertsService } from "src/app/services/alerts/alerts.service";
import { HomeService } from "src/app/services/home/home.service";
import { ItemTypesService } from "src/app/services/item-types/item-types.service";

@Component({
	selector: "app-home-page",
	templateUrl: "./home-page.component.html",
	styleUrls: ["./home-page.component.scss"]
})
export class HomePageComponent implements OnInit {
	@BlockUI()
	private blockUI!: NgBlockUI;

	public form: FormGroup;
	public itemTypes: IItemType[] = [];
	public donations: IDonation[] | undefined;

	public faHands = faHands;
	public faHandshakeAltSlash = faHandshakeAltSlash;
	public faHandsHelping = faHandsHelping;
	public faSearch = faSearch;
	public dropdownSettings: IDropdownSettings = {
		singleSelection: false,
		idField: "idItemType",
		textField: "name",
		selectAllText: "Selecionar Tudo",
		unSelectAllText: "Desmarcar Tudo",
		allowSearchFilter: true,
		searchPlaceholderText: "Pesquisar"
	};

	constructor (
		private readonly formBuilder: FormBuilder,
		private readonly alertsService: AlertsService,
		private readonly itemTypesService: ItemTypesService,
		private readonly homeService: HomeService
	) {
		this.form = this.formBuilder.group({
			search: [""],
			types: [[]]
		});
	}

	public ngOnInit (): void {
		this.loadItemTypes();
		this.search();
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

	public search (): void {
		const filters: IFilters = {
			search: this.form.controls.search.value,
			itemTypes: this.form.controls.types.value
		};

		this.blockUI.start();
		this.homeService.searchDonations(filters)
			.pipe(finalize(() => this.blockUI.stop()))
			.subscribe(
				(donations: IDonation[]) => this.donations = donations,
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Buscar Doações",
						"Não foi possível obter as doações disponíveis, tente novamente.",
						error
					);
				}
			);
	}

	public async solicitDonation (donation: IDonation): Promise<void> {
		const reason = await this.alertsService.prompt("Por que você deveria receber esta doação?");
		if (!reason) return;

		this.blockUI.start();
		this.homeService.solicitDonation(donation.idDonationItem, reason)
			.pipe(finalize(() => this.blockUI.stop()))
			.subscribe(
				_ => {
					this.donations = (this.donations || []).filter(d => d.idDonationItem != donation.idDonationItem);
					this.alertsService.show(
						"Doação Solicitada",
						"A doação foi solicitada com sucesso! Você receberá o resultado via e-mail quando o dono escolher pra quem irá doar o item.",
						"success"
					);
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Solicitar Doação",
						"Não foi possível solicitar a doação, tente novamente.",
						error
					);
				}
			);
	}
}
