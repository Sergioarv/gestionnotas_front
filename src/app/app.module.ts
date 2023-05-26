import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './components/modules/app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './components/app/app.component';
import { NotaComponent } from './components/nota/nota.component';
import { ReactiveFormsModule } from '@angular/forms';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxLoadingModule } from "ngx-loading";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfesorComponent } from './components/profesor/profesor.component';
import { EstudianteComponent } from './components/estudiante/estudiante.component';
import { AsignaturaComponent } from './components/asignatura/asignatura.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './components/login/login.component';
import { interceptorProvider } from './interceptors/interceptor.service';


@NgModule({
  declarations: [
    AppComponent,
    NotaComponent,
    ProfesorComponent,
    EstudianteComponent,
    AsignaturaComponent,
    NavbarComponent,
    InicioComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgxLoadingModule.forRoot({}),
    ToastrModule.forRoot({
      maxOpened: 2,
      timeOut: 3000,
      closeButton: true,
      newestOnTop: true,
      countDuplicates:true,
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true
    }),
    FontAwesomeModule
  ],
  providers: [
    interceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
