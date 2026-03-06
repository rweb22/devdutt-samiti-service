/**
 * Mandate Data Interface
 * Represents the mission/purpose statement of a Samiti
 * Stored as JSONB in the database
 */
export interface MandateData {
  /**
   * The mandate content (sanitized HTML)
   */
  content: string;

  /**
   * Username of the person who created the mandate
   */
  createdBy: string;

  /**
   * When the mandate was created
   */
  createdAt: Date;

  /**
   * When the mandate was last updated
   */
  updatedAt: Date;
}

