# Convención de Nombres de Ramas

Para mantener nuestro repositorio organizado y facilitar la colaboración, seguimos una convención específica para nombrar las ramas. Esta convención nos ayuda a identificar rápidamente el propósito y el área de trabajo de cada rama.

## Formato General

La estructura general para nombrar una rama de trabajo es:

`<área>/<tipo>/<descripción-corta>`

---

### 1. `<área>` (Obligatorio)

Indica la parte principal del monorepo a la que se refiere la rama. Las áreas definidas son:

* **`backend`**: Para cambios relacionados con el servidor, API, base de datos, lógica de negocio del backend.
* **`frontend`**: Para cambios relacionados con la interfaz de usuario, componentes de React, estado del cliente, etc.
* **`docs`**: Para cambios exclusivos en la documentación del proyecto.
* **`shared`**: Para cambios en código, tipos o utilidades compartidas entre el `backend` y el `frontend` (si existe un paquete/carpeta dedicada).
* **`repo`**: Para cambios que afectan la configuración general del repositorio, CI/CD, herramientas de desarrollo globales, scripts raíz, etc., y no son específicos de un área funcional.

---

### 2. `<tipo>` (Obligatorio)

Describe el propósito de la rama, similar a los tipos de [Conventional Commits](https://www.conventionalcommits.org/). Los tipos principales son:

* **`feat`** (o `feature`): Desarrollo de una nueva funcionalidad.
* **`fix`** (o `bugfix`): Corrección de un error/bug.
* **`refactor`**: Refactorización de código existente sin cambiar su comportamiento externo.
* **`style`**: Cambios relacionados con el formato del código, linters, y que no afectan la lógica.
* **`test`**: Adición o mejora de pruebas (unitarias, integración, e2e).
* **`chore`**: Tareas de mantenimiento, actualización de dependencias, configuración de herramientas, etc.
* **`perf`**: Mejoras de rendimiento.
* **`hotfix`**: (Opcional, usar con precaución) Correcciones críticas urgentes directamente desde `main`.

---

### 3. `<descripción-corta>` (Obligatorio)

Un resumen conciso del trabajo realizado en la rama.

* Utiliza **guiones (`-`)** para separar palabras (kebab-case).
* Debe ser descriptivo pero breve.
* Evita caracteres especiales (aparte de guiones).
* Opcionalmente, puede incluir un número de issue al final (ej. `login-form-validation-123`).

---

## Ejemplos de Nombres de Ramas

* `backend/feat/add-user-authentication`
* `backend/fix/resolve-product-query-bug-45`
* `backend/chore/update-express-dependency`
* `frontend/feat/implement-new-dashboard-layout`
* `frontend/refactor/optimize-state-management`
* `frontend/style/apply-prettier-to-components`
* `docs/feat/add-api-reference-guide`
* `docs/fix/correct-typos-in-installation-md`
* `shared/feat/create-common-validation-utils`
* `repo/feat/setup-github-actions-for-ci`
* `repo/fix/update-husky-hook-scripts`

---

## Ramas Principales del Flujo de Trabajo

Mantenemos las siguientes ramas principales:

* **`main`**:
  * Contiene el código de producción más reciente y estable.
  * Todo el código en `main` debe ser desplegable.
  * Las fusiones a `main` se realizan exclusivamente desde `develop` (para releases) o ramas `hotfix` (para correcciones urgentes), siempre mediante Pull Requests.
  * Los commits en `main` deben ser etiquetados con versiones (ej. `v1.0.0`, `v1.1.0`).

* **`develop`**:
  * Rama principal de desarrollo e integración.
  * Todas las ramas de `feat`, `fix`, `refactor`, etc., se fusionan aquí mediante Pull Requests.
  * Debe mantenerse lo más estable posible, pero es donde se integran los cambios en curso.
  * Periódicamente, el estado de `develop` se fusiona en `main` para crear una nueva release.

---

## Flujo de Creación de Ramas

1. Asegúrate de que tu rama `develop` local esté actualizada:

    ```bash
    git checkout develop
    git pull origin develop
    ```

2. Crea tu nueva rama de trabajo desde `develop` usando la convención:

    ```bash
    git checkout -b <área>/<tipo>/<descripción-corta>
    # Ejemplo:
    # git checkout -b frontend/feat/create-user-profile-page
    ```

3. Realiza tu trabajo y haz commits siguiendo la [Convención de Commits](./COMMIT_CONVENTION.md) (enlaza a tu archivo de convención de commits si lo tienes).
4. Una vez completado, sube tu rama al repositorio remoto y abre un Pull Request para fusionarla de nuevo en `develop`.

---

Esta convención nos ayuda a mantener un historial claro y un proceso de desarrollo más organizado. ¡Gracias por seguirla!
