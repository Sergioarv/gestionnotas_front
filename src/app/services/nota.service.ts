import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstant } from '../utils/constants/global.constants';

@Injectable({
  providedIn: 'root'
})
export class NotaService {

  constructor(
    private http: HttpClient
  ) { }

  public filtrar(nombre: any, apellido: any, materia: any, pagina: any, cantPagina: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_NOTA_FILTRO;

    let params = '';

    if (nombre) {
      if (params.length > 0) {
        params = params.concat('&nombre=').concat(nombre);
      } else {
        params = params.concat('?nombre=').concat(nombre);
      }
    }

    if (apellido) {
      if (params.length > 0) {
        params = params.concat('&apellido=').concat(apellido);
      } else {
        params = params.concat('?apellido=').concat(apellido);
      }
    }

    if (materia) {
      if (params.length > 0) {
        params = params.concat('&materia=').concat(materia);
      } else {
        params = params.concat('?materia=').concat(materia);
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
    console.log(pagina,params);

    return this.http.get<any>(URL + params);
  }

  public agregar(nuevaNota: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_NOTA;

    return this.http.post(URL, nuevaNota);
  }

  public actualizar(actualizarNota: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_NOTA;

    return this.http.put(URL, actualizarNota);
  }

  public eliminar(nota: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_NOTA;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: nota,
    };

    return this.http.delete<any>(URL, options);
  }
}
