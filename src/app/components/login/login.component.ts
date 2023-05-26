import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginUsuario } from 'src/app/models/loginUsuario';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { GlobalConstant } from 'src/app/utils/constants/global.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  cargando = false;

  loginUsuario!: LoginUsuario;

  roles: string[] = [];

  regCorreo = GlobalConstant.REG_CORREO;
  regPassword = GlobalConstant.REG_PASSWORD;

  loginForm = new FormGroup({
    correo: new FormControl('', [Validators.pattern(this.regCorreo), Validators.required]),
    contrasenia: new FormControl('', [Validators.pattern(this.regPassword), Validators.required])
  });

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService
  ) { 
  }

  ngOnInit(): void {
  }

  onLogin(): void {
    this.cargando = true;
    this.loginUsuario = new LoginUsuario();
    let correo = this.loginForm.controls['correo'].value;
    let contraseña = this.loginForm.controls['contrasenia'].value;

    this.loginUsuario.correo = correo? correo : '';
    this.loginUsuario.contrasenia = contraseña? contraseña : '';

    this.authService.login(this.loginUsuario).subscribe(resp =>{
      if(resp.success){
        this.tokenService.setToken(resp.data.token);
        this.roles = resp.data.authorities;
        this.router.navigate(['/inicio']);
        this.cargando = false;
      }else{
        this.toastrService.error(resp.message, 'Proceso fallido');
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error('Error en el servidor', 'Proceso fallido');
      this.cargando = false;
    });
  }

}
