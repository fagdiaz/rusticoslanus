import { Pipe, PipeTransform } from '@angular/core';
import { TipoPrenda } from '../class/product';

@Pipe({
  name: 'prenda'
})
export class PrendaPipe implements PipeTransform {

  transform(value: number): string {
    switch (value) {
      case TipoPrenda.buzo:
          return "Buzo";
        break;
        case TipoPrenda.pantalon:
          return "Pantalon";
        break;
        case TipoPrenda.remera:
          return "Remera";
        break;
      default:
        return "error";
        break;
    }
    
    return "";
  }

}
