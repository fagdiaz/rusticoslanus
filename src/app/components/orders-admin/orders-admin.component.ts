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
  filtroEmail = '';
  filtroDni = '';
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

    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.pedidos = orders || [];
        this.aplicarFiltrosLocales();   // aplicamos filtros en FE
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

  aplicarFiltrosLocales(): void {
    const fEmail = this.filtroEmail.trim().toLowerCase();
    const fDni = this.filtroDni.trim().toLowerCase();

    this.pedidosFiltrados = this.pedidos.filter(p => {
      const email = (p.emailUsuario || p.email || '').toLowerCase();
      const dni = (p.dni || '').toString().toLowerCase();
      const matchEmail = fEmail ? email.includes(fEmail) : true;
      const matchDni = fDni ? dni.includes(fDni) : true;
      return matchEmail && matchDni;
    });
  }

  onFilterChange(): void {
    this.aplicarFiltrosLocales();
  }

  limpiarFiltros(): void {
    this.filtroEmail = '';
    this.filtroDni = '';
    this.aplicarFiltrosLocales();
  }

  updateStatus(pedido: any, nuevoStatus: string): void {
    if (!pedido || !pedido.id) {
      console.error('Pedido invalido o sin ID.');
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
