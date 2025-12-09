import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Product {
  id?: string;
  nombre: string;
  descripcion: string;
  precio: number | string;
  activo?: boolean;
  imagenUrl?: string | null;
  categoria?: string;
  orden?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly baseUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) {}

  getProducts(uidActual: string): Observable<Product[]> {
    console.log('[FE ProductsService] getProducts uidActual:', uidActual);
    const params = new HttpParams().set('uidActual', uidActual);
    return this.http.get<Product[]>(`${this.baseUrl}/products`, { params });
  }

  addProduct(productData: any): Observable<any> {
    // Ajusta la URL si tu backend usa otra ruta para crear productos
    return this.http.post<any>(`${this.baseUrl}/productos`, productData);
  }

  updateProduct(uidActual: string, producto: Product): Observable<Product> {
    const body = { uidActual, producto };

    return this.http
      .post<{ res: string; producto: Product }>(
        `${this.baseUrl}/products/update`,
        body
      )
      .pipe(
        map((resp) => {
          console.log('[FE ProductsService] updateProduct resp:', resp);
          return resp.producto;
        })
      );
  }

  softDeleteProduct(uidActual: string, id: string): Observable<Product> {
    const body = { uidActual, id };

    return this.http
      .post<{ res: string; producto: Product }>(
        `${this.baseUrl}/products/soft-delete`,
        body
      )
      .pipe(
        map((resp) => {
          console.log('[FE ProductsService] softDeleteProduct resp:', resp);
          return resp.producto;
        })
      );
  }
}
