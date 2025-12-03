import { Component } from '@angular/core'
;import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from 'src/app/entity/user';
import { TokenGuard } from 'src/app/guard/token.guard';
import { ProductsService } from 'src/app/services/products.service';

import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from 'src/app/firebase-config';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  public user: User = new User();
  public signinVar = false;

  constructor(
    public route: Router,
    public deleteVar: ProductsService,
    public token: TokenGuard,
    public http: HttpClient,
    public jwt: JwtHelperService
  ) { }

  public async signin() {
    try {
      const resSignIn = await signInWithEmailAndPassword(
        firebaseAuth,
        this.user.email,
        this.user.pass
      );
      console.log("Sesión iniciada:", resSignIn.user);
      this.route.navigateByUrl('home');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }
}