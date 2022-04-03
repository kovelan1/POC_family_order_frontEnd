import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree ,Router} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (localStorage.getItem('user_roles').includes("ROLE_ADMIN") || localStorage.getItem('user_roles').includes("ROLE_SUPER_ADMIN")) {
      return true;
    }
    this.router.navigate(['/authentication/login'], {queryParams: {returnUrl: state.url}});
    return false;
  }
  
}
