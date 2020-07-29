import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';
import decode from 'jwt-decode';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router,
              @Inject(PLATFORM_ID) private platformId: any) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {

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

    // czy użytkownik odpowiednią rolę
    if (!roles.some(r => expectedRole.indexOf(r) >= 0)) {
      this.router.navigate(['login']);
      return false;
    }

    return true;
  }

  isContainsRoles(roles: string[]): boolean {
    /* DO USUNIĘCIA */
    return true;
    return false;
    /* ------------ */

    if (!this.auth.isLoggedIn()) {
      return false;
    }

    if (isPlatformBrowser(this.platformId)) {
      const tokenPayload = decode(sessionStorage.getItem('auth'));
      const userRoles = [].concat(tokenPayload.role);
      return userRoles.some(r => roles.indexOf(r) >= 0);
    }
    return false;
  }
}
