import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

const REFRESH_INTERVAL_MS = 8000;
const DEFAULT_CHAT_LIMIT = 10;
const FILTER_CHAT_LIMIT = 200;

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
  unread?: number;
}

export interface UnreadCount {
  chatId: string;
  unread: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly baseUrl = 'http://127.0.0.1:3000';

  private quotaExceededSubject = new BehaviorSubject<boolean>(false);
  quotaExcedida$ = this.quotaExceededSubject.asObservable();
  quotaExceeded$ = this.quotaExceededSubject.asObservable();

  private conversationsSubject = new BehaviorSubject<ConversacionResumen[]>([]);
  conversations$ = this.conversationsSubject.asObservable();

  private messagesSubject = new BehaviorSubject<MensajeChat[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private unreadSubject = new BehaviorSubject<Record<string, number>>({});
  unreadByChatId$ = this.unreadSubject.asObservable();
  conversationsWithUnread$ = combineLatest([this.conversationsSubject.asObservable(), this.unreadSubject.asObservable()]).pipe(
    map(([convs, unread]) => convs.map(conv => ({ ...conv, unread: unread[conv.chatId] ?? 0 })))
  );

  private messagesByChatId = new Map<string, MensajeChat[]>();
  private filterActive = false;
  private filterChatKey: string | null = null;

  private convInterval: any;
  private msgInterval: any;
  private lastUidActual: string | null = null;
  private lastMsgPair: { uidActual: string; uidOtro: string; limit: number; chatKey: string } | null = null;
  private unreadFreshUntil = 0;

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
    limit: number = DEFAULT_CHAT_LIMIT
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

    return this.http.get<MensajeChat[]>(`${this.baseUrl}/chat`, { params }).pipe(
      catchError((err) => this.handleQuotaError<MensajeChat[]>(err, []))
    );
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

    return this.http.get<ConversacionResumen[]>(`${this.baseUrl}/chat/conversaciones`, { params }).pipe(
      catchError((err) => this.handleQuotaError<ConversacionResumen[]>(err, []))
    );
  }

  /**
   * Cantidad de mensajes no leidos por chatId para un usuario.
   */
  getUnreadCounts(uidActual: string): Observable<UnreadCount[]> {
    if (!uidActual) {
      console.error('ChatService.getUnreadCounts: falta uidActual');
      return of([]);
    }

    const params = new HttpParams().set('uidActual', uidActual);
    console.log('ChatService.getUnreadCounts -> GET /chat/unread', { uidActual, query: params.toString() });
    return this.http.get<UnreadCount[]>(`${this.baseUrl}/chat/unread`, { params }).pipe(
      catchError((err) => this.handleQuotaError<UnreadCount[]>(err, []))
    );
  }

  startConversationsPolling(uidActual: string): void {
    if (!uidActual || this.quotaExceededSubject.value) return;
    // Evitar re-crear el intervalo si ya está corriendo para el mismo uid
    if (this.convInterval && this.lastUidActual === uidActual) {
      return;
    }
    this.lastUidActual = uidActual;
    this.stopConversationsPolling();
    this.fetchConversationsOnce(uidActual);
    this.convInterval = setInterval(() => {
      if (document.hidden || this.quotaExceededSubject.value) return;
      this.fetchConversationsOnce(uidActual);
    }, REFRESH_INTERVAL_MS);
  }

  stopConversationsPolling(): void {
    if (this.convInterval) {
      clearInterval(this.convInterval);
      this.convInterval = null;
    }
  }

  startMessagesPolling(uidActual: string, uidOtro: string, limit: number = DEFAULT_CHAT_LIMIT): void {
    if (!uidActual || !uidOtro || this.quotaExceededSubject.value) return;
    const chatKey = this.getChatKey(uidActual, uidOtro);
    const effectiveLimit = this.filterActive && this.filterChatKey === chatKey ? FILTER_CHAT_LIMIT : DEFAULT_CHAT_LIMIT;
    if (this.msgInterval && this.lastMsgPair && this.lastMsgPair.uidActual === uidActual && this.lastMsgPair.uidOtro === uidOtro && this.lastMsgPair.limit === effectiveLimit) {
      return;
    }
    this.lastMsgPair = { uidActual, uidOtro, limit: effectiveLimit, chatKey };
    this.stopMessagesPolling();
    this.fetchMessagesOnce(uidActual, uidOtro, effectiveLimit);
    // Si hay filtro activo para este chat, no mantener intervalo
    if (this.filterActive && this.filterChatKey === chatKey) {
      return;
    }
    this.msgInterval = setInterval(() => {
      if (document.hidden || this.quotaExceededSubject.value) return;
      this.fetchMessagesOnce(uidActual, uidOtro, effectiveLimit);
    }, REFRESH_INTERVAL_MS);
  }

