"use strict";
import User from "../entities/user.entity.js";
import Role from "../entities/role.entity.js";
import Permission from "../entities/permission.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import { In } from "typeorm";

async function createPermissions() {
  try {
    const permissionRepository = AppDataSource.getRepository(Permission);
    const count = await permissionRepository.count();
    if (count > 0) {
      console.log("* => Permisos ya existen, omitiendo creación.");
      return;
    }

    const permissionsData = [
      { nombre: "user:create", descripcion: "Permite crear nuevos usuarios" },
      { nombre: "user:read_all", descripcion: "Permite leer información de todos los usuarios" },
      { nombre: "user:read_profile", descripcion: "Permite leer el perfil del propio usuario" },
      { nombre: "user:read_specific", descripcion: "Permite leer información de un usuario especifico (ej. por ID)" },
      { nombre: "user:update_all", descripcion: "Permite actualizar información de cualquier usuario" },
      { nombre: "user:update_profile", descripcion: "Permite actualizar el perfil del propio usuario" },
      { nombre: "user:update_specific", descripcion: "Permite actualizar información de un usuario especifico" },
      { nombre: "user:delete", descripcion: "Permite eliminar usuarios" },
      { nombre: "user:change_status", descripcion: "Permite activar/desactivar usuarios" },
      { nombre: "user:assign_role", descripcion: "Permite asignar/revocar roles a un usuario" },
      { nombre: "role:create", descripcion: "Permite crear nuevos roles" },
      { nombre: "role:read", descripcion: "Permite leer la lista de roles y sus detalles" },
      { nombre: "role:update", descripcion: "Permite actualizar roles (nombre, descripción)" },
      { nombre: "role:delete", descripcion: "Permite eliminar roles" },
      { nombre: "role:assign_permission", descripcion: "Permite asignar/revocar permisos a un rol" },
      { nombre: "permission:read", descripcion: "Permite leer la lista de todos los permisos disponibles en el sistema" },
      // { nombre: "dashboard:view_admin", descripcion: "Permite ver el panel de administración general" },
      // { nombre: "settings:manage_general", descripcion: "Permite gestionar configuraciones generales del sistema" },
    ];

    const permissions = permissionsData.map(p => permissionRepository.create(p));
    await permissionRepository.save(permissions);
    console.log("* => Permisos creados exitosamente");
  } catch (error) {
    console.error("Error al crear permisos:", error);
    throw error;
  }
}

async function createRoles() {
  try {
    const roleRepository = AppDataSource.getRepository(Role);
    const permissionRepository = AppDataSource.getRepository(Permission);

    const count = await roleRepository.count();
    if (count > 0) {
      console.log("* => Roles ya existen, omitiendo creación.");
      return;
    }

    const rolesData = [
      {
        nombre: "Usuario",
        descripcion: "Rol básico para usuarios con perfil.",
        permissionNames: [
          "user:read_profile", "user:update_profile"
        ],
      },
      {
        nombre: "Supervisor",
        descripcion: "Rol intermedio con permisos limitados.",
        permissionNames: [
          "user:read_all", "user:change_status",
          "role:read", "role:update", "permission:read"
        ]
      },
      {
        nombre: "Administrador",
        descripcion: "Rol con acceso total al sistema.",
        permissionNames: [
          "user:create", "user:read_all", "user:read_specific",
          "user:update_all", "user:update_specific", "user:delete",
          "user:change_status", "role:create", "role:read", "role:update", "role:delete",
          "role:assign_permission", "user:assign_role", "permission:read"
        ],
      },
    ];

    const allNeededPermissionNames = [...new Set(rolesData.flatMap(r => r.permissionNames))];
    const existingPermissions = await permissionRepository.findBy({ nombre: In(allNeededPermissionNames) });
    
    if (existingPermissions.length !== allNeededPermissionNames.length) {
        const foundNames = existingPermissions.map(p => p.nombre);
        const missingNames = allNeededPermissionNames.filter(name => !foundNames.includes(name));
        console.error(`Error: Faltan los siguientes permisos en la BD: ${missingNames.join(', ')}. Asegúrate de que createPermissions se ejecutó correctamente.`);
        return;
    }

    const permissionsMap = new Map(existingPermissions.map(p => [p.nombre, p]));

    const rolesToSave = rolesData.map(roleDef => {
      const permissionsForRole = roleDef.permissionNames.map(name => permissionsMap.get(name)).filter(p => p); // Filter out undefined if any mistake
      return roleRepository.create({
        nombre: roleDef.nombre,
        descripcion: roleDef.descripcion,
        permisos: permissionsForRole,
      });
    });

    await roleRepository.save(rolesToSave);
    console.log("* => Roles creados exitosamente");
  } catch (error) {
    console.error("Error al crear roles:", error);
    throw error;
  }
}

async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const roleRepository = AppDataSource.getRepository(Role);

    const count = await userRepository.count();
    if (count > 0) {
      console.log("* => Usuarios ya existen, omitiendo creación.");
      return;
    }

    const adminRole = await roleRepository.findOneBy({ nombre: "Administrador" });
    const supervisorRole = await roleRepository.findOneBy({ nombre: "Supervisor" });
    const userRole = await roleRepository.findOneBy({ nombre: "Usuario" });

    if (!adminRole || !supervisorRole || !userRole) {
      console.error("Error: No se encontraron todos los roles necesarios (Administrador, Supervisor, Usuario). Asegúrate de que createRoles se ejecutó correctamente.");
      return;
    }

    const usersData = [
      {
        nombres: ["Admin", "Principal"],
        apellidos: ["Del Sistema"],
        rut: "1234567-4",
        fechaNacimiento: new Date("1980-01-01"),
        email: "admin@example.com",
        telefono: "123456789",
        hashedPassword: await encryptPassword("user1234"),
        activo: true,
        roles: [adminRole, userRole],
      },
      {
        nombres: ["Juan", "Andrés"],
        apellidos: ["Pérez", "Gómez"],
        rut: "12345678-5",
        fechaNacimiento: new Date("1990-05-15"),
        email: "editor.juan@example.com",
        telefono: "987654321",
        hashedPassword: await encryptPassword("user1234"),
        activo: true,
        roles: [supervisorRole, userRole],
      },
      {
        nombres: ["Ana", "Lucia"],
        apellidos: ["López", "Diaz"],
        rut: "18765432-7",
        fechaNacimiento: new Date("1995-10-20"),
        email: "ana.lopez@example.com",
        telefono: "112233445",
        hashedPassword: await encryptPassword("user1234"),
        activo: false,
        roles: [userRole],
      },
    ];

    const users = usersData.map(userData => userRepository.create(userData));
    await userRepository.save(users);
    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
    throw error;
  }
}


export { createPermissions, createRoles, createUsers };