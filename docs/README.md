# Intranet Escolar

Prototipo base de una intranet para una institución educativa pública. El proyecto busca ofrecer un punto interno de acceso para **administración, docentes, estudiantes y familias**, con módulos de usuarios, información académica y comunicados.

## Estado actual

Esta primera versión contiene la estructura inicial en **HTML, CSS y JavaScript**, además de la documentación Markdown requerida para que el equipo pueda continuar el desarrollo de forma organizada.

### Incluido en esta base

- [x] Página principal.
- [x] Maqueta de inicio de sesión por rol.
- [x] Panel principal con módulos visibles según rol.
- [x] Estructura de estilos accesible y adaptable.
- [x] Archivos Markdown iniciales.
- [ ] CRUD de usuarios.
- [x] Registro y consulta de calificaciones.
- [ ] Gestión completa de comunicados.

---

## Estructura del proyecto

```text
intranet-escolar-base/
├── index.html
├── dashboard.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   └── dashboard.js
├── assets/
│   └── img/
└── docs/
    ├── arquitectura.md
    ├── requerimientos.md
    ├── README.md
    ├── CONTRIBUTING.md
    ├── CHANGELOG.md
    └── AGENTS.md
```

## Ejecución

No requiere instalación en esta etapa.

1. Clonar o descargar el repositorio.
2. Abrir `index.html` en el navegador.
3. Ingresar un nombre de usuario cualquiera.
4. Seleccionar un rol.
5. Acceder al panel de demostración.

> **Importante:** el inicio de sesión actual es solo una maqueta del frontend. No debe utilizarse como autenticación real.

## Ejemplo de uso

Un docente puede ingresar con el rol **Docente** y visualizar los módulos académico y de comunicados. Administración también puede visualizar la futura gestión de usuarios.

## Próximos pasos

1. Definir el backend y la base de datos.
2. Implementar autenticación segura por roles.
3. Desarrollar la gestión de usuarios.
4. Implementar el módulo de calificaciones.
5. Implementar el tablón de comunicados.
6. Integrar y probar los módulos.

## Licencia

Proyecto académico. El equipo puede definir posteriormente la licencia que utilizará en el repositorio final.
