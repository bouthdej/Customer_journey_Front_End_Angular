import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { WelcomeComponent } from './Components/welcome/welcome.component';
import { SgidfComponent } from './Components/sgidf/sgidf.component';
import { AuthGuard } from './auth.guard';
// import { AdminRoutingModule } from './admin/admin-routing.module';
import { HomeComponent } from './admin/home/home.component';
import { ResultComponent } from './components/result/result.component';

const routes: Routes = [

  { 
    path: '', 
    component:WelcomeComponent
  },

  {
    path:'login',
    component:LoginComponent
  },

  {
    path:'sgidf',
    component:SgidfComponent,
    canActivate:[AuthGuard]
  },

  {
    path: 'private/admin/dashbord',
    //loadChildren: () => import('../app/admin/admin.module').then(m => m.AdminModule),
    component:HomeComponent,
    canLoad:[AuthGuard],
  },

  {
    path:'result',
    component:ResultComponent,
    canActivate:[AuthGuard]
  },
  
  {
    path:'**',
    component:NotFoundComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
