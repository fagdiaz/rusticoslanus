import { Injectable } from '@angular/core';
import { Product, TipoPrenda } from '../class/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
 private products:Product[];

 
  getProduct():Product[]{
    return this.products;
  }
  deleteUser():void{
    this.products.pop();
  }

  constructor() { 
                                                                                                                                
  this.products = [];
  this.products.push(<Product>{
    marca:'Nique',
    nombre:'coleccion 2022',
    precio: 596,
    stock:30,
    tipoPrenda :TipoPrenda.remera  
  });
  this.products.push(<Product>{marca:'Adiddas',nombre:'lisa',precio: 1596,stock:15, tipoPrenda :TipoPrenda.remera  });
  this.products.push(<Product>{marca:'Levis',nombre:'coleccion 2022',precio: 896,stock:20, tipoPrenda :TipoPrenda.pantalon  });
  this.products.push(<Product>{marca:'Puma',nombre:'lisa',precio: 996,stock:18, tipoPrenda :TipoPrenda.buzo  });
  this.products.push(<Product>{marca:'Nique',nombre:'estampas',precio: 1206,stock:9, tipoPrenda :TipoPrenda.pantalon  });
  this.products.push(<Product>{marca:'Puma',nombre:'Messi',precio: 2096,stock:13, tipoPrenda :TipoPrenda.buzo  });

  }

  has(){
    
  }
}
