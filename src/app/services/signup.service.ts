import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) { 
    this.http = http;
  }

  signup(user:any){
    console.log("LLEGO AL SERVICIO", user)
    return this.http.post("http://127.0.0.1:3000/signup", {user})
  }
  
}

