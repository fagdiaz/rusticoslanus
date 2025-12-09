import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserAdminView } from 'src/app/class/user-admin-view.model';
import { environment } from 'src/app/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(filters?: {
    texto?: string;
    rol?: string;
    activo?: boolean;
  }): Observable<UserAdminView[]> {
    let params = new HttpParams();
    if (filters?.texto) {
      params = params.set('texto', filters.texto);
    }
    if (filters?.rol) {
      params = params.set('rol', filters.rol);
    }
    if (filters?.activo !== undefined) {
      params = params.set('activo', String(filters.activo));
    }

    return this.http
      .get<{ res: string; usuarios: UserAdminView[] }>(
        `${this.baseUrl}/admin/users`,
        { params }
      )
      .pipe(map(resp => resp.usuarios || []));
  }

  updateRol(uid: string, rol: UserAdminView['rol']): Observable<UserAdminView> {
    return this.http
      .patch<{ res: string; usuario: UserAdminView }>(
        `${this.baseUrl}/admin/users/${uid}/rol`,
        { rol }
      )
      .pipe(map(resp => resp.usuario));
  }

  updateEstado(uid: string, activo: boolean): Observable<UserAdminView> {
    return this.http
      .patch<{ res: string; usuario: UserAdminView }>(
        `${this.baseUrl}/admin/users/${uid}/estado`,
        { activo }
      )
      .pipe(map(resp => resp.usuario));
  }
}
