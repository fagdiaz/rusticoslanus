# Arquitectura del Chat - FRONTEND (Angular)

Este documento describe como esta armado el chat en el frontend de Rusticos Lanus:
- Chat widget flotante (compacto).
- Vista de chat completa en la ruta `/chat`.
- Servicios, directivas y pipes involucrados.
- Flujo de datos y decisiones segun rol.

---
## 1. Objetivo del modulo de chat (FE)
- Permitir chat privado 1 a 1 entre:
  - cliente ↔ operador
  - cliente ↔ admin
  - operador ↔ cualquier usuario
  - admin ↔ cualquier usuario
- Usar siempre el backend `/chat` (Node + Firestore).
- Manejar auto-refresh y auto-scroll desde el FE.
- Separar claramente:
  - Widget (compacto, burbuja).
  - Vista full (`/chat`).

---
## 2. Componentes principales del chat (FE)

### 2.1 `ChatComponent` (Widget compacto)
**Ubicacion:** `src/app/components/chat/chat.component.*`

**Uso:**
- Componente que se renderiza dentro del widget flotante.
- Muestra lista de mensajes, input + boton de envio, selector de usuario para operador/admin; cliente se autoasigna destinatario.

**Responsabilidades:**
- Obtener usuario actual desde `AuthService`.
- Cargar usuarios desde `UsuariosService`.
- Autoasignar destinatario si rol = cliente.
- Llamar a `chatService.getMessages(uidActual, uidOtro, limit)`, `chatService.sendMessage(...)`, `chatService.getConversations(uidActual, limit)` (cuando aplique).
- Manejar: `mensajes: MensajeChat[]`, `destinatarioSeleccionado: Usuario | null`, `conversaciones: ConversacionResumen[]`, `uidActual`, `rolActual`.

**Auto-refresh:**
- `setInterval` cada 1000 ms; solo si hay `uidActual` y `destinatarioSeleccionado.uid`; compara ultimo mensaje local vs remoto.

**Auto-scroll:**
- `@ViewChild('messagesContainer')` y metodo publico `scrollToBottom()`.

### 2.2 `ChatFullComponent` (Vista `/chat`)
**Ubicacion:** `src/app/components/chat-full/chat-full.component.*`

**Uso:**
- Montado en ruta `/chat` (ver `app-routing.module.ts`).
- Orientado a operador/admin (cliente podria usarlo).
- Layout tipo mensajeria: sidebar (conversaciones) + panel mensajes (selector destinatario, filtro texto, mensajes, input fijo abajo).

**Responsabilidades:**
- Igual base que `ChatComponent`: carga de usuarios, conversaciones, seleccion destinatario, refresco, scroll.
- Extras: filtro de mensajes con `chatFilter` (solo texto), nombre limpio (antes de `@`), fecha corta (ej: `12/6`).

### 2.3 `ChatWidgetComponent`
**Ubicacion:** `src/app/components/chat-widget/chat-widget.component.*`

**Uso:**
- Burbuja flotante sobre la UI; renderiza `<app-chat>`.
- Maneja mostrar/ocultar, posicion fija, estilos de burbuja.
- No maneja logica de mensajes, solo envuelve `ChatComponent`.

---
## 3. Servicios y modelos involucrados

### 3.1 `ChatService`
**Ubicacion:** `src/app/services/chat.service.ts`

**Responsabilidad:** encapsular llamadas HTTP al backend.

```
getMessages(uidActual: string, uidOtro: string, limit = 50): Observable<MensajeChat[]>;
sendMessage(texto: string, destinatario: { uidDestinatario: string; emailDestinatario: string }): Observable<any>;
getConversations(uidActual: string, limit = 50): Observable<ConversacionResumen[]>;
```

**Modelo `MensajeChat`:**
```
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
```

**Modelo `ConversacionResumen`:**
```
export interface ConversacionResumen {
  chatId: string;
  uidOtro: string;
  emailOtro: string;
  ultimoMensaje: string;
  timestamp: number;
}
```

### 3.2 `UsuariosService`
- Ubicacion: `src/app/services/usuarios.service.ts`
- Devuelve usuarios con `uid`, `email`, `rol`, `nombre?`, etc.
- Usado para poblar selects y autoasignar operador/admin a clientes.

### 3.3 `AuthService`
- Provee usuario actual (`getCurrentUser()`).
- Expone `currentRole` y `role$` (observable).
- El chat usa: UID del usuario autenticado y rol para decidir comportamiento.

### 3.4 Pipe y Directiva
- `chat-filter.pipe.ts`: filtra mensajes por texto.
- `my-message.directive.ts`: aplica clases segun si el mensaje es del usuario actual.

---
## 4. Flujo resumido
1. Obtener usuario actual (`AuthService`).
2. Cargar usuarios (`UsuariosService`).
3. Si rol = cliente -> autoasignar operador/admin como destinatario.
4. Cargar conversaciones (`chatService.getConversations`).
5. Al seleccionar destinatario -> cargar mensajes (`getMessages`).
6. Auto-refresh cada 1s (si hay `uidActual` y `destinatarioSeleccionado`).
7. Enviar mensaje (`sendMessage`), luego refrescar y hacer scroll.

---
## 5. Estilos y layout (resumen)
- Widget: flotante, compacto, input y boton abajo, lista con scroll.
- Full: dos columnas (sidebar 30%, panel 70%), filtro en panel, input fijo abajo.
- Directiva `my-message` aplica estilos de mensaje propio/ajeno.

---
## 6. Pendientes conocidos (FE)
- Contadores de no leidos (integrar endpoint `/chat/unread`).
- Ajustar estilo del input inferior en chat full.
- Mensaje vacio mas claro en chat full.
- Unificar estilos (tipografias, tamanos de controls) entre widget y full.

---
## 7. Servicios auxiliares (detalle extra)
- `AuthService`: usuario actual, rol, role$ observable (decisiones de rol para chat).
- `UsuariosService`: lista de usuarios, se usa para selector y autoasignar operador/admin.

## 8. Directivas y pipes (detalle extra)
### MyMessageDirective
```
<div
  class="mensaje-wrapper"
  *ngFor="let msg of mensajes | chatFilter:filtroTexto"
  [appMyMessage]="msg.uidRemitente"
>
  ...
</div>
```
- Compara uidRemitente vs uidActual.
- Aplica clase `mensaje-mio` o `mensaje-otro`.

### ChatFilterPipe
- Filtra solo por texto del mensaje (no por email).

## 9. Flujo de datos (alto nivel)
- Envio: `enviarMensaje()` valida texto + uids, llama `sendMessage`, refresca y scroll.
- Consulta: `getMessages(uidActual, uidOtro)` -> asigna `mensajes`, scroll.
- Auto-refresh: cada 1s, si hay uids, compara longitud/ultimo id antes de actualizar.
- Conversaciones: `getConversations(uidActual, 50)` -> muestra en sidebar/widget; al click se arma usuario con uidOtro/emailOtro y se llama `onSeleccionDestinatario`.

## 10. Reglas segun rol
- Cliente: no ve lista; autoasigna operador/admin, carga mensajes; si no hay soporte, muestra aviso.
- Operador/Admin: ve usuarios y conversaciones; puede chatear con cualquier usuario.

## 11. Nota final
Si cambian nombres de componentes, rutas o servicios, actualizar este documento para mantener coherencia con la implementacion real.
