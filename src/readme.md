#Para el carrito - Opcion 1

crear un componente para listar lo que tiene el carrito

1) buscas en localstorage key "carrito" => [{},{},{}]

2) transformas a objecto lo que devolvio el localstorage JSON.parse()

3) recorres el arreglo y por cada elemento del arreglo con el id, vas a buscar a la bd el nombre, descripcion


#Para el carrito - Opcion 2

1) Leer directo del localstorage


#Carrito SEBA:

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


#Carrito nuevo 

import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
  public Products: any[] = [];
  public carrito: any[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    // Obtén los elementos del carrito del localStorage
    const localStorageCarrito = localStorage.getItem("carrito");

    if (localStorageCarrito !== null) {
        // Si hay elementos en el carrito, analízalos desde JSON a un objeto y muéstralos
        const carrito = JSON.parse(localStorageCarrito);
        console.log("Elementos en el carrito:", carrito);

        // Itera a través de los elementos y muestra la cantidad de cada ítem
        carrito.forEach((item: any) => {
            console.log(`Producto: ${item.nombre}, Cantidad: ${item.cantProd}`);
        });
    }

    // Luego, carga los productos
    this.productsService.getProducts().subscribe((data: any) => {
        this.Products = data;
    });
}

  addProduct(id: any, nombre: string, descripcion: string, precio: number): void {
    // Cargar carrito desde el almacenamiento local
    this.carrito = JSON.parse(localStorage.getItem("carrito") || '[]');

    // Buscar si el producto ya está en el carrito
    const index = this.carrito.findIndex((prod: any) => prod.idProducto === id);

    if (index !== -1) {
      // Incrementar la cantidad si el producto ya está en el carrito
      this.carrito[index].cantProd += 1;
    } else {
      // Agregar el producto al carrito con cantidad 1
      const prodToCart = { idProducto: id, nombre, descripcion, precio, cantProd: 1 };
      this.carrito.push(prodToCart);
    }

    // Guardar el carrito actualizado en el almacenamiento local
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
  }

  removeProduct(id: any): void {
    // Cargar carrito desde el almacenamiento local
    this.carrito = JSON.parse(localStorage.getItem("carrito") || '[]');

    // Buscar si el producto está en el carrito
    const index = this.carrito.findIndex((prod: any) => prod.idProducto === id);

    if (index !== -1) {
      // Reducir la cantidad del producto o eliminarlo si solo hay 1
      if (this.carrito[index].cantProd > 1) {
        this.carrito[index].cantProd -= 1;
      } else {
        this.carrito.splice(index, 1);
      }

      // Actualizar el carrito en el almacenamiento local
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
    }
  }
}