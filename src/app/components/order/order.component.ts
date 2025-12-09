import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';

type PedidoEstadoCanon =
  | 'creado'
  | 'en_preparacion'
  | 'entrega'
  | 'entregado'
  | 'cancelado';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  pedidos: any[] = [];
  pedidosFiltrados: any[] = [];
  filtro: string = '';

  currentRole: string | null = null;
  clientePedidoActual: any | null = null;

  currentUserEmail: string | null = null;

  steps: { id: PedidoEstadoCanon; label: string }[] = [
    { id: 'creado', label: 'Creado' },
    { id: 'en_preparacion', label: 'En preparación' },
    { id: 'entrega', label: 'En entrega' },
    { id: 'entregado', label: 'Entregado' }
  ];

  backendToEstadoCanon: Record<string, PedidoEstadoCanon> = {
    creado: 'creado',
    en_preparacion: 'en_preparacion',
    entrega: 'entrega',
    'en_entrega': 'entrega',
    'en_proceso_de_entrega': 'entrega',
    entregado: 'entregado',
    cancelado: 'cancelado'
  };

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    const currentRole = this.authService.currentRole;
    console.log('OrderComponent init', currentUser, currentRole);

    this.authService.user$.subscribe((firebaseUser) => {
      if (firebaseUser?.email) {
        this.currentUserEmail = firebaseUser.email;
      }
    });

    this.authService.role$.subscribe((role) => {
      this.currentRole = role;
      const freshUser = this.authService.getCurrentUser();
      this.cargarPedidos(role, freshUser);
    });
  }

  private cargarPedidos(role: string | null, currentUser: any): void {
    if (role === 'cliente') {
      const email = currentUser?.email || this.currentUserEmail;
      if (!email) {
        console.error('El usuario cliente no tiene email definido.');
        return;
      }

      this.orderService.getOrders({ email }).subscribe({
        next: (orders) => {
          this.pedidos = orders || [];
          this.pedidosFiltrados = [...this.pedidos];
          this.clientePedidoActual = this.pedidos[0] || null;
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
        if (this.clientePedidoActual && this.clientePedidoActual.id === pedido.id) {
          this.clientePedidoActual.status = newStatus;
        }
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
      }
    });
  }

  get clienteStepperIndex(): number {
    return this.getCurrentStepIndex(this.clientePedidoActual);
  }

  isPedidoCancelado(pedido?: any): boolean {
    if (!pedido) {
      return false;
    }

    const estadoCanon = this.normalizarEstado(pedido.estado ?? pedido.status);
    return estadoCanon === 'cancelado';
  }

  private getCurrentStepIndex(pedido?: any): number {
    if (!pedido) {
      return 0;
    }

    const estadoCanon = this.normalizarEstado(pedido.estado ?? pedido.status);

    if (estadoCanon === 'cancelado') {
      return -1;
    }

    const index = this.steps.findIndex(step => step.id === estadoCanon);
    return index >= 0 ? index : 0;
  }

  private normalizarEstado(raw?: string | null): PedidoEstadoCanon {
    if (!raw) {
      return 'creado';
    }

    const sanitized = this.normalizeEstado(raw);
    return this.backendToEstadoCanon[sanitized] ?? 'creado';
  }

  private normalizeEstado(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }
}
