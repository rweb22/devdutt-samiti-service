import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OfferStatus } from './offer-status.enum';

/**
 * Samiti Role Offer Entity
 * Represents an offer for a user to take a role in a Samiti
 */
@Entity({ name: 'samiti_role_offers', schema: 'samiti' })
export class SamitiRoleOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'offered_to_username', type: 'varchar', length: 50, nullable: false })
  offeredToUsername: string;

  @Column({ name: 'platform_role', type: 'varchar', length: 50, nullable: false })
  platformRole: string;

  @Column({ name: 'samiti_id', type: 'uuid', nullable: true })
  samitiId: string | null;

  @Column({ name: 'offered_by_username', type: 'varchar', length: 50, nullable: false })
  offeredByUsername: string;

  @Column({ type: 'text', nullable: true })
  justification: string | null;

  @Column({ type: 'enum', enum: OfferStatus, default: OfferStatus.PENDING })
  status: OfferStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ name: 'responded_at', type: 'timestamp with time zone', nullable: true })
  respondedAt: Date | null;
}

