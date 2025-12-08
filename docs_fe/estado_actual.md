# Estado Actual - FRONTEND (Angular)
Ultima actualizacion: 2025-12-07

## 1. Descripcion General
Frontend en Angular acoplado a backend Node/Express + Firestore. Vistas principales:
- Registro e inicio de sesion.
- Navegacion general del sitio.
- Gestion y visualizacion de productos.
- Carrito y pedidos.
- Chat privado (widget + full).
- Panel basico para operadores/administradores.

---
## 2. Componentes Principales
### 2.1 ChatComponent (Widget)
- Chat embebido accesible desde cualquier pagina.
- 1 a 1: cliente ? operador/admin.
- Lista de conversaciones con badge de unread; mensajes con scroll interno; input/boton abajo.
- Polling de mensajes segun chat activo; autoseleccion de soporte para rol cliente.

### 2.2 ChatFullComponent (/chat)
- Vista ampliada con panel lateral de conversaciones + badge de unread.
- Vista de mensajes con scroll interno; filtro de mensajes (solo texto), selector de usuario, input fijo abajo.
- Pendientes: estilo input inferior y mensaje vacio mas claro.

### 2.3 UsuariosComponent
- Lista de usuarios.
- Calculo de edad robusto (formatos multiples, rango 0-120; muestra "-" si invalido).
- En progreso: filtro por email/nombre/rol, datos adicionales.

### 2.4 ProductosComponent
- Listado de productos desde backend.
- Pendiente: carrusel, stock visible, mejora de estilo.

### 2.5 PedidosComponent
- Listado de pedidos por usuario/rol.
- Pendiente: campo observaciones/domicilio, mejora de estetica/ordenamiento.

---
## 3. Estado Tecnico del Chat (FE)
- Polling centralizado en `chat.service.ts` cada 8000 ms: `/chat/conversaciones` + `/chat/unread` -> `conversations$` con unread mergeado.
- Mensajes por chatId con `messages$` y limites: DEFAULT_CHAT_LIMIT=10, FILTER_CHAT_LIMIT=200 (modo filtro); scroll interno en widget y full.
- Manejo de cuota: ante 503 quota_exceeded se expone flag (`quotaExcedida$`) y se detiene polling; mensaje en header y en chat.
- Unread y mensajes: refresco inmediato al abrir/enviar; validado en QA que el unread baja a 0 y se mantiene.
- Envio/recepcion funcional; scroll interno en widget y full.
- Pendientes: ajustar UX de input inferior y mensaje vacio; minimizar parpadeos.

#### Estado actual del chat - unread
- Polling cada 8000 ms a `/chat/conversaciones` + `/chat/unread` (vista /chat).
- Polling global de unread cada 40000 ms iniciado desde el widget al resolver `AuthService.user$`, aun sin entrar a `/chat`.
- Al abrir un chat, el FE setea unread=0 para ese chatId, llama `GET /chat` (BE marca leidos) y ejecuta `refreshUnreadOnce()` para traer el mapa real.
- Hay una ventana de estado fresco que evita que el primer ciclo de polling pise el valor nuevo.
- `conversationsWithUnread$` combina conversaciones + mapa de unread y es la fuente unica de badges en widget y vista full; `unreadConversationsCount$` deriva de `unreadSubject`.
- QA confirma que la burbuja baja a 0 al leer/responder y el polling no reintroduce valores viejos; el badge del widget se muestra aun si no se visita `/chat`.

---
## 4. Estado Tecnico General del Frontend
- Proyecto estable sin errores criticos.
- Codex integrado para automatizacion.
- Docs FE en `docs_fe`: agentes_ia_rusticos.md, backlog.md, prompts_codex.md, procesos_trabajo.md, tareas_pendientes.md, arquitectura_chat.md, estado_actual.md.

---
## 5. Reglas para Codex (FE)
- No mezclar FE con BE.
- Mantener widget compacto; filtro visible solo en chat full.
- No romper logica: autoSeleccionarDestinatario, polling 8000 ms, unread, mensajesByChatId, quota_exceeded.
- Cambios en mat-field sin romper scroll del chat.
- Usar diffs/snippets claros; si un archivo no existe, decir "NO ENCONTRADO".

---
## 6. Como probar el Chat
1. Loguearse como admin -> `/chat` (sidebar, unread, mensajes con scroll).
2. Loguearse como cliente -> abrir widget -> autoseleccion de soporte; ver unread y mensajes con scroll.
3. Verificar conversacion en sidebar del admin.
4. Enviar/recibir mensajes en ambos lados.
5. Validar que unread baja al abrir la conversacion (refresh inmediato) y se mantiene con el polling de 8000 ms.

---
## 7. Dependencias relevantes (FE)
- Angular Material
- RxJS
- Angular Router
- Servicios propios (AuthService, UsuariosService, ChatService)

---
## 8. Estado general del FE
Funciona estable; chat operativo (widget y full) con unread y polling central. Faltan tareas esteticas/UX y optimizaciones menores.

## 9. Proximos Pasos (resumen)
1. Mejoras de estilo (chat, productos, pedidos).
2. Implementacion de Ionic para version movil.
3. Unificar tipografias y tamanos de controles.
4. Agregar carrusel de imagenes en productos.
5. Agregar campo observaciones/domicilio en pedidos.
6. Seguir optimizando refresco/scroll del chat.
