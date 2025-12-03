import { Component, OnInit } from '@angular/core';
import { CheckoutService } from '../../services/checkout.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  selectedPaymentMethod: string = 'tarjeta';
  checkoutForm: FormGroup;
  numeroPedido?: number;
  pedidoCreado = false;

  constructor(
    private formBuilder: FormBuilder,
    private checkoutService: CheckoutService,
    private authService: AuthService
  ) {
    this.checkoutForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      pago: ['tarjeta', Validators.required],
      numeroTarjeta: ['', Validators.required],
      vencimiento: ['', Validators.required],
      codigoSeguridad: ['', Validators.required]
    });

    // Mantener selectedPaymentMethod en sync con el form
    this.checkoutForm.get('pago')?.valueChanges.subscribe((value) => {
      this.selectedPaymentMethod = value;
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log('UID actual del usuario logueado:', currentUser?.uid);
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      // Pendiente: mostrar mensajes en el template
      return;
    }

    const formData = this.checkoutForm.value;
    const carrito = localStorage.getItem('carrito');
    const currentUser = this.authService.getCurrentUser();

    this.checkoutService.addOrder(formData, carrito, currentUser?.uid).subscribe({
      next: (response) => {
        console.log('Datos del formulario guardados con éxito:', response);

        this.numeroPedido = response.numeroPedido;
        this.pedidoCreado = true;

        localStorage.removeItem('carrito');
        this.checkoutForm.reset();

        this.selectedPaymentMethod = 'tarjeta';
      },
      error: (err) => {
        console.error('Error al guardar los datos del formulario:', err);
      }
    });
  }

  clearForm(): void {
    this.checkoutForm.reset({
      nombre: '',
      direccion: '',
      telefono: '',
      pago: 'tarjeta',
      numeroTarjeta: '',
      vencimiento: '',
      codigoSeguridad: ''
    });

    this.pedidoCreado = false;
    this.numeroPedido = undefined;
    this.selectedPaymentMethod = 'tarjeta';
  }
}
