# Convención de Mensajes de Commit

Este proyecto sigue la especificación de [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Esto nos ayuda a mantener un historial de commits legible, facilita la generación automática de changelogs y permite que herramientas como `semantic-release` determinen el versionado.

## Formato General

Cada mensaje de commit consiste en un **encabezado**, un **cuerpo** opcional y un **pie** opcional.

## Encabezado

El encabezado es obligatorio y sigue el formato `<tipo>(<ámbito>): <asunto>`.

### `<tipo>`

Debe ser uno de los siguientes:

* **feat**: Una nueva característica para el usuario(corresponde a `MINOR` en versionado semántico).
* **fix**: Una corrección de un bug para el usuario (corresponde a `PATCH` en versionado semántico).
* **docs**: Cambios únicamente en la documentación.
* **style**: Cambios que no afectan el significado del código (espacios en blanco, formato, puntos y comas faltantes, etc.).
* **refactor**: Un cambio de código que no corrige un bug ni añade una característica.
* **perf**: Un cambio de código que mejora el rendimiento.
* **test**: Añadir pruebas faltantes o corregir pruebas existentes.
* **build**: Cambios que afectan el sistema de construcción o dependencias externas (ejemplos: Gulp, Broccoli, npm, Docker).
* **ci**: Cambios en nuestros archivos y scripts de configuración de CI (ejemplos: GitHub Actions, Travis, Circle).
* **chore**: Otros cambios que no modifican el código fuente ni los archivos de prueba (ej: actualización de tareas de build, gestión de paquetes).
* **revert**: Si el commit revierte un commit anterior.

### `<ámbito>` (Scope)

El ámbito proporciona información contextual adicional y **es altamente recomendado para este monorepo**.
Debe ser un sustantivo que describa la sección del código afectada.

Ámbitos sugeridos para este proyecto PERN:

* `repo`: Cambios a nivel de repositorio (ej: `.gitignore`, configuración raíz).
* `backend`: Cambios relacionados con el servidor Node.js/Express, base de datos PostgreSQL, API, etc.
* `frontend`: Cambios relacionados con la aplicación React, componentes, estado, UI/UX.
* `shared`: Cambios en código o tipos compartidos entre frontend y backend (si existe una carpeta/paquete `shared`).
* `docs`: Cambios específicos dentro de la carpeta de documentación o READMEs.
* `ci`: Cambios en la configuración de Integración Continua/Despliegue Continuo.
* `deps`: Actualización de dependencias (puede ir acompañado del ámbito específico, ej: `deps(frontend)`).
* *Si un cambio afecta a múltiples ámbitos, puedes usar una lista separada por comas, ej: `(backend,frontend)` o elegir el más relevante.*

### `<asunto>`

El asunto es una descripción concisa del cambio:

* Usa el imperativo, tiempo presente: "change" no "changed" ni "changes".
* No capitalices la primera letra.
* No pongas punto (.) al final.
* Debe ser lo suficientemente corto como para no superar los 50-72 caracteres (idealmente).

**Ejemplos de Encabezados Válidos:**

* `feat(backend): añadir endpoint para login de usuarios`
* `fix(frontend): corregir renderizado de lista en dashboard`
* `docs(readme): actualizar instrucciones de instalación`
* `refactor(shared): optimizar función de validación de email`
* `style(frontend): aplicar formateo de prettier a componentes`
* `test(backend): añadir pruebas unitarias para servicio de autenticación`
* `build(repo): actualizar versión de Node.js en Dockerfile`
* `ci(github-actions): configurar workflow para despliegue automático`
* `chore(deps): actualizar dependencia de react a v18`

## Cuerpo (Opcional)

El cuerpo se usa para proporcionar información contextual adicional sobre los cambios del código.
Debe ir después de una línea en blanco del asunto.
Usa el imperativo, tiempo presente.
Debe explicar el *qué* y el *por qué* vs. el *cómo*.

## Pie (Opcional)

El pie se usa para dos propósitos principales:

1. **Breaking Changes (Cambios Rompedores):**
    * Cualquier commit que introduzca un cambio que rompa la compatibilidad (un `BREAKING CHANGE`) **DEBE** indicarlo en el pie.
    * Comienza con `BREAKING CHANGE:` seguido de una descripción del cambio, la justificación y las instrucciones de migración.
    * Un `BREAKING CHANGE` puede ser parte de commits de cualquier `tipo`.
    * Si un commit es un `BREAKING CHANGE`, se considera `MAJOR` en versionado semántico.

    ```bash
    BREAKING CHANGE: la API de `user` ahora requiere un token de autenticación.
    Los usuarios deben obtener un token a través del endpoint `/auth/token` antes de
    realizar peticiones a `/users`.
    ```

2. **Referenciar Issues:**
    * Si el commit cierra, arregla o se relaciona con issues de GitHub (o cualquier otro tracker).
    * Palabras clave comunes: `Closes #123`, `Fixes #456`, `Resolves #789`, `Refs #1011`.

    ```bash
    Closes #234
    Refs #112, Refs #120
    ```

## Herramientas

Para facilitar el seguimiento de esta convención, se recomienda usar:

* **Commitizen**: `npm run commit` (o `pnpm commit` / `yarn commit`) para ser guiado en la creación del mensaje.
* **Commitlint**: Verifica automáticamente los mensajes de commit antes de que se completen (usando Husky).

---

Este es el `COMMIT_CONVENTION.md` básico. Asegúrate de añadirlo a tu repositorio y, si es necesario, enlazarlo desde tu `README.md` principal para que los colaboradores (¡incluido tu yo futuro!) puedan encontrarlo fácilmente.

Recuerda ejecutar `npm install` (o `pnpm install` / `yarn install`) después de modificar tu `package.json` para que se instalen las nuevas dependencias y se ejecute el script `prepare` de Husky.
