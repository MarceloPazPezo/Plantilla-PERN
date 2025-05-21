"use strict";
import User from "../entities/user.entity.js";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

export async function loginService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { rut, password } = user;
    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message,
    });

    const userFound = await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.roles", "role")
      .leftJoinAndSelect("role.permisos", "permission")
      .select([
        "user.id",
        "user.nombres",
        "user.apellidos",
        "user.email",
        "user.rut",
        "user.activo",
        "user.hashedPassword",
        "role.id",
        "role.nombre",
        "permission.nombre",
      ])
      .where("user.rut = :rut", { rut: rut })
      .getOne();

    if (!userFound) {
      return [null, createErrorMessage("rut", "El rut es incorrecto")];
    }

    if (!userFound.activo) {
      return [null, createErrorMessage("estado", "La cuenta de usuario está inactiva. Por favor, contacta al administrador.")];
    }

    const isMatch = await comparePassword(password, userFound.hashedPassword);

    if (!isMatch) {
      return [
        null,
        createErrorMessage("password", "La contraseña es incorrecta"),
      ];
    }

    const payload = {
      id: userFound.id,
      nombres: userFound.nombres,
      email: userFound.email,
      rut: userFound.rut,
      roles: userFound.roles.map((r) => ({
        nombre: r.nombre,
        permisos: r.permisos ? r.permisos.map((p) => p.nombre) : [],
      })),
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return [accessToken, null];
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function registerService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const { nombreCompleto, rut, email } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message,
    });

    const existingEmailUser = await userRepository.findOne({
      where: {
        email,
      },
    });

    if (existingEmailUser)
      return [null, createErrorMessage("email", "Correo electrónico en uso")];

    const existingRutUser = await userRepository.findOne({
      where: {
        rut,
      },
    });

    if (existingRutUser)
      return [null, createErrorMessage("rut", "Rut ya asociado a una cuenta")];

    const newUser = userRepository.create({
      nombreCompleto,
      email,
      rut,
      password: await encryptPassword(user.password),
      rol: "usuario",
    });

    await userRepository.save(newUser);

    const { password, ...dataUser } = newUser;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al registrar un usuario", error);
    return [null, "Error interno del servidor"];
  }
}
