import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) {}

  signup(user: any, uid: any) {
    console.log("LLEGO AL SERVICIO", user, uid);
    return this.http.post("http://127.0.0.1:3000/signup", {
      user,
      uid,
      role: 'cliente'
    });
  }
}