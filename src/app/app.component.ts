import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  isAdmin=false;
 constructor(private router: Router)  { }

ngOnInit() {
  if (!!localStorage.getItem('adminToken')) {
    this.isAdmin=true
  } else {
    this.isAdmin=false
  }
}

logout()
{  
  localStorage.removeItem('token');
  this.router.navigate['/login']
}

}