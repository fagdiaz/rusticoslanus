import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { UserAdminView } from 'src/app/class/user-admin-view.model';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {
  usuarios: UserAdminView[] = [];
  loading = false;
  error: string | null = null;
  filtroTexto = '';
  filtroRol: '' | UserAdminView['rol'] = '';
  filtroEstado: '' | 'activos' | 'inactivos' = '';

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.error = null;

    const filters = {
      texto: this.filtroTexto || undefined,
      rol: this.filtroRol || undefined,
      activo:
        this.filtroEstado === 'activos'
          ? true
          : this.filtroEstado === 'inactivos'
            ? false
            : undefined
    };

    this.usersService.getUsers(filters).subscribe({
      next: usuarios => {
        this.usuarios = usuarios;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
        this.error = 'No se pudieron cargar los usuarios';
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.cargarUsuarios();
  }

  limpiarFiltros(): void {
    this.filtroTexto = '';
    this.filtroRol = '';
    this.filtroEstado = '';
    this.cargarUsuarios();
  }

  onRolChange(user: UserAdminView, nuevoRol: string): void {
    const anterior = user.rol;
    const rolSeleccionado = nuevoRol as UserAdminView['rol'];
    user.rol = rolSeleccionado;

    this.usersService.updateRol(user.uid, rolSeleccionado).subscribe({
      next: updated => {
        user.rol = updated.rol;
      },
      error: (err) => {
        console.error('Error actualizando rol', err);
        user.rol = anterior;
        this.error = 'No se pudo actualizar el rol';
      }
    });
  }

  onActivoToggle(user: UserAdminView): void {
    const anterior = user.activo;
    const nuevoEstado = !user.activo;
    user.activo = nuevoEstado;

    this.usersService.updateEstado(user.uid, nuevoEstado).subscribe({
      next: updated => {
        user.activo = updated.activo;
      },
      error: (err) => {
        console.error('Error actualizando estado', err);
        user.activo = anterior;
        this.error = 'No se pudo actualizar el estado del usuario';
      }
    });
  }
}
