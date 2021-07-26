import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { finalize } from "rxjs/operators";

import { IDonation } from "src/app/interfaces/donation";
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
	public donations: IDonation[] = [];

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
		private formBuilder: FormBuilder,
		private alertsService: AlertsService,
		private itemTypesService: ItemTypesService,
		private homeService: HomeService
	) {
		this.form = this.formBuilder.group({
			search: [""],
			types: [[]]
		});
	}

	public ngOnInit (): void {
		this.loadItemTypes();
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

	public search (): void { }

	public solicitDonation (idDonation: number): void { }
}
