import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Asignatura } from 'src/app/models/asignatura';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { GlobalConstant } from 'src/app/utils/constants/global.constants';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.component.html',
  styleUrls: ['./asignatura.component.css']
})
export class AsignaturaComponent implements OnInit {

  regNombre = GlobalConstant.REG_NOMBRE;

  cargando = false;

  closeResult = '';

  listaAsignatura: Asignatura[];
  asignaturaEliminar: Asignatura;

  /** variables paginación */
  esPrimero = false;
  esUltimo = false;
  pagina = 0;
  cantPagina = 10;
  totalPaginas: number[] = [];

  filtrarForm = new FormGroup({
    nombre: new FormControl('', [Validators.pattern(this.regNombre)])
  });

  agregarForm = new FormGroup({
    nombre: new FormControl('', [Validators.pattern(this.regNombre)])
  });

  editarForm = new FormGroup({
    idasignatura: new FormControl(''),
    nombre: new FormControl('', [Validators.pattern(this.regNombre)])
  });

  constructor(
    private toastrService: ToastrService,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private asignaturaService: AsignaturaService
  ) {
    this.listaAsignatura = [];
    this.asignaturaEliminar = new Asignatura();
  }

  ngOnInit(): void {
    this.filtrar();
  }

  filtrar() {
    this.cargando = true;

    let nombre = this.filtrarForm.controls['nombre'].value;

    this.asignaturaService.filtrar(nombre ? nombre : null, this.pagina, this.cantPagina).subscribe(resp => {
      this.listaAsignatura = resp.data.content;
      if (resp.success) {
        this.esPrimero = resp.data.first;
        this.esUltimo = resp.data.last;
        this.totalPaginas = new Array(resp.data['totalPages']);
        this.toastrService.success(resp.message, 'Proceso exitoso');
        this.cargando = false;
      } else {
        this.toastrService.error(resp.message, 'Proceso fallido');
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido');
      this.cargando = false;
    });
  }


  agregarAsignatura() {
    this.cargando = true;

    const nuevaAsig = new Asignatura();

    const nombre = this.agregarForm.controls['nombre'].value;

    nuevaAsig.idasignatura = '-1';
    nuevaAsig.nombre = nombre ? nombre : '';

    this.asignaturaService.agregar(nuevaAsig).subscribe(resp => {
      if (resp.success) {
        this.toastrService.success(resp.message, 'Proceso exitoso');
        this.cargando = false;
        this.modalService.dismissAll('Save click');
        this.resetearAgregarForm();
        this.filtrar();
      } else {
        this.toastrService.error(resp.message, 'Proceso fallido');
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido');
      this.cargando = false;
    });
  }

  editarAsignatura() {
    this.cargando = true;

    const idasignatura = this.editarForm.controls['idasignatura'].value;
    const nombre = this.editarForm.controls['nombre'].value;

    const actualizarAsig = this.listaAsignatura.find((asigR: Asignatura) => asigR.idasignatura === idasignatura);

    if (actualizarAsig) {
      actualizarAsig.nombre = nombre ? nombre : actualizarAsig.nombre;

      this.asignaturaService.actualizar(actualizarAsig).subscribe(resp => {
        if (resp.success) {
          this.toastrService.success(resp.message, 'Proceso exitoso');
          this.cargando = false;
          this.modalService.dismissAll('Save click');
          this.resetearEditarForm();
          this.filtrar();
        } else {
          this.toastrService.error(resp.message, 'Proceso fallido');
          this.cargando = false;
        }
      }, error => {
        this.toastrService.error(error.message, 'Proceso fallido');
        this.cargando = false;
      });
    } else {
      this.toastrService.error('La asignatura que intenta actualizar no existe', 'Proceso fallido');
      this.cargando = false;
    }
  }

  eliminarAsignatura() {
    this.cargando = true;

    this.asignaturaService.eliminar(this.asignaturaEliminar).subscribe(resp => {
      if (resp.success) {
        this.toastrService.success(resp.message, 'Proceso exitoso');
        this.cargando = false;
        this.modalService.dismissAll('Save click');
        this.resetearEliminarForm();
        this.filtrar();
      } else {
        this.toastrService.error(resp.message, 'Proceso fallido');
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido');
      this.cargando = false;
    });
  }

  seleccionarEditar(asignatura: Asignatura, contentEdit?: any) {
    const asigSelec = asignatura;

    this.editarForm.get('idusuario')?.disable();

    this.editarForm.get('idasignatura')?.setValue(asigSelec.idasignatura);
    this.editarForm.get('nombre')?.setValue(asigSelec.nombre);

    this.open(contentEdit);
  }

  seleccionarEliminar(asignatura: Asignatura, contentEliminar?: any) {
    this.asignaturaEliminar.idasignatura = asignatura.idasignatura;
    this.asignaturaEliminar.nombre = asignatura.nombre;

    this.open(contentEliminar);
  }

  /** limpiar form */

  limpiar() {
    this.filtrarForm.get('nombre')?.setValue('');
  }

  resetearAgregarForm() {
    this.agregarForm.get('nombre')?.setValue('');
    this.filtrar();
    this.modalService.dismissAll('Close click');
  }

  resetearEditarForm() {
    this.editarForm.get('idasignatura')?.setValue('');
    this.editarForm.get('nombre')?.setValue('');
    this.filtrar();
    this.modalService.dismissAll('Close click');
  }

  resetearEliminarForm() {
    this.asignaturaEliminar = new Asignatura();
    this.filtrar();
    this.modalService.dismissAll('Close click');
  }

  /** Modals */
  open(content: any) {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdropClass: 'light-blue-backdrop' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  /** barra de paginacion **/

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
