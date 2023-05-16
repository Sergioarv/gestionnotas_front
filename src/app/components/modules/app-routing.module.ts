import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotaComponent } from '../nota/nota.component';

const routes: Routes = [
  { path: 'nota', component: NotaComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
