import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService, Product } from 'src/app/services/products.service';
import { AddproductComponent } from './addproduct/addproduct.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
  public Products: Product[] = [];
  public carrito: any[] = [];
  loading = true;
  error?: string;
  rolActual: string | null = null;
  uidActual: string | null = null;

  constructor(
    private productsService: ProductsService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log('[FE /products] ngOnInit start');
    this.loading = true;
    this.error = undefined;
    this.Products = [];
    // Suscripción al rol (mismo patrón que header)
    this.authService.role$.subscribe((rol) => {
      this.rolActual = rol ? rol.toLowerCase() : this.authService.currentRole || null;
      console.log('[FE /products] rolActual stream:', this.rolActual);
    });
    this.rolActual = this.authService.currentRole || null;
    this.cargarCarritoDesdeLocalStorage();

    const currentUser = this.authService.getCurrentUser?.();
    if (currentUser && currentUser.uid) {
      console.log('[FE /products] currentUser inmediato', currentUser);
      this.rolActual = (currentUser as any).rol || this.authService.currentRole || null;
      this.cargarProductos(currentUser.uid);
      return;
    }

    console.log('[FE /products] Esperando user$ con uid...');
    this.authService.user$
      .pipe(
        filter((user: any) => {
          const ok = !!user && !!user.uid;
          if (!ok) {
            console.log('[FE /products] user$ emitio algo sin uid, lo ignoro:', user);
          } else {
            console.log('[FE /products] user$ emitio usuario con uid:', user);
          }
          return ok;
        }),
        take(1)
      )
      .subscribe({
        next: (user: any) => {
          this.rolActual = user.rol || this.authService.currentRole || null;
          console.log('[FE /products] rolActual resuelto:', this.rolActual);
          this.cargarProductos(user.uid);
        },
        error: (err: any) => {
          console.error('[FE /products] Error esperando user$', err);
          this.error = 'No se pudo obtener el usuario actual';
          this.loading = false;
        }
      });
  }

  private cargarCarritoDesdeLocalStorage(): void {
    const localStorageCarrito = localStorage.getItem('carrito');
    if (localStorageCarrito !== null) {
      this.carrito = JSON.parse(localStorageCarrito);
      console.log('[FE /products] carrito cargado', this.carrito);
    }
  }

  private cargarProductos(uidActual: string): void {
    console.log('[FE /products] cargarProductos con uidActual:', uidActual);
    this.uidActual = uidActual;
    this.loading = true;
    this.error = undefined;
    this.productsService.getProducts(uidActual).subscribe({
      next: (data: Product[]) => {
        console.log('[FE /products] productos recibidos:', data);
        this.Products = data || [];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('[FE /products] Error al cargar productos', err);
        this.error = 'No se pudieron cargar los productos';
        this.loading = false;
      }
    });
  }

  addProduct(id: any, nombre: string, descripcion: string, precio: number | string): void {
    const precioNumber = typeof precio === 'string' ? Number(precio) : precio;
    // Cargar carrito desde el almacenamiento local
    this.carrito = JSON.parse(localStorage.getItem("carrito") || '[]');

    // Buscar si el producto ya está en el carrito
    const index = this.carrito.findIndex((prod: any) => prod.idProducto === id);

    if (index !== -1) {
      // Incrementar la cantidad si el producto ya está en el carrito
      this.carrito[index].precio = precioNumber;
      this.carrito[index].cantProd += 1;
    } else {
      // Agregar el producto al carrito con cantidad 1
      const prodToCart = { idProducto: id, nombre, descripcion, precio: precioNumber, cantProd: 1 };
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

  getCartItemQuantity(productId: any): number {
    // Obtener la cantidad de un producto en el carrito
    const itemInCart = this.carrito.find(item => item.idProducto === productId);
    return itemInCart ? itemInCart.cantProd : 0;
  }

  mostrarProducto(p: Product): boolean {
    if (this.rolActual === 'admin') return true;
    return p.activo !== false;
  }

  onSoftDelete(product: Product): void {
    // Validación defensiva
    if (!this.uidActual) {
      console.error('[FE /products] onSoftDelete sin uidActual, se cancela');
      return;
    }

    if (!product.id) {
      console.error('[FE /products] onSoftDelete sin id de producto, se cancela', product);
      return;
    }

    if (!confirm(`¿Marcar como INACTIVO el producto "${product.nombre}"?`)) {
      return;
    }

    this.productsService
      .softDeleteProduct(this.uidActual, product.id)
      .subscribe({
        next: (resp) => {
          console.log('[FE /products] softDelete OK', resp);
          // Recargamos lista para que desaparezca de la vista de cliente
          this.cargarProductos(this.uidActual!);
        },
        error: (err) => {
          console.error('[FE /products] softDelete ERROR', err);
        }
      });
  }

  openEditDialog(product: Product): void {
    const dialogRef = this.dialog.open(AddproductComponent, {
      width: '450px',
      data: { producto: product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated' && this.uidActual) {
        this.cargarProductos(this.uidActual);
      }
    });
  }
}
