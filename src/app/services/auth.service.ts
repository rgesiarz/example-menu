import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TokenResponse } from '../interfaces/token.response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authKey = 'auth';
  clientId = 'example_menu';
  constructor(private http: HttpClient,
              @Inject(PLATFORM_ID) private platformId: any) {
  }
  // Przeprowadza logowanie
  login(username: string, password: string): Observable<any> {
    const url = 'api/token/auth';
    const data = {
      username,
      password,
      client_id: this.clientId,
      // Wymagane do zalogowania się przy użyciu nazwy użytkownika i hasła
      grant_type: 'password',
      // Oddzielona spacjami lista zakresów, dla których token będzie ważny
      scope: 'offline_access profile email'
    };

    return this.getAuthFromServer(url, data);
  }

  // Spróbuj odświeżyć token
  refreshToken(): Observable<any> {
    const url = 'api/token/auth';
    const data = {
      client_id: this.clientId,
      // Wymagane do zalogowania się przy użyciu nazwy użytkownika i hasła
      grant_type: 'refresh_token',
      // tslint:disable-next-line:no-non-null-assertion
      refresh_token: this.getAuth()!.refresh_token,
      // Oddzielona spacjami lista zakresów, dla których token będzie ważny
      scope: 'offline_access profile email'
    };

    return this.getAuthFromServer(url, data);
  }

  // Pobierz z serwera tokeny (dostępowy i odświeżania)
  getAuthFromServer(url: string, data: any): Observable<any> {
    return this.http.post<TokenResponse>(url, data)
      .pipe(
        map((res) => {
          const token = res && res.token;
          // Jeśli jest token, logowanie się udało
          if (token) {
            // Zapamiętaj nazwę użytkownika i tokeny
            this.setAuth(res);
            // Logowanie udane
            return true;
            // return token;
          }
          // Logowanie nieudane
          return Observable.throw('Unauthorized');
        }),
        catchError(error => {
          return new Observable<any>(error);
        })
      );
  }

  // Przeprowadź wylogowanie
  logout(): boolean {
    this.setAuth(null);
    return true;
  }

  // Umieść dane o uwierzytelnieniu w sessionStorage lub usuń dane, jeśli przekazano NULL
  setAuth(auth: TokenResponse | null): boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (auth) {
        sessionStorage.setItem(
          this.authKey,
          JSON.stringify(auth));
      }
      else {
        sessionStorage.removeItem(this.authKey);
      }
    }
    return true;
  }

  // Pobiera obiekt z danymi uwierzytelnienia (lub zwraca NULL, jeśli nie istnieje)
  getAuth(): TokenResponse | null {
    if (isPlatformBrowser(this.platformId)) {
      const i = sessionStorage.getItem(this.authKey);
      if (i) {
        return JSON.parse(i);
      }
    }
    return null;
  }

  // Zwraca TRUE, jeśli użytkownik jest zalogowany, lub FALSE w sytuacji przeciwnej
  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem(this.authKey) != null;
    }
    return false;
  }
}
