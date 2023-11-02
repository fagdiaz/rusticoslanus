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

  public carrito : any = [];

  constructor(private productsService: ProductsService){

    this.productsService.getProducts().subscribe(data => {
         
      this.Products = data;
       console.log("productos", this.Products)
    });

  }
  ngOnInit(): void {

    console.log("productos", this.Products)
  } 


  addProduct(id:any, nombre:string, descripcion:string, precio:number): void {
    //buscar en el arreglo del localstorage si el producto ya fue agregado
    const localStorageCarrito = localStorage.getItem("carrito")
    if (localStorageCarrito === null){ //el carrito estaba vacio
      const prodToCart = {idProducto:id, nombre, descripcion, precio, cantProd:1}
      this.carrito.push(prodToCart)
      localStorage.setItem("carrito", JSON.stringify(this.carrito))
    }else{ 
      console.log("entro por aca")
      const prods:any= JSON.parse(localStorageCarrito) 
      console.log("productos", prods)
  
      const index = prods.findIndex((prod:any) => prod.idProducto === id)
      const productoEncontrado : any[] = prods.filter((prod:any) => prod.idProducto === id)
      if (productoEncontrado.length > 0){
        productoEncontrado[0].cantProd = productoEncontrado[0].cantProd + 1
        //gaurdar el producto
        prods.splice(index,1)
        prods.push(productoEncontrado[0])
        
        localStorage.removeItem("carrito")
        localStorage.setItem("carrito", JSON.stringify(prods))
      }else{
        const prodToCart = {idProducto:id, nombre, descripcion, precio, cantProd:1}
        prods.push(prodToCart)
        localStorage.removeItem("carrito")
        localStorage.setItem("carrito", JSON.stringify(prods))        
      }
    }

  }

  removeProduct(id:any):void {
    const localStorageCarrito = localStorage.getItem("carrito")
    if (localStorageCarrito != null){ //el carrito estaba vacio
      const prods:any= JSON.parse(localStorageCarrito) 
      const index = prods.findIndex((prod:any) => prod.idProducto === id)
      const productoEncontrado : any[] = prods.filter((prod:any) => prod.idProducto === id)
      if (productoEncontrado.length > 0){

        if (productoEncontrado[0].cantProd === 1){
          //eliminar el producto del carrito
          prods.splice(index,1)
        }else{ 
          productoEncontrado[0].cantProd = productoEncontrado[0].cantProd - 1
          prods.splice(index,1)
          prods.push(productoEncontrado[0])
        }
      
        //gaurdar el producto
        localStorage.removeItem("carrito")
        localStorage.setItem("carrito", JSON.stringify(prods))      
      }
    }
  }  
}
