# Arquitectura del Chat - FRONTEND (Angular)

Resumen del chat privado 1 a 1 en el frontend de Rusticos Lanus:
- Widget flotante (ChatComponent).
- Vista completa en `/chat` (ChatFullComponent).
- Servicio central (chat.service.ts) con polling y manejo de unread.
- Scroll interno en contenedores de mensajes.

---
## 1. Objetivo del modulo de chat (FE)
- Chat privado 1 a 1 entre cliente/operador/admin.
- Backend unico `/chat` (Node + Firestore).
- Auto-refresh centralizado y scroll interno en los componentes.
- Dos experiencias: widget (compacto) y vista full (`/chat`).

---
## 2. Componentes principales

### ChatComponent (widget)
- Ubicacion: `src/app/components/chat/chat.component.*`.
- Renderizado en el widget flotante `<app-chat-widget>`.
- Suscrito a `conversations$`, `messages$`, `quotaExcedida$`.
- Al seleccionar destinatario: inicia polling de mensajes, fuerza `refreshMessagesOnce` + `refreshUnreadOnce`, scroll interno `.chat-messages`.
- Autoselecciona operador/admin si el rol es cliente.

### ChatFullComponent (ruta `/chat`)
- Ubicacion: `src/app/components/chat-full/chat-full.component.*`.
- Layout tipo mensajeria: sidebar (conversaciones + unread) + panel de mensajes con filtro, selector, input fijo abajo y scroll interno.
- Misma base que el widget, mas filtro de mensajes (pipe `chatFilter`) y vista ampliada.

### ChatWidgetComponent
- Ubicacion: `src/app/components/chat-widget/chat-widget.component.*`.
- Burbuja flotante que renderiza `<app-chat>`; no maneja logica de mensajes.

---
## 3. Servicio central: chat.service.ts
- Polling central cada 8000 ms:
  - `/chat/conversaciones`
  - `/chat/unread`
  - Resultado mergeado en `conversations$` (incluye `unread`).
- Mensajes por chatId:
  - `messages$` emite el chat activo, almacen interno `messagesByChatId`.
  - Polling de mensajes se inicia desde los componentes segun el chat seleccionado.
- Flags y limites:
  - `quotaExcedida$` expone 503 `quota_exceeded` (frena polling).
  - `DEFAULT_CHAT_LIMIT = 10` (modo normal).
  - `FILTER_CHAT_LIMIT = 200` (modo filtro).
  - `filterActive`/`filterChatKey` controlan el modo filtro.
- Metodos clave:
  - `getMessages(uidActual, uidOtro, limit?)`
  - `sendMessage(texto, { uidDestinatario, emailDestinatario })`
  - `getConversations(uidActual, limit?)`
  - `getUnreadCounts(uidActual)`
  - `startConversationsPolling` / `startMessagesPolling` / `stop...`
  - `refreshMessagesOnce` / `refreshUnreadOnce` (refrescos inmediatos al abrir/enviar).
  - `activarFiltro` / `desactivarFiltro` (ajusta limit y polling de mensajes).

---
## 4. Integracion con backend
- `/chat/conversaciones`: trae chatId, uidOtro, emailOtro, ultimoMensaje, timestamp; se mergea con unread.
- `/chat/unread`: devuelve `{ chatId, unread }`; se mergea sobre la lista de conversaciones.
- `/chat`: mensajes entre `uidActual` y `uidOtro`; limit segun modo (DEFAULT o FILTER).

---
## 5. Modos de vista y filtro
- Vista normal: usa `DEFAULT_CHAT_LIMIT` (ultimos mensajes). Scroll interno para lectura rapida.
- Vista con filtro: servicio trae hasta `FILTER_CHAT_LIMIT` para ese chat; el pipe `chatFilter` filtra SOLO por texto sobre el set ampliado; puede pausar el intervalo de mensajes para evitar sobrecarga.

---
## 6. Scroll y contenedores
- Contenedores `.chat-messages` con `overflow-y: auto` en widget y full.
- `scrollToBottom()` se llama al recibir mensajes (polling o refresh inmediato).

---
## 7. Reglas por rol
- Cliente: no elige destinatario; se asigna primer operador/admin disponible; aviso si no hay soporte.
- Operador/Admin: ve selector de usuarios y sidebar de conversaciones; puede chatear con cualquier usuario.

---
## 8. Pendientes conocidos (FE)
- Afinar estilo del input inferior y mensaje vacio en chat full.
- Unificar tipografias/tamanos entre widget y full.
- Seguir minimizando parpadeos (trackBy + updates in-place).
