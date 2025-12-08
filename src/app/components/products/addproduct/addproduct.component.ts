import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { ProductsService, Product } from 'src/app/services/products.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {
  @Input() producto?: Product;
  @Output() onDone = new EventEmitter<string>();
  isEditMode = false;
  uidActual: string | null = null;
  form!: FormGroup;

  constructor(
    private productService: ProductsService,
    private fb: FormBuilder,
    private authService: AuthService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: { producto?: Product },
    @Optional() public dialogRef?: MatDialogRef<AddproductComponent>
  ) {
    this.producto = this.data?.producto || this.producto;
  }

  ngOnInit(): void {
    this.isEditMode = !!this.producto;
    this.form = this.fb.group({
      nombre: [this.producto?.nombre || '', Validators.required],
      descripcion: [this.producto?.descripcion || '', Validators.required],
      precio: [this.producto?.precio || '', Validators.required]
    });

    this.authService.user$.pipe(take(1)).subscribe((user) => {
      this.uidActual = user?.uid ?? null;
    });
  }

  onSubmit(): void {
    if (this.isEditMode) {
      if (!this.uidActual || !this.producto?.id) {
        console.warn('[FE /addproduct] Falta uidActual o id para actualizar');
        return;
      }

      this.productService
        .updateProduct(this.uidActual, {
          id: this.producto.id,
          nombre: this.form.value.nombre,
          descripcion: this.form.value.descripcion,
          precio: Number(this.form.value.precio)
        })
        .subscribe(() => {
          this.onDone.emit('updated');
          this.dialogRef?.close('updated');
        });
      return;
    }

    this.addProduct(this.form);
  }

  addProduct(form: FormGroup): void {
    const productData = {
      nombre: form.value.nombre,
      descripcion: form.value.descripcion,
      precio: form.value.precio
    };

    this.productService.addProduct(productData).subscribe(
      (response: any) => {
        console.log('Respuesta del servidor:', response);
        this.limpiarFormulario();
      },
      (error: any) => {
        console.error('Error al enviar datos al servidor:', error);
      }
    );
  }

  limpiarFormulario(form?: FormGroup): void {
    const targetForm = form || this.form;
    targetForm.reset();
  }
}
