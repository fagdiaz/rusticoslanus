import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface MensajeChat {
  id?: string;
  uidRemitente: string;
  emailRemitente: string;
  uidDestinatario?: string | null;
  emailDestinatario?: string | null;
  texto: string;
  timestamp: number;
  tipo?: 'privado';
}

export interface ChatQuery {
  uidActual: string;
  uidOtro: string;
  limit?: number;
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

  getMessages(query: ChatQuery): Observable<MensajeChat[]> {
    if (!query.uidActual || !query.uidOtro) {
      console.error('ChatService: uidActual o uidOtro faltantes', query);
      return new Observable<MensajeChat[]>(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    let params = new HttpParams()
      .set('uidActual', query.uidActual)
      .set('uidOtro', query.uidOtro);

    if (query.limit !== undefined) {
      params = params.set('limit', String(query.limit));
    }

    console.log('>>> GET /chat - Params enviados:', params.toString());

    return this.http.get<MensajeChat[]>(`${this.baseUrl}/chat`, { params });
  }

  sendMessage(
    texto: string,
    destinatario: { uidDestinatario: string; emailDestinatario: string }
  ): Observable<any> {
    const user = this.authService.getCurrentUser();

    if (!user?.uid || !user.email) {
      throw new Error('Usuario no autenticado');
    }

    const payload = {
      uidRemitente: user.uid,
      emailRemitente: user.email,
      uidDestinatario: destinatario.uidDestinatario,
      emailDestinatario: destinatario.emailDestinatario,
      texto
    };

    return this.http.post(`${this.baseUrl}/chat`, payload);
  }
}
