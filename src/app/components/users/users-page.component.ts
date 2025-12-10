import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { UserAdminView } from 'src/app/class/user-admin-view.model';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
export class UsersPageComponent implements OnInit {
  usuarios: UserAdminView[] = [];
  usuariosFiltrados: UserAdminView[] = [];
  loading = false;
  error: string | null = null;
  filtroEmail = '';
  filtroDni = '';

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.error = null;

    this.usersService.getUsers().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios || [];
        this.aplicarFiltros();
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
    const emailFiltro = this.filtroEmail.trim().toLowerCase();
    const dniFiltro = this.filtroDni.trim().toLowerCase();

    this.usuariosFiltrados = this.usuarios.filter((user) => {
      const email = (user.email || '').toLowerCase();
      const dni = ((user as any).dni || '').toString().toLowerCase();

      const coincideEmail = emailFiltro ? email.includes(emailFiltro) : true;
      const coincideDni = dniFiltro ? dni.includes(dniFiltro) : true;

      return coincideEmail && coincideDni;
    });
  }

  onFiltroEmailChange(value: string): void {
    this.filtroEmail = value;
    this.aplicarFiltros();
  }

  onFiltroDniChange(value: string): void {
    this.filtroDni = value;
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.filtroEmail = '';
    this.filtroDni = '';
    this.aplicarFiltros();
  }

  onRolChange(user: UserAdminView, nuevoRol: string): void {
    if (!nuevoRol || user.rol === nuevoRol) return;

    const anterior = user.rol;
    user.rol = nuevoRol as UserAdminView['rol'];

    this.usersService.updateRol(user.uid, user.rol).subscribe({
      next: (updated) => {
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
    const nuevoEstado = !user.activo;

    this.usersService.updateEstado(user.uid, nuevoEstado).subscribe({
      next: (updated) => {
        user.activo = updated.activo;
      },
      error: (err) => {
        console.error('Error actualizando estado', err);
        this.error = 'No se pudo actualizar el estado del usuario';
      }
    });
  }
}
