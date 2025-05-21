"use strict";
import Joi from "joi";
import { normalizeRut, validateRutDv } from '../helpers/rut.helper.js';

const domainEmailValidator = (value, helper) => {
  if (!value.endsWith("@example.cl") && !value.endsWith("@gmail.com")) {
    return helper.message(
      "El correo electrónico debe ser de un dominio permitido (ej. @example.cl, @gmail.com)"
    );
  }
  return value;
};

const normalizedRutPattern = /^\d{7,8}[\dkK]$/;
const joiRutValidator = (value, helpers) => {
  const normalized = normalizeRut(value);
  if (!normalized) return helpers.error("string.rut.invalidFormat", { value });
  if (!normalizedRutPattern.test(normalized)) return helpers.error("string.rut.invalidNormalizedFormat", { value: normalized });
  if (!validateRutDv(normalized)) return helpers.error("string.rut.invalidDv", { value: normalized });
  return normalized;
};

const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/;

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{8,}$/;


export const loginValidation = Joi.object({
  rut: Joi.string()
    .custom(joiRutValidator, "Validación completa de RUT para login")
    .required()
    .messages({
      "string.base": "El RUT debe ser de tipo string.",
      "any.required": "El RUT es obligatorio para iniciar sesión.",
      "string.rut.invalidFormat": "El formato inicial del RUT es inválido o no pudo ser procesado.",
      "string.rut.invalidNormalizedFormat": "El RUT normalizado no cumple el formato esperado (ej: XXXXXXXXK).",
      "string.rut.invalidDv": "El dígito verificador del RUT es incorrecto."
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "any.required": "La contraseña es obligatoria.",
      "string.base": "La contraseña debe ser de tipo texto.",
      "string.min": "La contraseña debe tener al menos {#limit} caracteres.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales en el inicio de sesión.",
  });

export const registerValidation = Joi.object({
  nombres: Joi.array()
    .items(
      Joi.string()
        .min(2)
        .max(50)
        .pattern(namePattern)
        .messages({
          "string.base": "Cada nombre debe ser de tipo string.",
          "string.empty": "Un nombre no puede estar vacío.",
          "string.min": "Un nombre debe tener como mínimo {#limit} caracteres.",
          "string.max": "Un nombre debe tener como máximo {#limit} caracteres.",
          "string.pattern.base": "Un nombre solo puede contener letras, espacios, apóstrofes o guiones.",
        })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "El campo 'nombres' debe ser un array.",
      "array.min": "Debes proporcionar al menos un nombre.",
      "any.required": "El campo 'nombres' es obligatorio.",
    }),
  apellidos: Joi.array()
    .items(
      Joi.string()
        .min(2)
        .max(50)
        .pattern(namePattern)
        .messages({
          "string.base": "Cada apellido debe ser de tipo string.",
          "string.empty": "Un apellido no puede estar vacío.",
          "string.min": "Un apellido debe tener como mínimo {#limit} caracteres.",
          "string.max": "Un apellido debe tener como máximo {#limit} caracteres.",
          "string.pattern.base": "Un apellido solo puede contener letras, espacios, apóstrofes o guiones.",
        })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "El campo 'apellidos' debe ser un array.",
      "array.min": "Debes proporcionar al menos un apellido.",
      "any.required": "El campo 'apellidos' es obligatorio.",
    }),
  rut: Joi.string()
    .custom(joiRutValidator, "Validación completa de RUT para registro")
    .required()
    .messages({
      "string.base": "El RUT debe ser de tipo string.",
      "any.required": "El RUT es obligatorio.",
      "string.rut.invalidFormat": "El formato inicial del RUT es inválido o no pudo ser procesado.",
      "string.rut.invalidNormalizedFormat": "El RUT normalizado no cumple el formato esperado (ej: XXXXXXXXK).",
      "string.rut.invalidDv": "El dígito verificador del RUT es incorrecto."
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .min(5)
    .max(255)
    .custom(domainEmailValidator, "Validación de dominio de correo electrónico") // Descomentar si es necesario
    .required()
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "any.required": "El correo electrónico es obligatorio.",
      "string.base": "El correo electrónico debe ser de tipo texto.",
      "string.email": "El formato del correo electrónico es inválido.",
      "string.min": "El correo electrónico debe tener al menos {#limit} caracteres.",
      "string.max": "El correo electrónico debe tener como máximo {#limit} caracteres.",
    }),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(passwordPattern)
    .required()
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "any.required": "La contraseña es obligatoria.",
      "string.base": "La contraseña debe ser de tipo texto.",
      "string.min": "La contraseña debe tener al menos {#limit} caracteres.",
      "string.max": "La contraseña debe tener como máximo {#limit} caracteres.",
      "string.pattern.base": "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y puede contener símbolos permitidos (!@#$ etc.).",
    }),
  fechaNacimiento: Joi.date()
    .iso()
    .less('now')
    .optional()
    .messages({
      "date.base": "La fecha de nacimiento debe ser una fecha válida.",
      "date.iso": "La fecha de nacimiento debe estar en formato ISO 8601 (YYYY-MM-DD).",
      "date.less": "La fecha de nacimiento no puede ser futura.",
    }),
  telefono: Joi.string()
  .pattern(/^\+?[0-9\s-()]{7,20}$/)
  .optional()
  .allow(null, '')
  .messages({
    "string.base": "El teléfono debe ser de tipo string.",
    "string.empty": "El teléfono no puede estar vacío.",
    "string.pattern.base": "El teléfono no tiene un formato válido. Debe contener solo números, espacios, paréntesis y guiones.",
    "string.max": "El teléfono debe tener como máximo {#limit} caracteres.",
  }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales en el registro.",
  });