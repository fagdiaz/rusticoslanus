import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from 'src/app/entity/user';
import { TokenGuard } from 'src/app/guard/token.guard';
import { ProductsService } from 'src/app/services/products.service';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseAuth } from 'src/app/firebase-config';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  public user: User = new User();
  public signinVar = false;
  public errorMsg: string | null = null;
  hidePassword: boolean = true;

  constructor(
    public route: Router,
    public deleteVar: ProductsService,
    public token: TokenGuard,
    public http: HttpClient,
    public jwt: JwtHelperService
  ) { }

  public async signin() {
    this.errorMsg = null;

    try {
      const resSignIn = await signInWithEmailAndPassword(
        firebaseAuth,
        this.user.email,
        this.user.pass
      );
      console.log('Sesión iniciada:', resSignIn.user);

      // 👉 Si todo va bien, redirigimos a /products
      this.route.navigate(['/products']);
    } catch (error) {
      console.error('Error al iniciar sesion:', error);

      this.errorMsg = 'Credenciales incorrectas. Verificá el correo y la contraseña.';
    }
  }

  loginWithGoogle() {
    this.errorMsg = null;

    const provider = new GoogleAuthProvider();

    signInWithPopup(firebaseAuth, provider)
      .then((result) => {
        const user = result.user;
        console.log('Login con Google OK:', user);

        const body = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        };

        // Sincronizamos con el backend para tener rol, etc.
        this.http.post('http://127.0.0.1:3000/google-login', body)
          .subscribe({
            next: (resp) => {
              console.log('Usuario Google sincronizado con backend:', resp);
              // Pase lo que pase, lo mando a products
              this.route.navigate(['/products']);
            },
            error: (err) => {
              console.error('Error al sincronizar usuario Google con backend:', err);
              // Aún si falla el backend, el usuario ya está logueado en Firebase
              this.route.navigate(['/products']);
            }
          });
      })
      .catch((err) => {
        console.error('Error al iniciar sesión con Google:', err);
        this.errorMsg = 'No se pudo iniciar sesión con Google.';
      });
  }
}
