export class NotaDTO {
    idnota: string;
    idusuario: string;
    idasignatura: string;
    nombre: string;
    apellido: string;
    correo: string;
    materia: string;
    calificacion: number;

    constructor(){
        this.idnota = "";
        this.idusuario = "";
        this.idasignatura = "";
        this.nombre = "";
        this.apellido = "";
        this.correo = "";
        this.materia = "";
        this.calificacion = 0.0;
    }
}