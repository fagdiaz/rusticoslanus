# Prompts estandar para Codex - FRONTEND (Angular)

Este documento define prompts seguros, modulares y precisos para trabajar con Codex sobre el frontend de RusticosLanus (Angular + Firebase).

## Reglas generales para FE (muy importante)
- SIEMPRE indicarle a Codex:
  - el archivo exacto a modificar
  - que comportamiento se espera
  - que NO toque otros archivos
- Hacer cambios pequenos -> un prompt por funcionalidad
- Evitar pedidos ambiguos tipo "arregla el chat"
- Evitar prompts grandes que mezclen FE + BE

---

# 1. Prompt para modificar un componente Angular
Quiero que trabajes SOLO sobre el FRONTEND Angular.
Modifica este archivo:
- src/app/components/NOMBRE/NOMBRE.component.ts
- src/app/components/NOMBRE/NOMBRE.component.html
- src/app/components/NOMBRE/NOMBRE.component.css (si hace falta)

Objetivo:
- DESCRIBIR CAMBIO QUE QUIERO.

Reglas:
- No modifiques servicios, modulos ni routing.
- No reescribas el componente entero salvo que te lo pida explicitamente.
- No agregues dependencias nuevas.
- Mantener compatibilidad con lo existente.

---

# 2. Prompt para agregar logica nueva a un componente
Trabaja SOLO sobre este archivo:
- src/app/components/NOMBRE/NOMBRE.component.ts

Objetivo: AGREGAR FUNCIONALIDAD.

Instrucciones para Codex:
- Agrega metodos nuevos, no reemplaces los existentes.
- No toques HTML ni CSS.
- No cambies firmas de funciones existentes.
- No eliminar imports, solo agregar si es necesario.

---

# 3. Prompt para cambiar el HTML de un componente sin romper nada
Trabaja SOLO sobre este archivo:
- src/app/components/NOMBRE/NOMBRE.component.html

Objetivo: DESCRIBIR EXACTAMENTE EL CAMBIO EN HTML.

Reglas:
- No cambiar bindings existentes.
- No eliminar *ngIf, *ngFor o eventos actuales.
- Si hay que eliminar algo, pedimelo explicitamente.
- Respeta el layout y estilos existentes.

---

# 4. Prompt para modificar estilos de un componente
Trabaja SOLO sobre este archivo:
- src/app/components/NOMBRE/NOMBRE.component.css

Objetivo: DESCRIBIR CAMBIO VISUAL.

Reglas:
- No tocar nombres de clases.
- No mover la estructura HTML.
- Aplicar estilos nuevos de forma aislada.

---

# 5. Prompt para tocar un servicio Angular
Trabaja SOLO sobre este archivo:
- src/app/services/NOMBRE.service.ts

Objetivo: DESCRIBIR CAMBIO.

Reglas:
- No cambiar endpoints salvo que lo pida.
- No cambiar nombres de metodos existentes.
- Agregar nuevos metodos si es necesario.
- Mantener la compatibilidad con el BE.

---

# 6. Prompt para arreglar errores de compilacion
Hay un error de compilacion en Angular.
Trabaja SOLO sobre estos archivos: LISTAR ARCHIVOS EXACTOS

Objetivo: DESCRIBIR ERROR Y QUE ESPERO.

Reglas:
- No reescribir componentes completos.
- No agregar logicas nuevas.
- Solamente corregir el error.

---

# 7. Prompt para pedir un refactor controlado
Quiero un refactor suave en:
- NOMBRE.component.ts

Objetivo:
- Mejorar legibilidad del codigo.
- Extraer funciones pequenas.
- No cambiar ninguna funcionalidad.
- No modificar HTML ni CSS.
- No modificar servicios ni routing.

---

# 8. Prompt especial para el chat (muy usado en este proyecto)
Trabaja SOLO sobre:
- src/app/components/chat/chat.component.ts
- src/app/components/chat/chat.component.html
- src/app/components/chat/chat.component.css

Objetivo: DESCRIBIR EXACTAMENTE QUE QUIERO (ej: agregar filtro de mensajes).

Reglas:
- No romper selectors existentes.
- No modificar servicios de chat.
- No modificar ChatFullComponent a menos que lo pida explicitamente.
- No mezclar widget y chat full.

---

# 9. Prompt para creacion de componentes nuevos
Necesito crear un nuevo componente Angular:
- NOMBRE DEL COMPONENTE

Archivos a generar:
- .ts
- .html
- .css

Objetivo: DESCRIBIR QUE HACE EL NUEVO COMPONENTE.

Reglas:
- Indicar donde se importa: app.module.ts
- No modificar routing salvo que lo indique.

---

## Buenas practicas al usar Codex en Angular
- Pedir SIEMPRE cambios pequenos.
- Aclarar: "No tocar otros archivos".
- Despues de cada prompt -> hacer `git diff` para revisar.
- Si Codex rompe algo -> `git restore` y repetir con prompt mas corto.
- No mezclar BE + FE en un mismo prompt.
