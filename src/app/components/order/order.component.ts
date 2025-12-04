import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  pedidos: any[] = [];
  pedidosFiltrados: any[] = [];
  filtro: string = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    const currentRole = this.authService.currentRole;
    console.log('OrderComponent init', currentUser, currentRole);

    this.authService.role$.subscribe((role) => {
      this.cargarPedidos(role, currentUser);
    });
  }

  private cargarPedidos(role: string | null, currentUser: any): void {
    if (role === 'cliente') {
      const email = currentUser?.email;
      if (!email) {
        console.error('El usuario cliente no tiene email definido.');
        return;
      }

      this.orderService.getOrders({ email }).subscribe({
        next: (orders) => {
          this.pedidos = orders || [];
          this.pedidosFiltrados = [...this.pedidos];
        },
        error: (err) => {
          console.error('Error al obtener pedidos por email:', err);
        }
      });
    } else if (role === 'operador' || role === 'admin') {
      this.orderService.getOrders().subscribe({
        next: (orders) => {
          this.pedidos = orders || [];
          this.pedidosFiltrados = [...this.pedidos];
        },
        error: (err) => {
          console.error('Error al obtener todos los pedidos:', err);
        }
      });
    }
  }

  aplicarFiltro(): void {
    const filtroLower = this.filtro.toLowerCase();

    this.pedidosFiltrados = this.pedidos.filter(p =>
      p.numeroPedido?.toString().includes(filtroLower) ||
      p.status?.toLowerCase().includes(filtroLower) ||
      p.nombre?.toLowerCase().includes(filtroLower) ||
      p.uid?.toLowerCase().includes(filtroLower) ||
      p.emailUsuario?.toLowerCase().includes(filtroLower)
    );
  }

  updateStatus(pedido: any, newStatus: string): void {
    if (!pedido || !pedido.id) {
      console.error('Pedido invalido o sin ID.');
      return;
    }

    this.orderService.updateOrder(pedido.id, newStatus).subscribe({
      next: (resp) => {
        console.log('Estado actualizado correctamente:', resp);
        pedido.status = newStatus;
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
      }
    });
  }
}
