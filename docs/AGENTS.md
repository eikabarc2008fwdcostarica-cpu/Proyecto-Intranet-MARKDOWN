# AGENTS.md — Memoria del Agente

## Contexto

Proyecto académico para construir una **intranet escolar** integrada de uso interno en una institución pública. Los perfiles principales soportados son administración, docentes y estudiantes/familias.

La base utiliza HTML, CSS y JavaScript estructurado. El backend y la base de datos se simulan de forma robusta e interactiva mediante `localStorage` y `sessionStorage`, actuando como una base de datos local compartida entre módulos.

## Requerimientos

- Autenticación segura por roles con expiración.
- Gestión completa de usuarios (Estudiantes, Profesores, Encargados).
- Módulo académico de calificaciones (calificaciones).
- Tablón de comunicados interactivo (comunicados, comentarios, reacciones).
- Bitácora de cambios, accesos y auditoría de seguridad del sistema.
- Interfaz clara, profesional y libre de emojis, utilizando iconos vectoriales.
- Versionado con Git.

### Estado del módulo académico y seguridad

- **Autenticación real del prototipo**: Las credenciales introducidas en `login.html` se validan directamente comparando contra los objetos de usuario guardados en `localStorage['intranetUsers']`.
- **Bloqueo de seguridad**: Si un usuario falla la contraseña 3 veces, el sistema cambia su `status` a `'bloqueado'` de manera persistente. Solo un administrador puede desbloquearlo desde la sección de "Cuentas" del Módulo de Usuarios.
- **Expiración de Sesión**: La sesión expira automáticamente pasadas 2 horas del inicio o tras un periodo de inactividad detectada mediante listeners globales de mouse/teclado.
- **Auditoría integrada**: Cada inicio de sesión exitoso o fallido registra automáticamente los metadatos de acceso (fecha, hora, dispositivo, estado) en `intranetAccessLogs`.

## Reglas

- Mantener separados HTML, CSS y JavaScript.
- Usar Font Awesome 6 en lugar de emojis para mantener una estética profesional y limpia.
- Evitar código duplicado.
- Redirigir siempre a `login.html` en vez del antiguo `index.html` para el control de sesiones inactivas o no autorizadas.
- No romper la persistencia de datos semilla al inicializar los módulos.

## Restricciones

- NO exponer contraseñas en texto plano en el cliente de manera hardcodeada (removido `password !== 'admin123'`).
- NO permitir que usuarios inactivos o bloqueados puedan saltarse la validación.
- NO omitir la limpieza de elementos no accesibles.

## Objetivos Alcanzados

- Base común integrada de la intranet escolar sin errores de redirección.
- Gestión de usuarios robusta conectada al Login.
- Control de seguridad local con limitador de intentos y cierre de sesión automático.
