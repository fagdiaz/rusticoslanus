import { Component } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';  // Reemplaza 'ruta-del-servicio' con la ruta correcta a tu servicio

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent {
  constructor(private productService: ProductsService) {}

  addProduct(form: any) {
  
    const productData = {
      nombre: form.value.nombre,
      descripcion: form.value.descripcion,
      precio: form.value.precio
    };

   
    this.productService.addProduct(productData).subscribe(
      (response) => {
   
        console.log('Respuesta del servidor:', response);

     
        this.limpiarFormulario(form);
      },
      (error) => {
     
        console.error('Error al enviar datos al servidor:', error);
      }
    );
  }

  limpiarFormulario(form: any) {
   
    form.reset();
  }
}