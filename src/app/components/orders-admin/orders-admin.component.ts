import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders-admin',
  templateUrl: './orders-admin.component.html',
  styleUrls: ['./orders-admin.component.css']
})
export class OrdersAdminComponent implements OnInit, OnDestroy {
  pedidos: any[] = [];
  pedidosFiltrados: any[] = [];
  filtroEstado = '';
  filtroEmail = '';
  filtroNumeroPedido = '';
  isLoading = false;
  currentRole: string | null = null;

  private roleSub?: Subscription;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.roleSub = this.authService.role$.subscribe(role => {
      this.currentRole = role;

      if (role === 'operador' || role === 'admin') {
        this.loadOrders();
      } else {
        this.router.navigate(['/signin']);
      }
    });
  }

  ngOnDestroy(): void {
    this.roleSub?.unsubscribe();
  }

  loadOrders(): void {
  this.isLoading = true;

  // Solo mandamos filtros que sí puede usar el backend bien:
  const filters: { status?: string; email?: string; numeroPedido?: number } = {};

  if (this.filtroEstado) {
    filters.status = this.filtroEstado;
  }

  // OJO: ya NO mandamos filtroEmail acá para permitir búsquedas parciales en FE

  if (this.filtroNumeroPedido) {
    const numero = parseInt(this.filtroNumeroPedido, 10);
    if (!Number.isNaN(numero)) {
      filters.numeroPedido = numero;
    }
  }

  this.orderService.getAllOrders(filters).subscribe({
    next: (orders) => {
      this.pedidos = orders || [];
      this.aplicarFiltrosLocales();   // aplicamos email en FE
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error al cargar pedidos', err);
      this.isLoading = false;
      this.pedidos = [];
      this.pedidosFiltrados = [];
    }
  });
}

// Nuevo método:
aplicarFiltrosLocales(): void {
  let lista = [...this.pedidos];

  // filtro parcial por email
  if (this.filtroEmail && this.filtroEmail.trim()) {
    const f = this.filtroEmail.trim().toLowerCase();
    lista = lista.filter(p => {
      const email = (p.emailUsuario || p.email || '').toLowerCase();
      return email.includes(f);
    });
  }

  this.pedidosFiltrados = lista;
}


  onFilterChange(): void {
    this.loadOrders();
  }

  updateStatus(pedido: any, nuevoStatus: string): void {
    if (!pedido || !pedido.id) {
      console.error('Pedido inválido o sin ID.');
      return;
    }

    this.orderService.updateOrder(pedido.id, nuevoStatus).subscribe({
      next: (resp) => {
        console.log('Estado actualizado correctamente:', resp);
        pedido.status = nuevoStatus;
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
      }
    });
  }
}
