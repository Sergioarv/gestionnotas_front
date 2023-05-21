import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Profesor } from 'src/app/models/profesor';
import { ProfesorService } from 'src/app/services/profesor.service';
import { GlobalConstant } from 'src/app/utils/constants/global.constants';

@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.component.html',
  styleUrls: ['./profesor.component.css']
})
export class ProfesorComponent implements OnInit {

  regNombre = GlobalConstant.REG_NOMBRE;
  regNumeros = GlobalConstant.REG_NUMEROS;
  regCorreo = GlobalConstant.REG_CORREO;
  regPassword = GlobalConstant.REG_PASSWORD;

  cargando = false;

  closeResult = '';

  listaProfesor: Profesor[];
  profesorEliminar: Profesor;

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
    private profesorService: ProfesorService
  ) {
    this.listaProfesor = [];
    this.profesorEliminar = new Profesor();
  }

  ngOnInit(): void {
    this.filtrar();
  }

  filtrar() {
    this.cargando = true;

    let nombre = this.filtrarForm.controls['nombre'].value;
    let apellido = this.filtrarForm.controls['apellido'].value;

    this.profesorService.filtrar(nombre ? nombre : null, apellido ? apellido : null, this.pagina, this.cantPagina).subscribe(resp => {
      this.listaProfesor = resp.data.content;
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

  agregarProfesor() {
    this.cargando = true;

    const nuevoProf = new Profesor();

    const nombre = this.agregarForm.controls['nombre'].value;
    const apellido = this.agregarForm.controls['apellido'].value;
    const correo = this.agregarForm.controls['correo'].value;
    const contrasenia = this.agregarForm.controls['contrasenia'].value;

    nuevoProf.idusuario = '-1';
    nuevoProf.nombre = nombre ? nombre : '';
    nuevoProf.apellido = apellido ? apellido : '';
    nuevoProf.correo = correo ? correo : '';
    nuevoProf.contrasenia = contrasenia ? contrasenia : '';

    this.profesorService.agregar(nuevoProf).subscribe(resp => {
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

  editarProfesor(){
    this.cargando = true;

    const idusuario = this.editarForm.controls['idusuario'].value;
    const nombre = this.editarForm.controls['nombre'].value;
    const apellido = this.editarForm.controls['apellido'].value;
    const correo = this.editarForm.controls['correo'].value;
    const contrasenia = this.editarForm.controls['contrasenia'].value;

    const actualizarPro = this.listaProfesor.find((profR : Profesor) => profR.idusuario === idusuario);

    if(actualizarPro){
      actualizarPro.nombre = nombre? nombre : actualizarPro.nombre;
      actualizarPro.apellido = apellido? apellido : actualizarPro.apellido;
      actualizarPro.correo = correo? correo : actualizarPro.correo;
      actualizarPro.contrasenia = contrasenia? contrasenia : actualizarPro.contrasenia;

      this.profesorService.actualizar(actualizarPro).subscribe( resp => {
        if( resp.success){
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
    }else{
      this.toastrService.error('El profesor que intenta actualizar no existe', 'Proceso fallido');
      this.cargando = false;
    }    
  }

  eliminarProfesor(){
    this.cargando = true;

    this.profesorService.eliminar(this.profesorEliminar).subscribe( resp => {
      if(resp.success){
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

  seleccionarEditar(profesor: Profesor, contentEdit?: any){
    const profSelec = profesor;

    this.editarForm.get('idusuario')?.disable();

    this.editarForm.get('idusuario')?.setValue(profSelec.idusuario);
    this.editarForm.get('nombre')?.setValue(profSelec.nombre);
    this.editarForm.get('apellido')?.setValue(profSelec.apellido);
    this.editarForm.get('correo')?.setValue(profSelec.correo);
    this.editarForm.get('contrasenia')?.setValue(profSelec.contrasenia);

    this.open(contentEdit);
  }

  seleccionarEliminar(profesor: Profesor, contentEliminar?: any){
    this.profesorEliminar.idusuario = profesor.idusuario;
    this.profesorEliminar.nombre = profesor.nombre;
    this.profesorEliminar.apellido = profesor.apellido;
    this.profesorEliminar.correo = profesor.correo;
    this.profesorEliminar.contrasenia = profesor.contrasenia;

    this.open(contentEliminar);
  }

  /** limpiar form */

  limpiar() {
    this.filtrarForm.get('nombre')?.setValue('');
    this.filtrarForm.get('apellido')?.setValue('');
  }

  resetearAgregarForm() {
    this.agregarForm.get('nombre')?.setValue('');
    this.agregarForm.get('apellido')?.setValue('');
    this.agregarForm.get('correo')?.setValue('');
    this.agregarForm.get('contrasenia')?.setValue('');

    this.modalService.dismissAll('Close click');
  }

  resetearEditarForm() {
    this.editarForm.get('idusuario')?.setValue('');
    this.editarForm.get('nombre')?.setValue('');
    this.editarForm.get('apellido')?.setValue('');
    this.editarForm.get('correo')?.setValue('');
    this.editarForm.get('contrasenia')?.setValue('');

    this.modalService.dismissAll('Close click');
  }

  resetearEliminarForm(){
    this.profesorEliminar = new Profesor();
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
