import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

/**
 * NCM Signature Entity
 * Represents a member's signature on a No Confidence Motion
 */
@Entity({ name: 'ncm_signatures', schema: 'samiti' })
export class NcmSignature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ncm_motion_id', type: 'uuid', nullable: false })
  ncmMotionId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  username: string;

  @CreateDateColumn({ name: 'signed_at', type: 'timestamp with time zone' })
  signedAt: Date;
}

