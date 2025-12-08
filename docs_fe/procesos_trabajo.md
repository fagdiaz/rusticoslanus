# Procesos de Trabajo - Proyecto Rusticos Lanus (Frontend)

Define el flujo FE con agentes y pasos practicos. Backend (carpeta `srv`) queda fuera de este alcance.

---
## 1. Apertura de TAREA (Coordinador + PM)
- Coordinador define objetivo y confirma que es FE.
- PM recibe el objetivo, redacta requisitos funcionales/tecnicos, riesgos y pruebas basicas.
- PM entrega prompt sugerido al Arquitecto FE.

---
## 2. Arquitecto FE
- Toma el plan del PM y baja blueprint tecnica: componentes/servicios FE a tocar (chat, docs, etc.), flujos de datos (conversaciones/unread/messages), limites DEFAULT/FILTER, scroll, quota_exceeded.
- Entrega prompt al Implementador FE.

---
## 3. Implementador FE
- Prepara codigo o prompt acotado para Codex FE con archivos exactos (ej: chat.component, chat-full, chat.service, docs_fe).
- Evita mezclar BE. Lista cambios moderados y entrega en diffs/snippets.
- Pasa prompt a Codex FE.

---
## 4. Codex FE
- Aplica cambios en archivos indicados (solo FE). Respeta: polling 8000 ms, unread, mensajesByChatId, quota_exceeded, limites DEFAULT/FILTER, scroll interno.
- Devuelve diffs para QA.

---
## 5. QA/Debugger
- Revisa logs en consola y flujo de usuario:
  - Enviar mensaje.
  - Abrir chat (widget/full) y ver unread.
  - Probar filtro de mensajes.
  - Validar scroll interno.
- Reporta hallazgos y propone prompt(s) de fix pequenos.

---
## 6. Pasos especificos para chat
- Antes de cambios profundos: revisar cuotas/limites (polling central 8000 ms, DEFAULT_CHAT_LIMIT=10, FILTER_CHAT_LIMIT=200, quota_exceeded 503).
- Validar endpoints usados: `/chat/conversaciones`, `/chat/unread`, `/chat`.
- No romper: autoSeleccionarDestinatario, conversations$/messages$, unread, scroll interno.
- Para TAREA 5 (pendiente): refresh inmediato de mensajes/unread al abrir/enviar.

---
## 7. Pruebas rapidas FE
- Widget: autoseleccion cliente->operador, sidebar + badges unread, mensajes con scroll, input/boton abajo.
- Chat full: sidebar con unread, filtro, mensajes con scroll, input fijo abajo.
- Users: edad correcta o "-".
- Productos/Pedidos: sin errores visibles.

---
## 8. Commits
- Cambios claros y reducidos, mensaje breve.
- Solo archivos necesarios del alcance FE.
- Ejemplos: `feat(chat): unread inmediato`, `fix(users): edad robusta`, `chore(docs): actualiza procesos_trabajo`.

---
## 9. Seguridad minima
- No subir claves/tokens.
- No exponer credenciales en FE.
- Roles se validan en FE y deben validarse en BE (fuera de este alcance).

---
## 10. Resumen operativo
1. Identificar problema/tarea y anotarlo en `docs_fe/tareas_pendientes.md`.
2. PM planifica, Arquitecto blueprint, Implementador prompt, Codex ejecuta, QA valida.
3. Probar (ng serve) y actualizar docs en `/docs_fe` si aplica.
