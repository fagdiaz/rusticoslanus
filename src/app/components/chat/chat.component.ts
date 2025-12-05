import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService, ChatQuery, MensajeChat } from '../../services/chat.service';
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
    this.cargarMensajes();
  }

  cargarMensajes(): void {
    if (!this.uidActual || !this.destinatarioSeleccionado?.uid) return;

    const query: ChatQuery = {
      uidActual: this.uidActual!,
      uidOtro: this.destinatarioSeleccionado!.uid,
      limit: 100
    };

    this.isLoading = true;

    this.chatService.getMessages(query).subscribe({
      next: msgs => {
        this.mensajes = msgs;
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: err => {
        this.isLoading = false;
      }
    });
  }

  refrescarMensajesSinSpinner(): void {
    if (!this.uidActual || !this.destinatarioSeleccionado?.uid) return;

    const query: ChatQuery = {
      uidActual: this.uidActual!,
      uidOtro: this.destinatarioSeleccionado!.uid,
      limit: 100
    };

    this.chatService.getMessages(query).subscribe({
      next: msgs => {
        const lastLocalId = this.mensajes[this.mensajes.length - 1]?.id;
        const lastRemoteId = msgs[msgs.length - 1]?.id;
        if (msgs.length !== this.mensajes.length || lastLocalId !== lastRemoteId) {
          this.mensajes = msgs;
          this.scrollToBottom();
        }
      },
      error: err => {
        console.error('Error refrescar mensajes', err);
      }
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
      },
      error: err => console.error('Error al enviar mensaje', err)
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

  private autoSeleccionarDestinatario(): void {
    const rolActual = this.rolActual || this.authService.currentRole;

    if (rolActual === 'cliente') {
      const soporte = this.usuarios.find(u => u.rol === 'operador' || u.rol === 'admin') || null;
      const cambio = this.destinatarioSeleccionado?.uid !== soporte?.uid;
      this.destinatarioSeleccionado = soporte;
      if (soporte && (cambio || !this.mensajes.length)) {
        this.cargarMensajes();
      } else if (!soporte) {
        this.mensajes = [];
      }
      return;
    }

    // operador/admin: no se auto-selecciona destinatario
    this.destinatarioSeleccionado = null;
  }
}
