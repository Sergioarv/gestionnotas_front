import { Injectable } from '@angular/core';
import { GlobalConstant } from '../utils/constants/global.constants';
import { LoginUsuario } from '../models/loginUsuario';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtDto } from '../models/jwtDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authURL = GlobalConstant.URL_ENDPOINT;

  constructor(
    private http: HttpClient
  ) { }

  login(loginUsuario: LoginUsuario): Observable<any> {
    const login = GlobalConstant.URL_AUTH_LOGIN;
    return this.http.post<any>(this.authURL+login, loginUsuario);
  }

  refresh(jwtDto: JwtDto): Observable<any> {
    const login = GlobalConstant.URL_AUTH_REFRESH;
    return this.http.post<any>(this.authURL + login, jwtDto);
  }
}
