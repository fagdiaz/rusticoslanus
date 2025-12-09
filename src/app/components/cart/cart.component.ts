import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/class/cart-item.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal(items);
    });
  }

  increaseQuantity(item: CartItem) {
    if (item.product.id) {
      this.cartService.incrementItem(item.product.id);
    }
  }

  decreaseQuantity(item: CartItem) {
    if (item.product.id) {
      this.cartService.decrementItem(item.product.id);
    }
  }

  removeItem(item: CartItem) {
    if (item.product.id) {
      this.cartService.removeItem(item.product.id);
    }
  }

  private calculateTotal(items: CartItem[]) {
    this.total = items.reduce(
      (acc, entry) => acc + this.toPrice(entry.product.precio) * entry.quantity,
      0
    );
  }

  private toPrice(value: number | string | undefined): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
