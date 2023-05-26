import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotaComponent } from '../nota/nota.component';
import { ProfesorComponent } from '../profesor/profesor.component';
import { EstudianteComponent } from '../estudiante/estudiante.component';
import { AsignaturaComponent } from '../asignatura/asignatura.component';
import { InicioComponent } from '../inicio/inicio.component';
import { LoginComponent } from '../login/login.component';
import { GuardService } from 'src/app/guards/guard.service';
import { LoginGuard } from 'src/app/guards/login.guard';

const routes: Routes = [
  { path: 'nota', component: NotaComponent, canActivate: [ GuardService ], data: {expectedRol: ['admin', 'profesor', 'estudiante'] } },
  { path: 'profesor', component: ProfesorComponent, canActivate: [ GuardService ], data: {expectedRol: ['admin']}},
  { path: 'estudiante', component: EstudianteComponent, canActivate: [ GuardService ], data: {expectedRol:['admin','profesor']}},
  { path: 'asignatura', component: AsignaturaComponent, canActivate: [ GuardService ], data: {expectedRol: ['admin']}},
  { path: 'inicio', component: InicioComponent, canActivate: [ GuardService ], data: {expectedRol: ['admin', 'profesor', 'estudiante']}},
  { path: 'login', component: LoginComponent, canActivate: [ LoginGuard ]},
  { path: '', redirectTo: 'inicio', pathMatch: 'full'},
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
