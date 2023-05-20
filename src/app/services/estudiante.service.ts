import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstant } from '../utils/constants/global.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  constructor(
    private http: HttpClient
  ) { }

  
  public filtrar(nombre: any, apellido: any, pagina: any, cantPagina: any): Observable<any> {

    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_ESTUDIANTE_FILTRO;

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

  public agregar(nuevoEstudiante: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_ESTUDIANTE;

    return this.http.post(URL, nuevoEstudiante);
  }

  public actualizar(actualizarEstudiante: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_ESTUDIANTE;

    return this.http.put(URL, actualizarEstudiante);
  }

  public eliminar(estudiante: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + GlobalConstant.URL_ESTUDIANTE;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: estudiante,
    };

    return this.http.delete<any>(URL, options);
  }

}
