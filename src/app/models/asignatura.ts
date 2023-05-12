import { Nota } from "./nota";

export class Asignatura {

    idasignatura: string;
    nombre: string;
    notas: Nota[];

    constructor(){
        this.idasignatura = "";
        this.nombre = "";
        this.notas = [];
    }
}