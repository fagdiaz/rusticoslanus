import { Component } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  selectedPaymentMethod: string = 'tarjeta'; // Valor predeterminado
  formData: any = {}; // Objeto para almacenar los datos del formulario

  constructor() { }

  onSubmit(): void {
    // Aquí puedes manejar los datos del formulario según el método de pago seleccionado.
    console.log('Datos del formulario:', this.formData);
  }

  clearForm(): void {
    // Limpiar los datos del formulario
    this.formData = {};
  }
}