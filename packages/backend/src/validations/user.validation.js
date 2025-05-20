"use strict";
import Joi from "joi";

const domainEmailValidator = (value, helper) => {
  if (!value.endsWith("@gmail.com")) {
    return helper.message(
      "El correo electrónico debe ser del dominio @gmail.com"
    );
  }
  return value;
};

export const createUserValidation = Joi.object({
  nombres: Joi.array()
    .items(
      Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑàèìòùÀÈÌÒÙ\s']+$/)
        .messages({
          "string.base": "Cada nombre de pila debe ser de tipo string.",
          "string.empty": "El nombre de pila no puede estar vacío.",
          "string.min": "Cada nombre de pila debe tener como mínimo {#limit} caracteres.",
          "string.max": "Cada nombre de pila debe tener como máximo {#limit} caracteres.",
          "string.pattern.base": "Cada nombre de pila solo puede contener letras, espacios y apóstrofes.",
        })
    )
    .min(1)
    .max(3)
    .required()
    .messages({
      "array.base": "Los nombres de pila deben ser un arreglo.",
      "array.min": "Debes proporcionar al menos {#limit} nombre de pila.",
      "array.max": "Puedes proporcionar como máximo {#limit} nombres de pila.",
      "any.required": "Los nombres de pila son requeridos.",
    }),

  apellidos: Joi.array()
    .items(
      Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑàèìòùÀÈÌÒÙ\s']+$/)
        .messages({
          "string.base": "Cada apellido debe ser de tipo string.",
          "string.empty": "El apellido no puede estar vacío.",
          "string.min": "Cada apellido debe tener como mínimo {#limit} caracteres.",
          "string.max": "Cada apellido debe tener como máximo {#limit} caracteres.",
          "string.pattern.base": "Cada apellido solo puede contener letras, espacios y apóstrofes.",
        })
    )
    .min(1)
    .max(2)
    .required()
    .messages({
      "array.base": "Los apellidos deben ser un arreglo.",
      "array.min": "Debes proporcionar al menos {#limit} apellido.",
      "array.max": "Puedes proporcionar como máximo {#limit} apellidos.",
      "any.required": "Los apellidos son requeridos.",
    }),

  rut: Joi.string()
    .min(9)
    .max(12)
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .required()
    .messages({
      "string.empty": "El rut no puede estar vacío.",
      "string.base": "El rut debe ser de tipo string.",
      "string.min": "El rut debe tener como mínimo {#limit} caracteres.",
      "string.max": "El rut debe tener como máximo {#limit} caracteres.",
      "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
      "any.required": "El rut es requerido.",
    }),

  email: Joi.string()
    .min(10) // Ajustado para ser más realista con el dominio
    .max(255) // Longitud estándar para emails
    .email({ tlds: { allow: false } }) // Valida formato email, tlds:false para no requerir TLD específico si tu validador custom lo cubre
    .custom(domainEmailValidator, "Validación dominio email")
    .required()
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "string.base": "El correo electrónico debe ser de tipo string.",
      "string.email": "El formato del correo electrónico es inválido.", // Mensaje genérico para .email()
      "string.min": "El correo electrónico debe tener como mínimo {#limit} caracteres.",
      "string.max": "El correo electrónico debe tener como máximo {#limit} caracteres.",
      "any.required": "El correo electrónico es requerido.",
    }),

  password: Joi.string()
    .min(8)
    .max(100) // Para contraseñas, es mejor no limitar tanto el máximo. El hash tendrá longitud fija.
    // .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) // Ejemplo de patrón más seguro
    .pattern(/^[a-zA-Z0-9@$!%*?&]+$/) // Un patrón un poco más flexible que solo alfanumérico
    .required()
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "string.base": "La contraseña debe ser de tipo string.",
      "string.min": "La contraseña debe tener como mínimo {#limit} caracteres.",
      "string.max": "La contraseña debe tener como máximo {#limit} caracteres.",
      "string.pattern.base": "La contraseña contiene caracteres no permitidos o no cumple con los requisitos de complejidad.",
      "any.required": "La contraseña es requerida.",
    }),

  rol: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "El rol no puede estar vacío.",
      "string.base": "El rol debe ser de tipo string.",
      "string.min": "El rol debe tener como mínimo {#limit} caracteres.",
      "string.max": "El rol debe tener como máximo {#limit} caracteres.",
      "any.required": "El rol es requerido.",
    }),

  activo: Joi.boolean() // Añadido campo activo, opcional en la creación (podría tener un default)
    .optional()
    .messages({
        "boolean.base": "El campo activo debe ser un valor booleano (true/false)."
    })

})
.unknown(false) // No permitir propiedades adicionales
.messages({
  "object.unknown": "No se permiten propiedades adicionales en la solicitud.",
});


