import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Estudiante } from 'src/app/models/estudiante';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { GlobalConstant } from 'src/app/utils/constants/global.constants';

import { faUserPlus, faPlus, faMagnifyingGlass, faEraser, faEye, faPenToSquare, faBan, faSave, faCircleCheck, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.css']
})
export class EstudianteComponent implements OnInit {

  faUserPlus = faUserPlus;
  faPlus = faPlus;
  faMagnifyingGlass = faMagnifyingGlass;
  faEraser = faEraser;
  faEye = faEye;
  faPenToSquare = faPenToSquare;
  faBan = faBan;
  faSave = faSave;
  faCircleCheck = faCircleCheck;
  faTrashCan = faTrashCan;

  regNombre = GlobalConstant.REG_NOMBRE;
  regNumeros = GlobalConstant.REG_NUMEROS;
  regCorreo = GlobalConstant.REG_CORREO;
  regPassword = GlobalConstant.REG_PASSWORD;

  cargando = false;

  closeResult = '';

  listaEstudiante: Estudiante[];
  estudianteEliminar: Estudiante;

  authority: string = '';

  /** variables paginación */
  esPrimero = false;
  esUltimo = false;
  pagina = 0;
  cantPagina = 10;
  totalPaginas: number[] = [];

  filtrarForm = new FormGroup({
    nombre: new FormControl('', [Validators.pattern(this.regNombre)]),
    apellido: new FormControl('', [Validators.pattern(this.regNombre)]),
  });

  agregarForm = new FormGroup({
    nombre: new FormControl('', [Validators.pattern(this.regNombre)]),
    apellido: new FormControl('', [Validators.pattern(this.regNombre)]),
    correo: new FormControl('', [Validators.pattern(this.regCorreo)]),
    contrasenia: new FormControl('', [Validators.pattern(this.regPassword)])
  });

  editarForm = new FormGroup({
    idusuario: new FormControl(''),
    nombre: new FormControl('', [Validators.pattern(this.regNombre)]),
    apellido: new FormControl('', [Validators.pattern(this.regNombre)]),
    correo: new FormControl('', [Validators.pattern(this.regCorreo)]),
    contrasenia: new FormControl('', [Validators.pattern(this.regPassword)])
  });

  constructor(
    private toastrService: ToastrService,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private estudianteService: EstudianteService,
    private route: Router,
    private tokenService: TokenService
  ) {
    this.listaEstudiante = [];
    this.estudianteEliminar = new Estudiante();
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.authority = this.tokenService.getRoles();
    this.filtrar();
  }

  filtrar() {
    this.cargando = true;

    let nombre = this.filtrarForm.controls['nombre'].value;
    let apellido = this.filtrarForm.controls['apellido'].value;

    this.estudianteService.filtrar(nombre ? nombre : null, apellido ? apellido : null, this.pagina, this.cantPagina).subscribe(resp => {
      this.listaEstudiante = resp.data.content;
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

  agregarEstudiante() {
    this.cargando = true;

    const nuevoEst = new Estudiante();

    const nombre = this.agregarForm.controls['nombre'].value;
    const apellido = this.agregarForm.controls['apellido'].value;
    const correo = this.agregarForm.controls['correo'].value;
    const contrasenia = this.agregarForm.controls['contrasenia'].value;

    nuevoEst.idusuario = '-1';
    nuevoEst.nombre = nombre ? nombre : '';
    nuevoEst.apellido = apellido ? apellido : '';
    nuevoEst.correo = correo ? correo : '';
    nuevoEst.contrasenia = contrasenia ? contrasenia : '';
    nuevoEst.clave = contrasenia ? contrasenia : '';

    this.estudianteService.agregar(nuevoEst).subscribe(resp => {
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


  editarEstudiante() {
    this.cargando = true;

    const idusuario = this.editarForm.controls['idusuario'].value;
    const nombre = this.editarForm.controls['nombre'].value;
    const apellido = this.editarForm.controls['apellido'].value;
    const correo = this.editarForm.controls['correo'].value;
    const contrasenia = this.editarForm.controls['contrasenia'].value;

    const actualizarEst = this.listaEstudiante.find((estR: Estudiante) => estR.idusuario === idusuario);

    if (actualizarEst) {
      actualizarEst.nombre = nombre ? nombre : actualizarEst.nombre;
      actualizarEst.apellido = apellido ? apellido : actualizarEst.apellido;
      actualizarEst.correo = correo ? correo : actualizarEst.correo;
      actualizarEst.contrasenia = contrasenia ? contrasenia : actualizarEst.clave;
      actualizarEst.clave = contrasenia ? contrasenia : actualizarEst.clave;

      this.estudianteService.actualizar(actualizarEst).subscribe(resp => {
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
      this.toastrService.error('El estudiante que intenta actualizar no existe', 'Proceso fallido');
      this.cargando = false;
    }
  }

  eliminarEstudiante() {
    this.cargando = true;

    this.estudianteService.eliminar(this.estudianteEliminar).subscribe(resp => {
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

  seleccionarEditar(estudiante: Estudiante, contentEdit?: any) {
    const estSelec = estudiante;

    this.editarForm.get('idusuario')?.disable();

    this.editarForm.get('idusuario')?.setValue(estSelec.idusuario);
    this.editarForm.get('nombre')?.setValue(estSelec.nombre);
    this.editarForm.get('apellido')?.setValue(estSelec.apellido);
    this.editarForm.get('correo')?.setValue(estSelec.correo);
    this.editarForm.get('contrasenia')?.setValue(estSelec.clave);

    this.open(contentEdit);
  }

  seleccionarEliminar(estudiante: Estudiante, contentEliminar?: any) {
    this.estudianteEliminar.idusuario = estudiante.idusuario;
    this.estudianteEliminar.nombre = estudiante.nombre;
    this.estudianteEliminar.apellido = estudiante.apellido;
    this.estudianteEliminar.correo = estudiante.correo;
    this.estudianteEliminar.contrasenia = estudiante.contrasenia;
    this.estudianteEliminar.clave = estudiante.clave;

    this.open(contentEliminar);
  }

  mostrarNotas(estudiante: any) {
    localStorage.setItem('nombre', estudiante.nombre);
    localStorage.setItem('apellido', estudiante.apellido);
    this.route.navigate(['/nota']);
  }

  /** limpiar form */

  limpiar() {
    this.filtrarForm.get('nombre')?.setValue('');
    this.filtrarForm.get('apellido')?.setValue('');
    this.filtrar();
  }

  resetearAgregarForm() {
    this.agregarForm.get('nombre')?.setValue('');
    this.agregarForm.get('apellido')?.setValue('');
    this.agregarForm.get('correo')?.setValue('');
    this.agregarForm.get('contrasenia')?.setValue('');
    this.filtrar();
    this.modalService.dismissAll('Close click');
  }

  resetearEditarForm() {
    this.editarForm.get('idusuario')?.setValue('');
    this.editarForm.get('nombre')?.setValue('');
    this.editarForm.get('apellido')?.setValue('');
    this.editarForm.get('correo')?.setValue('');
    this.editarForm.get('contrasenia')?.setValue('');
    this.filtrar();
    this.modalService.dismissAll('Close click');
  }

  resetearEliminarForm() {
    this.estudianteEliminar = new Estudiante();
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
