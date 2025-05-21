// user.routes.js
"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { authorizePermissions } from "../middlewares/authorization.middleware.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  createUser,
} from "../controllers/user.controller.js";

const router = Router();

// 1. Aplicar autenticación a todas las rutas bajo este router.
router.use(authenticateJwt);

// 2. Ruta para obtener todos los usuarios (lista).
//    Idea original: Protegido por isAdmin. Ahora: Protegido por permiso "user:read_all".
router.get(
  "/",
  authorizePermissions(["user:read_all"]),
  getUsers
);

// 3. Rutas para el perfil del PROPIO USUARIO (operan sobre req.user, accedidas vía /detail/ sin ID).
//    Idea original: Protegido por isAdmin (lo cual era demasiado restrictivo si era para el propio usuario).
//    Ahora: Protegido por permisos específicos de perfil.

// GET /api/user/detail/ -> Obtener el perfil del usuario autenticado
router.get(
  "/detail/",
  authorizePermissions(["user:read_profile"]), // Permiso para leer el propio perfil
  (req, res, next) => {
    // Hacemos que el controlador getUser sepa que debe operar sobre el usuario autenticado.
    // Puedes pasar el ID o tener una lógica en getUser para usar req.user si no hay ID.
    req.params.idForController = req.user?.id; // Usamos optional chaining
    return getUser(req, res, next);
  }
);

// PATCH /api/user/detail/ -> Actualizar el perfil del usuario autenticado
router.patch(
  "/detail/",
  authorizePermissions(["user:update_profile"]), // Permiso para actualizar el propio perfil
  (req, res, next) => {
    req.params.idForController = req.user?.id;
    return updateUser(req, res, next);
  }
);

// DELETE /api/user/detail/ -> Eliminar el perfil del PROPIO usuario (si se permite)
// Esta es una adición/interpretación. Tu código original no tenía un delete sin ID.
// Si NO quieres permitir esto, simplemente elimina esta ruta.
// router.delete(
//   "/detail/",
//   authorizePermissions(["user:delete_self"]), // Necesitarías un permiso como "user:delete_self"
//   (req, res, next) => {
//     req.params.idForController = req.user?.id;
//     return deleteUser(req, res, next); // El controlador deleteUser necesitaría manejar esto
//   }
// );


// 4. Rutas para gestionar un USUARIO ESPECÍFICO POR ID (por un administrador o rol con permisos).
//    Idea original: Protegido por isAdmin. Ahora: Protegido por permisos específicos de gestión.
//    Usamos /detail/:id para mantener la estructura, donde :id es el ID del usuario a gestionar.

// GET /api/user/detail/:id -> Obtener un usuario específico por su ID
router.get(
  "/detail/:id", // :id es el ID del usuario que se quiere obtener
  authorizePermissions(["user:read_specific"]),
  getUser
);

// PATCH /api/user/detail/:id -> Actualizar un usuario específico por su ID
router.patch(
  "/detail/:id",
  authorizePermissions(["user:update_specific"]), // O podría ser "user:update_all" para un superadmin
  updateUser
);

// DELETE /api/user/detail/:id -> Eliminar un usuario específico por su ID
router.delete(
  "/detail/:id", // Tu ruta original era /detail/ con ID aquí, pero se llamaba userIdToDelete.
                  // Lo estandarizo a :id, que es lo que el controlador getUser probablemente espera.
  authorizePermissions(["user:delete"]),
  deleteUser
);


// 5. Opcional: Ruta para crear un nuevo usuario (generalmente por un administrador)
// Tu código original no tenía un POST para crear usuarios aquí, pero es común.
router.post(
  "/", // Crear en la raíz de la colección de usuarios
  authorizePermissions(["user:create"]),
  createUser // Necesitarías un controlador createUser
);

export default router;