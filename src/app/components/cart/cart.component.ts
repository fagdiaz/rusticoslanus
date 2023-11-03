import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;

  constructor() {}

  ngOnInit() {
    // Obtener productos del carrito del localStorage
    const localStorageCarrito = localStorage.getItem("carrito");

    if (localStorageCarrito !== null) {
      // Si hay elementos en el carrito, analízalos desde JSON a un objeto y muéstralos
      this.cartItems = JSON.parse(localStorageCarrito);

      // Calcular el precio total
      this.calculateTotal();
    }
  }

  increaseQuantity(item: any) {
    // Aumentar la cantidad de un producto en el carrito
    item.cantProd++;
    this.updateLocalStorageCart();
  }

  decreaseQuantity(item: any) {
    // Disminuir la cantidad de un producto en el carrito
    if (item.cantProd > 1) {
      item.cantProd--;
      this.updateLocalStorageCart();
    }
  }

  removeItem(index: number) {
    // Eliminar un producto del carrito
    this.cartItems.splice(index, 1);
    this.updateLocalStorageCart();
  }

  private updateLocalStorageCart() {
    // Actualizar el carrito en el almacenamiento local
    localStorage.setItem("carrito", JSON.stringify(this.cartItems));

    // Calcular el precio total
    this.calculateTotal();
  }

  private calculateTotal() {
    this.total = this.cartItems.reduce((acc, item) => acc + item.precio * item.cantProd, 0);
  }
}