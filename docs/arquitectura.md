# Arquitectura de la Intranet Escolar

## Objetivo

Definir una base técnica sencilla que permita al equipo construir el prototipo de forma incremental y mantener separadas la interfaz, la lógica del cliente y la documentación.

## Stack inicial

| Capa | Tecnología actual | Estado |
|---|---|---|
| Interfaz | HTML5 | Implementada como base |
| Estilos | CSS3 | Implementada como base |
| Lógica cliente | JavaScript | Implementada como base |
| Backend | Por definir | Pendiente |
| Base de datos | Por definir | Pendiente |

> El PDF del proyecto permite que el alcance técnico exacto sea ajustado. Por eso esta base no impone todavía un framework, backend o motor de base de datos.

## Estructura

```text
/
├── index.html
├── dashboard.html
├── css/
├── js/
├── assets/
├── docs/
└── archivos Markdown del proyecto
```

## Flujo actual

1. El usuario abre `index.html`.
2. Completa la maqueta de acceso y selecciona un rol.
3. JavaScript guarda una sesión temporal de demostración en `localStorage`.
4. El usuario es dirigido a `dashboard.html`.
5. El panel muestra módulos según el rol seleccionado.

## Decisiones iniciales

- Mantener HTML, CSS y JavaScript separados.
- Usar HTML semántico y etiquetas asociadas a los controles de formulario.
- Preparar la interfaz para los tres perfiles mínimos: administración, docente y estudiante/familia.
- No implementar todavía autenticación real para evitar fijar una tecnología de backend antes de que el equipo la decida.

## Seguridad

La implementación final debe:

- No exponer información personal innecesaria.
- No guardar contraseñas en texto plano.
- Validar los permisos en el servidor, no solo ocultar elementos en la interfaz.
- Asegurar que cada usuario pueda consultar únicamente la información correspondiente a su rol.
