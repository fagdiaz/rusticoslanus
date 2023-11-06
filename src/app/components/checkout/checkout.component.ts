import { Component } from '@angular/core';
import { CheckoutService } from '../../services/checkout.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  selectedPaymentMethod: string = 'tarjeta';
  checkoutForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private checkoutService: CheckoutService) {
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


    this.checkoutService.addOrder(formData).subscribe(response => {
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