import { Asignatura } from "./asignatura";
import { Estudiante } from "./estudiante";

export class Nota {
    idnota: string;
    calificacion: number;
    asignatura: Asignatura;
    estudiante: Estudiante;

    constructor(){
        this.idnota = '';
        this.calificacion = 0.0;
        this.asignatura = new Asignatura();
        this.estudiante = new Estudiante();
    }
}