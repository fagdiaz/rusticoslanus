# Backlog - Frontend (Angular)

Tareas del frontend para cambios chicos y controlados (Codex/IA).

---
## Tabla de estado (TAREAS 1-6)
| TAREA | Estado | Detalle |
| --- | --- | --- |
| T1 | COMPLETADA | Integracion /chat/unread en FE (merge unread en conversaciones). |
| T2 | COMPLETADA | Badges de unread en widget y chat full. |
| T3 | COMPLETADA | Polling central 8000 ms (conversaciones + unread) y mensajes por chatId. |
| T4 | COMPLETADA | Scroll interno + limites DEFAULT_CHAT_LIMIT=10 y FILTER_CHAT_LIMIT=200 con modo filtro. |
| T5 | COMPLETADA | Refresh inmediato de mensajes y unread al abrir/enviar (refreshMessagesOnce / refreshUnreadOnce); validada junto a T6. |
| T6 | COMPLETADA | Fix definitivo de unread badge (FE + BE unificado): optimismo a 0 al abrir, GET /chat marca leidos, GET /chat/unread sincroniza; proteccion contra polling 8000 ms; badges desde `unreadByChatId$ + conversationsWithUnread$`; validado QA (admin + 2 clientes). |

---
## PRIORIDAD ALTA (proximos dias)
- Afinar input inferior en chat full (estatico, sin saltos) y mensaje vacio claro.
- Minimizar parpadeo en sidebar/mensajes (trackBy + updates in-place).
- Revisar modo filtro (limit 200) vs modo normal (limit 10) y scroll interno.

---
## PRIORIDAD MEDIA
- /users: filtro por email/rol/nombre; mostrar edad limpia (o "-") y fecha de alta si existe.
- Carrito/Pedidos: campo "observaciones/domicilio" en checkout y listado; orden/estado visible en pedidos.

---
## PRIORIDAD BAJA / NICE TO HAVE (FE)
- Paginacion o carga hacia mensajes mas viejos en el chat.
- Indicadores de "escribiendo" en chats activos.
- Mejoras de diseno mobile / inicio de Ionic.
- Unificar tipografias, tamanos y paleta; modernizar tarjetas y sidebar.

---
## Notas para uso con IA (FE)
- Indicar archivos exactos y alcance acotado.
- No tocar BE en prompts de FE.
- No romper logica de chatId, autoSeleccionarDestinatario, polling 8000 ms, quota_exceeded.
- Revisar diffs luego de cada cambio.
