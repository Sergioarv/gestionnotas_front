import { Asignatura } from "./asignatura";

export class Profesor{
    idusuario: string;
    nombre: string;
    apellido: string;
    correo: string;
    contrasenia: string;
    clave: string;
    asignaturas: Asignatura[];
    roles: string[];

    constructor(){
        this.idusuario = "";
        this.nombre = "";
        this.apellido = "";
        this.correo = "";
        this.contrasenia = "";
        this.clave = "";
        this.asignaturas = [];
        this.roles = [];
    }
}