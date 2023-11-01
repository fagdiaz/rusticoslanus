import { Component } from '@angular/core';
import { FormControl, Validators, FormGroupDirective, NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { distinct } from 'rxjs';
import { User } from 'src/app/entity/user';
import { SignupService } from 'src/app/services/signup.service';
import Swal from 'sweetalert2';

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

  constructor(private formBuilder: FormBuilder, private signUpService: SignupService) {
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
    // Limpia los campos del formulario
    form.reset()
  }

  public signup() {

    if (this.signupForm.status === "VALID"){
     
      const usuario = {
        email: this.signupForm.get("email")?.value,
        pass: this.signupForm.get("pass")?.value,
        dni: this.signupForm.get("dni")?.value,
        provincia: this.signupForm.get("province")?.value,
        fnac: this.signupForm.get("date")?.value
      }

      console.log("Usuario a enviar", usuario)
      this.signUpService.signup(usuario).subscribe((data:any) => {
        if (data.res == "ok"){
          Swal.fire({
            title: 'Exito!',
            text: 'Se registro correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          })
          this.limpiarFormulario(this.signupForm);
        }
      })
    }
    /*var users: User[] = [];
    users = JSON.parse(localStorage.getItem("user") ?? "[]");
    users.push(this.user);
    localStorage.setItem("user", JSON.stringify(users));*/

   

  }
  
}