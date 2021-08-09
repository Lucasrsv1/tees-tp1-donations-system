import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { IDonation } from "src/app/interfaces/donation";
import { IFilters } from "src/app/interfaces/filters";
import { ISolicitation } from "src/app/interfaces/solicitation";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class HomeService {
	constructor (private readonly http: HttpClient) { }

	public searchDonations (filters: IFilters): Observable<IDonation[]> {
		const params = new HttpParams()
			.append("search", filters.search)
			.append("itemTypes", filters.itemTypes.map(it => it.idItemType).join(","));

		return this.http.get<IDonation[]>(`${environment.apiURL}/v1/donations/search`, { params });
	}

	public solicitDonation (idDonation: number, justification: string): Observable<ISolicitation> {
		return this.http.post<ISolicitation>(`${environment.apiURL}/v1/donations/${idDonation}/solicitations`, { justification });
	}
}
