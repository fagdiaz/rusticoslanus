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
  productForm!: FormGroup;

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
    this.productForm = this.fb.group({
      nombre: [this.producto?.nombre || '', Validators.required],
      descripcion: [this.producto?.descripcion || '', Validators.required],
      precio: [this.producto?.precio || '', Validators.required],
      imagenUrl: [this.producto?.imagenUrl || '']
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

      const formValue = this.productForm.value;
      const productData: Product = {
        ...this.producto,
        nombre: formValue.nombre,
        descripcion: formValue.descripcion,
        precio: Number(formValue.precio),
        imagenUrl: formValue.imagenUrl || null
      };

      this.productService
        .updateProduct(this.uidActual, productData)
        .subscribe(() => {
          this.onDone.emit('updated');
          this.dialogRef?.close('updated');
        });
      return;
    }

    const formValue = this.productForm.value;
    const newProductData: Product = {
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      precio: Number(formValue.precio),
      imagenUrl: formValue.imagenUrl || null
    };

    this.addProduct(newProductData);
  }

  addProduct(productData: Product): void {
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
    const targetForm = form || this.productForm;
    targetForm.reset();
  }
}
