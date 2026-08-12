# AGENTS.md — Memoria del Agente

## Contexto

Proyecto académico para construir un prototipo funcional de **intranet escolar** de uso interno en una institución pública. Los perfiles principales son administración, docentes y estudiantes/familias.

La base actual utiliza HTML, CSS y JavaScript. El backend y la base de datos todavía no se han definido.

## Requerimientos

- Autenticación por roles.
- Gestión de usuarios.
- Módulo académico de calificaciones y/o asistencia.
- Tablón de comunicados.
- Consulta de información según permisos del rol.
- Interfaz clara y accesible.
- Protección de datos sensibles.
- Versionado con Git.

## Reglas

- Mantener separados HTML, CSS y JavaScript.
- Usar nombres claros y consistentes.
- Evitar código duplicado cuando sea posible.
- Documentar decisiones técnicas relevantes en Markdown.
- Hacer cambios pequeños y fáciles de revisar en Git.

## Restricciones

- NO exponer datos personales innecesarios, especialmente de menores.
- NO guardar contraseñas en texto plano.
- NO considerar `localStorage` como un mecanismo de autenticación real.
- NO permitir que el frontend sea la única capa que controle los permisos cuando exista backend.
- NO agregar tecnologías nuevas sin documentar el motivo de la decisión.

## Objetivos

- Contar con una base común sobre la que los integrantes puedan trabajar en paralelo.
- Implementar los requerimientos mínimos del proyecto.
- Mantener la documentación Markdown actualizada junto con el código.
- Llegar a un prototipo funcional, entendible y demostrable.

## Memoria del proyecto

- **Versión 0.1.0:** se creó una base sin framework con HTML, CSS y JavaScript para no bloquear al equipo antes de decidir el backend.
- Se prepararon tres áreas funcionales principales: usuarios, académico y comunicados.
- El acceso actual por roles es solo una maqueta y debe sustituirse por autenticación segura.
- `CONTRIBUTING.md` se mantiene corto por ahora para que el equipo pueda definir después sus reglas definitivas.

## Buenas prácticas

- Documentar el **por qué** de las decisiones importantes.
- Usar HTML semántico y controles accesibles.
- Validar los datos tanto en cliente como en servidor cuando exista backend.
- Mantener un historial de commits que refleje el avance real del equipo.
- Actualizar `CHANGELOG.md` al completar cambios relevantes.
- Actualizar esta memoria cuando cambie una decisión importante del proyecto.
