import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService, Product } from 'src/app/services/products.service';
import { CartService } from 'src/app/services/cart.service';
import { AddproductComponent } from './addproduct/addproduct.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
  public Products: Product[] = [];
  loading = true;
  error?: string;
  rolActual: string | null = null;
  uidActual: string | null = null;

  constructor(
    private productsService: ProductsService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cartService: CartService
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

  addProduct(product: Product): void {
    if (!product.id) {
      return;
    }
    this.cartService.addItem(product);
  }

  removeProduct(product: Product): void {
    if (!product.id) {
      return;
    }
    this.cartService.decrementItem(product.id);
  }

  getCartItemQuantity(productId: string | undefined): number {
    if (!productId) {
      return 0;
    }
    return this.cartService.getQuantity(productId);
  }

  getImagenProducto(prod: any): string {
    if (prod.imagen && prod.imagen.trim().length > 0) {
      return prod.imagen;
    }
    const id = (prod.id || '').toString().toLowerCase();
    return `/assets/sandwiches/${id}.jpg`;
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
