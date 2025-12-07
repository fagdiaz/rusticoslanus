import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public users: any = [];

  constructor(private usersService: UsersService) {
    this.usersService.getUsers().subscribe(data => {
      this.users = data;
      console.log('usuarios', this.users);
    });
  }

  // Calcula la edad de forma robusta usando fnac/fechaNacimiento; devuelve null si no es valida.
  getEdad(user: any): number | null {
    const raw: any = (user as any).fnac ?? (user as any).fechaNacimiento;
    console.log('getEdad() - usuario:', user.email || user.uid || user, 'fnac raw:', raw);
    if (!raw) return null;

    let fechaNac: Date | null = null;

    // 1) Si viene como objeto tipo Timestamp de Firestore (seconds/nanoseconds)
    if (typeof raw === 'object' && raw !== null) {
      if (typeof raw.seconds === 'number') {
        fechaNac = new Date(raw.seconds * 1000);
      } else if ((raw as any)._seconds) {
        fechaNac = new Date((raw as any)._seconds * 1000);
      }
    }

    // 2) Si viene como numero (puede ser timestamp en ms o en segundos)
    if (!fechaNac && typeof raw === 'number') {
      if (raw < 10_000_000_000) {
        fechaNac = new Date(raw * 1000);
      } else {
        fechaNac = new Date(raw);
      }
    }

    // 3) Si viene como string
    if (!fechaNac && typeof raw === 'string') {
      const str = raw.trim();
      // a) Formato ISO (yyyy-mm-dd o similar)
      if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
        const parsed = new Date(str);
        if (!isNaN(parsed.getTime())) {
          fechaNac = parsed;
        }
      }

      // b) Formato dd/mm/yyyy o d/m/yyyy
      if (!fechaNac && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str)) {
        const [d, m, y] = str.split('/').map(v => parseInt(v, 10));
        const parsed = new Date(y, m - 1, d);
        if (!isNaN(parsed.getTime())) {
          fechaNac = parsed;
        }
      }

      // c) Formato dd-mm-yyyy
      if (!fechaNac && /^\d{1,2}-\d{1,2}-\d{4}$/.test(str)) {
        const [d, m, y] = str.split('-').map(v => parseInt(v, 10));
        const parsed = new Date(y, m - 1, d);
        if (!isNaN(parsed.getTime())) {
          fechaNac = parsed;
        }
      }

      // d) Fallback: constructor Date directo
      if (!fechaNac) {
        const parsed = new Date(str);
        if (!isNaN(parsed.getTime())) {
          fechaNac = parsed;
        }
      }
    }

    if (!fechaNac || isNaN(fechaNac.getTime())) {
      return null;
    }

    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    // Filtro de edades imposibles
    if (edad < 0 || edad > 120) {
      return null;
    }

    return edad;
  }

  ngOnInit(): void {
    // this.users = this.usersService.getUsers();
    console.log('usuarios', this.users);
  }
}
