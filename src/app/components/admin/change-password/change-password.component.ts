import { Component } from '@angular/core';
import { getAuth, updatePassword } from 'firebase/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  newPassword: string = '';
  repeatPassword: string = '';

  constructor() {}

  async cambiarPassword() {
    if (!this.newPassword || !this.repeatPassword) {
      Swal.fire('Error', 'Ambos campos son obligatorios', 'error');
      return;
    }

    if (this.newPassword !== this.repeatPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    if (this.newPassword.length < 6) {
      Swal.fire('Error', 'La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Swal.fire('Error', 'No hay usuario autenticado', 'error');
      return;
    }

    try {
      await updatePassword(user, this.newPassword);
      Swal.fire('Listo', 'La contraseña fue actualizada', 'success');
      this.newPassword = '';
      this.repeatPassword = '';
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    }
  }
}
