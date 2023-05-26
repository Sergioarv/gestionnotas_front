import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'AuthToken';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<string> = [];
  rolReal = '';

  constructor(
    private router: Router
  ) { }

  setToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): any {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  isLogged(): boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  public getRoles(): string {
    if (!this.isLogged()) {
      return '';
    }
    const token = this.getToken();
    const values = this.decodePayload(token);
    this.roles = values.roles;

    this.roles.forEach(rol => {
      if (rol === 'ROLE_ADMIN') {
        this.rolReal = 'admin';
      } else if (rol === 'ROLE_PROFESOR') {
        this.rolReal = 'profesor';
      } else if (rol === 'ROLE_ESTUDIANTE') {
        this.rolReal = 'estudiante';
      }  
    });
    return this.rolReal;
  }

  private decodePayload(token: string): any {
    const payload = token.split(".")[1];
    const payloadDecoded = atob(payload);
    return JSON.parse(payloadDecoded);
  }

  getId(): string {
    if (!this.isLogged()) {
      return '';
    }
    const token = this.getToken();
    const values = this.decodePayload(token);
    return values.id;
  }

  getNombre(): string {
    if (!this.isLogged()) {
      return '';
    }
    const token = this.getToken();
    const values = this.decodePayload(token);
    return values.nombre;
  }

  getApellido(): string {
    if (!this.isLogged()) {
      return '';
    }
    const token = this.getToken();
    const values = this.decodePayload(token);
    return values.apellido;
  }

  logOut(): void {
    window.sessionStorage.clear();
    this.router.navigate(['/login'])
  }
}
