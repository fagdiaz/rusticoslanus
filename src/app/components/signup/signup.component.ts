import { Component } from '@angular/core';
import { FormControl, Validators, FormGroupDirective, NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { distinct } from 'rxjs';
import { User } from 'src/app/entity/user';

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

  constructor(private formBuilder: FormBuilder) {
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

  public signup() {
    var users: User[] = [];
    users = JSON.parse(localStorage.getItem("user") ?? "[]");
    users.push(this.user);
    localStorage.setItem("user", JSON.stringify(users));
  }
  
}