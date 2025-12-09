/**
 * Registro:
 * - Fecha de nacimiento se toma del formControl "date" (type="date").
 * - Se formatea a string 'dd/MM/yyyy' y se envía al backend como propiedad fnac del usuario.
 * - No se envía la contraseña en el payload al backend.
 */
import { Component } from '@angular/core';
import { Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { User } from 'src/app/entity/user';
import { SignupService } from 'src/app/services/signup.service';
import Swal from 'sweetalert2';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { parseISO, format } from 'date-fns';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  public user = new User();

  public signupForm: FormGroup;
  showPassword = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private signUpService: SignupService,
    private authService: AuthService
  ) {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      dni: [''],
      province: [''],
      date: ['']
    }, {
      validators: [this.passwordsMatchValidator('password', 'confirmPassword')]
    });
  }

  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

  get edad(): number | null {
    const fecha = this.signupForm.get('date')?.value;
    return fecha ? this.calcularEdad(fecha) : null;
  }

  limpiarFormulario(form: any) {
    form.reset();
  }

  public signup() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const email = this.signupForm.get('email')?.value;
    const password = this.signupForm.get('password')?.value;
    const fechaNacimiento = this.signupForm.get('date')?.value;
    const fechaNacimientoDate = parseISO(fechaNacimiento);
    const fechaNacimientoFormateada = format(fechaNacimientoDate, 'dd/MM/yyyy');

    const usuario = {
      email,
      dni: this.signupForm.get('dni')?.value,
      provincia: this.signupForm.get('province')?.value,
      fnac: fechaNacimientoFormateada,
    };

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Usuario creado en Firebase:', userCredential.user.uid);

        this.signUpService.signup(usuario, userCredential.user.uid).subscribe((data: any) => {
          console.log('Respuesta signup backend:', data);
          if (data.res == 'ok') {
            this.authService.forceReloadRole(userCredential.user.uid, true);
            Swal.fire({
              title: 'Exito!',
              text: 'Se registro correctamente',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
            this.limpiarFormulario(this.signupForm);
          }
          this.loading = false;
        }, () => {
          this.loading = false;
        });
      })
      .catch((error) => {
        console.error('Error al crear usuario en Firebase:', error);

        if (error.code === 'auth/email-already-in-use') {
          Swal.fire({
            title: 'Correo ya registrado',
            text: 'Ese correo ya tiene una cuenta. Inicie sesion desde \"Ingresar\".',
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
        this.loading = false;
      });
  }

  private passwordsMatchValidator(passwordKey: string, confirmKey: string) {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get(passwordKey)?.value;
      const confirm = group.get(confirmKey)?.value;
      if (password && confirm && password !== confirm) {
        return { passwordsMismatch: true };
      }
      return null;
    };
  }

  private calcularEdad(fechaIso: string): number | null {
    const nacimiento = new Date(fechaIso);
    if (Number.isNaN(nacimiento.getTime())) {
      return null;
    }

    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad >= 0 ? edad : null;
  }
}
