import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { IItemType } from "src/app/interfaces/item-type";
import { IMessage } from "src/app/interfaces/message";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class ItemTypesService {
	constructor (private readonly http: HttpClient) { }

	public list (): Observable<IItemType[]> {
		return this.http.get<IItemType[]>(`${environment.apiURL}/v1/itemTypes`);
	}

	public create (name: string): Observable<IItemType> {
		return this.http.post<IItemType>(`${environment.apiURL}/v1/itemTypes`, { name });
	}

	public update (name: string, idItemType: number): Observable<IItemType> {
		return this.http.patch<IItemType>(`${environment.apiURL}/v1/itemTypes/${idItemType}`, { name });
	}

	public delete (idItemType: number): Observable<IMessage> {
		return this.http.delete<IMessage>(`${environment.apiURL}/v1/itemTypes/${idItemType}`);
	}
}
