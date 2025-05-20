"use strict";
import User from "../entities/user.entity.js";
import Role from "../entities/role.entity.js";
import Permission from "../entities/permission.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import { normalizeRut, validateRutDv } from "../helpers/rut.helper.js";

async function createPermissions() {
    try {
        const permissionRepository = AppDataSource.getRepository(Permission);

        const count = await permissionRepository.count();
        if (count > 0) return;

        await Promise.all([
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "user:create",
                    descripcion: "Permite crear nuevos usuarios",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "user:read_all",
                    descripcion:
                        "Permite leer información de todos los usuarios",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "user:read_profile",
                    descripcion: "Permite leer el perfil del propio usuario",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "user:read_specific",
                    descripcion:
                        "Permite leer información de un usuario específico (ej. por ID)",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "user:update_all",
                    descripcion:
                        "Permite actualizar información de cualquier usuario",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "user:update_profile",
                    descripcion:
                        "Permite actualizar el perfil del propio usuario",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "user:update_specific",
                    descripcion:
                        "Permite actualizar información de un usuario específico",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "user:delete",
                    descripcion: "Permite eliminar usuarios",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "user:change_status",
                    descripcion: "Permite activar/desactivar usuarios",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "role:create",
                    descripcion: "Permite crear nuevos roles",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "role:read",
                    descripcion:
                        "Permite leer la lista de roles y sus detalles",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "role:update",
                    descripcion:
                        "Permite actualizar roles (nombre, descripción)",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "role:delete",
                    descripcion: "Permite eliminar roles",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "role:assign_permission",
                    descripcion: "Permite asignar/revocar permisos a un rol",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "user:assign_role",
                    descripcion: "Permite asignar/revocar roles a un usuario",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "permission:read",
                    descripcion:
                        "Permite leer la lista de todos los permisos disponibles en el sistema",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "dashboard:view_admin",
                    descripcion:
                        "Permite ver el panel de administración general",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "settings:manage_general",
                    descripcion:
                        "Permite gestionar configuraciones generales del sistema",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "article:create",
                    descripcion: "Permite crear nuevos artículos",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "article:publish",
                    descripcion: "Permite publicar artículos",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "article:read_all",
                    descripcion: "Permite leer todos los artículos",
                }),
            ),
            permissionRepository.save(
                permissionRepository.create({
                    nombre: "article:read_own",
                    descripcion: "Permite leer artículos propios",
                }),
            ),
        ]);
        console.log("* => Permisos creados exitosamente");
    } catch (error) {
        console.error("Error al crear permisos:", error);
    }
}
async function createUsers() {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const count = await userRepository.count();
        if (count > 0) return;

        await Promise.all([
            userRepository.save(
                userRepository.create({
                    nombreCompleto:
                        "nombreUno nombreDos apellidoUno apellidoDos",
                    rut: "12.345.678-9",
                    email: "administrador2024@gmail.cl",
                    password: await encryptPassword("admin1234"),
                    rol: "administrador",
                }),
            ),
            userRepository.save(
                userRepository.create({
                    nombreCompleto: "Juan Pablo Rosas Martin",
                    rut: "20.738.415-1",
                    email: "usuario6.2024@gmail.cl",
                    password: await encryptPassword("user1234"),
                    rol: "usuario",
                }),
            ),
        ]);
        console.log("* => Usuarios creados exitosamente");
    } catch (error) {
        console.error("Error al crear usuarios:", error);
    }
}

export { createUsers };
