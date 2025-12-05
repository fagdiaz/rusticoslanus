import { Component } from '@angular/core';
import { FormControl, Validators, FormGroupDirective, NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { User } from 'src/app/entity/user';
import { SignupService } from 'src/app/services/signup.service';
import Swal from 'sweetalert2';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { parseISO, format } from 'date-fns';
import { AuthService } from 'src/app/services/auth.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  public user = new User();

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  matcher = new MyErrorStateMatcher();

  hide = true;

  public signupForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private signUpService: SignupService,
    private authService: AuthService
  ) {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      pass: ['', [Validators.required, Validators.minLength(8)]],
      pass2: ['', Validators.required],
      dni: [''],
      province: [''],
      date: ['']
    });
  }

  get emailInput() { return this.signupForm.get('email'); }
  get passwordInput() { return this.signupForm.get('pass'); }

  limpiarFormulario(form: any) {
    form.reset();
  }

  public signup() {
    if (this.signupForm.status === "VALID") {
      const email = this.signupForm.get("email")?.value;
      const password = this.signupForm.get("pass")?.value;
      const fechaNacimiento = this.signupForm.get("date")?.value;
      const fechaNacimientoDate = parseISO(fechaNacimiento);
      const fechaNacimientoFormateada = format(fechaNacimientoDate, 'dd/MM/yyyy');

      const usuario = {
        email,
        dni: this.signupForm.get("dni")?.value,
        provincia: this.signupForm.get("province")?.value,
        fnac: fechaNacimientoFormateada,
      };

      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("Usuario creado en Firebase:", userCredential.user.uid);

          this.signUpService.signup(usuario, userCredential.user.uid).subscribe((data: any) => {
            console.log("Respuesta signup backend:", data);
            if (data.res == "ok") {
              this.authService.forceReloadRole(userCredential.user.uid, true);
              Swal.fire({
                title: 'Exito!',
                text: 'Se registro correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              })
              this.limpiarFormulario(this.signupForm);
            }
          });
        })
         .catch((error) => {
            console.error("Error al crear usuario en Firebase:", error);

            if (error.code === 'auth/email-already-in-use') {
              Swal.fire({
                title: 'Correo ya registrado',
                text: 'Ese correo ya tiene una cuenta. Inicie sesion desde "Ingresar".',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: 'No se pudo crear la cuenta. Intente nuevamente mas tarde.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          });
    }
  }
}
