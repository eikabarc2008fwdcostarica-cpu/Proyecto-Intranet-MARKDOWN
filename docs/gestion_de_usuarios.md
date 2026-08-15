# Módulo: Gestión de Usuarios

## 1. Árbol de funciones (ampliado)

```text
GESTIÓN DE USUARIOS
│
├── Estudiantes
│   ├── Registrar
│   ├── Consultar (ficha completa)
│   ├── Editar
│   ├── Desactivar / Reactivar
│   ├── Buscar y filtrar (nombre, grado, sección, estado)
│   ├── Importar masivo (CSV / Excel)
│   ├── Exportar listado (CSV / PDF)
│   ├── Subir / cambiar foto de perfil
│   ├── Ver historial académico
│   └── Asociar encargados
│
├── Docentes
│   ├── Registrar
│   ├── Consultar (ficha completa)
│   ├── Editar
│   ├── Desactivar / Reactivar
│   ├── Asignar materias
│   ├── Asignar horarios
│   ├── Ver grupos / estudiantes a cargo
│   ├── Buscar y filtrar (materia, disponibilidad, estado)
│   └── Subir / cambiar foto de perfil
│
├── Padres / Encargados
│   ├── Registrar
│   ├── Consultar
│   ├── Editar
│   ├── Asociar estudiantes
│   ├── Ver progreso de estudiantes asociados
│   └── Preferencias de notificación
│
├── Cuentas
│   ├── Crear cuenta
│   ├── Cambiar contraseña
│   ├── Recuperar contraseña (email / SMS)
│   ├── Verificación en dos pasos (2FA)
│   ├── Activar / Desactivar
│   ├── Bloqueo por intentos fallidos
│   └── Cierre de sesión remoto
│
├── Roles y permisos
│   ├── Administrador
│   ├── Profesor
│   ├── Estudiante
│   ├── Encargado
│   ├── Roles personalizados
│   └── Permisos granulares por módulo/acción
│
├── Notificaciones
│   ├── Alertas del sistema (cuenta creada, contraseña cambiada, etc.)
│   ├── Notificaciones por correo
│   └── Notificaciones push (opcional)
│
├── Panel resumen (Dashboard)
│   ├── Totales por tipo de usuario
│   ├── Usuarios activos / inactivos
│   ├── Altas recientes
│   └── Accesos recientes
│
└── Auditoría
    ├── Historial de cambios (quién, qué, cuándo)
    ├── Registro de accesos (login/logout, IP, dispositivo)
    ├── Filtrar por usuario, fecha o tipo de acción
    └── Exportar reportes de auditoría
```

## 2. Indicaciones para el agente de desarrollo

### 2.1 Stack y estructura
- Genera componentes reutilizables por entidad (Estudiante, Profesor, Encargado) reutilizando un componente base de "tabla de usuarios" con props para columnas, filtros y acciones.
- Cada listado debe soportar: paginación, ordenamiento por columna, búsqueda en vivo y filtros combinables.
- Los formularios (registrar/editar) deben tener validación en tiempo real y mensajes de error claros por campo.
- Incluye estados de carga (skeleton/spinner), estado vacío (sin resultados) y estado de error (fallo de red) en cada vista.
- Las acciones destructivas (desactivar usuario, revocar rol) deben pedir confirmación mediante un modal.

### 2.2 Diseño visual — usar la paleta ya implementada en el proyecto
No inventes una paleta nueva: reutiliza las variables de color/tema que ya existen en el proyecto (archivo de tema, `tailwind.config`, variables CSS globales, etc.). Antes de generar el código, el agente debe:
1. Localizar el archivo de configuración de estilos/tema actual del proyecto.
2. Extraer los tokens existentes (primario, secundario, acento, fondo, texto, éxito, advertencia, error, bordes).
3. Mapear estos componentes nuevos a esos mismos tokens, en lugar de definir colores nuevos "a ojo".

Como referencia de qué debe cubrir esa paleta (ajustar a los valores reales del proyecto):

| Token | Uso |
|---|---|
| `--color-primary` | Botones principales, enlaces activos, elementos de marca |
| `--color-secondary` | Botones secundarios, elementos de apoyo |
| `--color-accent` | Resaltados, badges, íconos activos |
| `--color-background` | Fondo general de la app |
| `--color-surface` | Fondo de tarjetas/tablas/modales |
| `--color-text` | Texto principal |
| `--color-text-muted` | Texto secundario/placeholder |
| `--color-success` | Confirmaciones (usuario activado, guardado exitoso) |
| `--color-warning` | Alertas (bloqueo por intentos, cambios pendientes) |
| `--color-danger` | Errores, desactivación, eliminación |
| `--color-border` | Bordes de inputs, separadores, tablas |

### 2.3 Lineamientos de diseño moderno
- Diseño mobile-first, con breakpoints claros para tablet y escritorio.
- Tarjetas y tablas con bordes suaves (`border-radius` consistente con el resto del sistema), sombras sutiles y buen espaciado (whitespace generoso, no saturar la pantalla).
- Tipografía jerárquica: un solo tamaño/peso para títulos de sección, otro para subtítulos, otro para texto de tabla.
- Navegación lateral o superior con indicador visual claro de la sección activa (Estudiantes / Profesores / Encargados / Cuentas / Roles / Auditoría).
- Badges de estado con color semántico (activo = éxito, inactivo = neutro/gris, bloqueado = advertencia o error).
- Iconografía consistente (un solo set de íconos en todo el módulo).
- Accesibilidad: contraste AA mínimo, elementos enfocables por teclado, `aria-label` en botones de solo ícono.
- Transiciones/microinteracciones suaves (hover, apertura de modales) sin exagerar la duración (150–250ms).

### 2.4 Prioridad sugerida de implementación
1. CRUD de Estudiantes, Profesores y Encargados (listado + formulario + detalle).
2. Gestión de cuentas (crear, activar/desactivar, cambio y recuperación de contraseña).
3. Roles y permisos.
4. Auditoría (historial de cambios y accesos).
5. Notificaciones y panel resumen (dashboard).
6. Importación/exportación masiva.
