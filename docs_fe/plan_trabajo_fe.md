# Plan de Trabajo FE (Angular)

## 1) Resumen del estado actual (FE)
- Angular estable, integrado con Node/Express + Firestore.
- Chat widget y chat full operativos (envío/recepción, auto-refresh, auto-scroll, conversaciones). Falta pulir estilos de input y mensaje vacío.
- Usuarios: cálculo de edad robusto; pendientes filtros y datos extra.
- Productos: listado funciona; pendientes carrusel, stock visible, estilos.
- Pedidos: listado básico; faltan observaciones/domicilio y mejoras visuales.
- Docs FE vigentes en `docs_fe` (agentes, arquitectura_chat, backlog, estado_actual, procesos_trabajo, prompts_codex, tareas_pendientes).
- Codex usado para cambios controlados; separación FE/BE respetada.
- Pendiente notificaciones de no leídos en chat.
- Proyecto sin errores críticos, listo para mejoras UX y mobile (Ionic planificado).

## 2) Requisitos del TP que dependen del FE
- Chat privado 1 a 1 con auto-refresh (cliente↔operador/admin; operador/admin↔usuario).
- Distinción visual de mensajes propios/ajenos (directiva + estilos de burbuja).
- Pipe para filtrar mensajes por texto (chat full).
- Registro/alta con fecha de nacimiento y mostrar edad en el FE.
- Gestión y visualización de productos/pedidos en UI.
- Roles visibles en UI y flujos asociados (selector de destinatario en chat según rol).
- Documentación mínima de FE y flujos de trabajo.

## 3) Cumplido en el FE
- Chat widget y chat full funcionan (envío/recepción, auto-refresh, auto-scroll, conversaciones).
- Pipe `chatFilter` filtra solo por texto del mensaje.
- Directiva `MyMessageDirective` aplica estilos mensaje-mío/otro.
- Cálculo de edad robusto en `/users` (múltiples formatos, rango 0-120, muestra "-").
- Docs FE creados y actualizados en `docs_fe`: agentes, arquitectura_chat, backlog, estado_actual, procesos_trabajo, prompts_codex, tareas_pendientes.
- Routing `/chat` usa `ChatFullComponent`; widget usa `ChatComponent`.

## 4) Faltante en el FE (por categoría)
### Chat (widget + /chat full + UX)
- Estilos: input inferior fijo, mensaje vacío claro, campos `.compact-field` homogéneos.
- Notificaciones de no leídos (endpoint `/chat/unread`, badge y merge en conversaciones).
- Scroll automático más suave y performance del auto-refresh.
- Conversaciones: negrita en nombre, preview/fecha en gris; evitar doble card.

### Registro / autenticación
- Revisar flujos de signup/login en UI; asegurar captura de fecha de nacimiento y visualización de edad.

### Listado de productos / pedidos
- Productos: carrusel de imágenes, stock visible, modernizar tarjetas.
- Pedidos: campo observaciones/domicilio, ordenar por fecha, colores por estado, mostrar subtotal/cantidad.

### Requisitos extra del TP (pipes, directivas, etc.)
- Mantener pipe de filtro de mensajes solo por texto.
- Mantener directiva de mensaje propio/ajeno y estilos asociados.
- Completar badges de no leídos (cuando se implemente backend `/chat/unread`).

## 5) Plan de trabajo próximos 3 días (SOLO FE)
### Día 1
- Chat Full: fijar input inferior y mensaje vacío claro.
  - Archivos: `src/app/components/chat-full/chat-full.component.html`, `.css`.
- Unificar campos `.compact-field` en widget y full.
  - Archivos: `src/app/components/chat/chat.component.css`, `src/app/components/chat-full/chat-full.component.css`.

### Día 2
- Notificaciones de no leídos en conversaciones (si backend `/chat/unread` disponible).
  - Archivos: `src/app/services/chat.service.ts`, `src/app/components/chat/chat.component.ts/html/css`, `src/app/components/chat-full/chat-full.component.ts/html/css`.
- Conversaciones: estilos nombre/previews/fecha (negrita/gris).
  - Archivos: `chat.component.html/css`, `chat-full.component.html/css`.

### Día 3
- /users: agregar filtro por email/nombre/rol y mostrar edad limpia.
  - Archivos: `src/app/components/users/users.component.ts/html`.
- Productos: iniciar carrusel y mostrar stock.
  - Archivos: `src/app/components/products/products.component.*` (según estructura actual).

## 6) Prompts ejemplo para Codex (limitar archivos y no tocar BE)
### Día 1 – Chat Full input y mensaje vacío
"Trabajá SOLO sobre:
- src/app/components/chat-full/chat-full.component.html
- src/app/components/chat-full/chat-full.component.css
Objetivo: fijar el input inferior, mejorar el mensaje vacío (texto claro), mantener filtro y directiva.
No tocar TS, servicios ni otros archivos."

### Día 1 – Campos compactos en chat
"Trabajá SOLO sobre:
- src/app/components/chat/chat.component.css
- src/app/components/chat-full/chat-full.component.css
Objetivo: unificar estilos `.compact-field` (altura/padding/fuente) sin modificar estructura HTML ni lógica."

### Día 2 – Unread en chat (solo si BE `/chat/unread` está listo)
"Trabajá SOLO sobre:
- src/app/services/chat.service.ts
- src/app/components/chat/chat.component.ts/html/css
- src/app/components/chat-full/chat-full.component.ts/html/css
Objetivo: consumir `/chat/unread`, mergear unread en conversaciones y mostrar badge si `unread > 0`. No tocar backend ni otros servicios."

### Día 3 – Filtros en /users
"Trabajá SOLO sobre:
- src/app/components/users/users.component.ts
- src/app/components/users/users.component.html
Objetivo: agregar filtro por email/nombre/rol y mostrar edad usando `getEdad`. No tocar otros componentes ni servicios."

### Día 3 – Productos (carrusel/stock)
"Trabajá SOLO sobre:
- src/app/components/products/products.component.*
Objetivo: agregar carrusel de imágenes (simple) y mostrar stock visible en la tarjeta. No modificar servicios ni routing."