  refreshMessagesOnce(uidActual: string, uidOtro: string): void {
    if (!uidActual || !uidOtro || this.quotaExceededSubject.value) return;
    const chatKey = this.getChatKey(uidActual, uidOtro);
    const effectiveLimit = this.filterActive && this.filterChatKey === chatKey ? FILTER_CHAT_LIMIT : DEFAULT_CHAT_LIMIT;
    this.fetchMessagesOnce(uidActual, uidOtro, effectiveLimit);
  }

  refreshUnreadOnce(uidActual: string): void {
    if (!uidActual || this.quotaExceededSubject.value) return;
    this.unreadFreshUntil = Date.now() + Math.floor(REFRESH_INTERVAL_MS / 2);
    this.fetchUnreadOnce(uidActual, 'manual');
  }

  stopMessagesPolling(): void {
    if (this.msgInterval) {
      clearInterval(this.msgInterval);
      this.msgInterval = null;
    }
  }

  private fetchConversationsOnce(uidActual: string): void {
    this.getConversations(uidActual, 50).pipe(
      catchError((err) => {
        if (this.handleQuotaError<ConversacionResumen[]>(err, [])) {
          return of([]);
        }
        return of([]);
      })
    ).subscribe((convs) => {
      this.mergeConversations(convs || []);
      this.fetchUnreadOnce(uidActual, 'poll');
    });
  }

  private fetchUnreadOnce(uidActual: string, reason: 'poll' | 'manual' = 'poll'): void {
    if (reason === 'poll' && Date.now() < this.unreadFreshUntil) {
      console.log('[FE] polling unread skipped due to fresh update');
      return;
    }
    this.getUnreadCounts(uidActual).subscribe({
      next: (unreads) => {
        const mapUnread = new Map<string, number>();
        (unreads || []).forEach(u => mapUnread.set(u.chatId, u.unread || 0));
        const record: Record<string, number> = {};
        mapUnread.forEach((v, k) => (record[k] = v));
        this.unreadSubject.next(record);
        const merged = this.conversationsSubject.value.map(conv => ({
          ...conv,
          unread: mapUnread.get(conv.chatId) ?? conv.unread ?? 0
        }));
        this.conversationsSubject.next(merged);
        if (reason === 'manual') {
          this.unreadFreshUntil = Date.now() + Math.floor(REFRESH_INTERVAL_MS / 2);
          console.log('[FE] refreshUnreadOnce result', record);
        }
      },
      error: (err) => {
        // No tocar conversations$ si falla; solo log y manejo de quota
        this.handleQuotaError(err, []);
      }
    });
  }

  private fetchMessagesOnce(uidActual: string, uidOtro: string, limit: number): void {
    this.getMessages(uidActual, uidOtro, limit)
      .pipe(
        catchError((err) => {
          if (this.handleQuotaError<MensajeChat[]>(err, [])) {
            return of([]);
          }
          return of([]);
        })
      )
      .subscribe((msgs) => {
        const chatKey = this.getChatKey(uidActual, uidOtro);
        const incoming = msgs || [];
        // Reemplazamos la colección completa para evitar duplicados
        this.messagesByChatId.set(chatKey, incoming);
        const isFilter = this.filterActive && this.filterChatKey === chatKey;
        const payload = isFilter ? incoming : incoming.slice(-DEFAULT_CHAT_LIMIT);
        this.messagesSubject.next(payload);
      });
  }

