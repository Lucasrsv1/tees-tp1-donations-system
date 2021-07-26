import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { IDonation } from "src/app/interfaces/donation";
import { IMessage } from "src/app/interfaces/message";
import { ISolicitation, Validation } from "src/app/interfaces/solicitation";
import { IUser } from "src/app/interfaces/user";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class DonationsManagementService {
	constructor (private http: HttpClient) { }

	// ============= Donations ============= //

	public list (): Observable<IDonation[]> {
		return this.http.get<IDonation[]>(`${environment.apiURL}/v1/donations`);
	}

	public getDonation (idDonation: number): Observable<IDonation> {
		return this.http.get<IDonation>(`${environment.apiURL}/v1/donations/${idDonation}`);
	}

	public create (donation: IDonation): Observable<IDonation> {
		return this.http.post<IDonation>(`${environment.apiURL}/v1/donations`, donation);
	}

	public update (donation: IDonation, idDonation: number): Observable<IDonation> {
		return this.http.put<IDonation>(`${environment.apiURL}/v1/donations/${idDonation}`, donation);
	}

	public delete (idDonation: number): Observable<IMessage> {
		return this.http.delete<IMessage>(`${environment.apiURL}/v1/donations/${idDonation}`);
	}

	// ============= Photos ============= //

	public uploadPhotos (idDonation: number, photos: File[]): Observable<IMessage> {
		const body = new FormData();
		for (let i = 0; i < photos.length; i++) {
			body.append(`file_name[${i}]`, photos[i].name);
			body.append(`photo[${i}]`, photos[i], photos[i].name);
		}

		return this.http.post<IMessage>(`${environment.apiURL}/v1/donations/${idDonation}/photos`, body);
	}

	public removePhotos (idDonation: number, photoIds: number[]): Observable<IMessage> {
		const params = new HttpParams().append("photoIds", photoIds.join(","));
		return this.http.delete<IMessage>(`${environment.apiURL}/v1/donations/${idDonation}/photos`, { params });
	}

	// ============= Validation ============= //

	public listPendingValidation (): Observable<IDonation[]> {
		return this.http.get<IDonation[]>(`${environment.apiURL}/v1/donations/pending/validation`);
	}

	public setValidation (idDonation: number, validation: Validation): Observable<IMessage> {
		return this.http.patch<IMessage>(`${environment.apiURL}/v1/donations/${idDonation}/validation`, { validation });
	}

	// ============= Solicitations ============= //

	public listSolicitations (idDonation: number): Observable<ISolicitation> {
		return this.http.get<ISolicitation>(`${environment.apiURL}/v1/donations/${idDonation}/solicitations`);
	}

	public confirmDonation (idDonation: number, idUser: number): Observable<IMessage> {
		return this.http.patch<IMessage>(`${environment.apiURL}/v1/donations/${idDonation}/solicitations`, { idUser });
	}
}
