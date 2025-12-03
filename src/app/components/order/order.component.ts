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
    const uid = currentUser?.uid;

    // Obtener pedidos
    this.orderService.getOrders(uid).subscribe({
      next: (orders) => {
        this.pedidos = orders || [];
        this.pedidosFiltrados = [...this.pedidos]; // 👈 clave para que el filtro funcione
      },
      error: (err) => {
        console.error('Error al obtener pedidos:', err);
      }
    });
  }

 aplicarFiltro(): void {
    const filtroLower = this.filtro.toLowerCase();

    this.pedidosFiltrados = this.pedidos.filter(p =>
      p.numeroPedido?.toString().includes(filtroLower) ||
      p.status?.toLowerCase().includes(filtroLower) ||
      p.nombre?.toLowerCase().includes(filtroLower) ||  // usamos nombre del pedido
      p.uid?.toLowerCase().includes(filtroLower)        // lo dejamos por si querés debug
    );
  }

 updateStatus(pedido: any, newStatus: string): void {
  if (!pedido || !pedido.id) {
    console.error("Pedido inválido o sin ID.");
    return;
  }

  this.orderService.updateOrder(pedido.id, newStatus).subscribe({
    next: (resp) => {
      console.log("Estado actualizado correctamente:", resp);

      // Actualizamos el estado en la tabla sin recargar
      pedido.status = newStatus;
    },
    error: (err) => {
      console.error("Error al actualizar estado:", err);
    }
  });
}
}

