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

  refrescoInterval?: any;
  roleSub?: Subscription;
  rolActual: string | null = null;

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
        this.cargarConversaciones();
      }
    });

    this.roleSub = this.authService.role$.subscribe((role) => {
      this.rolActual = role;
      this.autoSeleccionarDestinatario();
    });

    this.refrescoInterval = setInterval(() => this.refrescarMensajesSinSpinner(), 1000);
  }

  ngOnDestroy(): void {
    if (this.refrescoInterval) {
      clearInterval(this.refrescoInterval);
    }
    this.roleSub?.unsubscribe();
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

    this.isLoading = true;
    this.chatService.getMessages(this.uidActual, this.destinatarioSeleccionado.uid, 100).subscribe({
      next: (msgs) => {
        this.mensajes = msgs;
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  refrescarMensajesSinSpinner(): void {
    if (!this.uidActual || !this.destinatarioSeleccionado?.uid) return;

    this.chatService.getMessages(this.uidActual, this.destinatarioSeleccionado.uid, 100).subscribe({
      next: (msgs) => {
        const lastLocalId = this.mensajes[this.mensajes.length - 1]?.id;
        const lastRemoteId = msgs[msgs.length - 1]?.id;
        if (msgs.length !== this.mensajes.length || lastLocalId !== lastRemoteId) {
          this.mensajes = msgs;
          this.scrollToBottom();
        }
      },
      error: () => {}
    });
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
        this.cargarConversaciones();
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
    if (!this.uidActual) {
      console.warn('ChatFull: uidActual no disponible todavía');
      return;
    }
    this.chatService.getConversations(this.uidActual, 50).subscribe({
      next: (convs) => this.conversaciones = convs || [],
      error: (err) => console.error('Error al obtener conversaciones', err)
    });
  }

  private autoSeleccionarDestinatario(): void {
    const rolActual = this.rolActual || this.authService.currentRole;
    if (rolActual === 'cliente') {
      const soporte = this.usuarios.find(u => u.rol === 'operador' || u.rol === 'admin') || null;
      const cambio = this.destinatarioSeleccionado?.uid !== soporte?.uid;
      this.destinatarioSeleccionado = soporte;
      if (soporte && (cambio || !this.mensajes.length)) {
        this.mensajes = [];
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
}
