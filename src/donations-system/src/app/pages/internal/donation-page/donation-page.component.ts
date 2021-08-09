import { Location } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { faCheck, faPlus, faSave, faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";
import { DataTableDirective } from "angular-datatables";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { finalize } from "rxjs/operators";

import { requiredFileType } from "src/app/components/file-upload/file-upload.component";
import { IDonation } from "src/app/interfaces/donation";
import { IItemType } from "src/app/interfaces/item-type";
import { IPhoto } from "src/app/interfaces/photo";
import { ISolicitation } from "src/app/interfaces/solicitation";
import { AlertsService } from "src/app/services/alerts/alerts.service";
import { DataTableService } from "src/app/services/data-table/data-table.service";
import { DonationsManagementService } from "src/app/services/donations-management/donations-management.service";
import { ItemTypesService } from "src/app/services/item-types/item-types.service";
import { environment } from "src/environments/environment";

interface IState {
	id: string;
	name: string;
}

@Component({
	selector: "app-donation-page",
	templateUrl: "./donation-page.component.html",
	styleUrls: ["./donation-page.component.scss"]
})
export class DonationPageComponent implements OnInit, AfterViewInit {
	@BlockUI()
	private blockUI!: NgBlockUI;

	@ViewChild("modal", { static: true })
	private modal!: TemplateRef<any>;

	@ViewChild(DataTableDirective, { static: true })
	private dataTable!: DataTableDirective;

	public form: FormGroup;
	public uploadForm: FormGroup;

	public faCheck = faCheck;
	public faSave = faSave;
	public faPlus = faPlus;
	public faTimes = faTimes;
	public faUpload = faUpload;

	public idDonation: number = 0;
	public itemTypes: IItemType[] = [];
	public photos: IPhoto[] = [];
	public solicitations: ISolicitation[] = [];
	public modalRef: BsModalRef | undefined;
	public dtOptions: DataTables.Settings = { };
	public dtTrigger: Subject<any> = new Subject();

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
		private readonly activatedRoute: ActivatedRoute,
		private readonly modalService: BsModalService,
		private readonly formBuilder: FormBuilder,
		private readonly location: Location,
		private readonly router: Router,
		private readonly alertsService: AlertsService,
		private readonly itemTypesService: ItemTypesService,
		private readonly donationsManagementService: DonationsManagementService,
		private readonly dataTableService: DataTableService
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

		this.uploadForm = this.formBuilder.group({
			image: [null, requiredFileType(["png", "jpg", "jpeg"], true)]
		});

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
		this.loadItemTypes();
		if (this.idDonation > 0)
			this.getDonation();
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

	public openUploadModal (): void {
		this.uploadForm.controls.image.setValue(null);
		this.modalRef = this.modalService.show(this.modal);
	}

	public uploadPhoto (): void {
		this.blockUI.start();
		this.donationsManagementService.uploadPhoto(this.idDonation, this.uploadForm.controls.image.value)
			.pipe(finalize(() => this.blockUI.stop()))
			.subscribe(
				(photo: IPhoto) => {
					this.alertsService.show(
						"Foto Adicionada",
						"A foto foi adicionada com sucesso.",
						"success"
					);
					this.photos.push(photo);
					this.modalRef?.hide();
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Adicionar Foto",
						"Não foi possível adicionar a foto, tente novamente.",
						error
					);
				}
			);
	}

	public async removePhoto (photo: IPhoto): Promise<void> {
		const confirm = await this.alertsService.confirm("Tem certeza de que deseja excluir esta foto?");
		if (!confirm) return;

		this.blockUI.start();
		this.donationsManagementService.removePhotos(this.idDonation, photo.idItemPhoto)
			.pipe(finalize(() => this.blockUI.stop()))
			.subscribe(
				_ => {
					this.alertsService.show(
						"Foto Removida",
						"A foto foi removida com sucesso.",
						"success"
					);
					this.photos = this.photos.filter(p => p.idItemPhoto != photo.idItemPhoto);
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Remover Foto",
						"Não foi possível remover a foto, tente novamente.",
						error
					);
				}
			);
	}

	public getPhotoURL (link: string): string {
		return `${environment.serverURL}/uploads/${link}`;
	}

	public async confirmDonation (solicitation: ISolicitation): Promise<void> {
		const confirm = await this.alertsService.confirm(`Tem certeza de que deseja doar o item para ${solicitation.user.name}?`, false);
		if (!confirm) return;

		this.blockUI.start();
		this.donationsManagementService.confirmDonation(this.idDonation, solicitation.idUser)
			.pipe(finalize(() => this.blockUI.stop()))
			.subscribe(
				_ => {
					this.router.navigate(["donationsManagement"]);
					this.alertsService.show(
						"Doação Concluída",
						"A doação foi realizada com sucesso.",
						"success"
					);
				},
				(error: HttpErrorResponse) => {
					this.alertsService.httpErrorAlert(
						"Erro ao Aprovar Doação",
						"Não foi possível aprovar a doação, tente novamente.",
						error
					);
				}
			);
	}

	private updateForm (donation: IDonation): void {
		this.form.controls.description.setValue(donation.description);
		this.form.controls.idItemType.setValue(donation.idItemType);
		this.form.controls.quantity.setValue(donation.quantity);
		this.form.controls.state.setValue(donation.state);
		this.form.controls.city.setValue(donation.city);

		this.photos = donation.photos || [];
		this.solicitations = (donation.solicitations || []).sort(
			(a, b) => a.user.name < b.user.name ? -1 : (a.user.name > b.user.name ? 1 : 0)
		);

		this.rerenderDatatables();
	}
}