// Esquema para la actualización de un usuario (donde los campos son opcionales)
// (Este es una adaptación de tu userBodyValidation original)
export const updateUserValidation = Joi.object({
  nombresPila: Joi.array()
    .items(
      Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s']+$/)
        .messages({
          "string.base": "Cada nombre de pila debe ser de tipo string.",
          "string.empty": "El nombre de pila no puede estar vacío.",
          "string.min": "Cada nombre de pila debe tener como mínimo {#limit} caracteres.",
          "string.max": "Cada nombre de pila debe tener como máximo {#limit} caracteres.",
          "string.pattern.base": "Cada nombre de pila solo puede contener letras, espacios y apóstrofes.",
        })
    )
    .min(1)
    .max(3)
    .optional() // Opcional para actualización
    .messages({
      "array.base": "Los nombres de pila deben ser un arreglo.",
      "array.min": "Debes proporcionar al menos {#limit} nombre de pila si actualizas este campo.",
      "array.max": "Puedes proporcionar como máximo {#limit} nombres de pila.",
    }),

  apellidos: Joi.array()
    .items(
      Joi.string()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s']+$/)
        .messages({
          "string.base": "Cada apellido debe ser de tipo string.",
          "string.empty": "El apellido no puede estar vacío.",
          "string.min": "Cada apellido debe tener como mínimo {#limit} caracteres.",
          "string.max": "Cada apellido debe tener como máximo {#limit} caracteres.",
          "string.pattern.base": "Cada apellido solo puede contener letras, espacios y apóstrofes.",
        })
    )
    .min(1)
    .max(2)
    .optional() // Opcional para actualización
    .messages({
      "array.base": "Los apellidos deben ser un arreglo.",
      "array.min": "Debes proporcionar al menos {#limit} apellido si actualizas este campo.",
      "array.max": "Puedes proporcionar como máximo {#limit} apellidos.",
    }),

  rut: Joi.string()
    .min(9)
    .max(12)
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .optional()
    .messages({
      "string.empty": "El rut no puede estar vacío.",
      "string.base": "El rut debe ser de tipo string.",
      "string.min": "El rut debe tener como mínimo {#limit} caracteres.",
      "string.max": "El rut debe tener como máximo {#limit} caracteres.",
      "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
    }),

  email: Joi.string()
    .min(10)
    .max(255)
    .email({ tlds: { allow: false } })
    .custom(domainEmailValidator, "Validación dominio email")
    .optional()
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "string.base": "El correo electrónico debe ser de tipo string.",
      "string.email": "El formato del correo electrónico es inválido.",
      "string.min": "El correo electrónico debe tener como mínimo {#limit} caracteres.",
      "string.max": "El correo electrónico debe tener como máximo {#limit} caracteres.",
    }),

  password: Joi.string() // Contraseña actual, podría ser necesaria para cambiar email o contraseña
    .min(8)
    .max(100)
    .pattern(/^[a-zA-Z0-9@$!%*?&]+$/)
    .optional() // Opcional, puede que no siempre se requiera
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "string.base": "La contraseña debe ser de tipo string.",
      "string.min": "La contraseña debe tener como mínimo {#limit} caracteres.",
      "string.max": "La contraseña debe tener como máximo {#limit} caracteres.",
      "string.pattern.base": "La contraseña contiene caracteres no permitidos o no cumple con los requisitos de complejidad.",
    }),

  newPassword: Joi.string() // Nueva contraseña, solo si se va a cambiar
    .min(8)
    .max(100)
    .pattern(/^[a-zA-Z0-9@$!%*?&]+$/)
    .optional()
    .allow('') // Permitir vacío si no se quiere cambiar, o usar .when()
    .messages({
      "string.base": "La nueva contraseña debe ser de tipo string.",
      "string.min": "La nueva contraseña debe tener como mínimo {#limit} caracteres.",
      "string.max": "La nueva contraseña debe tener como máximo {#limit} caracteres.",
      "string.pattern.base": "La nueva contraseña contiene caracteres no permitidos o no cumple con los requisitos de complejidad.",
    }),

  rol: Joi.string()
    .min(3)
    .max(50)
    .optional()
    .messages({
      "string.base": "El rol debe ser de tipo string.",
      "string.min": "El rol debe tener como mínimo {#limit} caracteres.",
      "string.max": "El rol debe tener como máximo {#limit} caracteres.",
    }),

  activo: Joi.boolean()
    .optional()
    .messages({
        "boolean.base": "El campo activo debe ser un valor booleano (true/false)."
    })
})
.or( // Asegura que al menos uno de estos campos esté presente para una actualización
    "nombresPila",
    "apellidos",
    "rut",
    "email",
    "newPassword", // si se envía newPassword, probablemente password también debería ser requerido (lógica con .with o .and)
    "rol",
    "activo"
  )
.when(Joi.object({ newPassword: Joi.string().required().not('') }).unknown(), { // Si newPassword está presente y no vacío
    then: Joi.object({ password: Joi.string().required() }) // entonces password (actual) es requerido
})
.unknown(false)
.messages({
  "object.unknown": "No se permiten propiedades adicionales en la solicitud de actualización.",
  "object.missing": "Debes proporcionar al menos un campo para actualizar.",
  "object.with": "Si actualizas la contraseña, debes proporcionar tu contraseña actual.",
});


// Tu userQueryValidation (sin cambios significativos necesarios para nombresPila/apellidos, ya que no son comunes en queries)
export const userQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
  email: Joi.string()
    .min(10)
    .max(255)
    .email({ tlds: { allow: false } })
    .custom(domainEmailValidator, "Validación dominio email")
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "string.base": "El correo electrónico debe ser de tipo string.",
      "string.email": "El correo electrónico debe finalizar en @gmail.cl.", // Ajustar si es necesario
      "string.min": "El correo electrónico debe tener como mínimo {#limit} caracteres.",
      "string.max": "El correo electrónico debe tener como máximo {#limit} caracteres.",
    }),
    rut: Joi.string()
    .min(9)
    .max(12)
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .messages({
      "string.empty": "El rut no puede estar vacío.",
      "string.base": "El rut debe ser de tipo string.",
      "string.min": "El rut debe tener como mínimo {#limit} caracteres.",
      "string.max": "El rut debe tener como máximo {#limit} caracteres.",
      "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
    }),
})
  .or("id", "email", "rut")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales en los parámetros de consulta.",
    "object.missing": "Debes proporcionar al menos un parámetro de consulta: id, email o rut.",
  });