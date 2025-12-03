import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) {}

  updateOrder(pedidoId: string, status: string): Observable<any> {
  return this.http.post('http://127.0.0.1:3000/updateOrder', { pedidoId, status });
}

  getOrders(uid?: string): Observable<any[]> {
    const params = uid ? new HttpParams().set('uid', uid) : undefined;
    return this.http.get<any[]>('http://127.0.0.1:3000/orders', { params });
  }
}
