# Arquitectura de la Intranet Escolar

## Objetivo

Definir la base técnica y flujo de comunicación integrada de los diferentes módulos del sistema (Acceso, Dashboard, Usuarios, Académico y Comunicados) utilizando un almacén de datos común en el navegador.

## Stack actual de la intranet

| Capa | Tecnología actual | Estado |
|---|---|---|
| Interfaz | HTML5 (Semántico, accesible) | Integrada |
| Estilos | CSS3 (Sistema de diseño en `login.css` e `index.css`) | Integrada |
| Lógica cliente | JavaScript (ES6 moderno) | Integrada |
| Persistencia | `localStorage` y `sessionStorage` compartidos | Integrada |
| Seguridad | Token de sesión con expiración + limitación de intentos | Integrada |

## Estructura de archivos

```text
/
├── pages/
│   ├── login.html        (Pantalla de acceso segura)
│   ├── dashboard.html    (Panel general de módulos)
│   ├── usuarios.html     (Gestión y administración)
│   ├── academico.html    (Registro de calificaciones)
│   └── comunicados.html  (Tablón de avisos oficiales)
├── src/
│   ├── js/
│   │   ├── login.js
│   │   ├── dashboard.js
│   │   ├── usuarios.js
│   │   ├── academico.js
│   │   └── comunicados.js
│   └── styles/
│       ├── login.css     (Tokens de colores base del sistema)
│       ├── index.css     (Alias de estilos compartidos)
│       ├── usuarios.css
│       └── comunicados.css
└── docs/
```

## Flujo general del sistema

1. **Pantalla de Acceso (`login.html`)**:
   - El usuario introduce credenciales.
   - `login.js` consulta `localStorage['intranetUsers']`.
   - Si las credenciales coinciden y el usuario no está inactivo o bloqueado, se crea un objeto de sesión con una expiración de 2 horas en `localStorage` (si seleccionó "Recordarme") o `sessionStorage`.
   - Se escribe un registro en la bitácora de accesos.
   - Redirige a `dashboard.html`.

2. **Panel de Control (`dashboard.html`)**:
   - `dashboard.js` verifica la validez y expiración de la sesión.
   - Si la sesión expiró o no existe, redirige automáticamente a `login.html`.
   - Filtra y oculta los accesos a módulos de la interfaz basándose en el rol real del usuario (`administracion`, `docente`, `estudiante`).

3. **Módulo de Usuarios (`usuarios.html`)**:
   - Permite administrar el origen de datos de todas las cuentas.
   - Permite al Administrador ver la bitácora de accesos y cambios en tiempo real, desbloquear cuentas con excesos de intentos fallidos y definir permisos por rol.

4. **Módulo Académico (`academico.html`)**:
   - Permite a docentes y administradores ingresar calificaciones persistidas en `intranetAcademicGrades`.
   - Muestra resúmenes y calificaciones específicas.

## Flujo de datos y persistencia

El estado global de la aplicación se centraliza en el almacenamiento web local usando las siguientes llaves:

- `intranetUsers`: Base de datos de perfiles y cuentas de acceso.
- `intranetSession`: Token de sesión activa con indicador de expiración.
- `intranetAccessLogs`: Historial de intentos de inicio de sesión para auditoría.
- `intranetChangeLogs`: Historial de acciones administrativas.
- `intranetSystemAlerts`: Mensajes de alerta del sistema y notificaciones.
- `intranetAcademicGrades`: Calificaciones y observaciones académicas registradas.
