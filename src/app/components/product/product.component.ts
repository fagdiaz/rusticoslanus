import { Component, Input } from '@angular/core';
import { Product } from 'src/app/class/product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  @Input()
public  myProduct:Product;

  constructor() { 
    this.myProduct = new Product();
  }
}