  private mergeConversations(convs: ConversacionResumen[]): void {
    const existentesMap = new Map(this.conversationsSubject.value.map(c => [c.chatId, c]));
    const vistos = new Set<string>();
    const actuales = this.conversationsSubject.value.slice();
    const unreadMap = this.unreadSubject.value;

    convs.forEach((conv) => {
      const existente = existentesMap.get(conv.chatId);
      if (existente) {
        existente.uidOtro = conv.uidOtro;
        existente.emailOtro = conv.emailOtro;
        existente.ultimoMensaje = conv.ultimoMensaje;
        existente.timestamp = conv.timestamp;
        existente.unread = unreadMap[conv.chatId] ?? existente.unread ?? 0;
        vistos.add(conv.chatId);
      } else {
        actuales.push({ ...conv, unread: unreadMap[conv.chatId] ?? conv.unread ?? 0 });
        vistos.add(conv.chatId);
      }
    });

    for (let i = actuales.length - 1; i >= 0; i--) {
      if (!vistos.has(actuales[i].chatId)) {
        actuales.splice(i, 1);
      }
    }

    this.conversationsSubject.next(actuales);
  }

  private handleQuotaError<T>(err: any, fallback: T): Observable<T> {
    if (err?.status === 503 && (err.error === 'quota_exceeded' || err?.error?.error === 'quota_exceeded')) {
      console.warn('ChatService: cuota de Firestore excedida', err);
      this.quotaExceededSubject.next(true);
      this.stopConversationsPolling();
      this.stopMessagesPolling();
      return of(fallback);
    }
    console.error('ChatService error', err);
    return of(fallback);
  }

  activarFiltro(uidActual: string, uidOtro: string, _searchText?: string): void {
    if (!uidActual || !uidOtro) return;
    const chatKey = this.getChatKey(uidActual, uidOtro);
    this.filterActive = true;
    this.filterChatKey = chatKey;
    this.startMessagesPolling(uidActual, uidOtro, FILTER_CHAT_LIMIT);
  }

  desactivarFiltro(uidActual: string, uidOtro: string): void {
    this.filterActive = false;
    this.filterChatKey = null;
    if (uidActual && uidOtro) {
      this.startMessagesPolling(uidActual, uidOtro, DEFAULT_CHAT_LIMIT);
    }
  }

  private getChatKey(uidA: string, uidB: string): string {
    return [uidA, uidB].sort().join('|');
  }

  markChatAsRead(uidActual: string, uidOtro: string): void {
    if (!uidActual || !uidOtro) return;
    const chatKey = this.getChatKey(uidActual, uidOtro);
    const current = { ...this.unreadSubject.value, [chatKey]: 0 };
    this.unreadSubject.next(current);
    const merged = this.conversationsSubject.value.map(conv => conv.chatId === chatKey ? { ...conv, unread: 0 } : conv);
    this.conversationsSubject.next(merged);
  }

  markChatAsReadAndRefresh(uidActual: string, uidOtro: string): void {
    if (!uidActual || !uidOtro || this.quotaExceededSubject.value) return;
    const chatKey = this.getChatKey(uidActual, uidOtro);
    const current = { ...this.unreadSubject.value, [chatKey]: 0 };
    this.unreadSubject.next(current);
    const mergedZero = this.conversationsSubject.value.map(conv => conv.chatId === chatKey ? { ...conv, unread: 0 } : conv);
    this.conversationsSubject.next(mergedZero);
    this.unreadFreshUntil = Date.now() + Math.floor(REFRESH_INTERVAL_MS / 2);
    console.log('[FE] openChat  optimistic unread=0', chatKey);
    const effectiveLimit = this.filterActive && this.filterChatKey === chatKey ? FILTER_CHAT_LIMIT : DEFAULT_CHAT_LIMIT;
    this.getMessages(uidActual, uidOtro, effectiveLimit).pipe(
      switchMap(() => this.getUnreadCounts(uidActual)),
      catchError((err) => {
        if (this.handleQuotaError<UnreadCount[]>(err, [])) {
          return of([]);
        }
        return of([]);
      })
    ).subscribe((unreads) => {
      const record: Record<string, number> = {};
      (unreads || []).forEach(u => { record[u.chatId] = u.unread || 0; });
      this.unreadSubject.next(record);
      const merged = this.conversationsSubject.value.map(conv => ({
        ...conv,
        unread: record[conv.chatId] ?? conv.unread ?? 0
      }));
      this.conversationsSubject.next(merged);
      console.log('[FE] refreshUnreadOnce result', record);
    });
  }
}
