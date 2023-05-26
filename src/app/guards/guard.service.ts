import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  realRol: string = '';

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const expectedRol = route.data['expectedRol'];
    
    this.realRol = this.tokenService.getRoles();
    
    if (!this.tokenService.getToken() || expectedRol.indexOf(this.realRol) < 0 ) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
