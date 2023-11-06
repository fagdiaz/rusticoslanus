import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private http: HttpClient) { }

  addOrder(checkoutForm: any, carrito:any, uid?: any) {
    console.log("LLEGO AL SERVICIO", checkoutForm);
    return this.http.post("http://127.0.0.1:3000/addOrder", { checkoutForm, carrito: JSON.parse(carrito), uid });
  }
}