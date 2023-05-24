import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Asignatura } from 'src/app/models/asignatura';
import { Estudiante } from 'src/app/models/estudiante';
import { Nota } from 'src/app/models/nota';
import { NotaDTO } from 'src/app/models/notaDTO';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { NotaService } from 'src/app/services/nota.service';
import { GlobalConstant } from 'src/app/utils/constants/global.constants';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { faUserPlus, faPlus, faMagnifyingGlass, faEraser, faEye, faPenToSquare, faBan, faSave, faCircleCheck, faTrashCan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nota',
  templateUrl: './nota.component.html',
  styleUrls: ['./nota.component.css']
})
export class NotaComponent implements OnInit {

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

  cargando = false;

  closeResult = '';

  /** variables paginación */
  esPrimero = false;
  esUltimo = false;
  pagina = 0;
  cantPagina = 10;
  totalPaginas: number[] = [];

  listaNota: NotaDTO[];
  listaEstudiantes: Estudiante[];
  listaAsignaturas: Asignatura[];

  notaEliminar: Nota;

  filtrarForm = new FormGroup({
    nombre: new FormControl('', [Validators.pattern(this.regNombre)]),
    apellido: new FormControl('', [Validators.pattern(this.regNombre)]),
    materia: new FormControl('', [Validators.pattern(this.regNombre)])
  });

  agregarNotaForm = new FormGroup({
    calificacion: new FormControl('', [Validators.pattern(this.regNumeros)]),
    asignaturas: new FormControl(''),
    estudiantes: new FormControl('')
  });

  editarNotaForm = new FormGroup({
    calificacion: new FormControl('', [Validators.pattern(this.regNumeros)]),
    asignaturas: new FormControl(''),
    estudiantes: new FormControl(''),
    idnota: new FormControl('')
  });

  constructor(
    private notaService: NotaService,
    private estudianteService: EstudianteService,
    private asignaturaService: AsignaturaService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    this.listaNota = [];
    this.listaEstudiantes = [];
    this.listaAsignaturas = [];
    this.notaEliminar = new Nota();
  }

  ngOnInit(): void {
    this.listarCombox();
  }

