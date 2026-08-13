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
<<<<<<<<< Temporary merge branch 1
- [ ] CRUD de usuarios.
- [x] Registro y consulta de calificaciones.
- [ ] Gestión completa de comunicados.
=========
- [x] CRUD de usuarios.
- [x] Registro y consulta de calificaciones.
- [x] Gestión completa de comunicados.
>>>>>>>>> Temporary merge branch 2

---

## Estructura del proyecto

```text
intranet-escolar-base/
├── docs/
│   ├── AGENTS.md
│   ├── CHANGELOG.md
│   ├── CONTRIBUTING.md
│   ├── README.md
│   ├── arquitectura.md
│   ├── gestion_de_usuarios.md
│   └── requerimientos.md
├── pages/
│   ├── academico.html
│   ├── dashboard.html
│   ├── index.html
│   └── usuarios.html
└── src/
    ├── js/
    │   ├── academico.js
    │   ├── dashboard.js
    │   ├── index.js
    │   └── usuarios.js
    └── styles/
        ├── index.css
        └── usuarios.css
```

## Ejecución

No requiere instalación en esta etapa.

1. Clonar o descargar el repositorio.
2. Abrir `index.html` en el navegador.
3. Ingresar un nombre de usuario cualquiera.
4. Seleccionar un rol.
5. Acceder al panel de demostración.


## Ejemplo de uso

Un docente puede ingresar con el rol **Docente** y visualizar los módulos académico y de comunicados. Administración también puede visualizar la futura gestión de usuarios.

## Próximos pasos

1. Implementar autenticación segura por roles.
2. Desarrollar la gestión de usuarios.
3. Implementar el módulo de calificaciones.
4. Implementar el tablón de comunicados.
5. Integrar y probar los módulos.

## Licencia

Proyecto académico. El equipo puede definir posteriormente la licencia que utilizará en el repositorio final.
