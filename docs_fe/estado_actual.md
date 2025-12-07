# Estado Actual - FRONTEND (Angular)
Ultima actualizacion: 2025-12-07

## 1. Descripcion General
Frontend en Angular, acoplado a backend Node/Express + Firestore. Vistas principales:
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
- 1 a 1: cliente ↔ operador/admin.
- Funciones: cargar/enviar mensajes, auto-scroll, auto-refresh (1s), auto-seleccion para rol cliente, lista de conversaciones (resumida).

### 2.2 ChatFullComponent (/chat)
- Vista ampliada con panel lateral de conversaciones.
- Filtro de mensajes (solo texto).
- Mejor visualizacion para operadores/admin.
- Pendientes: estilos input inferior, mensaje vacio claro.

### 2.3 UsuariosComponent
- Lista de usuarios.
- Calculo de edad robusto (mismas posibles fuentes, rango 0-120; muestra "-" si invalido).
- En progreso: filtro por email/nombre/rol, mostrar datos adicionales.

### 2.4 ProductosComponent
- Listado de productos desde backend.
- Pendiente: carrusel, stock visible, mejora de estilo.

### 2.5 PedidosComponent
- Listado de pedidos por usuario/rol.
- Pendiente: campo observaciones/domicilio, mejora de estetica/ordenamiento.

---
## 3. Estado Tecnico del Chat (FE)
- Envio/recepcion funcional.
- Widget: conversaciones y mensajes OK.
- Chat Full: mensajes + conversaciones OK.
- Pendientes: ajustar estilo input inferior, mensaje "No hay mensajes todavia", filtro solo por texto.

---
## 4. Estado Tecnico General del Frontend
- Proyecto estable sin errores criticos.
- Codex integrado para automatizacion de codigo.
- Docs FE: agentes_ia_rusticos.md, backlog.md, prompts_codex.md, procesos_trabajo.md, tareas_pendientes.md.

---
## 5. Reglas para Codex (MUY IMPORTANTE)
- No mezclar FE con BE.
- Mantener estilos compactos en widget; filtro solo en chat-full.
- No eliminar logica estable: autoSeleccionarDestinatario, refrescarMensajesSinSpinner, cargarConversaciones.
- No modificar `chat.service.ts` salvo pedido explicito.
- Cambios en mat-field sin romper scroll del chat.
- Usar diffs/snippets claros; si un archivo no existe, decir "NO ENCONTRADO".

---
## 6. Como probar el Chat
1. Loguearse como admin -> `/chat`.
2. Loguearse como cliente -> iniciar charla con soporte.
3. Verificar conversacion en sidebar del admin.
4. Enviar/recibir mensajes en ambos lados.
5. Testear auto-refresh.

---
## 7. Dependencias relevantes (FE)
- Angular Material
- RxJS
- Angular Router
- Servicios propios (AuthService, UsuariosService, ChatService)

---
## 8. Estado general del FE
Funciona estable, chat operativo y usabilidad aceptable. Faltan tareas esteticas/UX, notificaciones de no leidos e integracion final.

## 9. Notas Finales
- Proyecto estable.
- Chat correcto en widget y aceptable en version full.
- Listo para agregar Ionic y mejorar estetica.
- Bases de datos y colecciones consistentes.

## 10. Proximos Pasos (resumen)
1. Mejoras de estilo (chat, productos, pedidos).
2. Implementacion de Ionic para version movil.
3. Unificar tipografias y tamanos de controles.
4. Agregar carrusel de imagenes en productos.
5. Agregar campo observaciones/domicilio en pedidos.
6. Revisar performance del auto-refresh en chat.
