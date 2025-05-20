
/**
 * Normaliza un string de RUT a un formato estándar (XXXXXXXXK).
 * Elimina puntos, guiones, y convierte a mayúsculas.
 * @param {string | null | undefined} rutString El RUT ingresado por el usuario.
 * @returns {string | null} El RUT normalizado en formato XXXXXXXXK, o null si no es válido o no se puede procesar.
 */
export function normalizeRut(rutString) {
  if (!rutString || typeof rutString !== 'string') {
    return null;
  }

  const cleanedRut = rutString.replace(/[^\dkK]/g, "").toUpperCase();

  if (cleanedRut.length < 2) {
    return null;
  }

  const bodyCandidate = cleanedRut.slice(0, -1);
  if (!/^\d+$/.test(bodyCandidate)) {
      return null;
  }

  return cleanedRut;
}

/**
 * Valida el Dígito Verificador (DV) de un RUT chileno.
 * Espera un RUT previamente normalizado (formato XXXXXXXXK).
 * @param {string | null | undefined} normalizedRut El RUT normalizado (ej: "12345678K").
 * @returns {boolean} True si el DV es correcto, false en caso contrario.
 */
export function validateRutDv(normalizedRut) {
  if (!normalizedRut || typeof normalizedRut !== 'string' || normalizedRut.length < 2) {
    return false;
  }

  const body = normalizedRut.slice(0, -1);
  const dvProvided = normalizedRut.slice(-1);

  if (!/^\d+$/.test(body) || !/^[\dkK]$/.test(dvProvided)) {
    return false;
  }

  let M = 0;
  let S = 1;
  for (let i = body.length - 1; i >= 0; i--) {
    S = (S + parseInt(body.charAt(i), 10) * (M % 6 + 2)) % 11;
    M++;
  }

  const dvCalculated = (S > 0) ? String(S - 1) : "K";

  return dvCalculated === dvProvided;
}