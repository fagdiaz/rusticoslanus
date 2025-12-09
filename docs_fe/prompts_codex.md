# Prompts estandar para Codex - FRONTEND (Angular)

Guia de prompts seguros y acotados para el FE de RusticosLanus.

## Reglas generales para FE
- Indicar siempre archivos exactos y objetivo concreto.
- Cambios chicos: un prompt por funcionalidad.
- No mezclar FE + BE.
- Si un archivo no existe, pedir que responda "NO ENCONTRADO".
- Pedir que no toque routing, guards ni servicios ajenos al alcance.

---
## Plantillas resumidas

### 1) Modificar un componente Angular
```
Trabaja SOLO sobre:
- src/app/components/NOMBRE/NOMBRE.component.ts
- ...html
- ...css (si hace falta)
Objetivo: [cambio puntual].
Reglas: no tocar servicios, modulos ni routing. No reescribir todo el componente.
```

### 2) Agregar logica nueva a un componente
```
Trabaja SOLO sobre: ...component.ts
Objetivo: [funcionalidad].
Reglas: agrega metodos nuevos, no cambies firmas ni elimines imports; no toques HTML/CSS.
```

### 3) Cambiar solo el HTML
```
Trabaja SOLO sobre: ...component.html
Objetivo: [cambio en plantilla].
Reglas: no romper bindings, *ngIf/*ngFor/eventos; respetar layout.
```

### 4) Modificar estilos
```
Trabaja SOLO sobre: ...component.css
Objetivo: [ajuste visual].
Reglas: no cambiar nombres de clases ni estructura HTML.
```

### 5) Tocar un servicio Angular
```
Trabaja SOLO sobre: src/app/services/NOMBRE.service.ts
Objetivo: [cambio].
Reglas: no cambiar endpoints ni firmas existentes salvo pedido explicito; agrega metodos si es necesario; mantener compatibilidad con el BE.
```

### 6) Arreglar error de compilacion
```
Hay un error en Angular.
Trabaja SOLO sobre: [archivos].
Objetivo: corregir el error.
Reglas: no reescribir componentes ni agregar logicas nuevas; solo fix.
```

### 7) Refactor suave
```
Refactor en: ...component.ts
Objetivo: legibilidad; extraer funciones pequenas; sin cambiar funcionalidad.
Reglas: no tocar HTML/CSS ni servicios/routing.
```

### 8) Prompt especial para el chat
```
Trabaja SOLO sobre:
- src/app/components/chat/chat.component.*
- src/app/components/chat-full/chat-full.component.*
- (si aplica) src/app/services/chat.service.ts
Objetivo: [ajuste de chat].
Reglas: no romper polling 8000 ms, unread, messagesByChatId, quota_exceeded; no tocar otros servicios/rutas.
```

### 9) Crear componente nuevo
```
Crear componente Angular: NOMBRE (ts/html/css).
Indicar donde importarlo (app.module.ts) y si afecta routing.
```

---
## Prompt tipo Implementador (ejemplo breve, usado en TAREAS 2-4)
```
Actua como Implementador FE. Genera un prompt para Codex FE que:
- Modifique chat.service.ts, chat.component.* y chat-full.component.*
- Integre /chat/unread en conversations$ y muestre badges.
- Mantenga polling 8000 ms y limits DEFAULT/FILTER.
- No toque routing ni otros servicios.
- Entregue diffs/snippets claros.
```
## Prompt tipo Implementador (ejemplo breve, usado en TAREA 5)
```
Actua como Implementador FE. Genera un prompt para Codex FE que:
- Use chat.service.ts, chat.component.* y chat-full.component.*.
- Agregue refresh inmediato de mensajes y unread al abrir/enviar (refreshMessagesOnce / refreshUnreadOnce).
- Mantenga polling central 8000 ms y quota_exceeded.
- No toque routing, guards ni servicios ajenos.
- Entregue diffs/snippets claros y solo archivos del scope.
```

## Buenas practicas
- Revisar `git diff` despues de cada cambio.
- Si Codex rompe algo -> restaurar y repetir con prompt mas corto.
- En chat: mantener autoSeleccionarDestinatario, polling 8000 ms, unread, scroll interno.
- Probar login admin + 2 clientes, mensajes cruzados, filtro y badges tras cambios.

### 10) Prompt Productos (FE)
```
Actua como Implementador FE. Genera un prompt que:
- Modifique `ProductsComponent`, `AddproductComponent` (ts/html/css) y, si aplica, `CartWidgetComponent` para reforzar el modal reactivo (alta/edición), `imagenUrl`, soft delete y los controles de cantidad admin-only.
- Use `ProductsService` y `CartService` sin tocar chat, checkout ni nuevas rutas; mantenga `MatDialog`, `updateProduct`, `softDeleteProduct`, `addProduct(product)`/`removeProduct(product)` y el widget del header como están.
- Describe la necesidad: el header muestra un badge `cartCount$`, el widget despliega subtotal y controles +/−, las cards sólo renders activos para operadores/clientes y el admin ve botón de alta, edición y eliminación con badge INACTIVO.
- Solicita diffs/snippets precisos sobre los archivos en scope y asegura que `/cart` y `/checkout` siguen sincronizados con el servicio del carrito.
```
