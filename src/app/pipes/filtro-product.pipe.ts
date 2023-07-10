import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../class/product';

@Pipe({
  name: 'filtroProduct'
})
export class FiltroProductPipe implements PipeTransform {

  transform(value: Product[], filtro:string ): Product[] {
   if(filtro == "")
      return value;
    return value.filter(t=> t.marca.toLowerCase()
    .includes(filtro.toLowerCase()) || t.nombre.toLowerCase()
    .includes(filtro.toLowerCase()) || t.precio.toString().toLowerCase()
    .includes(filtro.toLowerCase()) || t.tipoPrenda.toString().toLowerCase()
    .includes(filtro.toLowerCase())  );
  }

}
