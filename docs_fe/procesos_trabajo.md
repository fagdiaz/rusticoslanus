# Procesos de Trabajo - Proyecto Rusticos Lanus

Este documento define como se trabaja en Rusticos. Aplica a todo el proyecto, pero aqui solo tocamos el frontend (carpeta `rusticoslanus`).

---
## 1. Alcance y separacion FE / BE
- Frontend (FE): Angular en `rusticoslanus/src/app`. Docs clave en `rusticoslanus/docs_fe`:
  - `estado_actual.md`
  - `backlog.md`
  - `prompts_codex.md`
  - `agentes_ia_rusticos.md`
  - `tareas_pendientes.md`
- Backend (BE): Node + Express + Firebase en carpeta `srv` (fuera de alcance FE). Los docs de BE se mantienen en la carpeta correspondiente del backend.
- Nunca mezclar cambios FE y BE en un mismo prompt/commit.

---
## 2. Flujo de trabajo recomendado
1) Identificar si es FE o BE, y si es bug/estetica/feature. Registrar en `docs_fe/tareas_pendientes.md` (FE) o en el doc equivalente de BE.
2) Preparar contexto para la IA usando `agentes_ia_rusticos.md`, `estado_actual.md`, `backlog.md` y el codigo relevante.
3) Dividir tareas grandes en etapas pequenas (etapa1, etapa2...).
4) Ejecutar el prompt en Codex con archivos explicitos y cambios acotados.
5) Revisar diffs (no aceptar si toco archivos indebidos). Si falla, hacer una etapa FIX pequena.
6) Pruebas rapidas:
   - FE: `ng serve` en `rusticoslanus`.
   - BE: `node server.js` en `srv` (solo si trabajas en BE).
7) Commit limpio y actualizar docs si aplica.

---
## 3. Reglas para IA / Codex
- Prompts cortos y con archivos especificos. No megaprompts mezclando chat + pedidos + estilos.
- No eliminar logica estable (auto-refresh del chat, autoSeleccionarDestinatario, routing, etc.).
- No renombrar componentes/servicios sin pedido explicito.
- Mantener la separacion: si es FE, no tocar BE, y viceversa.
- Usar diffs/snippets claros; si un archivo no existe, decir "NO ENCONTRADO".

---
## 4. Pruebas rapidas FE
- Widget (`ChatComponent`): autoseleccion de operador para cliente; conversaciones renderizadas; input/boton abajo.
- Chat Full (`ChatFullComponent` en `/chat`): sidebar con conversaciones (nombre + ultimo mensaje + fecha), filtro de mensajes, no interferir con widget.
- Users: edad correcta si fecha valida; "-" si no se puede calcular.
- Productos/Pedidos: creacion/listado sin errores visibles.

---
## 5. Commits
- Cambios claros y reducidos, mensaje breve y descriptivo.
- Solo archivos necesarios del alcance (FE en `rusticoslanus`).
- Ejemplos: `feat(chat-full): ajusta filtro y sidebar`, `fix(users): calcula edad robusta`, `chore(docs): actualiza procesos_trabajo`.

---
## 6. Seguridad minima
- No subir claves/tokens al repo.
- No exponer credenciales en el FE.
- Roles se validan en FE, y deberian validarse en BE (fuera de este alcance).

---
## 7. Resumen operativo
1. Identificar problema/tarea.
2. Anotarlo en `docs_fe/tareas_pendientes.md` (FE) o doc correspondiente en BE.
3. Preparar contexto (codigo + docs).
4. Prompt corto y claro a Codex (solo archivos necesarios).
5. Probar (FE: `ng serve`).
6. Commit limpio.
7. Actualizar documentacion si aplica.
