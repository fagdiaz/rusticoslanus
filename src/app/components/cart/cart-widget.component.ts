import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from 'src/app/class/cart-item.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-widget',
  templateUrl: './cart-widget.component.html',
  styleUrls: ['./cart-widget.component.css']
})
export class CartWidgetComponent {
  @Output() close = new EventEmitter<void>();

  cartItems$: Observable<CartItem[]>;
  total$: Observable<number>;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;
    this.total$ = this.cartService.cartTotal$;
  }

  handleClose(): void {
    this.close.emit();
  }

  increment(item: CartItem): void {
    if (item.product.id) {
      this.cartService.incrementItem(item.product.id);
    }
  }

  decrement(item: CartItem): void {
    if (item.product.id) {
      this.cartService.decrementItem(item.product.id);
    }
  }

  remove(item: CartItem): void {
    if (item.product.id) {
      this.cartService.removeItem(item.product.id);
    }
  }

  getItemSubtotal(item: CartItem): number {
    return this.normalizePrice(item.product.precio) * item.quantity;
  }

  private normalizePrice(value: number | string | undefined): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
