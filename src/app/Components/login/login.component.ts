import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SgidfService } from 'src/app/Services/sgidf.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  user = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    accessType: new FormControl('', Validators.required)
  });

  constructor(
    private router: Router,
    private sgidfSvc: SgidfService,
  ) { }

  ngOnInit() {
 
  }

  login(user: FormGroup) {    
     console.log(user.get("accessType").value)
     if (this.user.valid == true) {
      if (user.get("accessType").value == "userType") {
        this.sgidfSvc.authenticateUser(user.value).subscribe(authRes => {
          console.log(`auth response: ${JSON.stringify(authRes)}`)
        })
      } else if (user.get("accessType").value == "adminType") {
        this.sgidfSvc.authenticateAdmin(user.value).subscribe(authRes => {
          console.log(`auth response: ${JSON.stringify(authRes)}`)
        })
      }
    } 
  }

}
