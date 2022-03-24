import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';

const routes: Routes = [

  { path: '', redirectTo: '/Sofrecom/login',pathMatch:'full' },

  {path:'Sofrecom' ,
    children:[
      { path: 'login', component:LoginComponent},
      { path: 'home', component:HomeComponent},
    
  ]},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
