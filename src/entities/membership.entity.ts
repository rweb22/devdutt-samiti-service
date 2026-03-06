import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { SamitiRole } from './samiti-role.enum';

/**
 * Membership Entity
 * Represents a user's membership in a Samiti with a specific role
 */
@Entity({ name: 'memberships', schema: 'samiti' })
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  username: string;

  @Column({ name: 'samiti_id', type: 'uuid', nullable: false })
  samitiId: string;

  @Column({ type: 'enum', enum: SamitiRole, nullable: false })
  role: SamitiRole;

  @CreateDateColumn({ name: 'joined_at', type: 'timestamp with time zone' })
  joinedAt: Date;

  @Column({ name: 'ended_at', type: 'timestamp with time zone', nullable: true })
  endedAt: Date | null;

  /**
   * Check if this membership is currently active (not ended)
   */
  isActive(): boolean {
    return this.endedAt === null;
  }

  /**
   * Static factory method to create a new Membership
   */
  static create(username: string, samitiId: string, role: SamitiRole): Membership {
    const membership = new Membership();
    membership.username = username;
    membership.samitiId = samitiId;
    membership.role = role;
    return membership;
  }
}

