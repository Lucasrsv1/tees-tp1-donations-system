import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { IDonation } from "src/app/interfaces/donation";
import { IMessage } from "src/app/interfaces/message";
import { IPhoto } from "src/app/interfaces/photo";
import { ISolicitation, Validation } from "src/app/interfaces/solicitation";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class DonationsManagementService {
	constructor (private readonly http: HttpClient) { }

	// ============= Donations ============= //

	public list (): Observable<IDonation[]> {
		return this.http.get<IDonation[]>(`${environment.apiURL}/v1/donations`);
	}

	public getDonation (idDonation: number): Observable<IDonation> {
		return this.http.get<IDonation>(`${environment.apiURL}/v1/donations/${idDonation}`);
	}

	public create (donation: Partial<IDonation>): Observable<IDonation> {
		return this.http.post<IDonation>(`${environment.apiURL}/v1/donations`, donation);
	}

	public update (donation: Partial<IDonation>, idDonation: number): Observable<IDonation> {
		return this.http.put<IDonation>(`${environment.apiURL}/v1/donations/${idDonation}`, donation);
	}

	public delete (idDonation: number): Observable<IMessage> {
		return this.http.delete<IMessage>(`${environment.apiURL}/v1/donations/${idDonation}`);
	}

	// ============= Photos ============= //

	public uploadPhoto (idDonation: number, photo: File): Observable<IPhoto> {
		const body = new FormData();
		body.append("file_name", photo.name);
		body.append("photo", photo, photo.name);

		return this.http.post<IPhoto>(`${environment.apiURL}/v1/donations/${idDonation}/photos`, body);
	}

	public removePhotos (idDonation: number, photoId: number): Observable<IMessage> {
		return this.http.delete<IMessage>(`${environment.apiURL}/v1/donations/${idDonation}/photos/${photoId}`);
	}

	// ============= Validation ============= //

	public listPendingValidation (): Observable<IDonation[]> {
		return this.http.get<IDonation[]>(`${environment.apiURL}/v1/donations/pending/validation`);
	}

	public setValidation (idDonation: number, validation: Validation, reason: string): Observable<IMessage> {
		return this.http.patch<IMessage>(`${environment.apiURL}/v1/donations/${idDonation}/validation`, { validation, reason });
	}

	// ============= Solicitations ============= //

	public listSolicitations (idDonation: number): Observable<ISolicitation> {
		return this.http.get<ISolicitation>(`${environment.apiURL}/v1/donations/${idDonation}/solicitations`);
	}

	public confirmDonation (idDonation: number, idUser: number): Observable<IMessage> {
		return this.http.patch<IMessage>(`${environment.apiURL}/v1/donations/${idDonation}/solicitations`, { idUser });
	}
}
