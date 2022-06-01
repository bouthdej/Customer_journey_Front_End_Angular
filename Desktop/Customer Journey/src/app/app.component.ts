import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  isAdmin=false;
 constructor()  { }

ngOnInit() {
  if (!!localStorage.getItem('adminToken')) {
    this.isAdmin=true
  } else {
    this.isAdmin=false
  }
}

}