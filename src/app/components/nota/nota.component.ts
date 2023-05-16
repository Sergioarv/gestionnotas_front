import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NotaDTO } from 'src/app/models/notaDTO';
import { NotaService } from 'src/app/services/nota.service';
import { GlobalConstant } from 'src/app/utils/constants/global.constants';

@Component({
  selector: 'app-nota',
  templateUrl: './nota.component.html',
  styleUrls: ['./nota.component.css']
})
export class NotaComponent implements OnInit {

  regNombre = GlobalConstant.REG_NOMBRE;
  regNumeros = GlobalConstant.REG_NUMEROS;

  /** variables paginación */
  esPrimero = false;
  esUltimo = false;
  pagina = 0;
  cantPagina = 10;
  totalPaginas: number[] = [];

  listaNota: NotaDTO[];

  filtrarForm = new FormGroup({
    nombre: new FormControl('', [Validators.pattern(this.regNombre)]),
    apellido: new FormControl('', [Validators.pattern(this.regNombre)]),
    materia: new FormControl('', [Validators.pattern(this.regNumeros)])
  });

  constructor(
    private notaService: NotaService
  ) {
    this.listaNota = [];
   }

  ngOnInit(): void {
    this.filtrar();
  }

  filtrar() {
    this.notaService.filtrar(null, null, null, this.pagina, this.cantPagina).subscribe(resp => {
      this.listaNota = resp.data.content;
    });
  }

  limpiar() {

  }

  /** barra de paginacion */

  rebobinar(primero?: any) {
    if (primero) {
      this.pagina = 0;
    } else {
      if (!this.esPrimero) {
        this.pagina--;
      }
    }
    this.filtrar();
  }

  avanzar(ultimo?: any) {
    if (ultimo) {
      this.pagina = this.totalPaginas.length - 1;
    } else {
      if (!this.esUltimo) {
        this.pagina++;

      }
    }
    this.filtrar();
  }

  setearPagina(pag: number): void {
    this.pagina = pag;
    this.filtrar();
  }

  setearCantida(cant: any): void {
    this.cantPagina = cant;
    this.pagina = 0;
    this.filtrar();
  }
}
