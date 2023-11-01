import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from 'src/app/entity/user';
import { TokenGuard } from 'src/app/guard/token.guard';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  public user: User = new User();
  public signinVar = false;

  public signin() {
    this.http.post<any>('http://localhost:3000/signin', this.user).subscribe(
      (response) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('token', token);
          this.token.out = true;
          this.route.navigateByUrl('Home');
        } else {
          console.error('El servidor no ha proporcionado un token válido.');
        }
      },
      (error) => {
        console.error('Error al realizar la solicitud:', error);
      }
    );
  }
/*
  delete() {
    this.deleteVar.deleteUser();
  }
*/
  constructor(
    public route: Router,
    public deleteVar: ProductsService,
    public token: TokenGuard,
    public http: HttpClient,
    public jwt: JwtHelperService
  ) {}

}