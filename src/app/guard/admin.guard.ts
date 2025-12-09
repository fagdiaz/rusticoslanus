import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const isAdmin = this.authService.currentRole === 'admin';
    const hasUser = !!this.authService.getCurrentUser();

    if (isAdmin && hasUser) {
      return true;
    }

    this.router.navigate(['/products']);
    return false;
  }
}
