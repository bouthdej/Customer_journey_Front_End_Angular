import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { SgidfService } from './Services/sgidf.service'


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private SGIDFsvc : SgidfService,
    private router: Router
  ){}

  canActivate() {
    if (this.SGIDFsvc.isAuthenticated()) {
      return true
    }else{
      this.router.navigate(['/login'])
      return false
    }
  }

  canLoad():boolean{
    if(this.SGIDFsvc.isAdminAuthenticated()){
      return true
    }else{
      this.router.navigate(['/login'])
      return false;
    }
  }
}
