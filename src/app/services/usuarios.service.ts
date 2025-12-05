import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Usuario {
  uid: string;
  email: string;
  nombre?: string;
  rol?: string;
  provincia?: string;
  dni?: number;
  fnac?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private readonly baseUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuarios`).pipe(
      map(items => (items || [])
        .map(item => ({
          uid: item.uid || item.id,
          email: item.email || '',
          nombre: item.nombre || '',
          rol: item.rol || 'cliente',
          provincia: item.provincia || '',
          dni: item.dni || '',
          fnac: item.fnac || ''
        }))
        .filter(u => !!u.uid)
      )
    );
  }
}
