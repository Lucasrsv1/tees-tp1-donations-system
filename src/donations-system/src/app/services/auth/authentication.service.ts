import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IUser } from '../../../interfaces/interfaces'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private readonly http: HttpClient) { }

  signUp(email: String, password: String): Observable<void> {
    return new Observable();
  }

  login(email: String, password: String): Observable<boolean> {
    return new Observable();
  }

  isLoggedIn(): boolean {
    return true;
  }

  // getLoggedUser(): IUser {
  //   return ;
  // }

}
