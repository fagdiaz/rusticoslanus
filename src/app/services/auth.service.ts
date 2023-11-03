import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(){

  }

  isAuthenticated(){
    //verificar si esta logueado y si es admin
    return true
  }
}