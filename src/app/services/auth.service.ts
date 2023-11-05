import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuth, signOut } from "firebase/auth";
import { Router } from '@angular/router'; // Importa el módulo Router

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {} 

  isAuthenticated() {
    
    return true;
  }

  public async signout() {
    try {
      const auth = getAuth();
      await signOut(auth);
      console.log("Sesión cerrada");
      this.router.navigateByUrl('signin'); 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}