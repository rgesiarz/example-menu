import { Injectable } from '@angular/core';
import {CanLoad, Route, Router, UrlSegment, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import decode from 'jwt-decode';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardCanLoadService implements CanLoad {

  constructor(
    public auth: AuthService,
    public router: Router
  ) { }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    /* DO USUNIĘCIA */
    return true;
    return false;
    /* ------------ */

    // czy użytkownik zalogowany
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['login']);
      return false;
    }

    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;

    const token = sessionStorage.getItem('auth');

    // decode the token to get its payload
    const tokenPayload = decode(token);

    // gdy użytkownik ma tylko jedną role zwracany jest string (w zmiennej tokenPayload.role) zamiast tablicy
    let roles = [];
    roles = roles.concat(tokenPayload.role);

    // czy użytkownik ma odpowiednią rolę
    if (!roles.some(r => expectedRole.indexOf(r) >= 0)) {
      this.router.navigate(['login']);
      return false;
    }

    return true;
  }
}
