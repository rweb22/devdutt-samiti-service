import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { SamitiRole } from './samiti-role.enum';
import { MembershipAction } from './membership-action.enum';

/**
 * Membership Change Entity
 * Audit trail for all membership changes in a Samiti
 */
@Entity({ name: 'membership_changes', schema: 'samiti' })
export class MembershipChange {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  username: string;

  @Column({ name: 'samiti_id', type: 'uuid', nullable: false })
  samitiId: string;

  @Column({ name: 'from_role', type: 'enum', enum: SamitiRole, nullable: true })
  fromRole: SamitiRole | null;

  @Column({ name: 'to_role', type: 'enum', enum: SamitiRole, nullable: true })
  toRole: SamitiRole | null;

  @Column({ type: 'enum', enum: MembershipAction, nullable: false })
  action: MembershipAction;

  @Column({ name: 'changed_by_username', type: 'varchar', length: 50, nullable: false })
  changedByUsername: string;

  @Column({ type: 'text', nullable: true })
  justification: string | null;

  @CreateDateColumn({ name: 'changed_at', type: 'timestamp with time zone' })
  changedAt: Date;
}

