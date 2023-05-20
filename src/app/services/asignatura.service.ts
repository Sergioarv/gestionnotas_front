import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstant } from '../utils/constants/global.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  constructor(
    private http: HttpClient
  ) { }

  public filtrar(nombre: any, pagina: any, cantPagina: any): Observable<any> {

    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_ASIGNATURA_FILTRO;

    let params = '';

    if (nombre) {
      if (params.length > 0) {
        params = params.concat('&nombre=').concat(nombre);
      } else {
        params = params.concat('?nombre=').concat(nombre);
      }
    }

    if (pagina || pagina >= 0) {
      if (params.length > 0) {
        params = params.concat('&pagina=').concat(pagina);
      } else {
        params = params.concat('?pagina=').concat(pagina);
      }
    }

    if (cantPagina || cantPagina > 0) {
      if (params.length > 0) {
        params = params.concat('&cantPagina=').concat(cantPagina);
      } else {
        params = params.concat('?cantPagina=').concat(cantPagina);
      }
    }

    return this.http.get<any>(URL + params);
  }

  public agregar(nuevaAsignatura: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_ASIGNATURA;

    return this.http.post(URL, nuevaAsignatura);
  }

  public actualizar(actualizarAsignatura: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_ASIGNATURA;

    return this.http.put(URL, actualizarAsignatura);
  }

  public eliminar(asignatura: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_ASIGNATURA;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: asignatura,
    };

    return this.http.delete<any>(URL, options);
  }
}
