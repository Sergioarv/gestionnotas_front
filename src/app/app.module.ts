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


@NgModule({
  declarations: [
    AppComponent,
    NotaComponent
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
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
