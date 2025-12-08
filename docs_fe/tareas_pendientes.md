# Tareas Pendientes - Frontend (Angular)

Pendientes FE (rusticoslanus) con foco en chat y UX.

---
## MUST
- Validar que el refresh inmediato de mensajes y unread al abrir/enviar (TAREA 5) funciona en widget y full; unread debe bajar al abrir la conversacion del otro (admin vs cliente).
- Afinar input inferior en chat full (fijo abajo) y mensaje vacio mas claro.

---
## NICE TO HAVE
- Paginacion o carga hacia atras para mensajes mas viejos.
- Indicadores de "escribiendo".
- Mejoras visuales generales y mobile/Ionic.
- Soporte explicito para usar Firestore Emulator desde el FE.
- Reducir aun mas parpadeos (trackBy + updates in-place) si aparece.

---
## Notas operativas
- No mezclar FE + BE en el mismo prompt.
- Validar siempre: unread, filtro, scroll interno, login admin + 2 clientes con mensajes cruzados.