  filtrar() {

    this.cargando = true;

    let nombre = this.filtrarForm.controls['nombre'].value;
    let apellido = this.filtrarForm.controls['apellido'].value;
    let materia = this.filtrarForm.controls['materia'].value;

    this.notaService.filtrar(nombre ? nombre : null, apellido ? apellido : null, materia ? materia : null, this.pagina, this.cantPagina).subscribe(resp => {
      this.listaNota = resp.data.content;
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

  agregarNota() {

    this.cargando = true;

    const nuevaNota = new Nota();
    const estudiante = this.agregarNotaForm.controls['estudiantes'].value;
    const asignatura = this.agregarNotaForm.controls['asignaturas'].value;
    const calificacion = this.agregarNotaForm.controls['calificacion'].value;

    const indexAsig: any = asignatura? asignatura : '-1';
    const indexEst: any = estudiante? estudiante : '-1';

    if (estudiante != '' && asignatura != '') {

      nuevaNota.idnota = '-1';
      nuevaNota.calificacion = calificacion ? parseFloat(calificacion) : 0;
      nuevaNota.asignatura = this.listaAsignaturas[indexAsig];
      nuevaNota.estudiante = this.listaEstudiantes[indexEst];

      const verfi = this.notaService.verificarNota(
        nuevaNota.estudiante.idusuario,nuevaNota.asignatura.idasignatura).subscribe( resp => {
          if(resp.success){
            this.notaService.agregar(nuevaNota).subscribe(resp => {
              if (resp.success) {
                this.toastrService.success(resp.message, 'Proceso exitoso');
                this.cargando = false;
                this.modalService.dismissAll('Save click');
                this.resetearAgregarNotaForm();
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
            this.toastrService.error(resp.message, 'Proceso fallido');
            this.cargando = false;
          }
      }, error => {
        this.toastrService.error(error.message, 'Proceso fallido');
        this.cargando = false;
      });
    } else {

      if (estudiante === '') {
        this.toastrService.info('Por favor seleccione un estudiante', 'Proceso exitoso');
        this.cargando = false;
      }

      if (asignatura === '') {
        this.toastrService.info('Por favor seleccione una asignatura', 'Proceso exitoso');
        this.cargando = false;
      }
    }
  }

  editarNota() {

    this.cargando = true;

    const idnota = this.editarNotaForm.controls['idnota'].value;

    const editarNota = this.listaNota.find((notaR: NotaDTO) => notaR.idnota === idnota);

    const actualizarNota = new Nota();

    const calificacion = this.editarNotaForm.controls['calificacion'].value;
    const estudiante = editarNota?.idusuario;
    const asignatura = editarNota?.idasignatura;


    actualizarNota.idnota = idnota ? idnota : '';
    actualizarNota.calificacion = calificacion ? parseFloat(calificacion) : 0.0;
    actualizarNota.asignatura.idasignatura = asignatura ? asignatura : '';
    actualizarNota.estudiante.idusuario = estudiante ? estudiante : '';

    this.notaService.actualizar(actualizarNota).subscribe(resp => {
      if (resp.success) {
        this.toastrService.success(resp.message, 'Proceso exitoso');
        this.cargando = false;
        this.modalService.dismissAll('Save click');
        this.resetearEditarNotaForm();
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

  eliminarNota() {

    this.cargando = true;

    this.notaService.eliminar(this.notaEliminar).subscribe(resp => {
      if (resp.success) {
        this.toastrService.success(resp.message, 'Proceso exitoso');
        this.cargando = false;
        this.modalService.dismissAll('Save click');
        this.resetearEliminarNotaForm();
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

  seleccionarEditar(nota: NotaDTO, contentEdit?: any) {

    const notaSelec = nota;

    this.editarNotaForm.get('idnota')?.disable();
    this.editarNotaForm.get('estudiantes')?.disable();
    this.editarNotaForm.get('asignaturas')?.disable();

    this.editarNotaForm.get('idnota')?.setValue(notaSelec.idnota);
    this.editarNotaForm.get('calificacion')?.setValue(notaSelec.calificacion + '');
    this.editarNotaForm.get('estudiantes')?.setValue(notaSelec.idusuario);
    this.editarNotaForm.get('asignaturas')?.setValue(notaSelec.idasignatura);

    this.open(contentEdit);
  }

  seleccionarEliminar(nota: NotaDTO, contentEliminar?: any) {

    const est = this.listaEstudiantes.find((estR: Estudiante) => estR.idusuario === nota.idusuario);
    const asig = this.listaAsignaturas.find((asigR: Asignatura) => asigR.idasignatura === nota.idasignatura);

    this.notaEliminar.idnota = nota.idnota;
    this.notaEliminar.calificacion = nota.calificacion;
    this.notaEliminar.estudiante = est === undefined ? new Estudiante : est;
    this.notaEliminar.asignatura = asig === undefined ? new Asignatura : asig;

    this.open(contentEliminar);
  }

  listarCombox() {
    this.estudianteService.listar().subscribe(resp => {
      this.listaEstudiantes = resp.data;
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido');
    });

    this.asignaturaService.filtrar(null, this.pagina, this.cantPagina).subscribe(resp => {
      this.listaAsignaturas = resp.data.content;
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido');
    });

    this.verificarEstudiante();

  }

  verificarEstudiante(){
    this.cargando = true;
    const nombre = localStorage.getItem('nombre');
    const apellido = localStorage.getItem('apellido');

    if (nombre !== null && apellido !== null) {
      this.notaService.filtrar(nombre, apellido, null, this.pagina, this.cantPagina).subscribe(resp => {
        this.listaNota = resp.data.content;
        localStorage.removeItem('nombre');
        localStorage.removeItem('apellido');
        this.cargando = false;
      });
    } else{
      this.filtrar();
    }
  }

  limpiar() {
    this.filtrarForm.get('nombre')?.setValue('');
    this.filtrarForm.get('apellido')?.setValue('');
    this.filtrarForm.get('materia')?.setValue('');
    this.pagina = 0;
    this.filtrar();
  }

  resetearAgregarNotaForm() {
    this.agregarNotaForm.get('calificacion')?.setValue('');
    this.agregarNotaForm.get('asignaturas')?.setValue('');
    this.agregarNotaForm.get('estudiantes')?.setValue('');

    this.modalService.dismissAll('Close click');
  }

  resetearEditarNotaForm() {
    this.editarNotaForm.get('calificacion')?.setValue('');
    this.editarNotaForm.get('asignaturas')?.setValue('');
    this.editarNotaForm.get('estudiantes')?.setValue('');

    this.modalService.dismissAll('Close click');
  }

  resetearEliminarNotaForm(){

    this.notaEliminar = new Nota();

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
