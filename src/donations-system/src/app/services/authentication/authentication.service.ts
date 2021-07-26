import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import jwtDecode from "jwt-decode";

import { IUser, UserType } from "src/app/interfaces/user";
import { environment } from "src/environments/environment";
import { AlertsService } from "../alerts/alerts.service";
import { LocalStorageKey, LocalStorageService } from "../local-storage/local-storage.service";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
	constructor (
		private readonly http: HttpClient,
		private readonly router: Router,
		private readonly alertsService: AlertsService,
		private readonly localStorage: LocalStorageService
	) { }

	public signUp (user: IUser): Observable<IUser> {
		return this.http.post<IUser>(`${environment.apiURL}/v1/signUp`, user).pipe(
			tap(_ => {
				this.alertsService.show("Cadastro Realizado", "O novo usuário foi cadastrado com sucesso.<br/>Você já pode fazer login com ele.", "success");
				this.router.navigate(["login"]);
			}, (error: HttpErrorResponse) => {
				this.alertsService.httpErrorAlert(
					"Erro ao Cadastrar",
					"Não foi possível realizar o cadastro, tente novamente.",
					error
				);
			})
		);
	}

	public login (email: string, password: string): Observable<{ token: string }> {
		return this.http.post<{ token: string }>(
			`${environment.apiURL}/v1/login`,
			{ email, password }
		).pipe(
			tap(response => {
				this.localStorage.set(LocalStorageKey.USER, response.token);
				this.router.navigate(["home"]);
			}, (error: HttpErrorResponse) => {
				this.alertsService.httpErrorAlert(
					"Falha ao Entrar",
					"Não foi possível fazer login, tente novamente.",
					error
				);
			})
		);
	}

	public signOut (): void {
		this.localStorage.delete(LocalStorageKey.USER);
		this.router.navigate(["login"]);
	}

	public isSystemAdmin (): boolean {
		if (!this.isLoggedIn()) return false;

		const user = this.getLoggedUser();
		return user?.type === UserType.ADM;
	}

	public isLoggedIn (): boolean {
		const user = this.getLoggedUser();
		return Boolean(user && user.idUser && user.idUser > 0);
	}

	public getLoggedUser (): IUser | null {
		const token = this.localStorage.get(LocalStorageKey.USER);
		try {
			return (token ? jwtDecode(token) : null) as IUser;
		} catch (error) {
			return null;
		}
	}
}
