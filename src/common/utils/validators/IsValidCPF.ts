import { ERRORS } from '../constants/errors';

/* eslint-disable @typescript-eslint/no-unused-vars */
function validCPF(document: string): boolean {
  let sum: number;
  let remainder: number;
  sum = 0;

  if (document.length !== 11) return false;

  if (document === '00000000000') return false;

  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(document.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(document.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(document.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(document.substring(10, 11))) return false;

  return true;
}

export function isValidCPF(document: string): boolean {
  const isValid = validCPF(document);

  if (!isValid) throw ERRORS.UTILS.INVALID_DOCUMENT;

  return isValid;
}
