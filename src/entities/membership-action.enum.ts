/**
 * Membership Action Enum
 * Defines the types of membership changes that can occur
 */
export enum MembershipAction {
  /**
   * User was appointed to a role
   */
  APPOINTED = 'APPOINTED',

  /**
   * User was promoted to a higher role
   */
  PROMOTED = 'PROMOTED',

  /**
   * User was removed from the Samiti
   */
  REMOVED = 'REMOVED',
}

