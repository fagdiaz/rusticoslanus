# Backlog - Frontend (Angular)

Este documento lista las tareas pendientes del frontend, ordenadas por prioridad y pensadas para trabajar con IA (ChatGPT / Codex) en cambios chicos y controlados.

---
## Hecho recientemente
- Calculo de edad robusto en `/users` (getEdad, soporta multiples formatos, rango 0-120).
- Chat widget y chat full funcionales con conversaciones y filtros segun modo.

## PRIORIDAD ALTA (PROXIMOS DIAS)
### 1. Chat Full - Ajustes de layout y UX
Objetivo: que la vista `/chat` sea comoda y estable.
- Mantener siempre visible: listado de mensajes, input "Escribi tu mensaje", boton "Enviar".
- Evitar que input/boton suban cuando no hay conversacion o mensajes.
- Asegurar flex column, lista ocupa alto disponible, barra de input fija abajo.
Done cuando: sin conversacion -> layout estable; al seleccionar conversacion -> mensajes + input + boton correctos.

### 2. Unificar estilos de campos (mat-form-field)
Objetivo: campos de texto de tamano coherente.
- Revisar "Buscar usuario", "Conversar con", "Escribi tu mensaje".
- Clase comun `.compact-field` para altura/fuente/padding.
- Aplicar en widget y chat full.
Done cuando: mat-form-field del chat se ven parejos y no se cortan labels/placeholders.

### 3. Limpieza de codigo en componentes de chat
Objetivo: simplificar mantenimiento.
- Revisar `chat.component.ts`, `chat-full.component.ts`, templates y CSS.
- Eliminar imports/props/metodos no usados; sin romper: auto-refresh, autoSeleccionarDestinatario, carga de conversaciones.
Done cuando: sin warnings de unused y funcionalidad intacta.

## PRIORIDAD MEDIA (DESPUES DE ESTABILIZAR CHAT)
### 4. /users - mejoras de visualizacion
Objetivo: listado util para pruebas/demo.
- Filtro por email/rol.
- Mostrar edad en formato consistente (edad o "-").
- Opcional: fecha de alta, orden por email.
Done cuando: se encuentra rapido por email/rol; edades limpias.

### 5. Carrito/pedidos - campo "observaciones"
Objetivo: campo libre en checkout y modelo FE.
- Campo opcional, max. ~500 chars.
- Enviar al backend cuando este listo.
Done cuando: se puede enviar observaciones sin romper pedidos.

## PRIORIDAD BAJA (MEJORAS FUTURAS)
### 6. Mejora visual general
Objetivo: dejar la app lista para presentacion del TP.
- Ajustar tipografias, tamanos, margenes.
- Unificar paleta (botones, cards, fondos de chat).

## Notas para uso con IA / Codex (Frontend)
- Siempre especificar archivo exacto y objetivo.
- Cambios modestos: una seccion de estilos o un componente/servicio por vez.
- No romper logica de chatId, auto-refresh, autoSeleccionarDestinatario.
- Revisar con `git diff` despues de cada cambio.
- No mezclar BE + FE en el mismo prompt.
