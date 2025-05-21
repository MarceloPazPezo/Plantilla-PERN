"use strict";
import User from "../entities/user.entity.js";
import Role from "../entities/role.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";

export async function getUserService(query) {
  try {
    const { rut, id, email, telefono } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [
        { id: id },
        { rut: rut },
        { email: email },
        { telefono: telefono },
      ],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const { hashedPassword, ...userData } = userFound;

    return [userData, null];
  } catch (error) {
    console.error("Error obtener el usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getUsersService(queryParams = {}) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const queryBuilder = userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.roles", "role")
      .select([
        "user.id",
        "user.nombres",
        "user.apellidos",
        "user.rut",
        "user.email",
        "user.activo",
        "user.createdAt",
        "user.updatedAt",
        "role.id",
        "role.nombre",
      ])
      .orderBy("user.id", "ASC")
      .addOrderBy("role.id", "ASC");

    const { page = 1, limit = 10 } = queryParams;
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    if (!users || users.length === 0) {
      return [null, "No se encontraron usuarios."];
    }

    const usersSummarized = users.map(user => ({
      nombres: user.nombres,
      apellidos: user.apellidos,
      rut: user.rut,
      email: user.email,
      activo: user.activo,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.roles ? user.roles.map(r => r.nombre) : []
    }));

    return [usersSummarized, null, total];

  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return [null, "Error interno del servidor al obtener usuarios."];
  }
}

export async function updateUserService(query, body) {
  try {
    const { id, rut, email } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ id: id }, { rut: rut }, { email: email }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const existingUser = await userRepository.findOne({
      where: [{ rut: body.rut }, { email: body.email }],
    });

    if (existingUser && existingUser.id !== userFound.id) {
      return [null, "Ya existe un usuario con el mismo rut o email"];
    }

    if (body.password) {
      const matchPassword = await comparePassword(
        body.password,
        userFound.password,
      );

      if (!matchPassword) return [null, "La contraseña no coincide"];
    }

    const dataUserUpdate = {
      nombreCompleto: body.nombreCompleto,
      rut: body.rut,
      email: body.email,
      rol: body.rol,
      updatedAt: new Date(),
    };

    if (body.newPassword && body.newPassword.trim() !== "") {
      dataUserUpdate.password = await encryptPassword(body.newPassword);
    }

    await userRepository.update({ id: userFound.id }, dataUserUpdate);

    const userData = await userRepository.findOne({
      where: { id: userFound.id },
    });

    if (!userData) {
      return [null, "Usuario no encontrado después de actualizar"];
    }

    const { password, ...userUpdated } = userData;

    return [userUpdated, null];
  } catch (error) {
    console.error("Error al modificar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteUserService(query) {
  try {
    const { id, rut, email } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ id: id }, { rut: rut }, { email: email }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    if (userFound.rol === "administrador") {
      return [null, "No se puede eliminar un usuario con rol de administrador"];
    }

    const userDeleted = await userRepository.remove(userFound);

    const { password, ...dataUser } = userDeleted;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al eliminar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createUserService(body) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const roleRepository = AppDataSource.getRepository(Role);

    const existingUser = await userRepository.findOne({
      where: [
        { rut: body.rut },
        { email: body.email },
        { telefono: body.telefono },
      ],
    });

    if (existingUser) {
      return [null, "Ya existe un usuario con el mismo rut o email o telefono"];
    }

    const userRole = await roleRepository.findOneBy({ nombre: "Usuario" });
    if (!userRole) {
      return [null, "Rol de usuario no encontrado"];
    }

    const newUser = userRepository.create({
      nombres: body.nombres,
      apellidos: body.apellidos,
      rut: body.rut,
      fechaNacimiento: body.fechaNacimiento,
      email: body.email,
      telefono: body.telefono,
      roles: [userRole],
      hashedPassword: await encryptPassword(body.password),
      activo: true,
    });

    const savedUser = await userRepository.save(newUser);

    const { hashedPassword, ...userData } = savedUser;

    return [userData, null];
  } catch (error) {
    console.error("Error al crear un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}
