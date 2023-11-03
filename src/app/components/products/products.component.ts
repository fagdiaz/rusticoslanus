/*import { Component } from '@angular/core';
import { Product, TipoPrenda } from 'src/app/class/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  products: Product[];
  busqueda: string = ""

  constructor(public nombrequeyoquieraparaelservicio: ProductsService) {
    this.products = nombrequeyoquieraparaelservicio.getProduct();
  }

}
*/
import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
  public Products: any[] = [];
  public carrito: any[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    // Obtén los elementos del carrito del localStorage
    const localStorageCarrito = localStorage.getItem("carrito");

    if (localStorageCarrito !== null) {
        // Si hay elementos en el carrito, analízalos desde JSON a un objeto y muéstralos
        const carrito = JSON.parse(localStorageCarrito);
        console.log("Elementos en el carrito:", carrito);

        // Itera a través de los elementos y muestra la cantidad de cada ítem
        carrito.forEach((item: any) => {
            console.log(`Producto: ${item.nombre}, Cantidad: ${item.cantProd}`);
        });
    }

    // Luego, carga los productos
    this.productsService.getProducts().subscribe((data: any) => {
        this.Products = data;
    });
}

  addProduct(id: any, nombre: string, descripcion: string, precio: number): void {
    // Cargar carrito desde el almacenamiento local
    this.carrito = JSON.parse(localStorage.getItem("carrito") || '[]');

    // Buscar si el producto ya está en el carrito
    const index = this.carrito.findIndex((prod: any) => prod.idProducto === id);

    if (index !== -1) {
      // Incrementar la cantidad si el producto ya está en el carrito
      this.carrito[index].cantProd += 1;
    } else {
      // Agregar el producto al carrito con cantidad 1
      const prodToCart = { idProducto: id, nombre, descripcion, precio, cantProd: 1 };
      this.carrito.push(prodToCart);
    }

    // Guardar el carrito actualizado en el almacenamiento local
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
  }

  removeProduct(id: any): void {
    // Cargar carrito desde el almacenamiento local
    this.carrito = JSON.parse(localStorage.getItem("carrito") || '[]');

    // Buscar si el producto está en el carrito
    const index = this.carrito.findIndex((prod: any) => prod.idProducto === id);

    if (index !== -1) {
      // Reducir la cantidad del producto o eliminarlo si solo hay 1
      if (this.carrito[index].cantProd > 1) {
        this.carrito[index].cantProd -= 1;
      } else {
        this.carrito.splice(index, 1);
      }

      // Actualizar el carrito en el almacenamiento local
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
    }
  }
}
