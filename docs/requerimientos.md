# Requerimientos de la Intranet Escolar

## Requerimientos funcionales

- [x] Implementar autenticación por roles: administración, docente y estudiante/familia.
- [x] Implementar gestión de usuarios: alta, baja y edición de personas.
- [x] Implementar un módulo académico con registro de calificaciones y/o asistencia.
- [x] Implementar un tablón de comunicados para crear y consultar avisos.
- [x] Restringir la información mostrada de acuerdo con el rol del usuario.

## Requerimientos no funcionales

- [x] Iniciar una interfaz clara y adaptable.
- [x] Incluir etiquetas asociadas a los campos del formulario.
- [x] Incluir estados de foco visibles para navegación por teclado.
- [x] Revisar contraste y accesibilidad durante todo el desarrollo (limpieza de emojis, uso de iconos legibles y semantic HTML).
- [x] Proteger los datos sensibles y evitar exponer información personal innecesaria (bloqueo por intentos, expiración de sesión y no contraseñas fijas).
- [x] Mantener el código versionado en Git desde el inicio.

## Alcance inicial acordado

La primera entrega de la intranet escolar completa y sincronizada de forma local. Los componentes consumen un almacenamiento compartido local con políticas de seguridad y validaciones avanzadas en cliente.

## Fuera de alcance por ahora

- Despliegue a servidores de producción en la nube.
- Autenticación real basada en tokens OAuth/JWT de servidor.
- Base de datos relacional externa (PostgreSQL, MySQL, etc.).
- Integraciones externas con ministerios o sistemas de pago.

Estos elementos pueden incorporarse posteriormente según las decisiones técnicas del equipo.
