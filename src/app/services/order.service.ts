import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly baseUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) {}

  updateOrder(pedidoId: string, status: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/updateOrder`, { pedidoId, status });
  }

  getOrders(filter?: { uid?: string; email?: string }): Observable<any[]> {
    const params = filter?.email
      ? new HttpParams().set('email', filter.email)
      : filter?.uid
      ? new HttpParams().set('uid', filter.uid)
      : undefined;

    return this.http.get<any[]>(`${this.baseUrl}/orders`, { params });
  }

  getAllOrders(filters?: { status?: string; email?: string; numeroPedido?: number }): Observable<any[]> {
    let params = new HttpParams();

    if (filters?.status) {
      params = params.set('status', filters.status);
    }

    if (filters?.email) {
      params = params.set('email', filters.email);
    }

    if (filters?.numeroPedido != null) {
      params = params.set('numeroPedido', filters.numeroPedido.toString());
    }

    return this.http.get<any[]>(`${this.baseUrl}/orders`, { params });
  }
}
