/**
 * Validates situational description input.
 * - Must be between 1 and 500 characters (inclusive)
 * - Must not be whitespace-only
 *
 * @returns { valid: true } or { valid: false, error: string }
 */
export function validateSituationInput(
  description: string
): { valid: true } | { valid: false; error: string } {
  if (!description || description.trim().length === 0) {
    return {
      valid: false,
      error: 'Please describe your situation. The input cannot be empty.',
    };
  }
  if (description.length > 500) {
    return {
      valid: false,
      error: 'Description must be 500 characters or fewer.',
    };
  }
  return { valid: true };
}
