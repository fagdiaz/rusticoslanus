import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService, ConversacionResumen, MensajeChat } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Usuario, UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
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
  private convSub?: Subscription;
  private msgSub?: Subscription;
  private quotaSub?: Subscription;

  roleSub?: Subscription;
  rolActual: string | null = null;

  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLDivElement>;

  constructor(
    private chatService: ChatService,
    public authService: AuthService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.uidActual = user?.uid || null;
    this.rolActual = this.authService.currentRole;

    this.roleSub = this.authService.role$.subscribe((role) => {
      this.rolActual = role;
      this.autoSeleccionarDestinatario();
    });

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

  ngOnDestroy(): void {
    this.chatService.stopMessagesPolling();
    this.roleSub?.unsubscribe();
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
  getNombreDesdeEmail(email: string | null | undefined): string {
    if (!email) return '';
    const partes = email.split('@');
    return partes[0] || email;
  }


  onSeleccionDestinatario(u: Usuario): void {
    // Selección manual solo si hay uid válido
    if (!u || !u.uid) return;
    this.destinatarioSeleccionado = u;
    this.mensajes = []; // limpiar mensajes al cambiar de conversación
    if (this.uidActual) {
      this.isLoading = true;
      this.chatService.markChatAsReadAndRefresh(this.uidActual, this.destinatarioSeleccionado.uid);
      this.chatService.startMessagesPolling(this.uidActual, this.destinatarioSeleccionado.uid, 100);
    }
    this.handleFiltro();
  }

  cargarMensajes(): void {
    // No llamar al backend si faltan uids
    if (!this.uidActual || !this.destinatarioSeleccionado?.uid) return;
    if (this.quotaExcedida) return;

    this.isLoading = true;
    this.chatService.startMessagesPolling(this.uidActual, this.destinatarioSeleccionado.uid, 100);
  }

  refrescarMensajesSinSpinner(): void {
    // No refrescar sin uids válidos
    if (!this.uidActual || !this.destinatarioSeleccionado?.uid) return;
    if (this.quotaExcedida) return;

    this.chatService.startMessagesPolling(this.uidActual!, this.destinatarioSeleccionado!.uid, 100);
  }

  enviarMensaje(): void {
    const texto = this.mensajeNuevo.trim();
    if (!texto || !this.uidActual || !this.destinatarioSeleccionado?.uid) {
      return;
    }

    this.chatService
      .sendMessage(texto, {
        uidDestinatario: this.destinatarioSeleccionado.uid,
        emailDestinatario: this.destinatarioSeleccionado.email
      })
      .subscribe({
        next: () => {
          this.mensajeNuevo = '';
          this.refrescarMensajesSinSpinner();
          if (this.uidActual && this.destinatarioSeleccionado?.uid) {
            this.chatService.refreshMessagesOnce(this.uidActual, this.destinatarioSeleccionado.uid);
            this.chatService.refreshUnreadOnce(this.uidActual);
          }
        },
        error: (err) => console.error('Error al enviar mensaje', err)
      });
  }

  esMio(msg: MensajeChat): boolean {
    return msg.uidRemitente === this.uidActual;
  }

  public scrollToBottom(): void {
    setTimeout(() => {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 0);
  }

  private cargarUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: (users) => {
        this.usuarios = (users || []).filter(u => u.uid !== this.uidActual);
        this.autoSeleccionarDestinatario();
        console.log('Usuarios para chat:', this.usuarios);
      },
      error: (err) => console.error('Error al obtener usuarios', err)
    });
  }

  private cargarConversaciones(): void {
    // se usa polling centralizado en ChatService
  }

  private refrescarConversaciones(): void {
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

  private autoSeleccionarDestinatario(): void {
    const rolActual = this.rolActual || this.authService.currentRole;

    if (rolActual === 'cliente') {
      // Autoselección de operador/admin para cliente
      const soporte =
        this.usuarios.find(u => u.rol === 'operador' || u.rol === 'admin') || null;
      const cambio = this.destinatarioSeleccionado?.uid !== soporte?.uid;
      this.destinatarioSeleccionado = soporte;

      if (soporte && (cambio || !this.mensajes.length)) {
        this.mensajes = []; // limpiar al cambiar de conversación
        if (this.uidActual) {
          this.chatService.markChatAsReadAndRefresh(this.uidActual, soporte.uid);
        }
        this.cargarMensajes();
      } else if (!soporte) {
        this.mensajes = [];
      }
      return;
    }

    // Lista de destinatarios para operador/admin (excluye al usuario actual en cargarUsuarios)
    this.destinatarioSeleccionado = null;
    this.mensajes = []; // limpiar si no hay destinatario seleccionado
  }

  seleccionarConversacion(conv: ConversacionResumen): void {
    if (!conv?.uidOtro) return;

    // Si el usuario ya está en la lista, usarlo; si no, crear un placeholder mínimo
    const usuario =
      this.usuarios.find(u => u.uid === conv.uidOtro) ||
      ({
        uid: conv.uidOtro,
        email: conv.emailOtro,
        rol: 'cliente'
      } as Usuario);

    this.onSeleccionDestinatario(usuario);
  }

  trackByChatId(_index: number, conv: ConversacionResumen): string {
    return conv.chatId;
  }

  trackByMsgId(_index: number, msg: MensajeChat): string {
    return msg.id;
  }

  private handleQuotaError(err: any): boolean {
    if (err?.quotaExceeded) {
      console.warn('ChatComponent: cuota excedida, deteniendo auto-refresh');
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
