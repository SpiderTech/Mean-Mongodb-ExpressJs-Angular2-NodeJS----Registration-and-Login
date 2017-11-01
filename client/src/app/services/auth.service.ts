import { Injectable } from '@angular/core';
import {Http,Headers,RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  authtoken;
  user;
  options;
  constructor(private http:Http) { }
  
  createAuthToken(){
    this.loadToken();
    this.options = new RequestOptions({
      headers : new Headers({
        'Content-type':'application/json',
        'authorization':this.authtoken
      })
    });
  } 
  loadToken(){
    const token = localStorage.getItem('token');
    this.authtoken = token;
  }
  registerUser(user){
    return this.http.post('http://localhost:3000/aut/register',user).map(res=>res.json());
  }
  checkemail(email){
    return this.http.get('http://localhost:3000/aut/checkemail/'+email).map(res=>res.json());
  }

  checkusername(username){
    return this.http.get('http://localhost:3000/aut/checkusername/'+username).map(res=>res.json());
  }
login(user){
  return this.http.post('http://localhost:3000/aut/login',user).map(res=>res.json());
}
logout(){
  this.authtoken = null;
  this.user = null;
  localStorage.clear();
}
  storeUserData(token,user){
    localStorage.setItem('token',token);
    localStorage.setItem('user',JSON.stringify(user));
    this.authtoken = token;
    this.user = user;
  }
  getProfile(){
    this.createAuthToken();
    return this.http.get('http://localhost:3000/aut/profile',this.options).map(res=>res.json());
  }
  loggedIn(){
    return tokenNotExpired();
  }
}
