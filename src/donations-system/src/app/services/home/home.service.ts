import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { IDonation } from "src/app/interfaces/donation";
import { IFilters } from "src/app/interfaces/filters";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class HomeService {
	private lastDate!: Date;

	constructor (private http: HttpClient) { }

	public searchDonations (filters: IFilters): Observable<IDonation[]> {
		if (!filters.search && !filters.itemTypes.length)
			return this.listLatestDonations();

		const params = new HttpParams()
			.append("search", filters.search)
			.append("itemTypes", filters.itemTypes.map(it => it.idItemType).join(","));

		return this.http.get<IDonation[]>(environment.apiURL + "/donations", { params });
	}

	private listLatestDonations (): Observable<IDonation[]> {
		const params = this.lastDate ? new HttpParams().append("search", this.lastDate.valueOf()) : undefined;
		return this.http.get<IDonation[]>(environment.apiURL + "/donations", { params }).pipe(
			tap(donations => {
				this.lastDate = donations.reduce((max: Date, donation: IDonation) => {
					return max && max > donation.createdAt ? max : donation.createdAt;
				}, new Date(0));
			})
		);
	}

	public solicitDonation (idDonation: number): Observable<boolean> {
		return this.http.post<boolean>(environment.apiURL + "/donations", { idDonation });
	}
}
