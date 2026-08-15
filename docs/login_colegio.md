# Módulo: Login — Intranet Escolar

## 1. Alcance
Pantalla de acceso por rol (Administración / Docente / Estudiante-Familia) para la intranet de una institución educativa pública. **No incluye registro público**: las cuentas las crea únicamente el administrador desde el módulo de Gestión de Usuarios (ver `gestion_de_usuarios.md`, sección "Cuentas"). El login solo autentica contra usuarios ya existentes en ese módulo.

## 2. Paleta de colores (tomada del proyecto actual)
Extraída de `login.css`. El agente debe reutilizar estas mismas variables — no crear colores nuevos — tanto aquí como en el resto de módulos (incluyendo Gestión de Usuarios).

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#F4EFE7` | Fondo general |
| `--surface` | `#ffffff` | Tarjetas, formulario, header, footer |
| `--text` | `#2B2117` | Texto principal |
| `--muted` | `#7996A7` | Texto secundario, botón secundario |
| `--border` | `#E3D3B9` | Bordes de inputs y tarjetas |
| `--primary` | `#D54E1A` | Botón principal, eyebrow, énfasis |
| `--primary-dark` | `#A83B13` | Hover del botón, mensajes de error |
| `--focus` | `#1F1B16` | Anillo de foco (accesibilidad) |
| `--radius` | `14px` | Border-radius de tarjetas (10px en inputs/botones) |
| `--shadow` | `0 10px 30px rgba(31,27,22,.08)` | Sombra de tarjetas |

Tipografía actual: `Arial, Helvetica, sans-serif`. Mantenerla salvo que el equipo defina una tipografía de marca.

## 3. Estado actual (lo que ya existe en el prototipo)
- Formulario con usuario, contraseña, selección de rol y botón "Entrar".
- Mensaje de estado con `aria-live="polite"`.
- Validación básica de campos vacíos.
- Guarda una "sesión" simulada en `localStorage` y redirige a `dashboard.html`.

## 4. Correcciones necesarias antes de continuar
- **Quitar la validación de contraseña fija en el JS** (`password !== 'admin123'`). Hoy cualquiera puede leer la contraseña abriendo el archivo. La validación debe hacerse contra el backend/API que gestiona los usuarios (mismo origen de datos que Gestión de Usuarios), nunca en el cliente.
- No guardar la sesión como JSON plano sin expiración en `localStorage`. Usar un token de sesión (ej. JWT) con expiración, o al menos limitar qué datos se guardan (nunca la contraseña).

## 5. Funciones que debe tener el login (ampliación)

```text
LOGIN
│
├── Autenticación
│   ├── Usuario/correo + contraseña
│   ├── Selección o detección automática de rol
│   ├── Mostrar / ocultar contraseña (ícono de ojo)
│   ├── Estado de carga en el botón mientras valida
│   └── Redirección post-login según rol (dashboard admin / docente / estudiante-familia)
│
├── Manejo de errores (mensajes distintos y claros)
│   ├── Usuario o contraseña incorrectos
│   ├── Cuenta desactivada (creada por admin pero inactiva)
│   ├── Cuenta bloqueada por intentos fallidos
│   └── Error de conexión con el servidor
│
├── Seguridad
│   ├── Límite de intentos fallidos + bloqueo temporal
│   ├── Validación real contra el backend (no hardcodeada)
│   ├── Contraseñas hasheadas del lado del servidor
│   └── Verificación en dos pasos (2FA) — al menos para rol Administración
│
├── Recuperación de acceso
│   ├── "¿Olvidó su contraseña?" → flujo de recuperación por correo
│   └── Contacto de soporte técnico del centro educativo
│
├── Sesión
│   ├── "Recordarme" (sesión persistente opcional)
│   ├── Expiración automática de sesión inactiva
│   └── Cierre de sesión
│
└── Accesibilidad y UX
    ├── Foco visible en todos los campos (ya implementado con --focus)
    ├── Mensajes de error asociados al campo (no solo al final del formulario)
    ├── Textos suficientemente descriptivos para lector de pantalla
    └── Responsive (ya implementado con el layout actual)
```

## 6. Conexión con Gestión de Usuarios
El login **no es independiente**: debe autenticar contra los mismos usuarios y estados definidos en el módulo de Gestión de Usuarios.

- **Origen de datos único**: el login consulta la misma base/API de usuarios donde Administración registra Estudiantes, Profesores y Encargados (sección "Cuentas" de `gestion_de_usuarios.md`).
- **Estados sincronizados**: si un usuario es desactivado desde Gestión de Usuarios, el login debe rechazar el acceso con el mensaje de "cuenta desactivada", no con "usuario o contraseña incorrectos".
- **Bloqueo por intentos fallidos**: el login incrementa el contador de intentos fallidos del usuario; Gestión de Usuarios debe poder ver ese estado y desbloquear manualmente desde el listado de Cuentas.
- **Auditoría compartida**: cada intento de login (exitoso o fallido) debe registrarse en la sección "Auditoría → Registro de accesos" de Gestión de Usuarios (usuario, fecha/hora, IP, resultado).
- **Rol como fuente de verdad**: el rol que determina a qué dashboard se redirige después del login debe venir del registro del usuario en Gestión de Usuarios, no de lo que el usuario seleccione libremente en el formulario (el selector de rol puede quedar como ayuda visual, pero el backend valida el rol real).
- **Sin auto-registro**: el login no debe ofrecer "crear cuenta"; toda cuenta nueva se crea exclusivamente desde Gestión de Usuarios → Cuentas → Crear cuenta.

## 7. Indicaciones de diseño para el agente
- Mantener el layout de dos columnas del `login-layout` actual (texto introductorio + tarjeta de formulario) y colapsar a una columna en móvil, tal como ya está en el CSS.
- Reutilizar las clases existentes (`.card`, `.button`, `.form-card`, `.form-message`) y extenderlas en vez de crear un sistema paralelo.
- Nuevos elementos (toggle de mostrar contraseña, checkbox "Recordarme", enlace de recuperación) deben respetar el mismo `--radius`, `--border` y espaciado que ya usan los inputs actuales.
- Los mensajes de error deben usar `--primary-dark` (como ya hace `.form-message`) y los de éxito un verde que se agregue como nuevo token (`--success`) coherente con el resto de la paleta cálida (ej. un verde tierra, no un verde saturado tipo semáforo).
- El botón principal mantiene `--primary` con hover `--primary-dark`; el botón "Recordarme"/enlaces secundarios usan `--muted`, igual que `.button-secondary`.
