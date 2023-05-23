import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotaComponent } from '../nota/nota.component';
import { ProfesorComponent } from '../profesor/profesor.component';
import { EstudianteComponent } from '../estudiante/estudiante.component';
import { AsignaturaComponent } from '../asignatura/asignatura.component';
import { InicioComponent } from '../inicio/inicio.component';

const routes: Routes = [
  { path: 'nota', component: NotaComponent},
  { path: 'profesor', component: ProfesorComponent},
  { path: 'estudiante', component: EstudianteComponent},
  { path: 'asignatura', component: AsignaturaComponent},
  { path: 'inicio', component: InicioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
