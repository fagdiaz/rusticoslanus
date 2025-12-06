import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'edad'
})
export class EdadPipe implements PipeTransform {
  transform(fecha: string | Date | null | undefined): number | string {
    if (!fecha) {
      return '';
    }

    // Implementación de cálculo de edad para requisito 7 del TP (fecha de nacimiento -> edad).
    const nacimiento = this.toDate(fecha);
    if (Number.isNaN(nacimiento.getTime())) {
      return '';
    }

    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad >= 0 ? edad : '';
  }

  private toDate(value: string | Date): Date {
    if (value instanceof Date) {
      return value;
    }

    // Intentar parseo dd/MM/yyyy
    const parts = value.split('/');
    if (parts.length === 3) {
      const [d, m, y] = parts.map(Number);
      return new Date(y, m - 1, d);
    }

    // Fallback: constructor de Date
    return new Date(value);
  }
}
