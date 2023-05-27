import { Nota } from "./nota";

export class Estudiante {
    idusuario: string;
    nombre: string;
    apellido: string;
    correo: string;
    contrasenia: string;
    clave: string;
    notas: Nota[];
    roles: string[];

    constructor(){
        this.idusuario = "";
        this.nombre = "";
        this.apellido = "";
        this.correo = "";
        this.contrasenia = "";
        this.clave = "";
        this.notas = [];
        this.roles = [];
    }
}