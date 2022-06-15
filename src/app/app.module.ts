import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { idaasComponent } from './Components/idaas/idaas.component';
import { WelcomeComponent } from './Components/welcome/welcome.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { SgidfComponent } from './Components/sgidf/sgidf.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './admin/home/home.component';

import { MatNativeDateModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material';
import { ResultComponent } from './components/result/result.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    idaasComponent,
    WelcomeComponent,
    NotFoundComponent,
    SgidfComponent,
    ResultComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DragDropModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    
  ],

  exports:[
    BrowserAnimationsModule,
    DragDropModule,
    MatNativeDateModule,
    MatSelectModule


  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
   entryComponents:[HomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
