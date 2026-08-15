# Changelog

Todos los cambios relevantes del proyecto se documentarán en este archivo.

## [0.2.0] - Módulo académico inicial

### Agregado

- Página `academico.html` para el módulo académico.
- Registro de calificaciones para administración y docentes.
- Edición y eliminación de calificaciones.
- Consulta de calificaciones según rol.
- Filtro de registros por materia.
- Resumen de cantidad de registros, materias y promedio.
- Persistencia temporal del prototipo mediante `localStorage`.
- Acceso al módulo académico desde el panel principal.
- Estilos adaptables para formulario, tabla y resumen académico.

### Documentación

- Actualización del estado del módulo académico en `README.md`.
- Requerimientos académicos desglosados como lista de tareas.
- Arquitectura y flujo del módulo documentados.
- Decisiones y restricciones académicas incorporadas a `AGENTS.md`.

### Pendiente

- Sustituir `localStorage` por una base de datos.
- Integrar autenticación real y permisos validados en backend.
- Relacionar usuarios, estudiantes y materias mediante identificadores reales.
- Decidir si se incorporará control de asistencia.

## [0.1.0] - Base inicial

### Agregado

- Estructura inicial en HTML, CSS y JavaScript.
- Página principal de la intranet.
- Maqueta de inicio de sesión por roles.
- Panel principal con módulos visibles según rol.
- Documentación inicial en Markdown.
- Requerimientos y decisiones de arquitectura iniciales.

### Pendiente

- Autenticación real.
- Gestión de usuarios.
- Módulo académico completo.
- Tablón de comunicados completo.
