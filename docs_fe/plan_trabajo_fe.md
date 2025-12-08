# Plan de Trabajo FE (Angular)

## 1) Resumen del estado actual (FE)
- Angular estable con backend Node/Express + Firestore.
- Chat widget y chat full operativos: envio/recepcion, polling central 8000 ms, unread mergeado, refresh inmediato al abrir/enviar, scroll interno. Pendiente pulir input y mensaje vacio.
- Usuarios: calculo de edad robusto; faltan filtros y datos extra.
- Productos: listado ok; faltan carrusel, stock visible, estilos.
- Pedidos: listado basico; faltan observaciones/domicilio y mejoras visuales.
- Docs FE vigentes en docs_fe (agentes, arquitectura_chat, backlog, estado_actual, procesos_trabajo, prompts_codex, tareas_pendientes).
- Codex se usa con cambios acotados; separacion FE/BE respetada.
- Proyecto sin errores criticos; foco en UX y mobile (Ionic planificado).

## 2) Requisitos del TP que dependen del FE
- Chat privado 1 a 1 con auto-refresh y unread (cliente?operador/admin; operador/admin?usuario).
- Distincion visual mensajes propios/ajenos (directiva + burbujas).
- Pipe para filtrar mensajes por texto (chat full).
- Registro/alta con fecha de nacimiento y mostrar edad en el FE.
- Gestion y visualizacion de productos/pedidos en UI.
- Roles visibles en UI y flujos asociados (selector de destinatario segun rol en chat).
- Documentacion minima de FE y flujos de trabajo.

## 3) Cumplido en el FE
- Chat widget/full con polling 8000 ms, unread, refresh inmediato, scroll interno.
- Pipe chatFilter solo por texto.
- Directiva MyMessageDirective para mensaje mio/otro.
- Calculo de edad robusto en /users (multiples formatos, rango 0-120, muestra "-").
- Docs FE actualizados en docs_fe.
- Routing /chat -> ChatFullComponent; widget usa ChatComponent.

## 4) Faltante en el FE (por categoria)
### Chat (widget + /chat full + UX)
- Estilos: input inferior fijo, mensaje vacio claro, campos .compact-field homogeneos.
- Validar UX de refresh inmediato (unread baja al abrir/enviar) y minimizar parpadeo con trackBy/updates in-place.
- Scroll mas suave y performance del auto-refresh.
- Conversaciones: negrita en nombre, preview/fecha en gris; evitar doble card.

### Registro / autenticacion
- Revisar signup/login; asegurar captura de fecha de nacimiento y visualizacion de edad.

### Productos / pedidos
- Productos: carrusel de imagenes, stock visible, modernizar tarjetas.
- Pedidos: observaciones/domicilio, ordenar por fecha, colores por estado, mostrar subtotal/cantidad.

### Requisitos extra del TP
- Mantener pipe de filtro por texto y directiva de mensaje propio/ajeno.

## 5) Plan proximos 3 dias (SOLO FE)
### Dia 1
- Chat Full: fijar input inferior y mensaje vacio claro.
  - Archivos: src/app/components/chat-full/chat-full.component.html, .css.
- Validar refresh inmediato de unread/mensajes en widget y full (solo ajustes menores si falla).
  - Archivos: src/app/components/chat/chat.component.ts/html, chat-full.component.ts/html.

### Dia 2
- Minimizar parpadeo (trackBy + updates in-place) y revisar filtro vs limites DEFAULT/FILTER.
  - Archivos: chat.component.ts/html, chat-full.component.ts/html.
- Unificar campos .compact-field en widget y full.
  - Archivos: src/app/components/chat/chat.component.css, src/app/components/chat-full/chat-full.component.css.

### Dia 3
- /users: agregar filtro por email/nombre/rol y mostrar edad limpia.
  - Archivos: src/app/components/users/users.component.ts/html.
- Productos: iniciar carrusel y mostrar stock.
  - Archivos: src/app/components/products/products.component.*.

## 6) Prompts ejemplo para Codex (limitar archivos y no tocar BE)
### Dia 1 - Chat Full input y mensaje vacio
"Trabaja SOLO sobre:
- src/app/components/chat-full/chat-full.component.html
- src/app/components/chat-full/chat-full.component.css
Objetivo: fijar el input inferior y mejorar el mensaje vacio (texto claro). No tocar TS ni servicios."

### Dia 1 - Validacion refresh inmediato (solo si falla)
"Trabaja SOLO sobre:
- src/app/components/chat/chat.component.ts/html
- src/app/components/chat-full/chat-full.component.ts/html
Objetivo: ajustar (si es necesario) el refresh inmediato de unread/mensajes al abrir/enviar. No tocar servicios ni routing."

### Dia 2 - Campos compactos en chat
"Trabaja SOLO sobre:
- src/app/components/chat/chat.component.css
- src/app/components/chat-full/chat-full.component.css
Objetivo: unificar estilos .compact-field sin cambiar la estructura HTML ni la logica."

### Dia 2 - Minimizar parpadeo (si aplica)
"Trabaja SOLO sobre:
- src/app/components/chat/chat.component.ts/html
- src/app/components/chat-full/chat-full.component.ts/html
Objetivo: asegurar trackBy y updates in-place para reducir parpadeos; no tocar servicios."

### Dia 3 - Filtros en /users
"Trabaja SOLO sobre:
- src/app/components/users/users.component.ts
- src/app/components/users/users.component.html
Objetivo: agregar filtro por email/nombre/rol y mostrar edad usando getEdad."

### Dia 3 - Productos (carrusel/stock)
"Trabaja SOLO sobre:
- src/app/components/products/products.component.*
Objetivo: agregar carrusel de imagenes (simple) y mostrar stock visible. No modificar servicios ni routing."
