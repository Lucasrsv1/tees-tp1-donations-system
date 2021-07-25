import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

import { IDonation } from "src/app/interfaces/donation";
import { IItemType } from "src/app/interfaces/item-type";
import { HomeService } from "src/app/services/home/home.service";

@Component({
	selector: "app-home-page",
	templateUrl: "./home-page.component.html",
	styleUrls: ["./home-page.component.scss"]
})
export class HomePageComponent implements OnInit {
	private itemTypes: IItemType[] = [];

	public form: FormGroup;
	public donations: IDonation[] = [];

	constructor (
		private formBuilder: FormBuilder,
		private homeService: HomeService
	) {
		this.form = this.formBuilder.group({
			search: [""],
			types: [[]]
		});
	}

	public ngOnInit (): void { }

	public loadItemTypes (): void { }

	public search (): void { }

	public solicitDonation (idDonation: number): void { }
}
