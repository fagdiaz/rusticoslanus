import { Component } from '@angular/core';
import { CheckoutService } from '../../services/checkout.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  selectedPaymentMethod: string = 'tarjeta';
  checkoutForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private checkoutService: CheckoutService, private authService: AuthService) {
    this.checkoutForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      pago: [''],
      numeroTarjeta: ['', Validators.required],
      vencimiento: ['', Validators.required],
      codigoSeguridad: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
    
      return;
    }

    const formData = this.checkoutForm.value;
    const carrito = localStorage.getItem("carrito")
    const currentUser = this.authService.getCurrentUser();
    this.checkoutService.addOrder(formData, carrito, currentUser?.uid).subscribe(response => {
      console.log('Datos del formulario guardados con éxito:', response);
    }, error => {
      console.error('Error al guardar los datos del formulario:', error);
    });
  }

  clearForm(): void {
    // Limpiar el formulario
    this.checkoutForm.reset();
  }
}