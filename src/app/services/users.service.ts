import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {
    this.http = http;
   }

  getUsers(){
    return this.http.get('http://127.0.0.1:3000/usuarios');
  }
  getUser(uid:any){
    console.log('llamo a api');
    return this.http.get('http://127.0.0.1:3000/obtenerUsuario');

  }


}
