import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from 'src/app/entity/user';
import { TokenGuard } from 'src/app/guard/token.guard';
import { ProductsService } from 'src/app/services/products.service';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9uk6RPuERTLj9HCXUToCOmhIfjkqS3ok",

  authDomain: "rusticoslanus-84470.firebaseapp.com",

  projectId: "rusticoslanus-84470",

  storageBucket: "rusticoslanus-84470.appspot.com",

  messagingSenderId: "261854181198",

  appId: "1:261854181198:web:4a0405bf75420df955901f"
};

const app = initializeApp(firebaseConfig);

//const db = getFirestore(app);


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent {
  

  
  public user: User = new User();
  public signinVar = false;

  /*public signin() {
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
  }*/
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


  public signin = async () => {
    const auth = getAuth();
    const resSignIn = await signInWithEmailAndPassword(auth, "seba", "123");
    console.log("signIN", resSignIn);
    return resSignIn
  }


}