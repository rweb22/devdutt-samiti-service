import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { LeadershipStatus } from './leadership-status.enum';
import { MandateData } from './mandate-data.interface';

/**
 * Samiti Entity
 * Represents a governance unit in the hierarchy
 * Uses PostgreSQL LTREE for efficient hierarchical queries
 * Path is auto-computed by database trigger based on name and parent_id
 */
@Entity({ name: 'samitis', schema: 'samiti' })
export class Samiti {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  /**
   * LTREE path for hierarchical queries
   * Auto-computed by database trigger on insert/update
   * Format: parent_path.normalized_name (e.g., "national_samiti.economy")
   */
  @Column({
    type: 'ltree',
    nullable: false,
    insert: false,
    update: false,
  })
  path: string;

  /**
   * Human-readable title (optional)
   * Distinct from name which is used for path computation
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId: string | null;

  @Column({ name: 'sabhapati_username', type: 'varchar', length: 50, nullable: true })
  sabhapatiUsername: string | null;

  /**
   * Leadership status: ACTIVE (has Sabhapati) or VACANT (awaiting replacement)
   */
  @Column({
    name: 'leadership_status',
    type: 'enum',
    enum: LeadershipStatus,
    default: LeadershipStatus.ACTIVE,
  })
  leadershipStatus: LeadershipStatus;

  /**
   * Timestamp when the leadership became vacant (null when ACTIVE)
   */
  @Column({ name: 'vacant_since', type: 'timestamp with time zone', nullable: true })
  vacantSince: Date | null;

  /**
   * Mandate/mission statement stored as JSONB
   * Contains content, createdBy, createdAt, updatedAt
   */
  @Column({ type: 'jsonb', nullable: true })
  mandate: MandateData | null;

  /**
   * User who created this Samiti
   */
  @Column({ name: 'created_by_username', type: 'varchar', length: 50, nullable: true })
  createdByUsername: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  /**
   * Check if this is a root Samiti (no parent)
   */
  isRoot(): boolean {
    return this.parentId === null;
  }

  /**
   * Check if this Samiti has active leadership
   */
  hasActiveLeadership(): boolean {
    return this.leadershipStatus === LeadershipStatus.ACTIVE && this.sabhapatiUsername !== null;
  }

  /**
   * Get the depth of this Samiti in the hierarchy
   * Root is depth 1, its children are depth 2, etc.
   */
  getDepth(): number {
    if (!this.path) return 0;
    return this.path.split('.').length;
  }
}

