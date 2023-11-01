/*import { Component } from '@angular/core';
import { Product, TipoPrenda } from 'src/app/class/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  products: Product[];
  busqueda: string = ""

  constructor(public nombrequeyoquieraparaelservicio: ProductsService) {
    this.products = nombrequeyoquieraparaelservicio.getProduct();
  }

}
*/
import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})


export class ProductsComponent implements OnInit{

  public Products : any= [];

  constructor(private productsService: ProductsService){

    this.productsService.getProducts().subscribe(data => {
         
      this.Products = data;
       console.log("productos", this.Products)
    });

  }
  ngOnInit(): void {

    console.log("productos", this.Products)
  } 
}
