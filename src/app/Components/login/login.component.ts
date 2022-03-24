import { Component, OnInit } from '@angular/core';
import {FormControl,FormGroup,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/Services/authentification.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router :Router) { }

  ngOnInit() {
    
  }

 
  rememberMe: boolean ;

  email = new FormControl('', [Validators.required, Validators.email]);

  invalidLogin:Boolean


  


  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Vous devez entrer une valeur';
    }

    return this.email.hasError('email') ? 'C/est pas un valide e-mail' : '';
  }






  login() {
    if(this.form.value.email === "thaljeniomar@gmail.com" && this.form.value.password === "3OMARTHI")
    {
      this.router.navigate(['/Sofrecom/home'])
    }
    else
    {
      console.log("===> NO");
    }      

  }


  
lsRememberMe() {
  if (this.form.get("rememberMe").value ===true && this.form.valid) {
    sessionStorage.email = this.form.get("email").value;
    sessionStorage.password = this.form.get("password").value;
  } 
}

  form: FormGroup = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    rememberMe: new FormControl(false)

  });


}
