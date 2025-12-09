import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem } from 'src/app/class/cart-item.model';
import { Product } from './products.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  cartTotal$ = this.cartItems$.pipe(
    map(items =>
      items.reduce(
        (acc, item) => acc + this.toPrice(item.product.precio) * item.quantity,
        0
      )
    )
  );
  cartCount$ = this.cartItems$.pipe(
    map(items => items.reduce((acc, item) => acc + item.quantity, 0))
  );

  constructor() {
    this.syncFromStorage();
  }

  refreshCart(): void {
    this.syncFromStorage();
  }

  addItem(product: Product, quantity = 1): void {
    if (!product.id) {
      return;
    }

    const current = [...this.cartItemsSubject.value];
    const index = this.findIndexByProduct(current, product.id);

    if (index === -1) {
      current.push({ product, quantity });
    } else {
      current[index] = {
        ...current[index],
        quantity: current[index].quantity + quantity
      };
    }

    this.persist(current);
  }

  incrementItem(productId: string): void {
    const current = [...this.cartItemsSubject.value];
    if (!productId) {
      return;
    }
    const index = this.findIndexByProduct(current, productId);
    if (index === -1) {
      return;
    }

    current[index] = {
      ...current[index],
      quantity: current[index].quantity + 1
    };

    this.persist(current);
  }

  decrementItem(productId: string): void {
    const current = [...this.cartItemsSubject.value];
    const index = this.findIndexByProduct(current, productId);
    if (index === -1) {
      return;
    }

    const updatedQuantity = current[index].quantity - 1;
    if (updatedQuantity <= 0) {
      this.removeItem(productId);
      return;
    }

    current[index] = {
      ...current[index],
      quantity: updatedQuantity
    };

    this.persist(current);
  }

  removeItem(productId: string): void {
    const current = this.cartItemsSubject.value.filter(
      item => item.product.id !== productId
    );
    this.persist(current);
  }

  getQuantity(productId: string): number {
    if (!productId) {
      return 0;
    }
    const index = this.findIndexByProduct(this.cartItemsSubject.value, productId);
    if (index === -1) {
      return 0;
    }
    return this.cartItemsSubject.value[index].quantity;
  }

  private syncFromStorage(): void {
    const stored = localStorage.getItem('carrito');
    const parsed: any[] = stored ? JSON.parse(stored) : [];
    const normalized = parsed.map(item => this.normalizeCartItem(item));
    this.cartItemsSubject.next(normalized);
  }

  private persist(items: CartItem[]): void {
    localStorage.setItem('carrito', JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }

  private normalizeCartItem(raw: any): CartItem {
    const precioCandidate = raw.precio ?? raw.product?.precio ?? 0;
    const product: Product = raw.product || {
      id: raw.idProducto || raw.product?.id || raw.productId || '',
      nombre: raw.nombre || raw.product?.nombre || '',
      descripcion: raw.descripcion || raw.product?.descripcion || '',
      precio: this.toPrice(precioCandidate),
      activo: raw.product?.activo,
      imagenUrl: raw.product?.imagenUrl || null,
      categoria: raw.product?.categoria,
      orden: raw.product?.orden
    };

    const quantity = raw.quantity ?? raw.cantProd ?? 1;

    return { product, quantity };
  }

  private findIndexByProduct(items: CartItem[], productId: string): number {
    return items.findIndex(item => item.product.id === productId);
  }

  private toPrice(value: number | string | undefined): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
