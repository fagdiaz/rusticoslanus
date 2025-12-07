# Tareas Pendientes - Frontend (Angular)

Este archivo registra las tareas activas, pendientes y completadas del FRONTEND del proyecto Rusticos Lanus.

---
## Seccion 1 - Chat (Widget + Chat Full)
### 1.1 Mejoras pendientes en Chat Full (/chat)
- [ ] Ajustar estilos del input "Escribi tu mensaje" para que quede completamente fijo abajo.
- [ ] Corregir alineacion del mensaje "No hay mensajes todavia".
- [ ] Homogeneizar estilo de conversaciones (negrita para nombre, gris para preview y fecha).
- [ ] Mejorar scroll automatico en casos especificos (cuando se envia un mensaje muy largo).
- [ ] Optimizar refresco para evitar peticiones innecesarias.

### 1.2 Chat Widget
- [ ] Revisar responsividad en tamanos pequenos.
- [ ] Ajustar visibilidad del ultimo mensaje cuando hay textos largos.
- [ ] Ver si se puede reducir la altura del header.

### 1.3 Filtro de mensajes (chat full)
- [ ] Que filtre **solo por contenido del mensaje**, no por email.
- [ ] Resaltar coincidencias (opcional, depende del tiempo del TP).

---
## Seccion 2 - Usuarios
### 2.1 Listado de Usuarios
- [ ] Mostrar edad correctamente usando el nuevo calculo robusto.
- [ ] Agregar filtro por nombre/email/rol.
- [ ] Permitir ver la fecha exacta de registro del usuario (opcional TP).
- [ ] Agregar campo "observaciones" visualizado en el FE.

---
## Seccion 3 - Pedidos / Carrito
### 3.1 Carrito
- [ ] Agregar campo "domicilio" o "observaciones" en la creacion del pedido.
- [ ] Mostrarlo en el FE en el detalle del pedido.
- [ ] Refrescar listado de pedidos automaticamente tras crear uno.

### 3.2 Listado de Pedidos
- [ ] Ordenar por fecha de creacion.
- [ ] Agregar color segun estado (pendiente, procesado, entregado).
- [ ] Mostrar subtotal/cantidad de productos.

---
## Seccion 4 - Productos
### 4.1 Mejoras UI
- [ ] Aplicar carrusel a las imagenes.
- [ ] Modernizar tarjeta de producto.
- [ ] Mostrar stock disponible.

---
## Seccion 5 - Estetica General
- [ ] Unificar tamanos de botones.
- [ ] Unificar tipografias.
- [ ] Reducir altura de mat-form-fields.
- [ ] Implementar modo oscuro (si queda tiempo).

---
## Seccion 6 - Version Mobile (Ionic)
- [ ] Crear estructura base del proyecto Ionic.
- [ ] Implementar login + productos + pedidos.
- [ ] Implementar chat (probablemente version widget adaptada).
- [ ] Sincronizar FE web y FE mobile para compartir servicios (si es posible).

---
## Seccion 7 - Documentacion
- [ ] Mantener actualizado `estado_actual.md`.
- [ ] Mantener actualizado este archivo tras cada commit.
- [ ] Documentar componentes claves: chat, pedidos, productos, usuarios.

---
### Pendiente de revision manana
- Verificar que tareas son necesarias estrictamente para el TP y cuales son mejoras del proyecto real.
