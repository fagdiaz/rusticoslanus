import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

export interface MensajeChat {
  id: string;
  uidRemitente: string;
  uidDestinatario: string;
  emailRemitente: string;
  emailDestinatario: string;
  texto: string;
  timestamp: number;
  tipo?: string;
  participantes?: string[];
}

export interface ConversacionResumen {
  chatId: string;
  uidOtro: string;
  emailOtro: string;
  ultimoMensaje: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly baseUrl = 'http://127.0.0.1:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Obtiene mensajes privados entre uidActual y uidOtro.
   * Solo llama al backend si ambos UIDs son válidos.
   */
  getMessages(
    uidActual: string,
    uidOtro: string,
    limit: number = 50
  ): Observable<MensajeChat[]> {
    if (!uidActual || !uidOtro) {
      console.error('ChatService.getMessages: uidActual o uidOtro faltantes', {
        uidActual,
        uidOtro,
        limit
      });
      return of([]);
    }

    const params = new HttpParams()
      .set('uidActual', uidActual)
      .set('uidOtro', uidOtro)
      .set('limit', String(limit));

    console.log('ChatService.getMessages -> GET /chat', {
      uidActual,
      uidOtro,
      limit,
      query: params.toString()
    });

    return this.http.get<MensajeChat[]>(`${this.baseUrl}/chat`, { params });
  }

  /**
   * Envía un mensaje privado al destinatario indicado.
   * El uidRemitente se toma del usuario autenticado.
   */
  sendMessage(
    texto: string,
    destinatario: { uidDestinatario: string; emailDestinatario?: string }
  ): Observable<any> {
    const user = this.authService.getCurrentUser();

    if (!user?.uid) {
      console.error('ChatService.sendMessage: no hay usuario autenticado');
      throw new Error('Usuario no autenticado');
    }

    const payload = {
      uidRemitente: user.uid,
      emailRemitente: user.email || undefined, // el backend puede resolver el email si hace falta
      uidDestinatario: destinatario.uidDestinatario,
      emailDestinatario: destinatario.emailDestinatario,
      texto
    };

    console.log('ChatService.sendMessage -> POST /chat', payload);

    return this.http.post(`${this.baseUrl}/chat`, payload);
  }

  /**
   * Lista de conversaciones para un usuario (resumen).
   */
  getConversations(uidActual: string, limit: number = 50): Observable<ConversacionResumen[]> {
    if (!uidActual) {
      console.error('ChatService.getConversations: falta uidActual');
      return of([]);
    }

    const params = new HttpParams()
      .set('uidActual', uidActual)
      .set('limit', String(limit));

    console.log('ChatService.getConversations -> GET /chat/conversaciones', { uidActual, limit, query: params.toString() });

    return this.http.get<ConversacionResumen[]>(`${this.baseUrl}/chat/conversaciones`, { params });
  }
}
