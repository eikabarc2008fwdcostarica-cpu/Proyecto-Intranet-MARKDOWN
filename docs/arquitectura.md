# Arquitectura de la Intranet Escolar

## Objetivo

Definir una base técnica sencilla que permita al equipo construir el prototipo de forma incremental y mantener separadas la interfaz, la lógica del cliente y la documentación.

## Stack inicial

| Capa | Tecnología actual | Estado |
|---|---|---|
| Interfaz | HTML5 | Implementada |
| Estilos | CSS3 | Implementada |
| Lógica cliente | JavaScript | Implementada |
| Persistencia temporal | `localStorage` | Solo prototipo |
| Backend | Por definir | Pendiente |
| Base de datos | Por definir | Pendiente |

> El alcance técnico del proyecto puede ajustarse. Por eso el prototipo actual no impone todavía un framework, backend o motor de base de datos.

## Estructura

```text
/
├── pages/
│   ├── index.html
│   ├── dashboard.html
│   └── academico.html
├── src/
│   ├── js/
│   │   ├── index.js
│   │   ├── dashboard.js
│   │   └── academico.js
│   └── styles/
│       └── index.css
└── docs/
```

## Flujo general actual

1. El usuario abre `pages/index.html`.
2. Completa la maqueta de acceso y selecciona un rol.
3. JavaScript guarda una sesión temporal de demostración en `localStorage`.
4. El usuario es dirigido a `pages/dashboard.html`.
5. El panel muestra módulos según el rol seleccionado.
6. El módulo académico se abre desde `pages/academico.html`.

## Arquitectura del módulo académico

El módulo se mantiene dividido en tres responsabilidades principales:

| Archivo | Responsabilidad |
|---|---|
| `pages/academico.html` | Estructura semántica, formulario, resumen y tabla de calificaciones |
| `src/js/academico.js` | Reglas por rol, validaciones, CRUD temporal, filtros y renderizado |
| `src/styles/index.css` | Estilos reutilizados y reglas visuales específicas del módulo |

### Flujo de calificaciones

1. Administración o docente accede al formulario.
2. Registra estudiante, materia, evaluación, nota y observaciones opcionales.
3. JavaScript valida que la nota se encuentre entre 0 y 100.
4. El registro se almacena temporalmente en `localStorage`.
5. La tabla y el resumen se actualizan inmediatamente.
6. Administración y docente pueden editar o eliminar registros.
7. Estudiante/familia entra en modo de consulta y no recibe controles de edición.

### Restricción temporal de consulta

Mientras no exista autenticación real, el rol `estudiante` solo muestra registros cuyo campo `studentName` coincida con el nombre utilizado al iniciar sesión.

Esta decisión **no representa el diseño final de seguridad**. En una arquitectura con backend, cada estudiante debe estar relacionado mediante un identificador interno y las consultas deben filtrarse y autorizarse en el servidor.

## Decisiones iniciales

- Mantener HTML, CSS y JavaScript separados.
- Usar HTML semántico y etiquetas asociadas a los controles de formulario.
- Preparar la interfaz para los tres perfiles mínimos: administración, docente y estudiante/familia.
- Implementar primero calificaciones y dejar asistencia como ampliación opcional.
- Usar `localStorage` únicamente como persistencia temporal durante el prototipado.
- No fijar todavía una tecnología de backend antes de que el equipo tome esa decisión.

## Seguridad

La implementación final debe:

- No exponer información personal innecesaria.
- No guardar contraseñas en texto plano.
- Validar los permisos en el servidor, no solo ocultar elementos en la interfaz.
- Asegurar que cada usuario pueda consultar únicamente la información correspondiente a su rol e identidad.
- Sustituir el almacenamiento de calificaciones en el navegador por una base de datos protegida.
