import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ChatService, ConversacionResumen, MensajeChat } from '../../services/chat.service';
import { Usuario, UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-chat-full',
  templateUrl: './chat-full.component.html',
  styleUrls: ['./chat-full.component.css']
})
export class ChatFullComponent implements OnInit, OnDestroy {
  mensajes: MensajeChat[] = [];
  mensajeNuevo = '';
  filtroTexto = '';
  filtroUsuario = '';
  isLoading = false;
  uidActual: string | null = null;

  usuarios: Usuario[] = [];
  destinatarioSeleccionado: Usuario | null = null;
  conversaciones: ConversacionResumen[] = [];
  unreadMap: { [chatId: string]: number } = {};
  quotaExcedida = false;

  refrescoInterval?: any;
  roleSub?: Subscription;
  rolActual: string | null = null;
  private convSub?: Subscription;
  private msgSub?: Subscription;
  private quotaSub?: Subscription;

  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLDivElement>;

  constructor(
    private chatService: ChatService,
    public authService: AuthService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.uidActual = user?.uid || null;
      this.rolActual = this.authService.currentRole;

    if (this.uidActual) {
      this.cargarUsuarios();
      this.convSub = this.chatService.conversationsWithUnread$.subscribe((convs) => {
        this.conversaciones = convs || [];
      });
      this.msgSub = this.chatService.messages$.subscribe((msgs) => {
        this.mensajes = msgs || [];
        this.isLoading = false;
        this.scrollToBottom();
      });
      this.quotaSub = this.chatService.quotaExceeded$.subscribe((flag) => {
        this.quotaExcedida = flag;
      });
    }
    });

    this.roleSub = this.authService.role$.subscribe((role) => {
      this.rolActual = role;
      this.autoSeleccionarDestinatario();
    });
  }

  ngOnDestroy(): void {
    this.roleSub?.unsubscribe();
    this.chatService.stopMessagesPolling();
    this.convSub?.unsubscribe();
    this.msgSub?.unsubscribe();
    this.quotaSub?.unsubscribe();
  }

  getUsuariosFiltrados(): Usuario[] {
    if (!this.filtroUsuario) {
      return this.usuarios;
    }
    const term = this.filtroUsuario.toLowerCase();
    return this.usuarios.filter(u =>
      u.email.toLowerCase().includes(term) ||
      (u.nombre?.toLowerCase().includes(term) ?? false) ||
      (u.rol?.toLowerCase().includes(term) ?? false)
    );
  }

  onSeleccionDestinatario(u: Usuario): void {
    if (!u || !u.uid) return;
    this.destinatarioSeleccionado = u;
    this.mensajes = [];
    this.cargarMensajes();
    if (this.uidActual) {
      this.chatService.markChatAsReadAndRefresh(this.uidActual, this.destinatarioSeleccionado.uid);
    }
  }

  seleccionarConversacion(conv: ConversacionResumen): void {
    if (!conv?.uidOtro) return;
    const usuario = this.usuarios.find(u => u.uid === conv.uidOtro) || {
      uid: conv.uidOtro,
      email: conv.emailOtro,
      rol: 'cliente'
    } as Usuario;
    this.onSeleccionDestinatario(usuario);
  }

  cargarMensajes(): void {
    if (!this.uidActual || !this.destinatarioSeleccionado?.uid) {
      this.mensajes = [];
      this.isLoading = false;
      return;
    }
    if (this.quotaExcedida) return;

    this.isLoading = true;
    this.chatService.startMessagesPolling(this.uidActual, this.destinatarioSeleccionado.uid, 100);
    this.handleFiltro();
  }

  refrescarMensajesSinSpinner(): void {
    if (!this.uidActual || !this.destinatarioSeleccionado?.uid) return;
    if (this.quotaExcedida) return;

    this.chatService.startMessagesPolling(this.uidActual, this.destinatarioSeleccionado.uid, 100);
  }

  enviarMensaje(): void {
    const texto = this.mensajeNuevo.trim();
    if (!texto || !this.uidActual || !this.destinatarioSeleccionado?.uid) {
      return;
    }

    this.chatService.sendMessage(texto, {
      uidDestinatario: this.destinatarioSeleccionado.uid,
      emailDestinatario: this.destinatarioSeleccionado.email
    }).subscribe({
      next: () => {
        this.mensajeNuevo = '';
        this.refrescarMensajesSinSpinner();
        if (this.uidActual && this.destinatarioSeleccionado?.uid) {
          this.chatService.refreshMessagesOnce(this.uidActual, this.destinatarioSeleccionado.uid);
          this.chatService.refreshUnreadOnce(this.uidActual);
        }
      },
      error: err => console.error('Error al enviar mensaje', err)
    });
  }

  esMio(msg: MensajeChat): boolean {
    return msg.uidRemitente === this.uidActual;
  }

  private cargarUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: (users) => {
        this.usuarios = (users || []).filter(u => u.uid !== this.uidActual);
        this.autoSeleccionarDestinatario();
        console.log('Usuarios para chat full:', this.usuarios);
      },
      error: (err) => console.error('Error al obtener usuarios', err)
    });
  }

  private cargarConversaciones(): void {
    // Polling centralizado en ChatService
  }

  private mergeUnreadCounts(): void {
    // Polling centralizado en ChatService
  }

  private autoSeleccionarDestinatario(): void {
    const rolActual = this.rolActual || this.authService.currentRole;
    if (rolActual === 'cliente') {
      const soporte = this.usuarios.find(u => u.rol === 'operador' || u.rol === 'admin') || null;
      const cambio = this.destinatarioSeleccionado?.uid !== soporte?.uid;
      this.destinatarioSeleccionado = soporte;
      if (soporte && (cambio || !this.mensajes.length)) {
        this.mensajes = [];
        if (this.uidActual) {
          this.chatService.markChatAsRead(this.uidActual, soporte.uid);
        }
        this.cargarMensajes();
      } else if (!soporte) {
        this.mensajes = [];
      }
      return;
    }

    this.destinatarioSeleccionado = null;
    this.mensajes = [];
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 0);
  }

  private refrescarConversaciones(): void {
    // Polling centralizado en ChatService
  }

  private iniciarAutoRefresh(): void {
    // Polling centralizado en ChatService
  }

  private actualizarConversaciones(convs: ConversacionResumen[]): void {
    const existentesMap = new Map(this.conversaciones.map((c) => [c.chatId, c]));
    const vistos = new Set<string>();

    convs.forEach((conv) => {
      const existente = existentesMap.get(conv.chatId);
      if (existente) {
        existente.uidOtro = conv.uidOtro;
        existente.emailOtro = conv.emailOtro;
        existente.ultimoMensaje = conv.ultimoMensaje;
        existente.timestamp = conv.timestamp;
        existente.unread = this.unreadMap[conv.chatId] || existente.unread || 0;
      } else {
        this.conversaciones.push({
          ...conv,
          unread: this.unreadMap[conv.chatId] || 0
        });
      }
      vistos.add(conv.chatId);
    });

    for (let i = this.conversaciones.length - 1; i >= 0; i--) {
      if (!vistos.has(this.conversaciones[i].chatId)) {
        this.conversaciones.splice(i, 1);
      }
    }
  }

  trackByChatId(_index: number, conv: ConversacionResumen): string {
    return conv.chatId;
  }

  trackByMsgId(_index: number, msg: MensajeChat): string {
    return msg.id;
  }

  private handleQuotaError(err: any): boolean {
    if (err?.quotaExceeded) {
      console.warn('ChatFull: cuota excedida, deteniendo auto-refresh');
      this.quotaExcedida = true;
      return true;
    }
    return false;
  }

  onFiltroTextoChange(): void {
    this.handleFiltro();
  }

  private handleFiltro(): void {
    if (!this.destinatarioSeleccionado?.uid || !this.uidActual) return;
    const texto = this.filtroTexto?.trim();
    if (texto) {
      this.chatService.activarFiltro(this.uidActual, this.destinatarioSeleccionado.uid, texto);
    } else {
      this.chatService.desactivarFiltro(this.uidActual, this.destinatarioSeleccionado.uid);
    }
  }
}
