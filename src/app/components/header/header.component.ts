import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userName: string | null = null;
  rolActual: string | null = null;
  quotaExceeded = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        if (user.displayName) {
          this.userName = user.displayName;
        } else if (user.email) {
          this.userName = user.email.split('@')[0];
        } else {
          this.userName = null;
        }
      } else {
        this.userName = null;
      }
    });

    this.authService.role$.subscribe(rol => {
      this.rolActual = rol ? rol.toLowerCase() : null;
      console.log('ROL EN HEADER:', this.rolActual);
    });

    this.authService.quotaExceeded$.subscribe(flag => {
      this.quotaExceeded = flag;
    });
  }

  get checkIsauthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isCliente(): boolean {
    return this.rolActual === 'cliente';
  }

  isOperador(): boolean {
    return this.rolActual === 'operador';
  }

  isAdmin(): boolean {
    return this.rolActual === 'admin';
  }

  logout(): void {
    this.authService.signout();
  }
}
