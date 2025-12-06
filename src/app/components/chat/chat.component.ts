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
    const user = this.authService.getCurrentUser();
    this.uidActual = user?.uid || null;
    this.rolActual = this.authService.currentRole;

    this.roleSub = this.authService.role$.subscribe((role) => {
      this.rolActual = role;
      this.autoSeleccionarDestinatario();
    });

    this.cargarUsuarios();
    this.cargarConversaciones();

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
    this.cargarMensajes();
  }

  cargarMensajes(): void {
    // No llamar al backend si faltan uids
    if (!this.uidActual || !this.destinatarioSeleccionado?.uid) return;

    this.isLoading = true;

    this.chatService
      .getMessages(this.uidActual!, this.destinatarioSeleccionado!.uid, 100)
      .subscribe({
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
    // No refrescar sin uids válidos
    if (!this.uidActual || !this.destinatarioSeleccionado?.uid) return;

    this.chatService
      .getMessages(this.uidActual!, this.destinatarioSeleccionado!.uid, 100)
      .subscribe({
        next: (msgs) => {
          const lastLocalId = this.mensajes[this.mensajes.length - 1]?.id;
          const lastRemoteId = msgs[msgs.length - 1]?.id;
          if (msgs.length !== this.mensajes.length || lastLocalId !== lastRemoteId) {
            this.mensajes = msgs;
            this.scrollToBottom();
          }
        },
        error: (err) => {
          console.error('Error refrescar mensajes', err);
        }
      });
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
          this.cargarConversaciones(); // actualiza lista de conversaciones
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
    if (!this.uidActual) {
      console.warn('cargarConversaciones: no hay uidActual');
      return;
    }

    this.chatService.getConversations(this.uidActual, 50).subscribe({
      next: (convs) => {
        this.conversaciones = convs || [];
        console.log('Conversaciones cargadas:', this.conversaciones);
      },
      error: (err) => {
        console.error('Error al obtener conversaciones', err);
      }
    });
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
}
