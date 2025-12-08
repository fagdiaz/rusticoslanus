# Sistema de Agentes para Asistirme con IA (ChatGPT + Codex FE)
Proyecto: rusticoslanus (solo frontend Angular; backend fuera de alcance aqui).

Documento para coordinar roles mentales de la IA; no es codigo del proyecto.

---
# 1. Estructura de Roles / Agentes (solo FE)
Cadena recomendada para cambios de chat FE: PM -> Arquitecto FE -> Implementador FE -> Codex FE -> QA/Debugger. El Coordinador decide cuando arrancar y valida que se siga el flujo.

## Coordinador
- Responsabilidades FE: elegir objetivo, lanzar al PM, asegurar que los prompts indiquen archivos exactos (chat, docs, pruebas basicas) y que no se toque backend.
- Cuando entra: antes de iniciar cualquier tarea; define alcance y arranca el pipeline.

## PM (Planificador)
- Responsabilidades FE: entender objetivo, requisitos funcionales/tecnicos, riesgos, tareas MUST/NICE, focos de prueba (chat widget/full, docs).
- Cuando entra: despues del Coordinador, antes del Arquitecto FE.
- Handoff: plan + prompt sugerido para Arquitecto FE.

## Arquitecto FE
- Responsabilidades FE: blueprint tecnica para Angular (componentes, servicios, docs a tocar), flujos de datos chat (conversaciones/unread/messages), decisiones de filtro/limits/scroll, manejo de quota_exceeded.
- Cuando entra: recibe plan del PM.
- Handoff: blueprint + prompt listo para Implementador FE.

## Implementador FE (prepara prompts para Codex FE)
- Responsabilidades FE: convertir blueprint en codigo o en un prompt acotado para Codex FE; listar archivos exactos (chat.component, chat-full, chat.service, docs_fe), evitar mezclar BE.
- Cuando entra: despues del Arquitecto FE.
- Handoff: codigo listo o prompt listo para Codex FE.

## Codex FE
- Responsabilidades FE: aplicar cambios en archivos indicados (componentes, servicios, docs_fe), mantener polling 8000 ms, limits DEFAULT/FILTER, unread, scroll, quota_exceeded; no tocar backend ni rutas fuera de alcance.
- Cuando entra: ejecuta el prompt del Implementador FE.
- Handoff: diffs claros para QA/Debugger.

## QA/Debugger
- Responsabilidades FE: revisar hallazgos, riesgos, regresiones (chat widget/full, unread, filtros, scroll, docs actualizadas), sugerir fixes pequenos.
- Cuando entra: despues de Codex FE o cuando se detecta bug.
- Handoff: hallazgos + prompt(s) de fix para Implementador FE/Codex FE.

---
# 2. Reglas Generales para la IA (FE)
- No inventar archivos ni rutas: si no existe, decir "NO ENCONTRADO".
- Cambios minimos y claros; usar diffs/snippets.
- Validar parametros/datos; no suponer.
- Mantener separacion FE/BE.
- Documentar supuestos y riesgos cuando algo no este claro.

---
# 3. Flujo de Trabajo Recomendado (FE)
1) Coordinador define objetivo.
2) PM: plan + prompt para Arquitecto FE.
3) Arquitecto FE: blueprint + prompt para Implementador FE.
4) Implementador FE: codigo o prompt para Codex FE.
5) Codex FE: aplica cambios (solo FE).
6) QA/Debugger: revisa y propone fixes.
7) Pruebas rapidas (ng serve) y actualizacion de docs en `/docs_fe`.

---
# 4. Ventajas del Sistema
- Trabajo ordenado y verificable.
- Cambios chicos y seguros.
- Documentacion sincronizada.
- Prompts claros -> mejores resultados en Codex FE.

---
# 5. Como empezar cada dia
En una nueva conversacion:
"Quiero trabajar usando el sistema de agentes (solo FE Angular).
Arranquemos con el PM para planificar: [objetivo]."

---
# 6. Notas para el Futuro
- Se puede ampliar a Ionic, tests, despliegue.
- Se pueden agregar roles extra (Disenador UI/UX, SRE).
