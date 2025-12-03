import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private http: HttpClient) { }

 addOrder(checkoutForm: any, carrito: any, uid?: string) {
  return this.http.post<{
    res: string;
    id: string;
    numeroPedido: number; // 👈 agregamos esto
  }>("http://127.0.0.1:3000/addOrder", {
    checkoutForm,
    carrito,
    uid,
  });
  }
} 