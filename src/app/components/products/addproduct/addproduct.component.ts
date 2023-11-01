import { Component } from '@angular/core';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent {
  agregarProducto(form: any) {
    // Aquí puedes enviar los datos del formulario para procesarlos, por ejemplo, guardarlos en una base de datos.
    console.log('Producto añadido:', form.value);

    // Limpia el formulario después de agregar el producto
    this.limpiarFormulario(form);
  }

  limpiarFormulario(form: any) {
    // Limpia los campos del formulario
    form.resetForm();
  }

}
