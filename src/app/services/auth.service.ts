import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { HttpClient } from '@angular/common/http';
import { firebaseAuth } from '../firebase-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private roleSubject = new BehaviorSubject<string | null>(null);
  private createdViaSignup = false;
  private quotaExceededSubject = new BehaviorSubject<boolean>(false);
  private lastUidRolCargado: string | null = null;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    // Escuchar cambios de sesion de Firebase
    onAuthStateChanged(firebaseAuth, (user) => {
      this.currentUserSubject.next(user);

      if (user) {
        console.log('Sesion iniciada (AuthService):', user.uid, user.email);
        this.cargarRolDesdeBackend(user.uid);
      } else {
        console.log('Sesion cerrada (AuthService)');
        this.roleSubject.next(null);
      }
    });
  }

  // === Usuario Firebase ===
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get user$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getUserDisplayName(): string | null {
    const user = this.currentUserSubject.value;
    if (!user) return null;

    if (user.displayName) return user.displayName;
    if (user.email) return user.email.split('@')[0];
    return null;
  }

  // === Rol del usuario (backend) ===
  private cargarRolDesdeBackend(uid: string): void {
    if (this.quotaExceededSubject.value) return;
    if (this.lastUidRolCargado === uid && this.roleSubject.value) return;

    this.http.get<any>('http://127.0.0.1:3000/obtenerUsuario', { params: { uid } })
      .subscribe({
        next: (resp) => {
          console.log('Usuario/rol obtenido desde backend:', resp);
          this.roleSubject.next(resp.usuario?.rol || null);
          this.createdViaSignup = false;
          this.quotaExceededSubject.next(false);
          this.lastUidRolCargado = uid;
        },
        error: (err) => {
          if (err?.status === 503 && (err.error === 'quota_exceeded' || err?.error?.error === 'quota_exceeded')) {
            console.warn('AuthService: cuota de Firestore excedida al obtener usuario');
            this.quotaExceededSubject.next(true);
            this.roleSubject.next(null);
            return;
          }
          if (err.status === 404 && this.createdViaSignup) {
            this.roleSubject.next('cliente');
          } else {
            this.roleSubject.next(null);
          }
          this.createdViaSignup = false;
        }
      });
  }

  forceReloadRole(uid: string, createdViaSignup = false): void {
    this.createdViaSignup = createdViaSignup;
    this.cargarRolDesdeBackend(uid);
  }

  get role$(): Observable<string | null> {
    return this.roleSubject.asObservable();
  }

  get quotaExceeded$(): Observable<boolean> {
    return this.quotaExceededSubject.asObservable();
  }

  get quotaExceeded(): boolean {
    return this.quotaExceededSubject.value;
  }

  get currentRole(): string | null {
    return this.roleSubject.value;
  }

  isCliente(): boolean {
    return this.currentRole === 'cliente';
  }

  isOperador(): boolean {
    return this.currentRole === 'operador';
  }

  isAdmin(): boolean {
    return this.currentRole === 'admin';
  }

  // === Logout ===
  signout(): void {
    signOut(firebaseAuth)
      .then(() => {
        this.currentUserSubject.next(null);
        this.roleSubject.next(null);
        this.router.navigate(['/signin']);
      })
      .catch(err => {
        console.error('Error al cerrar sesion:', err);
      });
  }
}
