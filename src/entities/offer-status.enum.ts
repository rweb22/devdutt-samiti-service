/**
 * Offer Status Enum
 * Defines the status of a role offer
 */
export enum OfferStatus {
  /**
   * Offer is pending user response
   */
  PENDING = 'PENDING',

  /**
   * User accepted the offer
   */
  ACCEPTED = 'ACCEPTED',

  /**
   * User rejected the offer
   */
  REJECTED = 'REJECTED',

  /**
   * Offer expired without response
   */
  EXPIRED = 'EXPIRED',
}

