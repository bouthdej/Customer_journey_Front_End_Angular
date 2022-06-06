import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SgidfService {

  private backEndUrl="http://localhost:8181/costumerjourney/v1"

  

  
 
  constructor(
    private _http: HttpClient
    ) { }
  
  authenticateUser(data){
    let header= new HttpHeaders()
    .set('content-type', 'application/json')
    let createUser = `${this.backEndUrl}/login/user`;
    return this._http.post(createUser, data, {'headers':header}).pipe(
      retry(3)
    );
  }

  authenticateAdmin(data){
    let header= new HttpHeaders()
    .set('content-type', 'application/json')
    let createUser = `${this.backEndUrl}/login/admin`;
    return this._http.post(createUser, data, {'headers':header}).pipe(
      retry(3)
    );
  }

  isAuthenticated(){
    return !!localStorage.getItem('token')
  }

  isAdminAuthenticated(){
    return !!localStorage.getItem('adminToken')
  }

  creatIdentity(data){
    console.log(data)
    let header= new HttpHeaders()
    .set('content-type', 'application/json')
    let createIdentityUrl = `${this.backEndUrl}/identities`;
    return this._http.post(createIdentityUrl, data, {'headers':header}).pipe(
      retry(3)
    );
  }

  updateContactIdentifiers(data){
    console.log(data)

    let header= new HttpHeaders()
    .set('content-type', 'application/json')
    let updateContactIdentifier = `${this.backEndUrl}/contactIdentifier`;
    if(data.methode=="delete"){
      return this._http.delete(`${updateContactIdentifier}/delete`, {'headers':header}).pipe(
        retry(3)
      );
    }else if(data.methode=="add"){
      return this._http.post(`${updateContactIdentifier}/add`, data, {'headers':header}).pipe(
        retry(3)
      );
    }else if(data.methode=="update")
     {
     return this._http.patch(`${updateContactIdentifier}/update`, data, {'headers':header}).pipe(
      retry(3)
      );
    }
  }

  getIdentifier(data){
    console.log(JSON.stringify(data))
    let header= new HttpHeaders()
    .set('content-type', 'application/json')
    let getIdentifierUrl = `${this.backEndUrl}/get/identifier`;
    return this._http.post(getIdentifierUrl, data, {'headers':header}).pipe(
      retry(3)
    );
  }

  updateidentitypwd(data){
    console.log(JSON.stringify(data))
    let header= new HttpHeaders()
    .set('content-type', 'application/json')
    let identitypwd=`${this.backEndUrl}/get/identity/password`;
    return this._http.patch(identitypwd,data, {'headers':header}).pipe(
      retry(3)
    );

  }

}
