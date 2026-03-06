/**
 * NCM Status Enum
 * Defines the status of a No Confidence Motion
 */
export enum NcmStatus {
  /**
   * COLLECTING_SIGNATURES - Motion initiated, collecting signatures
   */
  COLLECTING_SIGNATURES = 'COLLECTING_SIGNATURES',

  /**
   * VOTING - Signature threshold met, voting in progress
   */
  VOTING = 'VOTING',

  /**
   * PASSED - Motion passed, sabhapati removed
   */
  PASSED = 'PASSED',

  /**
   * FAILED - Motion failed (insufficient signatures or votes)
   */
  FAILED = 'FAILED',
}

