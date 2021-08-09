import { HttpErrorResponse } from "@angular/common/http";
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { faPencilAlt, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { DataTableDirective } from "angular-datatables";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { finalize } from "rxjs/operators";

import { IItemType } from "src/app/interfaces/item-type";

import { AlertsService } from "src/app/services/alerts/alerts.service";
import { DataTableService } from "src/app/services/data-table/data-table.service";
import { ItemTypesService } from "src/app/services/item-types/item-types.service";

@Component({
	selector: "app-items-type-management-page",
	templateUrl: "./items-type-management-page.component.html",
	styleUrls: ["./items-type-management-page.component.scss"]
})
export class ItemsTypeManagementPageComponent implements OnInit, AfterViewInit {
	@BlockUI()
	private blockUI!: NgBlockUI;

	@ViewChild("modal", { static: true })
	private modal!: TemplateRef<any>;

	@ViewChild(DataTableDirective, { static: true })
	private dataTable!: DataTableDirective;

	public faPlus = faPlus;
	public faPencilAlt = faPencilAlt;
	public faTrashAlt = faTrashAlt;

	public modalRef: BsModalRef | undefined;
	public nameInput: string = "";
	public editingItemType: IItemType | undefined;
	public itemTypes: IItemType[] = [];
	public dtOptions: DataTables.Settings = { };
	public dtTrigger: Subject<any> = new Subject();

	constructor (
		private readonly modalService: BsModalService,
		private readonly alertsService: AlertsService,
		private readonly itemTypesService: ItemTypesService,
		private readonly dataTableService: DataTableService
	) {
		this.dtOptions = {
			lengthMenu: [10, 25, 50, 75],
			pageLength: 25,
			stateSave: true,
			columnDefs: [{ targets: 1, orderable: false }],
			order: [[0, "asc"]],
			language: this.dataTableService.getDataTablesTranslation("Nenhum tipo de item cadastrado")
		};
	}

	public ngOnInit (): void {
		this.listItemTypes();
	}

	public ngAfterViewInit (): void {
		this.dtTrigger.next();
	}

	public rerenderDatatables (): void {
		this.dataTable.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.destroy();
			this.dtTrigger.next();
		});
	}

	public listItemTypes (): void {
		this.blockUI.start();
		this.itemTypesService.list()
			.pipe(finalize(() => this.blockUI.stop()))
			.subscribe(
				(itemTypes: IItemType[]) => {
					this.itemTypes = itemTypes;
					this.rerenderDatatables();
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Buscar Tipos de Itens",
						"Não foi possível obter os tipos de itens cadastrados, tente novamente.",
						error
					);
				}
			);
	}

	public add (): void {
		this.editingItemType = undefined;
		this.nameInput = "";
		this.modalRef = this.modalService.show(this.modal);
		$(".nome-edicao").trigger("focus");
	}

	public startEditing (itemType: IItemType): void {
		this.editingItemType = itemType;
		this.nameInput = itemType.name;
		this.modalRef = this.modalService.show(this.modal);
		$(".nome-edicao").trigger("focus");
	}

	public cancelEdition (): void {
		this.editingItemType = undefined;
	}

	public save (): void {
		if (this.editingItemType)
			this.update();
		else
			this.create();
	}

	private create (): void {
		this.blockUI.start();
		this.itemTypesService.create(this.nameInput)
			.pipe(finalize(() => this.blockUI.stop()))
			.subscribe(
				_ => {
					this.modalRef?.hide();
					this.listItemTypes();
					this.alertsService.show(
						"Tipo de Item Adicionado",
						"O tipo de item foi adicionado com sucesso!",
						"success"
					);
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Adicionar Tipo de Item",
						"Não foi possível adicionar o tipo de item, tente novamente.",
						error
					);
				}
			);
	}

	private update (): void {
		if (!this.editingItemType) return;

		this.blockUI.start();
		this.itemTypesService.update(this.nameInput, this.editingItemType.idItemType)
			.pipe(finalize(() => this.blockUI.stop()))
			.subscribe(
				_ => {
					this.modalRef?.hide();
					this.listItemTypes();
					this.alertsService.show(
						"Tipo de Item Atualizado",
						"O tipo de item foi atualizado com sucesso!",
						"success"
					);
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Atualizar Tipo de Item",
						"Não foi possível atualizar o tipo de item, tente novamente.",
						error
					);
				}
			);
	}

	public async delete (itemType: IItemType): Promise<void> {
		const confirmed = await this.alertsService.confirm(
			`Tem certeza de que deseja remover o tipo de item '${itemType.name}'?`
		);

		if (!confirmed) return;

		this.blockUI.start();
		this.itemTypesService.delete(itemType.idItemType)
			.pipe(finalize(() => this.blockUI.stop()))
			.subscribe(
				_ => {
					this.listItemTypes();
					this.alertsService.show(
						"Tipo de Item Removido",
						"O tipo de item foi removido com sucesso!",
						"success"
					);
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Deletar Tipo de Item",
						"Não foi possível deletar o tipo de item, tente novamente.",
						error
					);
				}
			);
	}
}
