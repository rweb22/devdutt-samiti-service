/**
 * Samiti Role Enum
 * Defines the roles a user can have in a Samiti
 */
export enum SamitiRole {
  /**
   * Observer - Can view, limited participation
   */
  OBSERVER = 'OBSERVER',

  /**
   * Sadasya - Full member, can participate
   */
  SADASYA = 'SADASYA',

  /**
   * Sabhapati - Leader, can create child samitis and appoint members
   */
  SABHAPATI = 'SABHAPATI',
}

