# Tareas Pendientes - Frontend (Angular)

Pendientes FE (rusticoslanus) con foco en chat y UX.

---
## MUST (FE chat)
- Refinar UX visual del chat (parpadeos, microanimaciones, input, estados vacios).
- Ajustar manejo de mensajes vacios / disable de boton enviar.
- Revisar comportamiento de scroll en historiales largos y con filtro aplicado.
> Nota: la validacion de unread badge (TAREA 6) esta COMPLETADA y verificada; no queda deuda funcional en ese punto.

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

---
## Productos (FE)
### MUST
- No hay deudas funcionales críticas: carga, alta/edición, imágenes, edición/soft delete y carrito funcionan; los errores se manejan con validaciones básicas y el widget queda sincronizado con `/cart`.

### NICE TO HAVE
- Validaciones extra en el formulario (precio positivo, URL válida, mensajes de error más claros).
- Mejorar el layout responsive de las cards y del widget para tablets/móviles (márgenes, altura, breakpoints).
- Mostrar meta datos extra (stock, categoría, orden) y reforzar el badge INACTIVO con texto explicativo.
