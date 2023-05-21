import { environment } from "src/environments/environment";

export class GlobalConstant {

    //Globales
    //public static URL_ENDPOINT = 'http://localhost:8080';
    public static URL_ENDPOINT = environment.baseUrl;

    //Auth
    public static URL_AUTH = '/auth';
    public static URL_AUTH_LOGIN = '/auth/login';
    public static URL_AUTH_REFRESH = '/auth/refresh';

    //Estudiante
    public static URL_ESTUDIANTE = '/estudiante';
    public static URL_ESTUDIANTE_FILTRO = '/estudiante/filtrar';

    //Profesor
    public static URL_PROFESOR = '/profesor';
    public static URL_PROFESOR_FILTRO = '/profesor/filtrar';

    //Nota
    public static URL_NOTA = '/nota';
    public static URL_NOTA_FILTRO = '/nota/filtrar';

    //Asignatura
    public static URL_ASIGNATURA = '/asignatura';
    public static URL_ASIGNATURA_FILTRO = '/asignatura/filtrar';

    //Expresones
    public static REG_NUMEROS = '(^[0-4][.][0-9]{1,2})|(^[5][.][0-9]{1,2}|[0-5]{1})';
    public static REG_NOMBRE = '^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\u00f1\u00d1\u0020-\u003f\u00bf\u00a1]+[a-zA-ZÀ-ÿ]$';
    public static REG_CORREO = '^[a-z][^@]+@[^@]+\.[a-zA-Z]{2,}$';
    public static REG_PASSWORD = '[A-Za-z\d$@$!%*?&]{8,15}';
}
