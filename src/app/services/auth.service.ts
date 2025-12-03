import { Injectable } from '@angular/core';
import { signOut } from "firebase/auth";
import { Router } from '@angular/router';
import { firebaseAuth } from '../firebase-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) { }

  isAuthenticated() {
    console.log('AuthService current user:', firebaseAuth.currentUser);
    return !!firebaseAuth.currentUser;
  }

  public async signout() {
    try {
      await signOut(firebaseAuth);
      console.log("Sesión cerrada");
      this.router.navigateByUrl('signin');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  getCurrentUser() {
    return firebaseAuth.currentUser;
  }
}